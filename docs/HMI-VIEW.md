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
