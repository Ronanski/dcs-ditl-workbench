#!/bin/bash
# SessionStart: awtomatikong briefing ng handoff para sa bagong session (ang stdout ay pumapasok sa context ni Claude).
# Nire-record din ang HEAD sa simula para malaman ng Stop hook kung may nagawa sa session na ito.
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse HEAD > "$(git rev-parse --git-dir)/handoff-start" 2>/dev/null
# kailangan ng LINEAR test (python xlrd); tahimik, hindi nagfa-fail ang hook
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then python3 -c "import xlrd" 2>/dev/null || pip install -q xlrd >/dev/null 2>&1 || true; fi
echo "=== LOGIC SIM - AWTOMATIKONG HANDOFF BRIEFING (galing sa .claude/hooks/session-start.sh) ==="
echo "Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null) @ $(git rev-parse --short HEAD 2>/dev/null)"
echo
echo "MANDATORY: Basahin ang CLAUDE.md, docs/HANDOVER.md, docs/RELEASE-PROTOCOL.md, DESIGN.md bago gumawa. Sumagot sa simpleng Taglish (80% Tagalog). Pagkabasa, ibuod sa 5 linya kung nasaan tayo at ano ang uunahin (HANDOVER §4)."
echo "MANDATORY: Bago tapusin ang session, i-update ang docs/HANDOVER.md (§1 estado, §4 susunod) at i-commit + i-push. Aalalahanan ka ng Stop hook; hindi na magpapaalala ang user."
echo
if [ -f docs/HANDOVER.md ]; then
  echo "----- docs/HANDOVER.md §1 Estado at §4 Susunod na gawin -----"
  awk '/^## 1\./{p=1} /^## 2\./{p=0} /^## 4\./{p=1} /^## 5\./{p=0} p' docs/HANDOVER.md
fi
exit 0
