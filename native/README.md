# Dock to Dollar

The student application uses HTML, CSS, and JavaScript at `/js/`. It has no Python, Streamlit, Pyodide, WebAssembly, third-party browser dependencies, account, or central storage. Its original lesson content is exported from the preserved Python renderer, while guarded native controls handle choices, scoring, navigation, and URL saves.

From the repository root:

```bash
PY=/workspace/.cloud-setup/venvs/main/bin/python
"$PY" native/export.py
node --test native/tests/*.test.mjs
"$PY" native/build.py
"$PY" -m http.server 8765 --bind 127.0.0.1 --directory native/dist
```

Open the local HTTP server through the environment's supported browser or port forward. Opening `index.html` with `file://` is unsupported. To verify actual Chromium rendering, run `"$PY" native/tests/browser.py`; it uses the environment's Playwright and `/usr/bin/chromium`, blocks external requests, and writes evidence to `native/review/`.

The six shipped assets are listed and hashed by the build manifest. `native/build.py --site-output PATH` adds only `PATH/js/`; it never modifies the existing site root or deployment settings. The source branch is `native/dock-to-dollar`. Original Python files, server requirements, Streamlit configuration, existing workflows, and the original static root are preserved.

## Learning and navigation

All eleven decisions, three statement connections, explanations, hints, account deltas, statements, scoring categories, merchandising chain, and team debrief are retained. Earlier pages are strictly read-only, including reset. The subtle Back/Forward arrows review only earned pages; Forward stops at the current page even after a correct answer. The existing Open, Continue, and Finish actions advance only after their original validation. Correct answers remain locked. Incorrect answers permit the original revisions, and unchanged statement answers do not accumulate extra attempts.

Dock has no original facilitator route or download control. No Receivables teaching changes, new downloads, or facilitator shortcuts are introduced.

## Saved links

The `progress` parameter retains the original compressed version-3 schema. The separate `view` parameter remains bounded by earned progress. Legacy Python and browser links can be opened in this application by preserving their query string on `/js/`; the original URL continues to use the original application. No redirects or automatic path rewrites are added. Ordinary native version-3 links can likewise be restored in the original application using their query string.

The exact 63-bit seed uses BigInt and a CPython-compatible seeded shuffle, preserving the original option order even above JavaScript's safe integer range. Draft choices, submitted answers, locks, score history, and the current review page survive refresh and copied links. Pages are independent; this application uses neither localStorage nor shared session storage. Old bookmarks retain their saved game after a reset.

The original validator rejects counters above 99 even though its attempt recorder can exceed that limit. Native work stays version 3 until an attempt count reaches 100, when the same fields use version 4 to retain complete scoring and native resume. These extended-history links are supported by the native application; the unchanged original version-3 application cannot restore them. No seed, answer, or score is silently truncated.

Supported browser features are JavaScript modules, Web Crypto, BigInt, structuredClone, and Compression/Decompression Streams. Chromium is tested; the full school device/browser matrix remains untested.

The compression and CPython shuffle patterns follow the accepted [native Receivables implementation](https://github.com/cybercrs/the-receivables-challenge/blob/a9dd736614db779b75389222ed8c251dc4d8db8f/native-pilot/engine.js). Dock's content, calculations, and assessment rules remain its own.
