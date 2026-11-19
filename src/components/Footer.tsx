import { company, navigation } from '../content/site';
import { toDisplayCase } from '../lib/format';
import { uiText } from '../lib/ui-text';
import { Wordmark } from './Header';

export function Footer({ year }: { year: number }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark descriptor={false} />
            <p className="footer-relationship">{company.relationship}</p>
          </div>
          <nav className="footer-nav" aria-label={uiText.footerNavLabel}>
            <ul>
              {navigation.footer.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-legal">
          <p>
            <span className="footer-legal-item footer-legal-name">{company.legalName}</span>
            <span className="footer-sep" aria-hidden="true">
              ·
            </span>
            <span className="footer-legal-item">
              {uiText.companyNumberLabel}{' '}
              <a href={company.companiesHouseUrl}>{company.companyNumber}</a>
            </span>
            {company.jurisdiction ? (
              <>
                <span className="footer-sep" aria-hidden="true">
                  ·
                </span>
                <span className="footer-legal-item">
                  {uiText.registeredInPrefix} {company.jurisdiction}
                </span>
              </>
            ) : null}
          </p>
          <p>
            {uiText.registeredOfficeLabel} {company.registeredOffice.join(', ')}
          </p>
          <p>
            {uiText.copyrightSymbol} {year} {toDisplayCase(company.legalName)}
          </p>
        </div>
      </div>
    </footer>
  );
}
