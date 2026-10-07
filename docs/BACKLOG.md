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

## 2026-10-07 later: units, exe, PID
- Units: 4 units; drawings and lists = unit 1; unit n: first digit of the tag number = n (SB1053 -> SB2053); addresses almost identical. Add a Unit setting later.
- Exe SmartScreen: not signed -> "More info -> Run anyway" or Unblock the zip; a real certificate costs money (decide later).
- tools/triage.js runs in Node without the embedded LN tables: FX-related stuck counts are overstated (known).

## 2026-10-07 decisions / corrections from the user (WAITING FOR HIS "GO" before any of these is built)
- Unit setting: NOT needed now (unit 1 only; the 4 units have the same settings).
- LINEAR semantics (user): X and Y are PERCENT of their ranges (interpolation); NOT a multiplier. The LN number belongs to a STATION (S1/S2/S3) and the sheet title ("STN101 LINEARIZE  S1-LN-01") must match: the importer must key on station + LN number, check the title, and warn on any mismatch (no silent fallback). Convert with the ranges of the sheet: x% = (x_EU - xlo) / (xhi - xlo) * 100 ; y_EU = ylo + y% * (yhi - ylo) / 100. Find the station of each ABC sheet from the MDL tags ("S1-MDL028").
- Exe/html version mismatch (verified): every GitHub run builds the html of that commit (run 5 = v1.11.1), but the exe file name takes its number from app/package.json (still 1.10.0), so every download is called 1.10.0. Fix: take the version from the html file name in prepare-ui.js; one VERSION for html, exe and apk.
- SmartScreen: no automatic fix without a code-signing certificate. Options: unblock the zip / PowerShell `Unblock-File`, download without browser (no Mark-of-the-Web), IT allow-list by hash, free signing only for public open-source repos (SignPath), cheap OSS certificate, or just use the html.
- Android: APK through GitHub Actions with Capacitor (sideload, no store, no fee); not testable here on a device; iOS needs a paid Apple account -> use the html in Safari.
- PID: range text now read (v1.11.1). Idea: default Ti by loop type from the tag letter (F flow ~15 s, P pressure ~60 s, T temperature ~180 s, L level ~120 s) until real tuning exists.
- Candidate order: A exe/apk versioning + pipeline, B PID defaults by loop type, C LINEAR + COMPENSATION importer (strict station/LN), D group A reader defects, E SEL healthy-average + CTK, F Step/Trace/View, G IO + memory list descriptions.

## 2026-10-07 analysis results (no code changed)
- STATION of a sheet = the station prefix of its own MDL tags ("S1-MDL028"); other S2/S4/STN10x texts are signals from other stations. Sheets: S1 = 001A/B/C, 002, 003A-E, 004A-C, 005-012, 013, 014, 029, 054*, 055; S2 = 017, 019, 020, 030-039, 050-053, 056; S3 = 015, 016, 026, 027, 057; ABC-028 shows "S5"; ABC-001D has no station text (its LN58-62 exist only in S1 -> S1). (*054 mixed texts: MDL S1.) To be confirmed by the user.
- LINEAR.xls (89 LN sheets: S1 41, S2 24, S3 24): titles / pattern numbers match the sheet names in all 89. The 89 tables EMBEDDED in the html (read from the drawings) are IDENTICAL (points and X/Y ranges) to LINEAR.xls: 89 / 89. So FX already uses the user's DCS data.
- FX matching by station + LN: 104 of 111 FX use exactly S<station>-LN<n>; 5 (ABC-001D, LN58-62) use S1 (correct by inference); 2 (ABC-010 LN38 / LN39, sheet station 1) use S2-LN38 / S2-LN39 because S1 has no LN38/39 -> ask the user (drum level pressure compensation, "Drum Level Calculation.xls" says LN39 / LN38). Plan: make lookup strict (station + LN) and warn instead of falling back.
- Free code signing: SignPath Foundation needs a PUBLIC repository with an OSI licence and NO proprietary component; our html contains the plant's drawings -> not acceptable. Azure Artifact Signing: individuals only USA / Canada (and paused), organisations USA / Canada / EU / UK. Even a signed exe gets SmartScreen reputation only over time. => no free certificate for us; use Unblock / IT allow-list / html.
- PID idea: per-sheet / per-PID suggested simulation speed from the loop type (flow 1x, pressure 5x, temperature 30x, level 10x), with a button "run at the suggested speed".

## 2026-10-07 LN curve editor — SIMPLE version (user: "naglolokohan ba tayo? keep it simple"), waiting for "go"
- The LINEAR data is already provided and matches (89/89). Goal: when an FX / linear is selected there is an "Edit table" option. Only the PERCENT columns are editable (same as in the DCS: LX / LY shown as % = value x 100); the X and Y engineering-unit columns recalculate by themselves from the ranges. Edits take effect in the simulation at once and are saved with the normal project Save. A "Reset" returns to the DCS value.
- NOT in scope (dropped, over-engineering): named variants, export format, extra reports.
- CONFIRMED by the user with a screenshot of LMYP-1 #1-LINEAR.xls (sheet S1-LN1, title DIESEL OIL CALORIE CORRECTION, DWG ABC-002): the only columns edited / entered are CURVE PARAMETER LX and LY (shown as percent: 0.00% .. 120.00%, 80.00% ..). X-INPUT = X range * LX and Y-OUTPUT = Y range * LY are automatic; interpolation as now. => editor: editable LX % and LY % per row, read-only X / Y in engineering units.
- RESET RULE (user): the linear edit has ITS OWN reset (per table + "reset all linear edits") and is NOT touched by the global / sheet Reset (that one clears forces, switches, sliders only).

## Logic scan (v1.14.0 -> WIP v1.14.1)
- Screens: tools/triage.js (stuck outputs), tools/stuck-roots.js (root causes, realistic ranges), tools/zero-analog.js (analog outputs that never get a value), tools/multi-out.js (T with 2 OUT pins), tools/why-stuck.js <sheet> <block id>, tools/shot-region.js (picture of a region), tools/test-back-manual.js.
- v1.14.0: 146 of 2011 logic outputs never change (7.3 %); analog outputs that never get a value 13 of 1018 (ABC-002 x6, 010 x3, 030 x3 (test artifact), 052 x1).
- Found + fixed in WIP v1.14.1 (tools/patch-1.14.1.js, wip/): (1) a vertical 2-pin block with no input: the upper pin is the input (ABC-002 F(X) LN5, fed from circle 001C); (2) T with two OUT pins: the pin labelled "A" is the A input (ABC-004A #3 #9, 010 #3 #23 #43, 011 #14, 012 #14). Result: analog outputs that never get a value 13 -> 1 (ABC-052 CTK #141: its control comes from another sheet = test artifact); stuck 146 -> 139; clean sheets 29 -> 30.
- Not defects (test artifacts): most HC / LC (alarm limits in engineering units, e.g. 980 C, vs random inputs), inputs coming from other sheets (LINK), outputs that go nowhere on the sheet (alarms to the DCS).
- Still to check by eye against the drawing: ABC-003E CMPK "< X%" x4 and NOT x4 (input FICDO1043A.LOC analog), ABC-001C DCMP "H / L", ABC-009A / 009B / 004C NOT on a .MAN / .LOC analog tag, ABC-020 AND #108/#109 (4 links from station 4 M.0344-M.0347).

## Logic scan, round 2 (WIP v1.14.1, user review of the first scan)
- User corrections accepted: comparators (HC / LC) are NOT defects: tools/test-comparators.js forces each comparator input across its set point: 236 of 236 outputs switch correctly (the earlier "stuck" came from my random 0..100 test inputs). "< X%" takes X from the "SET X%" wire. FICDO1043A.LOC / .REM / .MAN are digital. ABC-020 AND #108/#109 are fed by circles 5-8 of the same sheet (AND of four conditions, rarely true in a random test).
- More reader defects fixed in the WIP: constant "A" box with "1115 / 432 SCALE CONVERT" had been turned into a reference to the nearby wire tag SI0043 (value 0) -> now 2.581 (1115/432); "(50%)" / "(100%)" / "0%" boxes (PTN009001/2/3 = 0 / 50 / 100 %) now carry their value; grey "/" box = divide (formula "T = B / A * 100 / ..." gives the order); grey box with only a number ("0") or number + unit ("4T", "8T") = constant; DCMP "H / L" now reads "PV-SV > 1.5 / < -1.0 Kg/cm2"; DROP RATE ( X / MIN ) = new block DRATE (input fall per minute over a 60 s window: ASSUMPTION, confirm sign / window).
- Addresses: every SI / B / I / O / M / TR address on the sheets is found in the lists (SI 451 of 454, B 235 of 245, I 52 of 52, O 7 of 7, M 709 of 713, TR 117 of 118: tools/ades-coverage.js). What was missing was the display: now hover on any address text shows the card, and a selected block (SIG.AB, tag boxes) shows it too.
- Result of the scan tools on the WIP: analog outputs that never get a value 13 -> 1 (ABC-052 CTK #141: output goes nowhere on the sheet, holds its value; verified by forcing: follows the input when ctl=1); stuck 146 -> 99; clean sheets 29 -> 33.
- Still open: ABC-009A "B | COS" shape; remaining stuck outputs (99) are mostly real interlocks that need a specific combination, to be checked sheet by sheet.

## Logic scan, round 3 (WIP v1.14.1; AN_PV bumped 11 -> 12 because block numbers moved)
- New tools: tools/justify.js (controllability: for every digital logic output find an input combination for 0 and for 1 by backward search, apply it, simulate), tools/test-switch.js (every T picks the leg its selector names; 382 of 384 at model level), tools/audit-switch.js, tools/cone.js-style helpers in the notes.
- Result: 2043 of 2076 digital output values reachable (98.4 %). Left (33): wired-OR nets with two drivers (004A / 004B / 004C M.0146 etc.), latch loops with hysteresis (ABC-013 FF M.025A), ABC-052 chain behind AND #112 (user: ignore), ABC-050 LC #58 "< 0" after a low limiter (cannot go below 0), ABC-001D DCMP #19 (four out pins for two comparisons, drawn double: the second pair of pins has no test).
- Fixed in this round: "< X%" reads X from the wire (bare "3%" text at the start of the wire = constant, ABC-003E x4); DCMP "PV-SV > 1.5" now follows the sign of the DEV before it (DEV = SV-PV, so PV-SV is the negative); circles with a LETTER (86 found) continue signals on the sheet like numbered circles; switching: the "B" beside a COS is the COS's own label ("B | COS" diamond was not a COS), switch letters are matched to pins globally (nearest first), selector wires that stop short of the T are attached, Y / N switches (n = control 0, y = control 1), T legs; DROP RATE has an internal window (5 / 10 / 30 / 60 s, default 30, text on the drawing kept).
- Divide: "T = B / A * 100 / 60" (ABC-001B) is implemented exactly as the formula: B / A, then x100, then x 1/60 (constants 10000, 100, 1/60 drawn above the boxes). User says it is a "rate": confirm the meaning / unit.

## Logic scan, round 4 (WIP v1.14.2, patch tools/patch-1.14.2.js; not released)
- Result: digital output values reachable 2043 of 2076 -> 2100 of 2100 (the number of outputs grows: new AND gates are now found). 14 of them are reached only by a random input SEQUENCE (latches / pulses / edges: ABC-013, 050 LC #58 / AND #101, 052 x6 (user: ignore), 055 x2) = tools/justify.js "seq" (SEQ=1 lists them). That proves the SIMULATION can reach them, not that a plant would.
- READER fixes (all found by looking at the drawing):
  1. NOT (⊠) pin direction: the old test "the wire that ends in an arrow is the output" looked at the whole NET, so a ⊠ on a branch of a multi-branch wire got in / out swapped: ABC-004A / B / C (⊠ on the 1:BYPASS wire became a second driver of M.0146 = the "wired-OR"; NOT a real wired-OR), ABC-055 NOT #29 (M.0315 -> TR232), ABC-003E (M.008F -> TR256). Now: arrow on the pin's OWN straight wire, else left to right / top to bottom.
  2. AND with a tall body (bar + box 15 high, 4 inputs) and AND whose body is ONE closed rectangle or a bracket-shaped body: were not recognised (8 + 4 AND gates on ABC-003A/E, 017, 052, 001C). ABC-003E M.0090 "ALL BURNER IN SERVICE" had no driver.
  3. DCMP with outputs drawn with an elbow (ABC-001D #19): the test texts (">= 2 MW", "< 0.3 MW") sit over the far end of the wire; now looked for near the arrow end too: 4 of 4 comparisons are read (was 2).
- NOT defects (checked on the drawing): ABC-013 M.025B = AND( OR(M.3221 / 3220 / 3200), OR(TOF 10 s of M.025A, TPS 300 s of M.025B itself) ): a 300 s hold loop, needs a rising edge; ABC-050 LC #58 = "<= PICMS1006.MLD" after a LIMIT with the same MLD: true when the limiter clamps (reached by the sequence).
- Still to do (B): sheet-by-sheet check of the stuck outputs (tools/triage.js, stuck-roots.js).
