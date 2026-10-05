# Microsoft Update Dashboard v2

GitHub-Pages-Dashboard, das seine Windows-Update-Daten bei jedem Build direkt von offiziellen Microsoft-Supportseiten abruft. Die erzeugte JSON-Datei liegt nur im Pages-Artefakt, nicht im Repository. Updates werden nach Produkt und Feature-Update-Version gruppiert.

## Architektur

`config/sources.json` enthält ausschließlich Microsoft-Quell-URLs und deren Feature-Version. GitHub Actions führt täglich sowie bei Push/Manuell `npm run build` aus. Der Synchronisierer lädt die Seiten, extrahiert Datum, KB und OS-Build und erzeugt `_site/data/updates.json`. Danach wird `_site` veröffentlicht.

Eine Browser-Direktabfrage von `support.microsoft.com` wird bewusst nicht verwendet, weil eine statische Pages-Seite nicht von fremden CORS-Richtlinien abhängig sein sollte. "Live" bedeutet daher: serverseitig bei jedem GitHub-Actions-Build frisch von Microsoft abgerufen. Bei einem Quellenfehler wird dieser sichtbar protokolliert; schlägt jede Quelle fehl, stoppt das Deployment.

## Einrichtung

1. Dateien in ein GitHub-Repository mit Branch `main` hochladen.
2. Unter **Settings > Pages > Source** die Option **GitHub Actions** wählen.
3. Workflow **Live Microsoft sync and Pages** manuell starten oder auf den nächsten Lauf warten.
4. Weitere Feature-Versionen in `config/sources.json` ergänzen. Nur `https://support.microsoft.com/...` ist erlaubt.

## Lokal testen

```bash
npm test
npm run build
python3 -m http.server 8000 --directory _site
```

## Daten und Berechtigungen

Microsoft Graph wird nicht verwendet. Es sind keine Tenant-Berechtigungen, Secrets oder App-Registrierungen erforderlich. GitHub Actions verwendet nur `contents: read`, `pages: write` und `id-token: write`.

## Einschränkungen

- Microsoft-Supportseiten sind HTML und keine stabile öffentliche JSON-API. Ändert Microsoft das Markup, kann der Parser ausfallen. Tests decken das erwartete Format ab.
- Eine einzelne Detailseite liefert nur das jeweilige Update. Für eine komplette Feature-Version sollte deren offizielle Update-History-Seite in `config/sources.json` stehen.
- Office und Teams haben andere Publikationsformate und benötigen separate Adapter; es werden keine KB-Nummern erfunden.
- Die Microsoft-Graph-Windows-Updates-API liefert strukturierte Windows-Daten, benötigt aber Authentifizierung und verwendet Beta-Endpunkte. Sie ist daher nicht der sichere Standard für eine öffentliche GitHub-Pages-Seite.

## Sicherheit

**Bestanden:** Host-Allowlist, HTTPS-only, 30-Sekunden-Timeout, 8-MiB-Limit, keine Secrets, keine DOM-Rohdaten, CSP, sichere externe Links, minimale Workflow-Berechtigungen.

**Abweichung:** HTML-Scraping statt stabiler API. Risiko: Parsing-Ausfall. Abhilfe: Quellenfehler sichtbar machen, Deployment bei Totalausfall stoppen und Parser-Tests pflegen.

**Nicht prüfbar:** Unabhängige Multi-Agent-Verifikation des vollständigen Cloudflare-Auditablaufs.
