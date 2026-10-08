# REPORT v1.18.0 - HMI v2 (2026-10-08) - documentation revision 1 - RELEASED

Built by `tools/patch-1.18.0.js` (v1.17.0 pipeline + `patch-hmi2.js`). DITL page identical to v1.17.0 (guard). AN_PV 16.

| # | Request | Done | Test | As left |
|---|---|---|---|---|
| 1 | Auto page: all manual inputs, analog and digital, directly simulatable; other-sheet inputs with a note | `hmiAuto` rewritten | test-hmi2: 51 sheets, 548 inputs, all bound and written as INPUTS (not forced); 197 linked inputs read only | done |
| 2 | Address picker | Find… (2 352 entries with description), Pick on diagram | test-hmi2 | done |
| 3 | Zoom, smooth drag, Lock | wheel / + / - / Fit, pan, free drag, resize, Lock saved | test-hmi2 | done |
| 4 | HMI saved | pages + lock + wire-bound widgets in bundle and project | test-hmi2 (F5) | done |
| 5 | Control logic from the HMI, modes from the switching logic | mode inputs (.MAN / .LOC / .REM) are buttons of the Auto page; no mode buttons | by construction | done |
| 6 | Process model gain / T / L in the Excel? | No: plant data, not faceplate data; defaults by loop type, editable | - | answered (docs/DCS-FILLED-FORM.md section 6) |

Not done: drawing tools beyond the existing widgets; animation only by colour / level. Not tested: exe, apk, the process model against the real plant, DXF import (user: not needed, the drawings are the existing ones).
