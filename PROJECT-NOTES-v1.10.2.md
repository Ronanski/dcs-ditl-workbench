# PROJECT-NOTES (changelog, newest first)

Rules are NOT here any more: see DESIGN.md. Older entries (v1.8.1 and before): archive/notes/CHANGELOG-to-v1.8.1.md

## v1.10.2 (ditl-workbench-v1.10.2.html) - manual numeric input lost in Run mode (bug report from the user's laptop)
- SYMPTOM: type 77 in the numeric box, press the check button -> "Type a number first, then press ✓" (FORCE) or nothing applied (INPUT), only while RUN is on; Enter worked; Pause worked; other devices worked.
- CAUSE (diagnosis suggested by the user via another assistant, VERIFIED in the code and reproduced): the panel updater runs every 100 ms in Run and restored each box when `document.activeElement !== box`. Pressing the check button moves focus to the button, so the next tick overwrote the typed number (FORCE box -> '', INPUT box -> old value) before the click was processed. My earlier tests used Enter / instant programmatic clicks, so they never hit it. Timing + browser focus rules explain "some devices work".
- FIX (smallest): per-field dirty state `anEdit()`: dirty from the first typed character until committed (check / Enter / change), cancelled (Esc, release) or abandoned (2.5 s after losing focus); the updater skips dirty fields. Applied to FORCE box, INPUT box (inCtl) and the panel number boxes (analog inputs, setpoints, transmitters). Slider code untouched.
- TEST (tools/test-numinput.js, REAL mouse down 350 ms then up on the check button): v1.10.1 = FAIL for FORCE and INPUT in Run; v1.10.2 = OK in Run and Pause for click and Enter, FORCE and INPUT. Clock keeps running after the commit, slider still works, no page errors. Project file / circles / storage tests unchanged.
- DITL identical (guard).

## v1.10.1 (ditl-workbench-v1.10.1.html) - T legs per leg, diagnostics for the laptop (user test of v1.9.2)
- USER: in other sheets the switching rule (energized / selected path lit, other path grey) was not followed; worse in Run than in Pause (images: ABC-050 turbine start-up T chain; a T whose "a" input wire is shared).
- FOUND (two causes, both also in Pause): (1) a wire is ONE net, so when the not-selected input of a T shares its net with another block the whole wire stayed lit; (2) the selected input of a T went grey when the T output fed an unselected input further on (ABC-050 WARM T chain: WARM selected but its wire grey because HOT overrides downstream).
- FIX (1) per-LEG grey overlay: from the T input pin back to the first junction, drawn grey on top of the wire when that input is not selected (also its arrowhead). (2) anDead: the selected input of a T / AMT is always live. Upstream of an unselected leg still goes grey. Test: ABC-050 chain (WARM leg lit, output wire to the HOT T unselected grey), ABC-003E (shared net), all 54 sheets paint without error.
- NOT reproduced: "works only in Pause": Run and Pause give identical colours and identical selected inputs in my tests (tools: /tmp scripts). If it still shows, send a screenshot + which sheet + which switches are 1.
- NEW diagnostics (user: manual analog input works on Android / tablet but not on his Windows laptop; I could not reproduce - real keyboard typing + mouse slider both work in headless Chromium): red error banner when a script error happens, and Legend & style > Saving > Diagnostics = copyable report (browser, window, storage, errors, and a REAL input self-test that types a number into the panel and checks the value arrived).
- FIX Legend & style card had no scroll: on a laptop screen the lower part (Saving, Diagnostics) was unreachable. Now max height = window and scrolls.
- Repo reorganised (see DESIGN.md): only the current html at the root, old builds in archive/, baseline/ has the v1.0.0 file used by the DITL guard, rules in DESIGN.md, handover prompt in docs/HANDOVER.md.
- Block coverage (51 sheets, 5 clusters of near-identical sheets: 035-039, 003B-D, 004B-C, 011-012, 026-027): see docs/BLOCK-COVERAGE.md.
- DITL identical (guard). Project file, circles, storage tests pass.

## v1.10.0 (ditl-workbench-v1.10.0.html) - project file + desktop shell
- Why: user cannot rely on browser storage (laptop, plant rules: no server / OPC / eDNA / VPN). Direction in docs/ARCHITECTURE.md (plant sim + controller sim + engineering station, offline, portable exe without admin rights).
- NEW analog bar: Save / Save as / Open + Ctrl+S (analog page only). File = JSON {app, kind, ver, saved, sv (inputs, forces, switches, tuning), ws (settings), cur}. Uses the Chrome file picker (overwrites the same file), a download in other browsers, native dialogs in the desktop app (window.nativeFS from app/preload.js). Opening a file rebuilds all sheets from it (no reload). Old "Save settings file" still works.
- NEW app/ : Electron shell (offline: all network requests blocked, asInvoker = no admin), prepare-ui.js copies the newest ditl-workbench-v*.html into the app. .github/workflows/build-windows.yml builds the portable exe on GitHub (Actions > run > Artifacts). Tested here: app starts under xvfb, loads the analog page, native save works. NOT tested: the Windows exe itself (needs the GitHub build + the user's laptop).
- Tools: tools/patch-1.10.0.js, tools/test-project.js (save -> change -> open restores forces, Ctrl+S). DITL identical (guard).

## v1.9.2 (ditl-workbench-v1.9.2.html) - other sheets (user: "almost perfect 1.9.1, can you fix the other sheets too?")
- Audit of all 54 sheets (blocks with no input, undriven wires, tags driven elsewhere but not linked): clean except the items below.
- FIX timers drawn with a wire a hair off horizontal (ABC-057 TR708/TR709, ABC-008): the wire was not cut at the timer, so the timer had no pins. Cut tolerance .06 -> .2.
- FIX comparators (H/ , /L) whose input wire has no arrow head (ABC-014 x4, ABC-019 x2): both pins were 'out'. Now the pin with no arrow (or, if both, the left pin) is the input.
- NEW "IF M.xxxx = 1 / SET SV = n" notes with no T next to the word SV (ABC-017, 029, 030, 033, 054, 055 (3 values on one wire), 056): the preset is put on the wire that carries the nearest "SV" text. Tested by forcing each M tag = 1: value jumps to the note value (all 9 notes OK, plus ABC-050). Several notes on one wire: last true one wins.
- NOT changed (checked): "SET SIxxxx => TAG.SV" notes (ABC-007, 013, 051, 052) = write into the SV of a controller on ANOTHER sheet (controllers are pass-through, no SV in the sim); ABC-003x T#47 / ABC-003A T#63 / ABC-052 AND#112 are drawn with open inputs; ABC-000 = symbol list.
- AN_PV = 11 (nets of ABC-057 / 008 changed). Tools: tools/patch-1.9.2.js. DITL identical (guard). Circles, storage, anim tests pass.

## v1.9.1 (ditl-workbench-v1.9.1.html) - corrections to v1.9.0 (user feedback)
- T PATH COLOUR: user says v1.8.1 was RIGHT (selected T path lit, not selected = grey, vice versa). v1.9.0 change reverted. (Known: in v1.8.1 61 T's on 54 sheets show a selected input grey when their output only feeds an unselected input further on - left as the user wants.)
- ENGINEERING THEME: pure white was wrong. Now every element keeps its own colour family but muted (58% toward light grey): gates teal, timers violet, comparators green, selectors blue... wires / valves / live values keep their normal colours. Values keep the user's chosen colour (no auto-white).
- OPEN (user, later, when the IO list exists): selected address text highlights (yellow / sky) with its description.
- OPEN: v1.8.1 "errors on refresh" (investigating); force of OUTPUT signals not saved on the Windows laptop (works on tablet); question: move to another format than one html?
- Tools: tools/patch-1.9.1.js. DITL identical (guard).

## v1.9.0 (ditl-workbench-v1.9.0.html) - flow-aware links, engineering theme, T path colour, value placement
- LINKS: a single circle now remembers the M.xxxx / SIxxxx tags written next to it and the text "( FROM ABC-003A )" / "TO ABC-xxx". It is matched to the circle with the same number in THAT drawing (tag match scores highest); the FROM/TO word fixes the direction (FROM = this end receives) when the arrows do not. ABC-003B/C/D #2 (x4 each) now link to ABC-003A. Unlinked single circles 8 -> 4 (004A #6 #8 #9, 020 #9: no matching text/partner, check by eye).
- LINKS (external inputs): an input with no tag next to the wire now also uses a tag a bit further away and the "( FROM ABC-xxx )" text; the tag is searched in that drawing first. Linked external inputs 179 -> 194 of 936 (the rest are real origin signals: set by the user).
- T PATH COLOUR (bug): the SELECTED data input of a T (and its upstream wire) is always coloured; only the unselected one is grey. Before, a selected path turned grey when its T output fed an unselected input further on (61 T's on 54 sheets). Test: 0 selected inputs grey.
- ENGINEERING THEME: top bar "Theme" + Legend & style > Theme. Engineering = gates, symbols, text, timer text and values white; wires (live / dead), valves, pneumatic lines, T active letter stay coloured. Default stays Colour. Switching to Engineering turns the default green values white (back again when you switch back).
- VALUES: wider search (up to 10 units), stronger penalty for covering text / symbols / other values / other wires; address-less wires put the value just above/below (or beside) one of the 3 longest wire pieces of its own net.
- Tools: tools/patch-1.9.0.js. AN_PV stays 10 (no net/block ids changed). DITL identical (guard). Storage (full/blocked/hash), anim, circles tests pass.
