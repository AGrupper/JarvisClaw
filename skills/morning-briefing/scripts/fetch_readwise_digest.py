#!/usr/bin/env python3
"""Fetch today's Readwise email from Gmail for the morning briefing."""

from __future__ import annotations

import base64
import html
import json
import subprocess
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from zoneinfo import ZoneInfo


TZ = ZoneInfo("Asia/Jerusalem")


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        text = data.strip()
        if text:
            self.parts.append(text)

    def text(self) -> str:
        return "\n".join(self.parts)


def run_gws(args: list[str], timeout: int = 15) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, capture_output=True, text=True, timeout=timeout)


def gmail_date_bounds() -> tuple[str, str]:
    today = datetime.now(TZ).date()
    tomorrow = today + timedelta(days=1)
    return today.strftime("%Y/%m/%d"), tomorrow.strftime("%Y/%m/%d")


def decode_body(data: str) -> str:
    padding = "=" * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(data + padding).decode("utf-8", "replace")


def walk_parts(part: dict) -> list[dict]:
    parts = [part]
    for child in part.get("parts", []) or []:
        parts.extend(walk_parts(child))
    return parts


def extract_body(payload: dict) -> str:
    html_body = ""
    for part in walk_parts(payload):
        mime_type = part.get("mimeType")
        body_data = part.get("body", {}).get("data")
        if not body_data:
            continue

        text = decode_body(body_data)
        if mime_type == "text/plain":
            return clean_text(text)
        if mime_type == "text/html" and not html_body:
            html_body = text

    if not html_body:
        return ""

    parser = TextExtractor()
    parser.feed(html_body)
    return clean_text(html.unescape(parser.text()))


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in text.split("\n")]
    compact: list[str] = []
    blank = False
    for line in lines:
        if line.strip():
            compact.append(line)
            blank = False
        elif not blank:
            compact.append("")
            blank = True
    return "\n".join(compact).strip()


def headers_from(message: dict) -> dict[str, str]:
    headers = message.get("payload", {}).get("headers", [])
    return {h.get("name", "").lower(): h.get("value", "") for h in headers}


def message_date_is_today(headers: dict[str, str]) -> bool:
    raw = headers.get("date")
    if not raw:
        return True
    try:
        message_date = parsedate_to_datetime(raw).astimezone(TZ).date()
    except Exception:
        return True
    return message_date == datetime.now(TZ).date()


def print_json(payload: dict) -> None:
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def main() -> int:
    after, before = gmail_date_bounds()
    query = f"from:readwise after:{after} before:{before}"

    listing = run_gws(
        [
            "gws",
            "gmail",
            "users",
            "messages",
            "list",
            "--params",
            json.dumps({"userId": "me", "maxResults": 5, "q": query}),
            "--format",
            "json",
        ]
    )
    if listing.returncode != 0:
        print_json({"found": False, "error": listing.stderr.strip(), "query": query})
        return 0

    try:
        messages = json.loads(listing.stdout).get("messages", [])
    except Exception as exc:
        print_json({"found": False, "error": f"list parse failed: {exc}", "query": query})
        return 0

    for message in messages:
        mid = message.get("id")
        if not mid:
            continue

        result = run_gws(
            [
                "gws",
                "gmail",
                "users",
                "messages",
                "get",
                "--params",
                json.dumps({"userId": "me", "id": mid, "format": "full"}),
                "--format",
                "json",
            ]
        )
        if result.returncode != 0:
            continue

        try:
            full = json.loads(result.stdout)
        except Exception:
            continue

        headers = headers_from(full)
        if not message_date_is_today(headers):
            continue

        body = extract_body(full.get("payload", {}))
        print_json(
            {
                "found": True,
                "id": mid,
                "query": query,
                "from": headers.get("from", ""),
                "subject": headers.get("subject", ""),
                "date": headers.get("date", ""),
                "snippet": full.get("snippet", ""),
                "body": body,
            }
        )
        return 0

    print_json({"found": False, "query": query})
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print_json({"found": False, "error": str(exc)})
        raise SystemExit(0)
