"""Exercise the actual stlite/Wasm UI with Playwright (optional local tooling)."""

from __future__ import annotations

import argparse
import json
import threading
import time
import traceback
import urllib.parse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

from browser.navigation import CLOSEOUT, COMPLETION
from dock_to_dollar.case_data import DECISIONS, STATEMENT_QUESTIONS
from dock_to_dollar.progress import decode_snapshot, score_summary

ROOT = Path(__file__).resolve().parents[1]


CHECKS = (
    "Actual Wasm UI and runtime versions", "Required selection and wrong-answer lock",
    "Revision and first-pass score", "Strict read-only Back/Forward through current step",
    "Drafts, stable answer order, refresh, and bookmark resume",
    "All 11 decisions and event balances", "Statement reveal gate and revisions",
    "Final results and full review", "Independent sessions and reset/new game",
    "Invalid progress and future view rejected", "Narrow viewport rendering",
    "Static hosting under a subdirectory", "No external assets or execution errors",
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dist", type=Path, default=ROOT / "browser" / "dist")
    parser.add_argument("--results", type=Path, default=ROOT / "browser" / "test-results")
    parser.add_argument("--chromium", default="/usr/bin/chromium")
    args = parser.parse_args()
    args.results.mkdir(parents=True, exist_ok=True)
    requests = []

    class Handler(SimpleHTTPRequestHandler):
        def log_message(self, *values):
            pass

        def do_GET(self):
            requests.append(self.path)
            if self.path.startswith("/pilot/"):
                self.path = self.path[len("/pilot"):]
            if self.path == "/favicon.ico":
                self.send_response(204)
                self.end_headers()
            elif self.path == "/app.json":
                config = json.loads((args.dist / "app.json").read_text())
                config["files"]["browser/app.py"] += '\nimport sys, json, pyodide\nprint("BROWSER_VERSIONS=" + json.dumps({"python": sys.version.split()[0], "streamlit": st.__version__, "pyodide": pyodide.__version__, "iframe": hasattr(st, "iframe")}))\n'
                payload = json.dumps(config).encode()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            else:
                super().do_GET()

    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Handler, directory=str(args.dist)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}"
    results = {"transport": "local static files; external traffic blocked by test proxy",
        "checks": [{"name": name, "status": "not-run"} for name in CHECKS],
        "console_errors": [], "page_errors": [], "external_requests": []}
    active = 0

    def passed(index):
        results["checks"][index]["status"] = "passed"
        print("PASSED:", CHECKS[index], flush=True)

    def wait_state(page, predicate, timeout=20):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            assert page.locator('[data-testid="stException"]').count() == 0
            query = urllib.parse.parse_qs(urllib.parse.urlsplit(page.url).query)
            state = decode_snapshot(query.get("progress", [None])[0])
            view = query.get("view", [None])[0]
            idle = page.locator('[data-test-script-state="notRunning"]').count() > 0
            if state is not None and idle and predicate(state, view):
                return state
            page.wait_for_timeout(50)
        raise AssertionError(f"Expected saved progress not rendered: {page.url}")

    def at_view(page, view):
        state = wait_state(page, lambda state, raw: raw == str(view))
        visible(page, f"Page {view + 1} of {CLOSEOUT + 2}. Back and Forward review reached pages.")
        return state

    def click(page, label):
        page.locator("[data-testid=stMain]").get_by_role("button", name=label, exact=True).click()

    def select(page, answer):
        radio = page.get_by_role("radio", name=answer, exact=True)
        page.locator("label").filter(has=radio).click()

    def disabled(page, label):
        from playwright.sync_api import expect
        expect(page.get_by_role("button", name=label, exact=True)).to_be_disabled()

    def visible(page, text):
        page.get_by_text(text, exact=True).wait_for(timeout=15000)

    def loaded(page):
        page.get_by_role("button", name="Back", exact=True).wait_for(timeout=120000)

    def readonly(page):
        visible(page, "Review only. Return to your current page to continue the activity.")
        assert page.get_by_role("radio").count() == 0
        buttons = page.locator("[data-testid=stMain]").get_by_role("button").all_text_contents()
        assert buttons == ["Back", "Forward"], buttons
        disabled(page, "Start over")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=args.chromium, headless=True,
            proxy={"server": "http://127.0.0.1:9", "bypass": "127.0.0.1,localhost"})
        context = browser.new_context(viewport={"width": 1280, "height": 900})

        def watch(page):
            page.on("pageerror", lambda e: results["page_errors"].append(str(e)))
            def console(message):
                if message.text.startswith("BROWSER_VERSIONS="):
                    results["runtime"] = json.loads(message.text.split("=", 1)[1])
                if message.type == "error":
                    results["console_errors"].append(message.text)
            page.on("console", console)
            page.on("request", lambda r: results["external_requests"].append(r.url)
                    if r.url.startswith("http") and not r.url.startswith(url) else None)
            return page

        page = watch(context.new_page())
        try:
            start = time.monotonic()
            page.goto(url, wait_until="domcontentloaded")
            loaded(page)
            at_view(page, 0)
            results["initial_render_seconds"] = round(time.monotonic() - start, 2)
            disabled(page, "Back")
            disabled(page, "Forward")
            assert results["runtime"]["streamlit"] == "1.57.0"
            assert results["runtime"]["pyodide"] == "0.29.3"
            assert results["runtime"]["iframe"]
            page.screenshot(path=str(args.results / "briefing.png"), full_page=True)
            passed(0)

            active = 1
            click(page, "Open the receiving file")
            at_view(page, 1)
            disabled(page, "Forward")
            click(page, "Check the account analysis")
            visible(page, "Choose a response before checking your analysis.")
            first = DECISIONS[0]
            wrong = next(a for a in first.options if a != first.correct)
            select(page, wrong)
            click(page, "Check the account analysis")
            wait_state(page, lambda s, v: s["dd_responses"].get(first.id) == wrong)
            disabled(page, "Forward")
            visible(page, f"Not quite. Hint: {first.hint}")
            failed_attempt = at_view(page, 1)
            page.reload(wait_until="domcontentloaded")
            loaded(page)
            assert at_view(page, 1) == failed_attempt
            visible(page, f"Not quite. Hint: {first.hint}")
            passed(1)

            active = 2
            click(page, "Revise my analysis")
            select(page, first.correct)
            click(page, "Check the account analysis")
            state = wait_state(page, lambda s, v: s["dd_responses"].get(first.id) == first.correct)
            assert state["dd_attempts"][f"decision:{first.id}"] == 2
            assert state["dd_first_pass"][f"decision:{first.id}"] is False
            disabled(page, "Forward")
            passed(2)

            active = 3
            for _ in range(3):
                click(page, "Back")
                at_view(page, 0)
                readonly(page)
                click(page, "Forward")
                assert at_view(page, 1) == state
                assert page.get_by_role("radio").count() == 0
            page.screenshot(path=str(args.results / "locked-decision.png"), full_page=True)
            passed(3)

            active = 4
            click(page, "Continue")
            at_view(page, 2)
            second = DECISIONS[1]
            select(page, second.correct)
            saved = wait_state(page, lambda s, v: s["dd_decision_drafts"].get(second.id) == second.correct)
            order = page.locator('[data-testid="stRadio"] label').all_text_contents()
            click(page, "Back")
            at_view(page, 1)
            readonly(page)
            bookmark = page.url
            page.reload(wait_until="domcontentloaded")
            loaded(page)
            assert at_view(page, 1) == saved
            readonly(page)
            clone = watch(context.new_page())
            clone.goto(bookmark, wait_until="domcontentloaded")
            loaded(clone)
            assert at_view(clone, 1) == saved
            readonly(clone)
            click(clone, "Forward")
            assert at_view(clone, 2) == saved
            assert clone.get_by_role("radio", name=second.correct, exact=True).is_checked()
            assert clone.locator('[data-testid="stRadio"] label').all_text_contents() == order
            disabled(clone, "Forward")
            clone.goto(clone.url.replace("view=2", "view=999"), wait_until="domcontentloaded")
            loaded(clone)
            assert at_view(clone, 2) == saved
            disabled(clone, "Forward")
            clone.close()
            click(page, "Forward")
            at_view(page, 2)
            assert page.get_by_role("radio", name=second.correct, exact=True).is_checked()
            passed(4)

            active = 5
            for index, item in enumerate(DECISIONS[1:], start=2):
                select(page, item.correct)
                click(page, "Check the account analysis")
                wait_state(page, lambda s, v: s["dd_responses"].get(item.id) == item.correct)
                page.get_by_role("button", name="Continue", exact=True).wait_for()
                if item.event_id:
                    assert page.locator(".account-delta.positive,.account-delta.negative").count() > 0
                click(page, "Continue")
                at_view(page, index + 1)
            state = at_view(page, CLOSEOUT)
            assert state["dd_page"] == 2 and len(state["dd_responses"]) == len(DECISIONS)
            passed(5)

            active = 6
            disabled(page, "Forward")
            assert page.locator(".statement-grid").count() == 0
            question = STATEMENT_QUESTIONS[0]
            statement_wrong = next(a for a in question.options if a != question.correct)
            for item in STATEMENT_QUESTIONS:
                select(page, statement_wrong if item == question else item.correct)
            click(page, "Check the ending financial story")
            state = wait_state(page, lambda s, v: s["dd_statement_submitted"])
            assert page.locator(".statement-grid").count() == 0
            disabled(page, "Forward")
            visible(page, f"Hint: {question.hint}")
            click(page, "Back")
            at_view(page, CLOSEOUT - 1)
            click(page, "Forward")
            assert at_view(page, CLOSEOUT) == state
            click(page, "Revise the financial-statement connections")
            assert page.get_by_role("radio", name=statement_wrong, exact=True).is_checked()
            select(page, question.correct)
            click(page, "Check the ending financial story")
            state = wait_state(page, lambda s, v: s["dd_statement_responses"].get(question.id) == question.correct and s["dd_statement_submitted"])
            assert state["dd_attempts"][f"statement:{question.id}"] == 2
            assert all(state["dd_attempts"][f"statement:{q.id}"] == 1 for q in STATEMENT_QUESTIONS[1:])
            page.locator(".statement-grid").wait_for()
            passed(6)

            active = 7
            click(page, "Finish the case")
            state = at_view(page, COMPLETION)
            assert score_summary(state) == {"correct": 12, "attempted": 14, "total": 14, "revisions": 2}
            visible(page, "First-pass decisions: 12 of 14 | Practice revisions used: 2 | Final mastery: complete")
            assert "$10,795" in page.locator(".statement-grid").inner_text()
            assert "$8,145" in page.locator(".statement-grid").inner_text()
            page.screenshot(path=str(args.results / "completed.png"), full_page=True)
            final_bookmark = page.url
            for target in range(COMPLETION - 1, -1, -1):
                click(page, "Back")
                assert at_view(page, target) == state
                readonly(page)
            for target in range(1, COMPLETION + 1):
                click(page, "Forward")
                assert at_view(page, target) == state
            disabled(page, "Forward")
            page.reload(wait_until="domcontentloaded")
            loaded(page)
            assert at_view(page, COMPLETION) == state
            passed(7)

            active = 8
            same_context = watch(context.new_page())
            same_context.goto(url, wait_until="domcontentloaded")
            loaded(same_context)
            isolated = at_view(same_context, 0)
            assert isolated["dd_responses"] == {} and isolated["dd_attempts"] == {}
            assert isolated["dd_shuffle_seed"] != state["dd_shuffle_seed"]
            same_context.close()
            other_context = browser.new_context()
            other = watch(other_context.new_page())
            other.goto(url, wait_until="domcontentloaded")
            loaded(other)
            clean = at_view(other, 0)
            assert clean["dd_responses"] == {} and clean["dd_attempts"] == {}
            assert clean["dd_shuffle_seed"] != state["dd_shuffle_seed"]
            click(page, "Start over")
            reset = at_view(page, 0)
            assert reset["dd_responses"] == {} and reset["dd_attempts"] == {}
            assert reset["dd_shuffle_seed"] != state["dd_shuffle_seed"]
            page.reload(wait_until="domcontentloaded")
            loaded(page)
            assert at_view(page, 0) == reset
            other.goto(final_bookmark, wait_until="domcontentloaded")
            loaded(other)
            assert at_view(other, COMPLETION) == state
            other_context.close()
            passed(8)

            active = 9
            page.goto(url + "/?progress=invalid-token&view=999", wait_until="domcontentloaded")
            loaded(page)
            assert at_view(page, 0)["dd_responses"] == {}
            passed(9)

            active = 10
            page.set_viewport_size({"width": 390, "height": 844})
            click(page, "Open the receiving file")
            at_view(page, 1)
            assert page.get_by_role("button", name="Back", exact=True).is_visible()
            assert page.get_by_role("button", name="Forward", exact=True).is_visible()
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
            page.screenshot(path=str(args.results / "narrow.png"), full_page=True)
            passed(10)

            active = 11
            page.set_viewport_size({"width": 1280, "height": 900})
            page.goto(url + "/pilot/", wait_until="domcontentloaded")
            loaded(page)
            at_view(page, 0)
            click(page, "Open the receiving file")
            at_view(page, 1)
            assert urllib.parse.urlsplit(page.url).path == "/pilot/"
            page.reload(wait_until="domcontentloaded")
            loaded(page)
            at_view(page, 1)
            passed(11)

            active = 12
            assert results["page_errors"] == [], results["page_errors"]
            assert results["console_errors"] == [], results["console_errors"]
            assert results["external_requests"] == [], results["external_requests"]
            assert all(not path.startswith("/_stcore/") for path in requests)
            passed(12)
        except Exception:
            results["checks"][active].update(status="failed", error=traceback.format_exc())
            results["body_on_failure"] = page.locator("body").inner_text()
            page.screenshot(path=str(args.results / "failure.png"), full_page=True)
        browser.close()
    server.shutdown()
    results["static_requests"] = sorted(set(requests))
    (args.results / "browser-results.json").write_text(json.dumps(results, indent=2) + "\n")
    print(json.dumps({k: v for k, v in results.items() if k != "static_requests"}, indent=2), flush=True)
    return 1 if any(c["status"] != "passed" for c in results["checks"]) else 0


if __name__ == "__main__":
    raise SystemExit(main())
