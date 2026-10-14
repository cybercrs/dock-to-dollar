// Generated from the preserved Dock to Dollar Python teaching content.
export const DATA = {
  "company": "Gem City Goods",
  "product": "insulated water bottles",
  "phases": [
    "Dock",
    "Purchases",
    "Sales",
    "Returns",
    "Count",
    "Financial Story"
  ],
  "opening": {
    "Cash": 10000,
    "Accounts Receivable": 0,
    "Inventory": 0,
    "Accounts Payable": 0,
    "Common Stock": 10000,
    "Sales Revenue": 0,
    "Sales Returns and Allowances": 0,
    "Sales Discounts": 0,
    "Cost of Goods Sold": 0,
    "Freight-Out Expense": 0
  },
  "events": [
    {
      "id": "purchase",
      "date": "Nov. 3",
      "label": "Receive supplier shipment on account",
      "changes": [
        [
          "Inventory",
          5000
        ],
        [
          "Accounts Payable",
          5000
        ]
      ],
      "unit_change": 100
    },
    {
      "id": "freight_in",
      "date": "Nov. 3",
      "label": "Pay inbound transportation",
      "changes": [
        [
          "Inventory",
          80
        ],
        [
          "Cash",
          -80
        ]
      ],
      "unit_change": 0
    },
    {
      "id": "purchase_return",
      "date": "Nov. 5",
      "label": "Return 20 defective water bottles to supplier",
      "changes": [
        [
          "Inventory",
          -1000
        ],
        [
          "Accounts Payable",
          -1000
        ]
      ],
      "unit_change": -20
    },
    {
      "id": "purchase_discount",
      "date": "Nov. 10",
      "label": "Pay supplier within the discount period",
      "changes": [
        [
          "Accounts Payable",
          -4000
        ],
        [
          "Cash",
          -3920
        ],
        [
          "Inventory",
          -80
        ]
      ],
      "unit_change": 0
    },
    {
      "id": "sale",
      "date": "Nov. 16",
      "label": "Complete sale of 30 water bottles on account",
      "changes": [
        [
          "Accounts Receivable",
          2700
        ],
        [
          "Sales Revenue",
          2700
        ],
        [
          "Cost of Goods Sold",
          1500
        ],
        [
          "Inventory",
          -1500
        ]
      ],
      "unit_change": -30
    },
    {
      "id": "freight_out",
      "date": "Nov. 16",
      "label": "Pay outgoing delivery cost",
      "changes": [
        [
          "Freight-Out Expense",
          60
        ],
        [
          "Cash",
          -60
        ]
      ],
      "unit_change": 0
    },
    {
      "id": "sales_return",
      "date": "Nov. 19",
      "label": "Accept five resalable water bottles from customer",
      "changes": [
        [
          "Sales Returns and Allowances",
          450
        ],
        [
          "Accounts Receivable",
          -450
        ],
        [
          "Inventory",
          250
        ],
        [
          "Cost of Goods Sold",
          -250
        ]
      ],
      "unit_change": 5
    },
    {
      "id": "sales_discount",
      "date": "Nov. 22",
      "label": "Collect customer balance within discount period",
      "changes": [
        [
          "Cash",
          2205
        ],
        [
          "Sales Discounts",
          45
        ],
        [
          "Accounts Receivable",
          -2250
        ]
      ],
      "unit_change": 0
    },
    {
      "id": "shrinkage",
      "date": "Nov. 30",
      "label": "Update records to the physical count",
      "changes": [
        [
          "Inventory",
          -100
        ],
        [
          "Cost of Goods Sold",
          100
        ]
      ],
      "unit_change": -2
    }
  ],
  "decisions": [
    {
      "id": "ownership_inbound",
      "phase": 0,
      "document": "Supplier invoice and carrier scan",
      "title": "The shipment leaves the supplier",
      "story": "Gem City Goods orders 100 insulated water bottles at $50 each. Terms are FOB shipping point. The carrier accepts the shipment at the supplier's dock on November 2, and the water bottles arrive at Gem City Goods on November 3.",
      "prompt": "When does Gem City Goods become the owner and assume the risk of loss?",
      "options": [
        "November 2, when the carrier accepts the shipment",
        "November 3, when the shipment arrives",
        "When Gem City Goods pays the supplier"
      ],
      "correct": "November 2, when the carrier accepts the shipment",
      "explanation": "FOB shipping point transfers ownership when the carrier accepts the goods from the seller. Arrival and payment occur later. The shipment establishes the transaction date, but Gem City Goods still needs the seller's invoice for the price, payment terms, and other details needed to record the purchase.",
      "hint": "Focus on the FOB term and the carrier's role. Separate the ownership date from arrival and payment.",
      "statement_effect": "The ownership point determines whose inventory is at risk while the water bottles are in transit.",
      "event_id": null
    },
    {
      "id": "purchase_effect",
      "phase": 1,
      "document": "Purchase invoice GCG-1103",
      "title": "One hundred water bottles arrive",
      "story": "The November 3 invoice totals $5,000 and is due later. The water bottles are accepted into the stockroom.",
      "prompt": "How does receiving the inventory on account change the accounts?",
      "options": [
        "Inventory increases $5,000 and Accounts Payable increases $5,000",
        "Inventory increases $5,000 and Cash decreases $5,000",
        "Cost of Goods Sold increases $5,000 and Accounts Payable increases $5,000"
      ],
      "correct": "Inventory increases $5,000 and Accounts Payable increases $5,000",
      "explanation": "The company now controls $5,000 of merchandise and owes the supplier $5,000. The water bottles do not become Cost of Goods Sold until they are sold.",
      "hint": "Identify the resource received and determine whether Gem City Goods paid for it on that date.",
      "statement_effect": "Assets increase $5,000 and liabilities increase $5,000; income is unchanged.",
      "event_id": "purchase"
    },
    {
      "id": "freight_in_effect",
      "phase": 1,
      "document": "Carrier freight bill",
      "title": "The buyer pays inbound transportation",
      "story": "Because the terms are FOB shipping point, Gem City Goods pays the $80 cost to transport the water bottles from the supplier to its store.",
      "prompt": "How should the $80 transportation cost affect the accounts?",
      "options": [
        "Inventory increases $80 and Cash decreases $80",
        "Freight-Out Expense increases $80 and Cash decreases $80",
        "Cost of Goods Sold increases $80 and Cash decreases $80"
      ],
      "correct": "Inventory increases $80 and Cash decreases $80",
      "explanation": "A buyer's transportation cost is part of acquiring inventory. It becomes part of Inventory rather than an immediate operating expense.",
      "hint": "Ask whether this transportation cost brings merchandise in for sale or delivers sold goods to a customer.",
      "statement_effect": "One asset increases while another asset decreases; total assets and income are unchanged.",
      "event_id": "freight_in"
    },
    {
      "id": "purchase_return_effect",
      "phase": 1,
      "document": "Supplier return authorization",
      "title": "Twenty defective water bottles go back",
      "story": "On November 5, the supplier approves a return of 20 defective water bottles. The invoice price was $50 per bottle, and Gem City Goods has not yet paid the invoice.",
      "prompt": "What is the account effect of the $1,000 purchase return?",
      "options": [
        "Inventory decreases $1,000 and Accounts Payable decreases $1,000",
        "Inventory decreases $1,000 and Cash increases $1,000",
        "Sales Returns and Allowances increases $1,000 and Inventory decreases $1,000"
      ],
      "correct": "Inventory decreases $1,000 and Accounts Payable decreases $1,000",
      "explanation": "The buyer sends merchandise back before paying. Inventory falls, and the amount owed to the supplier falls by the same invoice price.",
      "hint": "The buyer has not paid yet. Trace both the merchandise sent back and the outstanding supplier obligation.",
      "statement_effect": "Assets and liabilities each decrease $1,000; income is unchanged.",
      "event_id": "purchase_return"
    },
    {
      "id": "purchase_discount_effect",
      "phase": 1,
      "document": "Supplier payment screen",
      "title": "The discount clock is still running",
      "story": "The original purchase transaction date was November 3, and the terms are 2/10, n/30. After the return, $4,000 remains due. Gem City Goods pays on November 10.",
      "prompt": "Which analysis correctly reflects the payment?",
      "options": [
        "Pay $3,920; Accounts Payable decreases $4,000 and Inventory decreases $80",
        "Pay $4,000; Accounts Payable decreases $4,000 and Inventory is unchanged",
        "Pay $3,900; Accounts Payable decreases $4,000 and Sales Discounts increases $100"
      ],
      "correct": "Pay $3,920; Accounts Payable decreases $4,000 and Inventory decreases $80",
      "explanation": "November 10 is within ten days of the November 3 purchase date, so the 2% discount applies to the $4,000 remaining after the return: $80. The company pays $3,920, removes the $4,000 obligation, and reduces the cost of Inventory by $80. The inventory's recorded value changes, but its quantity does not: 80 water bottles are still on hand.",
      "hint": "Count from the November 3 transaction date to the November 10 payment date, then apply the terms to the amount remaining after the return.",
      "statement_effect": "Cash and liabilities decrease; Inventory also decreases $80. Income is unchanged until the merchandise is sold.",
      "event_id": "purchase_discount"
    },
    {
      "id": "sale_recognition",
      "phase": 2,
      "document": "Customer order and delivery confirmation",
      "title": "The customer order is in transit",
      "story": "A customer orders 30 insulated water bottles for $90 each on account. Terms are FOB destination. The carrier picks them up November 15 and confirms delivery November 16.",
      "prompt": "When should Gem City Goods report the sale?",
      "options": [
        "November 16, when the goods reach the customer",
        "November 15, when the carrier picks up the goods",
        "When the customer later pays"
      ],
      "correct": "November 16, when the goods reach the customer",
      "explanation": "Under FOB destination, the seller retains ownership until delivery. The goods transfer to the customer on November 16, so that is when the sale is reported. Delivery establishes the transaction date, but Gem City Goods still needs the sales invoice for the selling price and its internal perpetual inventory record for the merchandise cost.",
      "hint": "Focus on the FOB term and the evidence that the goods reached the customer, not the later cash collection.",
      "statement_effect": "Reporting waits until the performance obligation is satisfied and the merchandise transfers to the customer.",
      "event_id": null
    },
    {
      "id": "sale_two_effects",
      "phase": 2,
      "document": "Sales invoice and perpetual inventory record",
      "title": "Thirty water bottles reach the customer",
      "story": "The delivered order has a selling price of $2,700 and a cost of $1,500. The customer will pay later.",
      "prompt": "Which choice captures both effects of the sale?",
      "options": [
        "Accounts Receivable and Sales Revenue increase $2,700; Cost of Goods Sold increases and Inventory decreases $1,500",
        "Cash and Sales Revenue increase $2,700; Inventory decreases $2,700",
        "Accounts Receivable increases $1,500; Sales Revenue and Inventory each increase $2,700"
      ],
      "correct": "Accounts Receivable and Sales Revenue increase $2,700; Cost of Goods Sold increases and Inventory decreases $1,500",
      "explanation": "A perpetual system records both the amount earned from the customer and the cost of the merchandise that left inventory.",
      "hint": "Separate the selling price from the merchandise cost and trace both sides of a perpetual-system sale.",
      "statement_effect": "Assets increase a net $1,200. Revenue increases $2,700, expense increases $1,500, and income increases $1,200.",
      "event_id": "sale"
    },
    {
      "id": "freight_out_effect",
      "phase": 2,
      "document": "Outgoing delivery receipt",
      "title": "The seller pays the delivery cost",
      "story": "Gem City Goods pays $60 to deliver the FOB destination order to the customer.",
      "prompt": "How does the seller's $60 outgoing transportation cost affect the accounts?",
      "options": [
        "Freight-Out Expense increases $60 and Cash decreases $60",
        "Inventory increases $60 and Cash decreases $60",
        "Cost of Goods Sold decreases $60 and Cash decreases $60"
      ],
      "correct": "Freight-Out Expense increases $60 and Cash decreases $60",
      "explanation": "A seller's outgoing delivery cost is an operating expense, not part of the cost of inventory still on hand.",
      "hint": "Ask whether this cost acquires inventory or delivers merchandise that has already been sold.",
      "statement_effect": "Assets and income each decrease $60; operating expenses increase $60.",
      "event_id": "freight_out"
    },
    {
      "id": "sales_return_effect",
      "phase": 3,
      "document": "Customer return form",
      "title": "Five resalable water bottles come back",
      "story": "On November 19, the customer returns five water bottles. Their selling price was $450, their cost was $250, and they can be resold. The customer has not yet paid.",
      "prompt": "Which choice captures both effects of the customer return?",
      "options": [
        "Sales Returns and Allowances increases and Accounts Receivable decreases $450; Inventory increases and Cost of Goods Sold decreases $250",
        "Inventory decreases and Accounts Payable decreases $450; Cost of Goods Sold increases $250",
        "Cash decreases $450; Sales Revenue decreases $250; Inventory is unchanged"
      ],
      "correct": "Sales Returns and Allowances increases and Accounts Receivable decreases $450; Inventory increases and Cost of Goods Sold decreases $250",
      "explanation": "The customer no longer owes the selling price of the returned goods. Because the water bottles can be resold, their cost returns to Inventory and reduces Cost of Goods Sold.",
      "hint": "Trace both the selling price the customer no longer owes and the cost of the resalable goods returned to the shelves.",
      "statement_effect": "Net sales decrease $450 and expense decreases $250, so income decreases a net $200.",
      "event_id": "sales_return"
    },
    {
      "id": "sales_discount_effect",
      "phase": 3,
      "document": "Customer remittance",
      "title": "The customer pays promptly",
      "story": "The original sale transaction date was November 16, and the terms are 2/10, n/30. After the return, the customer owes $2,250. Payment arrives on November 24.",
      "prompt": "What amount is collected, and how does the discount affect the accounts?",
      "options": [
        "Collect $2,205; Accounts Receivable decreases $2,250 and Sales Discounts increases $45",
        "Collect $2,250; Accounts Receivable decreases $2,250 and Sales Discounts is unchanged",
        "Collect $2,196; Accounts Receivable decreases $2,250 and Inventory decreases $54"
      ],
      "correct": "Collect $2,205; Accounts Receivable decreases $2,250 and Sales Discounts increases $45",
      "explanation": "November 24 is within ten days of the November 16 sale date, so the 2% discount is $45 on the $2,250 amount due after the return. The customer pays $2,205, and Sales Discounts reduces net sales by $45.",
      "hint": "Count from the November 16 transaction date to the November 24 payment date, then apply the terms to the receivable remaining after the return.",
      "statement_effect": "Cash increases $2,205, Accounts Receivable becomes $0, and income decreases $45.",
      "event_id": "sales_discount"
    },
    {
      "id": "count_effect",
      "phase": 4,
      "document": "November 30 physical count sheet",
      "title": "The shelves and the record disagree",
      "story": "The perpetual record predicts 55 water bottles at $50 each, or $2,750. The physical count finds only 53 water bottles.",
      "prompt": "How should Gem City Goods reflect the shortage?",
      "options": [
        "Inventory decreases $100 and Cost of Goods Sold increases $100",
        "Inventory increases $100 and Sales Revenue increases $100",
        "Accounts Payable decreases $100 and Inventory is unchanged"
      ],
      "correct": "Inventory decreases $100 and Cost of Goods Sold increases $100",
      "explanation": "Two missing water bottles at $50 each create $100 of shrinkage. The physical count verifies what is actually on hand and brings the perpetual record down to that amount.",
      "hint": "Compare expected units with counted units, value the shortage at unit cost, and identify the overstated asset.",
      "statement_effect": "Assets and income decrease $100; Cost of Goods Sold increases $100.",
      "event_id": "shrinkage"
    }
  ],
  "questions": [
    {
      "id": "income_bridge",
      "prompt": "How does the completed merchandise cycle produce the case's income effect?",
      "options": [
        "Subtract Cost of Goods Sold and Freight-Out Expense from Net Sales",
        "Add ending Inventory to Net Sales, then subtract Accounts Payable",
        "Subtract the supplier payment from the cash collected from the customer"
      ],
      "correct": "Subtract Cost of Goods Sold and Freight-Out Expense from Net Sales",
      "explanation": "Net Sales reflects the sale after customer returns and discounts. Cost of Goods Sold and Freight-Out Expense are then subtracted to determine the $795 income effect.",
      "hint": "Begin with Net Sales, then identify which ending balances represent expenses of earning those sales."
    },
    {
      "id": "contra_revenue",
      "prompt": "Which events reduce Net Sales without changing the $2,700 balance in Sales Revenue?",
      "options": [
        "The customer return and the sales discount",
        "The supplier return and the purchase discount",
        "The inbound freight and the outbound freight"
      ],
      "correct": "The customer return and the sales discount",
      "explanation": "Sales Returns and Allowances and Sales Discounts are separate contra-revenue accounts. They reduce Net Sales while the original Sales Revenue remains visible.",
      "hint": "Separate supplier-side events from customer-side reductions of the amount earned from sales."
    },
    {
      "id": "cash_vs_income",
      "prompt": "Why is the $795 income effect different from the $1,855 decrease in Cash during the case?",
      "options": [
        "Cash reflects when amounts were paid or collected; income reflects Net Sales minus the related expenses",
        "Income always equals ending Cash minus opening Cash once Accounts Receivable reaches zero",
        "The difference exists only because the physical count changed the number of units on hand"
      ],
      "correct": "Cash reflects when amounts were paid or collected; income reflects Net Sales minus the related expenses",
      "explanation": "Paying the supplier reduces Cash but is not an immediate expense, while a credit sale creates revenue before collection. Cash movement and income therefore measure different parts of the story.",
      "hint": "List cash receipts and payments separately from the events that create revenue and expense."
    }
  ],
  "hero": [
    {
      "kind": "html",
      "text": "\n        <div class=\"hero\">\n          <div class=\"hero-kicker\">MERCHANDISING CASE</div>\n          <h1>Dock to Dollar</h1>\n          <p><span class=\"hero-accent\">One shipment. One customer order. One complete financial story.</span> Follow the merchandise, the documents, the accounts, and the statements.</p>\n        </div>\n        "
    }
  ],
  "screens": [
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Your assignment</div>"
          },
          {
            "kind": "header",
            "text": "Run one merchandise cycle for Gem City Goods"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Gem City Goods is a merchandiser preparing to sell a limited shipment of insulated water bottles. Use each business document to decide what happened, how the accounts changed, what the ending balances should be, and how the financial statements are affected.</p>"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"concept-grid\">\n          <div class=\"concept-card\"><div class=\"concept-number\">01</div><strong>Follow ownership</strong><span>Use FOB terms and delivery evidence.</span></div>\n          <div class=\"concept-card\"><div class=\"concept-number\">02</div><strong>Track inventory</strong><span>Include purchases, freight, returns, and discounts.</span></div>\n          <div class=\"concept-card\"><div class=\"concept-number\">03</div><strong>Trace each sale</strong><span>Connect revenue, receivables, inventory, and cost.</span></div>\n          <div class=\"concept-card\"><div class=\"concept-number\">04</div><strong>Verify the story</strong><span>Reconcile the physical count and statement effects.</span></div>\n        </div>\n        "
          },
          {
            "kind": "html",
            "text": "<div class=\"rule\"><strong>Working method:</strong> For every event, determine which accounts increase or decrease, calculate the resulting balances, and explain the financial-statement effect.</div>"
          },
          {
            "kind": "subheader",
            "text": "Opening running balances"
          },
          {
            "kind": "caption",
            "text": "Gem City Goods begins after issuing $10,000 of Common Stock for $10,000 cash; all other opening account balances are zero. Every account used in the case remains visible as the merchandise cycle unfolds."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "button",
            "label": "Open the receiving file",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Dock</div>"
          },
          {
            "kind": "header",
            "text": "Receiving dock"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Use freight terms to decide when ownership and risk move from seller to buyer.</p>"
          },
          {
            "kind": "progress",
            "value": 0.09090909090909091,
            "text": "Case decision 1 of 11 | Dock 1 of 1"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier invoice and carrier scan</div>\n          <h3>The shipment leaves the supplier</h3>\n          <p>Gem City Goods orders 100 insulated water bottles at $50 each. Terms are FOB shipping point. The carrier accepts the shipment at the supplier&#x27;s dock on November 2, and the water bottles arrive at Gem City Goods on November 3.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "When does Gem City Goods become the owner and assume the risk of loss?",
            "key": "widget_decision_ownership_inbound"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Dock</div>"
          },
          {
            "kind": "header",
            "text": "Receiving dock"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Use freight terms to decide when ownership and risk move from seller to buyer.</p>"
          },
          {
            "kind": "progress",
            "value": 0.09090909090909091,
            "text": "Case decision 1 of 11 | Dock 1 of 1"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier invoice and carrier scan</div>\n          <h3>The shipment leaves the supplier</h3>\n          <p>Gem City Goods orders 100 insulated water bottles at $50 each. Terms are FOB shipping point. The carrier accepts the shipment at the supplier&#x27;s dock on November 2, and the water bottles arrive at Gem City Goods on November 3.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Focus on the FOB term and the carrier's role. Separate the ownership date from arrival and payment."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Dock</div>"
          },
          {
            "kind": "header",
            "text": "Receiving dock"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Use freight terms to decide when ownership and risk move from seller to buyer.</p>"
          },
          {
            "kind": "progress",
            "value": 0.09090909090909091,
            "text": "Case decision 1 of 11 | Dock 1 of 1"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier invoice and carrier scan</div>\n          <h3>The shipment leaves the supplier</h3>\n          <p>Gem City Goods orders 100 insulated water bottles at $50 each. Terms are FOB shipping point. The carrier accepts the shipment at the supplier&#x27;s dock on November 2, and the water bottles arrive at Gem City Goods on November 3.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "caption",
            "text": "This ownership-and-timing decision does not change an account balance by itself."
          },
          {
            "kind": "success",
            "text": "Correct. FOB shipping point transfers ownership when the carrier accepts the goods from the seller. Arrival and payment occur later. The shipment establishes the transaction date, but Gem City Goods still needs the seller's invoice for the price, payment terms, and other details needed to record the purchase."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: The ownership point determines whose inventory is at risk while the water bottles are in transit."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.18181818181818182,
            "text": "Case decision 2 of 11 | Purchases 1 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Purchase invoice GCG-1103</div>\n          <h3>One hundred water bottles arrive</h3>\n          <p>The November 3 invoice totals $5,000 and is due later. The water bottles are accepted into the stockroom.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "How does receiving the inventory on account change the accounts?",
            "key": "widget_decision_purchase_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.18181818181818182,
            "text": "Case decision 2 of 11 | Purchases 1 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Purchase invoice GCG-1103</div>\n          <h3>One hundred water bottles arrive</h3>\n          <p>The November 3 invoice totals $5,000 and is due later. The water bottles are accepted into the stockroom.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Identify the resource received and determine whether Gem City Goods paid for it on that date."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.18181818181818182,
            "text": "Case decision 2 of 11 | Purchases 1 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Purchase invoice GCG-1103</div>\n          <h3>One hundred water bottles arrive</h3>\n          <p>The November 3 invoice totals $5,000 and is due later. The water bottles are accepted into the stockroom.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">100</strong><span class=\"account-delta positive\">+100</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta positive\">+$5,000</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta positive\">+$5,000</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. The company now controls $5,000 of merchandise and owes the supplier $5,000. The water bottles do not become Cost of Goods Sold until they are sold."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Assets increase $5,000 and liabilities increase $5,000; income is unchanged."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.2727272727272727,
            "text": "Case decision 3 of 11 | Purchases 2 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Carrier freight bill</div>\n          <h3>The buyer pays inbound transportation</h3>\n          <p>Because the terms are FOB shipping point, Gem City Goods pays the $80 cost to transport the water bottles from the supplier to its store.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">100</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "How should the $80 transportation cost affect the accounts?",
            "key": "widget_decision_freight_in_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.2727272727272727,
            "text": "Case decision 3 of 11 | Purchases 2 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Carrier freight bill</div>\n          <h3>The buyer pays inbound transportation</h3>\n          <p>Because the terms are FOB shipping point, Gem City Goods pays the $80 cost to transport the water bottles from the supplier to its store.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">100</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Ask whether this transportation cost brings merchandise in for sale or delivers sold goods to a customer."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.2727272727272727,
            "text": "Case decision 3 of 11 | Purchases 2 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Carrier freight bill</div>\n          <h3>The buyer pays inbound transportation</h3>\n          <p>Because the terms are FOB shipping point, Gem City Goods pays the $80 cost to transport the water bottles from the supplier to its store.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">100</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$9,920</strong><span class=\"account-delta negative\">−$80</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$5,080</strong><span class=\"account-delta positive\">+$80</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. A buyer's transportation cost is part of acquiring inventory. It becomes part of Inventory rather than an immediate operating expense."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: One asset increases while another asset decreases; total assets and income are unchanged."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.36363636363636365,
            "text": "Case decision 4 of 11 | Purchases 3 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier return authorization</div>\n          <h3>Twenty defective water bottles go back</h3>\n          <p>On November 5, the supplier approves a return of 20 defective water bottles. The invoice price was $50 per bottle, and Gem City Goods has not yet paid the invoice.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">100</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$9,920</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$5,080</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "What is the account effect of the $1,000 purchase return?",
            "key": "widget_decision_purchase_return_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.36363636363636365,
            "text": "Case decision 4 of 11 | Purchases 3 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier return authorization</div>\n          <h3>Twenty defective water bottles go back</h3>\n          <p>On November 5, the supplier approves a return of 20 defective water bottles. The invoice price was $50 per bottle, and Gem City Goods has not yet paid the invoice.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">100</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$9,920</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$5,080</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$5,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: The buyer has not paid yet. Trace both the merchandise sent back and the outstanding supplier obligation."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.36363636363636365,
            "text": "Case decision 4 of 11 | Purchases 3 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier return authorization</div>\n          <h3>Twenty defective water bottles go back</h3>\n          <p>On November 5, the supplier approves a return of 20 defective water bottles. The invoice price was $50 per bottle, and Gem City Goods has not yet paid the invoice.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta negative\">−20</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$9,920</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,080</strong><span class=\"account-delta negative\">−$1,000</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta negative\">−$1,000</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. The buyer sends merchandise back before paying. Inventory falls, and the amount owed to the supplier falls by the same invoice price."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Assets and liabilities each decrease $1,000; income is unchanged."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.45454545454545453,
            "text": "Case decision 5 of 11 | Purchases 4 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier payment screen</div>\n          <h3>The discount clock is still running</h3>\n          <p>The original purchase transaction date was November 3, and the terms are 2/10, n/30. After the return, $4,000 remains due. Gem City Goods pays on November 10.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$9,920</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,080</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "Which analysis correctly reflects the payment?",
            "key": "widget_decision_purchase_discount_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.45454545454545453,
            "text": "Case decision 5 of 11 | Purchases 4 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier payment screen</div>\n          <h3>The discount clock is still running</h3>\n          <p>The original purchase transaction date was November 3, and the terms are 2/10, n/30. After the return, $4,000 remains due. Gem City Goods pays on November 10.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$9,920</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,080</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Count from the November 3 transaction date to the November 10 payment date, then apply the terms to the amount remaining after the return."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Purchases</div>"
          },
          {
            "kind": "header",
            "text": "Purchase file"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Follow inventory from invoice through freight, return, and prompt payment.</p>"
          },
          {
            "kind": "progress",
            "value": 0.45454545454545453,
            "text": "Case decision 5 of 11 | Purchases 4 of 4"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Supplier payment screen</div>\n          <h3>The discount clock is still running</h3>\n          <p>The original purchase transaction date was November 3, and the terms are 2/10, n/30. After the return, $4,000 remains due. Gem City Goods pays on November 10.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta negative\">−$3,920</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta negative\">−$80</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta negative\">−$4,000</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. November 10 is within ten days of the November 3 purchase date, so the 2% discount applies to the $4,000 remaining after the return: $80. The company pays $3,920, removes the $4,000 obligation, and reduces the cost of Inventory by $80. The inventory's recorded value changes, but its quantity does not: 80 water bottles are still on hand."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Cash and liabilities decrease; Inventory also decreases $80. Income is unchanged until the merchandise is sold."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.5454545454545454,
            "text": "Case decision 6 of 11 | Sales 1 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer order and delivery confirmation</div>\n          <h3>The customer order is in transit</h3>\n          <p>A customer orders 30 insulated water bottles for $90 each on account. Terms are FOB destination. The carrier picks them up November 15 and confirms delivery November 16.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "When should Gem City Goods report the sale?",
            "key": "widget_decision_sale_recognition"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.5454545454545454,
            "text": "Case decision 6 of 11 | Sales 1 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer order and delivery confirmation</div>\n          <h3>The customer order is in transit</h3>\n          <p>A customer orders 30 insulated water bottles for $90 each on account. Terms are FOB destination. The carrier picks them up November 15 and confirms delivery November 16.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Focus on the FOB term and the evidence that the goods reached the customer, not the later cash collection."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.5454545454545454,
            "text": "Case decision 6 of 11 | Sales 1 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer order and delivery confirmation</div>\n          <h3>The customer order is in transit</h3>\n          <p>A customer orders 30 insulated water bottles for $90 each on account. Terms are FOB destination. The carrier picks them up November 15 and confirms delivery November 16.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "caption",
            "text": "This ownership-and-timing decision does not change an account balance by itself."
          },
          {
            "kind": "success",
            "text": "Correct. Under FOB destination, the seller retains ownership until delivery. The goods transfer to the customer on November 16, so that is when the sale is reported. Delivery establishes the transaction date, but Gem City Goods still needs the sales invoice for the selling price and its internal perpetual inventory record for the merchandise cost."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Reporting waits until the performance obligation is satisfied and the merchandise transfers to the customer."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.6363636363636364,
            "text": "Case decision 7 of 11 | Sales 2 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Sales invoice and perpetual inventory record</div>\n          <h3>Thirty water bottles reach the customer</h3>\n          <p>The delivered order has a selling price of $2,700 and a cost of $1,500. The customer will pay later.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "Which choice captures both effects of the sale?",
            "key": "widget_decision_sale_two_effects"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.6363636363636364,
            "text": "Case decision 7 of 11 | Sales 2 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Sales invoice and perpetual inventory record</div>\n          <h3>Thirty water bottles reach the customer</h3>\n          <p>The delivered order has a selling price of $2,700 and a cost of $1,500. The customer will pay later.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">80</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$4,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Separate the selling price from the merchandise cost and trace both sides of a perpetual-system sale."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.6363636363636364,
            "text": "Case decision 7 of 11 | Sales 2 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Sales invoice and perpetual inventory record</div>\n          <h3>Thirty water bottles reach the customer</h3>\n          <p>The delivered order has a selling price of $2,700 and a cost of $1,500. The customer will pay later.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">50</strong><span class=\"account-delta negative\">−30</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta positive\">+$2,700</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,500</strong><span class=\"account-delta negative\">−$1,500</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta positive\">+$2,700</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,500</strong><span class=\"account-delta positive\">+$1,500</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. A perpetual system records both the amount earned from the customer and the cost of the merchandise that left inventory."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Assets increase a net $1,200. Revenue increases $2,700, expense increases $1,500, and income increases $1,200."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.7272727272727273,
            "text": "Case decision 8 of 11 | Sales 3 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Outgoing delivery receipt</div>\n          <h3>The seller pays the delivery cost</h3>\n          <p>Gem City Goods pays $60 to deliver the FOB destination order to the customer.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">50</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "How does the seller's $60 outgoing transportation cost affect the accounts?",
            "key": "widget_decision_freight_out_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.7272727272727273,
            "text": "Case decision 8 of 11 | Sales 3 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Outgoing delivery receipt</div>\n          <h3>The seller pays the delivery cost</h3>\n          <p>Gem City Goods pays $60 to deliver the FOB destination order to the customer.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">50</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$6,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Ask whether this cost acquires inventory or delivers merchandise that has already been sold."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Sales</div>"
          },
          {
            "kind": "header",
            "text": "Sales floor"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Recognize the sale at the transfer point and trace both effects under a perpetual system.</p>"
          },
          {
            "kind": "progress",
            "value": 0.7272727272727273,
            "text": "Case decision 8 of 11 | Sales 3 of 3"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Outgoing delivery receipt</div>\n          <h3>The seller pays the delivery cost</h3>\n          <p>Gem City Goods pays $60 to deliver the FOB destination order to the customer.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">50</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$5,940</strong><span class=\"account-delta negative\">−$60</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta positive\">+$60</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. A seller's outgoing delivery cost is an operating expense, not part of the cost of inventory still on hand."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Assets and income each decrease $60; operating expenses increase $60."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Returns</div>"
          },
          {
            "kind": "header",
            "text": "Return desk"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Separate customer-side returns and discounts from the earlier supplier-side events.</p>"
          },
          {
            "kind": "progress",
            "value": 0.8181818181818182,
            "text": "Case decision 9 of 11 | Returns 1 of 2"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer return form</div>\n          <h3>Five resalable water bottles come back</h3>\n          <p>On November 19, the customer returns five water bottles. Their selling price was $450, their cost was $250, and they can be resold. The customer has not yet paid.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">50</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$5,940</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "Which choice captures both effects of the customer return?",
            "key": "widget_decision_sales_return_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Returns</div>"
          },
          {
            "kind": "header",
            "text": "Return desk"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Separate customer-side returns and discounts from the earlier supplier-side events.</p>"
          },
          {
            "kind": "progress",
            "value": 0.8181818181818182,
            "text": "Case decision 9 of 11 | Returns 1 of 2"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer return form</div>\n          <h3>Five resalable water bottles come back</h3>\n          <p>On November 19, the customer returns five water bottles. Their selling price was $450, their cost was $250, and they can be resold. The customer has not yet paid.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">50</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$5,940</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,500</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Trace both the selling price the customer no longer owes and the cost of the resalable goods returned to the shelves."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Returns</div>"
          },
          {
            "kind": "header",
            "text": "Return desk"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Separate customer-side returns and discounts from the earlier supplier-side events.</p>"
          },
          {
            "kind": "progress",
            "value": 0.8181818181818182,
            "text": "Case decision 9 of 11 | Returns 1 of 2"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer return form</div>\n          <h3>Five resalable water bottles come back</h3>\n          <p>On November 19, the customer returns five water bottles. Their selling price was $450, their cost was $250, and they can be resold. The customer has not yet paid.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">55</strong><span class=\"account-delta positive\">+5</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$5,940</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,250</strong><span class=\"account-delta negative\">−$450</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,750</strong><span class=\"account-delta positive\">+$250</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta positive\">+$450</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,250</strong><span class=\"account-delta negative\">−$250</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. The customer no longer owes the selling price of the returned goods. Because the water bottles can be resold, their cost returns to Inventory and reduces Cost of Goods Sold."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Net sales decrease $450 and expense decreases $250, so income decreases a net $200."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Returns</div>"
          },
          {
            "kind": "header",
            "text": "Return desk"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Separate customer-side returns and discounts from the earlier supplier-side events.</p>"
          },
          {
            "kind": "progress",
            "value": 0.9090909090909091,
            "text": "Case decision 10 of 11 | Returns 2 of 2"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer remittance</div>\n          <h3>The customer pays promptly</h3>\n          <p>The original sale transaction date was November 16, and the terms are 2/10, n/30. After the return, the customer owes $2,250. Payment arrives on November 24.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">55</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$5,940</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,750</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "What amount is collected, and how does the discount affect the accounts?",
            "key": "widget_decision_sales_discount_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Returns</div>"
          },
          {
            "kind": "header",
            "text": "Return desk"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Separate customer-side returns and discounts from the earlier supplier-side events.</p>"
          },
          {
            "kind": "progress",
            "value": 0.9090909090909091,
            "text": "Case decision 10 of 11 | Returns 2 of 2"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer remittance</div>\n          <h3>The customer pays promptly</h3>\n          <p>The original sale transaction date was November 16, and the terms are 2/10, n/30. After the return, the customer owes $2,250. Payment arrives on November 24.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">55</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$5,940</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$2,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,750</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Count from the November 16 transaction date to the November 24 payment date, then apply the terms to the receivable remaining after the return."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Returns</div>"
          },
          {
            "kind": "header",
            "text": "Return desk"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Separate customer-side returns and discounts from the earlier supplier-side events.</p>"
          },
          {
            "kind": "progress",
            "value": 0.9090909090909091,
            "text": "Case decision 10 of 11 | Returns 2 of 2"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">Customer remittance</div>\n          <h3>The customer pays promptly</h3>\n          <p>The original sale transaction date was November 16, and the terms are 2/10, n/30. After the return, the customer owes $2,250. Payment arrives on November 24.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">55</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta positive\">+$2,205</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta negative\">−$2,250</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,750</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta positive\">+$45</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. November 24 is within ten days of the November 16 sale date, so the 2% discount is $45 on the $2,250 amount due after the return. The customer pays $2,205, and Sales Discounts reduces net sales by $45."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Cash increases $2,205, Accounts Receivable becomes $0, and income decreases $45."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Count</div>"
          },
          {
            "kind": "header",
            "text": "Physical count"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Compare the perpetual record with what is actually on the shelves.</p>"
          },
          {
            "kind": "progress",
            "value": 1.0,
            "text": "Case decision 11 of 11 | Count 1 of 1"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">November 30 physical count sheet</div>\n          <h3>The shelves and the record disagree</h3>\n          <p>The perpetual record predicts 55 water bottles at $50 each, or $2,750. The physical count finds only 53 water bottles.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances before this decision. Changes appear after you check your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">55</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,750</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "radio",
            "label": "How should Gem City Goods reflect the shortage?",
            "key": "widget_decision_count_effect"
          },
          {
            "kind": "button",
            "label": "Check the account analysis",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Count</div>"
          },
          {
            "kind": "header",
            "text": "Physical count"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Compare the perpetual record with what is actually on the shelves.</p>"
          },
          {
            "kind": "progress",
            "value": 1.0,
            "text": "Case decision 11 of 11 | Count 1 of 1"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">November 30 physical count sheet</div>\n          <h3>The shelves and the record disagree</h3>\n          <p>The perpetual record predicts 55 water bottles at $50 each, or $2,750. The physical count finds only 53 water bottles.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances remain at their pre-event amounts while you revise your analysis."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">55</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,750</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,250</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "warning",
            "text": "Not quite. Hint: Compare expected units with counted units, value the shortage at unit cost, and identify the overstated asset."
          },
          {
            "kind": "button",
            "label": "Revise my analysis",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Count</div>"
          },
          {
            "kind": "header",
            "text": "Physical count"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">Compare the perpetual record with what is actually on the shelves.</p>"
          },
          {
            "kind": "progress",
            "value": 1.0,
            "text": "Case decision 11 of 11 | Count 1 of 1"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"case-card\">\n          <div class=\"document\">November 30 physical count sheet</div>\n          <h3>The shelves and the record disagree</h3>\n          <p>The perpetual record predicts 55 water bottles at $50 each, or $2,750. The physical count finds only 53 water bottles.</p>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "Running balances"
          },
          {
            "kind": "caption",
            "text": "Balances after this event. Green amounts increased; red amounts decreased."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">53</strong><span class=\"account-delta negative\">−2</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,650</strong><span class=\"account-delta negative\">−$100</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,350</strong><span class=\"account-delta positive\">+$100</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "success",
            "text": "Correct. Two missing water bottles at $50 each create $100 of shrinkage. The physical count verifies what is actually on hand and brings the perpetual record down to that amount."
          },
          {
            "kind": "info",
            "text": "Financial-statement effect: Assets and income decrease $100; Cost of Goods Sold increases $100."
          },
          {
            "kind": "button",
            "label": "Continue",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Financial story</div>"
          },
          {
            "kind": "header",
            "text": "Connect the running balances to the financial statements"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">The completed event trail has already produced the ending balances. Explain how those account balances combine into the final financial story.</p>"
          },
          {
            "kind": "subheader",
            "text": "Ending running balances"
          },
          {
            "kind": "caption",
            "text": "All accounts used in the case are shown before you make the statement connections."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">53</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,650</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,350</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "subheader",
            "text": "Financial-statement connections"
          },
          {
            "kind": "caption",
            "text": "The completed statements appear after all three conceptual connections are correct."
          },
          {
            "kind": "radio",
            "label": "How does the completed merchandise cycle produce the case's income effect?",
            "key": "widget_statement_income_bridge"
          },
          {
            "kind": "radio",
            "label": "Which events reduce Net Sales without changing the $2,700 balance in Sales Revenue?",
            "key": "widget_statement_contra_revenue"
          },
          {
            "kind": "radio",
            "label": "Why is the $795 income effect different from the $1,855 decrease in Cash during the case?",
            "key": "widget_statement_cash_vs_income"
          },
          {
            "kind": "button",
            "label": "Check the ending financial story",
            "primary": true
          }
        ],
        "wrong": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Financial story</div>"
          },
          {
            "kind": "header",
            "text": "Connect the running balances to the financial statements"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">The completed event trail has already produced the ending balances. Explain how those account balances combine into the final financial story.</p>"
          },
          {
            "kind": "subheader",
            "text": "Ending running balances"
          },
          {
            "kind": "caption",
            "text": "All accounts used in the case are shown before you make the statement connections."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">53</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,650</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,350</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "subheader",
            "text": "Financial-statement connections"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"feedback-row review\">\n          <div><div class=\"feedback-label\">Connection 1 - Review</div><div class=\"feedback-detail\">Hint: Begin with Net Sales, then identify which ending balances represent expenses of earning those sales.</div></div>\n          <div class=\"feedback-value\"></div>\n        </div>\n        "
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"feedback-row review\">\n          <div><div class=\"feedback-label\">Connection 2 - Review</div><div class=\"feedback-detail\">Hint: Separate supplier-side events from customer-side reductions of the amount earned from sales.</div></div>\n          <div class=\"feedback-value\"></div>\n        </div>\n        "
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"feedback-row review\">\n          <div><div class=\"feedback-label\">Connection 3 - Review</div><div class=\"feedback-detail\">Hint: List cash receipts and payments separately from the events that create revenue and expense.</div></div>\n          <div class=\"feedback-value\"></div>\n        </div>\n        "
          },
          {
            "kind": "warning",
            "text": "Some statement connections still need revision. Use the ending balances and the event trail to reconsider the financial story."
          },
          {
            "kind": "button",
            "label": "Revise the financial-statement connections",
            "primary": false
          }
        ],
        "correct": [
          {
            "kind": "html",
            "text": "<div class=\"eyebrow\">Financial story</div>"
          },
          {
            "kind": "header",
            "text": "Connect the running balances to the financial statements"
          },
          {
            "kind": "html",
            "text": "<p class=\"lead\">The completed event trail has already produced the ending balances. Explain how those account balances combine into the final financial story.</p>"
          },
          {
            "kind": "subheader",
            "text": "Ending running balances"
          },
          {
            "kind": "caption",
            "text": "All accounts used in the case are shown before you make the statement connections."
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">53</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,650</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,350</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "subheader",
            "text": "Financial-statement connections"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"feedback-row correct\">\n          <div><div class=\"feedback-label\">Connection 1 - Correct</div><div class=\"feedback-detail\">Net Sales reflects the sale after customer returns and discounts. Cost of Goods Sold and Freight-Out Expense are then subtracted to determine the $795 income effect.</div></div>\n          <div class=\"feedback-value\"></div>\n        </div>\n        "
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"feedback-row correct\">\n          <div><div class=\"feedback-label\">Connection 2 - Correct</div><div class=\"feedback-detail\">Sales Returns and Allowances and Sales Discounts are separate contra-revenue accounts. They reduce Net Sales while the original Sales Revenue remains visible.</div></div>\n          <div class=\"feedback-value\"></div>\n        </div>\n        "
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"feedback-row correct\">\n          <div><div class=\"feedback-label\">Connection 3 - Correct</div><div class=\"feedback-detail\">Paying the supplier reduces Cash but is not an immediate expense, while a credit sale creates revenue before collection. Cash movement and income therefore measure different parts of the story.</div></div>\n          <div class=\"feedback-value\"></div>\n        </div>\n        "
          },
          {
            "kind": "success",
            "text": "The merchandise, account balances, and financial-statement effects now tell one consistent story."
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"statement-grid\">\n          <div class=\"statement\">\n            <div class=\"statement-title\">Income Statement</div><div class=\"statement-period\">For the month ended November 30</div>\n            <div class=\"statement-line\"><span>Sales Revenue</span><span class=\"amount\">$2,700</span></div>\n            <div class=\"statement-line indent\"><span>Less: Sales Returns and Allowances</span><span class=\"amount\">$450</span></div>\n            <div class=\"statement-line indent\"><span>Less: Sales Discounts</span><span class=\"amount\">$45</span></div>\n            <div class=\"statement-line total\"><span>Net Sales</span><span class=\"amount\">$2,205</span></div>\n            <div class=\"statement-line\"><span>Cost of Goods Sold</span><span class=\"amount\">$1,350</span></div>\n            <div class=\"statement-line total\"><span>Gross Profit</span><span class=\"amount\">$855</span></div>\n            <div class=\"statement-section\">Operating Expenses</div>\n            <div class=\"statement-line indent\"><span>Freight-Out Expense</span><span class=\"amount\">$60</span></div>\n            <div class=\"statement-line grand\"><span>Net Income</span><span class=\"amount\">$795</span></div>\n          </div>\n          <div class=\"statement\">\n            <div class=\"statement-title\">Balance Sheet</div><div class=\"statement-period\">November 30</div>\n            <div class=\"statement-section\">Assets</div>\n            <div class=\"statement-line indent\"><span>Cash</span><span class=\"amount\">$8,145</span></div>\n            <div class=\"statement-line indent\"><span>Accounts Receivable</span><span class=\"amount\">$0</span></div>\n            <div class=\"statement-line indent\"><span>Inventory</span><span class=\"amount\">$2,650</span></div>\n            <div class=\"statement-line total\"><span>Total Assets</span><span class=\"amount\">$10,795</span></div>\n            <div class=\"statement-section\">Liabilities</div>\n            <div class=\"statement-line indent\"><span>Accounts Payable</span><span class=\"amount\">$0</span></div>\n            <div class=\"statement-line total\"><span>Total Liabilities</span><span class=\"amount\">$0</span></div>\n            <div class=\"statement-section\">Stockholders' Equity</div>\n            <div class=\"statement-line indent\"><span>Common Stock</span><span class=\"amount\">$10,000</span></div>\n            <div class=\"statement-line indent\"><span>Retained Earnings</span><span class=\"amount\">$795</span></div>\n            <div class=\"statement-line total\"><span>Total Stockholders' Equity</span><span class=\"amount\">$10,795</span></div>\n            <div class=\"statement-line grand\"><span>Total Liabilities and Stockholders' Equity</span><span class=\"amount\">$10,795</span></div>\n          </div>\n        </div>\n        "
          },
          {
            "kind": "button",
            "label": "Finish the case",
            "primary": true
          }
        ]
      }
    },
    {
      "variants": {
        "unanswered": [
          {
            "kind": "success",
            "text": "Case complete. The shipment has been traced from the supplier's dock to the financial statements."
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"score-grid\">\n          <div class=\"score-box\"><strong>2/2</strong><span>Ownership and timing first pass</span></div>\n          <div class=\"score-box\"><strong>9/9</strong><span>Account analysis first pass</span></div>\n          <div class=\"score-box\"><strong>3/3</strong><span>Statement connections first pass</span></div>\n        </div>\n        "
          },
          {
            "kind": "caption",
            "text": "First-pass decisions: 14 of 14 | Practice revisions used: 0 | Final mastery: complete"
          },
          {
            "kind": "subheader",
            "text": "Final running balances"
          },
          {
            "kind": "html",
            "text": "<div class=\"account-board\"><div class=\"account-box\"><span class=\"account-label\">Insulated Water Bottles on hand</span><strong class=\"account-value\">53</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cash</span><strong class=\"account-value\">$8,145</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Receivable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Inventory</span><strong class=\"account-value\">$2,650</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Accounts Payable</span><strong class=\"account-value\">$0</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Common Stock</span><strong class=\"account-value\">$10,000</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Revenue</span><strong class=\"account-value\">$2,700</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Returns and Allowances</span><strong class=\"account-value\">$450</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Sales Discounts</span><strong class=\"account-value\">$45</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Cost of Goods Sold</span><strong class=\"account-value\">$1,350</strong><span class=\"account-delta neutral\">—</span></div><div class=\"account-box\"><span class=\"account-label\">Freight-Out Expense</span><strong class=\"account-value\">$60</strong><span class=\"account-delta neutral\">—</span></div></div>"
          },
          {
            "kind": "subheader",
            "text": "Completed financial story"
          },
          {
            "kind": "html",
            "text": "\n        <div class=\"statement-grid\">\n          <div class=\"statement\">\n            <div class=\"statement-title\">Income Statement</div><div class=\"statement-period\">For the month ended November 30</div>\n            <div class=\"statement-line\"><span>Sales Revenue</span><span class=\"amount\">$2,700</span></div>\n            <div class=\"statement-line indent\"><span>Less: Sales Returns and Allowances</span><span class=\"amount\">$450</span></div>\n            <div class=\"statement-line indent\"><span>Less: Sales Discounts</span><span class=\"amount\">$45</span></div>\n            <div class=\"statement-line total\"><span>Net Sales</span><span class=\"amount\">$2,205</span></div>\n            <div class=\"statement-line\"><span>Cost of Goods Sold</span><span class=\"amount\">$1,350</span></div>\n            <div class=\"statement-line total\"><span>Gross Profit</span><span class=\"amount\">$855</span></div>\n            <div class=\"statement-section\">Operating Expenses</div>\n            <div class=\"statement-line indent\"><span>Freight-Out Expense</span><span class=\"amount\">$60</span></div>\n            <div class=\"statement-line grand\"><span>Net Income</span><span class=\"amount\">$795</span></div>\n          </div>\n          <div class=\"statement\">\n            <div class=\"statement-title\">Balance Sheet</div><div class=\"statement-period\">November 30</div>\n            <div class=\"statement-section\">Assets</div>\n            <div class=\"statement-line indent\"><span>Cash</span><span class=\"amount\">$8,145</span></div>\n            <div class=\"statement-line indent\"><span>Accounts Receivable</span><span class=\"amount\">$0</span></div>\n            <div class=\"statement-line indent\"><span>Inventory</span><span class=\"amount\">$2,650</span></div>\n            <div class=\"statement-line total\"><span>Total Assets</span><span class=\"amount\">$10,795</span></div>\n            <div class=\"statement-section\">Liabilities</div>\n            <div class=\"statement-line indent\"><span>Accounts Payable</span><span class=\"amount\">$0</span></div>\n            <div class=\"statement-line total\"><span>Total Liabilities</span><span class=\"amount\">$0</span></div>\n            <div class=\"statement-section\">Stockholders' Equity</div>\n            <div class=\"statement-line indent\"><span>Common Stock</span><span class=\"amount\">$10,000</span></div>\n            <div class=\"statement-line indent\"><span>Retained Earnings</span><span class=\"amount\">$795</span></div>\n            <div class=\"statement-line total\"><span>Total Stockholders' Equity</span><span class=\"amount\">$10,795</span></div>\n            <div class=\"statement-line grand\"><span>Total Liabilities and Stockholders' Equity</span><span class=\"amount\">$10,795</span></div>\n          </div>\n        </div>\n        "
          },
          {
            "kind": "subheader",
            "text": "The complete merchandising chain"
          },
          {
            "kind": "markdown",
            "text": "\n        1. Freight terms establish when ownership and risk transfer.\n        2. Purchase price, buyer-paid transportation, supplier returns, and purchase discounts determine inventory cost.\n        3. A sale changes both the customer-facing accounts and the merchandise-cost accounts.\n        4. Customer returns and sales discounts reduce net sales in different ways.\n        5. A physical count tests the perpetual record and exposes shrinkage.\n        6. Every account increase or decrease must flow into the ending balances and financial statements.\n        "
          },
          {
            "kind": "subheader",
            "text": "Debrief with your team"
          },
          {
            "kind": "markdown",
            "text": "\n        - Why did the inbound $80 become Inventory while the outbound $60 became an operating expense?\n        - Why did the customer return require two separate account effects?\n        - Why is a physical count still necessary when the company maintains a perpetual inventory record?\n        - Which single event was easiest to overlook when calculating the final income effect?\n        "
          },
          {
            "kind": "button",
            "label": "Start over",
            "primary": false
          }
        ]
      }
    }
  ]
};
