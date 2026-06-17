#!/usr/bin/env python3
"""Pretty-print the thoughts. HTML with a hand-rolled tokenizer.

Why hand-rolled: Python's html.parser mishandles <meta>, <link>, and
the <!DOCTYPE> declaration in ways that corrupt the output. The file
is also pure markup (no significant text content between tags), so a
simple depth-counter formatter is enough.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

HTML_PATH = Path(
    "/home/imtiaz/Documents/projects/thoughts/"
    "thoughts. — Launchpad for Student Builders.html"
)

INDENT = "  "

VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

RAW = {"script", "style"}

TAG_RE = re.compile(
    r"<!--.*?-->"
    r"|<![^>]*>"
    r"|</?([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*?)?(\s*/)?>"
    r"|([^<]+)",
    re.DOTALL,
)


def normalize_attrs(attr_text: str) -> str:
    if not attr_text:
        return ""
    s = re.sub(r"\s+", " ", attr_text.strip())
    return (" " + s) if s else ""


def main() -> int:
    html = HTML_PATH.read_text(encoding="utf-8")
    if html.startswith("\ufeff"):
        html = html[1:]

    out: list[str] = []
    depth = 0
    pos = 0
    raw_buffer: list[str] | None = None
    raw_open_tag: str = ""
    raw_name: str = ""

    while pos < len(html):
        m = TAG_RE.search(html, pos)
        if not m:
            tail = html[pos:]
            if tail.strip():
                out.append(INDENT * depth + tail.strip())
            break

        if raw_buffer is not None:
            tok = m.group(0)
            raw_buffer.append(html[pos:m.end()])
            if tok.startswith("</") and re.match(
                rf"</\s*{re.escape(raw_name)}\s*>", tok
            ):
                out.append(INDENT * depth + raw_open_tag + "".join(raw_buffer))
                raw_buffer = None
                raw_open_tag = ""
                raw_name = ""
            pos = m.end()
            continue

        gap = html[pos:m.start()]
        if gap and gap.strip():
            out.append(INDENT * depth + gap.strip())

        tok = m.group(0)

        if tok.startswith("<!--"):
            out.append(INDENT * depth + tok)
        elif tok.startswith("<!"):
            out.append(tok)
        elif tok.startswith("</"):
            depth -= 1
            out.append(INDENT * depth + tok)
        elif tok.startswith("<"):
            name = (m.group(1) or "").lower()
            attr_text = m.group(2) or ""
            self_close = (m.group(3) or "").strip() == "/"
            attrs = normalize_attrs(attr_text)

            if name in RAW and not self_close:
                raw_open_tag = f"<{name}{attrs}>"
                raw_buffer = [""]
                raw_name = name
                out.append(INDENT * depth + f"<{name}{attrs}>")
                depth += 1
            else:
                out.append(INDENT * depth + f"<{name}{attrs}>")
                if name not in VOID and not self_close:
                    depth += 1
        else:
            if tok.strip():
                out.append(INDENT * depth + tok.strip())

        pos = m.end()

    formatted = "\n".join(out)
    formatted = re.sub(r"\n{3,}", "\n\n", formatted)
    formatted = formatted.rstrip() + "\n"
    HTML_PATH.write_text(formatted, encoding="utf-8")
    print(f"reformatted: {len(html)} -> {len(formatted)} chars")
    return 0


if __name__ == "__main__":
    sys.exit(main())
