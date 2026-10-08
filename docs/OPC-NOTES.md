# OPC-NOTES — PID / tag data that the user can read through the OPC UA server (UaExpert)

Source: photo of UaExpert "Data Access View" sent by the user (2026-10-08), tag `FICFA1043B` (ABC-003B, burner B hot secondary air flow PID).

| Item | What the screenshot shows |
|---|---|
| Server | `MICREX_View_XX_InternalOpcServer@xos3000-16` |
| NodeId pattern | `NS2|String|#/<TAG>.<PROPERTY>` (example `#/FICFA1043B.P`) — one variable per property, flat under the tag |
| Properties seen (rows 1-37) | ALI, ALM, BND, BUP, CAS, CUT, D, DHD, DMH, DPH, DPL, DPV, DTI, DV, DVH, DVL, EMD, FLT, GAP, I, LBL, LCK, LOC, MAN, MH, MHD, ML, MLD, MMI, MOD, MV, MVH, NCA, NOP, P, PAU, PH … (list continues below row 37: NOT seen yet) |
| Values of FICFA1043B at that moment | P = 200 (Float) · I = 50 (Float) · D = 0 (Float) · DHD = 10 · DTI = 1 · MHD = 101 · MLD = -1 · MV = 25 · MVH = 20 · CAS = 12.3 · CUT = 0 · BND = 0 · GAP = 0 · LOC = true · MAN = true · ALM = 3072 · MOD = 17152 |

## Reading (a GUESS from the names: to be confirmed on the DCS faceplate)
- P / I / D = the tuning. P = 200 is most likely a PROPORTIONAL BAND in % (gain = 100 / 200 = 0.5), I = 50 integral time (unit to confirm: seconds?), D = 0 derivative time.
- MHD / MLD = output high / low limit (101 / -1 %), MH / ML = Boolean "output at high / low limit".
- DHD = deviation limit, DPH / DPL / DPV = Boolean flags, LOC / MAN / CAS = mode and cascade set value (12.3).
- The simulator uses for this loop: Kp 1, Ti 15 s, Td 0, output 0-100 % (default by loop type, ASSUMED) → the DCS values are different.

Still needed: the rest of the property list (after PH: PL, PV, SV, TS …), the same view for one alarm tag (FIFA1043A), one PIDV, the OPC endpoint URL (no password), and the confirmation of the units.
