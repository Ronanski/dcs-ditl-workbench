# PLAN A..G (agreed with the user, 2026-10-07)

RULE: nothing from this list is built / released one by one. Work on all of A..G (+ manual), test, and only when ALL are complete: ONE new version (v1.13.0) is built and released (exe + apk + html in GitHub Releases). Work in progress lives in `wip/` (does not trigger a release). Update the status below after every step.

| # | Item | Status |
|---|---|---|
| A | One version everywhere, new name logic-sim-vX.Y.Z, exe + apk + GitHub Releases pipeline | DONE (v1.12.0, released) |
| B | PID: realistic default tuning by loop type (flow / pressure / temperature / level / analysis), suggested speed per PID | TODO |
| C | FX linear tables: strict station + LN lookup, warnings (no silent fallback), station of each sheet | TODO |
| D | Reader fixes: constants read as ratio / with unit (DONE v1.12.1); T with only a "25%" constant (IGNITION POS.) read as a constant | PART DONE (constants), constant-T TODO |
| E | SEL = average of the healthy transmitters (SIG.AB), CTK = conditional write (no zero) | TODO |
| F | Pause = Step (+1 scan, +1 s, +10 s, flash what changed) · View mode (no force, no simulation) · Trace (upstream / downstream) · "Why?" | TODO |
| G | Descriptions from the IO list and the memory lists (unit 1), address highlight when selected | TODO |
| I | LN table editor: edit LX % / LY %, X / Y recalculate, own Reset (not the global Reset), keep the existing graph | TODO |
| M | Manual (installation, familiarization, how to use, troubleshooting): docs/MANUAL.md, in the README, separate PDF; updated every release | TODO |
| H | APK | DONE inside A |

Open questions to the user are in docs/BACKLOG.md. ABC-052 AND #112 (a bar drawn without gate body): nobody can see it in the ladder either: ignored.
