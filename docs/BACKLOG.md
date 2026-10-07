# BACKLOG (noted by the user, to do later — order decided together)

## Modes and tracing (user: "maganda ito, sana walang bugs")
- Run / Pause-Step / View. Step buttons +1 scan, +1 s, +10 s; flash what changed after each step (ladder-style); force/input/switches keep working in Pause.
- View = no simulation, no force, reading + tracing only (open question: is force really forbidden there?).
- Trace: select a wire or gate -> upstream (cyan) to the origin incl. other sheets via links, downstream (orange); rest dimmed; side list "Driven by / Feeds" with name, address, description, value, click to jump; T: only the selected leg counts ("show all legs" toggle).
- "Why?" button: explains an output (AND: which input is 0; T: why that leg; timer: time left).
- Address highlight (yellow / sky) with description when selected — needs the user's IO list.

## Drawing changes (user updates PDF / DWG when logic changes)
- Source = ASCII DXF (DWG -> DXF with AutoCAD SAVEAS or ODA File Converter). PDF cannot be read. No per-sheet hard coding exists (checked): the reader works from symbol rules.
- GAPS to fix: (1) imported sheets are lost on reload -> keep them in the project file / a DXF folder read by the desktop app; (2) saved inputs/forces are keyed by wire/block numbers -> clear the saved state of a replaced sheet; (3) report what changed (blocks / links added, removed, changed); (4) a new symbol type is only a pass-through until a rule is added -> list unknown shapes after every import; (5) the DITL page is not touched (separate question how it is updated).

## Engine
- Real PID, ALM outputs, SEL with SIG.AB, DCMP, CTK, LAG time constant, FX tables, TP/PO meaning (docs/BLOCK-LIBRARY.md).
- Shared scan engine DITL + ABC and the plant simulator (docs/ARCHITECTURE.md) — needs the user's OK for the DITL engine question.

## Files / data
- IO list (format?), operation table (content?), tuning / alarm-limit tables (DCS parameter export?).
- Windows exe: confirm it starts on the user's laptop (SmartScreen, Save dialog).

## DCS engineering-station data (user's screenshot, 2026-10-07: "Loop Design" window, project D:\LMYP2, controllers 101-105 FCS2000EI A/B)
- Loop Design table (288 loops in station 101): NO, Name (plain description), Loop Type (Fixed Control = PID, Continuous Man = MAN station), Type (PID / MAN), TAGNO (e.g. FICCL2061C, TICBR2130, LICBR2001A), Input Pro 1/2 ... (more columns to the right, not seen yet).
- Function folders seen: ANALOG.ALO, ANNUN.ANO, BASIC.BSO, COUNTER.CTO, DATAPTN.DTO, DELAY.DLO, GP1.G1O, GP2.G2O, LINEAR.LNO, LOGIC.LGO, LOOP.LPO, MESSAGE.MGO, PROGRAM.PPO, RESULT.RDO, SEQUENCE.SQO, SWITCH.SWO.
- Likely sources of the parameters missing in the drawings: loop table / LOOP.LPO = PID gains, action, limits, ranges; LINEAR.LNO = F(X) tables; ANALOG.ALO = alarm limits; DELAY.DLO = timer settings. TO CONFIRM with the user, then ask for an export (CSV / text / cropped screenshots) of what he is allowed to share.
- Use: tag -> description list (feeds address highlight), PID/MAN cross-check against the drawings, real PID parameters, alarm limits, FX tables.
- UPDATE (screenshots Module Define 1 / 2 / Wiring): see docs/BLOCK-LIBRARY.md "Evidence from the DCS engineering station". Next ask: tuning display (P I D, PID type, SV/PV/MV, PH/PL/DVH limits) of the same loop FICFW2007 from the operator station; one MAN loop (e.g. HICL2060A) Module Define; LINEAR / DELAY / ANALOG tables.
- IDEA: "DCS parameters" table inside the project file keyed by TAGNO (name, range BS/FS, unit, action, tuning, alarm limits); the PID block reads it; import from CSV when the user can export.

## Decisions / facts from the user (2026-10-07)
- Vendor: Formosa Plastics project; engineering tool "EWS Tool", HMI "MICREX-VieW XX" (the DCS maker is not stated; the HMI name suggests Fuji Electric MICREX — unconfirmed). Station FCS2000EI.
- The user has: wiring, IO list, compensation, linears, memory list, modbus list addresses (format not told yet). Linear table: user says it was sent — NOT received in the chat (ask again).
- View mode: NO force (confirmed).
- Confirmed block behaviour: SEL average, RAMPB rate from text, DEV (+ minus -).
- To check by the user in the ladder: shapes "4T", "8T" (004A), "B | COS" (009A), "DROP RATE" (055), "/" (001B), "0" (001C); FF dominance (EWS help of FF).
- Findings by analysis: CTK = conditional write to another controller's SV; TP = probably T/P compensation before SQRT; SIG.AB acts through T/AMT control.
- Next batch proposal (v1.10.3): group A + SEL healthy average + CTK fix + FX tables import from the user's linear/compensation files.

## 2026-10-07 (later)
- EWS "Version" window: "Formosa Plastic CO. DCS System EWS Version Information", version 8.00G, build 2023/10/19, built by FPC-EMD. So the DCS is a Formosa in-house system (FPC-EMD); HMI = HCI Engineering Tool MICREX-VieW/H. No public manual: truth comes from the user's EWS help / function-block definitions. EWS tools seen: Modbus Setting.FBS, MQTT Setting.MQT, IEC Tool, EQU Setting, MemDebug, System Definition, Station Comm, WIRING.SKO, USERTAG.TGO.
- Order agreed: one thing at a time. Proposed: v1.10.3 group A only -> v1.10.4 confirmed block fixes (SEL healthy average, CTK, FF) -> FX/TP data import (user's Excel: linears, compensation) -> v1.11.0 Step/Trace -> IO + memory list descriptions -> real PID when tuning data exists.

## 2026-10-07 claude_import.zip (user's data; read in a scratch folder, NOT committed)
- `LMYP-1 #1-LINEAR.xls`: 90 sheets: DATA (a load table: LOAD %, MW, MSF, COAL, TAF, PA, FA, SA, O2) + one sheet per linearizer named S1-LN1 ... S3-LN24 ("STN101 LINEARIZE  S1-LN-01"): 16 points, columns NO., LX, LY, plus X-range and Y-range in %. This is the FX table source: the drawing says "LN12" / station; match sheet S<station>-LN<n>.
- `LMYP-1 #1-Compensation Calculation of Flow.xls`: per flow tag (FT-FA1043-A ... FT-FA1079): pressure FS/BS/operating, ATM 1.03326, temperature tag + FS/BS/operating temp, absolute temp 273.15, coefficients ap/bp (pressure) and at/bt (temperature). = the TP block (T/P compensation before SQRT).
- `LMYP-1 #1-Drum Level Calculation.xls`: drum level-pressure compensation curve (H, dPmax, dPmin, density table by drum pressure; LN38 / LN39 y-axis).
- `LMYP-1 #1_IO_Rev.1.xls`: sheets DCS Numbering, Station 101..105: columns STN, N, I, NO, Address (I.0000), TAG NO., Description, Base Scale, Full Scale, Unit, Type (DI/...), Signal Ab. Add. (SIG.AB address), Rev., Remark. = tag descriptions + ranges + SIG.AB addresses.
- `LMYP-1 #1-Memory-101..105.xls`: memory lists (M.xxxx descriptions) — not read yet.
- Plan: importer for these -> project file "DCS parameters / tag table" (FX tables, TP coefficients, descriptions, ranges). Original .xls stay with the user.
