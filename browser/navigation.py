"""Review navigation without changing the validated, one-way progress snapshot."""

from __future__ import annotations

from collections.abc import MutableMapping
from typing import Any

from dock_to_dollar.case_data import DECISIONS, STATEMENT_QUESTIONS

VIEW_PARAM = "view"
VIEW_KEY = "dd_browser_view"
CLOSEOUT = len(DECISIONS) + 1
COMPLETION = CLOSEOUT + 1


def frontier(state: MutableMapping[str, Any]) -> int:
    page = state["dd_page"]
    if page == 0:
        return 0
    if page == 1:
        return state["dd_decision_index"] + 1
    return CLOSEOUT if page == 2 else COMPLETION


def restore_view(state: MutableMapping[str, Any], raw: object) -> None:
    try:
        view = int(raw) if isinstance(raw, str) else -1
    except ValueError:
        view = -1
    state[VIEW_KEY] = view if 0 <= view <= frontier(state) else frontier(state)


def can_forward(state: MutableMapping[str, Any]) -> bool:
    return state[VIEW_KEY] < frontier(state)


def can_advance(state: MutableMapping[str, Any]) -> bool:
    view = state[VIEW_KEY]
    reached = frontier(state)
    if view != reached:
        return False
    if view == 0:
        return True
    if 1 <= view < CLOSEOUT:
        item = DECISIONS[view - 1]
        return state["dd_responses"].get(item.id) == item.correct
    if view == CLOSEOUT:
        return state["dd_statement_submitted"] and all(
            state["dd_statement_responses"].get(item.id) == item.correct
            for item in STATEMENT_QUESTIONS
        )
    return False


def move(state: MutableMapping[str, Any], direction: int) -> bool:
    """Review reached pages; navigation never advances the saved frontier."""
    if direction not in (-1, 1):
        raise ValueError("Direction must be Back or Forward")
    view = state[VIEW_KEY]
    if direction == -1:
        if view == 0:
            return False
        state[VIEW_KEY] = view - 1
    else:
        if not can_forward(state):
            return False
        state[VIEW_KEY] = view + 1
    state["dd_scroll_to_top"] = True
    return True


def advance(state: MutableMapping[str, Any]) -> bool:
    """The current page's existing Continue/Finish action passes validation."""
    if not can_advance(state):
        return False
    target = state[VIEW_KEY] + 1
    if target < CLOSEOUT:
        state["dd_page"] = 1
        state["dd_decision_index"] = target - 1
    elif target == CLOSEOUT:
        state["dd_page"] = 2
    else:
        state["dd_page"] = 3
    state[VIEW_KEY] = target
    state["dd_scroll_to_top"] = True
    return True


def display_position(view: int) -> tuple[int, int]:
    if view == 0:
        return 0, 0
    if view < CLOSEOUT:
        return 1, view - 1
    return (2 if view == CLOSEOUT else 3), len(DECISIONS) - 1
