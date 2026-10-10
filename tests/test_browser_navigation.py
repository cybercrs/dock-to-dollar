import tempfile
import unittest
from pathlib import Path

from streamlit.testing.v1 import AppTest

from browser.build import app_files, shared_source
from browser.navigation import (
    CLOSEOUT,
    COMPLETION,
    VIEW_KEY,
    advance,
    can_forward,
    frontier,
    move,
    restore_view,
)
from dock_to_dollar.case_data import DECISIONS, STATEMENT_QUESTIONS
from dock_to_dollar.progress import activity_defaults, decode_snapshot, encode_state, score_summary
from tests.test_app_flow import button


class NavigationTests(unittest.TestCase):
    def test_review_preserves_snapshot_and_blocks_unresolved_forward(self):
        state = activity_defaults()
        restore_view(state, None)
        self.assertFalse(move(state, -1))
        self.assertFalse(move(state, 1))
        self.assertTrue(advance(state))
        self.assertFalse(move(state, 1))
        self.assertFalse(advance(state))
        state["dd_responses"][DECISIONS[0].id] = DECISIONS[0].correct
        self.assertFalse(move(state, 1))
        self.assertTrue(advance(state))
        before = encode_state(state)
        for _ in range(10):
            self.assertTrue(move(state, -1))
            self.assertTrue(move(state, -1))
            self.assertFalse(advance(state))
            self.assertTrue(move(state, 1))
            self.assertTrue(move(state, 1))
            self.assertFalse(move(state, 1))
            self.assertEqual(encode_state(state), before)
            self.assertIsNotNone(decode_snapshot(before))

    def test_invalid_or_future_view_cannot_unlock_content(self):
        state = activity_defaults()
        state["dd_page"] = 1
        for raw in (None, "-1", "99", "bad", "1.2", "9" * 5000):
            restore_view(state, raw)
            self.assertEqual(state[VIEW_KEY], 1)
            self.assertFalse(can_forward(state))
        restore_view(state, "0")
        self.assertEqual(state[VIEW_KEY], 0)
        self.assertEqual(frontier(state), 1)

    def test_statement_completion_gate_and_repeat_review(self):
        state = activity_defaults()
        state.update(dd_page=2, dd_decision_index=len(DECISIONS) - 1,
                     dd_responses={d.id: d.correct for d in DECISIONS})
        restore_view(state, None)
        self.assertEqual(state[VIEW_KEY], CLOSEOUT)
        self.assertFalse(move(state, 1))
        state["dd_statement_responses"] = {q.id: q.correct for q in STATEMENT_QUESTIONS}
        self.assertFalse(move(state, 1))
        state["dd_statement_submitted"] = True
        self.assertFalse(move(state, 1))
        self.assertTrue(advance(state))
        self.assertEqual(state[VIEW_KEY], COMPLETION)
        self.assertFalse(move(state, 1))
        before = encode_state(state)
        for _ in range(COMPLETION):
            self.assertTrue(move(state, -1))
        self.assertEqual(state[VIEW_KEY], 0)
        self.assertEqual(encode_state(state), before)
        self.assertIsNotNone(decode_snapshot(before))


class BrowserRendererTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.root = Path(self.directory.name)
        for name, content in app_files().items():
            target = self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)
        self.entry = str(self.root / "browser" / "app.py")
        self.app = AppTest.from_file(self.entry, default_timeout=60).run()

    def tearDown(self):
        self.directory.cleanup()

    def snapshot(self):
        raw = self.app.query_params["progress"]
        saved = decode_snapshot(raw[0] if isinstance(raw, list) else raw)
        self.assertIsNotNone(saved)
        self.assertFalse(self.app.exception)
        return saved

    def test_wrong_revision_draft_review_refresh_and_reset(self):
        app = self.app
        button(app, "Open the receiving file").click().run()
        self.assertTrue(button(app, "Forward").disabled)
        first = DECISIONS[0]
        wrong = next(answer for answer in first.options if answer != first.correct)
        app.radio(key=f"widget_decision_{first.id}").set_value(wrong).run()
        button(app, "Back").click().run()
        button(app, "Forward").click().run()
        self.assertEqual(app.radio[0].value, wrong)
        button(app, "Check the account analysis").click().run()
        self.assertTrue(button(app, "Forward").disabled)
        self.assertIn(first.hint, "\n".join(w.value for w in app.warning))
        button(app, "Revise my analysis").click().run()
        app.radio[0].set_value(first.correct)
        button(app, "Check the account analysis").click().run()
        self.assertTrue(button(app, "Forward").disabled)
        button(app, "Continue").click().run()
        app.radio[0].set_value(DECISIONS[1].correct).run()
        before = self.snapshot()
        button(app, "Back").click().run()
        self.assertFalse(app.radio)  # Correct answers remain locked.
        reviewed = self.snapshot()
        self.assertEqual(reviewed, before)
        clone = AppTest.from_file(self.entry, default_timeout=60)
        clone.query_params.update(app.query_params)
        clone.run()
        self.assertFalse(clone.exception)
        self.assertEqual(clone.session_state[VIEW_KEY], 1)
        button(clone, "Forward").click().run()
        self.assertEqual(clone.radio[0].value, DECISIONS[1].correct)
        self.assertEqual(score_summary(clone.session_state.filtered_state)["revisions"], 1)
        button(clone, "Start over").click().run()
        self.assertEqual(clone.session_state.dd_page, 0)
        self.assertEqual(clone.session_state[VIEW_KEY], 0)
        self.assertEqual(clone.session_state.dd_responses, {})
        self.assertEqual(clone.session_state.dd_attempts, {})

    def test_complete_case_review_does_not_duplicate_attempts_or_reveal_early(self):
        app = self.app
        button(app, "Open the receiving file").click().run()
        for item in DECISIONS:
            app.radio[0].set_value(item.correct)
            button(app, "Check the account analysis").click().run()
            button(app, "Continue").click().run()
        self.assertTrue(button(app, "Forward").disabled)
        for item in STATEMENT_QUESTIONS:
            app.radio(key=f"widget_statement_{item.id}").set_value(item.correct)
        button(app, "Check the ending financial story").click().run()
        button(app, "Finish the case").click().run()
        saved = self.snapshot()
        for _ in range(COMPLETION):
            button(app, "Back").click().run()
            self.assertEqual(self.snapshot(), saved)
            self.assertFalse(app.radio)
            self.assertTrue(button(app, "Start over").disabled)
            self.assertEqual({b.label for b in app.button}, {"Back", "Forward", "Start over"})
        for _ in range(COMPLETION):
            button(app, "Forward").click().run()
            self.assertEqual(self.snapshot(), saved)
        self.assertTrue(button(app, "Forward").disabled)
        self.assertEqual(score_summary(app.session_state.filtered_state)["revisions"], 0)
        self.assertTrue(any("Case complete" in alert.value for alert in app.success))

    def test_separate_sessions_and_legacy_snapshot(self):
        button(self.app, "Open the receiving file").click().run()
        other = AppTest.from_file(self.entry, default_timeout=60).run()
        self.assertEqual(other.session_state.dd_page, 0)
        self.assertNotEqual(other.session_state.dd_shuffle_seed, self.app.session_state.dd_shuffle_seed)
        old = activity_defaults()
        old["dd_page"] = 1
        old["dd_decision_drafts"] = {DECISIONS[0].id: DECISIONS[0].correct}
        restored = AppTest.from_file(self.entry, default_timeout=60)
        restored.query_params["progress"] = encode_state(old)
        restored.query_params["view"] = "100"
        restored.run()
        self.assertEqual(restored.session_state[VIEW_KEY], 1)
        self.assertEqual(restored.radio[0].value, DECISIONS[0].correct)
        self.assertFalse(restored.exception)

    def test_generated_renderer_preserves_original_declarations(self):
        self.assertIn('def render_decision_stage()', shared_source())
        self.assertNotIn('\ninitialize_state()\n', shared_source())

    def test_restored_completed_bookmark_has_no_review_mutations(self):
        state = activity_defaults()
        state.update(dd_page=3, dd_decision_index=len(DECISIONS) - 1,
                     dd_responses={d.id: d.correct for d in DECISIONS},
                     dd_statement_responses={q.id: q.correct for q in STATEMENT_QUESTIONS},
                     dd_statement_submitted=True)
        restored = AppTest.from_file(self.entry, default_timeout=60)
        restored.query_params["progress"] = encode_state(state)
        restored.query_params["view"] = str(CLOSEOUT)
        restored.run()
        self.assertFalse(restored.exception)
        self.assertFalse(restored.radio)
        self.assertEqual({b.label for b in restored.button}, {"Back", "Forward", "Start over"})
        self.assertTrue(button(restored, "Start over").disabled)
        button(restored, "Forward").click().run()
        self.assertEqual(restored.session_state[VIEW_KEY], COMPLETION)
        self.assertTrue(button(restored, "Forward").disabled)
        self.assertEqual(restored.session_state.dd_responses, state["dd_responses"])

    def test_forward_never_advances_current_even_when_answer_is_correct(self):
        app = self.app
        self.assertTrue(button(app, "Forward").disabled)
        button(app, "Open the receiving file").click().run()
        app.radio[0].set_value(DECISIONS[0].correct)
        button(app, "Check the account analysis").click().run()
        self.assertTrue(button(app, "Forward").disabled)
        self.assertEqual(app.session_state.dd_decision_index, 0)
        button(app, "Continue").click().run()
        self.assertEqual(app.session_state.dd_decision_index, 1)


if __name__ == "__main__":
    unittest.main()
