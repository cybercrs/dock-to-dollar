# Dock to Dollar validation — October 14, 2026

Source branch: `native/dock-to-dollar`. Preserved source baseline: `8a0f25a2bff6f9f1eacbc8ab132ababc94974c87`. Preserved main: `929496a1430ce8ba2ae18edc1afb3fe14332349c`. Existing static root: `80067eb6a77b6eba7f5f6c8974389301f8c7747c`.

| Check | Result | Evidence |
| --- | --- | --- |
| Original unit/AppTest and browser-navigation tests | Passed, 32 | `review/unit.log` |
| Native engine, calculations, saved links and Python shuffle parity | Passed, 8 groups, including 84 shuffle cases | `review/parity.log`, `tests/python-oracles.json` |
| Chromium rendered UI and URLs | Passed, 14 scenarios | `review/browser-results.json` |
| Every decision's unanswered/wrong/correct content and statement variants | Passed | Generated `content.js`; full browser routes |
| Student title, metadata and rendered branding audit | Passed, 117 rendered-page checks | Browser and Node checks |
| Ruff, Python compilation, JavaScript syntax, whitespace | Passed | Local checks and source CI |
| External assets, Python/Wasm loading, browser execution errors | None | Captured browser requests and errors |
| Hosted HTTPS UI, school device matrix, classroom capacity | Not run | Existing environment proxy blocks Pages; no alternate route used |

The two rendered routes produced 12/14 first-pass correct with exactly two revisions, and 0/14 with exactly fourteen revisions. Correct and unchanged statement answers earned no duplicate attempts. Completed legacy bookmarks restored a perfect-score route. Final values match Python: Cash $8,145; Inventory $2,650 and 53 bottles; Net Income $795; Total Assets $10,795. All event prefixes, final statement fields, currency formatting, and seeded answer orders match their Python oracles.

Repeated Back/Forward review preserved the complete snapshot. Earlier pages exposed no inputs, submission, revision, reveal, or reset actions. Forward stayed disabled at the current step, including after correct submissions. Financial statements remained hidden until all three connections were correct. Invalid tokens, incomplete/future work, invalid score values, future views, and oversized decompressed snapshots were rejected or safely restored to the valid frontier. Drafts and exact option order survived refresh, copied earlier-view bookmarks, and new tabs. Separate contexts and tabs stayed independent; reset generated a new seed, cleared all work, and left prior bookmarks usable. Native version-4 extended attempt histories also survived refresh.

Keyboard review uses accessible Back/Forward names, decorative SVG icons, native titles, visible focus, and Enter activation. Screenshots were inspected at 1280×900 and 390×844; 44-pixel arrow controls stayed on one row and the page had no horizontal overflow. Dock contains no original downloads or facilitator route, so there are none to migrate.

The application consists of six uncompressed assets totaling **210,550 bytes** (about 206 KiB), plus the small build manifest. This count excludes source, tests, evidence, and the separately preserved static root. A fresh Chromium 151.0.7922.173 context with empty cache on local HTTP reached a rendered and URL-saved briefing in **0.5332 seconds** while unit checks also ran. The timer began immediately before navigation and excluded browser launch. No network throttling, hosted HTTPS transport, student hardware, or concurrent classroom load was measured. This observation is not a network-speed or capacity promise.

Python is used only for content export, test oracles, and packaging. Shipped assets contain no framework runtime or external libraries. Export reproducibility and byte-identical original source protection are checked before publication. Publication adds only `/js/` to the existing `stlite-preview` branch, preserving every pre-existing root file and Pages settings. Exact source/deployment commits and GitHub CI/Pages runs are reported after remote verification.
