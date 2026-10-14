"""Capture the original teaching content and Python outcomes without modifying it."""

from __future__ import annotations

import copy
import hashlib
import json
import random
import sys
import types
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from browser.build import shared_source  # noqa: E402
from dock_to_dollar.case_data import (  # noqa: E402
    ACCOUNT_EVENTS,
    COMPANY_NAME,
    DECISIONS,
    OPENING_BALANCES,
    PHASE_LABELS,
    PRODUCT_NAME,
    STATEMENT_QUESTIONS,
)
from dock_to_dollar.engine import (  # noqa: E402
    balances_after,
    final_values,
    format_currency,
    units_after,
)
from dock_to_dollar.progress import (  # noqa: E402
    activity_defaults,
    encode_state,
    record_attempt,
    score_summary,
    snapshot_from_state,
)


class Session(dict):
    def __getattr__(self, key):
        return self[key]

    def __setattr__(self, key, value):
        self[key] = value


class Capture(types.ModuleType):
    def __init__(self):
        super().__init__("streamlit")
        self.session_state = Session()
        self.nodes = []

    def set_page_config(self, **kwargs):
        pass

    def __getattr__(self, name):
        if name in {
            "header",
            "subheader",
            "caption",
            "write",
            "success",
            "warning",
            "info",
        }:
            return lambda text, **kwargs: self.nodes.append(
                {"kind": name, "text": str(text).replace(r"\$", "$")}
            )
        raise AttributeError(name)

    def markdown(self, text, unsafe_allow_html=False):
        self.nodes.append(
            {
                "kind": "html" if unsafe_allow_html else "markdown",
                "text": text.replace(r"\$", "$"),
            }
        )

    def button(self, label, **kwargs):
        self.nodes.append(
            {
                "kind": "button",
                "label": label,
                "primary": kwargs.get("type") == "primary",
            }
        )
        return False

    def radio(self, label, options, index=None, **kwargs):
        self.nodes.append(
            {"kind": "radio", "label": label.replace(r"\$", "$"), "key": kwargs["key"]}
        )
        return options[index] if index is not None else None

    def progress(self, value, text):
        self.nodes.append({"kind": "progress", "value": value, "text": text})


def generate():
    capture = Capture()
    old = sys.modules.get("streamlit")
    sys.modules["streamlit"] = capture
    namespace = {"__name__": "dock_content_export"}
    try:
        exec(
            compile(shared_source(), str(ROOT / "streamlit_app.py"), "exec"), namespace
        )
    finally:
        if old is None:
            sys.modules.pop("streamlit", None)
        else:
            sys.modules["streamlit"] = old

    def screen(function, state):
        capture.session_state = Session(copy.deepcopy(state))
        capture.nodes = []
        namespace[function]()
        return copy.deepcopy(capture.nodes)

    initial = activity_defaults()
    initial["dd_shuffle_seed"] = 34107
    hero = screen("render_hero", initial)
    screens = [{"variants": {"unanswered": screen("render_briefing", initial)}}]
    for index, item in enumerate(DECISIONS):
        variants = {}
        for variant in ("unanswered", "wrong", "correct"):
            state = copy.deepcopy(initial)
            state.update(
                dd_page=1,
                dd_decision_index=index,
                dd_responses={d.id: d.correct for d in DECISIONS[:index]},
            )
            if variant != "unanswered":
                state["dd_responses"][item.id] = (
                    item.correct
                    if variant == "correct"
                    else next(a for a in item.options if a != item.correct)
                )
            variants[variant] = screen("render_decision_stage", state)
        screens.append({"variants": variants})
    trail = copy.deepcopy(initial)
    trail.update(
        dd_page=2,
        dd_decision_index=len(DECISIONS) - 1,
        dd_responses={d.id: d.correct for d in DECISIONS},
    )
    variants = {"unanswered": screen("render_closeout", trail)}
    for variant in ("wrong", "correct"):
        state = copy.deepcopy(trail)
        state["dd_statement_submitted"] = True
        state["dd_statement_responses"] = {
            q.id: q.correct
            if variant == "correct"
            else next(a for a in q.options if a != q.correct)
            for q in STATEMENT_QUESTIONS
        }
        variants[variant] = screen("render_closeout", state)
    screens.append({"variants": variants})
    complete = copy.deepcopy(trail)
    complete.update(
        dd_page=3,
        dd_statement_submitted=True,
        dd_statement_responses={q.id: q.correct for q in STATEMENT_QUESTIONS},
    )
    for item in DECISIONS:
        record_attempt(complete, f"decision:{item.id}", True)
    for item in STATEMENT_QUESTIONS:
        record_attempt(complete, f"statement:{item.id}", True)
    screens.append({"variants": {"unanswered": screen("render_completion", complete)}})
    data = {
        "company": COMPANY_NAME,
        "product": PRODUCT_NAME,
        "phases": PHASE_LABELS,
        "opening": OPENING_BALANCES,
        "events": [asdict(e) for e in ACCOUNT_EVENTS],
        "decisions": [asdict(d) for d in DECISIONS],
        "questions": [asdict(q) for q in STATEMENT_QUESTIONS],
        "hero": hero,
        "screens": screens,
    }
    content = (
        "// Generated from the preserved Dock to Dollar Python teaching content.\nexport const DATA = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n"
    )
    (HERE / "content.js").write_text(content)
    (HERE / "original.css").write_text(
        namespace["APP_CSS"]
        .strip()
        .removeprefix("<style>")
        .removesuffix("</style>")
        .strip()
        + "\n"
    )

    bookmarks = []

    def bookmark(name, state, view=None):
        bookmarks.append(
            {
                "name": name,
                "token": encode_state(state),
                "json": json.dumps(
                    snapshot_from_state(state), separators=(",", ":"), sort_keys=True
                ),
                "score": score_summary(state),
                "view": view,
            }
        )

    bookmark("briefing", initial)
    draft = copy.deepcopy(initial)
    draft.update(
        dd_page=1,
        dd_shuffle_seed=2**63 - 1,
        dd_decision_drafts={DECISIONS[0].id: DECISIONS[0].options[-1]},
    )
    bookmark("decision-draft-high-seed", draft)
    wrong = copy.deepcopy(draft)
    wrong["dd_responses"] = {DECISIONS[0].id: DECISIONS[0].options[-1]}
    record_attempt(wrong, f"decision:{DECISIONS[0].id}", False)
    bookmark("wrong-decision", wrong, 0)
    statement_draft = copy.deepcopy(trail)
    statement_draft["dd_statement_drafts"] = {
        STATEMENT_QUESTIONS[0].id: STATEMENT_QUESTIONS[0].correct
    }
    bookmark("statement-draft", statement_draft, 3)
    wrong_statements = copy.deepcopy(trail)
    wrong_statements.update(
        dd_statement_submitted=True,
        dd_statement_responses={q.id: q.options[-1] for q in STATEMENT_QUESTIONS},
    )
    for q in STATEMENT_QUESTIONS:
        record_attempt(wrong_statements, f"statement:{q.id}", False)
    bookmark("wrong-statements", wrong_statements)
    bookmark("completed", complete, 0)
    orders = []
    for seed in (0, 1, 2, 34107, 2**53 + 99, 2**63 - 1):
        for prefix, items in (
            ("decision", DECISIONS),
            ("statement", STATEMENT_QUESTIONS),
        ):
            for item in items:
                salt = f"{prefix}-answer-order:{item.id}"
                digest = hashlib.sha256(f"{seed}:{salt}".encode()).digest()
                options = list(item.options)
                random.Random(int.from_bytes(digest[:8], "big")).shuffle(options)
                if options == list(item.options):
                    options = options[1:] + options[:1]
                orders.append(
                    {
                        "seed": str(seed),
                        "salt": salt,
                        "options": list(item.options),
                        "expected": options,
                    }
                )
    oracle = {
        "balances": [balances_after(i) for i in range(len(ACCOUNT_EVENTS) + 1)],
        "units": [units_after(i) for i in range(len(ACCOUNT_EVENTS) + 1)],
        "final": final_values(),
        "currency": [
            [value, format_currency(value)]
            for value in (-1000, -2.5, -1.5, 0, 0.5, 1.5, 2.5, 10795)
        ],
        "orders": orders,
        "bookmarks": bookmarks,
    }
    (HERE / "tests/python-oracles.json").write_text(json.dumps(oracle, indent=2) + "\n")
    manifest = {
        "source_sha256": {
            path: hashlib.sha256((ROOT / path).read_bytes()).hexdigest()
            for path in (
                "streamlit_app.py",
                "dock_to_dollar/case_data.py",
                "dock_to_dollar/engine.py",
                "dock_to_dollar/progress.py",
            )
        },
        "screens": len(screens),
        "decision_variants": len(DECISIONS) * 3,
        "statement_variants": 3,
        "original_download_controls": 0,
        "original_facilitator_routes": 0,
    }
    (HERE / "tests/content-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n"
    )
    print(json.dumps(manifest))


if __name__ == "__main__":
    generate()
