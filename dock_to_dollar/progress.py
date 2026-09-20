"""Compact, validated, non-identifying progress snapshots."""

from __future__ import annotations

import base64
import json
import secrets
import zlib
from collections.abc import MutableMapping
from typing import Any

from dock_to_dollar.case_data import CLOSEOUT_FIELDS, DECISIONS, STATEMENT_QUESTIONS
from dock_to_dollar.engine import final_values


SNAPSHOT_PARAM = "progress"
SNAPSHOT_VERSION = 2
MAX_TOKEN_LENGTH = 12_000
MAX_JSON_BYTES = 24_000


def activity_defaults() -> dict[str, Any]:
    return {
        "dd_page": 0,
        "dd_decision_index": 0,
        "dd_shuffle_seed": secrets.randbits(63),
        "dd_decision_drafts": {},
        "dd_responses": {},
        "dd_closeout_drafts": {},
        "dd_closeout_responses": {},
        "dd_statement_drafts": {},
        "dd_statement_responses": {},
        "dd_closeout_submitted": False,
        "dd_attempts": {},
        "dd_first_pass": {},
    }


def _encode(payload: dict[str, Any]) -> str:
    raw = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    compressed = zlib.compress(raw, level=9)
    return base64.urlsafe_b64encode(compressed).decode("ascii").rstrip("=")


def _decode(token: str) -> object:
    padding = "=" * (-len(token) % 4)
    compressed = base64.b64decode(token + padding, altchars=b"-_", validate=True)
    decompressor = zlib.decompressobj()
    raw = decompressor.decompress(compressed, MAX_JSON_BYTES + 1)
    if len(raw) > MAX_JSON_BYTES or decompressor.unconsumed_tail:
        raise ValueError("Snapshot is too large")
    raw += decompressor.flush(MAX_JSON_BYTES + 1 - len(raw))
    if len(raw) > MAX_JSON_BYTES or decompressor.unused_data:
        raise ValueError("Snapshot is invalid")
    return json.loads(raw.decode("utf-8"))


def _answer_prefix(raw: object) -> dict[str, str]:
    if not isinstance(raw, dict):
        raise ValueError("Answers must be an object")
    ids = [item.id for item in DECISIONS]
    if set(raw) != set(ids[: len(raw)]):
        raise ValueError("Answers must follow the activity order")
    normalized = {}
    for item in DECISIONS[: len(raw)]:
        value = raw[item.id]
        if not isinstance(value, str) or value not in item.options:
            raise ValueError("Unknown answer")
        normalized[item.id] = value
    return normalized


def _decision_drafts(raw: object) -> dict[str, str]:
    if not isinstance(raw, dict):
        raise ValueError("Decision drafts must be an object")
    decisions = {item.id: item for item in DECISIONS}
    if set(raw) - set(decisions):
        raise ValueError("Unknown decision draft")
    normalized = {}
    for item_id, value in raw.items():
        if not isinstance(value, str) or value not in decisions[item_id].options:
            raise ValueError("Invalid decision draft")
        normalized[item_id] = value
    return normalized


def _validate_closeout(raw: object, submitted: bool) -> dict[str, int]:
    if not isinstance(raw, dict):
        raise ValueError("Closeout answers must be an object")
    valid_keys = {key for key, _label in CLOSEOUT_FIELDS}
    if set(raw) - valid_keys:
        raise ValueError("Unknown closeout field")
    if submitted and set(raw) != valid_keys:
        raise ValueError("Submitted closeout is incomplete")
    normalized = {}
    for key, value in raw.items():
        if type(value) is not int or not 0 <= value <= 10_000_000:
            raise ValueError("Invalid closeout amount")
        normalized[key] = value
    return normalized


def _validate_statement_answers(raw: object, submitted: bool) -> dict[str, str]:
    if not isinstance(raw, dict):
        raise ValueError("Statement answers must be an object")
    questions = {item.id: item for item in STATEMENT_QUESTIONS}
    if set(raw) - set(questions):
        raise ValueError("Unknown statement question")
    if submitted and set(raw) != set(questions):
        raise ValueError("Submitted statement answers are incomplete")
    normalized = {}
    for item_id, value in raw.items():
        if not isinstance(value, str) or value not in questions[item_id].options:
            raise ValueError("Invalid statement answer")
        normalized[item_id] = value
    return normalized


def _valid_score_keys() -> set[str]:
    keys = {f"decision:{item.id}" for item in DECISIONS}
    keys |= {f"closeout:{key}" for key, _label in CLOSEOUT_FIELDS}
    keys |= {f"statement:{item.id}" for item in STATEMENT_QUESTIONS}
    return keys


def validate_snapshot(raw: object) -> dict[str, Any]:
    expected_keys = {"v", "p", "i", "z", "d", "r", "cd", "c", "qd", "q", "cs", "a", "f"}
    if not isinstance(raw, dict) or set(raw) != expected_keys or raw["v"] != SNAPSHOT_VERSION:
        raise ValueError("Unsupported snapshot")

    page = raw["p"]
    if type(page) is not int or not 0 <= page <= 3:
        raise ValueError("Invalid page")

    index = raw["i"]
    if type(index) is not int or not 0 <= index < len(DECISIONS):
        raise ValueError("Invalid decision index")

    shuffle_seed = raw["z"]
    if type(shuffle_seed) is not int or not 0 <= shuffle_seed < 2**63:
        raise ValueError("Invalid shuffle seed")

    decision_drafts = _decision_drafts(raw["d"])
    responses = _answer_prefix(raw["r"])
    submitted = raw["cs"]
    if type(submitted) is not bool:
        raise ValueError("Invalid closeout status")
    closeout_drafts = _validate_closeout(raw["cd"], False)
    closeout = _validate_closeout(raw["c"], submitted)
    statement_drafts = _validate_statement_answers(raw["qd"], False)
    statements = _validate_statement_answers(raw["q"], submitted)

    if not isinstance(raw["a"], dict) or not isinstance(raw["f"], dict):
        raise ValueError("Invalid score history")
    valid_score_keys = _valid_score_keys()
    attempts = {}
    for key, value in raw["a"].items():
        if key not in valid_score_keys or type(value) is not int or not 1 <= value <= 99:
            raise ValueError("Invalid attempt history")
        attempts[key] = value
    first_pass = {}
    for key, value in raw["f"].items():
        if key not in valid_score_keys or type(value) is not bool:
            raise ValueError("Invalid first-pass history")
        first_pass[key] = value

    if page == 0 and (decision_drafts or responses):
        raise ValueError("Briefing cannot contain event work")
    if page >= 2:
        if len(responses) != len(DECISIONS):
            raise ValueError("Event trail is incomplete")
        if any(responses[item.id] != item.correct for item in DECISIONS):
            raise ValueError("Event trail contains an unresolved answer")
    if page < 2 and (closeout_drafts or closeout or statement_drafts or statements or submitted):
        raise ValueError("Closeout work cannot appear early")
    if page == 3:
        expected = final_values()
        if not submitted or any(closeout.get(key) != expected[key] for key, _label in CLOSEOUT_FIELDS):
            raise ValueError("Completed closeout is unresolved")
        if any(statements.get(item.id) != item.correct for item in STATEMENT_QUESTIONS):
            raise ValueError("Completed statement reasoning is unresolved")

    for item in DECISIONS[: max(0, index)]:
        if responses.get(item.id) != item.correct:
            raise ValueError("A prior decision is unresolved")
    if page == 1 and len(responses) not in {index, index + 1}:
        raise ValueError("Decision position is inconsistent")
    allowed_drafts = {item.id for item in DECISIONS[: index + 1]} if page == 1 else {item.id for item in DECISIONS}
    if set(decision_drafts) - allowed_drafts:
        raise ValueError("Future decision draft is not allowed")
    if page >= 2 and index != len(DECISIONS) - 1:
        raise ValueError("Completed event trail has an invalid position")

    return {
        "dd_page": page,
        "dd_decision_index": index,
        "dd_shuffle_seed": shuffle_seed,
        "dd_decision_drafts": decision_drafts,
        "dd_responses": responses,
        "dd_closeout_drafts": closeout_drafts,
        "dd_closeout_responses": closeout,
        "dd_statement_drafts": statement_drafts,
        "dd_statement_responses": statements,
        "dd_closeout_submitted": submitted,
        "dd_attempts": attempts,
        "dd_first_pass": first_pass,
    }


def snapshot_from_state(state: MutableMapping[str, Any]) -> dict[str, Any]:
    return {
        "v": SNAPSHOT_VERSION,
        "p": state["dd_page"],
        "i": state["dd_decision_index"],
        "z": state["dd_shuffle_seed"],
        "d": state["dd_decision_drafts"],
        "r": state["dd_responses"],
        "cd": state["dd_closeout_drafts"],
        "c": state["dd_closeout_responses"],
        "qd": state["dd_statement_drafts"],
        "q": state["dd_statement_responses"],
        "cs": state["dd_closeout_submitted"],
        "a": state["dd_attempts"],
        "f": state["dd_first_pass"],
    }


def encode_state(state: MutableMapping[str, Any]) -> str:
    return _encode(snapshot_from_state(state))


def decode_snapshot(token: object) -> dict[str, Any] | None:
    if not isinstance(token, str) or not token or len(token) > MAX_TOKEN_LENGTH:
        return None
    try:
        return validate_snapshot(_decode(token))
    except (ValueError, TypeError, UnicodeDecodeError, json.JSONDecodeError, zlib.error):
        return None


def restore_session_state(state: MutableMapping[str, Any], token: object) -> bool:
    restored = decode_snapshot(token)
    if restored is None:
        return False
    state.update(restored)
    return True


def sync_progress_query(state: MutableMapping[str, Any], query_params: MutableMapping[str, Any]) -> None:
    token = encode_state(state)
    current = query_params.get(SNAPSHOT_PARAM)
    if isinstance(current, list):
        current = current[0] if current else None
    if current != token:
        query_params[SNAPSHOT_PARAM] = token


def reset_saved_progress(state: MutableMapping[str, Any], query_params: MutableMapping[str, Any]) -> None:
    for key in list(state):
        if key.startswith("dd_") or key.startswith("widget_"):
            del state[key]
    state.update(activity_defaults())
    query_params[SNAPSHOT_PARAM] = encode_state(state)


def record_attempt(state: MutableMapping[str, Any], score_key: str, correct: bool) -> None:
    attempts = dict(state["dd_attempts"])
    first_pass = dict(state["dd_first_pass"])
    attempts[score_key] = attempts.get(score_key, 0) + 1
    if score_key not in first_pass:
        first_pass[score_key] = bool(correct)
    state["dd_attempts"] = attempts
    state["dd_first_pass"] = first_pass


def score_summary(state: MutableMapping[str, Any]) -> dict[str, int]:
    first_pass = state.get("dd_first_pass", {})
    total = len(_valid_score_keys())
    attempted = len(first_pass)
    correct = sum(1 for value in first_pass.values() if value)
    revisions = sum(max(0, value - 1) for value in state.get("dd_attempts", {}).values())
    return {
        "correct": correct,
        "attempted": attempted,
        "total": total,
        "revisions": revisions,
    }
