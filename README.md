# Logic Sim (DITL + ABC analog workbench)

Offline simulator/viewer of the plant's DCS logic drawings.

- Download from **GitHub > Releases** (latest): `logic-sim-vX.Y.Z.html` (open in Chrome, no install, no network), `logic-sim-vX.Y.Z-portable.exe` (Windows, portable) or `logic-sim-vX.Y.Z.apk` (Android).
- Analog page: Save / Open project file (Ctrl+S). It keeps your inputs, forces, switches and settings.
- **Manual** (installation, familiarization, how to use, troubleshooting): [docs/MANUAL.md](docs/MANUAL.md) · PDF: [docs/Logic-Sim-Manual.pdf](docs/Logic-Sim-Manual.pdf) (also attached to each Release).
- What every symbol must do: **docs/FUNCTIONALITY.md** · page links: **docs/LINKING.md** · what was found wrong and how to check it: **docs/FINDINGS.md**. · the files the user sent and where they are used: **docs/DATA-FILES.md** · every number that is NOT on the drawings (file data / assumed): **docs/ASSUMED-VALUES.md** · consolidated findings / actions / as-left report: **docs/REPORT-v1.15.0.md**.
- Rules, checklist, versioning, continuity: **DESIGN.md**. What changed: **PROJECT-NOTES-vX.Y.Z.md**. Where we are / how to continue in a new chat: **docs/HANDOVER.md**.

| folder | what |
|---|---|
| `app/` | Electron shell for the portable Windows exe |
| `android/` | Capacitor shell for the Android apk |
| `baseline/` | v1.0.0 html, reference for the DITL "never touched" guard |
| `tools/` | tests, patch script of the current build, helpers (`tools/history/` = old patches) |
| `docs/` | architecture, handover, block coverage, analysis |
| `archive/` | old builds / notes / pdf |
