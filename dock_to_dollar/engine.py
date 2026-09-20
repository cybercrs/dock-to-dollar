"""Pure calculations and evaluations for Dock to Dollar."""

from __future__ import annotations

from collections.abc import Mapping

from dock_to_dollar.case_data import (
    ACCOUNT_EVENTS,
    CLOSEOUT_FIELDS,
    DECISIONS,
    OPENING_BALANCES,
    STATEMENT_QUESTIONS,
    AccountEvent,
    Decision,
)


def format_currency(value: int) -> str:
    """Format a whole-dollar amount for students."""

    if value < 0:
        return f"-${abs(value):,.0f}"
    return f"${value:,.0f}"


def decision_by_id(item_id: str) -> Decision:
    return next(item for item in DECISIONS if item.id == item_id)


def event_by_id(event_id: str) -> AccountEvent:
    return next(item for item in ACCOUNT_EVENTS if item.id == event_id)


def evaluate_decision(item_id: str, selected: str) -> dict[str, object]:
    item = decision_by_id(item_id)
    return {
        "correct": selected == item.correct,
        "selected": selected,
        "expected": item.correct,
        "explanation": item.explanation,
        "statement_effect": item.statement_effect,
    }


def balances_after(event_count: int | None = None) -> dict[str, int]:
    """Return account balances after the requested event prefix."""

    selected_events = ACCOUNT_EVENTS if event_count is None else ACCOUNT_EVENTS[:event_count]
    balances = dict(OPENING_BALANCES)
    for event in selected_events:
        for account, change in event.changes:
            balances[account] = balances.get(account, 0) + change
    return balances


def units_after(event_count: int | None = None) -> int:
    selected_events = ACCOUNT_EVENTS if event_count is None else ACCOUNT_EVENTS[:event_count]
    return sum(event.unit_change for event in selected_events)


def event_position(event_id: str | None) -> int:
    if event_id is None:
        return 0
    return next(index for index, event in enumerate(ACCOUNT_EVENTS, start=1) if event.id == event_id)


def final_values() -> dict[str, int]:
    balances = balances_after()
    net_sales = (
        balances["Sales Revenue"]
        - balances["Sales Returns and Allowances"]
        - balances["Sales Discounts"]
    )
    income_effect = (
        net_sales
        - balances["Cost of Goods Sold"]
        - balances["Freight-Out Expense"]
    )
    return {
        "cash": balances["Cash"],
        "accounts_receivable": balances["Accounts Receivable"],
        "inventory": balances["Inventory"],
        "accounts_payable": balances["Accounts Payable"],
        "net_sales": net_sales,
        "cost_of_goods_sold": balances["Cost of Goods Sold"],
        "freight_out_expense": balances["Freight-Out Expense"],
        "income_effect": income_effect,
    }


def evaluate_closeout(responses: Mapping[str, int]) -> dict[str, dict[str, object]]:
    expected = final_values()
    return {
        key: {
            "label": label,
            "submitted": int(responses.get(key, 0)),
            "expected": expected[key],
            "correct": int(responses.get(key, 0)) == expected[key],
        }
        for key, label in CLOSEOUT_FIELDS
    }


def evaluate_statement_responses(responses: Mapping[str, str]) -> dict[str, dict[str, object]]:
    return {
        item.id: {
            "prompt": item.prompt,
            "selected": responses.get(item.id),
            "expected": item.correct,
            "correct": responses.get(item.id) == item.correct,
            "explanation": item.explanation,
        }
        for item in STATEMENT_QUESTIONS
    }


def event_rows() -> list[dict[str, str]]:
    rows = []
    for event in ACCOUNT_EVENTS:
        changes = []
        for account, amount in event.changes:
            direction = "increases" if amount > 0 else "decreases"
            changes.append(f"{account} {direction} {format_currency(abs(amount))}")
        rows.append({"Date": event.date, "Event": event.label, "Account effects": "; ".join(changes)})
    return rows


def account_rows() -> list[dict[str, str]]:
    ending = balances_after()
    rows = []
    for account, opening in OPENING_BALANCES.items():
        change = ending[account] - opening
        sign = "+" if change > 0 else ""
        rows.append(
            {
                "Account": account,
                "Opening": format_currency(opening),
                "Net change": f"{sign}{format_currency(change)}",
                "Ending": format_currency(ending[account]),
            }
        )
    return rows
