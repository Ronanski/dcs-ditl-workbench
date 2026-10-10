# ABC-002 minimum air flow - logic-sim-v1.20.8.html

Counts: {"PASS":7,"NEEDS REVIEW":1}



Record fields: sheet, block, input conditions, expected value/unit, actual value/unit, source of expected, evidence, status, correction, retest status. Full records (incl. PASS): `TEST-RESULTS-MINAIR.json`.

| sheet | block | input | expected | actual | source of expected | status | evidence |
|---|---|---|---|---|---|---|---|
| ABC-002 | CONST#1 | conversion 0.08 % per T/H | conversion written on the drawing | not on the drawing; chosen so that the default equals 32 % | drawing SCALE CONVERT 35 / 1115 = 0.0314 % per T/H differs | NEEDS REVIEW | user decision: default 400 T/H; relation to the % signal to be confirmed |

PASS records: 7 (listed only in the json).