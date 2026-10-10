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
