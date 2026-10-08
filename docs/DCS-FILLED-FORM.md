# DCS FILLED FORM — what the user wrote from the DCS (2026-10-08) and how the simulator uses it

File received: `DCS-FORM-PID-MAN-SUMA_FILLED.xlsx` (read in a separate empty folder, `python3 -I`). Extract kept in `tools/data/dcs-form2-filled.json`; the full tables are in docs/ASSUMED-VALUES.md section 5.

## 1. Completeness
| Sheet | Rows | Ticked OK | Empty cells | Notes column |
|---|---|---|---|---|
| PID (incl. 2 PIDV) | 68 | 68 | 0 | empty |
| MAN | 58 | 58 | 0 | empty |
| SUMA | 10 | 10 | 0 | empty |
All 126 PID / MAN rows match a block of the drawings by station + MNO (no row without a block, no block without a row).

## 2. Agreement with the drawings (the file wins when they differ)
| Check | Result |
|---|---|
| PID span (SH − SL) against the span read from the drawing | equal for 65 of 68 |
| PID where they differ | **FIC-OM** (ABC-003E): drawing has no range, file 0 ~ 14 · **HS-COAL** (ABC-004A): no range on the drawing, file 0 ~ 120 · **LICBR1001A** (ABC-010): transmitter range −422 ~ 820 mm, file SV range −24 ~ 74 mm |
| MAN value range (SL ~ SH) against the drawing | equal for 55 of 58 |
| MAN where they differ | **HICHR1002A** (ABC-020): drawing 0 ~ 100 %, file 10 ~ 100 % · **HICFABIASL** (ABC-057): drawing 0 ~ 100 %, file −10 ~ 10 % · **HIC-TADBS** (ABC-002): drawing −30 ~ 30 T/H, file −50 ~ 50 T/H |
| Cross-check with the photos of the faceplates | FIC-CF P 125 / I 25 s / D 0, FICCL1061C range 0 ~ 40 T/H, FIQMS1031 K 5000: the file shows the same numbers where they overlap (FIC-CF P 125, I 25; the MAN row and the SUMA row are different tags in the file than the photos only when the user changed them) |

## 3. What the numbers say (PID, 68 rows)
| Parameter | Smallest | Median | Largest | Remark |
|---|---|---|---|---|
| P (band, %) | 16.6 | 89.25 | 500 | gain = 100 / P: 0.2 … 6.0 |
| I (s) | 0.6 | 129 | 1500 | |
| D (s) | 0 | 0 | 7 | **12 PID have D > 0**: PIC-COBM 7, TICBR1150 7, AICFG10571 3.2, LICBR1001B 5, PICMS1006 5, TICHR1002 5, TICAS1017 5, LICHD11012 5, LICHD11022 5, PICHR1003 5, TICHR1012 6, TICLO1002 2 |
| MH / ML (%) | 25 ~ 101 / −25 ~ 59.7 | 100 / 0 | | **13 PID have limits other than 100 / 0**: PIC-COBM 25 / −25 · TICMS1004 100 / 59.7 · AICFG112 50 / 0 · FIC-CM 87.8 / 0 · TICBR1140 100 / 59.7 · PICDO1008 100 / 5 · LICBR1001 25 / −25 · FICFA1043A / B / C / D 101 / −1 · AICFG10571 35 / 10 · TICHR1002A 100 / 50 |
| dMVH (%) | 5 | 20 | 25 | MV rate limit, not used yet |
| DTI (s) | 0.2 | 1 | 1 | |
| TF (s) | 0 | 0 | 16 | |
| GAP, BND, CUT (%) | 0 | GAP 0 · BND 0 · CUT 5 | GAP 2.5 · BND 0 · CUT 10 | |
| DH (%) | 0 | 0 | 0 | |
| PHONDT, PLONDT (s) | 0 | 0 | 0 | |

## 4. How the simulator uses it now (WIP after v1.16.0, not released)
- PID / PIDV: Kp = 100 / P, Ti = I, Td = D, output limits ML ~ MH, SV range SH − SL = the span of the deviation (% of span), unit from the file. The other parameters are stored in the block (panel text says so) for the later use.
- MAN: value range SL ~ SH, cut by ML ~ MH (% of the range): for example HIC-MWHL 75.5 % of 0 ~ 200 MW = 0 ~ 151 MW.
- SUMA: RSTS, K, DT, TF, CUT, unit of the total are stored.
- Tests changed because the real tunings are not the old defaults: `test-pid-all` and the PID part of `legend-matrix` check the direction with Td = 0 (a derivative kick is not a direction error) and a step of 10 % of the span; `test-loops` centres the process on the middle of the output range; two trim outputs (PIC-COBM −25 ~ 25, AICFG10571 10 ~ 35) are only checked for "bounded and inside the range" because the process gain behind a trim output is unknown. Result with the real values: 68 / 68 PID directions, 68 / 68 closed loops, 2 973 / 2 973 blocks.
