# REPORT v1.19.0 - what was done since v1.18.0 (2026-10-08) - documentation revision 1 - RELEASED

Built by `tools/patch-1.19.0.js` (v1.18.0 pipeline + `patch-own`, `patch-fix`, `fix-data`, the plant layer in `patch-proc`, `patch-ui`). DITL page identical to v1.18.0 (guard). **AN_PV 16 -> 17** (the net numbers of 12 sheets changed: saved inputs / forces of those sheets are ignored once).

## 1. Requests of the user -> what was done
| # | Request / finding | Done | Test |
|---|---|---|---|
| 1 | Panel widens by itself; wrap the text, a little wider | fixed 380 px, wrapped | test-ui-real |
| 2 | HMI view only, cannot simulate | real-click bug fixed (H-20); HMI open = HMI controls | test-ui-real, test-own |
| 3 | Trend and panel not in step on SV; the arrows | the PV / SV pins were swapped on 30 of 68 PID (H-22); arrows apply (H-24); one clock | test-own, test-trend |
| 4 | Trend only for PID, PIDV, MAN, SUMA, FX, integrators | done | test-trend |
| 5 | PV slider disabled; plant answers at the INPUT; FORCE / SIM wins; analog and digital, in RUN | plant layer (transmitter / input / pin / shared / remote), F box in the HMI | test-proc 54 / 54, test-force-all (55 loops), test-lock-all (66 points), test-own, test-proc-app |
| 6 | Gain / time constant: estimate them | estimated from the tuning, listed in docs/PLANT-MODEL.md | - |
| 7 | IO list: use it | docs/SIGNAL-ROLES.md | tools/audit-roles.js |
| 8 | O2 select circuit gave 0.00 instead of 4.45 | H-31 fixed (reader) | test-fixes |
| 9 | O2 correction 80 instead of 0.8 | H-33 fixed (LN15, LN21) | test-fixes |
| 10 | Circle without value; cannot follow the link in RUN | H-34 fixed | test-circles: 219 / 219 links with real clicks, 82 / 82 values |
| 11 | Wires not right | H-32 arrow into a wire joins it (11 sheets); wiring audit with screenshots of the suspects (12 groups checked: false alarms); DESIGN rule 17: test from the input to the output | test-fixes, tools/audit-wiring.js |
| 12 | Red banner "Cannot read properties of undefined (reading pts)" | the Trend of the panel redrew with the model of ANOTHER selection; it now keeps its own block; the refresh loop of the panel cannot show the banner | test-fixes |

## 2. Tests of this release (root html)
See the table in PROJECT-NOTES-v1.19.1.md (all listed there were run on `logic-sim-v1.19.0.html`).

## 3. Not done / not proven
- docs/WIRING-SUSPECTS.md: 23 + 63 suspects, most are labels beside the wire; the rest needs the user's eye on the drawings (ABC-007, 008, 010, 013, 015, 016, 019, 031, 001A, 001B, 001C, 051, 057).
- Tracking loops (DEV + T switch fed by a tag text with an arrow) of ABC-003E / 004A / 004B / 004C / 009A / 009B / 020: input is a tag value, the user sets it.
- Digital feedbacks of motors / valves, CCS scenarios, SQRT scaling (H-30), gain / time constant are estimates, dMVH / TF / FSC not simulated, ALM / SEL defaults assumed.
- exe / apk not tested by the assistant.
