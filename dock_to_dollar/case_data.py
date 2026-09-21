"""Case facts and student-facing decisions for Dock to Dollar."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AccountEvent:
    id: str
    date: str
    label: str
    changes: tuple[tuple[str, int], ...]
    unit_change: int = 0


@dataclass(frozen=True)
class Decision:
    id: str
    phase: int
    document: str
    title: str
    story: str
    prompt: str
    options: tuple[str, ...]
    correct: str
    explanation: str
    statement_effect: str
    event_id: str | None


@dataclass(frozen=True)
class StatementQuestion:
    id: str
    prompt: str
    options: tuple[str, ...]
    correct: str
    explanation: str


COMPANY_NAME = "Gem City Goods"
PRODUCT_NAME = "insulated water bottles"
CASE_PERIOD = "November"

PHASE_LABELS = (
    "Dock",
    "Purchases",
    "Sales",
    "Returns",
    "Count",
    "Financial Story",
)

OPENING_BALANCES = {
    "Cash": 10_000,
    "Accounts Receivable": 0,
    "Inventory": 0,
    "Accounts Payable": 0,
    "Sales Revenue": 0,
    "Sales Returns and Allowances": 0,
    "Sales Discounts": 0,
    "Cost of Goods Sold": 0,
    "Freight-Out Expense": 0,
}


ACCOUNT_EVENTS = (
    AccountEvent(
        id="purchase",
        date="Nov. 3",
        label="Receive supplier shipment on account",
        changes=(("Inventory", 5_000), ("Accounts Payable", 5_000)),
        unit_change=100,
    ),
    AccountEvent(
        id="freight_in",
        date="Nov. 3",
        label="Pay inbound transportation",
        changes=(("Inventory", 80), ("Cash", -80)),
    ),
    AccountEvent(
        id="purchase_return",
        date="Nov. 5",
        label="Return 20 defective water bottles to supplier",
        changes=(("Inventory", -1_000), ("Accounts Payable", -1_000)),
        unit_change=-20,
    ),
    AccountEvent(
        id="purchase_discount",
        date="Nov. 10",
        label="Pay supplier within the discount period",
        changes=(("Accounts Payable", -4_000), ("Cash", -3_920), ("Inventory", -80)),
    ),
    AccountEvent(
        id="sale",
        date="Nov. 16",
        label="Complete sale of 30 water bottles on account",
        changes=(
            ("Accounts Receivable", 2_700),
            ("Sales Revenue", 2_700),
            ("Cost of Goods Sold", 1_500),
            ("Inventory", -1_500),
        ),
        unit_change=-30,
    ),
    AccountEvent(
        id="freight_out",
        date="Nov. 16",
        label="Pay outgoing delivery cost",
        changes=(("Freight-Out Expense", 60), ("Cash", -60)),
    ),
    AccountEvent(
        id="sales_return",
        date="Nov. 19",
        label="Accept five resalable water bottles from customer",
        changes=(
            ("Sales Returns and Allowances", 450),
            ("Accounts Receivable", -450),
            ("Inventory", 250),
            ("Cost of Goods Sold", -250),
        ),
        unit_change=5,
    ),
    AccountEvent(
        id="sales_discount",
        date="Nov. 22",
        label="Collect customer balance within discount period",
        changes=(
            ("Cash", 2_205),
            ("Sales Discounts", 45),
            ("Accounts Receivable", -2_250),
        ),
    ),
    AccountEvent(
        id="shrinkage",
        date="Nov. 30",
        label="Update records to the physical count",
        changes=(("Inventory", -100), ("Cost of Goods Sold", 100)),
        unit_change=-2,
    ),
)


DECISIONS = (
    Decision(
        id="ownership_inbound",
        phase=0,
        document="Supplier invoice and carrier scan",
        title="The shipment leaves the supplier",
        story=(
            "Gem City Goods orders 100 insulated water bottles at $50 each. Terms are FOB shipping point. "
            "The carrier accepts the shipment at the supplier's dock on November 2, and the "
            "water bottles arrive at Gem City Goods on November 3."
        ),
        prompt="When does Gem City Goods become the owner and assume the risk of loss?",
        options=(
            "November 2, when the carrier accepts the shipment",
            "November 3, when the shipment arrives",
            "When Gem City Goods pays the supplier",
        ),
        correct="November 2, when the carrier accepts the shipment",
        explanation=(
            "FOB shipping point transfers ownership when the carrier accepts the goods from "
            "the seller. Arrival and payment occur later."
        ),
        statement_effect=(
            "The ownership point determines whose inventory is at risk while the water bottles are in transit."
        ),
        event_id=None,
    ),
    Decision(
        id="purchase_effect",
        phase=1,
        document="Purchase invoice GCG-1103",
        title="One hundred water bottles arrive",
        story=(
            "The November 3 invoice totals $5,000 and is due later. The water bottles are accepted "
            "into the stockroom."
        ),
        prompt="How does receiving the inventory on account change the accounts?",
        options=(
            "Inventory increases $5,000 and Accounts Payable increases $5,000",
            "Inventory increases $5,000 and Cash decreases $5,000",
            "Cost of Goods Sold increases $5,000 and Accounts Payable increases $5,000",
        ),
        correct="Inventory increases $5,000 and Accounts Payable increases $5,000",
        explanation=(
            "The company now controls $5,000 of merchandise and owes the supplier $5,000. "
            "The water bottles do not become Cost of Goods Sold until they are sold."
        ),
        statement_effect=(
            "Assets increase $5,000 and liabilities increase $5,000; income is unchanged."
        ),
        event_id="purchase",
    ),
    Decision(
        id="freight_in_effect",
        phase=1,
        document="Carrier freight bill",
        title="The buyer pays inbound transportation",
        story=(
            "Because the terms are FOB shipping point, Gem City Goods pays the $80 cost to "
            "transport the water bottles from the supplier to its store."
        ),
        prompt="How should the $80 transportation cost affect the accounts?",
        options=(
            "Inventory increases $80 and Cash decreases $80",
            "Freight-Out Expense increases $80 and Cash decreases $80",
            "Cost of Goods Sold increases $80 and Cash decreases $80",
        ),
        correct="Inventory increases $80 and Cash decreases $80",
        explanation=(
            "A buyer's transportation cost is part of acquiring inventory. It becomes part "
            "of Inventory rather than an immediate operating expense."
        ),
        statement_effect=(
            "One asset increases while another asset decreases; total assets and income are unchanged."
        ),
        event_id="freight_in",
    ),
    Decision(
        id="purchase_return_effect",
        phase=1,
        document="Supplier return authorization",
        title="Twenty defective water bottles go back",
        story=(
            "On November 5, the supplier approves a return of 20 defective water bottles. The "
            "invoice price was $50 per bottle, and Gem City Goods has not yet paid the invoice."
        ),
        prompt="What is the account effect of the $1,000 purchase return?",
        options=(
            "Inventory decreases $1,000 and Accounts Payable decreases $1,000",
            "Inventory decreases $1,000 and Cash increases $1,000",
            "Sales Returns and Allowances increases $1,000 and Inventory decreases $1,000",
        ),
        correct="Inventory decreases $1,000 and Accounts Payable decreases $1,000",
        explanation=(
            "The buyer sends merchandise back before paying. Inventory falls, and the amount "
            "owed to the supplier falls by the same invoice price."
        ),
        statement_effect=(
            "Assets and liabilities each decrease $1,000; income is unchanged."
        ),
        event_id="purchase_return",
    ),
    Decision(
        id="purchase_discount_effect",
        phase=1,
        document="Supplier payment screen",
        title="The discount clock is still running",
        story=(
            "Terms are 2/10, n/30. After the return, $4,000 remains due. Gem City Goods pays "
            "on November 10, within the discount period."
        ),
        prompt="Which analysis correctly reflects the payment?",
        options=(
            "Pay $3,920; Accounts Payable decreases $4,000 and Inventory decreases $80",
            "Pay $4,000; Accounts Payable decreases $4,000 and Inventory is unchanged",
            "Pay $3,900; Accounts Payable decreases $4,000 and Sales Discounts increases $100",
        ),
        correct="Pay $3,920; Accounts Payable decreases $4,000 and Inventory decreases $80",
        explanation=(
            "The 2% discount applies to the $4,000 remaining after the return: $80. The company "
            "pays $3,920, removes the $4,000 obligation, and reduces the cost of Inventory by $80."
        ),
        statement_effect=(
            "Cash and liabilities decrease; Inventory also decreases $80. Income is unchanged until the merchandise is sold."
        ),
        event_id="purchase_discount",
    ),
    Decision(
        id="sale_recognition",
        phase=2,
        document="Customer order and delivery confirmation",
        title="The customer order is in transit",
        story=(
            "A customer orders 30 insulated water bottles for $90 each on account. Terms are FOB destination. "
            "The carrier picks them up November 15 and confirms delivery November 16."
        ),
        prompt="When should Gem City Goods report the sale?",
        options=(
            "November 16, when the goods reach the customer",
            "November 15, when the carrier picks up the goods",
            "When the customer later pays",
        ),
        correct="November 16, when the goods reach the customer",
        explanation=(
            "Under FOB destination, the seller retains ownership until delivery. The goods "
            "transfer to the customer on November 16, so that is when the sale is reported."
        ),
        statement_effect=(
            "Reporting waits until the performance obligation is satisfied and the merchandise transfers to the customer."
        ),
        event_id=None,
    ),
    Decision(
        id="sale_two_effects",
        phase=2,
        document="Sales invoice and perpetual inventory record",
        title="Thirty water bottles reach the customer",
        story=(
            "The delivered order has a selling price of $2,700 and a cost of $1,500. The customer "
            "will pay later."
        ),
        prompt="Which choice captures both effects of the sale?",
        options=(
            "Accounts Receivable and Sales Revenue increase $2,700; Cost of Goods Sold increases and Inventory decreases $1,500",
            "Cash and Sales Revenue increase $2,700; Inventory decreases $2,700",
            "Accounts Receivable increases $1,500; Sales Revenue and Inventory each increase $2,700",
        ),
        correct="Accounts Receivable and Sales Revenue increase $2,700; Cost of Goods Sold increases and Inventory decreases $1,500",
        explanation=(
            "A perpetual system records both the amount earned from the customer and the cost of "
            "the merchandise that left inventory."
        ),
        statement_effect=(
            "Assets increase a net $1,200. Revenue increases $2,700, expense increases $1,500, and income increases $1,200."
        ),
        event_id="sale",
    ),
    Decision(
        id="freight_out_effect",
        phase=2,
        document="Outgoing delivery receipt",
        title="The seller pays the delivery cost",
        story=(
            "Gem City Goods pays $60 to deliver the FOB destination order to the customer."
        ),
        prompt="How does the seller's $60 outgoing transportation cost affect the accounts?",
        options=(
            "Freight-Out Expense increases $60 and Cash decreases $60",
            "Inventory increases $60 and Cash decreases $60",
            "Cost of Goods Sold decreases $60 and Cash decreases $60",
        ),
        correct="Freight-Out Expense increases $60 and Cash decreases $60",
        explanation=(
            "A seller's outgoing delivery cost is an operating expense, not part of the cost of "
            "inventory still on hand."
        ),
        statement_effect="Assets and income each decrease $60; operating expenses increase $60.",
        event_id="freight_out",
    ),
    Decision(
        id="sales_return_effect",
        phase=3,
        document="Customer return form",
        title="Five resalable water bottles come back",
        story=(
            "On November 19, the customer returns five water bottles. Their selling price was $450, "
            "their cost was $250, and they can be resold. The customer has not yet paid."
        ),
        prompt="Which choice captures both effects of the customer return?",
        options=(
            "Sales Returns and Allowances increases and Accounts Receivable decreases $450; Inventory increases and Cost of Goods Sold decreases $250",
            "Inventory decreases and Accounts Payable decreases $450; Cost of Goods Sold increases $250",
            "Cash decreases $450; Sales Revenue decreases $250; Inventory is unchanged",
        ),
        correct="Sales Returns and Allowances increases and Accounts Receivable decreases $450; Inventory increases and Cost of Goods Sold decreases $250",
        explanation=(
            "The customer no longer owes the selling price of the returned goods. Because the "
            "water bottles can be resold, their cost returns to Inventory and reduces Cost of Goods Sold."
        ),
        statement_effect=(
            "Net sales decrease $450 and expense decreases $250, so income decreases a net $200."
        ),
        event_id="sales_return",
    ),
    Decision(
        id="sales_discount_effect",
        phase=3,
        document="Customer remittance",
        title="The customer pays promptly",
        story=(
            "After the return, the customer owes $2,250. Terms are 2/10, n/30, and payment arrives "
            "within the discount period."
        ),
        prompt="What amount is collected, and how does the discount affect the accounts?",
        options=(
            "Collect $2,205; Accounts Receivable decreases $2,250 and Sales Discounts increases $45",
            "Collect $2,250; Accounts Receivable decreases $2,250 and Sales Discounts is unchanged",
            "Collect $2,196; Accounts Receivable decreases $2,250 and Inventory decreases $54",
        ),
        correct="Collect $2,205; Accounts Receivable decreases $2,250 and Sales Discounts increases $45",
        explanation=(
            "The 2% discount is $45 on the $2,250 amount due after the return. The customer pays "
            "$2,205, and Sales Discounts reduces net sales by $45."
        ),
        statement_effect="Cash increases $2,205, Accounts Receivable becomes $0, and income decreases $45.",
        event_id="sales_discount",
    ),
    Decision(
        id="count_effect",
        phase=4,
        document="November 30 physical count sheet",
        title="The shelves and the record disagree",
        story=(
            "The perpetual record predicts 55 water bottles at $50 each, or $2,750. The physical count "
            "finds only 53 water bottles."
        ),
        prompt="How should Gem City Goods reflect the shortage?",
        options=(
            "Inventory decreases $100 and Cost of Goods Sold increases $100",
            "Inventory increases $100 and Sales Revenue increases $100",
            "Accounts Payable decreases $100 and Inventory is unchanged",
        ),
        correct="Inventory decreases $100 and Cost of Goods Sold increases $100",
        explanation=(
            "Two missing water bottles at $50 each create $100 of shrinkage. The physical count verifies "
            "what is actually on hand and brings the perpetual record down to that amount."
        ),
        statement_effect="Assets and income decrease $100; Cost of Goods Sold increases $100.",
        event_id="shrinkage",
    ),
)


STATEMENT_QUESTIONS = (
    StatementQuestion(
        id="income_bridge",
        prompt="How does the completed merchandise cycle produce the case's income effect?",
        options=(
            "Subtract Cost of Goods Sold and Freight-Out Expense from Net Sales",
            "Add ending Inventory to Net Sales, then subtract Accounts Payable",
            "Subtract the supplier payment from the cash collected from the customer",
        ),
        correct="Subtract Cost of Goods Sold and Freight-Out Expense from Net Sales",
        explanation=(
            "Net Sales reflects the sale after customer returns and discounts. Cost of Goods Sold "
            "and Freight-Out Expense are then subtracted to determine the $795 income effect."
        ),
    ),
    StatementQuestion(
        id="contra_revenue",
        prompt="Which events reduce Net Sales without changing the $2,700 balance in Sales Revenue?",
        options=(
            "The customer return and the sales discount",
            "The supplier return and the purchase discount",
            "The inbound freight and the outbound freight",
        ),
        correct="The customer return and the sales discount",
        explanation=(
            "Sales Returns and Allowances and Sales Discounts are separate contra-revenue accounts. "
            "They reduce Net Sales while the original Sales Revenue remains visible."
        ),
    ),
    StatementQuestion(
        id="cash_vs_income",
        prompt="Why is the $795 income effect different from the $1,855 decrease in Cash during the case?",
        options=(
            "Cash reflects when amounts were paid or collected; income reflects Net Sales minus the related expenses",
            "Income always equals ending Cash minus opening Cash once Accounts Receivable reaches zero",
            "The difference exists only because the physical count changed the number of units on hand",
        ),
        correct="Cash reflects when amounts were paid or collected; income reflects Net Sales minus the related expenses",
        explanation=(
            "Paying the supplier reduces Cash but is not an immediate expense, while a credit sale creates "
            "revenue before collection. Cash movement and income therefore measure different parts of the story."
        ),
    ),
)
