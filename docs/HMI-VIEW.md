# HMI VIEW — idea of the user (2026-10-08), BUILT in v1.16.0 (the three display modes were approved by the user)

User: "a separate graphics view like an HMI whose buttons are connected to addresses". Questions: overlay or separate app? connected?

## Recommendation: an overlay (a new view inside the same app), not a separate app
| Option | Connected to the logic? | Cost | Verdict |
|---|---|---|---|
| **Overlay / new view in Logic Sim** (button "HMI" next to Digital · DITL / Analog · ABC) | Yes: same engine, same values, same RUN / Pause | The widgets read and write the engine directly | **Recommended** |
| Separate app (own window / file) | Only through a link (file, OPC, WebSocket): a second engine copy or a bridge, two states to keep equal | Much more work, can go out of step | Not now |

## How it would work
1. A widget = button, switch, lamp, number display, bar, slider, trend, PID / MAN faceplate. Each widget is **bound to an address / tag** (for example M.0097, SI0150, FICFA1043B.MV, AI0130).
2. Binding: the tag is looked up with the same index the links use (`tagIndex`, descriptions `adesFind`), so the widget finds the sheet and the wire that carries that address.
3. Execution: a **lamp / number** reads the value of the wire (`S.rt.v`); a **button / switch** on an input writes the one-click input (the same as the DITL signals list: FROM DITL and other external inputs); a button on a computed value uses FORCE (clearly marked, as in the ABC panel); a **faceplate** reuses the block panel (PID: SP, AUTO / MAN, output; MAN: value). Everything is updated by the same 100 ms loop, all linked sheets run together.
4. Layout editor: drag widgets on a canvas (optional background picture of the user's HMI screen), save the layout in the project file (JSON) with the other settings.
5. The DITL page stays untouched; DITL buttons are the "FROM DITL" inputs of the DITL signals list.

## To decide with the user before building
- Which screen first (for example the CCS master screen or a burner screen)?
- Does he have screenshots of the real HMI graphics to use as the background and as the list of widgets?
- Buttons that write to a computed value: allowed through FORCE only?

## Does an overlay cover the diagram? (user question, 2026-10-08)
An overlay must NOT hide the diagram unless the user wants it. Three display modes of the same HMI view, chosen with one button:
| Mode | What you see | Use |
|---|---|---|
| **Own view (tab)** | The HMI replaces the diagram area (like Digital · DITL / Analog · ABC); the ABC panel stays at the right | Operating like at a console |
| **Floating window** | A window over the diagram that can be moved, resized, minimised and made transparent; the diagram keeps running behind it | Test: press an HMI button and watch the diagram react |
| **Split** | The HMI beside or below the diagram (draggable divider) | Both visible, nothing covered |
The graphics: widgets drawn as vector shapes (valve, motor, tank, pipe, lamp, bar, number, button, trend, faceplate) from a small palette, placed by drag and drop; an optional background picture (a screenshot of the real HMI) under the widgets; every widget bound to an address / tag; the layout is saved in the project file. NOT built yet.


## Built in v1.16.0 (as left)
- Code: `tools/patch-hmi.js`; test: `tools/test-hmi.js` (modes, widgets bound to addresses, FORCE on a computed wire, faceplate, auto page, restore after F5).
- Display modes: Tab / Float (movable, resizable) / Split (draggable divider). Widgets: text, lamp, number, bar, button (toggle / momentary), slider, valve, motor, tank, pipe, trend, faceplate (PID / PIDV / MAN tag). Pages, background picture, Auto page from the sheet.
- Binding: tags / addresses of all sheets and "DITL pp-nn"; button / slider on an input = one-click input; on a computed wire = FORCE (marked, shift+click releases).
- Saved in the browser bundle and in the project file (`hmi`). Sheets used by widgets keep running (`actSet`).
- NOT done (listed so it is not forgotten): no animation of symbols other than colour / fill level; no pipe flow animation; a faceplate does not have its own AUTO / MAN switch (use the diagram panel through "open ▸"); no import of HMI graphics from a file other than a background picture.


## HMI v2 (v1.18.0) — what the user asked and what was built
Code `tools/patch-hmi2.js`; test `tools/test-hmi2.js`.
| # | User request (2026-10-08) | Built | Test |
|---|---|---|---|
| 1 | Auto page must show ALL manual inputs, analog and digital, directly simulatable (not forced); inputs from other sheets shown with a note | **Auto page** of the open sheet: all faceplates (PID / PIDV / MAN), every manual input (analog = slider with the range of the drawing or of the COS; digital = button: switches, DITL inputs, COS, mode inputs .MAN / .LOC / .REM), then the inputs that come from other sheets (read only, "← ABC-xxx"), then the PV simulated by the process model (read only; set the SV) | test-hmi2: 51 sheets, 548 manual inputs: every one has a widget that points to it and writes the INPUT (no force), 197 linked inputs read only |
| 2 | Address picker | **Find…** (search 2 352 tags / addresses with their description and kind) and **Pick on diagram** (click a wire, or a PID / MAN block for a faceplate) | test-hmi2 |
| 3 | Wire without a tag | the widget can be bound to a wire of a sheet (sheet + net) | test-hmi2 |
| 4 | Zoom, smooth drag, LOCK | wheel / + / − / Fit; drag the empty page or the middle button to pan; widgets move pixel by pixel (Snap is optional); resize handle; **Lock** = no editing, you can still operate, zoom and pan; lock saved with the project | test-hmi2 |
| 5 | A / M / CAS modes come from the switching logic | there are NO mode buttons in the HMI: the mode inputs (tag.MAN / .LOC / .REM) are digital inputs of the sheet and are listed as buttons on the Auto page | by construction (not tested separately) |
| 6 | HMI saved | pages, widgets, lock and wire bindings are in the browser bundle and the project file | test-hmi2 (F5) |
Not done: drawing tools (lines, shapes, text boxes are the existing widgets only: label, pipe, tank, valve, motor); symbols animate only by colour and level; the faceplate has no own A/M button (use the mode inputs).
