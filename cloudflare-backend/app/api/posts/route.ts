import { database } from "@/db/raw";
import { env } from "cloudflare:workers";
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
const clean=(v:unknown)=>typeof v==="string"?v.trim():"";
const decode=(p:any)=>({...p,attachments:JSON.parse(p.attachments || "[]")});
export async function GET(){try{const r=await database().prepare("SELECT * FROM posts ORDER BY created DESC").all();return json(r.results.map(decode));}catch(e){console.error(e);return json({error:"Příspěvky se nepodařilo načíst. Zkuste to znovu."},503)}}
export async function POST(request:Request){
 const keys:string[]=[];
 try{
 if(Number(request.headers.get("content-length") || 0)>27*1024*1024)return json({error:"Přílohy jsou příliš velké."},413);
 let data:Record<string,unknown>,files:File[]=[];
 if(request.headers.get("content-type")?.includes("multipart/form-data")){const form=await request.formData();data=Object.fromEntries(form.entries());files=form.getAll("images").filter((v):v is File=>typeof v!=="string" && v.size>0)}else data=await request.json() as Record<string,unknown>;
 const author=clean(data.author),body=clean(data.body),title=clean(data.title),url=clean(data.url),category=clean(data.category),priority=clean(data.priority)||"medium",effort=clean(data.effort)||"unknown";
 if(!author || author.length>80 || !body || body.length>5000 || !title || title.length>140 || !["nice","warning","error"].includes(category) || !["low","medium","high"].includes(priority) || !["unknown","small","medium","large"].includes(effort))return json({error:"Zkontrolujte autora, název, popis a vybrané hodnoty."},400);
 if(url){try{const u=new URL(url);if(!["https:","http:"].includes(u.protocol)||url.length>2000)throw Error()}catch{return json({error:"Odkaz musí začínat https:// nebo http://."},400)}}
 if(files.length>5 || files.some(f=>f.size>5*1024*1024) || files.reduce((n,f)=>n+f.size,0)>20*1024*1024)return json({error:"Přiložte nejvýše 5 obrázků, každý do 5 MB a celkem do 20 MB."},400);
 const verified:{file:File;bytes:ArrayBuffer;type:string;ext:string}[]=[];
 for(const file of files){const bytes=await file.arrayBuffer(),b=new Uint8Array(bytes);let type="",ext="";
 if(b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71&&b[4]===13&&b[5]===10&&b[6]===26&&b[7]===10){type="image/png";ext="png"}
 else if(b[0]===255&&b[1]===216&&b[2]===255){type="image/jpeg";ext="jpg"}
 else if(String.fromCharCode(...b.slice(0,4))==="RIFF"&&String.fromCharCode(...b.slice(8,12))==="WEBP"){type="image/webp";ext="webp"}
 if(!type)return json({error:"Podporujeme pouze obrázky PNG, JPG a WebP."},400);verified.push({file,bytes,type,ext})}
 const id=crypto.randomUUID(),attachments=[];
 for(const v of verified){if(!env.BUCKET)throw Error("Bucket unavailable");const key=`${id}/${crypto.randomUUID()}.${v.ext}`;keys.push(key);await env.BUCKET.put(key,v.bytes,{httpMetadata:{contentType:v.type}});attachments.push({key,name:v.file.name.slice(0,180),url:`/api/images/${key}`})}
 const post={id,author,body,title,url,category,priority,effort,format:"markdown",attachments,status:"new",created:Date.now()};
 await database().prepare("INSERT INTO posts (id,author,body,category,status,created,title,priority,effort,url,format,attachments) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,author,body,category,"new",post.created,title,priority,effort,url,"markdown",JSON.stringify(attachments)).run();return json(post,201);
 }catch(e){console.error(e);if(keys.length&&env.BUCKET)await env.BUCKET.delete(keys).catch(console.error);return json({error:"Uložení se nepodařilo. Text i přílohy zůstávají ve formuláři."},503)}
}
export async function PATCH(request:Request){try{const data=await request.json() as Record<string,unknown>;if(typeof data.id!=="string")return json({error:"Neplatný příspěvek."},400);
 const fields:string[]=[],values:string[]=[];const allowed:Record<string,string[]>={status:["new","progress","done"],priority:["low","medium","high"],effort:["unknown","small","medium","large"]};
 for(const field of Object.keys(allowed)){if(data[field]!==undefined){if(!allowed[field].includes(String(data[field])))return json({error:"Neplatná hodnota."},400);fields.push(`${field}=?`);values.push(String(data[field]))}}
 if(!fields.length)return json({error:"Chybí změna."},400);
 const r=await database().prepare(`UPDATE posts SET ${fields.join(",")} WHERE id=? RETURNING *`).bind(...values,data.id).first();return r?json(decode(r)):json({error:"Příspěvek nebyl nalezen."},404)
 }catch(e){console.error(e);return json({error:"Změnu se nepodařilo uložit."},503)}}
