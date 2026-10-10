# RATE / ramp regression - logic-sim-v1.20.9.html

Counts: {"PASS":113,"NOT TESTED":30,"NEEDS REVIEW":11}

Unit conversion (%/sec, %/min, %/hr, absolute), instrument-tag input, gradual response by elapsed time, ramp vs bypass.

Record fields: sheet, block, input conditions, expected value/unit, actual value/unit, source of expected, evidence, status, correction, retest status. Full records (incl. PASS): `TEST-RESULTS-RATE.json`.

| sheet | block | input | expected | actual | source of expected | status | evidence |
|---|---|---|---|---|---|---|---|
| ABC-003B | RAMPB#30 | source of the input: CONST#53 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-003C | RAMPB#30 | source of the input: CONST#53 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-003D | RAMPB#30 | source of the input: CONST#53 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-003E | RATE#28 | - | - | - | - | NOT TESTED | own limit inputs (limits come from other signals) |
| ABC-003E | RATE#29 | - | - | - | - | NOT TESTED | own limit inputs (limits come from other signals) |
| ABC-003E | RATE#30 | - | - | - | - | NOT TESTED | own limit inputs (limits come from other signals) |
| ABC-003E | RATE#31 | - | - | - | - | NOT TESTED | own limit inputs (limits come from other signals) |
| ABC-004A | RATE#74 | source of the input: LINK#-1 | - | not an instrument: cross-sheet link, source is on another sheet | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-004A | RATE#75 | source of the input: MAN#16 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-004B | RATE#25 | field / manual input net 27 (set 0 then 50) | RATE input follows the supplied simulation value | block input 0 -> 0 | drawn wiring source -> block input | NEEDS REVIEW | no response: a switch leg / limiter on the path blocks it in the default state |
| ABC-004B | RATE#26 | field / manual input net 30 (set 0 then 50) | RATE input follows the supplied simulation value | block input 0 -> 0 | drawn wiring source -> block input | NEEDS REVIEW | no response: a switch leg / limiter on the path blocks it in the default state |
| ABC-004C | RATE#25 | field / manual input net 1 (set 0 then 50) | RATE input follows the supplied simulation value | block input 0 -> 0 | drawn wiring source -> block input | NEEDS REVIEW | no response: a switch leg / limiter on the path blocks it in the default state |
| ABC-004C | RATE#26 | field / manual input net 41 (set 0 then 50) | RATE input follows the supplied simulation value | block input 0 -> 0 | drawn wiring source -> block input | NEEDS REVIEW | no response: a switch leg / limiter on the path blocks it in the default state |
| ABC-007 | RAMPB#18 | rate text "RAMP:0.05% / sec" | 0.05 units/s | 0.05 units/s | RAMP:0.05% / sec x span 100 (span NOT resolved, 100 assumed) | NEEDS REVIEW | span of the signal not found (no AI / controller range / table range on the path): user decision: default for now (rate applied as written) |
| ABC-009A | RATE#97 | source of the input: MAN#15 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-009A | RATE#98 | source of the input: MAN#42 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-009A | RATE#99 | source of the input: MAN#55 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-009B | RATE#20 | field / manual input net 40 (set 0 then 50) | RATE input follows the supplied simulation value | block input 12 -> 12 | drawn wiring source -> block input | NEEDS REVIEW | no response: a switch leg / limiter on the path blocks it in the default state |
| ABC-020 | RATE#91 | field / manual input net 37 (set 0 then 50) | RATE input follows the supplied simulation value | block input 19 -> 19 | drawn wiring source -> block input | NEEDS REVIEW | no response: a switch leg / limiter on the path blocks it in the default state |
| ABC-032 | RAMPB#13 | source of the input: CONST#10 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-034 | RATE#26 | bypass path | - | no bypass pin on this block | - | NOT TESTED |  |
| ABC-050 | RAMPB#23 | source of the input: CONST#19 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-050 | RATE#83 | source of the input: CONST#43 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-051 | RAMPB#24 | source of the input: CONST#19 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-052 | RAMPB#14 | source of the input: CONST#17 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-052 | RATE#87 | - | - | - | - | NOT TESTED | own limit inputs (limits come from other signals) |
| ABC-052 | RATE#88 | source of the input: CONST#72 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-001B | RATE#13 | - | - | - | - | NOT TESTED | own limit inputs (limits come from other signals) |
| ABC-053 | RAMPB#15 | source of the input: CONST#25 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-057 | RATE#67 | rate text "0.1% / sec" | 0.1 units/s | 0.1 units/s | 0.1% / sec x span 100 (span NOT resolved, 100 assumed) | NEEDS REVIEW | span of the signal not found (no AI / controller range / table range on the path): user decision: default for now (rate applied as written) |
| ABC-057 | RATE#67 | source of the input: CONST#6 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-057 | RATE#67 | bypass path | - | no bypass pin on this block | - | NOT TESTED |  |
| ABC-001C | RATE#47 | rate text "18% / Hr" | 0.005 units/s | 0.005 units/s | 18% / Hr x span 100 (span NOT resolved, 100 assumed) | NEEDS REVIEW | span of the signal not found (no AI / controller range / table range on the path): user decision: default for now (rate applied as written) |
| ABC-001C | RATE#47 | source of the input: CONST#43 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-001D | RATE#3 | source of the input: CONST#6 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-001D | RATE#4 | source of the input: CONST#6 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |
| ABC-002 | RATE#75 | rate text "0.2% / sec" | 0.2 units/s | 0.2 units/s | 0.2% / sec x span 100 (span NOT resolved, 100 assumed) | NEEDS REVIEW | span of the signal not found (no AI / controller range / table range on the path): user decision: default for now (rate applied as written) |
| ABC-002 | RATE#75 | bypass path | - | no bypass pin on this block | - | NOT TESTED |  |
| ABC-002 | RATE#76 | rate text "0.2% / sec" | 0.2 units/s | 0.2 units/s | 0.2% / sec x span 100 (span NOT resolved, 100 assumed) | NEEDS REVIEW | span of the signal not found (no AI / controller range / table range on the path): user decision: default for now (rate applied as written) |
| ABC-002 | RATE#76 | bypass path | - | no bypass pin on this block | - | NOT TESTED |  |
| ABC-003A | RAMPB#32 | source of the input: CONST#69 | - | not an instrument: operator / controller / constant | drawn wiring | NOT TESTED | no instrument tag directly on the path |

PASS records: 113 (listed only in the json).