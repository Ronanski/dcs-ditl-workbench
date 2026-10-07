# PROGRESS tracker (updated in every build)

Phase 1 = engineering station + controller logic (what we have now). Phase 2 = plant simulator, shared scan engine, operation table (not started, not counted).

| # | Workstream | Weight | Done | Contribution | How it is measured |
|---|---|---|---|---|---|
| 1 | Drawing reader | 20 | 92 % | 18.4 | 54/54 sheets read; constants not found 18 -> 0 (v1.12.1); open: 6 blocks w/o input (drawing open), 6 unknown shapes, 4 unlinked circles |
| 2 | Block behaviour | 25 | 58.5 % | 14.6 | `node tools/progress.js <html>`: confirmed 100 · implemented 60 · simplified 25 · missing 0, weighted by block count (3,261 blocks; PID moved simplified -> implemented in v1.11.0) |
| 3 | Signals and links | 10 | 85 % | 8.5 | 194 external inputs linked by tag / FROM text, 304 two-line circles, the rest are real origin signals |
| 4 | Modes and tools | 15 | 87.5 % | 13.1 | 7 of 8: Run, Pause, force/inputs, Step, View, Why?, address highlight done · Trace partly (this sheet only; outgoing to other sheets open) |
| 5 | Project / files / app | 10 | 67 % | 6.7 | 4 of 6: project file, desktop shell, exe + apk + Releases pipeline, docs done · exe / apk verified on the user's devices, persistent DXF import and drawing-change report open |
| 6 | Verification | 20 | 10 % | 2.0 | ABC-050 checked against the PDF (1 of 51 sheets); triage done; per-block tests 0; plant scenarios 0 |
| | **PHASE 1 TOTAL** | 100 | | **64.1 %** | |

Rule: a block only counts as 100 when the user confirmed it AND a test exists. Honest estimate, not a promise: item 6 (verification) will move slowest.

## Next milestones
- DONE v1.11.0: real PID with default tuning (blocks 57.7 -> 58.5 %)
- v1.10.3 / next: group A reader defects -> reader 80 -> 90 %
- v1.11.0: Step + Trace (+ View) -> modes 37 -> 75 %
- BLOCK-LIBRARY confirmed by the user (PID first) -> blocks 58 -> 80 % and verification starts moving
