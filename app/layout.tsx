import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Týmová nástěnka",description:"Společné místo pro nápady, připomínky a chyby aplikace.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {return <html lang="cs"><body>{children}</body></html>}
