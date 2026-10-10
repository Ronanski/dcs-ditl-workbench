# RATE / ramp vs bypass verification - logic-sim-v1.20.8.html

Counts: {"NEEDS REVIEW":23,"PASS":47,"NOT TESTED":10}

Same input change applied to the ramp path and the bypass path.

Record fields: sheet, block, input conditions, expected value/unit, actual value/unit, source of expected, evidence, status, correction, retest status. Full records (incl. PASS): `TEST-RESULTS-RATE.json`.

| sheet | block | input | expected | actual | source of expected | status | evidence |
|---|---|---|---|---|---|---|---|
| ABC-003B | RAMPB#30 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-003C | RAMPB#30 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-003D | RAMPB#30 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-003E | RATE#28 | limits from signals | limits follow the up/down limit signals | not exercised | drawing text: (no rate text found) | NOT TESTED | own-limit RATE: needs per-sheet limit values |
| ABC-003E | RATE#29 | limits from signals | limits follow the up/down limit signals | not exercised | drawing text: (no rate text found) | NOT TESTED | own-limit RATE: needs per-sheet limit values |
| ABC-003E | RATE#30 | limits from signals | limits follow the up/down limit signals | not exercised | drawing text: (no rate text found) | NOT TESTED | own-limit RATE: needs per-sheet limit values |
| ABC-003E | RATE#31 | limits from signals | limits follow the up/down limit signals | not exercised | drawing text: (no rate text found) | NOT TESTED | own-limit RATE: needs per-sheet limit values |
| ABC-004A | RAMPB#35 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-007 | RAMPB#17 | ramp path: step 0 -> 3, bypass 0; rate 0.05 units/s | t=1s 0.05, t=2s 0.1 | 0.05 , 0.1 | drawing text: RAMP:0.05% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-007 | RAMPB#18 | ramp path: step 0 -> 3, bypass 0; rate 0.05 units/s | t=1s 0.05, t=2s 0.1 | 0.05 , 0.1 | drawing text: RAMP:0.05% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-019 | RAMPB#17 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-020 | RAMPB#52 | ramp path: step 0 -> 3, bypass 0; rate 0.016666666666666666 units/s | t=1s 0.016666666666666666, t=2s 0.03333333333333333 | 0.016666666666666666 , 0.03333333333333333 | drawing text: RAMP:1% / min | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-032 | RAMPB#13 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-034 | RATE#26 | ramp path: step 0 -> 3, bypass 0; rate 0.016666666666666666 units/s | t=1s 0.016666666666666666, t=2s 0.03333333333333333 | 0.016666666666666666 , 0.03333333333333333 | drawing text: 1% / min | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-034 | RATE#26 | bypass path | - | no bypass pin on this block | drawing text: 1% / min | NOT TESTED |  |
| ABC-050 | RAMPB#23 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-050 | RATE#83 | ramp path: step 0 -> 15, bypass 0; rate 5 units/s | t=1s 5, t=2s 10 | 5 , 10 | drawing text: 5% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-051 | RAMPB#24 | ramp path: step 0 -> 3, bypass 0; rate 0.02783333333333333 units/s | t=1s 0.02783333333333333, t=2s 0.05566666666666666 | 0.02783333333333333 , 0.05566666666666666 | drawing text: RAMP:1.67% / min | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-052 | RAMPB#14 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-052 | RATE#87 | limits from signals | limits follow the up/down limit signals | not exercised | drawing text: X% / sec | NOT TESTED | own-limit RATE: needs per-sheet limit values |
| ABC-001B | RATE#13 | limits from signals | limits follow the up/down limit signals | not exercised | drawing text: (no rate text found) | NOT TESTED | own-limit RATE: needs per-sheet limit values |
| ABC-053 | RAMPB#15 | ramp path: step 0 -> 3, bypass 0; rate 0.5 units/s | t=1s 0.5, t=2s 1 | 0.5 , 1 | drawing text: RAMP:0.5% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-057 | RATE#67 | ramp path: step 0 -> 3, bypass 0; rate 0.1 units/s | t=1s 0.1, t=2s 0.2 | 0.1 , 0.2 | drawing text: 0.1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-057 | RATE#67 | bypass path | - | no bypass pin on this block | drawing text: 0.1% / sec | NOT TESTED |  |
| ABC-001C | RATE#47 | ramp path: step 0 -> 3, bypass 0; rate 0.005 units/s | t=1s 0.005, t=2s 0.01 | 0.005 , 0.01 | drawing text: 18% / Hr ; ( 0.005% / sec ) | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-001D | RATE#3 | ramp path: step 0 -> 3, bypass 0; rate 0.000625 units/s | t=1s 0.000625, t=2s 0.00125 | 0.000625 , 0.00125 | drawing text: 2.7T / HR = 2.25% / HR ; ( 0.045T / MIN ) | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-001D | RATE#4 | ramp path: step 0 -> 3, bypass 0; rate 0.0004166666666666667 units/s | t=1s 0.0004166666666666667, t=2s 0.0008333333333333334 | 0.0004166666666666667 , 0.0008333333333333334 | drawing text: 1.8T / HR = 1.5% / HR ; ( 0.03T / MIN ) | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-002 | RAMPB#27 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-002 | RATE#75 | ramp path: step 0 -> 3, bypass 0; rate 0.2 units/s | t=1s 0.2, t=2s 0.4 | 0.2 , 0.4 | drawing text: 0.2% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-002 | RATE#75 | bypass path | - | no bypass pin on this block | drawing text: 0.2% / sec | NOT TESTED |  |
| ABC-002 | RATE#76 | ramp path: step 0 -> 3, bypass 0; rate 0.2 units/s | t=1s 0.2, t=2s 0.4 | 0.2 , 0.4 | drawing text: 0.2% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |
| ABC-002 | RATE#76 | bypass path | - | no bypass pin on this block | drawing text: 0.2% / sec | NOT TESTED |  |
| ABC-003A | RAMPB#32 | ramp path: step 0 -> 3, bypass 0; rate 1 units/s | t=1s 1, t=2s 2 | 1 , 2 | drawing text: RAMP:1% / sec | NEEDS REVIEW | ramp arithmetic correct, but the rate is written in % and applied as signal units (valid only for a 100-unit span) |

PASS records: 47 (listed only in the json).