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
