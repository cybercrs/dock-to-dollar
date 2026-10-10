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
app["render_hero"]()
view = st.session_state[VIEW_KEY]
reviewing = view < frontier(st.session_state)

with st.sidebar:
    st.header("Dock to Dollar")
    st.write("Progress is saved anonymously in this page's address so a refresh does not erase your work.")
    st.button("Start over", width="stretch", on_click=restart, disabled=reviewing)

left, right = st.columns(2)
left.button("Back", width="stretch", disabled=view == 0, on_click=move, args=(st.session_state, -1))
right.button("Forward", width="stretch", disabled=not can_forward(st.session_state), on_click=forward)
st.caption(f"Page {view + 1} of {CLOSEOUT + 2}. Back and Forward review reached pages.")
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
