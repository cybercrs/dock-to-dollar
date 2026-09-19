"""Student-facing Streamlit application for Dock to Dollar."""

from __future__ import annotations

from html import escape

import streamlit as st

from dock_to_dollar.case_data import (
    CLOSEOUT_FIELDS,
    COMPANY_NAME,
    DECISIONS,
    OPENING_BALANCES,
    PHASE_LABELS,
    PRODUCT_NAME,
)
from dock_to_dollar.engine import (
    account_rows,
    balances_after,
    evaluate_closeout,
    evaluate_decision,
    event_by_id,
    event_position,
    event_rows,
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

    .effect-list {{ background: #FFFFFF; border: 1px solid #D9E0EA; border-radius: 12px; margin: 0.75rem 0; padding: 0.85rem 1rem; }}
    .effect-list strong {{ color: var(--ud-blue); }}
    .effect-list ul {{ margin-bottom: 0; }}

    .account-board {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.62rem; margin: 0.8rem 0 1.05rem; }}
    .account-box {{ background: #EEF4FF; border: 1px solid #C6D7F2; border-radius: 12px; padding: 0.78rem 0.9rem; }}
    .account-box span {{ color: var(--muted); display: block; font-size: 0.76rem; font-weight: 720; }}
    .account-box strong {{ color: var(--ud-blue); display: block; font-size: 1.2rem; margin-top: 0.14rem; }}

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
          <div class="hero-kicker">CHAPTER 7 MERCHANDISING CASE</div>
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


def render_event_effect(event_id: str) -> None:
    event = event_by_id(event_id)
    items = []
    for account, amount in event.changes:
        direction = "increases" if amount > 0 else "decreases"
        items.append(f"<li><strong>{escape(account)}</strong> {direction} {escape(format_currency(abs(amount)))}</li>")
    st.markdown(
        f'<div class="effect-list"><strong>{escape(event.date)} account effects</strong><ul>{"".join(items)}</ul></div>',
        unsafe_allow_html=True,
    )


def render_account_board(event_count: int) -> None:
    balances = balances_after(event_count)
    units = units_after(event_count)
    st.markdown(
        f"""
        <div class="account-board">
          <div class="account-box"><span>Units on hand</span><strong>{units}</strong></div>
          <div class="account-box"><span>Cash</span><strong>{format_currency(balances['Cash'])}</strong></div>
          <div class="account-box"><span>Inventory</span><strong>{format_currency(balances['Inventory'])}</strong></div>
          <div class="account-box"><span>Accounts Receivable</span><strong>{format_currency(balances['Accounts Receivable'])}</strong></div>
          <div class="account-box"><span>Accounts Payable</span><strong>{format_currency(balances['Accounts Payable'])}</strong></div>
        </div>
        """,
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
    col1, col2, col3 = st.columns(3)
    col1.metric("Opening cash", format_currency(OPENING_BALANCES["Cash"]))
    col2.metric("Opening inventory", format_currency(OPENING_BALANCES["Inventory"]))
    col3.metric("Opening amount owed", format_currency(OPENING_BALANCES["Accounts Payable"]))
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
    if response is None:
        with st.form(f"decision_form_{item.id}"):
            selected = st.radio(
                item.prompt,
                item.options,
                index=None,
                key=f"widget_decision_{item.id}",
                format_func=currency_markdown,
            )
            submitted = st.form_submit_button("Check the account analysis", type="primary", width="stretch")
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
        result = evaluate_decision(item.id, response)
        if result["correct"]:
            st.success(currency_markdown(f"Correct. {result['explanation']}"))
        else:
            st.warning(currency_markdown(f"Review this event. {result['explanation']}"))
            st.caption(currency_markdown(f"Best analysis: {result['expected']}"))

        if item.event_id is not None:
            render_event_effect(item.event_id)
        st.info(currency_markdown(f"Financial-statement effect: {result['statement_effect']}"))

        if result["correct"]:
            st.subheader("Running account board")
            render_account_board(event_count_through(index))
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
            <div class="statement-title">Income Statement Effects</div><div class="statement-period">November case events</div>
            <div class="statement-line"><span>Sales Revenue</span><span class="amount">{format_currency(balances['Sales Revenue'])}</span></div>
            <div class="statement-line indent"><span>Less: Sales Returns and Allowances</span><span class="amount">{format_currency(balances['Sales Returns and Allowances'])}</span></div>
            <div class="statement-line indent"><span>Less: Sales Discounts</span><span class="amount">{format_currency(balances['Sales Discounts'])}</span></div>
            <div class="statement-line total"><span>Net Sales</span><span class="amount">{format_currency(values['net_sales'])}</span></div>
            <div class="statement-line"><span>Cost of Goods Sold</span><span class="amount">{format_currency(values['cost_of_goods_sold'])}</span></div>
            <div class="statement-line"><span>Freight-Out Expense</span><span class="amount">{format_currency(values['freight_out_expense'])}</span></div>
            <div class="statement-line grand"><span>Income effect</span><span class="amount">{format_currency(values['income_effect'])}</span></div>
          </div>
          <div class="statement">
            <div class="statement-title">Ending Balance Sheet Accounts</div><div class="statement-period">After all case events</div>
            <div class="statement-line"><span>Cash</span><span class="amount">{format_currency(balances['Cash'])}</span></div>
            <div class="statement-line"><span>Accounts Receivable</span><span class="amount">{format_currency(balances['Accounts Receivable'])}</span></div>
            <div class="statement-line"><span>Inventory</span><span class="amount">{format_currency(balances['Inventory'])}</span></div>
            <div class="statement-line total"><span>Case assets</span><span class="amount">{format_currency(balances['Cash'] + balances['Accounts Receivable'] + balances['Inventory'])}</span></div>
            <div class="statement-line"><span>Accounts Payable</span><span class="amount">{format_currency(balances['Accounts Payable'])}</span></div>
            <div class="statement-line grand"><span>Physical units on hand</span><span class="amount">{units_after()}</span></div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_closeout() -> None:
    st.markdown('<div class="eyebrow">Financial story</div>', unsafe_allow_html=True)
    st.header("Reconcile the merchandise cycle")
    st.markdown(
        '<p class="lead">Use the opening balances and the complete event trail to calculate the ending account balances and income-statement effects.</p>',
        unsafe_allow_html=True,
    )
    col1, col2, col3 = st.columns(3)
    col1.metric("Opening Cash", format_currency(OPENING_BALANCES["Cash"]))
    col2.metric("Opening Inventory", format_currency(OPENING_BALANCES["Inventory"]))
    col3.metric("Physical count", "53 daypacks")

    with st.expander("Review the complete event trail"):
        st.dataframe(event_rows(), width="stretch", hide_index=True)

    if not st.session_state.dd_closeout_submitted:
        prior = dict(st.session_state.dd_closeout_responses)
        with st.form("closeout_form"):
            responses = {}
            cols = st.columns(2)
            for index, (key, label) in enumerate(CLOSEOUT_FIELDS):
                responses[key] = int(
                    cols[index % 2].number_input(
                        label,
                        min_value=0,
                        max_value=10_000_000,
                        value=int(prior.get(key, 0)),
                        step=5,
                        key=f"widget_closeout_{key}",
                    )
                )
            submitted = st.form_submit_button("Check the ending financial story", type="primary", width="stretch")
        if submitted:
            results = evaluate_closeout(responses)
            previous = dict(st.session_state.dd_closeout_responses)
            for key, result in results.items():
                score_key = f"closeout:{key}"
                if score_key not in st.session_state.dd_first_pass or previous.get(key) != responses[key]:
                    record_attempt(st.session_state, score_key, bool(result["correct"]))
            st.session_state.dd_closeout_responses = responses
            st.session_state.dd_closeout_submitted = True
            st.rerun()

    if st.session_state.dd_closeout_submitted:
        results = evaluate_closeout(st.session_state.dd_closeout_responses)
        all_correct = all(bool(result["correct"]) for result in results.values())
        for result in results.values():
            render_feedback_row(
                str(result["label"]),
                bool(result["correct"]),
                "Use the opening balance and all related increases and decreases.",
                format_currency(int(result["expected"])),
            )
        if all_correct:
            st.success("The merchandise, account balances, and financial-statement effects now tell one consistent story.")
            render_completed_statements()
            st.button("Finish the case", type="primary", width="stretch", on_click=set_page, args=(3,))
        else:
            st.warning("Some amounts do not yet include every related event. Trace each account from opening balance to ending balance and try again.")
            if st.button("Revise the ending balances", width="stretch"):
                st.session_state.dd_closeout_submitted = False


def category_score(prefix: str, keys: list[str]) -> str:
    first_pass = st.session_state.dd_first_pass
    correct = sum(1 for key in keys if first_pass.get(f"{prefix}{key}") is True)
    return f"{correct}/{len(keys)}"


def render_completion() -> None:
    score = score_summary(st.session_state)
    st.success("Case complete. The shipment has been traced from the supplier's dock to the financial statements.")

    closeout_keys = [key for key, _label in CLOSEOUT_FIELDS]
    ownership_ids = [item.id for item in DECISIONS if item.phase in {0, 2} and item.event_id is None]
    account_ids = [item.id for item in DECISIONS if item.id not in ownership_ids]
    st.markdown(
        f"""
        <div class="score-grid">
          <div class="score-box"><strong>{category_score('decision:', ownership_ids)}</strong><span>Ownership and timing first pass</span></div>
          <div class="score-box"><strong>{category_score('decision:', account_ids)}</strong><span>Account analysis first pass</span></div>
          <div class="score-box"><strong>{category_score('closeout:', closeout_keys)}</strong><span>Ending amounts first pass</span></div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.caption(
        f"First-pass decisions: {score['correct']} of {score['total']} | Practice revisions used: {score['revisions']} | Final mastery: complete"
    )

    st.subheader("Completed financial story")
    render_completed_statements()
    with st.expander("See every account from opening to ending balance"):
        st.dataframe(account_rows(), width="stretch", hide_index=True)

    st.subheader("The complete Chapter 7 chain")
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


initialize_state()
st.markdown(APP_CSS, unsafe_allow_html=True)
render_hero()
render_stage_row()

with st.sidebar:
    st.header("Dock to Dollar")
    st.write(COMPANY_NAME)
    st.write("Progress is saved anonymously in this page's address so a refresh does not erase your work.")
    st.button("Start over", width="stretch", on_click=restart_activity)

page = int(st.session_state.dd_page)
if page == 0:
    render_briefing()
elif page == 1:
    render_decision_stage()
elif page == 2:
    render_closeout()
else:
    render_completion()

sync_progress_query(st.session_state, st.query_params)
render_scroll_reset()
