# Sheet triage (v1.10.2) — which sheets really need checking

Method (tools/triage.js): every sheet is run with 80 random input sets (digital 0/1, analog, transmitters, manual stations, bad-signal flags) + 15 s of time each.
A logic output that NEVER changes is "stuck": either a real reader / logic defect or a rare interlock. Also counted: constants whose value was not found (read as 0) and logic blocks with no input.
This is a SCREEN, not a proof of correctness against the DCS.

## Result: 51 sheets -> 3 groups
**Group A — reader defects (fix first, shared causes):** constants "value not found" = 18, blocks without input = 6
ABC-002 (5 const, 1 no-input), ABC-006 (3), ABC-001B (3), ABC-010 (1), ABC-052 (1 + 1), ABC-001C (1), ABC-032 (1), ABC-004A (1), ABC-005 (1), ABC-056 (1), ABC-003A/B/C/D (1 no-input each: open T drawn that way)

**Group B — many stuck outputs (198 of 2015 logic outputs, 10%):** ABC-003E (21), ABC-010 (20), ABC-002 (18), ABC-052 (12), ABC-009A (12), ABC-020 (11), ABC-003A (10), ABC-007 (10), ABC-030 (10), ABC-001C (8), ABC-019 (6), ABC-006 (5), ABC-009B (5), ABC-012 (5), then 4 or fewer on 004C, 026, 031, 032, 004A, 005, 013, 056, 008, 027, 001A, 001D, 050, 051.
Typical causes seen: chains that start at a constant read as 0, FX with no input, PID pass-through feeding comparators, rare AND interlocks.

**Group C — clean (19 sheets: at most 1 stuck output, no reader defect):** 004B, 011, 014, 015, 016, 017, 028, 029, 033, 034, 035-039 (identical), 053, 054, 055, 057
These need only a spot check by eye, one per cluster (035-039 = ONE sheet).

## So the user's checking list becomes
1. After the reader fixes of group A (done by Claude): re-run the triage, then check group B sheets one by one, worst first: 003E, 010, 002, 052, 009A, 020, 003A, 007, 030, 001C.
2. 003B/C/D are the same drawing: check 003B only, Claude diffs the other two.
3. Group C: spot check 014, 017, 035, 053, 055, 057 (one each); the rest follow.
Roughly 51 sheets -> about 14 sheets to review in detail + 6 spot checks.

## Update v1.12.1
Group A constants fixed: not found 18 -> 0; stuck outputs 198 -> 156; clean sheets 19 -> 25 (added 004A, 005, 006, 032, 001B, 056). Still flagged: 6 blocks without input (ABC-003A/B/C/D T "IGNITION POS. 25%" with no wires, ABC-052 AND #112): open in the drawing itself.
