# LINEAR.xls reference verification

Counts: {"PASS": 376, "NEEDS REVIEW": 4}

| sheet | block | input | expected | actual | status | evidence |
|---|---|---|---|---|---|---|
| ABC-010 | table S1-LN38 | - | table in LINEAR.xls | not in the file | NEEDS REVIEW | embedded from another reference file (Drum Level Calculation.xls) |
| ABC-010 | table S1-LN39 | - | table in LINEAR.xls | not in the file | NEEDS REVIEW | embedded from another reference file (Drum Level Calculation.xls) |
| ABC-010 | FX#18 LN38 | table used = S1-LN38 | table whose drawing number is this sheet (xls DWG No. None) | S1-LN38 | NEEDS REVIEW | drawing number of the xls table vs sheet of the FX block |
| ABC-010 | FX#19 LN39 | table used = S1-LN39 | table whose drawing number is this sheet (xls DWG No. None) | S1-LN39 | NEEDS REVIEW | drawing number of the xls table vs sheet of the FX block |

PASS records: 376 (json).