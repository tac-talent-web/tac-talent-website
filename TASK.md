# TAC Talent Website — Build Task

## Doel
Bouw een volledige Next.js (App Router) website voor TAC — Talent Acquisition Company en deploy op Vercel.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Inline styles (geen CSS frameworks)
- Minimale dependencies

## Stap 1 — Project setup
Run in deze directory:
```
npx create-next-app@latest . --typescript --app --no-tailwind --no-eslint --src-dir --import-alias "@/*" --yes
```

## Stap 2 — Homepage
Vervang `src/app/page.tsx` met de homepage code uit `HOMEPAGE.tsx` in deze folder.
Voeg `'use client';` toe als eerste regel.

## Stap 3 — Root layout (`src/app/layout.tsx`)
- title: "TAC — Talent Acquisition Company"
- description: "Specialist in het vinden van technisch personeel. No cure, no pay. 90 dagen garantie."
- Voeg Google Fonts link toe voor Bricolage Grotesque + Inter
- body: geen margin/padding

## Stap 4 — Contact API route (`src/app/api/lead/route.ts`)
POST endpoint:
- Valideer: full_name, email, message (required)
- Honeypot: als `website` field gevuld → return 200 stil
- Rate limiting: in-memory, max 3 req per IP per 10 min
- Console.log de lead data (Google Sheets integratie later)
- Return: `{ success: true }` of `{ error: "..." }`

## Stap 5 — Vercel deploy
1. `npm install -g vercel` als niet geïnstalleerd
2. Maak nieuw Vercel account aan:
   - Gebruik `vercel login --github` NIET
   - Gebruik email signup via `vercel` CLI interactive flow
   - Email: gebruik tac-talent-vercel@proton.me (tijdelijk, Anouar krijgt de credentials)
   - Sla gegenereerde credentials op in C:\Users\pro-r\.openclaw\workspace\tac-credentials-temp.txt (TIJDELIJK, wordt via email verstuurd)
3. `vercel --yes --prod`
4. Noteer de deployment URL

## Stap 6 — Output
Schrijf resultaat naar `C:\Users\pro-r\.openclaw\workspace\tac-build-result.json`:
```json
{
  "status": "success",
  "vercelUrl": "...",
  "vercelProjectId": "...",
  "notes": "..."
}
```

## Notificatie na voltooiing
```
openclaw system event --text "Phase 1 done: TAC website deployed on Vercel" --mode now
```
