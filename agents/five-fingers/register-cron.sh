#!/bin/bash
# Run this once to register the five-fingers-attendance cron job.
# Requires OpenClaw gateway to be running (openclaw connect).

PROMPT=$(cat /Users/amitgrupper/.openclaw/workspace/.cron-five-fingers-msg.txt)

openclaw cron add \
  --name "five-fingers-attendance" \
  --cron "*/15 17-23 * * *" \
  --tz "Asia/Jerusalem" \
  --session isolated \
  --light-context \
  --message "$PROMPT"

echo "Done. Verify with: openclaw cron list"
