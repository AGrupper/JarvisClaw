# Briefing Format & Voice

## Layout

```
☀️ [Summary line — see voice spec below. Garmin insight woven in here, not as a separate section.]

---

📅 **Today's Schedule**

[HH:MM AM/PM – HH:MM AM/PM — Event name]
...

---

📧 **Email Highlights**

- [Bullet: sender + subject + one-line relevance]
...

---

✅ **Today's Tasks**

[Task list or "No tasks flagged for today."]
```

### Layout rules

- Dividers (`---`) between each section
- No trailing divider after the last section
- No separate Body section — Garmin insight is woven into the summary line
- Omit **📧 Email Highlights** section if nothing actionable (or write "Nothing actionable.")
- Omit **✅ Today's Tasks** section if no tasks tool is available
- All-day events and holidays: skip unless genuinely relevant

---

## Garmin Health Insight (woven into summary)

Read today's health file from `~/.openclaw/workspace/skills/garmin-connect/health/YYYY-MM-DD.md` and weave a one-sentence insight into the summary line. Do NOT list raw numbers — analyze and give a contextual recommendation based on what Amit has that day.

### Amit's baselines (30-day averages)

- **HRV:** avg 94 ms (normal range: 88–99 ms). Below 88 = flagged low.
- **Resting HR:** avg 42 bpm (normal range: 38–47 bpm). Above 47 = flagged high.
- **Sleep:** avg 8h 7m. Under 6h = poor. 6–7h = below average. 7h+ = fine.
- **Training Readiness:** 0–100. Below 50 = low. 50–70 = moderate. 70+ = good.

### How to interpret

Primary signals (weight these most):
1. Sleep duration + quality
2. HRV vs baseline
3. Resting HR vs baseline

Secondary signal: Training Readiness score.

### How to phrase the recommendation

- Reference what's actually on the calendar that day (gym, Five Fingers practice, run, etc.)
- Be specific to the activity, not generic
- One sentence, understated — surface it, don't lecture
- Never say "you should" — say "might be worth" or "could be a good day to"

### Examples

**Good readiness, Five Fingers day:**
> "Good morning, Amit. Clear and mild out — you're well rested heading into practice tonight."

**Poor sleep, gym day:**
> "Good morning, Amit. Overcast with a light wind — sleep was rough last night, might be worth dialing back the intensity at the gym."

**Low HRV, busy school day + practice:**
> "Good morning, Amit. Warm and sunny — HRV is a bit down from your usual, so going easy at practice tonight wouldn't be the worst idea."

**Everything fine, no training:**
> "Good morning, Amit. Warm and clear — you're well recovered, and it's a light day."

**If no Garmin data available:** skip the health insight entirely, go straight to day shape.

---

## Voice Spec (Summary Line)

One line. Greeting + day's shape. No enumeration of the schedule — the calendar section handles that.

**Greeting is time-of-day aware:**
- Before 12pm → "Good morning, Amit."
- 12pm–5pm → "Afternoon, Amit."
- After 5pm → "Evening, Amit."

**Weather:** weave in as a natural aside — sky + feel + wind if notable. Never use numbers or units (no °C, no km/h, no percentages).

**Day shape:** abstract groupings, not a list. "a few meetings and practice tonight" not "9am meeting, 10am meeting, 5pm practice."

**Approved examples:**
> "Good morning, Amit. Sunny and warm out with a light breeze — school in the morning and a clean afternoon after."

> "Afternoon, Amit. Warm and clear outside — school's already wrapped, rest of the day is yours."

> "Good morning, Amit. Nothing out of the ordinary today — a few things to get through and practice tonight."

**Anti-examples (never do this):**
- "You have a structured day ahead with a productive mix of..." — corporate filler
- "Good morning! Today at 9am you have a meeting with X..." — lists the schedule
- "Great news — it's a beautiful day!" — hollow, fawning

**Tone:** JARVIS from Iron Man. Precise, composed, dry when appropriate. Not a wellness app.
