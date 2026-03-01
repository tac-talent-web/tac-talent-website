# TAC Website — Full Restructure Task

## Overzicht
Volledige redesign van de TAC recruitment website. Hieronder staat ALLES wat gebouwd moet worden. Voer het volledig en correct uit.

## Tech Stack
- Next.js 14 App Router, TypeScript, inline styles only (geen Tailwind, geen CSS modules)
- Bestaande kleuren: licorice #111111, red #EC5C3B, gainsboro #D9DBD9, sage #B4CA80, teal #10242F, white #FFFFFF, offwhite #F5F5F4, muted #6B7178
- Fonts: Bricolage Grotesque (headings), Inter (body)
- Foto's in /public: hero.webp, service1.webp, service2.webp, team.webp
- Mobile responsive via useWindowWidth hook (al aanwezig in page.tsx)

---

## GLOBALE WIJZIGING: 90 dagen → 30 dagen
Vervang OVERAL op de site "90" door "30" waar het gaat over de garantie.

---

## HOMEPAGE (src/app/page.tsx)

### Sectievolgorde (definitief):
1. Navigatie (sticky)
2. Hero
3. Klantlogo's
4. Diensten
5. Fotoband
6. Expertise
7. Consultants
8. Garantie
9. Over TAC (kort blok met link)
10. Contact (formulier)
11. Footer

### Hero stats aanpassen:
- Stat 1: **30** / "dagen garantie"
- Stat 2: **No cure** / "no pay"
- Stat 3: **< 5** / "werkdagen tot voordracht"
- Stat 4: **Tech + Persoonlijk** / "onze aanpak"

### Klantlogo's sectie:
Vervang de "Bedrijf A t/m F" placeholders door 6 fictieve industriële bedrijfsnamen met SVG logo's:
- 4 puur typografisch (alleen naam, monochroom #999999, bold industrial font)
- 2 met een simpel abstract technisch SVG symbool + naam
Namen: "Vortex Industries", "Kroon Engineering", "Staalwerk Group", "Meridian Technical", "Nordvik Systems", "Atlas Constructie"
Kleur: #A0A0A0, hover naar #666666
Stijl: uppercase of mixed caps, industrieel, zelfverzekerd

### Diensten sectie:
- Maak W&S kaart prominenter: voeg "Meest gekozen" badge toe (rode pill label bovenaan de kaart)
- Voeg per kaart onderaan een CTA toe: "Meer informatie →" als rode ghost link
- Garantie in W&S: "30 dagen plaatsingsgarantie"

### Fotoband (NIEUW):
Voeg een edge-to-edge fotoband toe tussen Diensten en Expertise:
- 3 foto's naast elkaar, geen gap, volle breedte (100vw), overflow hidden
- Foto 1: /service1.webp (aspect 4:3)
- Foto 2: /hero.webp (aspect 4:3)  
- Foto 3: /service2.webp (aspect 4:3)
- Geen tekst, geen padding, gewoon foto's edge-to-edge
- Hoogte: 280px desktop, 180px mobiel

### Expertise sectie (NIEUW — vervangt de oude garantie op die plek):
Achtergrond: offwhite (#F5F5F4)
Label: "ONZE EXPERTISE"
H2: "Wij weten waar u naar zoekt."
4 blokken in 2×2 grid (1 kolom op mobiel):

**01 — Sectorkennis**
Wij investeren continu in kennis van de technische arbeidsmarkt. Welke functies zijn het moeilijkst in te vullen? Wat verwachten kandidaten? Welke regio's zijn het krapst? Die kennis delen wij actief met onze opdrachtgevers — ook als daar geen directe opdracht achter zit.

**02 — Technologie**
Onze matching-technologie scant de markt continu en koppelt vacatures aan geselecteerde kandidaten. Dit betekent dat wij sneller relevante profielen kunnen presenteren dan traditionele bureaus. De technologie doet het zoekwerk — onze consultants doen het denkwerk.

**03 — Resultaatgedreven**
Wij werken op basis van no cure, no pay. Geen abonnement, geen zoekkosten, geen factuur tenzij er een succesvolle plaatsing is. Met 30 dagen garantie op elke plaatsing. Uw belang is ons belang.

**04 — Persoonlijke aanpak**
Achter elke vacature zit een organisatie met eigen cultuur, uitdagingen en ambities. Onze consultants nemen de tijd om uw situatie te begrijpen en adviseren op basis van feiten, niet aannames. U werkt met één vast aanspreekpunt — van eerste gesprek tot na de plaatsing.

Kaart stijl: witte kaart, border 1px gainsboro, border-radius 12, padding 32px. Nummer (01-04) in grote muted kleur linksboven als achtergrond accent.

### Consultants sectie (NIEUW):
Achtergrond: wit
Label: "MAAK KENNIS MET ONS TEAM"
H2: "Onze consultants maken het verschil."
Intro: Bij TAC werkt u samen met ervaren consultants die de technische arbeidsmarkt van binnen en buiten kennen. Zij zijn uw vaste aanspreekpunt — van intake tot plaatsing en daarna.

3 consultant kaarten in een rij (1 kolom mobiel):
- Portretfoto placeholder (1:1 ratio, afgerond, donker grijs gradient als placeholder)
- Naam (bold)
- Functietitel (muted, smaller)
- Bio: 2 zinnen

Consultants:
1. **Sophie van den Berg** | Senior Consultant W&S | Sophie heeft 8 jaar ervaring in technische werving. Zij is gespecialiseerd in machinebouw en installatietechniek en staat bekend om haar directe communicatie.
2. **Daan Hoekstra** | Consultant Interim | Daan werkt dagelijks met opdrachtgevers die snel iemand nodig hebben. Zijn netwerk van direct beschikbare technici maakt hem de aangewezen persoon voor urgente opdrachten.
3. **Lena Martens** | Consultant Advies | Lena combineert marktdata met praktijkervaring om opdrachtgevers eerlijk advies te geven. Zij helpt ook bij het schrijven van vacatureteksten die wél de juiste kandidaten trekken.

### Garantie sectie:
- H2: "30 dagen zekerheid op elke plaatsing."
- Intro: Wij geloven in de kwaliteit van onze matches. Daarom bieden wij op elke plaatsing een garantie van 30 dagen. Vertrekt de kandidaat? Dan leveren wij kosteloos een vervanger of restitueren wij de volledige fee.
- Punt 1: "Volledige garantieperiode gedekt" — 30 dagen. U loopt geen risico.
- Punt 2: "Gratis vervanging" — Past het niet? Wij zoeken een nieuwe kandidaat. Zonder extra kosten.
- Punt 3: "Of volledige restitutie" — Geen geschikte vervanger? Dan krijgt u de fee terug.

### Over TAC blok (NIEUW — kort, homepage):
Achtergrond: wit
Label: "OVER TAC"
H2: "Werving die werkt, zonder gedoe."
Tekst (2 zinnen): TAC is opgericht vanuit de overtuiging dat werving in de technische sector beter kan. Sneller, eerlijker en met meer kennis van de markt.
CTA knop: "Lees meer over ons →" die linkt naar /over-ons

### Contact sectie:
- Verwijder de DUBBELE contact sectie — zorg dat contact maar ÉÉN keer voorkomt op de homepage
- Verwijder "Telefoon" uit de contactgegevens
- Email: info@tac-talent.nl
- LinkedIn: linkedin.com/company/tac-talent
- Formulier: naam, bedrijf, email, telefoon, bericht — maak dit ECHTE <input> en <textarea> elementen met correcte styling (niet de static div placeholders)
- Formulier submit: POST naar /api/lead
- Success state: toon "Bedankt! Wij nemen binnen één werkdag contact op."
- Error state: toon het foutbericht in rood

---

## PAGINA'S (nieuwe bestanden)

### src/app/diensten/page.tsx
H1: Onze diensten
Intro: Of u nu één positie wilt invullen, tijdelijk extra capaciteit nodig heeft, of advies wilt over uw wervingsstrategie — onze consultants staan klaar. Wij bieden drie diensten die we aanpassen aan uw situatie.

Drie blokken (afwisselend: foto links/rechts):

**Dienst 1 — Werving & Selectie**
Foto: /service1.webp (16:10)
Tekst: Zoekt u een ervaren technisch professional voor een vaste positie? Onze consultants kennen de markt en weten waar het juiste talent te vinden is. Wij presenteren een selectie van zorgvuldig geselecteerde kandidaten die passen bij uw organisatie, zodat u snel en met vertrouwen kunt beslissen.
Kenmerken (rode bullets):
- Persoonlijke intake en vacature-analyse
- Zorgvuldig geselecteerde kandidaten binnen werkdagen
- 30 dagen plaatsingsgarantie
- Eén vast aanspreekpunt gedurende het hele proces
CTA: "Neem contact op over Werving & Selectie" → /contact

**Dienst 2 — Interim & Tijdelijke Inzet**
Foto: /service2.webp (16:10)
Tekst: Heeft u op korte termijn extra capaciteit nodig? Wij beschikken over een netwerk van direct beschikbare professionals die snel inzetbaar zijn bij uw organisatie. Van een paar weken tot meerdere maanden — wij regelen het.
Kenmerken:
- Direct beschikbare vakmensen
- Flexibele contractvormen
- Persoonlijke begeleiding gedurende de opdracht
- Snel schakelen bij piekperiodes
CTA: "Neem contact op over Interim" → /contact

**Dienst 3 — Advies & Marktinzicht**
Foto: /team.webp (16:10)
Tekst: Niet zeker waar te beginnen? Onze consultants adviseren u over de huidige arbeidsmarkt, realistische verwachtingen en de beste aanpak voor uw specifieke situatie. Eerlijk en onafhankelijk — ook als het antwoord niet is wat u verwacht.
Kenmerken:
- Arbeidsmarktanalyse voor uw regio
- Salarisadvies op basis van actuele data
- Advies over vacaturetekst en positionering
- Eerlijke feedback over haalbaarheid
CTA: "Neem contact op over Advies" → /contact

### src/app/expertise/page.tsx
Gebruik exact de content uit de Expertise sectie hierboven, maar dan als volledige pagina met:
- Eigen nav + footer (kopieer van homepage)
- Dezelfde 4 blokken
- CTA onderaan: "Neem contact op met onze consultants" → /contact

### src/app/over-ons/page.tsx
H1: Over TAC
Layout: 2 kolommen (tekst 1.3fr, foto 1fr — 4:5 verhouding met /hero.webp), stacked op mobiel

Tekst:
TAC is opgericht vanuit de overtuiging dat werving in de technische sector beter kan. Sneller, eerlijker en met meer kennis van de markt. Wij combineren de persoonlijke aanpak van een gespecialiseerd bureau met de snelheid van moderne technologie. Het resultaat: relevante kandidaten, eerlijk advies en een partner die meedenkt met uw organisatie.

Wij geloven niet in eindeloze CV-rondjes of vage beloftes. Wij geloven in zorgvuldige selectie, eerlijke communicatie en een werkwijze waar u op kunt bouwen.

3 kernwaarden (3 kolommen, border-top stijl):
- Technologie als voorsprong
- Resultaat als verdienmodel
- Partnerschap als werkwijze

Consultants blok: zelfde als homepage consultants sectie

CTA: "Neem contact op" → /contact

### src/app/contact/page.tsx
H1: Neem contact op
Intro: Of u nu een concrete vacature heeft of gewoon wilt weten wat de mogelijkheden zijn — wij denken graag met u mee. Geheel vrijblijvend.

Layout: 2 kolommen (links info, rechts formulier), stacked op mobiel

Links:
- Email: info@tac-talent.nl
- LinkedIn: linkedin.com/company/tac-talent
- Geen telefoonnummer

Rechts: volledig werkend formulier met echte inputs, POST naar /api/lead, success/error states

---

## NAVIGATIE
Nav links moeten werken:
- "Diensten" → /diensten
- "Expertise" → /expertise
- "Over ons" → /over-ons
- "Contact" → /contact
- Logo → /

Hamburger menu op mobiel (al aanwezig) moet ook naar deze pagina's linken.

---

## GEDEELDE COMPONENTEN
Zet Nav en Footer in aparte componenten die hergebruikt worden op alle pagina's:
- src/app/components/Nav.tsx
- src/app/components/Footer.tsx

Importeer deze in page.tsx en alle subpagina's.

---

## FOOTER
Voeg toe aan footer navigatie: Diensten, Expertise, Over ons, Contact als werkende links.
Verander "90 dagen" in footer beschrijving naar "30 dagen".

---

## BELANGRIJK
- Geen Tailwind, geen externe CSS libraries
- Alleen inline styles + useWindowWidth hook voor responsive
- Alle content exact zoals beschreven hierboven
- Na voltooiing: run `npm run build` om te checken of er geen errors zijn
- Als de build slaagt: run `openclaw system event --text "Done: TAC full restructure complete" --mode now`
