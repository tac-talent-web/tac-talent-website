# Google Sheets Vacature Template

## Instructies voor het team

Gebruik dit Google Sheet als CMS voor de vacatures op de TAC-website.
De website leest automatisch elke 5 minuten de vacatures uit het sheet.

---

## Stap 1 — Sheet aanmaken

1. Ga naar [Google Sheets](https://sheets.google.com) en maak een nieuw spreadsheet aan.
2. Hernoem het tabblad (onderaan) naar: `Vacatures`
3. Stel het sheet in op **Openbaar (iedereen met de link kan lezen)**.

---

## Stap 2 — Kolomstructuur (rij 1 = headers)

Zet in **rij 1** de volgende kopteksten (exact in deze volgorde):

| Kolom | Koptekst (rij 1) | Beschrijving |
|-------|-----------------|--------------|
| A | titel | Functietitel (bijv. "Servicemonteur Automotive") |
| B | locatie | Stad (bijv. "Eindhoven") |
| C | contracttype | FULL_TIME / PART_TIME / CONTRACT |
| D | categorie | Techniek / Automotive / Productie / Logistiek / etc. |
| E | beschrijving | Volledige vacaturetekst (mag newlines bevatten) |
| F | vereisten | Komma-gescheiden lijst (bijv. "MBO diploma, 2 jaar ervaring, Rijbewijs B") |
| G | salaris | Optioneel (bijv. "€2.800 – €3.400 per maand") |
| H | remote | ja / nee |
| I | datum_geplaatst | ISO datum (bijv. "2026-03-01") |
| J | geldig_tot | ISO datum (bijv. "2026-06-01") |

---

## Stap 3 — Voorbeeld vacature (rij 2)

| Kolom | Waarde |
|-------|--------|
| A (titel) | Servicemonteur Automotive |
| B (locatie) | Eindhoven |
| C (contracttype) | FULL_TIME |
| D (categorie) | Automotive |
| E (beschrijving) | Ben jij een ervaren Servicemonteur Automotive? Wij zoeken een gemotiveerde monteur.\n\n**Wat ga je doen?**\n- Onderhoud en reparaties aan voertuigen\n- Diagnosticeren van storingen\n- Klantcontact over technische bevindingen |
| F (vereisten) | MBO Autotechniek, Minimaal 2 jaar werkervaring, Rijbewijs B |
| G (salaris) | €2.800 – €3.600 per maand |
| H (remote) | nee |
| I (datum_geplaatst) | 2026-03-01 |
| J (geldig_tot) | 2026-06-01 |

---

## Stap 4 — Sheet ID ophalen

De Sheet ID staat in de URL van het Google Sheet:

```
https://docs.google.com/spreadsheets/d/**[SHEET_ID]**/edit
```

Kopieer de ID en stel in als omgevingsvariabele:

```
GOOGLE_SHEET_ID=jouw-sheet-id-hier
```

---

## Contracttype waarden

Gebruik exact één van deze waarden in kolom C:

| Waarde | Weergave op website |
|--------|---------------------|
| FULL_TIME | Fulltime |
| PART_TIME | Parttime |
| CONTRACT | Contract |

---

## Tips

- Laat een rij **leeg** om een vacature tijdelijk te verbergen (lege cel in kolom A)
- De website **ververst elke 5 minuten** — wijzigingen zijn snel zichtbaar
- Voeg geen extra kolommen toe vóór kolom A — de volgorde is vast
- De beschrijving mag markdown-achtige opmaak bevatten: `**vetgedrukt**` en `- lijstitems`
