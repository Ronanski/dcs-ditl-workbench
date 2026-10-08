# PROGRESS tracker (updated in every build)

Phase 1 = engineering station + controller logic (what we have now). Phase 2 = plant simulator, shared scan engine, operation table (not started, not counted).

| # | Workstream | Weight | Done | Contribution | How it is measured |
|---|---|---|---|---|---|
| 1 | Drawing reader | 20 | 97 % | 19.4 | 54/54 sheets read; constants not found 18 -> 0 (v1.12.1); v1.14.2: 12 AND gates with a tall / rectangle / bracket body now read, 2 NOT pins fixed, DCMP elbow outputs read (estimate: +2 points); v1.14.3: letter circles r 8, MAN duplicates, NOT elbow pins, OR bars merged, FROM/TO 60 of 60 circles linked (estimate: +1); open: 6 blocks w/o input (drawing open), unknown shapes, 4 unlinked circles v1.15.0: 44 AI pins, 36 AND gates, 45 chain circles, junction dots on layer MEM, arrow gaps, timer labels, contact glyph read (docs/FINDINGS.md section H) (estimate: +2 points) |
| 2 | Block behaviour | 25 | 59.9 % | 15.0 | `node tools/progress.js <html>`: confirmed 100 · implemented 60 · simplified 25 · missing 0, weighted by block count (3,261 blocks; PID moved simplified -> implemented in v1.11.0) v1.15.0: ALM, TP, SUMA, PO, CTK, DCMP, HLLIM, DRATE moved simplified -> implemented (each has a test: tools/test-blocks.js, test-math.js, test-rate.js; 3,318 blocks, 3,307 implemented, 11 simplified = FIELD devices) |
| 3 | Signals and links | 10 | 94 % | 9.4 | 194 external inputs linked by tag / FROM text, 304 two-line circles, the rest are real origin signals v1.15.0: every one of 182 link pairs carries its value (tools/test-links-all.js), no dead-end wire except real exits (tools/audit-reach.js), 4-way selectors, 8 TP from the Compensation file (estimate: +9 points) |
| 4 | Modes and tools | 15 | 87.5 % | 13.1 | 7 of 8: Run, Pause, force/inputs, Step, View, Why?, address highlight done · Trace partly (this sheet only; outgoing to other sheets open) |
| 5 | Project / files / app | 10 | 100 % | 10.0 | 5 of 5: project file, desktop shell + release pipeline, docs, persistent DXF import + drawing-change report (P7, WIP build after v1.15.1: `tools/test-import.js` 10 / 10) done. exe / apk tested on devices is NOT counted (user decision 2026-10-07: he tests them himself; the html is what matters) |
| 6 | Verification | 20 | 85.7 % | 17.1 | 7-check rubric on the html only (section "Detailed breakdown"): 6 automated checks done on 51 / 51 sheets, user confirmation 0. The PDF eye-comparison was dropped by the user (2026-10-08): the sheets are the drawings |
| | **PHASE 1 TOTAL** | 100 | | **84.0 %** | (WIP after v1.15.1: P7 done (+2.0) and the PDF check dropped (+2.1); 79.9 % in v1.15.0; exe / apk device test not counted; 65.3 % after v1.14.3) |

Rule: a block only counts as 100 when the user confirmed it AND a test exists. Honest estimate, not a promise: item 6 (verification) will move slowest.

## Next milestones
- DONE v1.11.0: real PID with default tuning (blocks 57.7 -> 58.5 %)
- v1.10.3 / next: group A reader defects -> reader 80 -> 90 %
- v1.11.0: Step + Trace (+ View) -> modes 37 -> 75 %
- BLOCK-LIBRARY confirmed by the user (PID first) -> blocks 58 -> 80 % and verification starts moving

## Detailed breakdown (v1.15.0, 2026-10-07) — why each number is what it is

### Verification (weight 20) — the html only (exe / apk are not counted here)
Each of the 7 checks is worth 14.29 % of the workstream; a check counts for the share of the 51 sheets (CONTENTS and SYMBOL LIST excluded) that passed it.
| # | Check (on the html) | Tool | Sheets passed | Score |
|---|---|---|---|---|
| A | Reader complete: no wire that is driven but feeds nothing, no input that nothing feeds (except classified exits) | audit-reach.js | 51 / 51 | 14.29 |
| B | Logic reachable: every digital output can be driven to 0 and 1 | justify.js (2193 of 2194; the 1 = TR256 TPS#70, O-05: shown by the sequence test in test-blocks.js, 7 / 7 steps) | 51 / 51 (1 output open) | 14.29 |
| C | Links between sheets carry their value | test-links-all.js (182 / 182) | 51 / 51 | 14.29 |
| D | Wires on the screen follow the value (lit only when 1, grey when 0 or cut off) | test-paint.js | 51 / 51 | 14.29 |
| E | Numbers against the user's own files (timers - memory list, AI ranges - IO list, LN tables - LINEAR, TP - Compensation) | audit-timers / audit-ai-ranges / test-ln / test-blocks | 51 / 51 (1 real difference: TR228) | 14.29 |
| F | Function blocks follow the legend (gates, timers, FF, comparators, math, switches, MAN, PID, rate, selectors, valves, integrators): every block of every sheet | `legend-matrix.js` (2 973 of 2 973 blocks; docs/LEGEND-MATRIX.md) + test-legend, test-math, test-switch, test-comparators, test-pid-all, test-rate, test-blocks | 51 / 51 | 14.29 |
| G | Confirmed by the user on his own screen | the user | 0 / 51 | 0 |
| | **Total** | | | **85.7 %** (6 × 14.29 + 0; was 75.25 % with the PDF check) |
To go higher: only G needs the user (he confirms the block kinds on his own screen). A to F are done and repeated at every build. DECISION 2026-10-08 (user): the PDF eye-comparison is dropped: the sheets read by the simulator ARE the drawings (the same DXF / PDF set), so there is nothing else to compare with; the audits A to F check the reader against those drawings.

### Block behaviour (weight 25) — why 59.9 %
Scale of `tools/block-status.json`: confirmed by the user = 100, implemented (has a test, not confirmed by the user) = 60, simplified = 25, missing = 0; weighted by the number of blocks. **No block kind has the user's confirmation yet**, so the best the scale can give today is 60 %. 3,309 of 3,320 blocks are "implemented"; 11 are "simplified" (FIELD devices: valve / damper field side, value passed through).
| Block | Count | Status | Test |
|---|---|---|---|
| CONST | 261 | implemented | audit-params |
| NOT | 243 | implemented | test-legend, justify |
| AMT | 225 | implemented | test-switch, test-blocks |
| AND | 224 | implemented | test-legend, justify |
| AI | 201 | implemented | audit-ai-ranges 157, test-anim |
| TXD | 201 | drawing-only | drawing only |
| SIGAB | 198 | implemented | audit-reach |
| OR | 180 | implemented | test-legend, justify |
| COS | 173 | implemented | test-switch |
| SW | 159 | implemented | test-switch 382, test-blocks |
| HC | 118 | implemented | test-comparators 240 |
| FX | 111 | implemented | test-ln 89/89, test-drum |
| TPS | 108 | implemented | test-legend 108 |
| ALM | 104 | implemented | test-blocks, test-defaults-ui |
| LC | 102 | implemented | test-comparators |
| DEV | 92 | implemented | test-math |
| AO | 90 | implemented | test-anim |
| PID | 66 | implemented | test-pid-all 68 |
| SUM | 64 | implemented | test-math |
| MAN | 58 | implemented | test-pid |
| SUB | 55 | implemented | test-math |
| MUL | 53 | implemented | test-math |
| FF | 47 | implemented | test-legend 282 |
| IP | 45 | implemented | pass-through |
| VLV | 44 | implemented | test-anim |
| ACH | 42 | drawing-only | drawing only |
| ACT | 37 | implemented | test-anim |
| TON | 35 | implemented | test-legend 35 |
| RATE | 28 | implemented | test-rate 43 |
| SEL | 26 | implemented | test-blocks |
| TOF | 19 | implemented | test-legend 19 |
| HS | 15 | implemented | test-math |
| RAMPB | 15 | implemented | test-rate |
| LAG | 14 | implemented | test-math |
| SQRT | 13 | implemented | test-math |
| CMPK | 12 | implemented | test-comparators |
| DIV | 12 | implemented | test-math |
| FIELD | 11 | simplified | pass-through |
| SUMA | 10 | implemented | test-blocks |
| ADD | 9 | implemented | test-math |
| TP | 8 | implemented | test-blocks (8 TP) |
| ABS | 7 | implemented | test-math |
| CTK | 6 | implemented | test-blocks |
| FOUT | 6 | drawing-only | drawing only |
| LLIM | 5 | implemented | test-math |
| LS | 4 | implemented | test-math |
| DCMP | 3 | implemented | test-comparators, justify |
| PVSV | 2 | implemented | test-comparators |
| PIDV | 2 | implemented | test-pid-all |
| PO | 2 | implemented | test-blocks |
| HLLIM | 1 | implemented | test-math |
| TPV | 1 | implemented | test-legend |
| HLIM | 1 | implemented | test-math |
| DRATE | 1 | implemented | test-rate |

Raise it: the user confirms kinds on his own screen (each confirmed kind moves from 60 to 100 for its blocks); biggest by count: CONST 261, NOT 243, AMT 225, AND 224, AI 201, SIGAB 198.

### Project / files / app (weight 10) — 100 %
exe / apk tested on the user's devices is NOT counted (the user tests them himself; the html is what matters).
| Item | Status |
|---|---|
| Project file (save / open, restore) | done (test-project, test-storage) |
| Desktop shell (portable exe) and exe + apk + Release pipeline | done (run #10 green) |
| Documentation (manual, reports, data files, assumed values, punch list) | done |
| Persistent DXF import + report of drawing changes | **done in the WIP build** (P7; `node tools/test-import.js <html> <same.dxf> <edited.dxf>`: import is kept after F5, report IDENTICAL / DIFFERENT, "Back to built-in" removes it; 10 / 10 checks). NOT tested with a real plant DXF yet (the test DXFs are written from the built-in sheet ABC-050) |
5 of 5 = 100 %.
