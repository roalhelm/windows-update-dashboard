# Microsoft Update Dashboard

Statische, responsive GitHub-Pages-Webseite für monatliche Microsoft-Updates. Sie filtert nach Bereich und Monat und zeigt KB, Veröffentlichungsdatum, Version, OS-Build sowie den Link zur offiziellen Microsoft-Dokumentation.

## Annahmen

- GitHub Pages ist öffentlich; deshalb enthält das Repository ausschließlich öffentliche Patch-Metadaten.
- Updates werden bewusst kuratiert. Das vermeidet fragile HTML-Scraper und unnötige Microsoft-Graph-Berechtigungen.
- Office, Teams, Edge und Intune sind im Datenmodell vorgesehen. Ein Eintrag wird erst ergänzt, wenn eine offizielle Microsoft-Seite eine KB-Nummer nennt.
- Windows 10 ESU/LTSC kann mit seiner genauen Version als eigener Datensatz gepflegt werden.

## Repository

```text
.
├── .github/workflows/pages.yml
├── assets/app.js
├── assets/style.css
├── data/schema.json
├── data/updates.json
├── scripts/Add-Update.ps1
├── scripts/validate.mjs
├── tests/site.test.mjs
├── index.html
├── package.json
├── SECURITY.md
├── LICENSE
└── README.md
```

## Voraussetzungen

- GitHub-Repository
- Node.js 20 oder neuer für lokale Tests
- Optional PowerShell 7 zum komfortablen Ergänzen

## Installation und Veröffentlichung

1. Repository zu GitHub hochladen und den Standardbranch `main` verwenden.
2. Unter **Settings > Pages > Build and deployment > Source** den Eintrag **GitHub Actions** auswählen.
3. Einen Push auf `main` ausführen. Der Workflow testet und veröffentlicht die statische Seite.
4. Die veröffentlichte URL wird im Job `deploy` angezeigt.

## Update ergänzen

```powershell
./scripts/Add-Update.ps1 -Category 'Windows 11' -Product 'Windows 11' -Version '24H2' -KB 'KB1234567' -ReleaseDate '2026-10-13' -OSBuild '26100.0000' -DocumentationUrl 'https://support.microsoft.com/help/1234567'
```

Danach prüfen und committen:

```bash
npm test
git add data/updates.json
git commit -m "data: add October 2026 updates"
git push
```

Direkte Bearbeitung von `data/updates.json` ist ebenfalls möglich. Das Schema erlaubt die Bereiche Windows 10, Windows 11, Office, Teams, Edge und Intune. Keine Werte raten; Datum, Build und Link immer gegen die offizielle Dokumentation prüfen.

## Tests

```bash
npm test
```

Geprüft werden Pflichtfelder, KB-Format, Datum, Microsoft-Link-Allowlist, Duplikate, HTML-Grundstruktur, Schutz externer Links und einfache Secret-Muster.

## Berechtigungen

- Microsoft Graph: **keine**. Begründung: öffentlich kuratierte Microsoft-Dokumentation genügt und GitHub Pages benötigt keine Tenant-Daten.
- GitHub Actions: `contents: read`; nur der Deploy-Job erhält `pages: write` und `id-token: write`.

## Sicherheitsprüfung

- **Bestanden:** Keine Anmeldeinformationen, Cookies, Tracker oder Formulare.
- **Bestanden:** restriktive Content Security Policy und ausschließlich lokale Skripte/Styles.
- **Bestanden:** sichere externe Links mit `noopener noreferrer`.
- **Bestanden:** Eingabevalidierung im PowerShell-Helfer und Datenvalidator.
- **Bestanden:** minimale Workflow-Berechtigungen und gepinnte Major-Versionen offizieller GitHub-Actions.
- **Abweichung:** kein vollautomatischer Microsoft-Scraper. Risiko: manuelle Pflege kann verspätet sein. Korrektur: monatlicher Review/PR mit offizieller Quellenprüfung. Die Entscheidung vermeidet fragiles Scraping und überprivilegierten Graph-Zugriff.
- **Nicht prüfbar:** unabhängige Multi-Agent-Verifikation des Cloudflare-Auditablaufs. Die lokale Prüfung deckt Architektur, Trust Boundaries, DOM-Injection, Secrets und CI-Berechtigungen ab, ist aber kein vollständiger externer Audit.

## Fehlerbehebung

- Leere Seite: Browser-Konsole prüfen und sicherstellen, dass `data/updates.json` gültiges JSON ist.
- Workflow scheitert: lokal `npm test` ausführen.
- 404 nach Deployment: Pages-Quelle auf **GitHub Actions** setzen und den Actions-Lauf prüfen.
- Neuer Bereich: Enum in `data/schema.json` erweitern; die Oberfläche übernimmt ihn automatisch aus den Daten.

## Quellenstrategie

Bevorzugt werden `support.microsoft.com` und `learn.microsoft.com`. Das Repository enthält absichtlich keine inoffiziellen Patchdaten. Die mitgelieferten Beispieldaten stammen aus offizieller Microsoft-Dokumentation und dienen als funktionsfähiger Startpunkt.
