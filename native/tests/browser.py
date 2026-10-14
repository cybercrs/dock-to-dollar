"""Exercise the complete native app in Chromium with external traffic blocked."""

from __future__ import annotations

import base64
import json
import re
import sys
import threading
import time
import traceback
import urllib.parse
import zlib
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from dock_to_dollar.case_data import DECISIONS, STATEMENT_QUESTIONS  # noqa: E402
from dock_to_dollar.progress import validate_snapshot  # noqa: E402

HERE = ROOT / "native"
RESULTS = HERE / "review"
CLOSEOUT, COMPLETION = len(DECISIONS) + 1, len(DECISIONS) + 2
CHECKS = [
    "Cold native initialization and rendered briefing",
    "Required selection, wrong-answer lock and refresh",
    "Revision, first pass and keyboard review",
    "Drafts, exact order, bookmarks and future-view clamp",
    "All decisions, event balances and current-page gates",
    "Statement reveal, unchanged answers and revisions",
    "Final statements, scoring and complete read-only review",
    "Independent sessions and reset",
    "Legacy links, maximum seed and native refresh",
    "Every wrong/correct lesson variant and all statement hints",
    "Over-99 native attempt history and refresh",
    "Desktop/narrow layout and accessible controls",
    "Canonical /js/ and repository subdirectory hosting",
    "Branding, downloads inventory and no runtime/external errors",
]


def main():
    RESULTS.mkdir(exist_ok=True)
    requests = []

    class Handler(SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_GET(self):
            requests.append(self.path)
            for prefix in ("/dock-to-dollar/js", "/js"):
                if self.path.startswith(prefix + "/"):
                    self.path = self.path[len(prefix) :]
                    break
            super().do_GET()

    server = ThreadingHTTPServer(
        ("127.0.0.1", 0), partial(Handler, directory=str(HERE / "dist"))
    )
    threading.Thread(target=server.serve_forever, daemon=True).start()
    origin = f"http://127.0.0.1:{server.server_port}"
    url = origin + "/js/"
    results = {
        "transport": "local static HTTP; external traffic blocked",
        "checks": [{"name": name, "status": "not-run"} for name in CHECKS],
        "console_errors": [],
        "page_errors": [],
        "external_requests": [],
        "branding_pages": 0,
        "measurement_conditions": "Fresh Chromium context, empty cache, localhost HTTP, no throttling. Timer excludes browser launch and begins before navigation; ends after UI and URL save are ready.",
    }
    active = 0
    oracle = json.loads((HERE / "tests/python-oracles.json").read_text())

    def passed(index):
        results["checks"][index]["status"] = "passed"
        print("PASSED:", CHECKS[index], flush=True)

    def watch(page):
        page.on("pageerror", lambda error: results["page_errors"].append(str(error)))
        page.on(
            "console",
            lambda message: results["console_errors"].append(message.text)
            if message.type == "error"
            else None,
        )
        page.on(
            "request",
            lambda request: results["external_requests"].append(request.url)
            if request.url.startswith("http") and not request.url.startswith(origin)
            else None,
        )
        return page

    def saved(page):
        query = urllib.parse.parse_qs(urllib.parse.urlsplit(page.url).query)
        token = query["progress"][0]
        state = json.loads(
            zlib.decompress(base64.urlsafe_b64decode(token + "=" * (-len(token) % 4)))
        )
        if state["v"] == 3:
            validate_snapshot(state)
        return state

    def at(page, view):
        page.wait_for_function(
            "view => document.documentElement.dataset.ready==='true' && document.documentElement.dataset.saving==='false' && document.documentElement.dataset.view===String(view)",
            arg=view,
            timeout=15000,
        )
        expect(page.locator("#page-counter")).to_have_text(
            f"Page {view + 1} of {COMPLETION + 1}"
        )
        assert page.title() == "Dock to Dollar"
        assert (
            page.get_by_text(
                "This browser could not open the saved activity.", exact=False
            ).count()
            == 0
        )
        assert not re.search(
            r"\b(?:pilot|preview)\b|\btest (?:app|version|site)\b",
            page.locator("body").inner_text(),
            re.I,
        )
        results["branding_pages"] += 1
        return saved(page)

    def choose(page, value):
        page.get_by_role("radio", name=value, exact=True).check()
        page.wait_for_function("document.documentElement.dataset.saving==='false'")

    def button(page, label):
        return page.get_by_role("button", name=label, exact=True)

    def click(page, label):
        button(page, label).click()
        page.wait_for_function("document.documentElement.dataset.saving==='false'")

    def readonly(page):
        expect(page.locator("#review-message")).to_contain_text("Review only.")
        assert page.locator("#lesson input").count() == 0
        assert page.locator("#lesson button").count() == 0
        expect(page.locator("#reset")).to_be_disabled()

    def layout(page, name):
        boxes = [page.locator("#" + key).bounding_box() for key in ("back", "forward")]
        assert all(box["width"] == 44 and box["height"] == 44 for box in boxes)
        assert (
            boxes[0]["y"] == boxes[1]["y"]
            and boxes[0]["x"] > page.viewport_size["width"] / 2
        )
        assert page.evaluate(
            "document.documentElement.scrollWidth <= window.innerWidth"
        )
        for key in ("back", "forward"):
            expect(page.locator("#" + key)).to_have_accessible_name(key.title())
            assert (
                page.locator("#" + key)
                .get_attribute("title")
                .startswith(key.title() + ":")
            )
            assert (
                page.locator("#" + key + " svg").get_attribute("aria-hidden") == "true"
            )
        results.setdefault("layout", {})[name] = boxes

    def shot(page, name):
        page.evaluate("window.scrollTo(0,0)")
        page.screenshot(path=str(RESULTS / name), full_page=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path="/usr/bin/chromium",
            headless=True,
            proxy={"server": "http://127.0.0.1:9", "bypass": "127.0.0.1,localhost"},
        )
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = watch(context.new_page())
        try:
            start = time.monotonic()
            page.goto(url)
            at(page, 0)
            results["cold_initialize_seconds"] = round(time.monotonic() - start, 4)
            results["browser"] = browser.version
            expect(button(page, "Back")).to_be_disabled()
            expect(button(page, "Forward")).to_be_disabled()
            layout(page, "desktop")
            shot(page, "briefing-desktop.png")
            passed(0)

            active = 1
            click(page, "Open the receiving file")
            at(page, 1)
            click(page, "Check the account analysis")
            expect(page.get_by_role("alert")).to_have_text(
                "Choose a response before checking your analysis."
            )
            first = DECISIONS[0]
            wrong = next(value for value in first.options if value != first.correct)
            choose(page, wrong)
            click(page, "Check the account analysis")
            state = at(page, 1)
            expect(
                page.get_by_text(f"Not quite. Hint: {first.hint}", exact=True)
            ).to_be_visible()
            assert page.get_by_role("radio").count() == 0
            expect(button(page, "Forward")).to_be_disabled()
            page.reload()
            assert at(page, 1) == state
            passed(1)

            active = 2
            click(page, "Revise my analysis")
            choose(page, first.correct)
            click(page, "Check the account analysis")
            state = at(page, 1)
            assert (
                state["a"][f"decision:{first.id}"] == 2
                and state["f"][f"decision:{first.id}"] is False
            )
            button(page, "Continue").focus()
            page.keyboard.press("Shift+Tab")
            expect(button(page, "Back")).to_be_focused()
            assert button(page, "Back").evaluate(
                "element => element.matches(':focus-visible')"
            )
            page.keyboard.press("Enter")
            assert at(page, 0) == state
            readonly(page)
            button(page, "Forward").focus()
            page.keyboard.press("Enter")
            assert at(page, 1) == state
            for _ in range(3):
                click(page, "Back")
                assert at(page, 0) == state
                readonly(page)
                click(page, "Forward")
                assert at(page, 1) == state
            expect(button(page, "Forward")).to_be_disabled()
            passed(2)

            active = 3
            click(page, "Continue")
            at(page, 2)
            second = DECISIONS[1]
            choose(page, second.correct)
            state = saved(page)
            order = page.locator("label.choice").all_text_contents()
            click(page, "Back")
            assert at(page, 1) == state
            readonly(page)
            bookmark = page.url
            page.reload()
            assert at(page, 1) == state
            readonly(page)
            clone = watch(context.new_page())
            clone.goto(bookmark)
            assert at(clone, 1) == state
            readonly(clone)
            click(clone, "Forward")
            assert at(clone, 2) == state
            expect(
                clone.get_by_role("radio", name=second.correct, exact=True)
            ).to_be_checked()
            assert clone.locator("label.choice").all_text_contents() == order
            clone.goto(clone.url.replace("view=2", "view=999"))
            assert at(clone, 2) == state
            clone.close()
            click(page, "Forward")
            assert at(page, 2) == state
            passed(3)

            active = 4
            for index, item in enumerate(DECISIONS[1:], start=2):
                choose(page, item.correct)
                click(page, "Check the account analysis")
                at(page, index)
                expect(button(page, "Forward")).to_be_disabled()
                if item.event_id:
                    assert (
                        page.locator(
                            ".account-delta.positive,.account-delta.negative"
                        ).count()
                        > 0
                    )
                click(page, "Continue")
                at(page, index + 1)
            assert at(page, CLOSEOUT)["p"] == 2
            passed(4)

            active = 5
            assert page.locator(".statement-grid").count() == 0
            click(page, "Check the ending financial story")
            expect(page.get_by_role("alert")).to_have_text(
                "Answer all three financial-statement questions before checking the complete story."
            )
            question = STATEMENT_QUESTIONS[0]
            for item in STATEMENT_QUESTIONS:
                choose(
                    page,
                    next(value for value in item.options if value != item.correct)
                    if item == question
                    else item.correct,
                )
            click(page, "Check the ending financial story")
            state = at(page, CLOSEOUT)
            assert page.locator(".statement-grid").count() == 0
            click(page, "Back")
            at(page, CLOSEOUT - 1)
            readonly(page)
            click(page, "Forward")
            assert at(page, CLOSEOUT) == state
            click(page, "Revise the financial-statement connections")
            page.reload()
            at(page, CLOSEOUT)
            choose(page, question.correct)
            click(page, "Check the ending financial story")
            state = at(page, CLOSEOUT)
            assert state["a"][f"statement:{question.id}"] == 2
            assert all(
                state["a"][f"statement:{q.id}"] == 1 for q in STATEMENT_QUESTIONS[1:]
            )
            expect(page.locator(".statement-grid")).to_be_visible()
            passed(5)

            active = 6
            click(page, "Finish the case")
            final = at(page, COMPLETION)
            final_bookmark = page.url
            expect(
                page.get_by_text(
                    "First-pass decisions: 12 of 14 | Practice revisions used: 2 | Final mastery: complete",
                    exact=True,
                )
            ).to_be_visible()
            assert page.locator(".score-box strong").all_text_contents() == [
                "1/2",
                "9/9",
                "2/3",
            ]
            for value in ("$8,145", "$2,650", "$795", "$10,795"):
                assert value in page.locator(".statement-grid").inner_text()
            shot(page, "complete-desktop.png")
            for view in range(COMPLETION - 1, -1, -1):
                click(page, "Back")
                assert at(page, view) == final
                readonly(page)
            shot(page, "review-desktop.png")
            for view in range(1, COMPLETION + 1):
                click(page, "Forward")
                assert at(page, view) == final
            page.reload()
            assert at(page, COMPLETION) == final
            passed(6)

            active = 7
            other = watch(context.new_page())
            other.goto(url)
            independent = at(other, 0)
            assert not independent["r"] and independent["z"] != final["z"]
            other.close()
            isolated_context = browser.new_context()
            isolated = watch(isolated_context.new_page())
            isolated.goto(url)
            assert at(isolated, 0)["z"] != final["z"]
            click(page, "Start over")
            clean = at(page, 0)
            assert not clean["a"] and not clean["r"] and clean["z"] != final["z"]
            page.reload()
            assert at(page, 0) == clean
            isolated.goto(final_bookmark)
            assert at(isolated, COMPLETION) == final
            isolated_context.close()
            passed(7)

            active = 8
            for bookmark in oracle["bookmarks"]:
                query = {"progress": bookmark["token"]}
                expected = json.loads(bookmark["json"])
                reached = (
                    0
                    if expected["p"] == 0
                    else expected["i"] + 1
                    if expected["p"] == 1
                    else CLOSEOUT
                    if expected["p"] == 2
                    else COMPLETION
                )
                view = bookmark["view"] if bookmark["view"] is not None else reached
                query["view"] = str(view)
                page.goto(url + "?" + urllib.parse.urlencode(query))
                assert at(page, view) == expected
                page.reload()
                assert at(page, view) == expected
                if view < reached:
                    readonly(page)
                if bookmark["name"] == "decision-draft-high-seed":
                    order = next(
                        entry
                        for entry in oracle["orders"]
                        if entry["seed"] == str(2**63 - 1)
                        and entry["salt"] == f"decision-answer-order:{first.id}"
                    )
                    assert (
                        page.locator("label.choice").all_text_contents()
                        == order["expected"]
                    )
                    expect(
                        page.get_by_role("radio", name=first.options[-1], exact=True)
                    ).to_be_checked()
            page.goto(url + "?progress=invalid-token&view=999")
            assert at(page, 0)["r"] == {}
            expect(page.get_by_role("alert")).to_contain_text(
                "This saved link could not be restored."
            )
            passed(8)

            active = 9
            click(page, "Open the receiving file")
            for index, item in enumerate(DECISIONS, start=1):
                at(page, index)
                choose(
                    page, next(value for value in item.options if value != item.correct)
                )
                click(page, "Check the account analysis")
                expect(
                    page.get_by_text(f"Not quite. Hint: {item.hint}", exact=True)
                ).to_be_visible()
                assert button(page, "Continue").count() == 0
                click(page, "Revise my analysis")
                choose(page, item.correct)
                click(page, "Check the account analysis")
                expect(
                    page.get_by_text(f"Correct. {item.explanation}", exact=True)
                ).to_be_visible()
                click(page, "Continue")
            at(page, CLOSEOUT)
            for item in STATEMENT_QUESTIONS:
                choose(
                    page, next(value for value in item.options if value != item.correct)
                )
            click(page, "Check the ending financial story")
            at(page, CLOSEOUT)
            for item in STATEMENT_QUESTIONS:
                expect(
                    page.get_by_text(f"Hint: {item.hint}", exact=True)
                ).to_be_visible()
            for index, item in enumerate(STATEMENT_QUESTIONS):
                click(page, "Revise the financial-statement connections")
                choose(page, item.correct)
                click(page, "Check the ending financial story")
                at(page, CLOSEOUT)
                assert page.locator(".statement-grid").count() == (
                    1 if index == len(STATEMENT_QUESTIONS) - 1 else 0
                )
                expect(page.get_by_text(item.explanation, exact=True)).to_be_visible()
            click(page, "Finish the case")
            at(page, COMPLETION)
            expect(
                page.get_by_text(
                    "First-pass decisions: 0 of 14 | Practice revisions used: 14 | Final mastery: complete",
                    exact=True,
                )
            ).to_be_visible()
            passed(9)

            active = 10
            raw = json.loads(
                next(
                    b["json"]
                    for b in oracle["bookmarks"]
                    if b["name"] == "wrong-decision"
                )
            )
            raw["a"][f"decision:{first.id}"] = 99
            token = (
                base64.urlsafe_b64encode(zlib.compress(json.dumps(raw).encode()))
                .decode()
                .rstrip("=")
            )
            page.goto(
                url + "?" + urllib.parse.urlencode({"progress": token, "view": "1"})
            )
            at(page, 1)
            click(page, "Revise my analysis")
            choose(page, first.correct)
            click(page, "Check the account analysis")
            state = at(page, 1)
            assert state["v"] == 4 and state["a"][f"decision:{first.id}"] == 100
            page.reload()
            assert at(page, 1) == state
            passed(10)

            active = 11
            page.set_viewport_size({"width": 390, "height": 844})
            layout(page, "narrow")
            shot(page, "decision-narrow.png")
            click(page, "Back")
            at(page, 0)
            readonly(page)
            shot(page, "review-narrow.png")
            page.goto(final_bookmark)
            at(page, COMPLETION)
            assert page.evaluate(
                "document.documentElement.scrollWidth <= window.innerWidth"
            )
            shot(page, "complete-narrow.png")
            passed(11)

            active = 12
            page.set_viewport_size({"width": 1280, "height": 900})
            page.goto(origin + "/dock-to-dollar/js/")
            at(page, 0)
            click(page, "Open the receiving file")
            at(page, 1)
            page.reload()
            at(page, 1)
            assert urllib.parse.urlsplit(page.url).path == "/dock-to-dollar/js/"
            passed(12)

            active = 13
            assert page.locator("#lesson [download]").count() == 0
            assert (
                not results["page_errors"]
                and not results["console_errors"]
                and not results["external_requests"]
            )
            assert not any(
                any(
                    part in path
                    for part in (".whl", ".wasm", "pyodide", "streamlit", "stlite")
                )
                for path in requests
            )
            assert len({path.split("?")[0] for path in requests}) <= 12
            passed(13)
        except Exception:
            results["checks"][active].update(
                status="failed", error=traceback.format_exc()
            )
            results["body_on_failure"] = page.locator("body").inner_text()
            shot(page, "failure.png")
        browser.close()
    server.shutdown()
    results["requests"] = sorted(set(requests))
    (RESULTS / "browser-results.json").write_text(json.dumps(results, indent=2) + "\n")
    print(
        json.dumps(
            {key: value for key, value in results.items() if key != "requests"},
            indent=2,
        ),
        flush=True,
    )
    return int(any(check["status"] != "passed" for check in results["checks"]))


if __name__ == "__main__":
    raise SystemExit(main())
