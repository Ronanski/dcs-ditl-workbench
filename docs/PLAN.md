# PLAN A..G (agreed with the user, 2026-10-07)

RULE: nothing from this list is built / released one by one. Work on all of A..G (+ manual), test, and only when ALL are complete: ONE new version (v1.13.0) is built and released (exe + apk + html in GitHub Releases). Work in progress lives in `wip/` (does not trigger a release). Update the status below after every step.

| # | Item | Status |
|---|---|---|
| A | One version everywhere, new name logic-sim-vX.Y.Z, exe + apk + GitHub Releases pipeline | DONE (v1.12.0, released) |
| B | PID: realistic default tuning by loop type (flow / pressure / temperature / level / analysis), suggested speed per PID | DONE in wip (18 flow, 19 pressure, 16 level, 11 temperature, 2 analysis, 2 general) |
| C | FX linear tables: strict station + LN lookup, warnings (no silent fallback), station of each sheet | DONE in wip (109 of 111 exact; ABC-010 LN38 / LN39 warn: only S2 has them) |
| D | Reader fixes: constants read as ratio / with unit (v1.12.1); T with only a "25%" constant (IGNITION POS.) read as a constant | DONE in wip (003A/B/C/D) |
| E | SEL = average of the healthy transmitters (SIG.AB), CTK = conditional write (no zero) | DONE in wip (tested) |
| F | Pause = Step (+1 scan, +1 s, +10 s, flash what changed) · View mode (no force, no simulation) · Trace (upstream / downstream) · "Why?" | DONE in v1.13.0 (Trace this sheet only) |
| G | Descriptions from the IO list and the memory lists (unit 1), address highlight when selected | DONE in v1.13.0 |
| I | LN table editor: edit LX % / LY %, X / Y recalculate, own Reset (not the global Reset), keep the existing graph | DONE in wip (tools/test-ln.js) |
| M | Manual (installation, familiarization, how to use, troubleshooting): docs/MANUAL.md, in the README, separate PDF; updated every release | DONE in v1.13.0 (docs/MANUAL.md + PDF) |
| H | APK | DONE inside A |

Open questions to the user are in docs/BACKLOG.md. ABC-052 AND #112 (a bar drawn without gate body): nobody can see it in the ladder either: ignored.
