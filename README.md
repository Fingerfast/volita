# Volita

React/Next.js frontend aktuální nástěnky.

## Spuštění
Node >=22.13.0. Použijte pnpm verzi z packageManager.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

## GitHub a Vercel
Nahrajte obsah této složky do Fingerfast/volita. Ve Vercelu importujte GitHub repozitář, produkční větev main. Nastavení vercel.json určuje statický výstup out a proxy API.

Data zůstávají na Cloudflare D1 a obrázky na R2. Vercel proxy /api/posts a /api/images/* používá současný veřejný backend. Frontend nepotřebuje databázové klíče. Backend musí zůstat dostupný na uvedené adrese.

Lokální next dev nemá Vercel proxy: pro přístup k API použijte Vercel dev nebo lokální proxy.

cloudflare-backend obsahuje kompletní původní zdroje včetně migrací a endpointů. Nenasazuje se ve Vercelu; změny backendu vyžadují samostatné Cloudflare nasazení. Změny frontendu se po Git propojení nasadí z main automaticky.

## Nahrání do připraveného repozitáře

Rozbalte ZIP a otevřete terminál ve složce volita. Pokud repozitář už obsahuje soubory, nejprve jej naklonujte a obsah balíčku zkopírujte do klonu; neprovádějte force push. Pro prázdný repozitář:

```sh
git init
git branch -M main
git add .
git commit -m "Initial Volita application"
git remote add origin https://github.com/Fingerfast/volita.git
git push -u origin main
```

Přihlášení dokončete místně ve svém počítači. Přihlašovací údaje a tokeny nesdílejte do chatu.

## Import ve Vercelu

1. Otevřete svůj Vercel účet, Add New → Project.
2. Připojte GitHub účet k Vercelu a vyberte Fingerfast/volita.
3. Název projektu: volita. Root Directory: kořen repozitáře.
4. Konfigurace v vercel.json: build npm run build, výstup out.
5. Klikněte Deploy. Po úspěchu použijte skutečně přidělenou adresu .vercel.app.
6. Další push do produkční větve main spouští nové nasazení.

Původní veřejná aplikace nadále funguje na https://tymova-nastenka.janik-int.chatgpt.site. Tento balíček není potvrzením nahrání do GitHubu ani nasazení Vercelu.

## Ověření

Frontend byl sestaven jako Next.js statický export. Na Vercelu po nasazení ověřte vytvoření příspěvku, změnu stavu a nahrání screenshotu přes externí proxy; nasazení ani tuto proxy zatím nebylo možné otestovat.
