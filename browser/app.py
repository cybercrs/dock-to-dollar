"""Stlite entrypoint using the unchanged server renderer and browser navigation."""

from __future__ import annotations

import runpy
from pathlib import Path

import streamlit as st

from browser.navigation import (
    CLOSEOUT,
    VIEW_KEY,
    VIEW_PARAM,
    advance,
    can_forward,
    display_position,
    frontier,
    move,
    restore_view,
)
from dock_to_dollar.progress import (
    reset_saved_progress,
    sync_progress_query,
)

# The build extracts declarations, not the server's top-level execution driver.
# Re-execute declarations each run, as Streamlit does for the original script.
app = runpy.run_path(str(Path(__file__).with_name("shared_app.py")), run_name="browser_renderer")
# runpy returns a copy; functions retain the original global dictionary.
globals_ = app["set_page"].__globals__


def restart() -> None:
    if st.session_state[VIEW_KEY] < frontier(st.session_state):
        return
    reset_saved_progress(st.session_state, st.query_params)
    st.session_state[VIEW_KEY] = 0
    st.query_params[VIEW_PARAM] = "0"
    st.session_state.dd_restore_attempted = True
    st.session_state.dd_scroll_to_top = True


def forward() -> None:
    move(st.session_state, 1)


def advance_current() -> None:
    advance(st.session_state)


def set_page(page: int) -> None:
    # The briefing's existing action resumes the first reached decision.
    if page == 1:
        if frontier(st.session_state) == 0:
            advance_current()
    elif page == 3:
        advance_current()


globals_.update(set_page=set_page, advance_decision=advance_current, restart_activity=restart)
app["initialize_state"]()
if VIEW_KEY not in st.session_state:
    restore_view(st.session_state, st.query_params.get(VIEW_PARAM))

st.markdown(app["APP_CSS"], unsafe_allow_html=True)
st.markdown(
    """
    <style>
    .st-key-browser_navigation button {
        width: 44px; height: 44px; min-width: 44px; min-height: 44px;
        position: relative; padding: 0; border: 1px solid #C5CCD8; border-radius: 6px;
        background: transparent; color: #59677A; box-shadow: none;
    }
    .st-key-browser_navigation button::before {
        content: ""; position: absolute; width: 20px; height: 20px;
        top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: center / contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2359677A' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 12H5m0 0 7-7m-7 7 7 7'/%3E%3C/svg%3E");
    }
    .st-key-browser_forward button::before { transform: translate(-50%, -50%) rotate(180deg); }
    /* Keep the native labels in the accessibility tree, beside decorative icons. */
    .st-key-browser_navigation button p {
        position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
        overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
    }
    .st-key-browser_navigation button:hover:not(:disabled) {
        background: #E6EAF1; color: #14213D; border-color: #A7B2C3;
    }
    .st-key-browser_navigation button:focus-visible {
        outline: 2px solid #003087; outline-offset: 2px;
    }
    .st-key-browser_navigation button:disabled { opacity: 0.55; }
    .st-key-browser_navigation [data-testid="stCaptionContainer"] p {
        color: #59677A; font-size: 0.75rem; margin: 0;
    }
    </style>
    """,
    unsafe_allow_html=True,
)
app["render_hero"]()
view = st.session_state[VIEW_KEY]
reviewing = view < frontier(st.session_state)

with st.sidebar:
    st.header("Dock to Dollar")
    st.write("Progress is saved anonymously in this page's address so a refresh does not erase your work.")
    st.button("Start over", width="stretch", on_click=restart, disabled=reviewing)

with st.container(key="browser_navigation", horizontal=True, horizontal_alignment="right",
                  vertical_alignment="center", gap="xsmall"):
    st.caption(f"Page {view + 1} of {CLOSEOUT + 2}", width="content")
    st.button("Back", width=44, key="browser_back",
              help="Back: review the previous reached page. Earlier pages are read-only.",
              disabled=view == 0, on_click=move, args=(st.session_state, -1))
    st.button("Forward", width=44, key="browser_forward",
              help="Forward: review the next reached page. Use Continue or Finish on your current page.",
              disabled=not can_forward(st.session_state), on_click=forward)
if reviewing:
    st.info("Review only. Return to your current page to continue the activity.")


class ReviewUI:
    """Render saved work without any answer, scoring, reveal, or reset action."""

    def __getattr__(self, name):
        return getattr(st, name)

    def button(self, *args, **kwargs):
        return False

    def radio(self, *args, **kwargs):
        kwargs.update(disabled=True, on_change=None, args=None, kwargs=None)
        return st.radio(*args, **kwargs)

# Project the view only while rendering. Persist only the original canonical
# frontier, keeping every original snapshot validation rule intact.
page, index = st.session_state.dd_page, st.session_state.dd_decision_index
try:
    st.session_state.dd_page, st.session_state.dd_decision_index = display_position(view)
    if reviewing:
        globals_["st"] = ReviewUI()
    app["render_stage_row"]()
    renderer = ("render_briefing", "render_decision_stage", "render_closeout", "render_completion")
    app[renderer[st.session_state.dd_page]]()
finally:
    st.session_state.dd_page, st.session_state.dd_decision_index = page, index
    sync_progress_query(st.session_state, st.query_params)
    if st.query_params.get(VIEW_PARAM) != str(st.session_state[VIEW_KEY]):
        st.query_params[VIEW_PARAM] = str(st.session_state[VIEW_KEY])

app["render_scroll_reset"]()
