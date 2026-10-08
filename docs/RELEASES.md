# RELEASES — version and revision of the documentation

Rule: every release gets a row here; the report of the release is `docs/REPORT-vX.Y.Z.md`. **Revision** = revision of the documentation set for that version (starts at 1; goes up if the docs are corrected without a new build).

| Version | Revision | Date | Build | Report | Summary |
|---|---|---|---|---|---|
| WIP after v1.15.1 | — | 2026-10-08 | not released (no "go") | docs/SIMPLE-SUMMARY.md | H-17 (ABC-004A circles), TR256 sequence test, 68 closed-loop PID tests, persistent DXF import + drawing-change report (P7), DCS data form, OPC notes, Trace across sheets (T1); progress 85.9 % |
| v1.15.1 | 1 | 2026-10-07 | `logic-sim-v1.15.1.html` (+ exe, apk, GitHub Release v1.15.1) | docs/REPORT-v1.15.0.md section 8, docs/LEGEND-MATRIX.md | Legend matrix: 2 973 of 2 973 blocks of the 51 sheets pass the function of their symbol; H-15 (mirrored AND on ABC-001D), H-16 (3 positioner boxes); 45 "tags differ" link lines checked: 0 wrong; links 182 / 182. Open: O-05, O-07, O-08, O-11 |
| v1.15.0 | 1 | 2026-10-07 | `logic-sim-v1.15.0.html` (+ exe, apk, GitHub Release v1.15.0) | docs/REPORT-v1.15.0.md | Signals must arrive: dead ends 223 + 4 orphans -> 0; 36 AND gates, 44 AI pins, 45 chained circles, arrow gaps, junction dots fixed; every link carries its value (182 / 182); Compensation file -> 8 TP; Drum Level file -> S1-LN38 / LN39; 104 ALM limits, 8 ramp rates, PO pulse ASSUMED (docs/ASSUMED-VALUES.md); 4-way selectors; timers 150 / 153 and AI ranges 157 / 157 equal to the user's memory / IO lists. Not tested: exe / apk on devices, real plant, PDF comparison. Open: O-05, O-07, O-08, O-09, O-11 |
| v1.14.3 | — | 2026-10 | `logic-sim-v1.14.3.html` | PROJECT-NOTES (archive) | Legend test (FF / timers), circles, MAN, NOT elbow pins |
