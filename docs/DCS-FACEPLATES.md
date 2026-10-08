# DCS FACEPLATES — the parameters shown by the DCS (user's photos, 2026-10-08)

Photos of the operator faceplates (HMI "MICREX-VieW", station 101 = LMYP-1 #1 CONTROLLER STATION 1) for three tags. They tell which parameters exist for each block type and give a first set of real values. The form to collect them for all tags: `docs/DCS-FORM-PID-MAN-SUMA.xlsx` / `.pdf` (made by `node tools/make-dcs-form2.js <html>`), sorted by station and MNO.

## Cross-check with the drawings (the form is made from the drawings)
| Faceplate | TAGNO | MNO | STNO | Drawing (sheet · MDL address) | Match |
|---|---|---|---|---|---|
| PID "Coal flow control" | FIC-CF | 14 | 101 | ABC-004A · S1-MDL014 | **yes** (MNO = the number of the S1-MDL address) |
| MAN "Coal feeder-C feedrate control" | FICCL1061C | 13 | 101 | ABC-004C · S1-MDL013 | **yes** |
| SUMA "Boiler main steam flow" | FIQMS1031 | 184 | 101 | ABC-001C · S1-MDL184 | **yes** (IO list: FT-MS1031 "Boiler main steam flow", T/H) |

## Parameters of each type (names as on the faceplate; meanings = the assistant's reading, TO CONFIRM)
| Type | Parameters on the faceplate |
|---|---|
| PID | PV, PH, PL, DP · SV, SH, SL, CAS · MV, MH, ML, dMVH · DV, DH, P, I, D · DTI, TF, GAP, BND, CUT · PHONDT, PLONDT (bottom) · ON / OFF switch (top right) · trend PV / SV / MV |
| MAN | PV, PH, PL, DP · SV, SH, SL · MV, MH, ML · DV, DH, DT · TF, FSC (min), CUT · PHONDT, PLONDT · trend |
| SUMA | PV, PH, PL, DP, RES (reset = 1, no = 0) · SUM, RSTS, TIME, DT, K · TF, CUT · PHONDT, PLONDT · trend of PV |

## Values seen
| Tag | Values |
|---|---|
| FIC-CF (PID, %) | PV 0.0 · PH 100.0 · PL 0.0 · DP 0.00 · SV 0.0 · SH 100.0 · SL 0.0 · CAS 0.0 · MV 0.0 · MH 100.0 · ML 0.0 · dMVH 25.0 % · DV 0.00 · DH 5.00 % · **P 125.0 %** · **I 25.0 s** · **D 0.0 s** · DTI 1.0 s · TF 0.0 s · GAP 0.0 % · BND 0.0 % · CUT 0.00 % · PHONDT 0.0 s · PLONDT 0.0 s |
| FICCL1061C (MAN, T/H) | PV 0.0 · PH 40.0 · PL 0.0 · SV 0.0 · SH 40.0 · SL 0.0 · MV 0.0 · MH 100.0 · ML 0.0 · DV 0.00 · DH 0.00 · DT 1.0 s · TF 6.0 s · FSC 0.00 min · CUT 0.00 % · PHONDT 0.0 s · PLONDT 0.0 s (trend axes 0 ~ 40 T/H and 0 ~ 100 %) |
| FIQMS1031 (SUMA, T/H) | PV 24.0 · PH 10.0 · PL -2.5 · DP 0.00 · RES 0 · SUM 32405573.4 T · RSTS 99999999.9 T · TIME 89546H 9M 23S · DT 1.0 s · K 5000 · TF 0.0 s · CUT 0.00 % · PHONDT 0.0 s · PLONDT 0.0 s (trend axis 0 ~ 500 T/H) |
Earlier OPC reading of FICFA1043B (docs/OPC-NOTES.md): P 200, I 50, D 0, MHD 101, MLD -1, DHD 10, DTI 1.

## What this says (and what is still a question)
- **P is a percent (125.0 %, 200)**: proportional band, gain = 100 / P (FIC-CF: gain 0.8; simulator default 1). I in seconds (25 s; simulator default 15 s). Confirm with the form.
- **PH / PL are not always the range**: the SUMA has PV 24.0 T/H with PH 10.0 and PL -2.5, so there PH / PL behave like high / low LIMITS (with PHONDT / PLONDT = on-delay times). For the PID and MAN the values equal the range (100 / 0, 40 / 0). The form asks for what each faceplate shows.
- Not used by the simulator yet (recorded for later): dMVH (MV rate limit), DTI / DT (calculation interval), TF (input filter), GAP, BND, CUT, DH, PHONDT / PLONDT, FSC (MAN full-stroke time), K / RSTS (SUMA).
