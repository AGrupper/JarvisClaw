#!/usr/bin/env python3
"""One-time cleanup: remove duplicate pendingAlerts from state.json.

Keeps the oldest entry (earliest addedAt) per unique summary, drops the rest.
Adds the dropped IDs into the appropriate seenIds array so the cron doesn't
re-surface them on the next fetch.

Usage:
    python3 agents/school/cleanup_duplicates.py [--dry-run]
"""

import json
import os
import sys

STATE_PATH = os.path.join(os.path.dirname(__file__), 'state.json')

TYPE_TO_SEEN = {
    'message':      'seenMessageIds',
    'notification': 'seenNotificationIds',
    'change':       'seenChangeIds',
    'assignment':   'seenClassroomIds',
    'announcement': 'seenClassroomIds',
    'system':       'seenMessageIds',  # fallback
}

dry_run = '--dry-run' in sys.argv


def main():
    with open(STATE_PATH, encoding='utf-8') as f:
        state = json.load(f)

    alerts = state.get('pendingAlerts', [])

    # Group by summary; sort each group oldest-first so we keep the earliest
    from collections import defaultdict
    by_summary = defaultdict(list)
    for a in alerts:
        by_summary[a.get('summary', '')].append(a)

    kept = []
    removed = []
    for summary, group in by_summary.items():
        group.sort(key=lambda a: a.get('addedAt', ''))
        kept.append(group[0])
        removed.extend(group[1:])

    # Sort kept back into original insertion order
    kept_ids = {a['id'] for a in kept}
    kept_ordered = [a for a in alerts if a['id'] in kept_ids]

    print(f'Total alerts:   {len(alerts)}')
    print(f'Unique summaries: {len(by_summary)}')
    print(f'Duplicates removed: {len(removed)}')

    if not removed:
        print('Nothing to clean up.')
        return

    for a in removed:
        print(f'  DROP [{a.get("type","?")}] {a.get("summary","")[:80]}')

    if dry_run:
        print('\nDry run — no changes written.')
        return

    # Add removed IDs to seenIds so the cron won't re-fetch them
    for a in removed:
        seen_key = TYPE_TO_SEEN.get(a.get('type', ''), 'seenMessageIds')
        seen_list = state.setdefault(seen_key, [])
        if a['id'] not in seen_list:
            seen_list.append(a['id'])

    state['pendingAlerts'] = kept_ordered

    # Atomic write
    tmp = STATE_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    os.replace(tmp, STATE_PATH)

    print(f'\nDone — state.json updated ({len(kept_ordered)} alerts kept).')


if __name__ == '__main__':
    main()
