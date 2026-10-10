"""Student-facing Streamlit application for Dock to Dollar."""

from __future__ import annotations

import hashlib
import random
from html import escape

import streamlit as st

from dock_to_dollar.case_data import (
    COMPANY_NAME,
    DECISIONS,
    OPENING_BALANCES,
    PHASE_LABELS,
    PRODUCT_NAME,
    STATEMENT_QUESTIONS,
)
from dock_to_dollar.engine import (
    balances_after,
    evaluate_decision,
    evaluate_statement_responses,
    event_by_id,
    event_position,
    final_values,
    format_currency,
    units_after,
)
from dock_to_dollar.progress import (
    SNAPSHOT_PARAM,
    activity_defaults,
    record_attempt,
    reset_saved_progress,
    restore_session_state,
    score_summary,
    sync_progress_query,
)


st.set_page_config(
    page_title="Dock to Dollar",
    page_icon="📦",
    layout="wide",
    initial_sidebar_state="collapsed",
)


UD_RED = "#CE0037"
UD_BLUE = "#003087"
INK = "#14213D"
MUTED = "#59677A"
BACKGROUND = "#F4F7FB"
SUCCESS = "#137A4B"
WARNING = "#986000"
GOLD = "#F3B61F"


APP_CSS = f"""
<style>
    :root {{
        --ud-red: {UD_RED};
        --ud-blue: {UD_BLUE};
        --ink: {INK};
        --muted: {MUTED};
        --background: {BACKGROUND};
        --success: {SUCCESS};
        --warning: {WARNING};
        --gold: {GOLD};
    }}

    .stApp {{ background: var(--background); }}
    [data-testid="stHeaderActionElements"] {{ display: none; }}
    [data-testid="stToolbar"] {{ visibility: hidden; height: 0; }}
    [data-testid="stDecoration"] {{ background: var(--ud-red); }}
    [data-testid="stIFrame"], iframe[title="st.iframe"] {{ height: 0 !important; min-height: 0 !important; }}
    .block-container {{ max-width: 1180px; padding-top: 1.2rem; padding-bottom: 4rem; }}

    h1, h2, h3 {{ color: var(--ink); letter-spacing: -0.02em; }}
    p, li, label {{ color: var(--ink); }}

    .hero {{
        background:
            radial-gradient(circle at 90% 12%, rgba(243, 182, 31, 0.30), transparent 25%),
            linear-gradient(125deg, #001F55 0%, var(--ud-blue) 62%, #164E91 100%);
        border-top: 7px solid var(--ud-red);
        border-radius: 18px;
        box-shadow: 0 16px 38px rgba(0, 48, 135, 0.17);
        margin-bottom: 1rem;
        padding: 1.85rem 2.15rem 1.7rem;
    }}
    .hero-kicker {{ color: #FFFFFF; font-size: 0.8rem; font-weight: 850; letter-spacing: 0.13em; }}
    .hero h1 {{ color: #FFFFFF; font-size: clamp(2.25rem, 5vw, 3.8rem); margin: 0.12rem 0 0; }}
    .hero p {{ color: #F1F5FF; font-size: 1.08rem; margin: 0.58rem 0 0; max-width: 830px; }}
    .hero-accent {{ color: var(--gold); font-weight: 900; }}

    .stage-row {{ display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.42rem; margin: 0 0 1.2rem; }}
    .stage-pill {{
        background: #E6EAF1; border: 1px solid #D3D9E4; border-radius: 999px;
        color: #5C6879; font-size: 0.74rem; font-weight: 760; padding: 0.48rem 0.55rem; text-align: center;
    }}
    .stage-pill.complete {{ background: #E5F3EB; border-color: #A5D2B9; color: #0A653D; }}
    .stage-pill.active {{ background: var(--ud-red); border-color: var(--ud-red); color: #FFFFFF; }}

    .eyebrow {{ color: var(--ud-red); font-size: 0.78rem; font-weight: 850; letter-spacing: 0.1em; text-transform: uppercase; }}
    .lead {{ color: var(--muted); font-size: 1.06rem; max-width: 875px; }}
    .case-card {{
        background: #FFFFFF; border: 1px solid #D9E0EA; border-left: 7px solid var(--ud-blue);
        border-radius: 14px; box-shadow: 0 8px 22px rgba(20, 33, 61, 0.06);
        margin: 0.75rem 0 1rem; padding: 1.15rem 1.3rem;
    }}
    .case-card .document {{ color: var(--ud-blue); font-size: 0.78rem; font-weight: 850; letter-spacing: 0.06em; text-transform: uppercase; }}
    .case-card h3 {{ margin: 0.28rem 0 0.48rem; }}
    .case-card p {{ font-size: 1.04rem; margin: 0; }}

    .concept-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.72rem; margin: 1rem 0 1.25rem; }}
    .concept-card {{ background: #FFFFFF; border: 1px solid #D9E0EA; border-radius: 13px; padding: 1rem; }}
    .concept-card strong {{ color: var(--ud-blue); display: block; margin: 0.2rem 0; }}
    .concept-number {{ color: var(--ud-red); font-size: 1.15rem; font-weight: 900; }}
    .concept-card span {{ color: var(--muted); font-size: 0.9rem; }}

    .rule {{ background: #FFF5F7; border-left: 5px solid var(--ud-red); border-radius: 9px; margin: 0.7rem 0 1rem; padding: 0.82rem 0.95rem; }}
    .rule strong {{ color: var(--ud-red); }}

    .account-board {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.62rem; margin: 0.8rem 0 1.05rem; }}
    .account-box {{ background: #EEF4FF; border: 1px solid #C6D7F2; border-radius: 12px; padding: 0.78rem 0.9rem; }}
    .account-label {{ color: var(--muted); display: block; font-size: 0.76rem; font-weight: 720; min-height: 2.1em; }}
    .account-value {{ color: var(--ud-blue); display: block; font-size: 1.2rem; margin-top: 0.14rem; }}
    .account-delta {{ display: block; font-size: 0.82rem; font-weight: 850; min-height: 1.15rem; margin-top: 0.2rem; }}
    .account-delta.positive {{ color: var(--success); }}
    .account-delta.negative {{ color: #B42318; }}
    .account-delta.neutral {{ color: #7C8796; }}

    .feedback-row {{
        align-items: flex-start; background: #FFFFFF; border: 1px solid #D9E0EA; border-radius: 10px;
        display: flex; gap: 1rem; justify-content: space-between; margin: 0.42rem 0; padding: 0.7rem 0.82rem;
    }}
    .feedback-row.correct {{ border-left: 5px solid var(--success); }}
    .feedback-row.review {{ border-left: 5px solid var(--warning); }}
    .feedback-label {{ font-weight: 780; }}
    .feedback-detail {{ color: var(--muted); font-size: 0.9rem; margin-top: 0.12rem; }}
    .feedback-value {{ font-variant-numeric: tabular-nums; white-space: nowrap; }}

    .statement-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin: 0.9rem 0; }}
    .statement {{ background: #FFFFFF; border: 1px solid #D9E0EA; border-radius: 13px; padding: 1rem; }}
    .statement-title {{ color: var(--ud-blue); font-size: 1.05rem; font-weight: 850; text-align: center; }}
    .statement-period {{ color: var(--muted); font-size: 0.8rem; margin-bottom: 0.65rem; text-align: center; }}
    .statement-section {{ color: var(--ud-blue); font-size: 0.86rem; font-weight: 850; margin-top: 0.55rem; text-transform: uppercase; }}
    .statement-line {{ display: flex; gap: 0.7rem; justify-content: space-between; padding: 0.27rem 0; }}
    .statement-line.indent {{ padding-left: 0.85rem; }}
    .statement-line.total {{ border-top: 1px solid #7F8999; font-weight: 800; margin-top: 0.18rem; padding-top: 0.4rem; }}
    .statement-line.grand {{ border-bottom: 3px double var(--ink); border-top: 1px solid var(--ink); font-weight: 850; margin-top: 0.2rem; padding: 0.42rem 0 0.34rem; }}
    .amount {{ font-variant-numeric: tabular-nums; white-space: nowrap; }}

    .score-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; margin: 1rem 0; }}
    .score-box {{ background: #FFFFFF; border: 1px solid #D9E0EA; border-radius: 12px; padding: 0.85rem; text-align: center; }}
    .score-box strong {{ color: var(--ud-blue); display: block; font-size: 1.45rem; }}
    .score-box span {{ color: var(--muted); font-size: 0.82rem; }}

    .stButton > button, .stFormSubmitButton > button {{ border-radius: 9px; font-weight: 760; min-height: 2.7rem; }}
    .stButton > button[kind="primary"], .stFormSubmitButton > button[kind="primary"] {{ background: var(--ud-red); border-color: var(--ud-red); color: #FFFFFF; }}
    .stButton > button[kind="primary"]:hover, .stFormSubmitButton > button[kind="primary"]:hover {{ background: #A9002E; border-color: #A9002E; color: #FFFFFF; }}
    button[data-testid="stBaseButton-primary"],
    button[data-testid="stBaseButton-primaryFormSubmit"] {{ background: var(--ud-red); border-color: var(--ud-red); color: #FFFFFF; }}
    button[data-testid="stBaseButton-primary"] p,
    button[data-testid="stBaseButton-primaryFormSubmit"] p {{ color: #FFFFFF !important; }}

    @media (max-width: 840px) {{
        .block-container {{ padding-left: 1rem; padding-right: 1rem; }}
        .hero {{ padding: 1.35rem 1.15rem; }}
        .stage-row {{ grid-template-columns: 1fr; }}
        .stage-pill {{ display: none; }}
        .stage-pill.active {{ display: block; }}
        .concept-grid, .account-board, .score-grid, .statement-grid {{ grid-template-columns: 1fr; }}
        .feedback-row {{ display: block; }}
        .feedback-value {{ display: block; margin-top: 0.3rem; }}
    }}
</style>
"""


PHASE_INTROS = {
    0: ("Receiving dock", "Use freight terms to decide when ownership and risk move from seller to buyer."),
    1: ("Purchase file", "Follow inventory from invoice through freight, return, and prompt payment."),
    2: ("Sales floor", "Recognize the sale at the transfer point and trace both effects under a perpetual system."),
    3: ("Return desk", "Separate customer-side returns and discounts from the earlier supplier-side events."),
    4: ("Physical count", "Compare the perpetual record with what is actually on the shelves."),
}


def initialize_state() -> None:
    if "dd_restore_attempted" not in st.session_state:
        restore_session_state(st.session_state, st.query_params.get(SNAPSHOT_PARAM))
        st.session_state.dd_restore_attempted = True
    for key, value in activity_defaults().items():
        if key not in st.session_state:
            st.session_state[key] = value


def restart_activity() -> None:
    reset_saved_progress(st.session_state, st.query_params)
    st.session_state.dd_scroll_to_top = True


def set_page(page: int) -> None:
    st.session_state.dd_page = page
    st.session_state.dd_scroll_to_top = True


def advance_decision() -> None:
    index = int(st.session_state.dd_decision_index)
    if index >= len(DECISIONS) - 1:
        st.session_state.dd_page = 2
    else:
        st.session_state.dd_decision_index = index + 1
    st.session_state.dd_scroll_to_top = True


def remove_response(item_id: str) -> None:
    responses = dict(st.session_state.dd_responses)
    responses.pop(item_id, None)
    st.session_state.dd_responses = responses


def current_phase() -> int:
    page = int(st.session_state.dd_page)
    if page == 0:
        return 0
    if page == 1:
        return DECISIONS[int(st.session_state.dd_decision_index)].phase
    return 5


def event_count_through(decision_index: int) -> int:
    count = 0
    for item in DECISIONS[: decision_index + 1]:
        if item.event_id is not None:
            count = max(count, event_position(item.event_id))
    return count


def render_scroll_reset() -> None:
    """Reset only after navigation, while preserving student-initiated scrolling."""

    if not st.session_state.pop("dd_scroll_to_top", False):
        return
    st.iframe(
        """
        <script>
        (() => {
          const parent = window.parent;
          const main = parent.document.querySelector('section[data-testid="stMain"]');
          if (!main) return;
          let cancelled = false;
          let finished = false;
          const scrollingKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
          const cancel = () => { cancelled = true; cleanup(); };
          const cancelKey = (event) => { if (scrollingKeys.has(event.key)) cancel(); };
          const cleanup = () => {
            parent.removeEventListener('wheel', cancel);
            parent.removeEventListener('touchstart', cancel);
            parent.removeEventListener('keydown', cancelKey);
          };
          const reset = () => {
            if (finished) return;
            finished = true;
            if (!cancelled) main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            cleanup();
          };
          parent.addEventListener('wheel', cancel, { passive: true });
          parent.addEventListener('touchstart', cancel, { passive: true });
          parent.addEventListener('keydown', cancelKey);
          parent.requestAnimationFrame(() => parent.requestAnimationFrame(reset));
          parent.setTimeout(reset, 120);
        })();
        </script>
        """,
        height=1,
        tab_index=-1,
    )


def render_hero() -> None:
    st.markdown(
        """
        <div class="hero">
          <div class="hero-kicker">MERCHANDISING CASE</div>
          <h1>Dock to Dollar</h1>
          <p><span class="hero-accent">One shipment. One customer order. One complete financial story.</span> Follow the merchandise, the documents, the accounts, and the statements.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_stage_row() -> None:
    active = current_phase()
    pills = []
    for index, label in enumerate(PHASE_LABELS):
        status = "complete" if index < active else "active" if index == active else ""
        pills.append(f'<div class="stage-pill {status}">{index + 1}. {escape(label)}</div>')
    st.markdown(f'<div class="stage-row">{"".join(pills)}</div>', unsafe_allow_html=True)


def render_case_card(document: str, title: str, story: str) -> None:
    st.markdown(
        f"""
        <div class="case-card">
          <div class="document">{escape(document)}</div>
          <h3>{escape(title)}</h3>
          <p>{escape(story)}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_feedback_row(label: str, correct: bool, detail: str, value: str = "") -> None:
    status = "correct" if correct else "review"
    symbol = "Correct" if correct else "Review"
    st.markdown(
        f"""
        <div class="feedback-row {status}">
          <div><div class="feedback-label">{escape(label)} - {symbol}</div><div class="feedback-detail">{escape(detail)}</div></div>
          <div class="feedback-value">{escape(value)}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def currency_markdown(text: object) -> str:
    """Keep dollar signs visible in Streamlit's Markdown-enabled labels."""

    return str(text).replace("$", r"\$")


def selected_index(options: tuple | list, selected: str | None) -> int | None:
    return list(options).index(selected) if selected in options else None


def shuffled(items: tuple | list, salt: str) -> list:
    """Return a stable per-student order that survives reruns and refreshes."""

    digest = hashlib.sha256(f"{st.session_state.dd_shuffle_seed}:{salt}".encode("utf-8")).digest()
    rng = random.Random(int.from_bytes(digest[:8], "big"))
    ordered = list(items)
    rng.shuffle(ordered)
    if len(ordered) > 1 and ordered == list(items):
        ordered = ordered[1:] + ordered[:1]
    return ordered


def save_decision_draft(item_id: str, widget_key: str) -> None:
    drafts = dict(st.session_state.dd_decision_drafts)
    value = st.session_state.get(widget_key)
    if value is None:
        drafts.pop(item_id, None)
    else:
        drafts[item_id] = str(value)
    st.session_state.dd_decision_drafts = drafts


def save_statement_draft(answer_key: str, widget_key: str) -> None:
    drafts = dict(st.session_state.dd_statement_drafts)
    value = st.session_state.get(widget_key)
    if value is None:
        drafts.pop(answer_key, None)
    else:
        drafts[answer_key] = str(value)
    st.session_state.dd_statement_drafts = drafts


def delta_markup(amount: int, *, currency: bool) -> str:
    if amount == 0:
        return '<span class="account-delta neutral">—</span>'
    css_class = "positive" if amount > 0 else "negative"
    sign = "+" if amount > 0 else "−"
    displayed = format_currency(abs(amount)) if currency else str(abs(amount))
    return f'<span class="account-delta {css_class}">{sign}{displayed}</span>'


def render_account_board(event_count: int | None, event_id: str | None = None) -> None:
    balances = balances_after(event_count)
    units = units_after(event_count)
    event = event_by_id(event_id) if event_id is not None else None
    changes = dict(event.changes) if event is not None else {}
    unit_change = event.unit_change if event is not None else 0
    boxes = [
        (
            f'<div class="account-box"><span class="account-label">{escape(PRODUCT_NAME.title())} on hand</span>'
            f'<strong class="account-value">{units}</strong>{delta_markup(unit_change, currency=False)}</div>'
        )
    ]
    for account in OPENING_BALANCES:
        boxes.append(
            f'<div class="account-box"><span class="account-label">{escape(account)}</span>'
            f'<strong class="account-value">{format_currency(balances[account])}</strong>'
            f'{delta_markup(changes.get(account, 0), currency=True)}</div>'
        )
    st.markdown(
        f'<div class="account-board">{"".join(boxes)}</div>',
        unsafe_allow_html=True,
    )


def render_briefing() -> None:
    st.markdown('<div class="eyebrow">Your assignment</div>', unsafe_allow_html=True)
    st.header(f"Run one merchandise cycle for {COMPANY_NAME}")
    st.markdown(
        f'<p class="lead">{COMPANY_NAME} is a merchandiser preparing to sell a limited shipment of {PRODUCT_NAME}. Use each business document to decide what happened, how the accounts changed, what the ending balances should be, and how the financial statements are affected.</p>',
        unsafe_allow_html=True,
    )
    st.markdown(
        """
        <div class="concept-grid">
          <div class="concept-card"><div class="concept-number">01</div><strong>Follow ownership</strong><span>Use FOB terms and delivery evidence.</span></div>
          <div class="concept-card"><div class="concept-number">02</div><strong>Track inventory</strong><span>Include purchases, freight, returns, and discounts.</span></div>
          <div class="concept-card"><div class="concept-number">03</div><strong>Trace each sale</strong><span>Connect revenue, receivables, inventory, and cost.</span></div>
          <div class="concept-card"><div class="concept-number">04</div><strong>Verify the story</strong><span>Reconcile the physical count and statement effects.</span></div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.markdown(
        '<div class="rule"><strong>Working method:</strong> For every event, determine which accounts increase or decrease, calculate the resulting balances, and explain the financial-statement effect.</div>',
        unsafe_allow_html=True,
    )
    st.subheader("Opening running balances")
    st.caption(
        currency_markdown(
            "Gem City Goods begins after issuing $10,000 of Common Stock for $10,000 cash; "
            "all other opening account balances are zero. Every account used in the case remains visible as the merchandise cycle unfolds."
        )
    )
    render_account_board(0)
    st.button("Open the receiving file", type="primary", width="stretch", on_click=set_page, args=(1,))


def render_decision_stage() -> None:
    index = int(st.session_state.dd_decision_index)
    item = DECISIONS[index]
    phase_title, phase_intro = PHASE_INTROS[item.phase]
    phase_items = [decision for decision in DECISIONS if decision.phase == item.phase]
    phase_position = next(position for position, decision in enumerate(phase_items, start=1) if decision.id == item.id)

    st.markdown(f'<div class="eyebrow">{escape(PHASE_LABELS[item.phase])}</div>', unsafe_allow_html=True)
    st.header(phase_title)
    st.markdown(f'<p class="lead">{escape(phase_intro)}</p>', unsafe_allow_html=True)
    st.progress(
        (index + 1) / len(DECISIONS),
        text=f"Case decision {index + 1} of {len(DECISIONS)} | {PHASE_LABELS[item.phase]} {phase_position} of {len(phase_items)}",
    )
    render_case_card(item.document, item.title, item.story)

    response = st.session_state.dd_responses.get(item.id)
    result = evaluate_decision(item.id, response) if response is not None else None
    st.subheader("Running balances")
    if result is None or not result["correct"]:
        if result is None:
            st.caption("Balances before this decision. Changes appear after you check your analysis.")
        else:
            st.caption("Balances remain at their pre-event amounts while you revise your analysis.")
        render_account_board(event_count_through(index - 1))
    else:
        st.caption("Balances after this event. Green amounts increased; red amounts decreased.")
        render_account_board(event_count_through(index), item.event_id)
        if item.event_id is None:
            st.caption("This ownership-and-timing decision does not change an account balance by itself.")

    if response is None:
        widget_key = f"widget_decision_{item.id}"
        options = shuffled(item.options, f"decision-answer-order:{item.id}")
        selected = st.radio(
            currency_markdown(item.prompt),
            options,
            index=selected_index(options, st.session_state.dd_decision_drafts.get(item.id)),
            key=widget_key,
            format_func=currency_markdown,
            on_change=save_decision_draft,
            args=(item.id, widget_key),
        )
        submitted = st.button("Check the account analysis", type="primary", width="stretch")
        if submitted:
            if selected is None:
                st.warning("Choose a response before checking your analysis.")
            else:
                result = evaluate_decision(item.id, selected)
                responses = dict(st.session_state.dd_responses)
                responses[item.id] = selected
                st.session_state.dd_responses = responses
                record_attempt(st.session_state, f"decision:{item.id}", bool(result["correct"]))
                st.rerun()

    if response is not None:
        assert result is not None
        if result["correct"]:
            st.success(currency_markdown(f"Correct. {result['explanation']}"))
            st.info(currency_markdown(f"Financial-statement effect: {result['statement_effect']}"))
        else:
            st.warning(currency_markdown(f"Not quite. Hint: {result['hint']}"))

        if result["correct"]:
            st.button("Continue", type="primary", width="stretch", on_click=advance_decision)
        else:
            st.button("Revise my analysis", width="stretch", on_click=remove_response, args=(item.id,))


def render_completed_statements() -> None:
    balances = balances_after()
    values = final_values()
    st.markdown(
        f"""
        <div class="statement-grid">
          <div class="statement">
            <div class="statement-title">Income Statement</div><div class="statement-period">For the month ended November 30</div>
            <div class="statement-line"><span>Sales Revenue</span><span class="amount">{format_currency(balances['Sales Revenue'])}</span></div>
            <div class="statement-line indent"><span>Less: Sales Returns and Allowances</span><span class="amount">{format_currency(balances['Sales Returns and Allowances'])}</span></div>
            <div class="statement-line indent"><span>Less: Sales Discounts</span><span class="amount">{format_currency(balances['Sales Discounts'])}</span></div>
            <div class="statement-line total"><span>Net Sales</span><span class="amount">{format_currency(values['net_sales'])}</span></div>
            <div class="statement-line"><span>Cost of Goods Sold</span><span class="amount">{format_currency(values['cost_of_goods_sold'])}</span></div>
            <div class="statement-line total"><span>Gross Profit</span><span class="amount">{format_currency(values['gross_profit'])}</span></div>
            <div class="statement-section">Operating Expenses</div>
            <div class="statement-line indent"><span>Freight-Out Expense</span><span class="amount">{format_currency(values['freight_out_expense'])}</span></div>
            <div class="statement-line grand"><span>Net Income</span><span class="amount">{format_currency(values['income_effect'])}</span></div>
          </div>
          <div class="statement">
            <div class="statement-title">Balance Sheet</div><div class="statement-period">November 30</div>
            <div class="statement-section">Assets</div>
            <div class="statement-line indent"><span>Cash</span><span class="amount">{format_currency(balances['Cash'])}</span></div>
            <div class="statement-line indent"><span>Accounts Receivable</span><span class="amount">{format_currency(balances['Accounts Receivable'])}</span></div>
            <div class="statement-line indent"><span>Inventory</span><span class="amount">{format_currency(balances['Inventory'])}</span></div>
            <div class="statement-line total"><span>Total Assets</span><span class="amount">{format_currency(values['total_assets'])}</span></div>
            <div class="statement-section">Liabilities</div>
            <div class="statement-line indent"><span>Accounts Payable</span><span class="amount">{format_currency(balances['Accounts Payable'])}</span></div>
            <div class="statement-line total"><span>Total Liabilities</span><span class="amount">{format_currency(values['total_liabilities'])}</span></div>
            <div class="statement-section">Stockholders' Equity</div>
            <div class="statement-line indent"><span>Common Stock</span><span class="amount">{format_currency(values['common_stock'])}</span></div>
            <div class="statement-line indent"><span>Retained Earnings</span><span class="amount">{format_currency(values['retained_earnings'])}</span></div>
            <div class="statement-line total"><span>Total Stockholders' Equity</span><span class="amount">{format_currency(values['total_equity'])}</span></div>
            <div class="statement-line grand"><span>Total Liabilities and Stockholders' Equity</span><span class="amount">{format_currency(values['total_liabilities_and_equity'])}</span></div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_closeout() -> None:
    st.markdown('<div class="eyebrow">Financial story</div>', unsafe_allow_html=True)
    st.header("Connect the running balances to the financial statements")
    st.markdown(
        '<p class="lead">The completed event trail has already produced the ending balances. Explain how those account balances combine into the final financial story.</p>',
        unsafe_allow_html=True,
    )
    st.subheader("Ending running balances")
    st.caption("All accounts used in the case are shown before you make the statement connections.")
    render_account_board(None)

    if st.session_state.dd_statement_submitted:
        statement_results = evaluate_statement_responses(st.session_state.dd_statement_responses)
        all_correct = all(bool(result["correct"]) for result in statement_results.values())
        st.subheader("Financial-statement connections")
        for index, result in enumerate(statement_results.values(), start=1):
            detail = str(result["explanation"] if result["correct"] else f"Hint: {result['hint']}")
            render_feedback_row(f"Connection {index}", bool(result["correct"]), detail)
        if all_correct:
            st.success("The merchandise, account balances, and financial-statement effects now tell one consistent story.")
            render_completed_statements()
            st.button("Finish the case", type="primary", width="stretch", on_click=set_page, args=(3,))
            return
        st.warning("Some statement connections still need revision. Use the ending balances and the event trail to reconsider the financial story.")
        if st.button("Revise the financial-statement connections", width="stretch"):
            st.session_state.dd_statement_submitted = False
            st.rerun()
        return

    st.subheader("Financial-statement connections")
    st.caption("The completed statements appear after all three conceptual connections are correct.")
    prior_statements = dict(st.session_state.dd_statement_responses)
    statement_drafts = dict(st.session_state.dd_statement_drafts)
    statement_responses = {}
    for item in STATEMENT_QUESTIONS:
        widget_key = f"widget_statement_{item.id}"
        options = shuffled(item.options, f"statement-answer-order:{item.id}")
        selected = statement_drafts.get(item.id, prior_statements.get(item.id))
        statement_responses[item.id] = st.radio(
            currency_markdown(item.prompt),
            options,
            index=selected_index(options, selected),
            key=widget_key,
            format_func=currency_markdown,
            on_change=save_statement_draft,
            args=(item.id, widget_key),
        )

    if st.button("Check the ending financial story", type="primary", width="stretch"):
        if any(value is None for value in statement_responses.values()):
            st.warning("Answer all three financial-statement questions before checking the complete story.")
            return
        statement_responses = {key: str(value) for key, value in statement_responses.items()}
        statement_results = evaluate_statement_responses(statement_responses)
        for key, result in statement_results.items():
            score_key = f"statement:{key}"
            if score_key not in st.session_state.dd_first_pass or prior_statements.get(key) != statement_responses[key]:
                record_attempt(st.session_state, score_key, bool(result["correct"]))
        st.session_state.dd_statement_drafts = dict(statement_responses)
        st.session_state.dd_statement_responses = statement_responses
        st.session_state.dd_statement_submitted = True
        st.rerun()


def category_score(prefix: str, keys: list[str]) -> str:
    first_pass = st.session_state.dd_first_pass
    correct = sum(1 for key in keys if first_pass.get(f"{prefix}{key}") is True)
    return f"{correct}/{len(keys)}"


def render_completion() -> None:
    score = score_summary(st.session_state)
    st.success("Case complete. The shipment has been traced from the supplier's dock to the financial statements.")

    ownership_ids = [item.id for item in DECISIONS if item.phase in {0, 2} and item.event_id is None]
    account_ids = [item.id for item in DECISIONS if item.id not in ownership_ids]
    st.markdown(
        f"""
        <div class="score-grid">
          <div class="score-box"><strong>{category_score('decision:', ownership_ids)}</strong><span>Ownership and timing first pass</span></div>
          <div class="score-box"><strong>{category_score('decision:', account_ids)}</strong><span>Account analysis first pass</span></div>
          <div class="score-box"><strong>{category_score('statement:', [item.id for item in STATEMENT_QUESTIONS])}</strong><span>Statement connections first pass</span></div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.caption(
        f"First-pass decisions: {score['correct']} of {score['total']} | Practice revisions used: {score['revisions']} | Final mastery: complete"
    )

    st.subheader("Final running balances")
    render_account_board(None)
    st.subheader("Completed financial story")
    render_completed_statements()

    st.subheader("The complete merchandising chain")
    st.markdown(
        """
        1. Freight terms establish when ownership and risk transfer.
        2. Purchase price, buyer-paid transportation, supplier returns, and purchase discounts determine inventory cost.
        3. A sale changes both the customer-facing accounts and the merchandise-cost accounts.
        4. Customer returns and sales discounts reduce net sales in different ways.
        5. A physical count tests the perpetual record and exposes shrinkage.
        6. Every account increase or decrease must flow into the ending balances and financial statements.
        """
    )
    st.subheader("Debrief with your team")
    st.markdown(
        """
        - Why did the inbound \\$80 become Inventory while the outbound \\$60 became an operating expense?
        - Why did the customer return require two separate account effects?
        - Why is a physical count still necessary when the company maintains a perpetual inventory record?
        - Which single event was easiest to overlook when calculating the final income effect?
        """
    )
    st.button("Start over", width="stretch", on_click=restart_activity)


