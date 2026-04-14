# HEARTBEAT.md Template

```markdown
# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.
```

## School Alerts

Read `agents/school/state.json`. If `pendingAlerts` contains any entries where `delivered` is `false`:

- Surface each alert to Amit (one line per entry, using the `summary` field)
- After surfacing, set `delivered: true` on each surfaced entry and write `state.json` back

Example output line:
> **School:** New announcement in Math — office hours moved to Thursday
