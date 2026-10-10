# Browser pilot validation — 2026-10-10

All final checks below completed after the strict navigation clarification: past pages are read-only, and Forward stops at the learner's actual current step.

Branch: `pilot/stlite-browser-navigation`. Source baseline: `929496a1430ce8ba2ae18edc1afb3fe14332349c`.

## Final results

| Check | Result | Evidence |
| --- | --- | --- |
| Existing server tests plus browser navigation tests | **Passed: 32** | `test-results/unit.log` |
| Actual Chromium/stlite/Wasm UI | **Passed: 13 checks** | `test-results/browser-results.json` |
| Ruff 0.14.0, all repository Python | **Passed** | `test-results/lint.log` |
| Python compilation and JavaScript module syntax | **Passed** | `test-results/compile.log`, `test-results/javascript.log` |
| Git whitespace check | **Passed** | `test-results/whitespace.log` |
| Fresh network build, pinned hashes, reproducibility | **Passed; byte-identical to tested output** | `test-results/bundle-checks.json`, `test-results/bundle-files-sha256.json` |
| ZIP integrity | **Passed** | `test-results/dock-to-dollar-stlite-pilot.zip` |
| Final failures | **None** | Final runs above |
| Real device and browser matrix; hosted HTTPS preview; classroom peak/load trial | **Not run** | Requires separately approved hosting and classroom devices |

Actual browser runtime: stlite 1.8.1, Streamlit 1.57.0, Pyodide 0.29.3, Python 3.13.2. The browser run used local static files with all external network traffic blocked. It reported zero external asset requests, zero console errors, and zero page execution errors. It exercised `st.iframe`, stretch buttons, and the actual rendered financial statements.

## Strict navigation evidence

- Reviewed pages exposed only the activity's Back/Forward controls. Answer inputs, submission, revision, reveal, and per-page reset controls were unavailable. The sidebar reset was disabled; its callback also refuses resets during review.
- Forward stayed disabled on the actual current page, including after a correct decision. Only the original validated Open, Continue, and Finish actions advanced the saved position.
- Repeated navigation and a complete round trip from results to briefing and back preserved the validated progress snapshot and attempt history exactly.
- A bookmarked earlier view remained read-only after refresh and in another tab. A future `view=999` with valid progress was clamped to the actual current step. Invalid progress returned to a new briefing.
- Incorrect responses and hints survived refresh. Current-page revisions were permitted; all earlier completed work remained locked.
- Decision and statement drafts and answer order survived navigation, refresh, and bookmarks. Statement results remained hidden until all three connections were correct.
- The scripted two mistakes produced exactly 12/14 first-pass correct answers and two revisions. Unchanged correct statement answers earned no extra attempts.
- Separate tabs in the same browser context and separate browser contexts started independently. Start over on the current results page cleared scoring and answers; refresh preserved the new game. An old bookmark could still resume its saved game.
- Rendered balances reconciled to Cash $8,145, Inventory $2,650, Net Income $795, and Total Assets $10,795. The 390-pixel viewport showed both navigation buttons without horizontal overflow.
- Static hosting at both the root and `/pilot/` worked through navigation and refresh.

Screenshots are available in `test-results/briefing.png`, `locked-decision.png`, `completed.png`, and `narrow.png`.

## Deliverable and limits

The static directory contains 242 files totaling 59,020,546 bytes (about 56.3 MiB). The ZIP is 31,362,440 bytes. SHA-256:

```text
5a1cc2033e7d71436cfad3db3aa3b76e2a24d0c9a7c955a206a74dd067eeb914
```

The latest cloud browser run took 61.5 seconds to its first rendered page while repository tests were running concurrently. Earlier functional runs took roughly 15–18 seconds. These are uncontrolled cloud timings, not classroom performance measurements. The initial download, Python startup, and browser memory need testing on actual learner devices and school networks. No capacity claim is made for 40–45 or 80–135 simultaneous learners.

Development failures from direct CDN certificate transport, PyPI protobuf resolution, hidden-radio test locators, and URL/DOM timing were resolved by packaging local hashed assets, bootstrapping pinned wheels, and waiting for rendered UI. Final verification uses the direct local bundle without certificate exceptions or asset relays.

`streamlit_app.py`, `dock_to_dollar/`, `requirements.txt`, `.streamlit/`, and `.github/` remain byte-identical to the source baseline. All other repository working trees were checked and are clean. No push, PR, merge, external deployment, credentials, or security changes occurred. No environment blocker remains.

After review approval, upload the existing bundle to a separate static preview destination, preserving its directory structure, and repeat the hosted browser check. The live Streamlit deployment can continue unchanged. Activity Back/Forward controls are the supported navigation interface; browser toolbar history is not an activity navigation contract.
