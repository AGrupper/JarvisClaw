#!/bin/bash
# Run the five-fingers attendance check agent

# Set environment
export PATH="/opt/homebrew/bin:/opt/homebrew/share/google-cloud-sdk/bin:/Users/amitgrupper/go/bin:/usr/local/bin:/usr/bin:/bin"
export OPENCLAW_WORKSPACE="/Users/amitgrupper/.openclaw/workspace"

# Run the agent with the prompt
PROMPT=$(cat /Users/amitgrupper/.openclaw/workspace/.cron-five-fingers-msg.txt)

# Use openclaw agent command to run the agent locally
/opt/homebrew/bin/openclaw agent --local --message "$PROMPT" --thinking off