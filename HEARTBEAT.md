# HEARTBEAT.md Template

```markdown
# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.
```

## School Alerts

Read `~/.openclaw/workspace/agents/school/state.json`. If the file is missing or unreadable, skip this section silently.

If `pendingAlerts` contains any entries where `delivered` is `false`:

- Surface each alert to Amit (one line per entry, using the `summary` field)
- Immediately before writing back: re-read `~/.openclaw/workspace/agents/school/state.json` to get the latest version (the cron agent may have added new entries since your initial read)
- Set `delivered: true` on each entry you surfaced, merge with the freshly-read file, and write it back
- If the write fails, do not re-surface these alerts at the next heartbeat — report the write failure to Amit instead

Example output line:
> **School:** New announcement in Math — office hours moved to Thursday
