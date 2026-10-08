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

## Logic scan, round 4 (v1.14.2, released)
- Result: digital output values reachable 2043 of 2076 -> 2100 of 2100 (the number of outputs grows: new AND gates are now found). 14 of them are reached only by a random input SEQUENCE (latches / pulses / edges: ABC-013, 050 LC #58 / AND #101, 052 x6 (user: ignore), 055 x2) = tools/justify.js "seq" (SEQ=1 lists them). That proves the SIMULATION can reach them, not that a plant would.
- READER fixes (all found by looking at the drawing):
  1. NOT (⊠) pin direction: the old test "the wire that ends in an arrow is the output" looked at the whole NET, so a ⊠ on a branch of a multi-branch wire got in / out swapped: ABC-004A / B / C (⊠ on the 1:BYPASS wire became a second driver of M.0146 = the "wired-OR"; NOT a real wired-OR), ABC-055 NOT #29 (M.0315 -> TR232), ABC-003E (M.008F -> TR256). Now: arrow on the pin's OWN straight wire, else left to right / top to bottom.
  2. AND with a tall body (bar + box 15 high, 4 inputs) and AND whose body is ONE closed rectangle or a bracket-shaped body: were not recognised (8 + 4 AND gates on ABC-003A/E, 017, 052, 001C). ABC-003E M.0090 "ALL BURNER IN SERVICE" had no driver.
  3. DCMP with outputs drawn with an elbow (ABC-001D #19): the test texts (">= 2 MW", "< 0.3 MW") sit over the far end of the wire; now looked for near the arrow end too: 4 of 4 comparisons are read (was 2).
- NOT defects (checked on the drawing): ABC-013 M.025B = AND( OR(M.3221 / 3220 / 3200), OR(TOF 10 s of M.025A, TPS 300 s of M.025B itself) ): a 300 s hold loop, needs a rising edge; ABC-050 LC #58 = "<= PICMS1006.MLD" after a LIMIT with the same MLD: true when the limiter clamps (reached by the sequence).
- Still to do (B): sheet-by-sheet check of the stuck outputs (tools/triage.js, stuck-roots.js).

## Logic verification, round 5 (v1.14.3, released)
- Scope: only sheets with logic. ABC-000A / 000B (CONTENTS) and ABC-000 (SYMBOL LIST) are NOT counted: 54 - 3 = 51 sheets; 3 of them have no gate (ABC-028, 034, 001B) -> 48 sheets with logic.
- The gate legend is on ABC-000 (user: do not ask, read it): OR / AND truth tables, NOT, ON / OFF delay and PULSE timer diagrams, SET / RESET table "S R -> Q: 1 0 -> 1, 0 1 -> 0, 1 1 -> 0, 0 0 -> no change" = RESET WINS. This answers the open "FF dominance" question: the engine already does reset-wins. New tools/test-legend.js checks every FF (282 cases) and timer (TON 35, TOF 18, TPS 107) against the legend: v1.14.2 had 4 FF mismatches (ABC-055 FF#8), WIP 0.
- New scan: nets with 2+ real drivers (a drawing cannot have them): 43 -> 38; the remaining 38 are the analog MAN / AI nets of ABC-015 / 016 (see below). Fixed: NOT whose pins were swapped on an elbow wire (flow right to left: ABC-055 M.0319 -> NOT -> AND [this one made the reset of FF#8 useless], ABC-007 M.0188, ABC-020 M.017C); an OR bar drawn as two overlapping pieces on one circle made two OR gates (ABC-009A M.0308, ABC-009B M.0328): merged into one.
- OPEN (analog, found by the same scan): MAN stations of ABC-015 / 016 (HICFA10xx): the reader gives the MAN block output pins on its PV / SV input nets, so the MAN value is written onto the AI (transmitter) net and the SV net (AI0544 shows the AI value only because the AI block is evaluated later; SV net stays 0). Needs the MAN pin roles (MV leaves at the bottom) -> next.
- (round 5, continued) USER corrections: (1) "gates" = I counted only digital gates; ABC-028, 034, 001B have function blocks (14 / 33 / 13), so ALL 51 sheets (54 minus CONTENTS 1, 2 and SYMBOL LIST) are verified, every block kind (multiplier, rate limit, divide, PID, T, COS, SUB, SUM, ramp, FX ...), not only gates. (2) Read the diagram (arrows!) BEFORE calling something wrong or changing the reader: ABC-007, 020, 009A swaps were checked against the arrows (all correct).
- ABC-001B / 001A / 001C / 001D (USER found: C not linked): letter circles of r 8.0 - 8.2 were skipped by the reader's radius limit (single letter / number circles > 6.5), and sinks whose wire stops short of the circle (arrow head fills the gap) were not attached. Now: 001B "C UNIT LOAD DEMAND SI0226" -> 001A and 001C (2 places) linked; G (001A <-> 001B), X, MWD (001B -> 001D, 020), BIR (001D -> 001C), circle 6 (009A -> 009B) linked. The "M" circle of a motor-operated valve is NOT a connector (ABC-054 / 055).
- MAN stations (ABC-015 / 016; found by the scan "nets with 2+ drivers"): the lower row of MAN boxes is drawn TWICE (two identical rectangles) = duplicate MAN blocks (16 on 015 / 016), and the PV wire runs under the box showing a stub on its left edge = a false output pin on the PV net. Both fixed: nets with 2+ real drivers 43 -> 0, duplicate blocks 16 -> 0; check AI = 37, MAN = 55 -> PV 37, MV 55.
- STILL OPEN (tools: the scan in the notes of this round): 28 numbered / letter circles with "FROM / TO ABC-xxx" that find no partner on the other sheet (e.g. 003B circles 6 and 8 FROM 003A, 003E circles 4 / 5 FROM 007, 004A circles 1 / 7 TO 005, 004B / 004C circles 5 / 6 / 8 / 9 TO 004A). To be checked one by one against both drawings.

## Logic verification, round 6 (v1.15.0, tools/patch-1.15.1.js; released)
- Full table of findings (what the drawing shows, what the simulator did, how to check): **docs/FINDINGS.md**.
- New scans: tools/audit-sheets.js, audit-signs.js, audit-params.js, audit-shapes.js, shot-multi.js (contact sheet of several places).
- Fixed in the WIP: MUL gain constants, SUB signs 9 – 13 units from the pin, LAG times written left of the box (5 blocks used 15 s), timer 300 s read as 5 s (ABC-013 TR74), the RATE LIMITER symbol "V⟩" (3 blocks) read as a high limit, unrecognised grey blocks (limiter ABC-001A, 2 subtract boxes ABC-001A, RATE LIMIT ABC-001B, add box ABC-001D, summation bars ABC-026 / 027).
- AN_PV must go 14 -> 15 at the build (new blocks).

## Logic verification, round 7 (v1.15.0, tools/patch-1.15.1.js = patch-blocks + patch-defaults + patch-signals + patch-selector)
- User data: Compensation file -> 8 TP (operating temperatures); Drum Level Calculation file -> S1-LN38 / S1-LN39 (ABC-010); IO list / memory lists used as CHECKS (157 / 157 AI ranges, 150 / 153 timers). Documented in docs/DATA-FILES.md.
- Assumed values (user: "ikaw na ang magset"): 104 ALM limits, 8 ramp rates, PO pulse cycle -> tools/assumed-data.js, docs/ASSUMED-VALUES.md, button "Assumed values", block panels.
- Signals must arrive: tools/audit-reach.js (223 dead ends + 4 orphans -> 0, docs/FINDINGS.md section H), tools/test-links-all.js (182 / 182 carry), tools/test-paint.js (lit only when 1), 4-way selectors (G-10).
- OPEN: O-05 (TR256), O-07 / O-08 / O-09 (links), O-11 (ABC-001C TR228 type), DCS values for ALM / ramps / PO, PRI / SEC / AVG default mode, sheet-by-sheet comparison with the PDFs, exe / apk on the user's devices.

## 2026-10-08 (user ideas, recorded)
- **CCS scenario test (internal testing):** the user says the assistant can run scenario tests on the coordinated control (CCS) sheets by itself. Plan: use the DITL signals list (one-click inputs) as the scenario script (load demand step, boiler master / fuel master / air master), small process models for the key loops (as in tools/test-loops.js), run N seconds, record SV / PV / MV with the trend history, check the answers with the legend. First step: list the CCS sheets and their FROM DITL inputs.
- **HMI graphics view (user suggestion): DONE in v1.16.0** (Tab / Float / Split approved by the user; docs/HMI-VIEW.md, MANUAL 3.4d).
- **Following a signal through many sheets** (user, after testing on the staging air dampers and furnace temperature sheets: "di na makabalik, lahat dadaanan"): done in WIP after v1.15.2: path (breadcrumbs, Back to start, no loop growth), list of every exit, signal map of all sheets (docs/MANUAL.md 3.4).
- **Live graph (user):** not only PID: linearizers (FX), controllers (PID, PIDV, MAN), integrators (SUMA / SUMP) and every other block: done in WIP (docs/MANUAL.md 3.4b), zoom and normal view.

## 2026-10-08 (late) user feedback after v1.16.0 — TO DISCUSS (no code changed, no release)
| # | Feedback of the user | Finding / proposal | Decision needed |
|---|---|---|---|
| F1 | DITL signals: show only the signals of the sheet that is open | Easy: the list = the open sheet (a switch "all sheets" stays available) | confirm |
| F2 | Right panel: auto width, minimum = the present width, wider when something needs it | CSS: min-width 300 px, width auto, max 60 % of the window, plus a drag handle | confirm |
| F3 | Trend hard to understand: no description, no P / I / D values, no X / Y values, no range / sampling time | Trend v2: legend with tag + description + unit; axis labels with values (Y per trace, X = time with window length and sampling time 0.25 s); PID: second pane with error e, P, I, D and MV and a text "e = SV − PV; MV = P + I + D"; other types in docs/BACKLOG (FX: X-Y curve with the operating point; MAN: value, limits, tracking; PIDV: raise / lower pulses and position; SUMA: flow, total, rate; LAG / RATE: input and output) | which type first |
| F4 | Zoomed trend covers the panel, cannot change values | Zoom window becomes floating (move, resize, transparent) and gets a control strip with the same controls as the panel (SV, MAN value, A / M, Kp Ti Td, inputs) | confirm |
| F5 | COS / manual: no indication which slider is which; some COS do not update; output has no effect | Checked: 173 COS blocks: 90 attached to a T switch (manual value slider exists), **83 NOT attached** (no slider at all: to be checked one by one on the drawings). All 90 attached COS pass after 40 simulated seconds: the manual value is **ramped like a field input (about 5 units per second)** and in Pause nothing moves, so it looks like "no effect". All of them are called "COS manual value" (no tag). Proposal: operator values (COS) applied at once; each one labelled by tag / address + description + sheet; the 83 checked | confirm; which of the 83 matter |
| F6 | HMI is only monitoring: cannot draw graphics, cannot add an address, auto sheet incomplete; wants to CONTROL the logic from the HMI | HMI v2: address picker (search tag / address with description, or pick a wire in the diagram), drawing tools (line, rectangle, circle, text, symbol library), faceplate like the DCS faceplate (PV SV MV, limits, P I D, A / M, trend) that writes the engine, complete Auto page (PID, MAN, SUMA, COS, DITL inputs, lamps) | scope and order |
| F7 | Are the photos of the faceplates enough? | Yes for the parameter list, units, layout, MNO = MDL cross-check (docs/DCS-FACEPLATES.md). Not enough for the A / M / CAS mode buttons, the ON / OFF switch, graphic overview screens | more photos |

## 2026-10-08 (night) the user's answers to F1 – F7 (docs/BACKLOG.md table above)
| # | Answer of the user | Status |
|---|---|---|
| F1 DITL list of the open sheet only | "ok na ok" | **DONE (WIP)**: the list shows the open sheet and follows it; "All sheets" switch |
| F2 panel auto width | "ok na ok" (minimum = the existing width) | **DONE (WIP)**: min 300 px, grows only when something cannot wrap (max 60 % of the window), never narrower inside one selection |
| F3 Trend | asked to EXPLAIN first: in a PID the PV must follow the SV until smooth; the parameters shown must be right | Explained in the chat; **needs a process model** (the simulator has no plant: PV is an input) → F8 |
| F4 floating zoom + control strip | "ok na ok; must be easy to identify what is being controlled: address / tag / description" | planned with F3 |
| F5 COS | manual value may keep the RAMP (target → now); range and unit from the diagram; address it controls; **disabled when the COS is not energized**, except when used as SV / PV or when it does not come from switching logic; panel info of the other things is fine | **DONE (WIP)**: 148 of 173 COS resolved (98 T analog, 26 T digital, 24 operator SV beside a PID), named by what they drive, range, unit, "target → now", disabled when not energized; **25 not resolved yet** (tests/test-cos.js lists them) |
| F6 HMI v2 | Auto page must TRACE ALL manual inputs (analog and digital that can be simulated directly, not forced); inputs that come from another sheet are shown with a note; the HMI built must be saved | planned |
| F7 modes A / M / CAS | the modes come from the switching logic (the inputs tag.MAN / .LOC / .REM are ordinary inputs): no mode buttons needed | closed |
| F7b overview graphics | wants zoom, smooth dragging and a LOCK so that nothing moves by accident | planned (HMI v2) |
| F7c faceplates of PIDV, SEL, ALM, COS | "complete in the Excel" | **checked: NOT complete**: the Excel has PID (incl. 2 PIDV), MAN, SUMA only; ALM limits (104) and SEL defaults (26) were in the first form (docs/DCS-DATA-FORM.pdf sections A and E) and are not in the filled file; COS has no faceplate parameters (it is a manual value of a T switch) |
| F8 NEW: process model | to be decided: an optional closed-loop process per controller (PV follows the output: gain, time constant, dead time, load disturbance) so that the trend shows the PID working | proposal |
| F9 data | PID / MAN / SUMA values received (136 rows) and applied: docs/DCS-FILLED-FORM.md | **DONE (WIP)**; DH and CUT look swapped in the PID sheet |

## 2026-10-08 (go) status after v1.17.0
| # | Status |
|---|---|
| F1 DITL list of open sheet | DONE v1.17.0 |
| F2 panel auto width | DONE v1.17.0 |
| F3 Trend explained (SV / PV, P I D, axes, sampling) | DONE v1.17.0 (Trend v2 + process model so PV follows SV through the controller) |
| F4 floating zoom + control strip | DONE v1.17.0 |
| F5 COS manual control, 25 unresolved | DONE v1.17.0 (173 / 173) |
| F6 HMI v2 (picker, drawing tools, full Auto page, lock, control) | NEXT |
| F7 faceplate data | DONE for PID / MAN / SUMA (FILE); ALM limits (104) and SEL defaults (26) stay ASSUMED, later |
| F8 process model | DONE v1.17.0 |
| Ramp rates of the 8 boxes | user: assistant sets defaults, diagram text wins -> kept; screw coolers corrected to 0.05 rpm/s |
| DH / CUT | user: assistant corrects; swapped in the PID sheet (no effect on the sim) |
