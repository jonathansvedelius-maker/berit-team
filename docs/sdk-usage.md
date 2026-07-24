# Använda Berit-teamet från andra projekt

## Syfte

Berit-teamets SDK-app kör hela agentteamet (Berit + nio specialister) som en fristående pipeline mot valfri kodbas via `@anthropic-ai/claude-agent-sdk`.

## Förutsättningar

| Krav | Detalj |
|------|--------|
| Node.js | 20 LTS eller senare (krävs av `tsx` 4.x och Claude Agent SDK) |
| `claude` CLI | Installerad och inloggad (`claude login`) |
| `npm install` | Körd i `berit-team`-katalogen så `tsx` och SDK finns lokalt |
| Sökväg | Absolut sökväg till `berit-team/src/index.ts` |

Verifiera snabbt:

```bash
node --version        # v20.x eller högre
claude --version      # bekräftar att CLI finns i PATH
```

## Autentisering

Berit-teamet använder Claude Agent SDK:n, som ärver OAuth-tokenen från `claude` CLI. Är du redan inloggad med `claude` behöver du **inte** sätta `ANTHROPIC_API_KEY`.

- I version `0.2.114` och tidigare versioner respekteras `ANTHROPIC_API_KEY` om den är satt — i så fall används den istället för CLI:ns OAuth-session. Kontrollera aktuellt beteende om du uppgraderar SDK:n.
- Byt konto genom `claude logout` följt av `claude login`.

```bash
# Sanity check: visar aktiv inloggning
claude --version
```

## Permission mode — fil-edits tillåts, Bash frågar

`src/index.ts` sätter `permissionMode: "acceptEdits"`. Det betyder att fil-edits (`Write`, `Edit`) tillåts automatiskt, men SDK:n frågar fortfarande **interaktivt** innan agenterna kör `Bash` och liknande. Prompten ritas ut i terminalen och väntar på ditt svar.

Bash-prompten är en **tyst fälla** i icke-interaktiva miljöer:

- **CI (GitHub Actions, GitLab, Jenkins):** ingen TTY finns, prompten skrivs aldrig ut, men körningen blockerar tills jobbet time:ar ut.
- **Bakgrundsprocesser (`nohup`, `&`, `pm2`, Docker utan `-it`):** samma sak — tyst hängning.
- **Interaktiv terminal:** fungerar som väntat, men avbryter ditt flöde när ett Bash-kommando ska köras.

Övriga modes:

| Mode | Effekt |
|------|--------|
| `"default"` | Frågar interaktivt även för fil-edits. Säkrast, men avbryter ofta. |
| `"bypassPermissions"` | Tillåter allt utan att fråga. Kör bara mot repos där du accepterar att agenterna skriver fritt. |

**Viktigt:** den här appen hårdkodar `"acceptEdits"` på `src/index.ts:19`. Byt läge genom att antingen fork:a `src/index.ts` och ändra raden, eller skriv en egen wrapper som anropar `query()` med ditt valda mode. Det finns i nuläget ingen flagga eller miljövariabel som styr det utifrån.

## Användning från ett annat projekt

Kör från roten av projektet du vill att agenterna ska läsa. `cwd` (nuvarande katalog) avgör vilka filer agenterna ser — `src/index.ts` startar inte om i någon annan katalog.

### Variant 1 — Direktkommando

```bash
cd /path/to/ditt-projekt

node --import tsx/esm \
  /absolut/sökväg/till/berit-team/src/index.ts \
  "Granska hela auth-flödet"
```

Windows — Git Bash eller WSL (POSIX-skal):

```bash
node --import tsx/esm \
  /c/Users/<user>/projects/berit-team/src/index.ts \
  "Granska hela auth-flödet"
```

Windows — PowerShell (default i Windows 11). Backslash `\` fungerar **inte** som radfortsättning här — använd enradsvarianten eller backtick `` ` ``:

```powershell
# Enradsvariant (enklast, rekommenderas)
node --import tsx/esm 'C:\Users\<user>\projects\berit-team\src\index.ts' "Granska hela auth-flödet"

# Flerradsvariant med backtick-kontinuation
node --import tsx/esm `
  'C:\Users\<user>\projects\berit-team\src\index.ts' `
  "Granska hela auth-flödet"
```

Sökvägen citeras med `'...'` så att backslashen tolkas bokstavligt. `\`-radbrytning fungerar endast i POSIX-skal (bash, zsh, Git Bash, WSL). I `cmd.exe` används `^` för radfortsättning — enklast även där är att hålla kommandot på en rad.

### Variant 2 — npm-script i ditt eget projekt

Lägg till i ditt projekts `package.json`:

```json
{
  "scripts": {
    "berit": "node --import tsx/esm /absolut/sökväg/till/berit-team/src/index.ts"
  }
}
```

Ditt projekt behöver ingen egen `tsx`-installation — skriptet pekar på filen i `berit-team` där `tsx` redan finns installerat via `devDependencies`.

Kör:

```bash
npm run berit -- "Ny feature: export av fakturor till PDF"
```

Alternativt, kör direkt från `berit-team`-katalogen med den befintliga `start`-scriptet:

```bash
cd /path/to/berit-team
npm start -- "Granska hela auth-flödet"
```

> Notera: `npm start` kör från `berit-team`-katalogen, så agenterna ser `berit-team`-kodbasen — inte ditt projekt. Använd variant 1 eller 2 när du vill rikta dem mot något annat.

## Output

När körningen är klar skrivs en slutrapport och kostnad till stdout:

```
════════════════════════════════════════════════════════════
BERIT — SLUTRAPPORT
════════════════════════════════════════════════════════════
<rapporttext på svenska>

Kostnad: $0.0423
```

Om teamet når maxgränsen för antal varv avbryts körningen med:

```
Berit nådde max antal varv. Försök med ett mer avgränsat uppdrag.
```

Då skrivs varken slutrapport eller kostnadsrad. Dela upp uppdraget och kör igen.

## Typiska prompts

> Förutsätter att du har lagt in `berit`-scriptet enligt Variant 2 ovan. Har du inte det, byt ut `npm run berit --` mot direktkommandot från Variant 1 (`node --import tsx/esm /absolut/sökväg/till/berit-team/src/index.ts`).

```bash
npm run berit -- "Granska auth-flödet i src/auth och flagga säkerhetsrisker"
npm run berit -- "Skriv en spec för export av fakturor till PDF"
npm run berit -- "Designa en Supabase-migration för tabellen invoices"
npm run berit -- "Ta fram en mätplan för onboarding-funneln"
npm run berit -- "Granska React-komponenterna i src/components för a11y-problem"
```

Prompten skickas via `process.argv` — allt efter `--` (npm) respektive scriptnamnet (direkt) blir ett enda argv-element när du citerar det.

## CI — GitHub Actions

> **Obs:** Berit körs med `permissionMode: "acceptEdits"` och hänger på interaktiv prompt i CI om den försöker köra `Bash`. Sätt `ANTHROPIC_API_KEY` och ändra till `"bypassPermissions"` i en fork av `src/index.ts` — se [Permission mode](#permission-mode--fil-edits-tillåts-bash-frågar) ovan — eller acceptera att körningen kräver TTY.

Minimalt workflow-steg (lägg in i ditt befintliga workflow):

```yaml
- name: Kör Berit
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    cd /path/to/berit-team
    npm ci
    npm start -- "Granska auth-flödet"
```

Byt ut `/path/to/berit-team` mot den faktiska sökvägen i din CI-runner. Kom ihåg att `permissionMode` måste hanteras (se avsnittet ovan) för att körningen inte ska hänga i en icke-interaktiv miljö.

## Säkerhet

Läs det här **innan första körningen** — särskilt om repot du riktar Berit mot innehåller kund-, affärs- eller nyckeldata.

### `.context/handoff.md` innehåller hela den interna dialogen

Berit skriver en handoff-fil till `<cwd>/.context/handoff.md`. Den innehåller:

- **hela din ursprungsprompt** i klartext (inklusive eventuella kundnamn, affärsdata, kodsnuttar du klistrat in),
- **agenternas interna beslut, flaggor och säkerhetsnoteringar** (t.ex. Ingrids granskningspunkter),
- **filreferenser och sökvägar** från repot Berit läst.

Det här är inte samma sak som en tillfällig loggfil. Commit:ar du den av misstag till en public repo — eller kör Berit på en delad utvecklarmaskin där `.context/` inte är ignorerad — läcker teamets interna analys av din kodbas.

Gör det här **innan du kör första gången** i ett nytt repo:

```bash
echo ".context/" >> .gitignore
```

Kör inte Berit mot hemliga repos på delad infra (shared build agents, multi-tenant dev-sandboxes) utan att först kontrollera att `.context/` inte committas eller arkiveras.

### Prompten läcker i stdout och shell-historik

Prompten skickas som argv, så den hamnar i din shell-historik (`~/.bash_history`, `~/.zsh_history`, PowerShell-history). Den skrivs **dessutom** till stdout som en intro-rubrik vid körningsstart (`Berit-teamet startar: <din prompt>`, `src/index.ts:12`) — inte bara i själva slutrapporten. I CI betyder det att prompten syns i jobb-loggen även om du tror att du maskerat argv via secrets.

Undvik hemligheter, API-nycklar, personuppgifter och kundnamn i prompts om sessionen kan bli publik (CI-loggar, inspelade demos, skärmdelning).

## Modellval och pinning

Agenterna deklarerar ett *alias* (`opus` / `sonnet`) i `agents/<namn>.md`, inte ett pinnat modell-ID. Nya modellgenerationer når därför teamet automatiskt, utan kodändring.

Behöver du köra en specifik modell — reproducera en bugg, jämföra två generationer, pinna under en incident — finns två miljövariabler:

| Variabel | Effekt |
|----------|--------|
| `BERIT_MODEL` | Gäller alla agenter. |
| `BERIT_MODEL_<AGENT>` | Gäller en agent. Slår `BERIT_MODEL`. Agentnamnet i versaler: `BERIT_MODEL_INGRID`. |

```bash
BERIT_MODEL_INGRID=opus npm start -- "Granska auth-flödet"
```

Tomma värden och enbart blanksteg ignoreras — då används aliaset från `agents/<namn>.md`.

**Gäller bara SDK-ytan.** Plugin-agenter läser statisk frontmatter och ser aldrig miljövariabler. Vill du pinna på plugin-sidan redigerar du `model:` i `agents/<namn>.md` och kör `npm run sync:agents`.

## Gotchas

- **`cwd` styr läsningen.** Agenterna läser filer relativt den katalog där du kör kommandot. Glömmer du `cd` hamnar de i fel repo.
- **`.context/handoff.md` skapas i `cwd`.** Se Säkerhet-avsnittet ovan — handoff-filen innehåller hela dialogen och ska inte committas.
- **Citera flerord-prompts.** Utan citattecken tolkas varje ord som ett eget argv-element. `src/index.ts` joinar dem med mellanslag, men specialtecken (`&`, `|`, `>`) bryter ändå skalet.
- **`tsx` måste kunna upplösas.** `--import tsx/esm` letar `tsx` via Nodes modulupplösning från filen som körs. Därför måste `berit-team` ha haft `npm install` körd innan du pekar dit utifrån.
- **Ingen stegvis output.** Endast slutrapporten och `error_max_turns` skrivs ut i dag — mellansteg syns inte.
- **MCP-servrar är inte aktiverade.** `src/index.ts` startar agenterna utan `mcpServers` i `options`. Vill du koppla in externa verktyg (Supabase, Stripe, Figma m.fl.) behöver du forka `src/index.ts` och lägga till `mcpServers` i `query()`-anropet.

## Felsökning

| Symptom | Trolig orsak | Åtgärd |
|---------|--------------|--------|
| `command not found: claude` | Claude CLI saknas i PATH | Installera CLI:n och kör `claude login` |
| `No API key / not authenticated` | Varken OAuth-session eller `ANTHROPIC_API_KEY` hittad | Kör `claude login` eller sätt `ANTHROPIC_API_KEY` |
| `Cannot find package 'tsx'` | `npm install` inte kört i `berit-team` | `cd berit-team && npm install` |
| `Unknown file extension ".ts"` | `--import tsx/esm` saknas i kommandot | Lägg till flaggan före sökvägen till `src/index.ts` |
| `Usage: npm start -- <prompt>` | Prompten saknas | Lägg till en citerad prompt som argument |
| `Usage: npm start -- <prompt>` | Tom prompt (whitespace) | Prompten innehöll bara blanksteg — `.trim()` i `src/index.ts` gjorde den tom. Lägg till en icke-tom prompt. |
| `Berit nådde max antal varv` | Uppdraget är för brett | Dela upp i mindre uppdrag och kör igen |
| Agenterna läser fel filer | Kommandot kördes från fel katalog | `cd` till rätt projekt innan du kör |
