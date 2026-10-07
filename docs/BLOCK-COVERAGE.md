# Block coverage and sheet clusters (analysis of v1.10.1, 51 sheets without the symbol list)

## How well each block type is simulated
| status | blocks (count in all sheets) |
|---|---|
| full logic | AND 174, OR 173, NOT 243, FF 47, TON 35, TOF 18, TPS 107, TPV 1, T/SW 163 + AMT 225 (select), COS 172 (manual), comparators HC 118 / LC 102 / HS 15 / LS 4 / CMPK 12 / PVSV 2 / DCMP 3, limits HLIM 4 / LLIM 5 |
| full math | ADD 8, SUB 53, MUL 53, DIV 11, DEV 92, SUM 60, SQRT 13, ABS 7, F(X) 111 (needs the LN tables), LAG 14, RATE 24, RAMPB 15 |
| field / valves | AI 201 (user input), AO 90, I/P 45, ACT 37, VLV 44 (stroke, travel time, pneumatic animation) |
| **SIMPLIFIED** | **PID 66 + PIDV 2: output follows input (no real P/I/D, no SV/PV loop) — needed for any closed loop with the plant simulator.** MAN station 74 (value + range only). SEL 26 (averages the inputs — must be checked against the DCS manual: high / low / median select?). CTK 5. |
| pass-through only | TP 8, PO 2, FIELD 11, ALM 104 (alarm blocks show/pass the value, no alarm logic) |
| drawing only | TXD 201 (text), ACH 42 (actuator head), FOUT 6 (output flag) |
| SET SV notes | done for ABC-017/029/030/033/050/054/055/056; "SET SIxxxx => TAG.SV" (007, 013, 051, 052) writes into a controller on another sheet: not simulated |

## Clusters of near-identical sheets (structure similarity >= 80%)
- 035, 036, 037, 038, 039 — HPH level control (48 blocks each) -> analyse ONE, check the other four by diff
- 003B, 003C, 003D — burner control (110-111 blocks)
- 004B, 004C — coal feeder (42)
- 011, 012 — superheater outlet temp (74/77)
- 026, 027 — furnace temperature (89/87)
That removes 9 of 51 sheets. The rest (42) are one-of-a-kind sheets, so the real saving is in RECURRING MOTIFS, not whole sheets:
1. AI -> PID -> T (auto/manual) -> AO -> valve with position feedback (bumpless transfer, "1:BYPASS")
2. T priority chains (ABC-050 WARM/HOT/ICV) and COS manual inputs (172)
3. "IF M.xxxx = 1 SET SV = n" presets
4. SIG.AB bad-signal flags + HS/LS alarms
5. RAMP (RAMPB) with bypass, F(X) linearization
Plan: make each motif correct once in the engine + a test sheet per motif, then run the audit on all sheets.

## Sheets most similar to ABC-050 (the reference)
Low similarity (051 0.17, 052 0.16, 053 0.15): ABC-050 is a one-off, so its fixes were applied as ENGINE rules (T legs, presets, ramps, valves), not copied per sheet.
