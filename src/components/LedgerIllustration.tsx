import { ledgerIllustration as ledger } from '../content/illustration';
import { Icon } from './Icon';

/** Restrained, static "reconciliation ledger" card for the hero. Fictional rows only. */
export function LedgerIllustration() {
  return (
    <figure className="ledger" aria-labelledby="ledger-caption">
      <div className="ledger-head">
        <p className="ledger-label">{ledger.label}</p>
        <p className="ledger-title">{ledger.title}</p>
      </div>
      <table className="ledger-table">
        <thead>
          <tr>
            <th scope="col">{ledger.columns.item}</th>
            <th scope="col" className="ledger-col-outcome">
              {ledger.columns.outcome}
            </th>
          </tr>
        </thead>
        <tbody>
          {ledger.rows.map((row) => (
            <tr key={row.reference} className={`ledger-row is-${row.status}`}>
              <td className="ledger-item">
                <span className="ledger-item-name">
                  {row.item} <span className="ledger-ref">{row.reference}</span>
                </span>
                <span className="ledger-finding">{row.finding}</span>
              </td>
              <td className="ledger-outcome">
                <span className="ledger-amount">{row.amount}</span>
                <span className={`status status-${row.status}`}>
                  {row.status === 'verified' ? <Icon name="check" size={14} /> : null}
                  {ledger.statusLabels[row.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption id="ledger-caption" className="ledger-caption">
        <Icon name="info" size={16} />
        {ledger.caption}
      </figcaption>
    </figure>
  );
}
