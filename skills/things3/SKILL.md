---
name: things3
description: "Manage Things3 tasks: list tasks, add tasks with deadlines, complete tasks. Use when Amit asks what's on his task list, asks to add a task, or forwards a message that contains an implicit task or deadline. Triggers on: 'what's on my list', 'add a task: X', 'remind me to Y by Friday', 'add this: ...', or any forwarded message with an implicit ask."
---

# Things3

## When to fire

- **Read**: "what's on my list", "what do I have today", "what's due this week", "any overdue tasks?"
- **Write**: "add a task: X", "remind me to Y by Friday", "add this: ..."
- **Forwarded messages** — if the message contains an ask with a date, infer intent and add the task immediately. Don't ask for step-by-step confirmation (same rule as `USER.md` forwarded messages). Include the full original message as the task notes so context is preserved.
- Completions/updates: handled via escape-hatch patterns below.

---

## Primary pattern A — list tasks

```applescript
tell application "Things3"
  set output to ""
  repeat with t in to dos of list "<LIST>"
    if status of t is open then
      set tArea to "(none)"
      try
        if area of t is not missing value then set tArea to name of area of t
      end try
      set tDue to ""
      try
        set d to due date of t
        if d is not missing value then
          set m to month of d as integer
          set dy to day of d as integer
          if m < 10 then set ms to "0" & m else set ms to m as string
          if dy < 10 then set ds to "0" & dy else set ds to dy as string
          set tDue to (year of d as string) & "-" & ms & "-" & ds
        end if
      end try
      set output to output & id of t & tab & name of t & tab & tArea & tab & tDue & linefeed
    end if
  end repeat
  return output
end tell
```

Available lists: `Inbox`, `Today`, `Tomorrow`, `Anytime`, `Upcoming`, `Someday`

Output is tab-delimited `id \t name \t area \t due_date` per line. Parse with awk or Python.

---

## Primary pattern B — add task with deadline

**Critical:** AppleScript date literals (`date "April 23, 2026"`) fail. Always build dates by setting properties on `current date`.

```applescript
-- Step 1: build the date object (outside the tell block)
set taskDate to current date
set year of taskDate to <YEAR>    -- 4-digit integer, e.g. 2026
set month of taskDate to <MONTH>  -- numeric 1–12 works
set day of taskDate to <DAY>
set hours of taskDate to 0
set minutes of taskDate to 0
set seconds of taskDate to 0

-- Step 2: create the task
tell application "Things3"
  set newTask to make new to do with properties {¬
    name:"<TITLE>", ¬
    notes:"<ORIGINAL MESSAGE OR NOTES>", ¬
    deadline:taskDate, ¬
    due date:taskDate}
  return id of newTask
end tell
```

**`due date` vs `deadline`:** `due date` (soft) controls when the task surfaces in the Today list.
`deadline` (hard) shows a red countdown in Things3. For forwarded asks, set both to the same date.

**Optional properties** (add inside the `{}` block):
- `tag names:{"work", "urgent"}` — list of strings
- `area:area "<AREA NAME>"` — e.g. `area "Personal"`
- `notes:"<text>"` — supports plain text

**Date parsing:** convert relative phrases before emitting AppleScript:
- "by Friday" → compute next Friday's date
- "end of next week" → next Sunday's date
- "by tomorrow" → today + 1 day
- Today's date is always available in context.

---

## Escape-hatch patterns

**Complete by id:**
```applescript
tell application "Things3"
  set status of (to do id "<UUID>") to completed
end tell
```

**Complete by title match:**
```applescript
tell application "Things3"
  set matches to (every to do of list "Today" whose name is "<TITLE>")
  if (count of matches) > 0 then set status of first item of matches to completed
end tell
```

**Update a property:**
```applescript
tell application "Things3"
  set t to to do id "<UUID>"
  set name of t to "<NEW TITLE>"
  -- other writable properties: notes, deadline, due date, tag names
end tell
```

**Update deadline:**
```applescript
set newDeadline to current date
set year of newDeadline to 2026
set month of newDeadline to 5
set day of newDeadline to 9
set hours of newDeadline to 0
set minutes of newDeadline to 0
set seconds of newDeadline to 0
tell application "Things3"
  set deadline of (to do id "<UUID>") to newDeadline
end tell
```

**Move to area:**
```applescript
tell application "Things3"
  set area of (to do id "<UUID>") to area "<AREA NAME>"
end tell
```

**Search by name substring:**
```applescript
tell application "Things3"
  set output to ""
  set listsToSearch to {list "Today", list "Anytime", list "Inbox", list "Upcoming"}
  repeat with theList in listsToSearch
    repeat with t in to dos of theList
      if (name of t contains "<QUERY>") and status of t is open then
        set output to output & id of t & tab & name of t & linefeed
      end if
    end repeat
  end repeat
  return output
end tell
```

**Introspect task properties at runtime:**
```bash
osascript -e 'tell application "Things3" to properties of first to do of list "Today"'
```

---

## Running osascript

Short one-liners:
```bash
osascript -e 'tell application "Things3" to ...'
```

Multi-line heredoc:
```bash
osascript <<'OSA'
-- script here
OSA
```

---

## Gotchas

- **First run**: macOS prompts for Automation permission on first osascript call. Accept once.
- **Empty list**: `to dos of list "Today"` returns `{}` when empty — repeat loops just don't execute.
- **Missing area**: `area of t` can be `missing value`. Always use `try ... end try` before accessing `name of area of t`.
- **Date string literals fail**: `date "Monday, April 20, 2026 at 12:00:00 AM"` throws a syntax error. Use the `current date` + property-setting pattern above.
- **Tag names**: `tag names of t` returns a list `{"tag1", "tag2"}`. Join with `set text item delimiters` if you need a string.
- **Status values**: `open`, `completed`, `canceled` (not `cancelled`).

---

## Briefing — do not bypass the aggregator script

The morning briefing uses the pinned script at `skills/things3/briefing_tasks.sh`. Do not replace it with inline osascript in the briefing fetch step.
