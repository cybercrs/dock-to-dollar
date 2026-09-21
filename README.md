# Dock to Dollar

Dock to Dollar is a holistic merchandising Streamlit activity for introductory accounting. Students follow one shipment of insulated water bottles for a fictional retailer from supplier shipment through purchase, freight, supplier return, purchase discount, customer sale, outgoing delivery, customer return, sales discount, physical count, and financial-statement reconciliation.

The activity is framed entirely through account increases and decreases, ending account balances, and financial-statement effects. It does not ask students to prepare journal entries, post to a ledger, or use debit-and-credit mechanics.

## Learning sequence

1. Apply FOB shipping point and FOB destination to ownership, risk, freight responsibility, and sales recognition.
2. Determine how purchases, buyer-paid freight, purchase returns, and purchase discounts affect Inventory, Cash, and Accounts Payable.
3. Trace both effects of a sale under a perpetual inventory system.
4. Distinguish customer returns and sales discounts from supplier-side events.
5. Reconcile the perpetual inventory record to a physical count and identify shrinkage.
6. Read the final running balances and explain how contra-revenue accounts, merchandise costs, delivery expense, and cash timing connect to the financial statements.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Test

```bash
python -m unittest discover -s tests -v
python -m py_compile streamlit_app.py dock_to_dollar/*.py
```

## Privacy and progress

The app requires no login, database, or student name. It stores only compact answer selections, in-progress drafts, activity position, a stable answer-order seed, and scoring flags in a validated URL parameter so browser refreshes can restore progress without reshuffling choices. No written response or identifying information is included.

## Deployment

The repository is ready for GitHub-based Streamlit Community Cloud deployment with `streamlit_app.py` as the application file. Public deployment should occur only after local interaction testing and instructor approval.
