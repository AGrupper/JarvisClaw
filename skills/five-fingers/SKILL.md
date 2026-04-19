---
name: five-fingers
description: "Five Fingers practice helper. Called by morning-briefing when composing the briefing. Decides whether to show a practice nudge or a drafted morning message based on stored examples."
---

# Five Fingers — Morning Briefing Section

This skill is called during morning briefing composition. It receives:
- `calendarEvents`: today's events (already fetched by morning-briefing)
- `ffState`: contents of `agents/five-fingers/state.json` (already read by morning-briefing)

## Detection

Scan `calendarEvents` for a practice event. Match any event whose `summary` field contains:
- "practice" (case-insensitive, e.g. "🖐️Practice")
- "אצבע" or "five fingers" (case-insensitive)
- "אימון" (case-insensitive)

If no matching event exists today: **return nothing** — omit the Five Fingers section entirely.

If a matching event exists, check `ffState.lastMorningBriefingMention`:
- If it equals today's date (`YYYY-MM-DD`, `Asia/Jerusalem` timezone): **return nothing** — already surfaced this morning.
- Otherwise: produce the section (see below), then update `ffState.lastMorningBriefingMention = today` in `agents/five-fingers/state.json` (re-read → update field → write back, preserve all other fields).

## Section content

### Case A — fewer than 3 example messages (`ffState.exampleMessages.length < 3`)

Return this section verbatim (Hebrew, matches Amit's briefing voice):

```
🤜 **Five Fingers היום**
זכור לשלוח הודעה לחברה הרגיל שלך לפני האימון.
אחרי ששלחת — העבר לי את ההודעה כדי שאלמד את הסגנון שלך.
```

### Case B — 3 or more examples (`ffState.exampleMessages.length >= 3`)

Draft a morning "you coming today?" message in Amit's style, inferred from the stored examples in `ffState.exampleMessages[].text`. The draft should:
- Match the tone, language (Hebrew/mix), and length of the examples
- Sound like Amit wrote it, not a bot
- Be ready to copy-paste into WhatsApp

Return this section:

```
🤜 **Five Fingers היום — טיוטה לקבוצה**
> <drafted message here>
(העתק לווטסאפ לאחר אישור)
```

If `ffState.teammates` is non-empty, address the message to those names. Otherwise keep it generic.
