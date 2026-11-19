/**
 * Sample rows for the hero "reconciliation ledger" illustration.
 * Entirely fictional. The caption must always be shown with the illustration.
 */

export type LedgerStatus = 'verified' | 'candidate' | 'excluded';

export interface LedgerRow {
  item: string;
  reference: string;
  finding: string;
  amount: string;
  status: LedgerStatus;
}

export interface LedgerIllustration {
  label: string;
  title: string;
  columns: { item: string; outcome: string };
  statusLabels: Record<LedgerStatus, string>;
  rows: LedgerRow[];
  caption: string;
}

export const ledgerIllustration: LedgerIllustration = {
  label: 'Reconciliation ledger',
  title: 'Supplier account review',
  columns: { item: 'Item and finding', outcome: 'Amount / status' },
  statusLabels: {
    verified: 'Verified',
    candidate: 'Candidate',
    excluded: 'Excluded',
  },
  rows: [
    {
      item: 'Supplier credit note',
      reference: 'CN-20418',
      finding: 'Returned stock, credit never applied',
      amount: '£1,284.60',
      status: 'verified',
    },
    {
      item: 'Invoice',
      reference: 'INV-77310',
      finding: 'Paid twice, eleven days apart',
      amount: '£3,912.00',
      status: 'verified',
    },
    {
      item: 'Rebate tier 2',
      reference: 'RB-Q3',
      finding: 'Threshold met, rebate not claimed',
      amount: '£642.18',
      status: 'candidate',
    },
    {
      item: 'Statement balance',
      reference: 'ST-0925',
      finding: 'Difference to ledger unresolved',
      amount: '£2,075.40',
      status: 'candidate',
    },
    {
      item: 'Pricing credit',
      reference: 'CN-19987',
      finding: 'Already credited on a later invoice',
      amount: '£418.25',
      status: 'excluded',
    },
  ],
  caption: 'Illustrative example. Not client data.',
};
