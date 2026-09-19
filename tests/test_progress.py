import base64
import json
import unittest
import zlib

from dock_to_dollar.case_data import CLOSEOUT_FIELDS, DECISIONS
from dock_to_dollar.engine import final_values
from dock_to_dollar.progress import (
    SNAPSHOT_PARAM,
    activity_defaults,
    decode_snapshot,
    encode_state,
    record_attempt,
    reset_saved_progress,
    restore_session_state,
    score_summary,
)


def encode_raw(payload):
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    return base64.urlsafe_b64encode(zlib.compress(raw)).decode("ascii").rstrip("=")


def completed_state():
    state = activity_defaults()
    state["dd_page"] = 3
    state["dd_decision_index"] = len(DECISIONS) - 1
    state["dd_responses"] = {item.id: item.correct for item in DECISIONS}
    state["dd_closeout_responses"] = final_values()
    state["dd_closeout_submitted"] = True
    return state


class ProgressSnapshotTests(unittest.TestCase):
    def test_round_trip_completed_progress(self):
        state = completed_state()
        for item in DECISIONS:
            record_attempt(state, f"decision:{item.id}", True)
        token = encode_state(state)
        restored = decode_snapshot(token)
        self.assertIsNotNone(restored)
        self.assertEqual(restored["dd_page"], 3)
        self.assertEqual(restored["dd_closeout_responses"]["income_effect"], 795)
        self.assertNotIn("name", token.lower())
        self.assertNotIn("email", token.lower())

    def test_current_incorrect_response_can_be_restored_for_revision(self):
        state = activity_defaults()
        state["dd_page"] = 1
        first = DECISIONS[0]
        state["dd_responses"] = {first.id: first.options[-1]}
        record_attempt(state, f"decision:{first.id}", False)
        restored = decode_snapshot(encode_state(state))
        self.assertIsNotNone(restored)
        self.assertEqual(restored["dd_attempts"][f"decision:{first.id}"], 1)
        self.assertFalse(restored["dd_first_pass"][f"decision:{first.id}"])

    def test_skipping_event_trail_is_rejected(self):
        state = activity_defaults()
        state["dd_page"] = 2
        self.assertIsNone(decode_snapshot(encode_state(state)))

    def test_tampered_completed_amount_is_rejected(self):
        state = completed_state()
        raw = {
            "v": 1,
            "p": 3,
            "i": len(DECISIONS) - 1,
            "r": state["dd_responses"],
            "c": dict(state["dd_closeout_responses"], inventory=2_750),
            "cs": True,
            "a": {},
            "f": {},
        }
        self.assertIsNone(decode_snapshot(encode_raw(raw)))

    def test_malformed_and_oversized_tokens_are_rejected(self):
        self.assertIsNone(decode_snapshot("not-a-valid-token"))
        self.assertIsNone(decode_snapshot("x" * 12_001))

    def test_restore_and_reset(self):
        destination = {}
        self.assertTrue(restore_session_state(destination, encode_state(completed_state())))
        self.assertEqual(destination["dd_page"], 3)

        query = {}
        reset_saved_progress(destination, query)
        self.assertEqual(destination["dd_page"], 0)
        self.assertEqual(destination["dd_responses"], {})
        self.assertIn(SNAPSHOT_PARAM, query)
        self.assertIsNotNone(decode_snapshot(query[SNAPSHOT_PARAM]))

    def test_score_summary_tracks_first_pass_and_revisions(self):
        state = activity_defaults()
        record_attempt(state, "decision:ownership_inbound", False)
        record_attempt(state, "decision:ownership_inbound", True)
        record_attempt(state, "decision:purchase_effect", True)
        score = score_summary(state)
        self.assertEqual(score["attempted"], 2)
        self.assertEqual(score["correct"], 1)
        self.assertEqual(score["revisions"], 1)

    def test_closeout_schema_matches_case_values(self):
        self.assertEqual(
            {key for key, _label in CLOSEOUT_FIELDS},
            set(final_values()),
        )


if __name__ == "__main__":
    unittest.main()
