import re
import unittest

from streamlit.testing.v1 import AppTest

from dock_to_dollar.case_data import DECISIONS, STATEMENT_QUESTIONS
from dock_to_dollar.progress import SNAPSHOT_PARAM, decode_snapshot


def button(app: AppTest, label: str):
    return next(item for item in app.button if item.label == label)


class PerfectMerchandiseFlowTests(unittest.TestCase):
    def test_complete_case_reaches_debrief_with_allowed_reasoning_only(self):
        app = AppTest.from_file("streamlit_app.py", default_timeout=60).run()
        self.assertFalse(app.exception)
        opening_caption = "\n".join(item.value for item in app.caption)
        self.assertIn("Common Stock", opening_caption)
        self.assertIn(r"\$10,000 cash", opening_caption)
        button(app, "Open the receiving file").click().run()

        for item in DECISIONS:
            app.radio(key=f"widget_decision_{item.id}").set_value(item.correct)
            button(app, "Check the account analysis").click().run()
            button(app, "Continue").click().run()

        for item in STATEMENT_QUESTIONS:
            app.radio(key=f"widget_statement_{item.id}").set_value(item.correct)
        button(app, "Check the ending financial story").click().run()
        button(app, "Finish the case").click().run()

        self.assertFalse(app.exception)
        self.assertTrue(any("Case complete" in item.value for item in app.success))
        rendered = "\n".join(item.value for item in app.markdown).lower()
        self.assertIn("final mastery: complete", "\n".join(item.value for item in app.caption).lower())
        self.assertIn("balance sheet", rendered)
        self.assertIn("common stock", rendered)
        self.assertIn("retained earnings", rendered)
        self.assertIn("total liabilities and stockholders' equity", rendered)
        for banned in (r"\bdebits?\b", r"\bjournal\b", r"\bledger\b", r"\bposting\b"):
            self.assertIsNone(re.search(banned, rendered), banned)
        removed_labels = (
            f"{'acc'} {202}",
            f"{'chapter'} {7:02d}",
            f"{'chapter'} {7}",
            "day" + "pack",
        )
        for removed in removed_labels:
            self.assertNotIn(removed, rendered)

        saved_value = app.query_params[SNAPSHOT_PARAM]
        saved = decode_snapshot(saved_value[0] if isinstance(saved_value, list) else saved_value)
        self.assertIsNotNone(saved)
        self.assertEqual(saved["dd_page"], 3)
        self.assertEqual(len(saved["dd_responses"]), len(DECISIONS))
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

    def test_running_board_shows_all_accounts_and_event_changes(self):
        app = AppTest.from_file("streamlit_app.py", default_timeout=60).run()
        button(app, "Open the receiving file").click().run()

        ownership = DECISIONS[0]
        app.radio(key=f"widget_decision_{ownership.id}").set_value(ownership.correct)
        button(app, "Check the account analysis").click().run()
        button(app, "Continue").click().run()

        purchase = DECISIONS[1]
        app.radio(key=f"widget_decision_{purchase.id}").set_value(purchase.correct)
        button(app, "Check the account analysis").click().run()
        rendered = "\n".join(item.value for item in app.markdown)
        for account in (
            "Cash",
            "Accounts Receivable",
            "Inventory",
            "Accounts Payable",
            "Common Stock",
            "Sales Revenue",
            "Sales Returns and Allowances",
            "Sales Discounts",
            "Cost of Goods Sold",
            "Freight-Out Expense",
        ):
            self.assertIn(account, rendered)
        self.assertGreaterEqual(rendered.count("+$5,000"), 2)
        self.assertIn("account-delta positive", rendered)

    def test_wrong_decision_shows_only_a_hint_before_revision(self):
        app = AppTest.from_file("streamlit_app.py", default_timeout=60).run()
        button(app, "Open the receiving file").click().run()
        item = DECISIONS[0]
        wrong = next(option for option in item.options if option != item.correct)
        app.radio(key=f"widget_decision_{item.id}").set_value(wrong)
        button(app, "Check the account analysis").click().run()

        warning_text = "\n".join(alert.value for alert in app.warning)
        self.assertIn(item.hint, warning_text)
        self.assertNotIn(item.correct, warning_text)
        self.assertNotIn("Best analysis", warning_text)
        self.assertFalse(app.info)
        rendered = "\n".join(item.value for item in app.markdown)
        self.assertNotIn("account-delta positive", rendered)
        self.assertIsNotNone(button(app, "Revise my analysis"))

    def test_statement_labels_escape_currency_and_wrong_feedback_uses_hints(self):
        app = AppTest.from_file("streamlit_app.py", default_timeout=60).run()
        button(app, "Open the receiving file").click().run()
        for decision in DECISIONS:
            app.radio(key=f"widget_decision_{decision.id}").set_value(decision.correct)
            button(app, "Check the account analysis").click().run()
            button(app, "Continue").click().run()

        cash_question = next(item for item in app.radio if "income effect different" in item.label)
        self.assertIn(r"\$795", cash_question.label)
        self.assertIn(r"\$1,855", cash_question.label)

        first = STATEMENT_QUESTIONS[0]
        wrong = next(option for option in first.options if option != first.correct)
        app.radio(key=f"widget_statement_{first.id}").set_value(wrong)
        for item in STATEMENT_QUESTIONS[1:]:
            app.radio(key=f"widget_statement_{item.id}").set_value(item.correct)
        button(app, "Check the ending financial story").click().run()

        rendered = "\n".join(item.value for item in app.markdown)
        self.assertIn(first.hint, rendered)
        self.assertNotIn("Best analysis", rendered)
        self.assertNotIn(first.correct, rendered)


if __name__ == "__main__":
    unittest.main()
