# PROGRESS tracker (updated in every build)

Phase 1 = engineering station + controller logic (what we have now). Phase 2 = plant simulator, shared scan engine, operation table (not started, not counted).

| # | Workstream | Weight | Done | Contribution | How it is measured |
|---|---|---|---|---|---|
| 1 | Drawing reader | 20 | 95 % | 19.0 | 54/54 sheets read; constants not found 18 -> 0 (v1.12.1); v1.14.2: 12 AND gates with a tall / rectangle / bracket body now read, 2 NOT pins fixed, DCMP elbow outputs read (estimate: +2 points); v1.14.3: letter circles r 8, MAN duplicates, NOT elbow pins, OR bars merged, FROM/TO 60 of 60 circles linked (estimate: +1); open: 6 blocks w/o input (drawing open), unknown shapes, 4 unlinked circles |
| 2 | Block behaviour | 25 | 58.5 % | 14.6 | `node tools/progress.js <html>`: confirmed 100 · implemented 60 · simplified 25 · missing 0, weighted by block count (3,261 blocks; PID moved simplified -> implemented in v1.11.0) |
| 3 | Signals and links | 10 | 85 % | 8.5 | 194 external inputs linked by tag / FROM text, 304 two-line circles, the rest are real origin signals |
| 4 | Modes and tools | 15 | 87.5 % | 13.1 | 7 of 8: Run, Pause, force/inputs, Step, View, Why?, address highlight done · Trace partly (this sheet only; outgoing to other sheets open) |
| 5 | Project / files / app | 10 | 67 % | 6.7 | 4 of 6: project file, desktop shell, exe + apk + Releases pipeline, docs done · exe / apk verified on the user's devices, persistent DXF import and drawing-change report open |
| 6 | Verification | 20 | 17 % | 3.4 | ABC-050 checked against the PDF (1 of 51 sheets); v1.14.2: 2100 of 2100 digital outputs reachable in the simulation (tools/justify.js; 14 only by a random input sequence), comparators 240/240, switches 382/384 (estimate: +5 points); v1.14.3: legend test (FF 282, timers 160), nets with 2+ drivers 0, duplicate blocks 0 (estimate: +2); per-sheet PDF check 1/51; plant scenarios 0 |
| | **PHASE 1 TOTAL** | 100 | | **65.3 %** | |

Rule: a block only counts as 100 when the user confirmed it AND a test exists. Honest estimate, not a promise: item 6 (verification) will move slowest.

## Next milestones
- DONE v1.11.0: real PID with default tuning (blocks 57.7 -> 58.5 %)
- v1.10.3 / next: group A reader defects -> reader 80 -> 90 %
- v1.11.0: Step + Trace (+ View) -> modes 37 -> 75 %
- BLOCK-LIBRARY confirmed by the user (PID first) -> blocks 58 -> 80 % and verification starts moving
