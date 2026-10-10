# DATA-FILES — the files the user sent, what is in them and where the simulator uses them

For whoever continues this project: **ask for these files again only if they changed.** Everything the simulator needs from them is already inside the app (or listed here as not yet used). The files themselves are plant documents of the user and are NOT stored in the repository; compact extracts that the tests need are in `tools/data/`.

Zip received 2026-10-07 (`claude_import.zip`, folder "claude import"), plus the legend PDF received earlier.

| File (as sent) | Size | What it is | Used where | Status |
|---|---|---|---|---|
| `ABC-000.pdf` (SYMBOL LIST) | — | The legend of the ABC drawings: every symbol, gate truth table, timers, set / reset | **The law of the project** → `docs/FUNCTIONALITY.md` (symbol → legend text → simulator status) | all symbols follow the legend |
| `LMYP-1 #1-LINEAR.xls` | 2.8 MB | 89 linearization tables LN (station S1…S5): x / y points, ranges, drawing, title | Embedded in the app (`<script id="aln">`): F(X) blocks, editable LX / LY; **strict by station** (no fallback to a table of another station) | 89 of 89 tables identical to the file; see "Drum Level" for the 2 missing S1 tables |
| `LMYP-1 #1-Compensation Calculation of Flow.xls` | 52 KB | Temperature compensation of 8 flow transmitters: tags, temperature range, **operating temperature**, coefficients at / bt | **TP blocks** (8): `tools/assumed-data.js` → app (operating temperature per TP, shown in the block panel and in the "Assumed values" list) → `docs/ASSUMED-VALUES.md` section 1 | **USED, recorded** |
| `LMYP-1 #1-Drum Level Calculation.xls` | 52 KB | Drum level pressure compensation: densities Rw / Rs / R40, dPmax / dPmin, 19-point curves F3(p) (LN39 Y-axis) and F4(p) (LN38 Y-axis) | **S1-LN38 and S1-LN39 of ABC-010** (the drum level compensation). LINEAR.xls has LN38 / LN39 only for station S2 (heaters), so ABC-010 was using the HEATER tables. Now embedded from this file (`tools/data/drum-level-ln.json`) | **USED**; units deduced (see below), to be confirmed |
| `LMYP-1 #1_IO_Rev.1.xls` | 1.1 MB | I/O assignment per station 101…105: address, tag, description, base / full scale, unit; sheet "DCS Numbering" | Embedded as descriptions (`<script id="ades">`, k = io): hover / card of a block or wire. **Cross-check:** `tools/audit-ai-ranges.js` (compact copy `tools/data/io-scales.json`) | 157 of 157 AI ranges written on the drawings = IO list scales |
| `LMYP-1 #1-Memory-101 … 105.xls` | 1 – 1.8 MB each | Memory lists per station: WM (M.xxxx), WB (B.xxxx), SI, DI, FP, **TR (timers: type + setting)**, PTN (linear pattern numbers) | Embedded as descriptions (k = mem, 23 000 entries). **Cross-check:** `tools/audit-timers.js` compares every timer of the drawings with the TR table | 150 of 153 timers equal (type and time); the 3 others explained in docs/REPORT-v1.15.0.md |

## What each file gave the simulator (numbers)

### Compensation Calculation of Flow.xls (sheet COMPENSATION)
Constants: ATM = 1.03326, absolute temperature 273.15, all PRESS columns = 0 (**only temperature compensation exists**). Unit kg/cm2g.
For each flow: Kt = at · (T / span) + bt with at = span / (Top + 273.15), bt = 273.15 / (Top + 273.15) = (T + 273.15) / (Top + 273.15). The simulator: **DP' = DP / Kt**.

| TP block (sheet) | Flow tag | Temperature tag | Range °C | Operating °C |
|---|---|---|---|---|
| ABC-003A / B / C / D | FT-FA1043-A / B / C / D (burner hot secondary air) | TT-FA1086 / TT-FA1087 | 0 – 600 | 302 |
| ABC-006 #13 | FT-FA1081 (SAF inlet air) | TT-FA1082 | 0 – 100 | 35 |
| ABC-006 #15 | FT-FA1071 (PAF inlet air) | TT-FA1072 | 0 – 100 | 35 |
| ABC-006 #17 | FT-FA1055 (FA blower outlet) | TT-FA1055-A / B | 0 – 200 | 91 |
| ABC-006 #42 | FT-FA1079 (air preheater outlet to primary air) | TT-FA1076 / TT-FA1077 | 0 – 600 | 287 |

(The file also repeats FT-FA1043 for the four burners: same temperature signals.) Full table with at / bt: `docs/ASSUMED-VALUES.md` section 1.

### Drum Level Calculation.xls (sheet DRUM LEVEL)
Corrected range 124.2 cm (transmitter −422 ~ 820 mm), dPmax = 123 159.25, dPmin = 4 119.71 (kg/cm2 × 10⁻⁶), drum pressure 0 ~ 250 kg/cm2, densities Rw (saturated water), Rs (saturated steam), R40 (condensate). Column J = F3(p) = (Rw − Rs)·H, M = F4(p) = (R40 − Rs)·H; K = J / J(0), N = M / M(0) are the Y-axes of LN39 and LN38.
**Units (deduced, please confirm):** the ABC-010 sheet does `100 − LN38` (an offset in %) and `/ LN39` (a gain). So LN38 y = N × 100 (%), LN39 y = K (ratio). Check that supports it: with these units the corrected level equals the measured level at 0 kg/cm2 (300 mm → 300 mm, 0 → 0), as physics requires; at 145 kg/cm2 the same 300 mm reads 531 mm. With the ratio kept for both, or both × 100, the sheet has an offset or a gain error at zero pressure (`node tools/test-drum.js <html>`).

### IO list
Station numbers: 101 → S1, 102 → S2, 103 → S3, 104 → S4, 105 → S5 (common). 2 720 I/O points (DI 1 792, DO 928) and 1 096 analog (AI 872, AO 224) are in the app as hover text. AI / AO scales are in `tools/data/io-scales.json` (1 096 rows: tag, description, base, full, unit).

### Memory lists
M.xxxx (9 454), B.xxxx (2 590), SI (7 792), DI (84), FP (17), PTN (998), **TR (2 031: type TONs / TOFs / TPs and the setting value in s)**. Used for the hover texts; TR for the timer cross-check. A timer whose time is NOT written on the drawing could take its time from the TR table: none needed so far.

## How to refresh an extract (only if a file changes)
1. Put the user's file in a NEW empty directory, convert: `soffice --headless --convert-to xlsx --outdir <empty-dir> "<file>.xls"`.
2. `python3 -I tools/extract-io-scales.py <xlsx> tools/data/io-scales.json` · `python3 -I tools/extract-drum-ln.py <xlsx> tools/data/drum-level-ln.json`.
3. Compensation: edit `tools/assumed-data.js` (TP section), run `node tools/list-assumed.js`, rebuild.
Never run a script from inside the directory that holds the user's files, and keep `python3 -I` (isolated mode).

## Not used yet (honest list)
- `DCS Numbering` sheet of the IO list (numbering system of the DCS addresses).
- Memory lists: DI / FP / SI descriptions only as hover texts; PTN names only as texts.
- ALM limits, PID gains, PIDV pulse timing, PRI / SEC / AVG default modes are **not in any of these files** (they live in the DCS loop / analog databases): see `docs/ASSUMED-VALUES.md` for what was assumed instead.


## Added 2026-10-10 (v1.20.8)
- `data/reference/LMYP-1_1-LINEAR.xls` = copy of `LMYP-1 #1-LINEAR.xls` supplied by the user (89 tables + DATA). Used by `tools/test-verify-linear-xls.py` to verify the tables embedded in the app (376 PASS). Do not ask the user to send it again.
- `docs/requirements/LogicSim_v1.20.7_Requirements_GROUPED.pdf` and `LOGICSIM_EU_REPORT_FINDINGS.xlsx` = the requirements batch of 2026-10-10 (20 findings, Groups A-F).
- Still NOT in the repo: `Drum Level Calculation.xls` (S1-LN38 / S1-LN39 are embedded from it, tools/data/drum-level-ln.json), IO list and Memory xls (already embedded in the app).
