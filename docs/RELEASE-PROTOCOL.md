# RELEASE PROTOCOL (standard ng user, 2026-10-10) - sundin sa bawat release

Sinabi ng user: "Standard release protocol ito moving forward, maliban kung ako mismo ang magbago."

## 1. Mga kailangan sa bawat release
HTML build (`logic-sim-vX.Y.Z.html`) - Portable EXE (`logic-sim-vX.Y.Z-portable.exe`) - APK (`logic-sim-vX.Y.Z.apk`) - Release Report PDF (`LogicSim_vX.Y.Z_Report.pdf`, simpleng Taglish) - Manual Testing Guide PDF (`LogicSim_vX.Y.Z_Manual_Testing_Guide.pdf`). Lahat ay naka-attach sa GitHub Release `vX.Y.Z`.
**Sa chat:** ipadala ang PDF report at ang HTML (SendUserFile). Links ay hindi kailangan (nakikita ng user sa GitHub), pero ang report ay may direct download links.

## 2. Pangalan at version
Isang numero lang: ang nasa filename ng root html (`node tools/version.js`). Pareho sa release tag, html/exe/apk, report at testing guide. Walang bagong naming convention.

## 3. Build at verification (huwag ideklarang tapos hangga't hindi verified)
- Ang workflow `.github/workflows/release.yml` ay nagba-build ng exe + apk at nagpa-publish ng Release. Kinokopya rin nito ang `docs/LogicSim_vX.Y.Z_*.pdf` sa release.
- Ang push trigger nito ay para sa branch `claude/trusting-goodall-313vmr` lang. Sa ibang branch: patakbuhin ang `workflow_dispatch` (tool `mcp__github__actions_run_trigger`, workflow `release.yml`, `ref` = ang working branch). Walang `gh` CLI sa cloud session (invalid ang token).
- Tingnan sa `mcp__github__actions_get / actions_list` (run + jobs `version`, `apk`, `exe`, `release` = success) at sa `mcp__github__get_release_by_tag` (lahat ng assets naroon, tama ang tag at target commit).
- I-compare ang SHA256 (`digest` ng asset) ng html/pdf sa lokal na file. EXE at APK ay hindi pa tinetest ng Claude (user lang); sabihin ito nang diretso.
- Ang pag-re-run ng workflow ay nire-rebuild ang exe/apk (parehong code, iba ang hash). Sabihin ito sa user.

## 4. Laman ng Release Report (PDF, simpleng Taglish, may tables)
Version + petsa + commit; direct download links; bagong features; bugs na naayos; automated tests at actual results; hiwalay na manual test results; known issues; mga ABC sheet / feature na hindi pa na-test (may coverage table kada sheet); manual testing instructions; recommended next actions; paliwanag ng PASS / FAIL / NEEDS REVIEW / NOT TESTED. Ihiwalay ang VERIFIED sa assumptions. Huwag sabihing fully working ang lahat ng ABC sheets kung hindi lahat na-validate.
Generator ng v1.20.8 (gamiting modelo): `python3 tools/release-docs/make-report-v1.20.8.py` pagkatapos `node tools/release-docs/html-to-pdf.js <html> <pdf>`. Kopyahin at i-adapt para sa susunod na version; basahin ang `docs/TEST-RESULTS-*.json` (mga record ng tests).

## 5. Manual Testing Guide
Kada test: Test ID + ABC sheet; block / tag; starting condition; EXACT na hakbang (saan pupunta, ano ang pipindutin, anong value); expected result; actual result; status at ebidensya; ano ang gagawin kapag hindi tugma. Subukan muna ang mga hakbang sa headless browser ("rehearsal") at isulat ang nakita, na malinaw na hiwalay sa test ng user. Bawal: "test the analog simulation".

## 6. Protektahan ang gumagana
Digital simulation at DITL page hindi nasisira. Analog accuracy ang priority. I-verify laban sa totoong drawing, wire, address at LINEAR data (`data/reference/LMYP-1_1-LINEAR.xls`). Kulang o malabong reference = NEEDS REVIEW, hindi hula.

## 7. Hitsura ng PDF (RULE ng user, 2026-10-10): PAPER-LIKE, hindi puting-puti
Masakit sa mata ang maliwanag na puting background, kahit naka eye comfort ang user. **Lahat ng PDF (Report, Manual Testing Guide, at anumang PDF na ipapadala) ay dapat paper-like:** cream / warm na papel (`#efe6cf`), madilim na kayumangging text (`#2e2619`), malambot na kulay ng status (berde / pula / dilaw / abo na hindi matingkad). **Bawal ang purong puti** (`#fff`) sa background, sa table o sa kahon.
- Ang hitsura ay nasa **isang file lang: `tools/release-docs/style.py`** (CSS at `page()`); lahat ng generator ay gumagamit nito (`exec(open('tools/release-docs/style.py').read())`). Palitan ang kulay doon, hindi sa bawat generator.
- PDF: `node tools/release-docs/html-to-pdf.js <html> <pdf> vX.Y.Z` (paper mode: buong pahina ay cream, kasama ang margins; may page number). Tingnan ang resulta (pdftoppm) bago ipadala.
- Bagong generator para sa susunod na version: kopyahin ang `make-report-v*.py` / `make-guide-v*.py` at panatilihin ang `style.py`.

## 8. Dokumentasyon at mga rules ay UPDATED KADA RELEASE (RULE ng user, 2026-10-10)
Bago ideklarang tapos ang release, patakbuhin ang `node tools/check-release-docs.js` (dapat PASS) at i-update ang LAHAT ng nasa listahan na ito (hindi puwedeng laktawan):
1. `docs/HANDOVER.md`: §1 estado (version, branch, commit, workflow run), §3 mga bagong desisyon at rules ng user, §4 susunod / NEEDS REVIEW, §5 mga bagong test / tool.
2. `PROJECT-NOTES-vX.Y.Z.md` (changelog; ilipat ang luma sa `archive/notes/`) at `docs/REPORT-vX.Y.Z.md` (technical).
3. `docs/FINDINGS.md` (bagong H-xx na may sanhi, ayos, test).
4. `DESIGN.md`: bagong rules ng user (numbered) at checklist kung nagbago.
5. `docs/RELEASE-PROTOCOL.md` (ito) at `CLAUDE.md`: kapag may bagong rule o utos ang user sa proseso o sa hitsura ng dokumento.
6. Report PDF at Guide PDF ng version (paper-like, seksyon 7), `docs/REGRESSION-vX.Y.Z.txt`, `docs/TEST-RESULTS-*.json`.
7. `docs/MANUAL.md` kung may nagbago na nakikita ng user sa app.
Kapag may bagong rule ang user sa chat: isulat agad sa DESIGN.md / RELEASE-PROTOCOL.md / HANDOVER §3 sa parehong session, hindi hintayin ang release.

