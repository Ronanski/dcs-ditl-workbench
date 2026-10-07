# DCS Engineering Station (DITL + ABC analog workbench)

Offline simulator/viewer of the plant's DCS logic drawings.

- Open `ditl-workbench-vX.Y.Z.html` in Chrome (double-click, no install, no network), or use the portable Windows app (GitHub > Actions > latest run > Artifacts).
- Analog page: Save / Open project file (Ctrl+S). It keeps your inputs, forces, switches and settings.
- Rules, checklist, versioning, continuity: **DESIGN.md**. What changed: **PROJECT-NOTES-vX.Y.Z.md**. Where we are / how to continue in a new chat: **docs/HANDOVER.md**.

| folder | what |
|---|---|
| `app/` | Electron shell for the portable Windows exe |
| `baseline/` | v1.0.0 html, reference for the DITL "never touched" guard |
| `tools/` | tests, patch script of the current build, helpers (`tools/history/` = old patches) |
| `docs/` | architecture, handover, block coverage, analysis |
| `archive/` | old builds / notes / pdf |
