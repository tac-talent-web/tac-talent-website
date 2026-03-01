# TAC Website — Patch Task

Voer de volgende aanpassingen door in de bestaande codebase. Wees precies.

## 1. Hero stats (page.tsx)
Vervang de stats array:
- "< 5" / "werkdagen tot voordracht" → "< 14" / "werkdagen tot eerste kandidaat"
- "Tech + Persoonlijk" / "onze aanpak" → "Persoonlijk" / "onze aanpak"
(De andere twee stats blijven: "30" / "dagen garantie" en "No cure" / "no pay")

## 2. Klantlogo's (page.tsx)
Vervang de tekst-gebaseerde klantlogo's door echte <img> tags.
De afbeeldingen staan in /public/:
- logo-vortex.webp
- logo-kroon.webp
- logo-staalwerk.webp
- logo-meridian.webp
- logo-nordvik.webp
- logo-atlas.webp

Vervang de huidige logo items (div met tekst) door:
```tsx
<img src="/logo-vortex.webp" alt="Vortex Industries" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
```
Doe dit voor alle 6 logo's. Pas height en opacity aan zodat ze er netjes uitzien in de balk.

## 3. Consultant foto's (page.tsx EN over-ons/page.tsx)
De consultant kaarten hebben nu placeholder gradients. Vervang die door echte foto's.
Foto's staan in /public/:
- consultant-sophie.webp → Sophie van den Berg
- consultant-daan.webp → Daan Hoekstra
- consultant-lena.webp → Lena Martens

In de consultant kaart: vervang de placeholder div door:
```tsx
<img src="/consultant-sophie.webp" alt="Sophie van den Berg" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", objectPosition: "center top", borderRadius: 12 }} />
```
Doe dit voor alle 3 consultants op beide pagina's (page.tsx en over-ons/page.tsx).

## 4. Garantie vinkjes: groen → oranje/rood (page.tsx)
Zoek de garantie sectie. De checkmark items hebben een groene achtergrond (sage: #B4CA80) met teal tekst.
Verander dit naar: background: #EC5C3B (TAC rood), tekst/vinkje: #FFFFFF (wit).

## 5. LinkedIn en contactgegevens verwijderen (ALLE pagina's)
- Verwijder overal linkedin.com vermeldingen
- Verwijder overal "Email: info@tac-talent.nl" en andere directe contactgegevens uit de zichtbare UI
- In de contact sectie (page.tsx) en contact/page.tsx: ALLEEN het formulier tonen, geen apart email/LinkedIn blok
- In de footer: verwijder de email en LinkedIn links als die er staan
- Het formulier is de ENIGE manier om contact op te nemen

## 6. Adres toevoegen
Voeg het volgende adres toe aan:
- Footer (onderaan, bij copyright regel of in een apart kolom)
- Contact pagina (contact/page.tsx) — boven het formulier of links naast het formulier

Adres:
```
TAC — Talent Acquisition Company
Stationsplein 12
7511 JD Enschede
```

## 7. Over-ons consultant foto's
Zorg dat over-ons/page.tsx ook de echte consultant foto's gebruikt (zelfde als punt 3).

## Na voltooiing
Run `npm run build`. Als het slaagt: `openclaw system event --text "Done: TAC patch complete" --mode now`
