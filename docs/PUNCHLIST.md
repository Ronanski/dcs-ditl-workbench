# PUNCHLIST — what still needs correction or a decision (v1.15.0, 2026-10-07)

**A. Real corrections still to do** (a defect or a gap in the html)
| # | Where | Problem | Action needed | Who |
|---|---|---|---|---|
| P1 | ABC-001C TR228 (212, 162) | Drawing says TON 2 s, the user's memory list says TPs 2 | Look at the drawing with the user; change the type if the memory list is right | assistant + user |
| P2 | ABC-004A circles "A" at (194, 354) and (381, 95) | Not linked by letter (partners are B / C of 004B / 004C by tag SI0110) | Pair them properly (fan-in from two sheets) and test | assistant |
| P3 | ABC-020 circle "9" at (501, 599) | No partner circle on any sheet | Find the partner on the PDF or confirm it is an exit | assistant + user |
| P4 | 45 "tags differ" lines of audit-links (003B / C / D "2", 004A FFD, 009A / B "L", 012 "MST", 013 / 050 "BOF", 015 / 016 "1" - 057 ...) | The tag written beside the two ends of a circle pair is different | Look at each on the drawing: wrong pair or two names of one signal | assistant |
| P5 | ABC-003E TPS #70 (TR256) | The scan cannot make the output 1 (reset OR M.0097 has 7 inputs) | Show it by hand: set M.0097 inputs, watch the pulse | assistant |
| P6 | PIDV | Runs as a normal velocity-form PID; the pulse is only shown by the PO | Real pulse-output PID if the user wants it | assistant (needs the DCS pulse settings) |
| P7 | Whole app | Persistent DXF import and report of drawing changes | Build it (project rule: keep a saved project before importing) | assistant |

**B. Values and confirmations only the user (or the DCS) can give**
| # | Item | Now |
|---|---|---|
| P8 | ALM limits of 104 alarms | ASSUMED (docs/ASSUMED-VALUES.md section 4) |
| P9 | Ramp rates of 8 boxes | ASSUMED |
| P10 | PO pulse cycle / stroke / shortest pulse | ASSUMED 2 s / 60 s / 0.2 s |
| P11 | PID gains | default tuning by loop type |
| P12 | PRI / SEC / AVG default mode of the SEL blocks | default AVG |
| P13 | Units of S1-LN38 / S1-LN39 (drum level) | deduced (identity at 0 kg/cm2): confirm with the DCS table |
| P14 | exe and apk | built, never run on a real Windows / Android device |
| P15 | Block kinds | none confirmed by the user yet (block behaviour is capped at 60 % until he confirms) |
| P16 | Sheet-by-sheet comparison with the PDFs | 1 of 51 sheets (ABC-050) |

**C. Known, harmless (not corrections)**: O-01 extra two-cell box above the I/P read as SUB with no output (ABC-008, 014) · O-02 tick marks at PID / MAN box edges read as extra pins · ABC-052 AND #112 (ignored by the user) · ABC → DITL crossings not simulated by design · 91 "TO DITL" exits.
