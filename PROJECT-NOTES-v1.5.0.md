# PROJECT-NOTES

Update this file on every code change (newest entry on top). File name carries the current version (PROJECT-NOTES-vX.Y.Z.md).

## RULES (from the user, do not forget)
1. DITL page is NEVER touched. Only ANALOG (ABC). Check every build: `node tools/guard-ditl.js <old.html> <new.html>` must say IDENTICAL.
2. Versioning: MAJOR.MINOR.PATCH (bug fix = patch, new feature = minor, big change = major). Every build updates this file name + the version in the html file name and <title>.
3. No phone-browser testing. Claude tests headless, the user tests in the browser. PDF only when needed / requested.
4. Signal rule: ORIGIN signal (from field/DCS, nothing in the drawing drives it) = the user sets it (click 1/0, slider/number). Signal that is the OUTPUT of another block (this sheet or another sheet) = computed by the logic, never set by the user; FORCE is only an optional override (bypass) for signals the user does not control.
5. Saved values (browser) use net / block numbers: BUMP `AN_PV` in the analog script every time the drawing reader changes (valves, timer chord, new blocks ...). Forgetting this makes old saved forces / inputs land on the wrong wires.
6. User wishes (analog simulation): symbols must stand out over lines (also in pause/view mode); follow the true logic path/flow/function of every block; no visually unconnected lines; clear DI-of-DCS vs "from another logic" identification; analog vs digital wires distinct, esp. at T switching.

## v1.5.0 (ditl-workbench-v1.5.0.html) - user test of v1.4.0
- T SWITCH: no line inside the box, no ">A / >B" arrows. The letter of the input in use (a/b or A/B written on the drawing) is coloured (analog or digital colour) and bold; the other stays normal. (pins keep a reference to their label text: p.lt).
- COS: the diamond COS next to a T has no wire. Reading: it is the operator's MANUAL value for the B input of that T. 86 of 173 COS blocks are now a real input ("COS manual value", slider, badge at the COS). ABC-050: the two T+COS (A/M near circle 9 / M.0706, and the SV selector next to the PV-SV deviation box). TO CONFIRM WITH THE USER that COS = operator manual value.
- VALUES: default colour green; settings: colour, size, font, weight; placed closer (max 7.5 units); settings card has sections Digital / Analog / Forced / Values.
- DIGITAL WIRES: own colour (Live list stays the default), solid or tube, thickness. FORCED wires: own colour (default white) + dashed. PER-WIRE LOOK: click a wire -> "Look of this wire" (colour + thickness, saved per sheet, Reset clears).
- FAINT (nobody follows it) is now the wire colour at 40 % instead of dark grey: this was probably the "lines are not coloured" (dark grey looked uncoloured). No geometry cause found: no orphan glyph lines, no touching nets with different state (checked ABC-050, ABC-052); touch-without-dot = 657 pairs overall, only 3 would feed a floating input (all ABC-001D) so strict-T is right.
- ANALOG INPUTS: always instant, ramp dropdown removed (user had "Analog: normal" saved: slider / values / comparators looked out of sync because the value ramped 5 %/s). Comparators checked in ABC-050: all 14 correct on both sides of the set point.
- TREND ARROWS: valve %, actuator %, and the AI that follows them show up/down arrows while moving (same as timers).
- STORAGE: a warning appears if the browser refuses to store data.
- FORCE "second try fails" (user): NOT reproduced (digital, analog, repeated, release, reload, hidden panel all pass). Suspects: two tabs of different versions share one browser storage; stale saved values (fixed with AN_PV=7). Ask the user for exact steps if it comes back.
- DITL page: identical (guard). Tests: 54 sheets no errors, 44 tag links, force tests, valve -> AI test, per-wire look / settings test.

## v1.4.0 (ditl-workbench-v1.4.0.html) - user test of v1.3.0 (desktop Chrome screenshots)
- SAVED VALUES: found a real bug: v1.2.0 changed the reader (valve symbol no longer wires, so net / block numbers moved) but AN_PV stayed 5, so values saved by older versions landed on wrong wires on the desktop browser (the Android browser had empty storage). AN_PV = 7 now (rule 5). Panel hidden = no FORCE controls: now a click on a wire / block opens the panel as a floating card when it is hidden and hides it again when you click empty canvas (AN.tmp). Reset also clears saved values.
- WIRE STYLE (Legend & style): analog colour (Auto/Amber/Cyan/Green/White/Magenta/Orange), analog line Tube/Solid, analog thickness, digital thickness (Thin/Normal/Thick/Extra). Saved in ditl.an.ws. Digital colour = the Live list.
- ARROWHEADS follow the wire colour (live / off / analog / faint). SOLID triangles that are net arrows are no longer drawn twice.
- TIMERS: the closing line (chord) of the half-disc was a WIRE (164 timers), now part of the symbol (violet). 
- T SWITCH: the selected path (input -> centre -> output) is drawn as a thick line in the wire colour, under the T letter; rings removed. Not selected = nothing. Junction dots are drawn under the symbols and smaller.
- VALUES: coloured like the analog wire (light tint), fewer (no badges on nets that only feed / leave an I/P, AO, PO, TP, FIELD, valve, actuator), more clearance around symbols (blocks +1 unit, texts +0.3, wires penalised).
- SLIDERS: analog inputs (not only AI blocks) now have a slider next to the number (range read from "a ~ b unit" text near the wire, else 0-100), also in the selected-wire card.
- AI FEEDBACK: the word POSITIONER links a valve / actuator to the AI that measures its position (valve: ABC-030, 050, 052; actuators: many); that AI follows the position (0-100 % of its range), slider disabled, row says "follows the valve".
- DITL page: identical (guard). Tests OK: 54 sheets, 44 tag links, valve -> AI feedback test (valve 30 % -> AI0384 30), panel auto-open + force save test, wire style test.
- AUDIT ABC-050 T switches: 19 T blocks, 16 switch correctly with their select signal, 1 is a hold (B input = its own output, by design: ABC-050 SW id 74), 2 AMT (the T+COS pairs near 516,385 and 481,533) have only the A data input found (the B input is not read) -> to verify with the user (what are COS / AMT B?).
- OPEN: user says some wires are not coloured although the simulation by click is right; no example yet. Checks done: no orphan glyph lines, no touching wires with different lit state in ABC-050 / ABC-052. Need sheet + place.

## v1.3.0 (ditl-workbench-v1.3.0.html) - colour-coded symbols, no overlapping labels
User test of v1.2.0: symbols were all white, coloured arcs (timer half-discs) stayed white; wants colour coding. Simple colours stay for wires / live wires. Texts, values, timer progress, valve positions must not overlap.
- SYMBOL COLOUR CODE (outline + faint tint + the text inside): gates AND/OR/NOT/FF teal; timers violet (arcs included, progress bar violet); comparators lime; T switch / COS pink; controllers green; I/O (AI, AO, PO, I/P, alarm, output flags, SIG.AB) tan; math/signal/constants blue; numbered connector circles light grey; other shapes steel; valve = state colour. Colour is taken from the block that contains the symbol part (also AND box lines, OR circle, arcs).
- LABELS: the placement routine now also avoids wires and looks only at nearby items; timer count, valve % and the T label are placed with it (first), then the analog value badges. Timer text shortened ("up-arrow 2.4/5s", "down-arrow 3.1s").
- LEGEND: button "Legend" opens a card with the symbol colours, valve colours and wire styles.
- DITL page: identical (guard). Tests: no errors in 54 sheets, 44 tag links, animation test OK.
- Known: some labels still touch when a drawing is very crowded (e.g. value next to a tag text); report the sheet + place.

## v1.2.0 (ditl-workbench-v1.2.0.html) - animation, valves, followed path
User test of v1.1.0: colours OK, legend OK. Problems: analog values "do not work" when pressing the check; timer count animation missing; valve position instant.
- ANALOG INPUTS: found the cause: inputs moved at 5 %/s ("Analog: normal"), so 90 took 18 s and the logic looked dead. Default is now "Analog: instant" (setting stored under a new key ditl.an.ramp2).
- TIMERS: count shown ON the drawing under the timer: TON/TPS/TPV count up "up-arrow 2.4 / 5.0 s" with a progress bar, TOF counts down "down-arrow 3.1 s". Hidden when idle.
- CONTROL VALVES: the bowtie symbol (44 in 29 sheets) is no longer a wire; it is a block VLV fed by the stem wire (0-100 %, digital 1 = 100). Travel animation, full stroke 20 s (editable in the panel), outline colour: green = closed, red = open, white = moving, blue = stopped half-open. % shown beside it.
- I/P: only the main input counts; the other input pin (air supply) is not an input any more (ABC-050: 28 -> 27 inputs).
- ANALOG WIRES: always coloured (a value, also 0, is flowing). Faint = nobody follows it: feeds only an input not selected by a T, or blocks that only feed such inputs (chain, not only the first wire).
- TIMER/VALVE legend added. Tools: patch-1.2.0.js, test-anim.js.
- DITL page: identical (guard). Tests: 54 analog sheets compile/run/render with no errors; 44 tag links; valve + timer animation test.
- User decisions: "TO DITL 52-03" NOT linked (DITL not simulated yet). STN101015 ignored. Still on hold: PID/SUMA/SUMP (in = out), 19 CONST.
- PLAN (agreed idea): ABC-050 has 31 of the 51 block kinds. Pilot sheets in order: ABC-050, then a sheet with the missing kinds (MAN, PIDV, ACT, TOF, DCMP, PVSV, DIV, ABS, SQRT, LAG, ADD, TP, PO, HLIM, SUMA...), then a family-by-family regression over all 54 sheets with the audit/test tools.

## v1.1.0 (ditl-workbench-v1.1.0.html) - analog look
- Symbols stand out over wires, in run and pause: symbol outlines bright white and thicker (.6), the raw CAD lines under the wires dimmed (50%), wires thinner.
- DIGITAL wire = thin solid line (Live colour when 1, grey when 0). ANALOG wire = tube (coloured edge + dark core), amber when it carries a value (cyan if Live is Yellow/Green/Magenta), grey when 0. Forced = dashed. Selected = thicker.
- T switch: ring on both inputs, filled ring on the active one; the not-selected input wire is faint (digital too, not only analog).
- Legend (digital / analog / T active input) in the sheet header bar.
- DITL page: identical (guard). Tools: patch-1.1.0.js, shot.js (screenshot of a region).
- docs/ABC-050-signal-list.md: the user asked for a list of the origin signals of ABC-050 (item 4 of the panel wording is on hold until the user decides).
- On hold by the user: block function check (PID / SUMA / SUMP stay in = out), the 19 CONST "value not found".

## v1.0.1 (ditl-workbench-v1.0.1.html) - cross-sheet signal links by TAG
- v1.0.0 = v46 unchanged (baseline).
- PROBLEM: an input on one sheet whose same tag (M.xxxx, B.xxxx, SIxxxx, AIxxxx, xxx.MV/PV/SV) is an OUTPUT of a block on another sheet was treated as a user input (only numbered circles were linked across sheets). Now linked by tag: the target wire is computed from the other sheet (value flows, click shows "galing sa sheet ABC-xxx", FORCE only). 44 such links found in the 54 built-in sheets.
- All linked sheets now run together (limit 16 -> 64 sheets).
- Panel "From other sheets" shows "tag M.xxxx" for these links.
- Importing an ABC DXF clears the link cache.
- Tools (repo /tools): lib.js (loads engine + sheets from html), audit.js (signal origin audit), crop.js (picture of a region, red ring = unconnected end), guard-ditl.js, test-links.js (browser test), patch-1.0.1.js (the patch).
- DITL page: identical (guard).
- AUDIT FACTS (v46 analog): 885 external inputs: 332 have a tag (DI 34, M 135, B 59, other 104), 553 no tag (many are analog values / segments). 135 M.xxxx are "FROM DITL" (origin from the DITL page, user sets). 126 "FROM ABC-xxx" texts.
- CORRECTION to the first audit: the "243 unconnected line ends" is an upper bound; checking ABC-003E and ABC-009A pictures, most are arrowhead gaps, gate bodies and box edges (not real breaks). Real breaks must be reviewed with the picture tool (tools/crop.js) sheet by sheet.
- STILL OPEN: symbols over lines (visual); verify each block function vs legend (PID is still pass-through, SUMA/SUMP unknown, 19 CONST value not found); analog vs digital wire look; T switch branch look; DI-of-DCS labelling in the panel; NOT/X box and strict-T review.


## v46
- Putol na linya: lahat ng arrowhead (galing line, INSERT at solid) ay guhit na; may tulay (bridge) mula dulo ng wire papunta sa arrowhead at sa pinakamalapit na symbol/gate/bilog (<=3.5 unit). Umiilaw kasama ng net.
- Input click: kahit saang kopya ng input (linked/same-tag, hal. I.0400 sa 2 lugar) ay tina-trace papunta sa totoong ext input at iyon ang nagto-toggle. Walang "computed" na pagtanggi sa input.
- DITL page: hindi ginalaw (pt4 identical).

## v45 — Simple na kulay, symbols sa harap, ayos na value placement, auto-load pagbukas
- KULAY: dalawa lang. ON = Live colour (yung napili sa "Live:"), OFF = abo. Digital o analog, pareho. Wala nang cyan/amber/puti/asul. Napiling wire = mas makapal lang. Forced = putol-putol na linya (kulay ON/OFF pa rin). Lahat ng text at outline ng symbols ay iisang neutral na kulay (wala nang cyan na text na mukhang "live").
- TINANGGAL: ang legend ng kulay; ang Shift+click force (FORCE ay nasa panel lang). Digital input: isang click = ON, isa pa = OFF (parang DITL). Wire na galing sa logic ay logic ang magpapasya; click = inspect lang.
- SYMBOLS SA HARAP: lahat ng gate, box, diamond (T), bilog, timer arc ay naka-foreground na (may background fill) kaya hindi na sila nasasapawan ng wire. Ang mga text ay nasa pinakaitaas din.
- VALUE PLACEMENT: ang mga value (hal. 14.80) ay kusang humahanap ng lugar na hindi tumatakip sa description/text, sa ibang value, o sa symbol.
- AUTO-LOAD: root cause ng "kailangan pang i-reload": ang analog code ay tumatakbo bago pa nababasa ng browser ang embedded na data ng mga page (cold open, mabagal na parse) kaya walang sheet na na-load. Ngayon hinihintay muna ang DOMContentLoaded bago mag-load, at may bantay na nag-aayos kapag may nabuong blangko. Na-test ko ang cold open (reload) at 54 sheets + current page ay lumalabas agad.
- CONTINUITY (ABC-050): walang free end na malapit sa symbol (0 near-miss). Sa ibang sheet may near-miss na dulo ng wire (<=3 units sa symbol): ABC-004A 23, 001C 29, 001D 16, 015 12, 016 10, 020 9, 009A 5, 003E 4, 008 4, 052 4 -- hindi pa nasusuri isa-isa (isusunod).
- DITL: identical.

## v44 — Isang live na kulay (sumusunod sa "Live:"), wala na ang Shift+click
- Dati: digital 1 = pula, analog = cyan -> hindi sumusunod sa "Live:" dropdown (kahit Green ang pili mo, pula pa rin). Mali iyon.
- Ngayon: ANUMANG active na linya (digital 1 O analog na may value) = ang "Live" colour na pinili mo sa toolbar (tulad ng v28). Hindi active = abo (mas maliwanag na ng kaunti para hindi mawala sa itim). Hindi napiling input ng T switch = mas madilim. Forced = amber. Napili = puti. Pati ang junction dots sumusunod.
- Inalis ang Shift+click force sa drawing. Input wire (walang driver) = isang click = 1/0. Wire na galing sa logic = ang logic ang nagpapasya ng ilaw; click = inspect lang. Force = FORCE buttons sa panel lang.
- Sinuri ko ang "putol" gamit ang pixel check sa 22,000 sample sa ABC-050: walang linya na natatakpan o nawawala sa render. Kung may putol pa rin, kailangan ko ang eksaktong lugar (hal. "sa pagitan ng T1 at T2").
- DITL: identical.

## v43 — Putol-putol at "active na kaagad" na linya (ayos)
Hindi putol sa DXF ang mga linya (sinuri ko: lahat ng 327 segment ay nasa net). Ang nakikita mong "putol" at "active na" ay galing sa DISPLAY at DEFAULT:
- Putol-putol na itsura: (1) ang hindi napiling T branch ay dashed (putol-putol) -> ngayon solid na madilim; (2) ang value badges (hal. 14.80) ay may makapal na itim na halo na pumuputol sa linya -> mas manipis na ang halo at inilayo sa wire.
- "Active na kaagad": (1) ang junction dots (bilog sa sangahan) ay laging cyan kahit patay ang linya -> ngayon sumusunod na sa kulay ng linya nila; (2) ang AI ay nagsisimula dati sa gitna ng range (hal. 75 kg/cm2), kaya may 14.8 na error -> lumalabas agad ang M.071A/M.0707/M.0709 -> ngayon AI ay nagsisimula sa baba ng range (plant patay/cold), kaya tahimik ang simula. (Pass-through pa rin ang PID: TEMPORARY.)
- Lahat ng ito ay display/start lang; hindi ginalaw ang logic. DITL: identical.

## v42 — ABC-050 na-check laban sa PDF (block by block)
- Ikinumpara ko ang buong ABC-050 PDF sa netlist ng simulation (T-chain 60.2/80.3/109, OR/AND gates, SIG.AB, TPS/TON/TPh timers, SV T-switch + COS, A/M, BU-CMD, RB-MV chain, RAMP, LLIM, average select, SR flip-flops, blow-off, LP bypass, 160/140 at 45 T/H switches). Tama ang koneksyon at ang a/b/1:a/1:b ng lahat ng nabanggit.
- 1 TUNAY NA MALI ang nakita at naayos: ang comparator "<= PICMS1006.MLD" (M.0706) ay ikinukumpara pala ang MV sa SIGNAL (hindi sa number). Dati ay 0 ang basa kaya hindi kailanman 1 ang M.0706. Ngayon: MV <= MLD (kapag M.0708 = 1 at naka-clamp ang MV sa 12%, M.0706 = 1). Gumagana ito sa lahat ng sheet na may comparator na may signal name sa threshold.
- Scenario tests: BFWP off 15s -> M.0702/M.0703/M.0705 = 1; MFT + cyclone temp -> M.0708 = 1 -> MLD = 12; T-chain warm/hot/ICV; average ng dalawang pressure AI. Pasado.
- DITL page: hindi ginalaw (identical).

## v41 — Bagong kulay ng linya (may malinaw na distinction) + legend
- Dahilan: sa v40 lahat ng analog line ay iisang asul kahit may value o wala, kaya hindi mo makita kung alin ang buhay.
- Digital 1 = pula, makapal. Digital 0 = madilim na abo, manipis.
- Analog na may value (hindi 0) = maliwanag na cyan, makapal. Analog na 0 = madilim na asul, manipis.
- Hindi napiling branch ng T switch = napakadilim, putol-putol (dashed).
- Forced = amber dashed. Napiling wire = puti dashed.
- May legend na nasa kaliwang-ibaba ng drawing (analog mode lang).
- DITL page: hindi ginalaw (regression identical).
- Susunod (kapag sinabi mo): global tag board, presets (Normal / Plant trip / Custom), plant setup page, trace.

## v40 — Fix flicker kapag nagse-select / unselect
- Dahilan: sa Auto-hide, ang panel ay bumubukas/sumasara kaya nagbabago ang lapad ng drawing (960 ↔ 1260) at nagre-rescale ang view; gumagalaw din ang target na kina-click.
- Ayos: sa Auto-hide, ang panel ay lumulutang SA ITAAS ng drawing (overlay), kaya hindi na nagbabago ang laki o view ng drawing. Ang laki ng drawing ay constant.
- Dagdag: hindi na tumatalon ang listahan sa pane kapag may napiling block (ina-adjust ang scroll), at ang highlight ng row ay nag-scroll lang sa loob ng pane.
- Mga plano na nasa v41: global tag board, presets (Normal operation / Plant trip / Custom), Plant setup page, trace overlay.

## v39 — Click/Force, analog ramp, lit/dim lines, right pane na may description
- Click: digital input = 1/0 (isang click). Signal na galing sa logic: plain click = inspect lang. FORCE ay hiwalay: Shift+click sa drawing, o ang FORCE 1 / 0 / Release buttons sa panel.
- Analog na gumagalaw: AI at analog inputs na ise-set mo ay umaabot sa target nang unti-unti (toolbar "Analog: slow / normal / fast / instant", default normal = 5% ng range kada sec). PID output may limit din sa bilis. Logic blocks (T, SUM, comparator) ay instant pa rin (tama sa DCS). Naka-save ang pili sa browser.
- Linya: digital 1 = pula (live), digital 0 = madilim, analog = asul, hindi napiling input ng T switch = madilim, forced = amber dashed.
- Right pane: may search; kategorya: Digital inputs (naka-group ayon sa "FROM ..." ng drawing), Analog inputs, Setpoints & constants, Timers (may output address), Controllers, From other sheets. Bawat row: tag + description galing sa drawing + value + control. Click sa tag/description = pumunta sa drawing; click sa drawing = nagha-highlight ang row.
- Timer display humihinto sa preset (15.0 / 15 s).
- SIG.AB flags (B.xxxx): dating walang output ang 186 sa 198; ngayon, kapag may kaparehong address sa wire ng sheet, ang flag ang nagda-drive (hal. ABC-050 AND ng dalawang SIG.AB -> M.0703). 129 pa ang walang katapat sa sheet nila (siguro ginagamit sa ibang sheet).
- AUDIT tags: sa 327 na tagged na external input ng ABC, 50 ay driven sa ibang sheet (by tag) pero hindi pa naka-link; 277 ay walang driver sa ABC (labas / DITL / HMI). Plano v40: global tag board (SI0700 = isang value sa lahat ng sheet) + Plant setup page + presets.
- Hindi pa: presets, trace overlay, plant setup page, global tag link.

## v38 — ABC-050 binasa nang buo (reference sheet) 
Tama ang user: ang ⊠ (parisukat na may X) ay NOT gate. Ibinalik ko ito (ang v36/v37 na "pass-through" ay MALI, tinanggal na). Ang dating "naka-trigger" ay dahil sa X-box bridge na iyon.
Rule na dapat tandaan: sundan ang arrow para malaman ang direksyon ng NOT; bar + bilog = OR (hindi NOR).
Naayos sa ABC-050 (at sa lahat ng sheet na may parehong pattern):
- NOT direction: kung ang kabilang wire ay may arrow sa dulo, iyon ang output (hal. NOT papuntang RATE bypass).
- Constants na may unit (60.2 kg/cm2 (COLD), 80.3, 109...) dati 0 → nababasa na (T1→T2→T3 start-up pressure chain).
- A-box na may pangalan ng signal (hal. PICMS1006.MLD) = reference sa signal na iyon, hindi constant.
- Mahabang gate bar (hanggang 130) = OR/AND na rin: M.0686 (OR ng 6 na H/ comparators) dati hindi nababasa.
- Input ng comparators/math/SEL/AO/ALM/PID ay analog kahit cyan ang kulay ng linya.
- RAMP (bumpless) bypass pin (PICMS1006.LOC): tama na ang main input vs bypass.
- T-diamond: control = pin na may "1:A"/"1:B"; kung dalawa ang control (1:A at 1:B), B ang priority, tapos A, kung wala pareho hold sa huling pili. Label ng control hinahanap sa pinakamalapit na text.
- TPh (pulse na may variable na oras, "Xs", hal. TR237): bagong block TPV; ang oras ay galing sa analog input (SI0169 = 1.5s o 3s).
Test sa ABC-050: walang input = lahat 0; I.0400=1 → M.0124 5s pulse → M.0701 10s pulse; BFWP A/B hindi running 15s → M.0702; M.012D pulse 3s (1.5s kung I.0937=1).
Hindi ginalaw: DITL, page linking (circles).
Hindi pa tapos: sheets 003A/B/C/D/E, 004A/B/C, 008, 009A/B, 001A/C na may T-switch na walang control pin (listahan sa chat); contact sa ABC-055.

## v36 — Putol na linya / symbols audit
- Gate bars hanggang 75 units na ang binabasa (dati 40) → +68 OR gates; latch gates (output balik sa input) OK na.
- X-box (kahon na may dayagonal na linya = hard-wired contact) → pass-through na, hindi na putol ang wire.
- Contact symbol na dalawang bilog (CTK): 5 nakita (ABC-007 x2, ABC-013, ABC-051, ABC-052). Assumption: control=1 → pass, 0 → putol.
- Hindi pa nade-detect: contact sa ABC-055 (760,408). Natitirang kakaibang pins: SW, SUB, HC/LC, MUL, LLIM sa ilang sheets (listahan sa chat).
- DITL hindi ginalaw (regression identical).

## 2026-10-06 · v35: wiring rules like DITL v28 (strict T), long-bar gates, tag linking (ditl-workbench-v35.html)
User: signal connectivity depends on arrow flow and junction dots; without a dot it is a PASS-THROUGH (study v28).
- Nets: an end touching the SIDE of another wire joins ONLY through a junction dot (same "strict T" as DITL v27/v28); end-to-end and collinear overlaps still join. Crossings / T-contacts without a dot are separate wires. Before, they were merged: ABC-050 M.0702 (TON 15 s) was joined with the M.0124 bus through a crossing without dot.
- Gate bars: bars longer than 40 units were ignored, so 68 OR gates (and a few AND) were not read (e.g. ABC-011 NOR with latch M.0235). Limit raised to 75. A gate output may branch back to its own input (latch): the net is now both in and out.
- Same tag on several wires = one signal now uses every tag text (S.tagN), not only the best one per net.
- ACT (valve actuator) drives its position (0-100) on the wire that leaves it (feedback); I/P takes the input with the arrow from the left as its main input.
- Result: external inputs 904 -> 965 (real field / other-sheet signals that were hidden by false merges). ABC-050 now: outputs O.0842..O.0845 follow I.0400 / I.0937 / I.0932 via OR + TPS 5 s (not the old false TON path).
TESTS: DITL 134 sheets identical, 54 sheets no NaN, ABC-057 scenario unchanged, UI tests OK.

## 2026-10-06 · v34: legend-based re-reading, setpoints fixed, click-to-toggle digital, Reset all, UX fixes (ditl-workbench-v34.html)
User feedback on v33: jump zooms too much; random view movement in Run mode; values overshoot set points; symbols not read per the legend (ABC-000); sheet list "loading" forever; Reset must clear all values + forces; digital signals = click the signal (1 / 0) like v28, no force button; "read the diagram like an engineer". RULE: never touch the DITL page unless told (DITL regression: 134 sheets identical to v28).
READ FROM THE LEGEND (ABC-000) AND THE DRAWINGS
- ">" box = HIGH selector (max), "<" box = LOW selector (min), "H/" = comparison larger-than, "/L" = smaller-than, "< >" box = HIGH/LOW limit (kind HLLIM, only on the legend), HLIM / LLIM boxes: the signal passes straight through, the limit comes from the side pin (min / max), as before and confirmed on ABC-050 / 053.
- Comparator set points: 28 comparators had set point 0 because the text is written "> = 2%", ">= 83.3%", "< = 3T/H", "> 0 kg/cm2". Now parsed (operator, optional =, number, unit; the text matching the block direction wins). Inclusive (>=, <=) supported. This was one cause of "values go past the set point". 15 comparators still show 0: really "0" on the drawing or no number written (ABC-001A 16/17); CMPK "< X%" (ABC-003E) is a variable, edit it in the panel.
- PV < SV box: output = (PV < SV); PV = input on the right side, SV = the other.
- H/L dual comparator (ABC-001D, ABC-001C): one input, two outputs, each output has its own text (<= -2 MW, > -0.3 MW). New kind DCMP.
- Rate limiter box without text (ABC-003E, 19x12): signal in, 2 limit inputs (left = up rate, right = down rate, assumption), "1:BYPASS" digital input. Rate limiters with only one analog input now also have the bypass input (1 = pass through). A limit input <= 0 = no limit. Units per second (assumption).
- Valve actuator "M" trapezoid (37 of them, e.g. MCV-FA1043-B): new kind ACT, follows the AO signal with a full-stroke time (default 30 s, editable) = position feedback; it is filled with colour by position and shows the %. AO and PO triangles are filled with colour by the signal (0 - 100 %) and show the value.
- PID / PIDV: TEMPORARY (agreed) output = input, limited to the output range (0 - 100). Windup / overshoot is gone (AI 80 gave PID output 3231 and AO 3231 % before). SUMA / SUMP: output = input (temporary). MAN: manipulated value station, slider, no input pins needed.
- T switch / COS: the switch shows which input is active ("▶A" / "▶B", "(M)" when forced) on the drawing; in the panel select Auto / Force A / Force B (COS = manual change-over). Saved per sheet.
- ALM: highlighted by level (HIGH-HIGH / LOW-LOW red, HIGH / LOW orange) when the limits are typed in the panel (the limits are in the HMI, not on the drawing).
- LN tables: 89 tables from DCS LINEAR CURVE.xls are built in (script id="aln"). Resolver: same drawing no. + letter, else same drawing number ignoring the letter (003B / C / D use the tables of 003A), else the only table with that LN number (ABC-010 LN38 / 39). 111 of 112 F(X) blocks matched (the 112th is the legend symbol). The panel shows the table name, title, a small curve and the live operating point. Manual tables (LN dialog) still override.
UX / BUGS
- Jump (numbered circle): keeps your current zoom (also to another sheet); emphasis = bigger pulsing ring + soft fill for 3.6 s. Two-number circle: always opens its target sheet (finds the same number there, else opens the first sheet of that drawing).
- Random view movement: (1) after a pinch the remaining finger moved the view with an old position, (2) a mouse release outside the canvas left the drag "on", (3) the panel opening / closing (Auto-hide) changed the canvas width and rescaled the whole drawing = "zoom out". Fixed: pointer state cleared (buttons === 0, lost capture, pinch end) and the zoom is kept when the canvas is resized.
- Sheet list "Loading..." forever: the list was not rebuilt when switching DITL -> Analog again. Fixed (also shows an error text if the data fails).
- Reset = ALL sheets: forced signals, inputs, sliders, MAN, switches, timers, tuning/parameters, saved values.
- Digital signals: click the wire, its tag text, or the SIG.AB box = 1, click again = 0. A signal computed by the logic goes FORCE 1 -> FORCE 0 -> AUTO (toast shows the state). The force button for digital signals is removed from the panel (hint text + x to release). Analog still uses value + check + x.
- AI input is limited to its range (type / slider).
TESTS: 54 sheets compile, no NaN; DITL 134 sheets identical to v28; wire click toggles 1 / 0; no view movement without button; list OK after switching categories; AO / ACT fill and ALM level seen in screenshots; cross jump 050 -> 051 and Back.
STILL OPEN / ASSUMPTIONS TO CONFIRM: rate limiter limit inputs (which is up / down, per second); ACT stroke time 30 s; PV vs SV pin choice; ABC-001B "/" box and a few small unknown boxes (4T / 8T in ABC-004A, 22x18 in ABC-001A) not read; floating wires: the checked unlabeled inputs do not touch other wires (8 are the SIG.AB cuts, on purpose), no new connections added; PID real algorithm later; no plant model; link ABC <-> DITL not made (as agreed).

## 2026-10-06 · v33: panel tab, accept (check) buttons, numbered circles linked + jump, cross-sheet signals, review findings (ditl-workbench-v33.html)
User feedback on v31: panel closed with X could not be reopened; wants a check button next to X for forced analog values; circles with numbers must be linked (consider signal flow), click = jump to the other end; asked for a categorised review of the simulation so items can be taken one by one.
DONE
- Panel: "◀ Panel" tab on the right edge whenever the panel is hidden (and the Panel button in the toolbar).
- Force / INPUT analog value: type, then ✓ (or Enter) accepts, ✕ releases (force). Nothing is applied while typing.
- Numbered circles: plain circle = same sheet, same number, signal flows from the circle with the arrow IN (sender) to the circle with the wire OUT (receiver). Click a circle: view centres on the other end (flash ring), click again = next end if there are several; "Back" button returns. Circle with TWO numbers (02 / 051, upper = connector number, lower = drawing it goes to) was wrongly linked as a plain circle: it is now a cross-sheet link: click = open ABC-051 at the partner circle (02 / 050 there). Arrow-less circle fed by a block counts as sender.
- Cross-sheet SIGNALS: linked sheets are simulated together (up to 16, one tick lag per hop). Panel section "From other sheets" lists them with live value and a jump button. Plain circles that continue on the next sheet of a drawing family (004A -> 004B / 004C, 009A -> 009B, 003A -> 003B..) are linked the same way.
- T switch with B open and a COS diamond (106 of 391 selectors): the output HOLDS the last value in manual (was forced to 0).
- Wire drivers de-duplicated (a block with two output pins on one wire was counted as a second driver).
- Saved values are versioned (parser change drops them; net numbers changed in v30 - v33).
REVIEW FINDINGS (backlog, not done yet; counts over the 54 analog sheets, 3104 blocks)
A. WRONG / MISSING FUNCTION
 A1 PID uses the error in engineering units (kg/cm2, degC), not % of range: Kp 1 saturates the output for a few units of error. No derivative (Td ignored). No dead band. 67 PID + 3 PIDV.
 A2 SUMA (11) and SUMP (1) blocks are not modelled (the first input is passed through).
 A3 Selectors: 163 of 391 incomplete. 106 = B open + COS (hold, fixed in v33, meaning to be confirmed), 42 without a select input, 12 without an A input, 3 other (ABC-050 SW42, ABC-052 SW61 / SW66).
 A4 Assumptions: SQRT (14) = 100*sqrt(x/100); HLIM / LLIM (9) min / max mapping; SEL select circuit (28) = average only (PRI / SEC not modelled, SIG.AB not used); PV < SV box (2) pass-through.
 A5 LN tables: 112 F(X) blocks, 37 tables (LN1 ... LN59) are identity until the Excel arrives.
 A6 ALM (105) have no alarm levels / outputs.
B. DRAWING NOT RECOGNISED
 B1 159 unknown shapes: 78 small arrowheads (harmless), 37 "M" flag shapes 28x11, 17 arrow-glyph rectangles 19x12 (ABC-003E), about 27 others.
 B2 56 blocks with missing pins (mostly MAN with no input = tracking input not drawn / not found, SW46 of 003B / C / D with no pins, SUB20 of ABC-008).
 B3 1324 wire pieces touch no block (516 longer than 25 units): part are frame / leader lines, part real missing connections.
 B4 535 of 916 external inputs have no tag text (named by the nearest text).
C. LINKS BETWEEN SHEETS
 C1 111 two-number circles: 103 linked, 8 not (ABC-003E 14/007 and 15/002, ABC-030 2/050, ABC-050 2/030 and 6/052, ABC-052 6/050 twice, ABC-001C 7/050). 22 plain circles have no other end in their drawing family.
 C2 One tick lag per hop, limit 16 sheets; a link to a DITL sheet is not made (only after "go linking").
D. PROCESS REALISM
 D1 No plant model: PV never reacts to the valve / output, the AI slider is moved by hand.
 D2 AO / I/P: no valve position or feedback. Field outputs (O.xxxx flags) are lit; solenoid / valve states not simulated.
E. USABILITY
 E1 Reset only resets the open sheet (linked sheets keep their state).
 E2 No readiness / health report like v28 (READY x / y); Health only counts.
Tests: 54 sheets no NaN, DITL 134 sheets identical to v28, ABC-050 valve outputs light up from inputs only, cross jump 050 -> 051 and Back.

## 2026-10-06 · v31: inputs drive outputs (wired-OR, field output flags), Reset clears forces, Live colour option (ditl-workbench-v31.html)
User feedback on v30: "must I force everything? the logic should read the inputs and give the outputs"; Reset kept the forced values; no live colour option (only red).
FIXES / NEW
- Wired-OR: several block outputs joined on one wire (ABC-050 M.0124 bus = TON 15 s + TPS + TPS) were overwriting each other (last writer won). Now a wire with 2+ drivers = OR of the drivers (S.multi, rt.stp / rt.acc per step).
- Field output flags ("<" tip + tag O.0842 + description, e.g. HP BYPASS PRESSURE SOLENOID VALVE FOR CONTROL VALVE OPEN) are blocks now (kind FOUT, 1 input). The flag is filled with the live colour when its input is 1. ABC-050 with NO force: after 15 s (TON) + 3 s (TPS) O.0842 / O.0844 light up.
- Run is ON by default when the Analog tab opens (timers and PID need time). Panel: Timers section (progress, Skip), Controllers, Inputs last. Inspector: an input wire shows its own INPUT switch / number; a computed wire says "computed by the logic", FORCE is only an override.
- Reset = everything of the sheet back to start: forces, switches, sliders cleared (tuning and parameters kept). Panel rebuilt (the old one held stale references).
- Live colour select in the analog toolbar (same setting as DITL, shared).
TESTS: 54 sheets no NaN, ABC-057 unchanged, DITL 134 sheets identical to v28, reload keeps category.
OPEN: M.012D (LP bypass) is an external input of ABC-050 (source is on another sheet / not drawn here); other sheets not checked one by one against the PDF; PID tuning temporary; LN empty; no plant model.

## 2026-10-06 · v30: FORCE any signal, timers fixed, analog/digital by driver, auto-hide panel (ditl-workbench-v30.html)
User report (ABC-050): could not simulate / bypass digital signals, could not make the valve move; wants every input AND output simulatable, wires lit when active like DITL, right pane auto / manual hide.
FIXES / NEW
- FORCE: click any wire or any pin of a block (input or output): digital AUTO -> FORCE 1 -> FORCE 0, analog = type a value (x releases). Engine: rt.force[net] overrides the driver (applied right after each block and on external inputs). Forced wires are dashed (orange when off / analog), "Forced signals" list with Release all, saved per sheet (ditl.an, force).
- Timers: a wire drawn straight through a TON / TPS half-disc joined its input and output (ABC-050: 8 timers had no pins, e.g. TPS 101-107). anTimerCut splits the wire inside the symbol (also when one long wire crosses several timers).
- Same signal tag on several wires of one sheet = one signal (I.0937 twice, M.0124 output + inputs): extra nets are linked to the driven one, or share one external switch (ABC-050 external inputs 37 -> 32).
- Analog / digital is decided by the DRIVER block (PID, SUM, T... = analog; AND, OR, FF, timers, comparators = digital; inputs of gates = digital); the CAD layer colour was cyan for both (PID output of ABC-050 was shown as digital). Layer colour is only the fallback.
- Right panel: Auto-hide checkbox (hides when nothing is selected, opens when a block / wire is clicked), x button, Panel button.
- Digital wires light red when 1 (as DITL); selected wire is dashed.
TESTS: 54 sheets no NaN, ABC-057 scenario unchanged, DITL 134 sheets identical to v28, ABC-050: PID output reaches MV, forcing M.0704 = 1 drives MV = 12 (preset), force saved, panel auto-hide.
OPEN: ABC-050 not compared with the PDF line by line; PID tuning temporary; LN tables empty; no plant model; the others as in v29.

## 2026-10-06 · v29: ANALOG logic (ABC) added next to DIGITAL (DITL) in the same html (ditl-workbench-v29.html)
User directions: the new "analog interlock control logic" diagrams (ABC-xxx, boiler) must be simulated directly from the CAD drawings like the digital ones; ONE html with a category switch (Digital / Analog); LN (F(X)) tables come later from the user's Excel; PID tuning is temporary.
WHAT IS NEW
- Top-level category: "Digital · DITL" (button at the start of the v28 toolbar) / "Analog · ABC" (own toolbar). The choice is remembered (localStorage ditl.cat). The DITL engine and UI are untouched: render() and drawSide() are wrapped, in Digital mode they call the v28 functions. Regression: all 134 sheets give identical SVG output (static and simulate mode) in v28 and v29.
- 54 analog sheets are built in (ABC-FLAME excluded, 1 file). Stored as gzip + base64 NDJSON of the raw DXF geometry in <script id="apre">, built lazily per sheet: anBuild -> anNets -> anModel -> anWire -> anCompile -> anInit. Side list grouped by family (index & symbols, coordinated control, fuel & burners, air & furnace, water & level, temperature, steam pressure, other, imported) with search. Titles from the contents pages ABC-000A/B.
- Import ABC DXF (analog toolbar): session only, same name replaces the built-in sheet.
- Canvas: raw drawing with ACI colors, live overlay: digital nets red when 1, value badges on analog nets (labels, block outputs, external inputs), click a block or wire = inspector (pins, values, parameters), pan / wheel / pinch, F = fit, Space = run / pause, PageUp / PageDown = sheets.
- Simulation: Run / Pause, speed 1x 5x 10x 60x 300x, Reset (keeps your inputs). Substeps max 0.5 s. No plant model yet (process values do not react to valve / output): the user moves AI sliders by hand.
- Right panel: Inputs (AI sliders with the range read from the drawing, SIG.AB switches, external nets = digital switch or number), Controllers (PID Kp / Ti, MAN slider), selected block parameters (PID Kp Ti Td lo hi action, setpoints of HC / LC / CMPK, timer seconds, LAG tau, ramp rate, constants). Saved per sheet in localStorage "ditl.an".
- LN tables: window.ANLN (name -> [[x,y],...]), localStorage "ditl.ln", dialog "LN tables" (paste CSV  LN001,x,y  or JSON, download JSON). Without a table F(X) passes the value (y = x). TO DO: integrate the user's Excel when it arrives.
- Health (analog): per sheet blocks, external inputs, unknown shapes, blocks with missing pins.
ENGINE (js modules inlined in the html, prefix an*)
- Reader: own DXF tokenizer, nested INSERT explode, ACI colors, OFF layers skipped. Wires = LEADER / LINE / open LWPOLYLINE, arrowheads from LEADER, _OPEN30 inserts and SOLIDs, junction dots = donuts, nets by union-find with spatial hash. A LEADER line stops at the arrow base: a block pin is also an arrow TIP touching the block outline (fixed in this version, DEV of ABC-011).
- Blocks: PID, MAN, AI, AO, T / A-M switches (AMT, 1:b polarity), SUM / DEV / SUB, DIV, SQRT, HS / LS / HLIM / LLIM, H/ L/ comparators and K-compare, F(X), f(t) lag, ramp limiter, bumpless ramp, TON / TOF / TPS, FF, AND / OR / NOT, SIG.AB, constants (value text may carry a unit, e.g. 15°C).
- PID: tracking (bumpless) from the selector, anti-windup, ACT:R reverses; defaults Kp 1, Ti 60 s, Td 0 (temporary).
TESTS: 54 sheets compile and run 60 s with no NaN / exception; ABC-057 scenario (AI -> H/ L/ -> AND / OR -> FF -> T -> SUM -> ramp) correct; ABC-011 PID / DEV / T chain gives numbers; desktop + phone emulation; reload keeps category, sheet and inputs.
OPEN / KNOWN LIMITS: LN tables empty (identity); PID tuning temporary; SEL (select circuit) = average; SQRT assumes 100*sqrt(x/100); HLIM / LLIM mapping assumed; PV<SV box passes through; ALM has no outputs; arrow glyph block 19x12 of ABC-003E (17 times) not recognised; numbered connectors that point to other sheets are external inputs (linking ABC <-> DITL only after "go linking"); ABC-FLAME not included; no plant model; not compared with the PDF drawings except 057 / 011 spot checks.
ROADMAP: v30 plant model + checks of the other sheets one by one, LN integration; v31 alarms 4-level, SUMA / SUMP, average select, readiness report like v28.

## 2026-10-05 · v27 + v28: bundled fixes, saved values, readiness 127 / 127 (ditl-workbench-v28.html, DITL-status-report-v28.pdf)
Order agreed with the user: 94 / 60 (MOV), 21A / 61A (MOTOR), stubs of the audit, saving of typed values. All done. Result: loose ends 22 -> 0, READY 122 -> 127 of 127 (structural), Health-clean sheets 102, floating nets 5, cross-sheet connector nets 12 + 3 at cell edges (linking on hold), multi-driver nets 1 (DITL-03G, wired-OR, by design).
FIXES (v27)
- Box-edge filter: the vertical wire was dropped when it lay in the SPAN of all boxes with the same x (DITL-12A wire between two NOT gates, 21C, 94). Now it must lie inside a STACK of touching boxes (S over R of a flip-flop).
- NOT symbols up to 6.3 x 6.3 (DITL-117 5.7 x 5.4). Pieces shorter than 0.5 are noise. A wire end inside a gate box (line drawn past the arrowhead, DITL-94 / 96 / 24) is not loose.
- Vertical NOT with a horizontal tap (DITL-21A row 22): top and bottom nets decide the input, the right wire is an extra output.
- Timer label -> D arc matching is global (nearest pairs first): a label written BELOW its timer was taken by the timer under it (DITL-21D TR561 / TR623).
- Text-layer wires up to 215 long (DITL-76 / 77 vertical 132).
- Limit comparators: the setpoint text is searched 11 left to 42 right; operators >=, <=; a setpoint that is another analog signal (DITL-60 ">=AB0383", its wire enters the box from above) gives a CMP gate with TWO analog inputs (nl.an, key r25 / r27, default values keep it off). Tested: A 80 vs B 60 on, 40 vs 60 off, 60 vs 60 on.
- Strict T rule (a wire end on the SIDE of a perpendicular wire joins only through a junction dot) is used only for a sheet whose normal netlist has a net with two drivers and only if that gives fewer shorts: DITL-21E rows 6 and 9 are separate now.
- SAVED VALUES: localStorage "ditl.uv", per sheet name: analog values (av), MOV travel (mvt), pulse time (pdur), motor delay (mtd), timer values (tmo, key = tag|label|position). Re-applied when the sheet is shown (uvApply), merged into the store (uvSave). Tested: 61B row 9 = 88 and a timer = 7 s survive a reload of the built-in html.
FIXES (v28)
- A numbered circle in the FROM column of an input row = the signal comes from the connector with the same number in the logic: DITL-21A row 5 (AUTO SEQUENCE MODE SELECTED) follows the end of the row 26 wire (connector 4). Such a row is never part of an address group. Test: row 26 on -> row 5 follows, row 5 click ignored.
- Report probe: a row whose wire feeds a comparator limit, a mirror, or a field output is "consumed"; a wire stub shorter than 4 units is not an input (DITL-61A row 8: the drawing has a 2 unit stub only, signal from 61A-67).
Tests: 127 imports 0 fail, old clean sheets identical outputs, SV 27 / 27, motor 19 / 21A fwd / 45, MOV 56 / 38, DITL-62, 09, 06, 61B analog, 18 BI8 timer, phone + desktop emulation, persistence after reload.
Open: the 5 floating nets (DITL-18 1, 21C 2, 29A 1, 38 1), linking ("go linking"), DITL-18 row 24 (skipped by the user), DITL-21A reverse is a jog (confirm with the PDF), the new comparators of 63 / 111 / 112 not checked one by one, nothing compared with the PDF except DITL-06 (and earlier 56 / 62 / 69 / 81), not tested on a real phone.

## 2026-10-05 · v26: field outputs, numeric hi/lo selectors, sheet names (ditl-workbench-v26.html, BV = 26)
User directions: (1) for rows like DITL-18 row 24 and DITL-86 / 92 / 93 row 20 "use your diagram knowledge, you know what the output is, ask if unsure"; (2) hi / lo selectors: give input VALUES for the simulation like the timers, the setpoint is already in the logic; (3) name the pages in the left pane from the sheet content that is in the DXF.
1. SHEET NAMES: the title block lines (1 line on old sheets, 3 lines on new ones) are read from the DXF as sheet.title: texts x 112..222 in the band around the drawing-number text DITL-xx (yd-13 .. yd+8, the band moves with the page placement). All 134 sheets have a title (e.g. DITL-56 MISCELLANEOUS VENT AND DRAIN SYSTEM COND VACUUM BREAKER MOV MV-AV1391). Left pane shows two lines per sheet and searches name + content; the banner at the top starts with the title (still editable).
2. HI / LO SELECTORS (legend DITL-00: H/ = high limit, /L = low limit; also SIGHI / SIGLO symbols): now a CMP gate with a NUMERIC input. Setpoint, direction and unit are read from the text beside the box (> 568 C, < 5 %, > 1.7 M ...); without a readable setpoint the box stays a plain pass-through (old behaviour). One analog input per left wire (nl.an): default value = a normal value that keeps every comparator off (half the lowest high limit, 1.5 x the highest low limit, midpoint when both exist). UI: the input row shows a value badge instead of the switch (red when a limit is reached, click = type a value), and the Timers / MOV panel has a section "Analog inputs (high / low limits)" with one number field per input and "H >165 ON / off" per comparator. Values are saved per sheet (s.av). Test DITL-61B: row 9 = 96 (> 95) -> OR on; 95 -> off; row 12 = 170 -> on.
3. FIELD OUTPUTS: (a) every arrowhead that does not enter a gate / timer / comparator / connector / right cell, and every unconsumed gate output ending at a DCS output address (O.0093 ...) is a field output: a dot at its end shows ON / OFF, a lamp symbol on the same level lights (DITL-18: the five OR gates drive the LCP lamps B01 - B05; row 24 BO6-DO1043-A igniter transformer output dot); lamps inside the sheet (MCC GREEN / RED) light when a live wire touches them. (b) SV circle lights when the DCS output to the coil is ON (all 27 SV valves); SV without ZSO / ZSC (DITL-44, 86, 92, 93) is a model with coil status only ("SV COIL ENERGIZED (DCS output ON)"). DITL-86 coil on with rows 5 + 7.
4. FIELD INPUTS: a consumed net with no driver that starts below a field tag (BI8-DO1043-A, MIA-CL1061-A2, MIT-L1060A, XA-FA1052-n, ZSR-/ZSE-DO1043-A..) gets a TEST SWITCH with the tag (DITL-18 BI8 / BI9 feed the OFF-delay timers: BI8 on -> row 74 lit, holds 2 s after BI8 off). Found on 120, 16, 18, 19, 21A, 38, 39, 43, 61A, 76, 77.
Tests: 127 imports 0 fail, old clean sheets identical, SV 27/27 reachable, motor 19 / 21A / 45, MOV 56 / 38, DITL-62, DITL-18 BI8 timer, DITL-61B analog, phone + desktop emulation OK. Not compared with the PDF.
Open: ask the user about the igniter transformer (DITL-18 row 24 output has only a dot, no symbol animation), 21A reverse jog, remaining stubs, linking on hold.

## 2026-10-05 · v25: DITL-09 and DITL-18 fixed, v23 regression repaired (ditl-workbench-v25.html)
User: DITL-06 (v24) is OK, will check its siblings later; continue in the agreed order (09, 18, then SOLENOID new 86 / 92 / 93, MOV new 94 / 60, MOTOR 21A / 61A).
DITL-09 ROOT CAUSES
1. REGRESSION of v23 (my fault): dash-dot (CEN) lines were taken as wires when they touch a wire. The dash-dot FRAME of the cell column (vertical on x=S1 / x=R0, or a horizontal line crossing the cell edge) touched every input wire start, so all input rows were on one net / lost their source. Rule v25: such edge lines are excluded (isEdge). Check after every change: no sheet may have several input rows on one net (audit "shared" = only DITL-16 and 21E, both real).
2. The vertical NOT on the DITL-09 bus (row 14 NOT REMOTE SELECTED -> NOT -> upper ANDs): direction defaulted top -> bottom, so the net with the row 14 source became the NOT OUTPUT and v20 removed it as input source (row 14 had no source). Vertical ARROWHEADS (tip up / down) are now collected; an arrow tip on the bottom edge pointing up = input at the bottom (flow up), tip on top edge pointing down = input at the top.
DITL-09 test with real clicks: row 14 off (REMOTE): CRT PB row 5 -> row 56 lit + 27 REMOTE lit; row 14 on (LOCAL): row 26 lit, CRT PB 5 does nothing, LCP PBs 16 / 20 / 24 -> rows 6 / 10 / 24 lit. NOT OFF PB rows (18, 22) must be ON for normal operation (default OFF = OFF pressed, lamps 58 / 62 lit).
DITL-18 (field wiring + logic): five OR gates (row n OR row 20 LCP LAMP TEST) -> DCS output addresses -> field contact + lamp circuit. Not wiring defects: (1) the DCS output address label is written to the LEFT / above the arrow end (window x-34..x+18), (2) arrowheads on the SYM layer (3-point solids) were ignored and a wire that ends INSIDE the arrowhead is a terminal. Loose 6 -> 0. Row 24 (ENERGIZE IGNITER A TRANS.) ends in an arrow to a field contact: a consumer outside the DCS (report "dead input" only).
Side effects: loose ends 41 -> 22 (DITL-22, 30, 31, 111, 112, 26B too), READY 118 -> 119 (clean sheets 93). Regression: SV 23/23, motor 19 / 21A / 45, MOV 56 / 38, DITL-62, phone and desktop OK.
Still open in the report: 86, 92, 93, 94, 60, 61A (row 20 / 25 / 8 command rows that end at field assemblies), 94 / 96 / 102 / 21C / 21D / 24 / 76 / 77 / 117 / 12A / 19 / 21A stubs.

## 2026-10-05 · v24: DITL-06 fixed (slightly skewed straight wires) (ditl-workbench-v24.html)
User named DITL-06 as a page with broken connected wires and approved the order LOGIC (03F, 03H), SEQUENCE (06, 09), FIELD WIRING (18), SOLENOID new (86, 92, 93), MOV new (94, 60), MOTOR (21A, 61A); one sheet at a time, user compares with the PDF.
ROOT CAUSE (DITL-06): the RESET bus (185.8,45.7)-(185.9,280.4), 235 units long, is 0.1 off vertical. The orthogonality test was 0.05, so the bus was dropped and every R pin of the 10 first-out latches sat on its own net (dots at the R pins touched one stub only). New rule: a line is straight if min(dx,dy) < 0.05, or < 0.25 and min/len < 0.02; the coordinate is averaged (lines and polyline edges). Skewed lines found: DITL-06 (V 235), 03F (H 113), 03H (H 8), 17 (V 82), 21E (H 77), 0A (H 317), polylines in 101 and 107.
Result: DITL-06 loose 2 -> 0; 03F and 03H pins and loose ends 0; 21E loose 0. READY 115 -> 118 of 127; loose ends 47 -> 42.
Functional test DITL-06 (real clicks): rows 3 (NO TRIP PRESENT) + 5 set latch 1 -> lamp row 55 and OR row 52 lit, holds after row 5 off; row 8 without row 3 does nothing (AND); row 2 RESET clears all latches (reset dominant); latch set again when the reset is released while the trip persists.
Not READY now (9): DITL-86, 92, 93 (input row 20 = command row, field assembly), 94 (row 20 + 3 stubs), 09 (row 14 NOT REMOTE SELECTED has no consumer), 18 (6 stubs + row 24), 21A (pin + 3 stubs + row 26), 60 (row 25), 61A (row 8).
Built-in sheets re-exported (BV = 24). Regression: SV 23/23, motor 19 / 21A / 45, MOV 56 / 38, DITL-62, phone and desktop OK.

## 2026-10-05 · v23: categories listed, junction audit, dash-dot analog wires (ditl-workbench-v23.html)
User (on PC now): v22 is OK, some pages still have wire connection problems although junctions exist. Asked for the list of DXF categories, to fix per category, then sheet by sheet.
CATEGORIES (family + template; total 134 sheets = DITL-00 legend is not a sheet): COVER/INDEX old 4 (0A-0D); SEQUENCE/TRIP old 14 (01 05 06 07 09 10 11 12 12A 12B 12C 13 14 15); LOGIC other old 12 (02 03A-03H 36 37 39); PASS-THROUGH old 4 (08 16 17 119); FIELD WIRING + logic old 1 (18); ANNUNCIATOR old 3 (40 41 42); INTERFACE old 2 (50 115); MOTOR old 29 (19 21A-21E 22 23A 23B 24 25A-29B 30 31 43 45 111-114 120); MOTOR new (HVP / softstarter) 6 (61A 61B 76 77 117 118); SOLENOID old 9 (20 28C 32 33 35 44 57 73 78); SOLENOID new 17 (62 63 66 67 68 72 74 79 80 81 83 86 88 89 92 93 121); MOV old 2 (38 87); MOV new 31 (51-56 60 64 65 69-71 75 94-110 116).
JUNCTION AUDIT (1,184 dots in the logic zones): every drawn dot candidate that would have joined two nets is recognised (0 missed). 33 dots touch only one wire (stubs at S/R outputs and on dash-dot lines). 62 dots have another net's wire 1.9-3.0 units away: normal drawing density (they already join their own H and V), not a defect. Conclusion: dots are NOT the cause of the remaining connection problems.
FOUND AND FIXED: dash-dot (CEN) lines that touch wires or dots are WIRES (analog PV wires from an input row to the H/ and /L comparators: DITL-03F, 03H, 44, 23A). Closed loops (box outlines) and lines longer than 150 (row separators) stay out. Floating nets: 03H 16 -> 1, 44 8 -> 0, 03F 5 -> 2. CEN polylines get their lit colour through plk.
STATUS per category (READY = no missing pin, <= 3 stray ends, every input reaches something; 115 of 127): LOGIC 10/12 (03F, 03H), SEQUENCE 12/14 (06, 09), FIELD WIRING 0/1 (18), MOTOR old 28/29 (21A), MOTOR new 5/6 (61A), SOLENOID old 9/9, SOLENOID new 14/17 (86, 92, 93), MOV old 2/2, MOV new 29/31 (94, 60), others all READY.
Regression: 127 imports 0 fail, old clean sheets identical, SV 23/23, motor 19 / 21A / 45, MOV 56 / 38, phone + desktop emulation OK, 83 Health-clean sheets.
Next: one-by-one pass per category (render with inputs ON, compare to the PDF with the user). Floating nets remaining 91 -> about 60 (DITL-19 MIA alarms are field signals: unlit by rule).

## 2026-10-05 · v22: sheet list moved to a left pane that can be minimized (UI only, ditl-workbench-v22.html)
User asked to move the wrapped row of 135 sheet buttons (top of the screen) into a left side pane that can be minimized. Logic and built-in sheets are the same as v21 (parser BV = 21), regression identical.
- Left pane "Sheets (N)": search box (type 56, 03, DITL-4...), one row per sheet, current sheet highlighted and scrolled into view, stale sheets marked with a warning sign. Button at the top of the pane hides it: a thin strip (28 px) remains with the current sheet name written vertically and the arrow to open it again. State is remembered (localStorage ditl.side). Old tab buttons are hidden. PageUp / PageDown change sheet when not typing.
- Phone (< 820 px): pane starts minimized; opening it takes 62 % of the width; picking a sheet closes it again. The dropdown with previous / next buttons stays in the top bar.
- Tested in headless Chromium: desktop 1500 px and phone emulation (tap), 134 sheets, filter, selection, minimize, no page errors.
## 2026-10-05 · v21: loose ends fixed by family (ditl-workbench-v21.html, DITL-loose-ends-report-v21.pdf)
User: "be wary of junctions and flow of signals based on gate input/output and the arrows" then "fix the loose ends by family category of the DXF based on your v19 report".
Method: two invariants over every net: (1) at most ONE driver (gate output or input row), (2) a consumed net must have a driver; plus every loose end drawn on the sheet and classified. Junction dots are complete: making T-joins need a dot changed almost nothing (50 -> 48 multi-driver nets), so dots were NOT the cause. Multi-driver nets 50 -> 3 (DITL-03G, 16 and 21E remain), loose ends 409 -> 47, Health-clean sheets 39 -> 82, READY (no missing pin, <=3 stray ends, every input reaches something) 77 -> 114 of 127.
Connection bugs fixed (all families)
- Gate input bar (AND / OR) drawn as MANY short collinear vertical pieces or offset up to 1.3 inside the box edge: the pieces were read as a wire that joined every input (DITL-21C three AND outputs on one net; SV sheets 73, 74, 80, 81, 88, 89, 121; DITL-83). Pieces are chained into one bus; a thick bar alone is a bus.
- A wire BEND near the cell edge was taken as the start of the neighbour row's input (DITL-99..110 rows 1 and 3 on one net). A wire START must be a free end or the left-most point of its net (right-most for outputs). A net driven by a gate (after a pulse timer) is never an input source.
- Gap healing glued an end that has an ARROWHEAD (or its base) onto any wire 1.2 away (DITL-94 / 96 AND output on the OR output wire) and healed the artificial cut ends of a pulse split: both forbidden. New rule: two free ends that face each other on the same line, gap <= 3, join (hops and broken drawing lines) but never across a gate / timer / pulse glyph body and never near the cell edges.
- Regression I introduced in v18/v19: the regex that finds the "COMM." text of the MOV block had a doubled backslash, so the MOV outline merged OPEN and CLOSE of the MOV sheets. Fixed; check "MOV blocks with OPEN and CLOSE on the same net = 0" after every change.
- Row numbers of one and two digits differ by ~2 in x: rows 4-8 of DITL-24, 30, 31, 111-114, 120 were lost (their inputs had no row).
- Pulse glyph at the cell edge (DITL-21D, 83): the input row feeds the pulse timer.
Loose-end exemptions (field / terminal, NOT logic): any circle, arrowhead tip or base on the wire end, DC / 24V / DC 24V / COMMON / N labels (window x -3..+16, y 8), dash-dot (CEN) station / field lines, dashed field assembly boxes, pentagons, comparator symbols (SIGHI / SIGLO / 0SIGHI / 0SIGLO now bridge the wire like ICD130), "H/" "/L" boxes, ICD130, RED / GREEN lamps of the MCC / softstarter box, the DCS output address label at a gate output (O.0093 / 0.0733), MOP- / MOT- labels, and the wire that ends at an equipment block (MOV / SV command, motor command and running feedback, test switch).
Per family (loose ends v19 -> v21): MOTOR 183 -> 29, SOLENOID 97 -> 0, MOV 93 -> 7, LOGIC 21 -> 1, FIELD WIRING 8 -> 6, SEQUENCE 7 -> 4. Not READY (13): DITL-86, 92, 93, 94, 06, 09, 18, 60, 61A (input row 20 / command row with a field assembly: no consumer), 03F, 03H, 21A, 23A (timer output pin / NOT without wire in the drawing).
ELECTRICAL TROUBLE pentagon: found by its text (one or two lines), the wire tip is the end of the wire; TEST SWITCH on 16 sheets (was 3). Outline lines are exempt.
Also in v21: all 134 sheets pre-parsed inside the html (parser version BV = 21): phone friendly, no DXF import. Rebuild recipe in the v19 entry (export every sheet with build(parse()), gzip + base64 into <script id="pre">, window.PRE_N).
Tests: 127 imports 0 fail, old clean sheets identical (smoke), SV 23/23, motor 19 / 21A fwd / 45, MOV 56 and 38, DITL-62 AUTO PB toggle, phone emulation (tap + pinch) OK. NOT done: comparison with the PDF of each family (only DITL-56, 62, 69, 81 were compared visually earlier).
Remaining: DITL-21A reverse jog, DITL-03F / 03H timer output, DITL-06 FF R pins, DITL-18 stubs, 245 nets that are consumed but have no driver (96 floating: 03H, 19, 06, 44, 43...), linking on hold.

## 2026-10-05 · v19: built-in sheets for the PHONE + loose-end report (ditl-workbench-v19.html, DITL-loose-ends-report-v19.pdf)
Problem: the user works on a PHONE and cannot browse to the DXF files, so every parser fix since v8 never reached the sheets stored in the browser (old autosave). That is why the H/ comparator "did not pass the signal" for the user although the engine test passed (v18: 178 of 178 comparator boxes bridged, DITL-61B rows 9 / 12 light the OR).
v19 = same logic as v18 (regression identical: 127 sheets, 0 fail, 39 Health-clean, 409 stray ends, 4 missing pins) plus:
- All 134 sheets (127 logic + covers) are INSIDE the html, pre-parsed with the current parser (gzip + base64, 2.2 MB, unpacked at start with DecompressionStream, about 1 s; needs Chrome 80+ / Safari 16.4+). No DXF import needed. Sheets in the browser autosave with an older parser version (or missing) are replaced by the built-in ones; the meta/banner, MOV travel and pulse times of the old sheet are kept; wire fixes (ditl.fixes) are re-applied by sheet name. Autosave of the whole project is skipped when the built-in sheets exist (too big for localStorage); the current sheet name is remembered.
- Phone UI: sheet dropdown with prev / next buttons (tabs hidden under 820 px), compact buttons, pinch zoom (two fingers) and one-finger pan, Timers / MOV panel starts collapsed on a narrow screen.
- Rebuild recipe: export every sheet with build(parse(dxf)) + JSON (nl removed), gzip, base64 into <script type="text/plain" id="pre">, set window.PRE_N, BV must equal the sheets' bv. If BV changes the built-in data must be re-exported (otherwise the tabs show a warning sign).
Report: DITL-loose-ends-report-v19.pdf (phone sized, 9 pages): plain-language meaning of loose end / Health check / READY, summary per family, READY list (77 of 127), details of the 50 sheets that are not READY (loose end with zone, row, nearest gate and text, gap to the nearest wire, missing pins, dead input rows). READY = no missing pins, <= 3 stray ends, every input row reaches a gate or an output.
Tested only in headless Chromium with phone emulation (touch events, pinch, tap); not on a real phone.
Open: 50 sheets not READY (details in the PDF), DITL-21A reverse, DITL-03F / 03H, page linking on hold.

## 2026-10-05 · v18: loose-end review (user: check the loose ends, leave field signals alone)
Method: every loose wire end was drawn on the sheet and classified. Most were NOT missing wires. Loose ends 951 -> 409, Health-clean sheets 23 -> 39.
Exempt (field / terminal, not logic): wire end touching any circle (contact, terminal, connector; small circles tolerance 2.4), arrowhead on the wire end (DCS output terminal, DITL-81 O.0129), at a DC / 24V / COMMON label, inside a dashed field assembly box (MOV, SV, MCC), on a pentagon, at a timer pin, at the AND bus.
Real defects found and fixed
- Timers not detected: label ABOVE the D with a SYM arc (DITL-81 TR161), CON arc with the label BELOW (DITL-21C..E, 23A, 25A..): 22 -> 2 undetected labels. Their pins were the loose ends.
- Limit comparator boxes "H/" and "/L" (legend DITL-00: LOW LIMIT, HIGH LIMIT) on a wire leave a gap: the analog switch rows (TT / VT / temperature, DITL-61B, 21A, 25A...) did NOT reach the OR. Bridged: the signal passes through the box. FUNCTIONAL fix.
- "TIMER SETTING" tables (DITL-38 and others): their frame lines were read as wires; removed.
Readiness test (no missing pins, <= 3 stray ends, every input row reaches a gate or output), 127 logic sheets: 77 pass. Fail list by cause: stray ends 46 (mostly MOTOR 111-114, 21x, 22-31: MCC box internals; SOLENOID 81, 88, 89...), dead input 10 (DITL-86, 92, 93, 94 row 20 = SV command row without a consumer, 03F, 18, 21A), missing pins 4 (DITL-03F/03H timer output, 21A, 23A).
Still not checked against the PDF: correctness of SEQUENCE / LOGIC(other) / ANNUNCIATOR sheets (structure is clean, behaviour only tested by the clean-sheet regression), MOV and SV sheets other than 56, 38, 69, 81, 62 (all SV valves were brute-force tested, MOV only by model).
Tests: 127 imports 0 fail, old clean sheets identical outputs, SV 23/23, motor 19 / 21A fwd / 45, MOV 56 and 38, DITL-62 AUTO PB toggle, 21A real-mouse start.
Open: DITL-21A reverse never starts by brute force (jog with LOCAL REVERSE P.B. works with the real mouse), DITL-03F / 03H, remaining 409 stray ends (MCC internals of DITL-22, 24, 30, 31, 111-114, 76, 77), page linking on hold.

## 2026-10-05 · v17: user review of v16 + audit of all 127 logic DXF (bundled)
User reports fixed
- DITL-62 rows 10 / 26: row 10 was a ghost switch (a wire stub of the OR bar, no text). Rule: an input is a row WITH text in a left cell; rows without text get no switch. Row 26 is the AUTO PB (M.0502) and row 5 is the same signal (M.0502, "from 62-76"): same address = same signal. New address groups (nl.grp): left rows with the same address are one signal; the PB row (else the first) writes, the others read (leading "-" reads inverted, DITL-81 row 4 "-M.0602"). A PB that has readers is a MODE selector: press = toggle, the state is retained (AUTO stays selected until pressed again). Readers show the dashed outline and are not clickable. DITL-62: AUTO PB -> row 76 AUTO SELECTED, row 77 MANUAL = NOT, row 5 follows.
- DITL-21A forward and reverse started together: MIF (forward running) and MIR (reverse running) were both tied to the same command. Inverter drive: MOR = START/FORWARD -> MIF, MOS = REVERSE -> MIR (two motors in nl.mot). Reverse is a jog (runs while LOCAL REVERSE P.B. is held; no seal-in feedback is drawn). Forward seals in through the running feedback (left rows 1/19). Feedback address matching uses the base address (I.0250 matches I.0250/530/640/680).
- Incomplete shading: the row band was cut by wires that start at the cell edge (they were counted as row lines) and, on the new template, row pitch is 8 not 9. Row bands now come only from the dashed separators (layer HID). New template bands 8.0, old 9.0.
Motor feedback delay is now 0.5 s (was 2 s), editable in the panel ("Motor run feedback delay", per sheet): a push button held ~0.6 s (minimum press time raised from 0.4 s) must be able to seal in through the running feedback. NOTE: the user approved 2 s earlier; changed because 2 s made every local start PB fail.
Audit of all 127 logic sheets (found and fixed)
- Numbered connector circles (small circle with 1..14 at the end of a wire): the same number on the same sheet is the SAME WIRE. Old template: circle + digit text (15 sheets: 15, 21A, 21B, 23A, 25A.., 76, 77, 111-114, 118). New template: block 0NO whose number is an ATTRIB (it was skipped, the circles looked empty; 18 sheets: 52, 53, 55, 61A, 75, 99-110, 116). A number that appears once on a sheet goes to another sheet (linking, on hold). Loose ends 1116 -> 951, clean sheets 20 -> 23.
- Right rows whose address equals a left input and have no wire (MIL, MIT, MIA field alarms, DITL-19, 43...) are indications of that left input (row based, not label based).
Remaining (not changed)
- Right rows with no source anywhere (unlit by rule): MOTOR 29 (DITL-19 MIA alarms, DITL-43, DITL-21A), LOGIC 20 (DITL-03H, 03F), PASS-THROUGH 10 (DITL-16), SOLENOID 4, MOV 4 (DITL-38 overtime rows), SEQUENCE 1. Most of them are field signals or links to other sheets.
- Loose ends 951 (MOTOR ~400, SOLENOID ~340, MOV ~237 before this version): short stubs next to symbols, not checked one by one. Gates with missing pins: 3 (DITL-03F, 03H timer output has no wire in the drawing; DITL-21A one NOT without an input wire).
- Page / address linking on hold until "go linking".
Tests: 127 sheets, 0 fail, 23 clean sheets, outputs of the old clean sheets identical (smoke, no page errors), SV 23 valves, MOTOR 19 / 21A / 45, MOV 56 cycle, DITL-62 AUTO PB toggle and retention checked with the real mouse in headless Chromium.

## 2026-10-05 · v16: parser + motor + old-template MOV (bundled, user said "g na")
User rule: bundle fixes into one version; decide from the drawing and legend, ask only what the drawing cannot tell.
Parser (all families)
- Vertical-flow NOT (labelled NOT with the wire entering top/bottom, MCC/HVP boxes of DITL-22, 24, 30, 31, 76, 77, 111, 112, 120...) is now supported for labelled NOT gates too, and the pin window accepts the arrow head (wire ends up to 3.9 away). Gates with missing pins 74 -> 35.
- Arrow tolerance 3.4 -> 4.3 on gate inputs (old template arrow heads are 3.9 long): DITL-21B/C/D ANDs had no inputs. -> 19.
- Vertical-flow OR (circle on top, horizontal input bar at the bottom, inputs from below, output on top: DITL-05, 23A, 25A-29A) is a real OR now; the bar is no longer a wire that merged all inputs. -> 12.
- Wires drawn on layer 0 or the text layer chain to CON wires / gate boxes (DITL-06 S/R outputs). Edges of CON boxes seed the chain. -> 3 (DITL-03F and 03H timer output has no wire in the drawing; DITL-21A one NOT without input wire).
- Loose ends 1366 -> 1116. 20 sheets clean (was 18: + DITL-05, 06 reached clean... see Health).
MOTOR
- Running feedback (MIR/MIF-xxx): the net that reaches the right cell of the row where the label is written, if it is free (not driven by logic drawn on the sheet). Start command net = MOR-xxx. 2 s delay. Found on DITL-19, 21A (MIF fwd and MIR) and 45 (2 motors).
- STOP pulse (MOS-xxx, DITL-45): the field panel seals the START pulse in until the STOP pulse (start edge -> run after 2 s, stop edge -> stop after 2 s).
- Right rows MIL/MIT/MIA with the same address as a left input and no wire (DITL-45 rows 55/56) = indication of that input (nl.ind), lit while the left row is ON.
- Sheets that draw their own MCC / HVP-SOFTSTARTER logic (22, 23A, 24, 25A.., 30, 31, 61A, 76, 77, 111, 112, 120) are simulated as drawn, no extra model.
MOV old template (DITL-38): single text "MCV OPEN COMMAND" / "MCV CLOSE COMMAND" in the MCC box, bare MIL/MIT/ZSO/ZSC/TSC labels, no addresses: same MOV model; right row mirrors the left row with the SAME SERVICE TEXT (MCV FULL OPENED etc.).
SOLENOID sheets DITL-86, 92, 93, 44 have SV but no ZSO/ZSC: nothing to animate, command row lights through the S/R wire (checked).
Tests: 127 sheets, 0 fail, clean sheets identical outputs (smoke, no page errors), SV: 23 valves all reach the commanded position; MOTOR: 19, 21A, 45 start and stop; MOV 56 and 38 full cycle; SV 81 cycle.
Open: remaining loose ends by family (MOTOR 414, SOLENOID 340, MOV 237, LOGIC 57, FIELD WIRING 52) are mostly short stubs next to symbols (not checked one by one); DITL-03F/03H timer outputs, DITL-21A NOT; two MIR-less sheets (DITL-113, 114, 118, 117, 43, 61B) not looked at; page/address linking still on hold until "go linking"; compare a few sheets with the PDF.

## 2026-10-05 · v15: X box = NOT gate again (correction of v14) + full SOLENOID model + S/R drawn R-over-S
USER CORRECTION (rule, do not repeat): the small box with an X is a NOT gate, always, per legend DITL-00. v14 treated an X next to an O.xxxx address as an "output terminal"; that was wrong and is removed. Never override the legend with an assumption.
Engineering facts from the user (DITL-81 and the drawings): the DCS output (O.xxxx) through a NOT closes the 24 V loop (contact) -> SV coil energized. DITL-81 drain valve is normally open: no OPEN command -> NOT = 1 -> loop closed -> coil energized -> valve CLOSED; OPEN command -> coil de-energized -> valve opens (spring return). DITL-28C says "ENERGIZE TO CLOSE". GREEN lamp = stopped, RED = running (DITL-76): VCB ON/OFF rows 53/54 are as drawn, no change.
SOLENOID model (svModel, 23 valves on 22 sheets: 81, 83, 88, 89, 121, 57, 62, 63 (2 valves), 66, 67, 68, 72, 73, 74, 78, 79, 80, 20, 28C (2), 32, 33, 35, plus DITL-17 which has two SV blocks):
- Assembly box = dashed rectangle around the SV circle: closed polyline (CEN or CON) or, in the old template, a cluster of touching CEN pieces. A closed rectangle on a wire layer around SV-xxx (DITL-73) is no longer a wire (same rule as the MOV box).
- Command net = driven wire entering the box within 46 units, nearest to the SV label in y. If a NOT drives it, the label decides the polarity: OPEN/CLOSE COMMAND text BEFORE the NOT (left row) names the DCS command; text AFTER the NOT (DITL-62 "CLOSE COMMAND" over the contact) names what the energized coil does. Command ON -> commanded position, OFF -> opposite (spring return). Start position = steady state with the command OFF. Stroke 3 s (panel "SV tag - stroke"). ZSO/ZSC right rows follow the position, both OFF while moving.
- ZS row: found from the right service text OPEN / CLOS(ED) and the first line of that cell block (old template writes OPENED/CLOSED on the 2nd line, which falls in the next row band). ZS tag may differ from the SV tag (DITL-20 CL1061-A7): then everything ZS inside the same box counts.
- S/R flip-flop drawn with R ON TOP and S below (DITL-62, 63, 72, 66-68, 79 and others) is paired now (before it was not detected at all): +26 gates, loose ends 1366 -> 1248. Pin assignment for the arrows follows the order.
- Not modelled: SV sheets without ZSO/ZSC feedback (DITL-86, 92, 93, 44).
Tests: svall.js (brute force: for every SV sheet find the input combination that moves the valve, 48 steps of 0.5 s with timers and pulses): all 23 valves move to the commanded position. 127 sheets, 0 fail, 18 clean, clean-sheet outputs identical (smoke). DITL-56 MOV cycle, DITL-19 motor start/stop, DITL-81 PB cycle OK.
Still open: MOTOR running-feedback model only found on DITL-19 (21A, 45, 61A: feedback net not found), motor loose ends (61A, 76, 77, 117, 118), DITL-38 MOV, other loose ends, linking on "go linking".

## 2026-10-05 · v14: SOLENOID + MOTOR + ICD130 + test switch (ditl-workbench-v14.html)
User rule (new): act as an elite power-plant automation engineer. Read the drawing and decide the action from it; ask only what is not on the drawing. User answers to the open questions: SV/ZS follow = yes (animate the switches); same address = same signal = yes; motor running feedback = yes; slash addresses = one copy only; ELECTRICAL TROUBLE pentagon = give it a user switch (it is a field/relay signal, not DCS).
- SOLENOID (svModel, 14 sheets with SV-xxx + XV-xxx + ZSO/ZSC): coil net = wire after the DCS output terminal (XV-xxx, O.xxxx). Valve stroke 3 s (editable in the panel "SV tag · stroke"), spring return when de-energized. ZSO/ZSC right rows follow the position; during travel both OFF. Same runtime as MOV (entries in nl.mv with sv:1).
- X box next to a DCS output address (O.xxxx within 24 units to the right) = output TERMINAL marker, not NOT (DITL-81 XV-HR1022 O.0129). 24 boxes changed; v9..v13 inverted them.
- Mirror (mirModel, 20 sheets, 29 rows): a left input whose address is also the label of an INTERNAL signal on the same sheet (gate output, e.g. DITL-81 M.0603 = open-command latch, left row 23) follows that signal, is not clickable (dashed outline). Also used for the motor running feedback address.
- MOTOR (motModel): MOR-xxx start command net -> after 2 s the MIR-/MIF-xxx running feedback net goes live, only if that net is not already driven by logic drawn on the sheet. Found on DITL-19 only; DITL-22, 76 and others (MCC / HVP-SOFTSTARTER box) draw their own logic, which is simulated as drawn. Status line in the panel. Tested DITL-19: rows 6, 14, 16 + PB row 7 -> RUNNING after 2 s, STOPPED rows 58-60 go off; PB row 11 stops.
- ICD130 (")(" two arcs on a wire, DITL-61A/76/77) = field contact in the wire; the wire is drawn with a gap, now bridged (row 53 VCB ON / row 54 VCB OFF).
- Test switch: pentagon ELECTRICAL TROUBLE (arrow pointing into the wire) gets a "TEST SWITCH" in Simulate (3 sheets found; split two-line text ELECTRIC / TROUBLE handled).
- Parser version BV=14, netlist v8. Re-import DXF files that show the warning sign.
Tests: 127 sheets, 0 fail, 18 clean, outputs of clean sheets identical (smoke), DITL-56 MOV cycle still OK, DITL-81 (rows 3 + 4 + PB 5 open, PB 19 close) OK.
Open points (not changed): DITL-76 rows 53/54 as DRAWN: VCB ON (I.008A) is on the GREEN lamp net (NOT of running) and VCB OFF (I.008B) on the RED lamp net (running). Looks inverted against the labels; asked the user. SV model found only 14 of 26 SOLENOID sheets; 12 sheets still use other tag patterns (to check). Motor models only DITL-19 pattern (MOR/MIR text with free feedback net): 21A / 45 / 61A (MIR net not found) and 111, 112, 22, 24, 30, 31 (own logic) still to review.
NEXT: remaining SOLENOID sheets (12), MOTOR sheets whose MIR net was not found, loose ends per family, DITL-38, linking when the user says "go linking".

## 2026-10-04 · v13: highlight fit + torque switch + pulse fixes (user review of v12 screenshot, DITL-56)
- Cell highlights went past the column lines on the new template (56-121 style): the cell boxes used fixed offsets from the old template, and the new template column lines are drawn as many short dashed pieces, so they were not found for snapping. Now: visual cell boxes (sh.vr) snap to the real column lines (pieces summed per x, tolerance 4), and each row band (sh.rb) is taken from the real horizontal row lines around the row. Logic still uses the old ranges (sh.rng), so wiring/inputs are unchanged (regression identical). PB / switch icons sit inside the SERVICE cell.
- Torque switch (TS) in the MOV model: TS turns ON when the valve is at the end of travel and the motor is still commanded (closed + CLOSE live, or open + OPEN live), feeds the left input with the same address. DITL-56: the CLOSE seal-in now drops when the valve seats (row 11 TORQUE -> M.037E -> NOT), before it stayed live forever after closing.
- Pulse glyph that is not directly over a wire (DITL-69 TR23 above the jog of the row 4 PB wire): host wire searched up to 6 units below. It no longer creates a fake input on row 3.
- Pulse duration read from text beside the glyph when present (DITL-69 TR23 "3 SEC." -> 3 s), else 2 s.
- Timers / MOV panel can be hidden with the ▼ button (it covered the bottom-right rows).
- Parser version BV=13: sheets imported with v12 or older show ⚠, re-import the DXF to refresh.
Results: 127 sheets, 0 fail, 18 clean, outputs of the clean sheets same as v12. DITL-56 and DITL-69 full open/close cycles OK.

## 2026-10-04 · v12 (includes the planned v11 + v12 items in one file, user asked "gawin mo na lahat hanggang v12")
User screenshot of v10 still showed M., I.0000, (S1) I.0091 and odd lit gates: the tabs were OLD sheets from the browser autosave (imported with v8/v9). The project keeps the parsed geometry/text, not the DXF, so parser fixes only apply after re-import.
- Parser version BV=12 stored in each sheet (sh.bv). Old sheets show "⚠" on the tab plus a message at start. Importing a DXF with the same name now REPLACES that sheet in place (keeps title banner, MOV travel times, pulse times; wire fixes are kept by name as before).
- Input look: every clickable input row (SERVICE cell, row reached by a wire) shows a small switch icon at the right edge of the cell (grey = OFF, live color = ON). MOV-driven rows (ZSO/ZSC mirrors) show no switch (dashed outline).
- v11 PB: rows whose text says PB / P.B. / PUSH BUTTON get a "PB" button. Momentary: ON while the mouse is held, at least 0.4 s, OFF on release. Found on 94 sheets.
- v12 TR pulse: the small ⎍ glyph drawn just above a wire (label TR## nearby) = PULSE timer in that wire. Glyph lines are not wires; the host wire is split at the glyph (left = input, right = output; cut ends are not counted as input/output ends). ⎍ = pulse on rising edge, ⊔ = pulse on falling edge ("PULSE (falling)"). Default 2 s, editable in the Timers panel (saved per sheet in s.pdur). 201 pulse timers found on 86 sheets (10 falling). The split wire is drawn in two parts so each side lights by its own net.
Results: 127 sheets, 0 fail, 18 clean still clean. Lit outputs of the clean sheets same as v8 except DITL-115 (17 -> 16 rows in the static check: TR179 is now a pulse, so it only lights while the pulse runs). "Rows with text but no wire" 6 -> 26: these are only TR## labels that sit in the SERVICE column of the row above/below the glyph (e.g. DITL-56 rows 3, 13), not inputs.
Checked with a real mouse in headless Chromium: DITL-56 row 12 + row 7 switches ON, hold row 4 OPEN PB -> TR32 pulse -> OPEN seal-in -> valve 100 %. DITL-69 open/close cycle still OK.
NEXT (each needs "go"): SOLENOID family; MOTOR loose ends (61A, 76, 77, 117, 118); DITL-38 MOV (old template).

## 2026-10-04 · v10: bug fixes after user review of v9 screenshots (ditl-workbench-v10.html)
User review of v9 (DITL-56, DITL-69): AND lit with unlit inputs, inconsistent input highlight, ZT % on top of text, floating M./I.0000, OR without output and wrong timer value on DITL-69. User asked to fix all in this round ("ayusin mo na"); saved as v10 because the naming rule says never overwrite.
User rules: input = ONE cell per row (its own assignment). FROM/TO, LOCATION and TAG columns are reference only for now (not clicked, not lit). Only input, logic and output. MOV position shown in the panel like the timers (no overlay on the drawing).
Fixes
- Simulate has memory now: starts from the last state and changes one net per step until stable. Before, every evaluation started from 0, so seal-in circuits dropped when the PB was released, and cross interlocks (NOT of the other command) oscillated and showed an AND lit with unlit inputs. Reset when Mode is toggled.
- S/R flip-flop is reset-dominant (R wins when S and R are both 1), as the user stated earlier. v8 held the state in that case.
- OR input bar: the thick bar is drawn as polyline + a plain line beside it; the plain line merged all OR inputs into one net (DITL-56 top OR lost the seal-in input). Same handling as the AND bar (bus pins, bar lines are not wires).
- OFF / FROZEN layers are read from the DXF LAYER table and skipped (only TEXT lives there: DCS 1890, chinese 2783). Rows "with text but no wire": 444 -> 6.
- Input click: only the SERVICE cell of a row that a wire reaches is clickable and lit; simulation reads only that cell. Output: only the right SERVICE cell is lit.
- Timer drawn right-to-left (D bulging left, DITL-69/70/71 TR164/165/166): input on the right, output on the left, value read from inside the D (2 SEC was read as default 5). Timer flat side may be on the symbol layer (TR52: flat line on SYM, the FF box edge was taken before, so the input was missed).
- Wires drawn on the text layer (DITL-69/70/71 OR outputs, also 56, 60, 61A, 64, 65, 72, 76, 77, 87): an orthogonal text-layer line chained to a wire, an OR circle or an arrow = wire.
- ZT % removed from the drawing, shown in the MOV panel as "ZT 45% · OPENING".
Results: 127 sheets, 0 fail, 18 clean still clean, lit outputs of the 18 clean sheets identical to v8 (all inputs clicked one by one). Gates with missing pins 108 -> 74, loose ends 1436 -> 1365. DITL-69/70/71 no missing pins.
Checked behaviour: DITL-56 OPEN = row 4 OPEN PB + row 12 REMOTE + row 7 TURBINE SPEED UNDER 2400 RPM, seal-in holds after PB release, drops at ZSO (fully open); CLOSE = row 14 + row 12. DITL-69 OPEN = row 4 REINSTATE PB, OPEN FF reset at ZSO; CLOSE = row 15 ISOLATE PB with row 8 BYPASS fully open (through latch + TR52 off delay + AND M.0403).
Still open: DITL-56 CLOSE command stays live after fully closed because ZSC I.0216 is an input on DITL-54 only (cross-sheet, linking on hold). DITL-38 no MOV model.
NEXT (each needs "go"): PB / P.B. / PUSH BUTTON as real buttons (94 sheets, 320); TR timers default PULSE (86 sheets, 329); SOLENOID; MOTOR loose ends.

## 2026-10-04 · User rules update (no code change, html still v9)
- Do NOT write the handoff prompt in every reply anymore. Write it only when the user asks for it.
- PROJECT-NOTES.md must still be updated on every change.
- The user only opens the html (ditl-workbench-vN.html) in the browser; that file is the whole app. The .js files are optional test scripts for Claude (headless Chromium), not needed by the user. Deliver them only as attachments for continuing the work.

## 2026-10-04 · v9: MOV model + NOT box fix + thick AND bar + MOV box outline (ditl-workbench-v9.html)
User decisions (MOV family): LEFT = input (clicked), RIGHT = output = CRT indication (DITL-00: lamp = INDICATING DISPLAY OR LAMP, (ANN) = alarm). No manual click on right rows, everything goes through logic. OPEN command -> close/open limit switch follows (assumed): OPEN -> ZSO, CLOSE -> ZSC. MIL = local/remote indication, MIT = trip indication, both from the input with the same address. ZT = animation 0-100 %, travel 10 s default. ZSO/ZSC also drive the left input with the same address (feedback into logic). MIL with no input on the sheet (DITL-69/70/71 row 53) = LOCAL/REMOTE button in the panel. MIT/TS with no source anywhere = unlit. Trip (MIT) is NOT the same as closed (agreed).
Parser fixes (needed for MOV, found while testing):
- Small box with an X inside (block 0NOT, 3.6 x 3.6) = NOT gate per legend DITL-00. v8 treated it as a jumper/contact and passed it through, which merged OPEN and CLOSE command nets. 347 new NOT gates over the 127 sheets. Vertical-flow NOT (wire enters top/bottom, e.g. DITL-99 x=235.8) supported: default top->bottom, direction fixed by driven nets.
- MOV function-block rectangle (closed polyline around OPEN/CLOSE COMM. text) is skipped as wire on any layer. On DITL-51..55 it is on the wire layer and its edge joined both command outputs.
- Thick AND input bar (2-3 parallel verticals at the AND left edge, longer than the box) = input bus: bar lines are no longer wires, AND inputs = all wire ends on the bus. This is the "extra lines" experiment of the previous entry, now done with bus pins so inputs are not lost.
- Loose-end check knows AND bus, vertical NOT pins and MOV block pins.
MOV model (netlist field nl.mv, nl.v = 6): block = OPEN/CLOSE text with COMM. below; tag MOR-/MOS-xxxx, command address O.xxxx; command net = wire ending at the OPEN/CLOSE text. Feedback rows by tag ZSO, ZSC, MIL, MIT, TS/TSC/TSO, ZT, matched to the block by tag suffix; mir = left row with the same address.
Runtime: valve pos 0..100 %, starts CLOSED. OPEN live -> runs to 100, CLOSE live -> runs to 0 (sealed in, so a pulse is enough), both = stop, MIT input ON = stop, MIL OFF (LOCAL) = commands ignored. Speed follows the timer speed select. Forced left rows (ZSO/ZSC mirror) show a dashed outline and cannot be clicked. Panel (bottom right): MOV tag, travel time (saved per sheet in s.mvt), status, LOCAL/REMOTE button when MIL has no input.
Tests: 127 logic sheets import, 0 failures, 18 clean sheets still clean, simulation of the 18 clean sheets identical to v8 (smoke.js). Loose ends 1803 -> 1436, gates with missing pins 111 -> 108. All 33 MOV blocks found; OPEN and CLOSE nets separate on every MOV sheet. DITL-56 full cycle checked (row 12 REMOTE + row 4 OPEN PB -> 100 %, ZSO + left row 8 ON; row 14 CLOSE PB -> 0 %, ZSC ON). DITL-38 (old template) has no OPEN/CLOSE COMM. text, no model yet.
Open points seen while testing (not changed): DITL-69/70/71 still have an OR without output and timers without pins; on DITL-69 the CLOSE command is live as soon as ZSO is ON (both commands live = valve stops at 100 %), to check against the PDF. DITL-109: REMOTE alone (row 12) makes CLOSE live, to check. DITL-36/37 light 0 output cells in the smoke test (same in v8).
NEXT (each needs "go"): v10 skip text on OFF layers (DCS placeholders, chinese); v11 PB / P.B. / PUSH BUTTON as real buttons (94 sheets, 320 texts); v12 TR timers, default PULSE (86 sheets, 329 TR); then SOLENOID; MOTOR loose ends.
Test scripts: simtest.js (finds inputs that fire OPEN/CLOSE), uitest.js (open/close cycle with screenshots), smoke.js (clicks all inputs on clean + MOV sheets, compares lit outputs).

## 2026-10-04 · SIMULATION focus, logic families only: bulk analysis, NO code change (html still v8, no v9)
User instruction: fix Simulate, work family by family, focus only on sheets that contain logic (skip COVER/INDEX 0A-0D, LEGEND 00, field-wiring-only 16/17, pass-through 119). Test set: 127 sheets (CSV families). Headless harness written (see TEST TOOLS below).
Baseline v8 on the 127 logic sheets: 18 clean (same list as before), 0 import failures. Totals: 394-444 input rows with text but no wire, ~1800 loose ends, 111 gates with missing pins.
ROOT CAUSE FOUND for the bad simulation of the MOV and SOLENOID families (new template 51-110 mostly):
- Measured: outputs (right side rows) that are driven by any gate output or input net: MOTOR 177/283, SEQUENCE 105/115, LOGIC(other) 121/144, ANNUNCIATOR 42/42, INTERFACE 20/20, SOLENOID VALVE 71/123, **MOV 50/251** (7 MOV sheets with 0 driven outputs: DITL-38, 51, 54, 56, 60, 70, 71; also 45, 72, 120).
- Reason (checked on DITL-56 by screenshot): between the AND outputs and the right-side cells there is a dashed orange function block (MOV: `MOV OPEN COMM.` / `MOV CLOSE COMM.`, tags like MOR-AV1391 / MOS-AV1391). The commands enter the block; the right-side items (MIL, MIT, TS, ZSC, ZSO, ZT with I.xxxx addresses) leave the block as field feedback toward the DCS. The reader has no model for that block, so the logic never reaches the output cells. SV blocks (SVO/SVC) look the same. This is a DESIGN DECISION for the user, not a parser bug (see QUESTIONS).
- Many "text without wire" rows are NOT missing inputs: stray template placeholders (`M.`, `I.0000`, `I.1085`, `I.0744`, `IRP / I.005F`, `(S1) I.0091`) sit in rows where the drawing has no wire or the wire is an internal gate-output net. Example DITL-56 row 6 `(S1) I.0091`: the horizontal wire in that row is the OR output feeding the AND, not an input. 220 of 388 such rows have no horizontal wire at all in their row band. Real addresses are probably ATTRIB values of the INSERT blocks (not read yet), the TEXT that is read is the ATTDEF placeholder.
Experiments tried and REVERTED (not shipped, so no v9):
1. Implicit input (use the horizontal wire inside the row band as the source when no wire reaches the left edge): fired 50 times, mostly on placeholder rows (I.1085, I.0744, M.), so it would create false inputs. Dropped.
2. Thick AND bar is drawn with two extra plain lines at x-0.4 / x+0.4 (DITL-56: x=228.7 and 229.5 around bar 229.1) that merge all AND input nets into one. Removing them separated the nets (DITL-56 AND now has 4 distinct input nets) but 5 sheets lit FEWER outputs (61A, 64, 76, 77, 83) and 0 improved, and the extra nets are not validated against the PDFs. Not shipped. Idea to keep: re-test after the MOV block is modelled, then compare with the PDFs.
QUESTIONS for the user (needed before the next code change)
1. MOV / SV block: how should it behave in Simulate? Options: (a) pass-through: any live net entering the block drives all right-side feedback rows of that block; (b) command only: OPEN command lights MIL / ZSO, CLOSE command lights ZSC (needs a symbol table per tag type); (c) leave outputs unlit and only show the command nets lit. User said earlier "field wiring = plain input -> output"; confirm if the same applies to the MOV block.
2. Rows whose text is a placeholder (`M.`, `I.0000`...) with no wire: keep them non-clickable (current) or mark them grey?
NEXT WORK (when user says go)
1. Implement the MOV/SV block per the user's answer, regression on the 18 clean sheets + DITL-56 (expect rows 58-64 to follow AND outputs).
2. Read ATTRIB values of INSERTs (real I.xxxx / O.xxxx / MOT- tags) so placeholder text stops polluting inputs.
3. Then the remaining loose ends / missing pins per family (MOTOR first: 61A, 76, 77, 117, 118).
TEST TOOLS (outside the repo, rebuilt in minutes, optional): playwright script that opens the html, evaluates `parse()/build()` on each DXF and prints `diag()`; a second script measuring outputs driven by logic per family. Chromium path used: /opt/pw-browsers/chromium-1194/chrome-linux/chrome. Delivered as ditl-test-harness.js and ditl-driven-outputs.js.

## 2026-10-04 · User clarifications (no code change, html still v8)
- Station detection (when linking resumes): only `STATION ###` / `STN ###` counts. The rest of that text (e.g. `FM0001 P102`, "from page X to X" style text) is IGNORED for logic but the text itself stays in the drawing. This also removes the `104016` / `104015` misread on DITL-113 / 114.
- DITL-119: what matters is the output address `O.xxxx` in the body. If the right cell is empty, leave it empty. Do not invent a cell.
- Two-station page lists (102+103 and 103+105) confirmed by user.
- Work order confirmed: one item at a time, wait for "go" before every edit, update PROJECT-NOTES.md after every change.
- FILE NAMING RULE: every changed html is saved as a new number: next one is `ditl-workbench-v9.html`, then v10, etc. Never overwrite the previous version. Handoff prompt is always written FIRST in the reply.
- Files needed to continue in a new account: ditl-workbench (latest vN).html, PROJECT-NOTES.md, logic-dxf.zip. Optional: DITL-sheet-report.csv (sheet types, can be rebuilt). Nothing else.

## 2026-10-04 · DECISION: focus on SIMULATION first. Page linking / address linking = ON HOLD (inspection only, no code change)
Status: html still v8, no code changed in this entry. Inspection of all 135 DXF done (report: DITL-sheet-report.md / .csv).
User decision: ABORT page linking and cross-diagram address linking for now. Work only on simulation functionality (single-sheet correctness first). Wait for the user's signal ("go linking") before touching any item under "ON HOLD". If any of it already exists in code, leave as is, do not extend or remove.

ON HOLD (note for continuation, discuss when user gives the signal)
1. Page links From/To. Format is only `##-##` (sheet-row). Ignore any other label near it (IRP, LOCAL, CRT, SER, ABC...): numbers only. Several tokens in one cell possible (`01-15,02-23`). Left rows 1-28 = inputs, right rows 51-78 = outputs. A TO token on a right row points to a left row of another sheet; FROM token on a left row comes from a right row elsewhere. Findings: 1551 raw tokens in the DXFs but the app keeps only 29 in `s.tx` (it drops them); 812 TO tokens, 686 have a matching FROM; 743 tokens point to their own sheet (e.g. `111-2`, `(111-58)`). User: do not worry about unmatched cases, just parse the `##-##` format.
2. Station + address key. Slash address `I.0001/321/641/961` = four addresses, one per burner A/B/C/D (same logic, same equipment, own address each; rule: replace the last N chars of the base with the part after each slash; `O.0084/404` = O.0084, O.0404; `M.012A/22A/162A/172A`). Station inheritance: the mother sheet gives the station to its family (03 -> 03A..03H, 12 -> 12/12A/12B/12C, same base number). Ambiguous list in Health. Station is written as `STATION 104 FM0001 P102`, `< STN103 >` or `(S1)` prefix on the sheet. Open: how to pick the station of an address on pages that mention two stations (see list below).
3. Shared state across pages (key = station + address, plus the links above). 121 (station,address) keys are outputs on one sheet and inputs on another (e.g. 104 M.012F: output on 18, input on 01, 12, 14).
4. Output kinds as endpoints: CRT cell, `0NO` numbered circle, pentagon ELECTRIC TROUBLE, SV, lamp. Pass-through sheets 08, 16, 17, 119. To be discussed when the user says so.

Pages that mention two stations (from the inspection, for the station question)
- 102 + 103: DITL-51 to 56, 60, 62 to 75, 79, 80, 81, 83, 88, 89, 94 to 110, 116, 121.
- 103 + 105: DITL-86, 87, 92, 93.
- DITL-113 / 114 showed `104016` / `104015` because the regex read the number after STATION; fix only when linking resumes.

User answers to the open questions
- CRT marker in a right cell = alarm display in the control operator room / HMI. It is an output (operator display), 940 times in 118 sheets.
- Slash address = burner A/B/C/D, four separate signals with the same logic (see item 2).
- 12-12C, 03B-03H inherit the station of the mother sheet (03/03A, 12).
- DITL-119: the `O.xxxx` addresses (O.0286..O.028B) are OUTPUT signals even without a right cell. Cause: they sit in the middle of the sheet (x about 252), not in the right column, so the app reports outs=0. For the simulation they must be treated as outputs.
- NOT YET DECIDED (discuss separately, no behaviour given): `ICD130` block (2 arcs, in 61A/76/77), `RELAY` block (DITL-18), `0ARROW2` / `0ARROW3` / `0ARROW4`, whether the same `0NO` number on one sheet is one net, and where the tag above a numbered circle (MOT-xxxx, O.xxxx) comes from.

Sheet types found (inspection, 134 sheets; full table in the report files)
- COVER / INDEX: 0A, 0B, 0C, 0D (CONTENTS 1-4: sheet no., DWG NO., title, revision dates). Not logic. Useful later for title banner and sheet picker.
- LEGEND: DITL-00 (SYMBOL LIST: OR, AND, NOT truth tables, ANN, SV, lamp). Not logic; import "no row numbers" is expected.
- PASS-THROUGH (no gates): 08, 16, 17, 119. 16/17 are field wiring (DC 24V / N, SV coil, ZSE/ZSC/ZSO/ZSR limit switches, LEADER, lamp). 08: 2 in / 2 out. 119: 9 inputs, outputs in the body.
- Field wiring + logic: 18 (also has RELAY block, 5 gates, 2 timers).
- Sequence / trip: 01, 05, 06, 07, 09, 10-15, 12A-C.
- Motor start/stop: 19, 21A-E, 22-31, 43, 45, 61A/B, 76, 77, 111-114, 117, 118, 120 (pentagon ELECTRIC TROUBLE on 18 sheets, MOT- tag on 8).
- Solenoid valve (SV + ZS feedback), MOV / shut-off valve (ZS), annunciator 40-42, interface / function block 50 and 115, logic other 02, 03A-H, 36, 37, 39.
- New template (block 0LOGIC, I-WIRE / I-INST / I-TEXT): DITL-51 to 121 mostly. Numbered circle = block `0NO` with ATTRIB (the number) in 52, 53, 55, 61A, 75, 99-110, 116; the app does not read ATTRIB yet.

NEXT WORK (simulation only, in this order)
1. Re-run the 18 clean sheets as regression after every change (01, 03A-E, 11, 12, 12B, 12C, 14, 27B, 28B, 36, 37, 40, 42, 115).
2. Rows with text and no wire (~480, e.g. DITL-56 rows 1,2,6,9; DITL-70 14 rows), loose wire ends (~1900), gates with missing pins (~110), 37 timers not detected, OR in DITL-76 with missing output.
3. Sheets without gates = pass-through (08, 16, 17, 119) simulate as input row -> output; 119 outputs are the body O.xxxx.
4. Visual comparison with the PDFs.
Rules unchanged: inspect/assess = no edits; field wiring = plain input -> output; vertical-flow OR = ordinary OR; limited credits, few tool calls.

## 2026-10-04 · v8 bulk-test fixes (tested on all 135 DXFs, headless)
Rules from user: sheet with no gates = input row goes straight to output row. Field wiring pages = simulate as plain input -> output (no new model). Vertical-flow OR = ordinary OR with connected line, no special case.
Baseline v7 on 134 imported sheets: only 15 clean (01,03A-D,11,12,12B,12C,14,36,37,40,42,115). DITL-00 legend is not a logic page.
Changes
- Health: "text outside any cell" counted the row-number column on every sheet (134/134 false). Row-number texts now ignored.
- Wires starting a little left of S1 (new template: x=120.9, S1=124.0) were dropped (`h.x1>S1-1`). Now `S1-4.5`. Rows with text but no wire: 1028 -> 480.
- Small unclaimed boxes (<=5.2 x 5.2, with X inside = contact/jumper, e.g. DITL-56 x=212..216) are now pass-through wires (their edges are no longer removed as gate edges). Loose ends 2836 -> 1904.
- Timers on new template: D arc is on layer SYM (not CON) and the label is BELOW the D. Detection now accepts CON arcs (label above, old rule) or SYM arcs (label below, within 10 units); arc is used once. D left edge fallback x0=ax for SYM arcs. Undetected timers: 90 -> 37.
- Simulate: if a sheet has 0 gates, every active input row lights the output cells of the same row (render only, `outOn`). Not testable on DITL-08 (no row has both sides filled).
Result after fixes: 18 clean sheets (added 03E, 27B, 28B), none of the original 15 broke. Still open (bulk run): ~480 rows with text and no wire, ~1900 loose ends, ~110 gates with missing pins, 37 timers not detected, sheets 0A-0D / 16 / 17 / 119 with no gates (need a look at what they are).
Not done: visual comparison with the PDFs, numbered output circles / pentagon flags as outputs, shared state across pages.

## 2026-10-04 · Bulk-import robustness + Health panel (for 100+ sheets)
Why: other diagrams had wire gaps and non-clickable inputs because the reader used fixed numbers (row-number x range, column offsets) calibrated on 2 sheets.
Changes
- Row numbers: found by clustering numeric texts by x (>=5 texts, pitch ~9), leftmost = left rows, far-right cluster = right rows. Old fixed ranges only as fallback.
- Column boundaries snap to real tall vertical frame lines (within 2.5 units) instead of trusting fixed offsets.
- Texts just outside a cell edge / row band are now matched by their alignment point (x,y) too, not only insertion point.
- Wire layer fallback: if layer CON has <5 H/V lines, the layer with most H/V lines is treated as CON (`sheet.lyr`).
- Auto-heal: wire end with nothing on it and another net within 1.2 units is joined automatically (`nl.healed`). `nl` version is now 5.
- Simulate: a left row with a wire but NO input text is clickable at its T cell (`fbk()`).
- Multi-file import: one pass, progress toast, failures collected in `FAILS` (one bad file does not stop the rest).
- NEW `Health` button / panel: per sheet checks (labels without gate, missing pins, loose ends, timers, rows with text but no wire, wired rows with no text, orphan texts, no gates/inputs/outputs). Click a row = open that sheet. Textarea with a compact summary to paste to Claude.
- Autosave now warns when localStorage is full (100+ sheets will exceed ~5 MB: IndexedDB is now the next step).
NOT tested on real DXFs (only syntax-checked); DITL-02 / 03A / 55 must be re-imported and compared.

## 2026-10-04 · Roadmap #2 started: BLOCK/INSERT reader (+ root cause of "new style" pages)
Root cause found (DITL-55, 61B, 72 failed to import before)
- On these sheets the table frame, row numbers and headers are NOT top-level entities: they live inside the nested block `0LOGIC` (inserted on layer HID). The gates are INSERTs of blocks `0AND`, `0OR`, `0NOT`, `0FLIP1`, wires end in INSERTs `ARROW` / `DOT`. The old reader ignored every INSERT except LAMP1, so it found no row numbers and returned null.
- Layers are different there: wires `I-WIRE`, symbols `I-INST`, text `I-TEXT` (older sheets use CON / TXT1).
What changed
- `parse()` now reads the BLOCKS section and calls `explode()`: every INSERT (nested up to 6 levels, with position, scale, rotation, base point) is flattened into normal LINE / LWPOLYLINE / CIRCLE / ARC / SOLID / TEXT entities with the transform applied. Layer `0` inherits the INSERT layer. Layers ending in `I-WIRE` / `I-INST` become `CON`, `I-TEXT` becomes `TXT1`. Skipped blocks: 00_FORM, WMF6, test, GENAXEH, ACAD*. Layer VPORTS and ATTRIB / ATTDEF are skipped.
- Symbol blocks (table `SYM`: LAMP1 / 0LAMP1 = lamp, SOLENOID, LSWITCH = limit switch, SIGHI / SIGLO = H / L limit, 0ADJ, LEADER) are drawn with their REAL shape on layer `SYM` (render only, not part of the netlist), so lamps are no longer bow-ties. Each one is also recorded in `sheet.syms` ({k kind, n block, x, y}) for the later behaviours.
- Gate blocks (0AND / 0OR / 0NOT / 0FLIP1) are NOT in SYM: they become CON geometry and go through the existing gate detection. The old `raw.lamp` bow-tie is gone (kept only for old saved sheets).
Tested (headless Playwright, all 15 uploaded DXFs)
- DITL-02, 03A and the 11 other older sheets: gates / nets / inputs / outputs IDENTICAL to the previous version.
- DITL-55 / 61B / 72 now import (before: failed). Result is only partial, see below.
Not done yet
- DITL-55: 41 loose wire ends, 5 input rows only. 61B: 0 input rows, 1 OR. 72: 1 gate. The new template uses different column offsets, so some DCS texts (I.xxxx) stay outside the cells and the cell mapping needs calibration for this template.
- #1 still open: vertical-flow OR (bus at the bottom, arrows up), numbered output circles / pentagon markers, field wiring pages, arrow-based direction for AND / OR / R-S / timers.
- `_5_DITL-00.dxf` (legend) is now a good R2004 file with text and blocks, but it has no numbered rows so it is rejected as a sheet (it is a symbol list, not a logic page). Not used yet.
- Simulation was not re-checked on the new-style pages; lamp / solenoid shapes were visually checked only on DITL-55.

## 2026-10-04 · Title banner, save dialog removed, new page types noted
- Save dialog / Paste project REMOVED (user: not worth it for now). Save project and Save fixes are back to the plain download.
- New title banner under the toolbar: big sheet content (title), DRAWING NO. and SHEET NO. Click any of the three to edit (Enter = save, Esc = cancel, undoable, saved in the project as `sheet.meta`). L / C / R buttons align it left / center / right, Small / Medium / Large size (kept in this browser, `ditl.meta`). Drawing no. and sheet no. come from the file name (`_5_DITL-00` -> sheet 5, DITL-00; `DITL-03A` -> drawing only). Sheet content starts empty: auto-detect from the DXF title block is not done yet (needs a real sheet with its title block text).
- Typing inside the banner no longer triggers Del / Ctrl+Z of the drawing. Tested headless (edit, align, size, empty state).
- Addresses (user): unique inside one station only. Stations (controllers) 101, 102, 103, 104, 105 can reuse the same address. Shared state / IO list key must therefore be station + address, not address alone.
- Legend DXF re-sent is the same exploded R12 file (no blocks/text): not usable. Lamp renders correctly in some sheets and as a bow-tie ("ribbon") in others: the bow-tie is the generic placeholder for INSERT `LAMP1`, so the fix is drawing real BLOCK definitions (roadmap step 2).
- Page types seen in screenshots that the reader does NOT handle yet (need their DXF to fix at the root):
  1. Vertical-flow gates: OR with a horizontal bus under it and arrows pointing UP into the bus (flow bottom to top). Current reader only knows left-in / right-out.
  2. Gate outputs into numbered circles (2, 3) with a tag above (MOT-F1056-1, O.0771) and a pentagon "ELECTRIC TROUBLE" flag; these are output / alarm / off-page markers, not gates.
  3. Field wiring pages ("LOGIC (INTERLOCK)", DC 24V and N rails): DCS output row -> contact (two small circles) -> solenoid coil (SVC / SVO / SV circle); limit switches (ZSR / ZSE / ZSC / ZSO) feed input rows on the right (I.xxxx). This is continuity logic (contact closed -> coil energised), not gates. Needs its own model; behaviour in simulation still to be decided with the user.
- Current direction handling: only NOT follows arrows (arrow at the edge, else driven side). AND / OR / R-S / timers are still left-in right-out. This is the first thing to generalise when the DXFs arrive.

## 2026-10-04 · Save fix + agreed ROADMAP
Save fix
- Save project / Save fixes used a blob download link; embedded viewers block it and the page errored. Now both open a dialog with the full text: `Download file`, `Copy` (paste into a .json file), `Close`. New `Paste project` button loads a project from pasted text (works where file pick or download is blocked). Normal browser download tested OK; dialog + paste-load tested headless.
- Open project / Load fixes (file pickers) unchanged.

Legend file `_5_DITL-00.dxf` (checked again)
- Still R12 (AC1009), 2062 POLYLINE/VERTEX only, no TEXT, no BLOCK, no INSERT, single layer. Cannot be used as a symbol library or imported. Need a normal save-as ASCII DXF (2004/2007, like DITL-03A) so text, layers and blocks survive.

Agreed ROADMAP (order)
1. Make the reader work on ANY page: user sends many different real DXF sheets; fix each failure at the root. Rule: flow = trace each line to its arrowhead (left or right). Not only NOT: AND / OR / R-S / timers must follow it too.
2. Symbols: read BLOCK definitions + INSERTs from the DXF and draw the real shapes (fixes LAMP1 drawn as valve/bow-tie). Then a symbol table (block name -> lamp / solenoid SV / limit switch / L,H limit / ANN / push button) for behaviour. Needs real sheets with blocks intact.
3. Title block per sheet: sheet content, sheet no., drawing number. Fallback: file name (e.g. `(5)DITL-00`).
4. From/To page links. Token `15-18` = DITL-15, cell/row 18; several tokens in one cell are possible -> picker to choose the target page. Click = jump to page and row.
5. Shared state by address across all pages (global simulation over all sheets).
6. Actual push buttons (source of the address state).
7. IO / memory list page (tag, description, DCS address) with search, CRUD, links to diagrams. Master for tag/address identity; diagram text is the label; mismatches shown in a report, not silently overwritten.
Postponed by user: IndexedDB storage (do before importing many pages; localStorage ~5 MB will fill), grid on/off + grid types (disabled in simulate, must not hide the drawing), logic builder / editor with lock-unlock.
Dropped: truth table generation, Logic Definition Table, auto layout (user likes current behaviour).

## 2026-10-04 · NOT direction v2 (no arrow at the gate)
- Bug from screenshot: a NOT whose input comes from the right but has no arrowhead touching its edge was read left-to-right, so NOT(0)=1 drove the net of the OR output and lit it with no live input.
- Direction order now: (1) arrow tip touching the NOT edge (left-pointing on right edge = reversed, right-pointing on left edge = normal, as in the legend DITL-00); (2) if no arrow: the side whose net is already driven by another gate output or a left-edge source is the input (repeated up to 8 passes so chains of NOTs resolve); (3) otherwise left-to-right.
- Legend `_5_DITL-00.dxf` is an old R12 export with everything exploded to POLYLINE/VERTEX (no TEXT, no layers) so it cannot be imported, but it confirms: every gate input has an arrowhead touching the gate; outputs have the arrow at the far end.
- Tested headless on synthetic sheet only.

## 2026-10-04 · NOT direction from arrows + Timers (ON DELAY / OFF DELAY / PULSE)
NOT gate
- `netlist()` now reads the CON arrowheads (SOLID triangles) in both directions (`tri`, d=+1 right, d=-1 left). A NOT whose arrow tip points LEFT into its right edge is reversed (`g.rev`): input = right side, output = left side. Default (no arrow found, or arrow on the left edge) stays left-to-right as before. Manual pin fix (`pinKind`) respects `rev`.
- Only NOT is direction-aware. AND / OR / R-S are still left-in, right-out.
Timers
- New gate type `TMR`. Found from the label text (ON DELAY / OFF DELAY / PULSE) -> nearest CON ARC (the D shape) -> D left edge (short vertical line) -> pins: input = horizontal wire end at the D left edge (same y as arc centre), output = wire end at the arc apex. D outline lines are removed from the wire list (no fake loose ends).
- Preset is read from the texts inside the D (number + unit, e.g. `5` / `MIN.`, or one text `5 MIN.`). Units: ms, sec, min, hr. Tag (TR252) is the DCS text under the symbol.
- Timers panel (bottom right, Edit and Simulate): change the number / unit there; it rewrites the text drawn in the D, so it is saved in the project and undoable (Ctrl+Z).
- Simulate: clock runs every 100 ms. Speed selector 1x / 10x / 60x / 300x, per-timer Skip button, live elapsed / preset / OUT display. Switching mode resets all timers.
- Behaviour: ON DELAY = output 1 after input is 1 for the preset, drops when input drops. OFF DELAY = output 1 at once, stays on for the preset after input drops. PULSE = rising edge gives output 1 for the preset (not retriggerable).
- `nl` version is now 4 (recomputed on load). Import toast now reports how many timer labels had no detectable symbol.
- Tested headless on a synthetic sheet only (reversed NOT with left arrow, ON DELAY 5 MIN, preset edit). NOT tested on real DITL-02 / DITL-03A. Arc/pin assumptions come from the screenshot; if a timer shows 'missing pins' in Wire fix, send the DXF.

## 2026-10-04 · Connectivity fixes + Wire fix v2
Root causes found from the user's screenshot (long vertical wire not connected to the wires touching it)
- Wires longer than 130 units were dropped entirely (long vertical buses). Now only vertical lines that sit on a table column boundary AND are > 130 long are dropped (frame lines).
- Only LINE entities were wires. Now every CON-layer LWPOLYLINE is exploded into H/V segments too (L-shaped / multi-vertex wires, thin 2-vertex wires). Thick (width > 0) vertical 2-vertex polylines are still AND/OR bars; short closed 2-vertex polylines are still junction dots. Polyline width is now parsed (raw.pl[3]; old saved sheets without it keep the old bar behaviour).
- Arrowheads (CON SOLID triangles) now also define input pins: a right-pointing arrow tip on a gate's left edge attaches the wire it sits on (in addition to the old 3.4-unit end rule).
- Junction dots are now drawn (white/CON dots; they were invisible before) and counted in the import toast.
- `netlist()` v3 also exports `dots`, `plnet`, per-gate `pp` (pin points).
Wire fix v2
- Net colors: every net has its own color, so a break in continuity shows as a color change. Pin points on gates are drawn as colored dots. Panel (top right) lists nets / dots / missing-pin gates / loose ends and all manual fixes.
- Delete a fix: ✕ in the panel, or click its cyan × marker; hover a panel row to highlight it. Ctrl+Z still works. Clear all removes every fix of the sheet.
- Save: fixes auto-persist in localStorage (`ditl.fixes`, keyed by sheet name) and are re-applied on importing a DXF with the same name; `Save fixes` downloads ditl-wire-fixes.json, `Load fixes` merges it back. Pins are matched to gates by type + position (not index), so they survive parser changes.
- Status bar no longer changes height on first mouse move (it shifted the drawing and made the first click miss).
- Tested headless on a synthetic sheet (long vertical, polyline wires, arrow pin, dot vs plain crossing, join, delete from panel and marker, persistence). NOT tested on real DITL-02 / DITL-03A: please re-check DITL-03A still simulates the same.

## 2026-10-04 · Live color + Wire fix tool
- Live signal color is now selectable (toolbar dropdown: Red default, Yellow, Blue, Magenta, Green). Applies to lit wires, OR bus, and lit input/output cells (CSS var `--live`). Choice is saved in localStorage (`ditl.live`), not in the project file.
- New `Wire fix` toggle (Edit mode only). Shows: gates with missing pins (orange dashed box + which pin is missing), loose wire ends (yellow ring = another wire within 3 units, dashed line shows the gap; red ring = nothing nearby). Hover a wire = whole net highlighted.
- Fixes (stored per sheet as `links` / `pins`, applied inside `netlist()`, so they survive re-simulation, Save/Open and Undo): click a yellow ring = join the gap; click wire then wire = join; click gate then wire = attach as that gate's pin (in/out, S/R for flip-flop, chosen from which side of the gate the wire end is). `Clear wire fixes` removes all manual fixes of the sheet. Esc cancels a pending pick.
- `netlist()` now also exports `segs`, `dang`, and per gate `box` / `miss`; nl is versioned (`v:2`) and no longer written to project/undo JSON (recomputed on load).
- Tested headless on a synthetic sheet (gap detect, gap click, gate+wire pin, undo, clear, color change). NOT yet tested on real DITL-02 / DITL-03A after this change.
- Junction dots are still recognised only as short closed 2-vertex CON LWPOLYLINEs. If a sheet draws them another way (small circle / solid / block) its T-junctions will show up as loose ends; send that DXF so the parser can be fixed at the root.

## 2026-10-04 · Phase 2+3 (first cut) · Netlist + simulation
- `netlist(sh)` runs at import. Wires = CON-layer H/V LINEs (inside the logic window; see newer entries for length/polyline rules). Two wires are one net when an endpoint touches the other wire, or when a junction dot (short closed 2-vertex LWPOLYLINE, length < 1.5) sits on both. Plain crossings are NOT connected.
- Gate detection: rectangles are built from H/V lines (a vertical thick bar counts as the left edge, e.g. AND). Labels AND / NOT / S / R are matched to the nearest rectangle. OR = CIRCLE containing the label plus the vertical bar tangent to it (the bus). S + R stacked rectangles = one R-S flip-flop.
- Pins: horizontal wire ends. Inputs may stop up to 3.4 units before the gate (arrowhead length); outputs start at the right edge.
- Sources: wire ends at the left logic edge, mapped to the row. Active left cell (F/L/T/S) = that row is 1. Outputs: wire ends at the right logic edge, mapped to the row; all populated right cells in that row light up.
- `simulate(nl, activeRows)`: fixed-point iteration. R-S: S=1,R=0 sets; S=0,R=1 resets; both 0 or both 1 holds (legend "NC").
- Simulate mode: click an input cell = 1, click again = 0, multiple cells allowed. Wires and the OR bus light up. Switching mode clears all states.
- Edit: native prompt() was blocked in the embedded viewer, so the editor is now an inline textarea (Enter saves, Esc cancels). Double-click is detected manually (350 ms). Clicking outside any cell, or Esc, deselects.
- Import toast reports gates / nets / inputs / outputs and warns about gates with missing pins and timer labels.

Known gaps
- ON DELAY / OFF DELAY / PULSE timers are not simulated yet (DITL-02 has them). Some gates in DITL-02 report missing pins (e.g. NOT with no output); the wiring there needs a look.
- Truth table generation, wire re-trace/edit and the Logic Definition Table are not built yet.
- Tested only on DITL-03A end to end (headless browser). DITL-02 imports but its simulation is incomplete.

## 2026-10-04 · Phase 1 fixes
- Signals are now per cell (row × column, key `row:col`), not per row. Each populated cell has its own state.
- Added Mode switch: Edit (click = select) / Simulate (click = toggle that cell's signal). Simulation logic itself is not built yet; it needs the Phase 2 netlist.
- Fixed cell editing: pointer capture made `dblclick` target the SVG, so hit-testing now uses geometry (`hit()`), not DOM targets. Double-click works on any cell, including empty ones. Single click is delayed 230 ms so it does not fire twice on double-click.
- Del clears only the selected cell.

## 2026-10-04 · Phase 1 · Template + DXF import
File: `ditl-workbench.html` (standalone, no build step).

Done
- ASCII DXF import (multi-sheet, one tab per file). Layer `chinese` and any CJK text are skipped.
- Template is drawn from the DXF itself (layers CON, HID, CEN) so it matches the original PDF.
- Row/column cells are parsed from TEXT positions. Row geometry comes from the row-number texts.
  Left cells: FROM (F), LOCATION (L), TAG/DCS (T), SERVICE (S). Right cells: SERVICE (RS), LOCATION (RL), TO (RT).
- Populated rows are clickable (input = left side, output = right side) and toggle a signal state. Selected cell has a cyan dashed outline.
- Double-click a cell to edit text, Del clears the selected side, Undo/Redo (Ctrl+Z / Ctrl+Y), Save/Open project (JSON), autosave in localStorage.

Assumptions (calibrated on DITL-02 and DITL-03A)
- Row pitch 9 units. Row band = number Y − 3.3 .. + 5.7.
- Column boundaries are fixed offsets from the row-number X of each side (see `build()`).
- Gates, wires and symbols in the logic area are currently drawn as raw geometry (not yet a netlist).
- Lamp INSERT `LAMP1` is drawn as a generic bow-tie symbol. Other blocks (title block) are ignored.

Not done yet
- Netlist extraction (gates / wires / junction dots) and the Logic Definition Table.
- Auto layout generator, simulation mode (timers, R-S), generated truth table.
- Wire re-trace / edit in the logic area. DWG is not supported (use DXF).

Untested: not yet opened in a browser. Report any rendering mismatch against the PDFs.
