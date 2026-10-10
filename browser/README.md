# Dock to Dollar browser pilot

This pilot runs the activity entirely in the learner's browser. Serve the generated static directory over HTTP or HTTPS. No Python server, login, database, or central grade store is needed.

The server application, its Python dependencies, and its deployment configuration are unchanged. The build extracts the existing renderer declarations from `streamlit_app.py` and packages them with a separate browser entrypoint. It fails if the expected server driver is no longer identifiable, so future changes require a compatibility review.

## Build and preview in the saved cloud environment

From `/workspace/dock-to-dollar`:

```bash
PY=/workspace/.cloud-setup/venvs/main/bin/python
"$PY" -m browser.build
"$PY" -m http.server 8765 --bind 127.0.0.1 --directory browser/dist
```

Open `http://127.0.0.1:8765/` in a browser on the environment's host or through an approved development port forward. This loopback address is not a public review URL. Opening `index.html` directly with `file://` is unsupported.

Building downloads the pinned npm archive and runtime assets using certificate-verified HTTPS. All downloads are checked against the committed hashes in `runtime-lock.json`. The resulting `browser/dist/` contains the Python modules, case data, CSS, fonts, JavaScript, WebAssembly, standard library, and dependency wheels needed by the activity. It makes no external asset requests when running.

For an existing verified cache:

```bash
"$PY" -m browser.build \
  --runtime-archive /tmp/dock-stlite-runtime/stlite-browser-1.8.1.tgz \
  --asset-cache browser/test-results/runtime-cache
```

The cached inputs are optional; a fresh network build produces the same runtime assets. Generated output and browser evidence are ignored by Git.

## Runtime compatibility

The pilot pins `@stlite/browser 1.8.1`, its bundled `Streamlit 1.57.0`, `Pyodide 0.29.3`, and the remaining asset hashes. Chromium execution verified Python 3.13.2, `st.iframe`, and `width="stretch"` on that actual runtime. The server retains `streamlit==1.60.0`; that requirement is not installed into stlite.

The official version-specific [stlite documentation](https://github.com/whitphx/stlite/blob/@stlite/browser@1.8.1/README.md) documents `mount()`, virtual files, and a custom `pyodideUrl`. The [1.8.1 release](https://github.com/whitphx/stlite/releases/tag/@stlite%2Fbrowser@1.8.1) and the inspected npm wheel establish the chosen runtime. Older examples within the README show older CDN versions; this build uses the explicit pin and archive integrity instead.

`pyodide-loader.mjs` installs five hashed pure Python wheels before stlite resolves its own dependencies. This is necessary because stlite requests a newer protobuf than the default Pyodide distribution includes. It also fixes the dependency versions and removes runtime PyPI lookups. Packages supplied by Pyodide retain their distribution versions and hashes. A dedicated worker per page provides session isolation.

## Navigation and progress

Use the small boxed **Back** and **Forward** arrows at the upper right, beside the page counter, to move between the briefing, eleven decisions, financial-statement connections, and results. Their tooltips explain review navigation. Native accessible labels, keyboard focus, and 44-pixel touch targets are retained.

- Back revisits earlier pages in a read-only view. Answer inputs and all submission, revision, reveal, and reset controls are unavailable there.
- Forward traverses reached pages only and stops at the learner's actual current page, even when its answer is correct. Use the existing Open, Continue, or Finish action on that current page to advance through normal validation.
- Revise an incorrect answer on the current page with the existing revision control. Correct decisions stay locked, preserving the original reveal and first-pass scoring rules.
- Financial-statement connections allow the original revisions on the current page after an incorrect submission. Completed statements and results remain gated until all three connections are correct; their earlier review pages expose no mutation controls.
- Draft selections survive review navigation, refresh, and bookmarks. Answer order stays stable.
- Start over is available on the current page. It clears answers, drafts, and scoring and generates a new shuffle seed. Previously copied bookmarks still describe their saved game.

The validated `progress` parameter uses the original version-3 schema and records the furthest reached position. A separate, range-checked `view` parameter records the page being reviewed. Temporary rendering of an earlier page never rewinds or overwrites the saved answers. Existing valid Streamlit progress links can be restored after placing their `progress` token on the browser preview's URL.

Activity Back/Forward controls are tested. Browser toolbar history is not an activity navigation contract; use the activity controls and bookmarks for review and resume.

## Tests

```bash
"$PY" -m unittest discover -s tests -v
"$PY" -m py_compile streamlit_app.py dock_to_dollar/*.py browser/*.py tests/*.py
"$PY" -m browser.test_browser
```

The browser test needs Playwright and Chromium, already installed in the saved environment. It tests the actual stlite/Wasm UI with all external traffic blocked by a test-only closed proxy. It records runtime versions, URL snapshots, screenshots, and passed/failed/not-run checks under `browser/test-results/`. Its runtime diagnostics are injected only into the test response.

Lint was run with Ruff 0.14.0. The original and new Python tests can run in ordinary CI using the unchanged server requirements; Playwright is optional and is not added to production dependencies.

## Review and separately hosted preview

See `VALIDATION.md` for test evidence and limits. To prepare a preview after approval, upload the contents of `browser/dist/` to a **separate** static hosting project or preview destination, preserving the directory structure. Serve JavaScript modules, JSON, wheel/ZIP assets, and WebAssembly with standard MIME types over HTTPS. Root and subdirectory hosting are supported.

No publication, push, PR, merge, or deployment is performed by the build. A future preview needs its own URL and a hosted browser check before classroom use; the current Streamlit deployment can continue unchanged.

This is functional validation. Classroom capacity at 40–45 or 80–135 learners has not been measured. Initial downloads and browser memory are material on school networks and older devices; real student devices, simultaneous cold starts, and supported browsers need a separate trial. URL progress and scoring remain suitable for formative practice without a central grade store.
