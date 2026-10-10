#!/bin/bash
# Stop: kapag may nagawa sa session (commit o pagbabago) pero hindi na-update ang docs/HANDOVER.md, harangan ang pagtatapos at paalalahanan si Claude.
input=$(cat)
[ "$(echo "$input" | jq -r '.stop_hook_active' 2>/dev/null)" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
gd=$(git rev-parse --git-dir); [ -f "$gd/handoff-start" ] || exit 0
start=$(cat "$gd/handoff-start")
changed=$( (git diff --name-only "$start" HEAD 2>/dev/null; git status --porcelain 2>/dev/null | awk '{print $2}') | sort -u )
[ -z "$changed" ] && exit 0                       # walang nagawa: walang kailangang i-handoff
echo "$changed" | grep -qx "docs/HANDOVER.md" && exit 0   # na-update na
echo "HANDOFF: may mga pagbabago sa session na ito pero hindi pa na-update ang docs/HANDOVER.md. Bago tapusin: i-update ang §1 (estado: version, branch, huling commit, ano ang natapos), §4 (susunod na gawin / NEEDS REVIEW / hindi pa na-test) at, kung nagbago ang code o test, ang PROJECT-NOTES at docs/REPORT. Pagkatapos i-commit at i-push. Hindi na magpapaalala ang user." >&2
exit 2
