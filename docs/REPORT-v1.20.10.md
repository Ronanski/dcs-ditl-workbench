# REPORT v1.20.10 (technical) - Batch 1 inspection of the user (2026-10-10)
Simple-Taglish report for the user: `docs/LogicSim_v1.20.10_Report.pdf` (+ `LogicSim_v1.20.10_Manual_Testing_Guide.pdf`). This file is the technical record.
Build: `node tools/patch-1.20.10.js` (reads archive/html/logic-sim-v1.20.9.html; modules patch-1.20.10-fx, -dup, -minair, -xref, -cos, -ab, -vcol, -audit, -mode, -search, -pane2). DITL guard IDENTICAL (135a852d87c5).

## Changes (see FINDINGS H-58 .. H-67)
- F(X) % input scaling (anFXIn, lazily after the links are built: anFXRe); SCALE status; panel text; review mark `scale?`.
- Min air flow constant = 32 % x th (default 400).
- Address table filter: circle tag (one net), bare controller tag, labels closer than 22 units; wire values hidden on the nets of a circle that has an address.
- Cross-sheet text links (ABC-xxx, DITL nn) read at document level (pointer capture of the sheet).
- AI output = 0 while its SIG.AB is ON; badge follows (aiBad).
- COS popover (cosPop) with the T switch override; Review marks / Health fixes.
- Numbers colours (bd.inp, bd.frc) + legend; Simulation Audit (AU, localStorage `ls-audit`); mode label; global search (anIdx, anHits, anLocate); second pane (p2Sync, p2With, paint0).

## Tests (v1.20.10 html)
| Test | Result |
|---|---|
| guard-ditl | IDENTICAL |
| test-verify-fx (112 FX) | 562 PASS, 11 NEEDS REVIEW (5 SCALE + 6 unit / path) |
| test-verify-linear-xls.py | 380 PASS |
| test-verify-ab (new) | 553 PASS, 59 NOT TESTED (feedback AI) |
| test-verify-cos (new) | 360 PASS, 83 NOT TESTED (other COS kinds: wire / SV / digital; test-cos) |
| test-verify-not / sel / final / minair | 488 / 120 / 81 / 7 PASS |
| test-verify-range | 212 PASS, 155 NEEDS REVIEW, 1 NOT TESTED |
| test-verify-rate | 113 PASS, 11 NEEDS REVIEW, 30 NOT TESTED |
| test-fxscale, xref, audit, search, pane2 (new) | 20, 4, 9, 5, 5 PASS |
| test-ui-hs, ui-sigab, ui-minair, ui-1.20.9 | 36, 10, 9, 14 PASS |
| engine + 21 older browser tests | PASS (see docs/REGRESSION-v1.20.10.txt); old failures identical to v1.20.9 |

## Open
See docs/HANDOVER.md section 4 and report section 5 / 9.
