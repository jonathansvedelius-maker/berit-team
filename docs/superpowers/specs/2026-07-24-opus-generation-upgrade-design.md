# Berit-team v0.4.0 — anpassning till ny Opus-generation

> Design, 2026-07-24. Godkänd av Jonathan Svedelius.
> Nästa steg: implementationsplan.

## Problem

Berit-team är promptteknik: en konstitution, ett orchestrator-flöde, nio personas och fyra beslutsnivåer. Nyare Opus-generationer skiftar beteende på exakt de axlar systemet lutar sig mot:

| Skifte i modellen | Vad det träffar i Berit-team |
|---|---|
| Spawnar färre subagenter på eget initiativ | Delegering *är* produkten (hård regel 1) |
| Underanvänder filbaserat minne | `memory/` och `.context/handoff.md` bär hela kontinuitetsmodellen |
| Frågar oftare om småval | Undergräver tier A/B, vars poäng är "alltid tillåtet" |
| Följer severity-filter bokstavligt | Ingrids `Kritiska / Varningar / Förslag` sänker uppmätt recall |
| Kalibrerar svarslängd mot uppgiftskomplexitet | Befintliga korthetsinstruktioner kan nu överkorrigera |

Gemensam nämnare: skiftena är steerbara — modellen följer instruktioner bokstavligt — men det kräver att man skriver ut **när** en förmåga ska användas. `docs/constitution.md` beskriver idag åtta hårda regler och åtta "får aldrig", och nästan ingenting om när Berit ska agera på egen hand.

## Icke-problem

Det finns inget modell-ID att byta ut. Både `agents/*.md` (`model: opus`) och `src/agents/*.ts` (`model: "opus" as const`) använder *aliaset*, inte ett pinnat ID. En generationsövergång sker redan automatiskt.

## Mål

1. Teamet delegerar, läser minne och agerar autonomt inom tier A/B lika tillförlitligt som på föregående generation.
2. Ingrids granskningstäckning återställs.
3. Modellvalet blir konfigurerbart utan att förlora automatisk generationsuppgradering.
4. Regressionssviten fångar skiftena, så framtida modellbyten blir mätbara i stället för gissade.

## Icke-mål

- Tier-abstraktion för modellval (`lead`/`specialist`/`support`). Aliasen räcker.
- Modell-ID-pinning i frontmatter.
- Task budgets och thinking-konfiguration.
- Verbositetsjustering — se Beslut D.

---

## Design

### Steg 1 — Baseline före ändring

Kör R1–R9 mot nuvarande modell, logga i `outputs/2026-07-24/regression-run.md` enligt [../../regression-tests.md](../../regression-tests.md). Utan baseline blir "vi fixade X" ett påstående i stället för ett resultat.

Två okända verifieras samtidigt (kunde inte kontrolleras — läsning av `node_modules` nekad):

- Stöder plugin-frontmatter respektive SDK:ns `AgentDefinition` ett `effort`-fält?
- Vad upplöses aliaset `opus` till i den harness som faktiskt körs?

Utfallet av den första avgör om `effort` per roll är möjligt. Det finns ingen promptersättning — `effort` är en ratt, inte en formulering.

### Steg 2 — Konfiguration: alias som default, override för pinning

**Beslut A.** `agents/*.md` behåller `model: opus` / `sonnet`. Nya generationer slår igenom automatiskt.

**Beslut B.** Modellomnämnandena tas bort ur prosan i `skills/berit-orchestrator/SKILL.md` (`(berit-team:anna, sonnet)` → `(berit-team:anna)`) och `src/agents/berit.ts` (`**Anna — Krav & Affärsanalys (sonnet)**` → utan modellparentes). De påverkar inte vilken modell som körs, de driftar tyst utanför R9:s täckning, och de ger modellen anledning att resonera om sin egen modellnivå i stället för om uppgiften.

**Beslut C.** `src/index.ts` får en override: `BERIT_MODEL` pinnar alla agenter, `BERIT_MODEL_<AGENT>` pinnar en enskild. Ren mappning över `agents`-objektet före `query()`. Utan env-variabler är beteendet oförändrat.

Overriden gäller **bara SDK-ytan**. Plugin-agenter läser statisk frontmatter; där är pinning fortfarande "redigera filen". Asymmetrin dokumenteras i [../../sdk-usage.md](../../sdk-usage.md) under en ny rubrik, inte döljs.

### Steg 3 — Beteendeanpassning

Fyra riktade ändringar. Formuleringarna nedan är intention, inte slutgiltig ordalydelse.

**3.1 Autonomigrant i tier A/B** — `constitution.md`, `decision-authority.md`, `berit.ts`, `SKILL.md`

> Nivå A och B är fullmakter, inte tillstånd att fråga om lov. För småval inom nivån — namngivning, formatering, defaultvärden, val mellan likvärdiga ansatser, vilken specialist som tar nästa steg — välj, notera valet, fråga inte. Fråga vid scope-ändring eller nivå C/D.

**3.2 När-villkor för delegering** — `SKILL.md`, `berit.ts`

Dagens text beskriver *hur* man delegerar, aldrig *när*.

> Delegera när uppgiften rör en specialists domän — även när du själv skulle kunna svara. Att svara själv i stället för att delegera bryter mot hård regel 1; det är inte en genväg. Kör flera specialister parallellt när oberoende artefakter ska tas fram mot frysta kontrakt.

**3.3 När-villkor för minne** — `constitution.md`, `berit.ts`, `SKILL.md`

Dagens "Läs först"-avsnitt är en lista, inte en trigger.

> Läs `memory/` före varje uppdrag som är längre än ett steg. Skriv in beslut i `.context/handoff.md` löpande, inte bara vid `/berit-end`. Osäker på om något redan är beslutat: läs. Gissa inte.

**3.4 Ingrid: täckning först, filtrering sedan** — `agents/ingrid.md`

Störst konkret kvalitetsvinst. Rubrikerna `Kritiska / Varningar / Förslag` fungerar som ett severity-filter som nyare Opus följer bokstavligt: buggen hittas, bedöms under ribban, rapporteras inte.

> Rapportera varje fynd, även osäkra och lågallvarliga. Filtrera inte på vikt i det här steget — ange i stället konfidens per fynd så att mottagaren kan rangordna. Bättre att lyfta något som sedan sorteras bort än att tyst släppa en riktig bugg.

Rubrikstrukturen behålls; det som ändras är instruktionen om vad som får utelämnas.

### Steg 4 — Verbositet: ingen ändring

**Beslut D.** `constitution.md` har redan *Terse over verbose* och *One sentence per status update*. Den nya generationen kalibrerar längd mot uppgiftens komplexitet, och holdover-instruktioner kan nu överkorrigera. Rekommendationen är uttryckligen att mäta före ändring. Ändras bara om baseline från steg 1 visar problem.

### Steg 5 — Regressionssviten

Fyra nya tester i [../../regression-tests.md](../../regression-tests.md). Utan dem är anpassningen otestad.

| # | Prompt | Förväntat | Faller om |
|---|---|---|---|
| R10 | `/berit Vad gör funktionen i src/foo.ts?` | Berit delegerar till rätt specialist, eller motiverar explicit varför inte | Berit gör kodanalysen själv |
| R11 | `/pelle Lägg till en loading state i UserList` | Pelle väljer ansats själv och noterar valet | Pelle frågar användaren om ett tier-B-småval |
| R12 | `/ingrid Granska fil med planterad low-severity-bugg` | Buggen rapporteras under Förslag, med konfidens | Buggen tystas som "under ribban" |
| R13 | `/berit <uppdrag>` med icke-tom `open_questions.md` | Berit refererar relevant öppen fråga utan att `/berit-start` körts | Minnet ignoreras |

R12 kräver en fixtur med en planterad bugg. Den skapas som del av implementationen.

### Steg 6 — Leverans

- Version **0.4.0** på tre ställen: `package.json`, `.claude-plugin/plugin.json`, `SKILL.md` frontmatter.
- `npm run sync:agents` efter ändring i `agents/ingrid.md` — annars fäller R9.
- Beslutspost i `memory/decisions.md` via `/berit-end`.
- `arkitektur.html` och `README.md` uppdateras bara om innehållet faktiskt blir felaktigt.

---

## Berörda filer

| Fil | Ändring |
|---|---|
| `docs/constitution.md` | Autonomigrant (3.1), minnestrigger (3.3) |
| `docs/decision-authority.md` | Autonomigrant (3.1) |
| `docs/regression-tests.md` | R10–R13 |
| `docs/sdk-usage.md` | Nytt avsnitt: modellval och pinning |
| `skills/berit-orchestrator/SKILL.md` | 3.1–3.3, modellprosa bort, version 0.4.0 |
| `agents/ingrid.md` | 3.4 |
| `src/agents/ingrid.ts` | Genererad via `sync:agents` |
| `src/agents/berit.ts` | 3.1–3.3, modellprosa bort |
| `src/index.ts` | Modell-override |
| `package.json`, `.claude-plugin/plugin.json` | Version 0.4.0 |

## Risker

| Risk | Hantering |
|---|---|
| 3.1 tolkas för brett och Berit slutar fråga även vid tier C | Formuleringen namnger tier C/D explicit som undantag. R3 och R4 gatear detta och körs i steg 1 och efter. |
| 3.4 gör Ingrids rapporter brusiga | Konfidens per fynd behåller rangordningsbarheten. Utvärderas mot baseline. |
| Baseline i steg 1 visar att inget behöver ändras | Acceptabelt utfall. Då reduceras releasen till steg 2, 5 och 6. |
| `effort` visar sig inte finnas per agent | Parkerat, inte utlovat. Ingen del av designen beror på det. |

## Öppna frågor

- Ska `arkitektur.html` visa den nya autonomimodellen, eller räcker det att den inte blir felaktig?
- Ska R10–R13 in i `constitution.md`s kvalitetsgrind som villkor för versionsbump, eller är det underförstått av att sviten är en svit?
