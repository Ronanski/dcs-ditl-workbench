# HMI VIEW — idea of the user (2026-10-08), design proposal (NOT built yet)

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
