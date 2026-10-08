# REPORT v1.17.0 - what was done since v1.16.0 (2026-10-08) - documentation revision 1 - RELEASED

Built by `tools/patch-1.17.0.js` from `archive/html/logic-sim-v1.14.3.html` (v1.16.0 pipeline + `patch-face`, `patch-cos` (rewritten), `patch-proc`, `patch-ui`, Trend v2 in `patch-trend`). DITL page identical to v1.16.0 (guard). AN_PV 16.

| # | Request | Done | Test | As left |
|---|---|---|---|---|
| F1 | DITL list for the open sheet only | `patch-ditl.js` | test-ditl-signals | done |
| F2 | Panel auto width | `patch-ui.js` | browser suite | done |
| F3 | Trend: explain SV / PV, P I D, axes, sampling | Trend v2 + process model | test-trend, test-proc 61 / 62 | done |
| F4 | Floating zoom with control strip | `trZoom`, `trStrip` | test-trend | done |
| F5 | COS manual control, resolve the 25 | `patch-cos.js` | test-cos 173 / 173 | done |
| F7 | Faceplate values from the Excel | `patch-face.js` | test-pid-all 68, legend-matrix 2 973 | done |
| - | Ramp rates: assistant defaults, diagram text wins | RATE kept; screw coolers 0.05 rpm/s | list-assumed | done |
| - | DH / CUT: correct if wrong | swapped in the 68 PID rows | stored only | done |

Not tested: DXF import (test-import needs two DXF files), exe, apk, real plant behaviour (the process model is a guess by loop type).
