#!/usr/bin/env bash
# Outputs a JSON blob for the morning briefing:
# { "overdue": [...], "today": [...], "due_today": [...] }
# All arrays are flat; area is a field on each task.
# The briefing compose step groups by area when rendering.
set -e

osascript <<'OSA'

-- Escape a string for use inside a JSON double-quoted value.
on escJson(s)
  set output to ""
  repeat with i from 1 to length of s
    set c to character i of s
    if c = "\"" then
      set output to output & "\\\""
    else if c = "\\" then
      set output to output & "\\\\"
    else if c = (ASCII character 10) then
      set output to output & "\\n"
    else if c = (ASCII character 13) then
      set output to output & ""
    else
      set output to output & c
    end if
  end repeat
  return output
end escJson

-- Format a date object as YYYY-MM-DD.
-- Note: inline if-else is not valid inside handlers; use two separate ifs.
on fmtDate(d)
  set m to month of d as integer
  set dy to day of d as integer
  set ms to m as string
  set ds to dy as string
  if m < 10 then set ms to "0" & ms
  if dy < 10 then set ds to "0" & ds
  return (year of d as string) & "-" & ms & "-" & ds
end fmtDate

-- Get area name for a task (returns "Other" when no area set).
on areaOf(t)
  set tArea to "Other"
  try
    tell application "Things3"
      if area of t is not missing value then set tArea to name of area of t
    end tell
  end try
  return tArea
end areaOf

tell application "Things3"

  -- Anchor: midnight of today.
  set theToday to current date
  set hours of theToday to 0
  set minutes of theToday to 0
  set seconds of theToday to 0
  set tomorrow to theToday + (24 * 3600)

  -- ===== BUCKET 1: Today list (open tasks only) =====
  set todayJson to "["
  set firstEntry to true

  repeat with t in to dos of list "Today"
    if status of t is open then
      if not firstEntry then set todayJson to todayJson & ","
      set tArea to my areaOf(t)
      set todayJson to todayJson & ¬
        "{\"id\":\"" & id of t & "\"" & ¬
        ",\"title\":\"" & my escJson(name of t) & "\"" & ¬
        ",\"area\":\"" & my escJson(tArea) & "\"}"
      set firstEntry to false
    end if
  end repeat
  set todayJson to todayJson & "]"

  -- ===== BUCKETS 2 & 3: Overdue and due-today (from non-Today lists) =====
  set overdueJson to "["
  set dueTodayJson to "["
  set firstOverdue to true
  set firstDueToday to true

  set listsToCheck to {list "Anytime", list "Inbox", list "Upcoming", list "Someday"}

  repeat with theList in listsToCheck
    repeat with t in to dos of theList
      if status of t is open then

        set hasDue to false
        set tDueDate to missing value
        try
          set tDueDate to due date of t
          if tDueDate is not missing value then set hasDue to true
        end try

        if hasDue then
          -- Skip tasks already in Today (query by id avoids loop-reference traps).
          set tId to id of t
          set isInToday to (count of (to dos of list "Today" whose id = tId)) > 0

          if not isInToday then
            set tArea to my areaOf(t)
            set tDueStr to my fmtDate(tDueDate)
            set taskEntry to ¬
              "{\"id\":\"" & id of t & "\"" & ¬
              ",\"title\":\"" & my escJson(name of t) & "\"" & ¬
              ",\"area\":\"" & my escJson(tArea) & "\"" & ¬
              ",\"due\":\"" & tDueStr & "\"}"

            if tDueDate < theToday then
              if not firstOverdue then set overdueJson to overdueJson & ","
              set overdueJson to overdueJson & taskEntry
              set firstOverdue to false
            end if

            if tDueDate >= theToday and tDueDate < tomorrow then
              if not firstDueToday then set dueTodayJson to dueTodayJson & ","
              set dueTodayJson to dueTodayJson & taskEntry
              set firstDueToday to false
            end if
          end if
        end if

      end if
    end repeat
  end repeat

  set overdueJson to overdueJson & "]"
  set dueTodayJson to dueTodayJson & "]"

  return "{\"overdue\":" & overdueJson & ",\"today\":" & todayJson & ",\"due_today\":" & dueTodayJson & "}"

end tell
OSA
