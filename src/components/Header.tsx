import { navigation, site } from '../content/site';
import { uiText } from '../lib/ui-text';
import { BrandMark } from './BrandMark';
import { Icon } from './Icon';

export function Wordmark({ descriptor = true }: { descriptor?: boolean }) {
  return (
    <a className="wordmark" href="/">
      <BrandMark />
      <span className="wordmark-text">
        <span className="wordmark-name">{site.brand}</span>
        {descriptor ? <span className="wordmark-descriptor">{uiText.brandDescriptor}</span> : null}
      </span>
    </a>
  );
}

export function Header() {
  return (
    <header className="site-header" data-site-header="">
      <div className="container site-header-inner">
        <Wordmark />
        <button
          type="button"
          className="nav-toggle"
          aria-expanded="false"
          aria-controls="site-nav"
          data-nav-toggle=""
        >
          <Icon name="menu" size={22} className="nav-toggle-open" />
          <Icon name="close" size={22} className="nav-toggle-close" />
          <span className="nav-toggle-label">{uiText.menuButton}</span>
        </button>
        <nav id="site-nav" className="site-nav" aria-label={uiText.primaryNavLabel}>
          <ul className="site-nav-list">
            {navigation.primary.map((link) => (
              <li key={link.href}>
                <a className="site-nav-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-primary btn-sm site-nav-cta" href={navigation.cta.href}>
            {navigation.cta.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
