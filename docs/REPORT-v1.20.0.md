# REPORT v1.20.0 - Plant window (Reheater) and PID direction fix

## What is new
1. **Plant window** (toolbar button Plant, replaces HMI): pop-out window (floating window where pop-ups are blocked) with the plant graphics of the REHEATER system (screen 005): HP / LP bypass, spray water, hot reheat pressure control, six controller boxes. Values = addresses of the ABC sheets (same engine), F box FORCE / SIM, the sheets and panel are view-only while it is open. Details: docs/PLANT-WINDOW.md.
2. **PID direction (FINDINGS H-37)**: 29 ACT:N loops acted reverse. Now ACT:N = direct, ACT:R = reverse (tools/patch-pidsign.js). Evidence: DCS snapshot values and the P&ID K1AU3-A1-0-001 (bypass valves relieve pressure). tools/test-pidsign.js: 65 of 65 (v1.19.1: 36 of 65). **To be confirmed with the DCS.**
3. Operating point: transmitters nobody sets start at the snapshot values; modelled bypass loops sit at them at mid output.

## Tested (same build)
blocks 526/526, math 998/998, legend 0 mismatch, PID 68/68, loops 68/68, pidsign 65/65, legend-matrix 2973/2973, proc 55/55, force-all (55, 41/41, 45/45), lock-all (68 plant points disabled, 74 free), fixes, own, ui-real, trend, hmi, hmi2, path, circles 82/82, trace-x 148/148, reach 0/0, plant, badges, DITL guard IDENTICAL. Known (same on v1.19.1): links-all 1 FAIL ABC-004A>ABC-005 TCF1; cos list; numinput info line.
## NOT tested
apk / exe pop-out; digital feedbacks (ZSO / ZSC); PICHR1391 / HICBR1391 boxes; the DEAERATOR snapshot row (PICDO1008) does not fit the new direction (mapping of that row unsure).
## Limits
No coupling between loops; SV of a loop is what the sheet gives (press F on the SV); digital address-value rule not checked; no exe / apk built in this release.
