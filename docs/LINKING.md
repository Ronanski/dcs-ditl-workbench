# LINKING — how the simulator joins the pages (sheets) of the ABC drawings

Rule (DESIGN.md §2.12): page links are followed **strictly**. Check with `node tools/audit-links.js <html>` (needs Chromium: it uses the real link code of the page) — it lists every circle that is not linked, linked to the wrong sheet, or whose tags beside both ends disagree. Exception the user keeps for himself: the look of the dashed / continuous lines.

## 1. What is on the drawings

| Kind | Looks like | Example |
|---|---|---|
| Numbered circle | circle with 1 – 2 digits | "6" … "6" |
| Letter circle | circle with 1 – 3 capital letters | "C", "MWD", "BIR" |
| Circle with name AND sheet | two lines: upper = number / letters, lower = the sheet it goes to / comes from | "HOU / 013", "CFD / 002", "02 / 051" |
| Single circle + text | circle + "( FROM ABC-003A )" or "( TO ABC-001A )" next to it, also several sheets in one text | "( TO ABC-004B/C )" |
| Signal tag | the same tag written on the wire in two sheets (M.0124, B.065D, SI0226, TICMS1004.PV) | output on one sheet, input on another |
| Text instruction | "IF M.0319 = 1 SET SV = 20 %"; "SET SI0361 => PICMS1002.SV IF M.0252 = 1" | preset on this sheet; write into another controller's SV |

An **arrow head pointing into the circle** = the wire ends there = the signal LEAVES through this circle (sender). No arrow = the signal comes OUT of the circle (receiver). The arrow tip may touch the circle while the wire stops 4 – 6 units short: the arrow tips are used too (v1.14.3). Circles of radius 2.2 – 8.3 are taken (the big letter circles of ABC-001 are r = 8.0 – 8.2). A circle that sits on a motor symbol ("M" of a motor-operated valve) is not a connector.

## 2. How each kind is joined (code: `anNets` / `anModel` in the reader, `linksOf` in the page)

1. **Inside one sheet** (reader): circles with the same number / letters = ONE wire. The sender's net drives the receivers' nets (`S.link`). Same signal tag written on several wires of one sheet = one signal.
2. **Circle with name + sheet** (`S.xc`): the page looks at the target sheet (exact code "003E", or for a bare number "061" the sheet with that number) for a circle with the SAME name that points back to this sheet. When several circles share the same name and sheets, they are paired by their position (top to bottom, then left to right). Sender / receiver roles decide the direction.
3. **Single circle + "( FROM / TO ABC-xxx )"**: the reference text nearest to the circle names the other sheet(s) ("004B/C" = both). In those sheets the page looks for the circle with the same number / letter and picks the best partner by score: shared tags beside both circles (×4), the partner's text pointing back (+2), opposite roles (+1). A circle that already has its partner on the same sheet (same label, opposite role) is internal and is not sent to another sheet.
4. **Numbered circle with no partner on its sheet**: paired with the same-number, opposite-role circle on another sheet of the SAME family (number part of the sheet name: 004A ↔ 004B ↔ 004C).
5. **Signal tag** (`tagIndex`): a tag that a block DRIVES on one sheet and that is an unfed input on another sheet is one signal. The text "( FROM ABC-xxx )" near the input restricts the source sheet; the tag must match exactly (a "S2" prefix = other station is part of the tag).
6. **Text instructions** (v1.15 WIP): "IF M.xxxx = 1 SET SV = n": the number is put on the wire of the nearest "SV" text. "IF M.xxxx = 1 SET SIxxxx => TAG.SV": while the condition holds, the source signal is written into the SV of controller TAG (the SV pin of the DEV in front of its PID; on all 7 sheets the controller is on the same sheet). "SET SI0200 => AB0117": into the operator value of the COS named AB0117. "= 0" conditions work too; several writes to one SV: the last true one wins.
7. **Clicking a circle** (v1.15 WIP): every click goes to the next end of the group (this sheet and every sheet named by the sheet code under the number / letter or by the FROM / TO text, "004B/C" = both; reached also through the other circles because a receiver knows only its sender); fixed order = sheet, then top to bottom, left to right; after the last it starts again.

## 3. What the audit checks (tools/audit-links.js)
- every circle with a sheet name or a FROM / TO text has a partner;
- the partner is on the sheet the text names ("004B/C" = either);
- the tags written beside both ends agree (same signal);
- one sender, one receiver.
Internal pairs (same sheet) are counted separately.

## 4. Results (see docs/FINDINGS.md for what was fixed)
Latest run on the WIP v1.14.4: see section F "Link audit" at the end of docs/FINDINGS.md (364 of 377 circles with a sheet name / FROM-TO text linked; the rest explained or open).

## 5. Known weak points (be careful when changing the link code)
- The same number is used for different signals inside one family (ABC-004A: 1 is a sink TO 005 and a source FROM 004B). The text "( FROM / TO ABC-xxx )" and the tags beside the circle are the only way to tell them apart.
- The reference text can be 70 units away from its circle; each text is given to one circle only (nearest first), circles that already have a partner on the same sheet do not take one.
- Same-number circles in the sheets of a family (004A / B / C use 1-4-7-10 / 2-5-8-11 / 3-6-9-12) are one signal each: one sender, many receivers (fan-out), which the pairing code only partly models (ABC-004A circle 8).

