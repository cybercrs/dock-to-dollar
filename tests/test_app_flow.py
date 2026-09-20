import re
import unittest

from streamlit.testing.v1 import AppTest

from dock_to_dollar.case_data import CLOSEOUT_FIELDS, DECISIONS, STATEMENT_QUESTIONS
from dock_to_dollar.engine import final_values
from dock_to_dollar.progress import SNAPSHOT_PARAM, decode_snapshot


def button(app: AppTest, label: str):
    return next(item for item in app.button if item.label == label)


class PerfectMerchandiseFlowTests(unittest.TestCase):
    def test_complete_case_reaches_debrief_with_allowed_reasoning_only(self):
        app = AppTest.from_file("streamlit_app.py", default_timeout=60).run()
        self.assertFalse(app.exception)
        button(app, "Open the receiving file").click().run()

        for item in DECISIONS:
            app.radio(key=f"widget_decision_{item.id}").set_value(item.correct)
            button(app, "Check the account analysis").click().run()
            button(app, "Continue").click().run()

        expected = final_values()
        for key, _label in CLOSEOUT_FIELDS:
            app.number_input(key=f"widget_closeout_{key}").set_value(expected[key])
        for item in STATEMENT_QUESTIONS:
            app.radio(key=f"widget_statement_{item.id}").set_value(item.correct)
        button(app, "Check the ending financial story").click().run()
        button(app, "Finish the case").click().run()

        self.assertFalse(app.exception)
        self.assertTrue(any("Case complete" in item.value for item in app.success))
        rendered = "\n".join(item.value for item in app.markdown).lower()
        self.assertIn("final mastery: complete", "\n".join(item.value for item in app.caption).lower())
        for banned in (r"\bdebits?\b", r"\bjournal\b", r"\bledger\b", r"\bposting\b"):
            self.assertIsNone(re.search(banned, rendered), banned)

        saved_value = app.query_params[SNAPSHOT_PARAM]
        saved = decode_snapshot(saved_value[0] if isinstance(saved_value, list) else saved_value)
        self.assertIsNotNone(saved)
        self.assertEqual(saved["dd_page"], 3)
        self.assertEqual(len(saved["dd_responses"]), len(DECISIONS))
        self.assertEqual(saved["dd_closeout_responses"]["inventory"], 2_650)
        self.assertEqual(
            saved["dd_statement_responses"],
            {item.id: item.correct for item in STATEMENT_QUESTIONS},
        )

    def test_unsubmitted_decision_draft_is_saved_in_the_url(self):
        app = AppTest.from_file("streamlit_app.py", default_timeout=60).run()
        button(app, "Open the receiving file").click().run()
        first = DECISIONS[0]
        app.radio(key=f"widget_decision_{first.id}").set_value(first.options[-1]).run()

        saved_value = app.query_params[SNAPSHOT_PARAM]
        saved = decode_snapshot(saved_value[0] if isinstance(saved_value, list) else saved_value)
        self.assertIsNotNone(saved)
        self.assertEqual(saved["dd_decision_drafts"][first.id], first.options[-1])


if __name__ == "__main__":
    unittest.main()
