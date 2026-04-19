#!/usr/bin/env python3
"""
Five Fingers attendance check agent.
Runs the logic described in .cron-five-fingers-msg.txt
"""

import json
import os
import subprocess
import sys
from datetime import datetime
import pytz

# Constants
STATE_FILE = "/Users/amitgrupper/.openclaw/workspace/agents/five-fingers/state.json"
TIMEZONE = "Asia/Jerusalem"

def get_current_datetime():
    """Get current datetime in Asia/Jerusalem timezone"""
    tz = pytz.timezone(TIMEZONE)
    return datetime.now(tz)

def read_state():
    """Read state.json file"""
    if not os.path.exists(STATE_FILE):
        return {}
    try:
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}

def write_state(state):
    """Write state.json file"""
    try:
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f, indent=2)
    except IOError as e:
        print(f"Error writing state file: {e}", file=sys.stderr)

def run_gws_calendar():
    """Run gws calendar command and parse JSON output"""
    try:
        result = subprocess.run(
            ["gws", "calendar", "+agenda", "--today", "--timezone", TIMEZONE, "--format", "json"],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except (subprocess.CalledProcessError, json.JSONDecodeError) as e:
        print(f"Error running gws calendar: {e}", file=sys.stderr)
        return None

def find_practice_event(events):
    """Search events for practice-related keywords"""
    practice_keywords = ["אצבע", "five fingers", "אימון", "practice", "training"]
    
    for event in events:
        title = event.get("summary", event.get("title", "")).lower()
        # Check Hebrew keywords
        if any(keyword in title for keyword in practice_keywords):
            return event
    return None

def send_system_event(message):
    """Send system event notification"""
    try:
        subprocess.run(
            ["openclaw", "system", "event", "--text", message, "--mode", "now"],
            capture_output=True,
            text=True
        )
        print(f"Sent system event: {message}")
    except Exception as e:
        print(f"Error sending system event: {e}", file=sys.stderr)

def main():
    # Step 1: Same-day cache check
    now = get_current_datetime()
    today = now.strftime("%Y-%m-%d")
    state = read_state()
    
    daily_check = state.get("dailyCheck", {})
    
    if daily_check.get("date") == today:
        if daily_check.get("hasPractice") == False:
            print(f"No practice today (cached). Exiting.")
            return 0
        elif daily_check.get("hasPractice") == True:
            event_end_str = daily_check.get("eventEnd")
            if event_end_str:
                # Skip to Step 3
                print(f"Practice today (cached). Event ends at {event_end_str}")
                # Step 3: Post-practice nudge trigger
                try:
                    # Parse event end time
                    event_end = datetime.fromisoformat(event_end_str.replace('Z', '+00:00'))
                    if event_end.tzinfo is None:
                        # Assume local timezone if not specified
                        tz = pytz.timezone(TIMEZONE)
                        event_end = tz.localize(event_end)
                    
                    last_nudge = state.get("lastPostPracticeNudge")
                    
                    if now >= event_end and last_nudge != today:
                        send_system_event("Practice done — don't forget to mark attendance in the app.")
                        state["lastPostPracticeNudge"] = today
                        write_state(state)
                    else:
                        print(f"Not time for nudge yet or already nudged today. Now: {now}, Event end: {event_end}, Last nudge: {last_nudge}")
                except Exception as e:
                    print(f"Error parsing event time: {e}", file=sys.stderr)
                return 0
    
    # Step 2: Calendar fetch
    print("Checking calendar for practice events...")
    calendar_data = run_gws_calendar()
    if calendar_data is None:
        print("Failed to fetch calendar data")
        return 1
    
    events = calendar_data.get("events", [])
    practice_event = find_practice_event(events)
    
    if practice_event:
        # Extract end time
        event_end = practice_event.get("end")
        print(f"Found practice event: {practice_event.get('title')}")
        print(f"Event ends at: {event_end}")
        
        # Update state
        state["dailyCheck"] = {
            "date": today,
            "hasPractice": True,
            "eventEnd": event_end
        }
        write_state(state)
        
        # Step 3: Check if we should send nudge now
        try:
            # Parse event end time
            event_end_dt = datetime.fromisoformat(event_end.replace('Z', '+00:00'))
            if event_end_dt.tzinfo is None:
                tz = pytz.timezone(TIMEZONE)
                event_end_dt = tz.localize(event_end_dt)
            
            last_nudge = state.get("lastPostPracticeNudge")
            
            if now >= event_end_dt and last_nudge != today:
                send_system_event("Practice done — don't forget to mark attendance in the app.")
                state["lastPostPracticeNudge"] = today
                write_state(state)
            else:
                print(f"Not time for nudge yet or already nudged today. Now: {now}, Event end: {event_end_dt}, Last nudge: {last_nudge}")
        except Exception as e:
            print(f"Error parsing event time: {e}", file=sys.stderr)
        
        return 0
    else:
        print("No practice event found today")
        # Update state
        state["dailyCheck"] = {
            "date": today,
            "hasPractice": False,
            "eventEnd": None
        }
        write_state(state)
        return 0

if __name__ == "__main__":
    sys.exit(main())