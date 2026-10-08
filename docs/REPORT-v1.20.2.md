# REPORT v1.20.2
User: "Analog lang may LIVE value. Ung digital kahit wala na. Tapos ung link sa DITL, di gumagana."
1. Digital badges (1 / 0) of v1.20.1 removed. Analog addresses: ONE live value per text (1522 of 1529; 7 unresolved are listed in docs/ADDRESS-VALUES.md): SI / AI, instrument tags (IO-list tag = its AI), valve tags and AO; no doubles; the same address on several wires of a sheet is one signal (undriven copies follow the driven one).
2. Link to the DITL page: clicking a circle with "FROM / TO DITL pp-nn" or the reference in the DITL signals list opens the DITL page at that sheet (124 of 124 references; tools/test-ditl-link.js). FINDINGS H-39, docs/ADDRESS-VALUES.md.
NOT done: live exchange of signals between the DITL page and the ABC sheets (FROM DITL stays a one-click input, by the user's earlier decision) - to be confirmed. NOT tested: exe / apk on a device; highlighting of the item nn inside the DITL sheet (not implemented).
Regression: same list as v1.20.1 re-run on this build (see the commit message / PLANT-WINDOW.md list).

Regression of this build: blocks 526, math 998, legend 0, PID 68, loops 68, pidsign 65, matrix 2973, proc 55, force-all, lock-all, fixes, own, ui-real, trend, hmi, hmi2, path, trace-x, reach 0/0, plant, badges, addr audit, ditl-link, circles, DITL guard IDENTICAL. Known old: links-all 1 FAIL (004A>005 TCF1), cos list, numinput info.
