# PROGRESS tracker (updated in every build)

Phase 1 = engineering station + controller logic (what we have now). Phase 2 = plant simulator, shared scan engine, operation table (not started, not counted).

| # | Workstream | Weight | Done | Contribution | How it is measured |
|---|---|---|---|---|---|
| 1 | Drawing reader | 20 | 80 % | 16.0 | 54/54 sheets read; open: 18 constants "value not found", 6 blocks w/o input, 6 unknown shapes, 4 unlinked circles |
| 2 | Block behaviour | 25 | 57.8 % | 14.5 | `node tools/progress.js <html>`: confirmed 100 · implemented 60 · simplified 25 · missing 0, weighted by block count (3,251 blocks) |
| 3 | Signals and links | 10 | 85 % | 8.5 | 194 external inputs linked by tag / FROM text, 304 two-line circles, the rest are real origin signals |
| 4 | Modes and tools | 15 | 37.5 % | 5.6 | 3 of 8: Run, Pause, force/inputs done · Step, View, Trace, Why?, address highlight open |
| 5 | Project / files / app | 10 | 50 % | 5.0 | 3 of 6: project file, desktop shell built, docs done · exe verified on laptop, persistent DXF import, drawing-change report open |
| 6 | Verification | 20 | 10 % | 2.0 | ABC-050 checked against the PDF (1 of 51 sheets); triage done; per-block tests 0; plant scenarios 0 |
| | **PHASE 1 TOTAL** | 100 | | **51.6 %** | |

Rule: a block only counts as 100 when the user confirmed it AND a test exists. Honest estimate, not a promise: item 6 (verification) will move slowest.

## Next milestones
- v1.10.3: group A reader defects -> reader 80 -> 90 %
- v1.11.0: Step + Trace (+ View) -> modes 37 -> 75 %
- BLOCK-LIBRARY confirmed by the user (PID first) -> blocks 58 -> 80 % and verification starts moving
