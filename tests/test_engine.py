import re
import unittest

from dock_to_dollar.case_data import ACCOUNT_EVENTS, CLOSEOUT_FIELDS, DECISIONS, OPENING_BALANCES
from dock_to_dollar.engine import (
    balances_after,
    evaluate_closeout,
    evaluate_decision,
    event_position,
    final_values,
    format_currency,
    units_after,
)


class DockToDollarCalculationTests(unittest.TestCase):
    def test_purchase_cycle_reconciles_to_eighty_units_at_four_thousand_dollars(self):
        balances = balances_after(event_position("purchase_discount"))
        self.assertEqual(units_after(event_position("purchase_discount")), 80)
        self.assertEqual(balances["Inventory"], 4_000)
        self.assertEqual(balances["Accounts Payable"], 0)
        self.assertEqual(balances["Cash"], 6_000)

    def test_sale_records_both_customer_and_merchandise_effects(self):
        balances = balances_after(event_position("sale"))
        self.assertEqual(units_after(event_position("sale")), 50)
        self.assertEqual(balances["Accounts Receivable"], 2_700)
        self.assertEqual(balances["Sales Revenue"], 2_700)
        self.assertEqual(balances["Inventory"], 2_500)
        self.assertEqual(balances["Cost of Goods Sold"], 1_500)

    def test_final_accounts_and_statement_effects_reconcile(self):
        balances = balances_after()
        expected_balances = {
            "Cash": 8_145,
            "Accounts Receivable": 0,
            "Inventory": 2_650,
            "Accounts Payable": 0,
            "Sales Revenue": 2_700,
            "Sales Returns and Allowances": 450,
            "Sales Discounts": 45,
            "Cost of Goods Sold": 1_350,
            "Freight-Out Expense": 60,
        }
        self.assertEqual(balances, expected_balances)
        self.assertEqual(units_after(), 53)
        self.assertEqual(
            final_values(),
            {
                "cash": 8_145,
                "accounts_receivable": 0,
                "inventory": 2_650,
                "accounts_payable": 0,
                "net_sales": 2_205,
                "cost_of_goods_sold": 1_350,
                "freight_out_expense": 60,
                "income_effect": 795,
            },
        )

    def test_every_event_preserves_nonnegative_key_balances_and_units(self):
        for event_count in range(len(ACCOUNT_EVENTS) + 1):
            balances = balances_after(event_count)
            for account in ("Cash", "Accounts Receivable", "Inventory", "Accounts Payable"):
                self.assertGreaterEqual(balances[account], 0, (event_count, account))
            self.assertGreaterEqual(units_after(event_count), 0)

    def test_decision_keys_cover_the_complete_chapter_chain(self):
        ids = {item.id for item in DECISIONS}
        self.assertEqual({item.phase for item in DECISIONS}, {0, 1, 2, 3, 4})
        for required in (
            "ownership_inbound",
            "purchase_effect",
            "freight_in_effect",
            "purchase_return_effect",
            "purchase_discount_effect",
            "sale_recognition",
            "sale_two_effects",
            "freight_out_effect",
            "sales_return_effect",
            "sales_discount_effect",
            "count_effect",
        ):
            self.assertIn(required, ids)

    def test_each_decision_accepts_only_its_best_analysis(self):
        for item in DECISIONS:
            self.assertEqual(len(set(item.options)), len(item.options), item.id)
            self.assertTrue(evaluate_decision(item.id, item.correct)["correct"], item.id)
            wrong = next(option for option in item.options if option != item.correct)
            self.assertFalse(evaluate_decision(item.id, wrong)["correct"], item.id)

    def test_closeout_feedback_is_item_level(self):
        expected = final_values()
        responses = dict(expected, inventory=2_750)
        results = evaluate_closeout(responses)
        self.assertFalse(results["inventory"]["correct"])
        self.assertEqual(results["inventory"]["expected"], 2_650)
        self.assertTrue(results["net_sales"]["correct"])
        self.assertEqual(set(results), {key for key, _label in CLOSEOUT_FIELDS})

    def test_opening_balances_and_currency_format_are_stable(self):
        self.assertEqual(OPENING_BALANCES["Cash"], 10_000)
        self.assertEqual(format_currency(-100), "-$100")
        self.assertEqual(format_currency(8_145), "$8,145")

    def test_student_case_language_avoids_entry_mechanics(self):
        fields = []
        for item in DECISIONS:
            fields.extend(
                (
                    item.document,
                    item.title,
                    item.story,
                    item.prompt,
                    item.correct,
                    item.explanation,
                    item.statement_effect,
                    *item.options,
                )
            )
        student_text = " ".join(fields).lower()
        for banned in (r"\bdebits?\b", r"\bjournal\b", r"\bledger\b", r"\bposting\b"):
            self.assertIsNone(re.search(banned, student_text), banned)


if __name__ == "__main__":
    unittest.main()
