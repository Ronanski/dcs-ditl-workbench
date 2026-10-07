# DESIGN.md — rules that do not change (read this first, every session)

Only the USER changes this file (or Claude, when the user says so). `PROJECT-NOTES-vX.Y.Z.md` is only the changelog.

## 1. What this is
An offline DCS logic workbench: DITL (digital logic pages) and ANALOG / ABC (54 sheets) simulated from the drawings.
Direction (docs/ARCHITECTURE.md): engineering station + controller simulator + plant simulator, OFFLINE (no server, no OPC / eDNA / VPN),
portable Windows app without admin rights. The user is an automation engineer (non-coder): explain simply, in Taglish, like an engineer.

## 2. Hard rules
1. **DITL page is NEVER modified.** Only the ANALOG page changes. Every build: `node tools/guard-ditl.js baseline/ditl-workbench-v1.0.0.html ditl-workbench-vX.Y.Z.html` must print IDENTICAL.
   (Open question, decision belongs to the user: a new shared scan engine that gives the same DITL results. Not allowed until the user says yes.)
2. **Signal rule.** ORIGIN signal (nothing in the drawing drives it) = the user sets it (digital: click 1/0; analog: slider/number). A signal driven by a block (this sheet or another sheet) = computed, never typed. FORCE = optional override only for signals the user does not control.
3. **Switching rule (T / AMT / COS).** The selected input path is lit, the other is grey; the active letter is coloured; COS lamp lit when manual. Colour per LEG (input pin back to the first junction).
4. **Colours.** Wires simple: digital thin solid (live colour), analog amber tube/solid. Symbols stand out over lines. Legend must not obstruct. Values green by default, selectable colour/size/font; no redundant values (none on constants, I/P, AO, valve chain); value above/below the address without covering text / line / shape. Engineering theme = muted colours, still distinct per element (NOT pure white).
5. **Always paused on open.** Settings, forces, inputs, switches must survive refresh / restart (project file, see §5).
6. **No phone-browser testing.** Claude tests in headless Chromium here; the user tests in desktop Chrome / the portable app. PDF only when asked.
7. **Never reference a `const` before its definition** in the analog script (v1.6.0 crash). After every patch load the file and check there is no page error.
8. **Bump `AN_PV`** whenever the reader changes net / block numbering (saved inputs/forces are keyed by those numbers). Current: 11.
9. **Truth in reporting.** Say what was tested and what was NOT (e.g. the Windows exe is only built on GitHub, not run by Claude).

## 3. Every build = this checklist
1. Patch script `tools/patch-X.Y.Z.js` (from the previous html) -> `ditl-workbench-vX.Y.Z.html` (name + `<title>` + project-file `ver` carry the version).
2. Guard IDENTICAL; tests: test-project, test-numinput (REAL mouse, Run and Pause), test-circles, test-storage, test-storage2, test-anim, plus a screenshot of the changed area.
3. Update `PROJECT-NOTES-vX.Y.Z.md` (rename the file with the version, newest entry on top), `docs/HANDOVER.md` (current state + open items) and `docs/PROGRESS.md` (run `node tools/progress.js <html>`; tell the user the new %).
4. Move the PREVIOUS html to `archive/html/`, the previous patch to `tools/history/`. Root keeps exactly ONE html.
5. Commit + push to `claude/trusting-goodall-313vmr` (no PR unless the user asks). Send the html to the user (SendUserFile; he cannot download from the sandbox).

## 4. Versioning and repo layout
MAJOR.MINOR.PATCH — bug fix = patch, new feature = minor, big/structural change = major. Baseline v1.0.0 = old v46.
```
README.md  DESIGN.md  PROJECT-NOTES-vX.Y.Z.md  ditl-workbench-vX.Y.Z.html   <- the ONLY html at the root
app/        desktop shell (Electron, portable, offline) + build in .github/workflows/
baseline/   ditl-workbench-v1.0.0.html (reference for the DITL guard) — never delete
tools/      lib.js, guard-ditl.js, test-*.js, shot.js, audit.js, patch-<current>.js ; tools/history/ = old patch scripts
docs/       ARCHITECTURE.md, HANDOVER.md, PROGRESS.md, BACKLOG.md, BLOCK-LIBRARY.md (behaviour spec, user confirms), SHEET-TRIAGE.md, BLOCK-COVERAGE.md ...
archive/    old html builds, old notes, old pdf (nothing is deleted, only moved; git history keeps everything)
```

## 5. Version control and continuity (agreed structure)
- One working branch `claude/trusting-goodall-313vmr`. Every build is one commit with the version in the message.
- The repo is the memory: a new chat session must be able to continue by reading README -> DESIGN.md -> latest PROJECT-NOTES -> docs/HANDOVER.md. Nothing important lives only in chat.
- `docs/HANDOVER.md` holds the paste-in prompt for a new session and the open list; update it in every build.
- The user's own data (project files, IO list, settings files) is never committed unless the user asks.
- The Windows portable exe is built by GitHub Actions on every push that changes the html or app/: GitHub > Actions > the run > Artifacts (kept 90 days).

## 6. PROPOSED (needs the user's OK, then move to §2)
- Git tag per release (`v1.10.1`) so old builds can be fetched without an archive folder.
- Automated per-sheet regression: for all 54 sheets store a "golden" summary (blocks, links, a few forced-input outputs) and fail a build when it changes without a note.
- Split the single html into source modules (reader / engine / UI) built into the one html + the app (docs/ARCHITECTURE.md step 2).
- Keep archive/ for 3 months, then delete (git history still has it).
