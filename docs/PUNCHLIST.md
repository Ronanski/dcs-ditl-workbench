# PUNCHLIST — what still needs correction or a decision (v1.15.0, 2026-10-07)

**A. Real corrections still to do** (a defect or a gap in the html)
| # | Where | Problem | Action needed | Who |
|---|---|---|---|---|
| P1 | ABC-001C TR228 (212, 162) | Drawing says TON 2 s, the user's memory list says TPs 2 | Look at the drawing with the user; change the type if the memory list is right | assistant + user |
| P2 (DONE, H-17) | ABC-004A circles "A" at (194, 354) and (381, 95) | Were not linked | Paired and tested (FINDINGS H-17) | assistant |
| P3 (DONE: exit, O-08) | ABC-020 circle "9" at (501, 599) | No partner circle on any sheet | Searched all 54 sheets (circles, FROM / TO texts, tags): no partner. Left as an exit. If you know a partner on the PDF, tell me | assistant + user |
| P4 (DONE 2026-10-07: all 45 lines are correct pairs, docs/FINDINGS.md J2) | 45 "tags differ" lines of audit-links (003B / C / D "2", 004A FFD, 009A / B "L", 012 "MST", 013 / 050 "BOF", 015 / 016 "1" - 057 ...) | The tag written beside the two ends of a circle pair is different | Look at each on the drawing: wrong pair or two names of one signal | assistant |
| P5 (DONE, O-05) | ABC-003E TPS #70 (TR256) | The scan cannot make the output 1 | Shown by the sequence test in `tools/test-blocks.js` (7 steps) | assistant |
| P6 | PIDV | Runs as a normal velocity-form PID; the pulse is only shown by the PO | Real pulse-output PID if the user wants it | assistant (needs the DCS pulse settings) |
| P7 (DONE, WIP after v1.15.1) | Whole app | Persistent DXF import and report of drawing changes | Imported DXF is stored in the browser (IndexedDB, same store as the settings), re-applied at every start; button **Imports** shows the report (counts of blocks / nets / segments / texts, kinds that changed, blocks and texts only in one of the two) and **Back to built-in**; saved values of the sheet are cleared at import. `tools/test-import.js` 10 / 10. Not tested with a real plant DXF | assistant |

**B. Values and confirmations only the user (or the DCS) can give**
| # | Item | Now |
|---|---|---|
| P8 | ALM limits of 104 alarms | ASSUMED (docs/ASSUMED-VALUES.md section 4) |
| P9 | Ramp rates of 8 boxes | ASSUMED |
| P10 | PO pulse cycle / stroke / shortest pulse | ASSUMED 2 s / 60 s / 0.2 s |
| P11 | PID gains | default tuning by loop type |
| P12 | PRI / SEC / AVG default mode of the SEL blocks | default AVG |
| P13 | Units of S1-LN38 / S1-LN39 (drum level) | deduced (identity at 0 kg/cm2): confirm with the DCS table |
| P14 | exe and apk | built; the user tests them himself; NOT counted in the progress (decision 2026-10-07) |
| P15 | Block kinds | none confirmed by the user yet (block behaviour is capped at 60 % until he confirms) |
| P16 | Sheet-by-sheet comparison with the PDFs | 1 of 51 sheets (ABC-050) |

**C. Known, harmless (not corrections)**: O-01 extra two-cell box above the I/P read as SUB with no output (ABC-008, 014) · O-02 tick marks at PID / MAN box edges read as extra pins · ABC-052 AND #112 (ignored by the user) · ABC → DITL crossings not simulated by design · 91 "TO DITL" exits.

**D. Added 2026-10-07 (MAN controller and integrators)**
| # | Item | Status |
|---|---|---|
| P17 | Test of all 58 MAN: range, clamp, selector tracking, output feeds something | **DONE** in `tools/legend-matrix.js` (58 / 58 pass; docs/LEGEND-MATRIX.md) |
| P18 | PID / PIDV in a closed loop | **DONE for all 68 PID / PIDV** with a simple process (first-order lag + gain, direct or reverse by the PID direction): `node tools/test-loops.js <html>` 68 / 68 settle, no growing oscillation, output inside its range, with the default tuning. NOT the real plant (real process dynamics and DCS gains unknown) |
| P19 | SUMA / SUMP: unit (per hour) and where the total goes | SUMA 10 / 10 integrate correctly (matrix); the unit is deduced, to confirm; SUMP has no use on the sheets (code test only) |
| P20 | Legend matrix: 2 973 of 2 973 blocks pass the function of their symbol | **DONE**; run at every build (`node tools/legend-matrix.js <html> docs/LEGEND-MATRIX.md`) |
