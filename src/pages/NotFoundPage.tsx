import { Icon } from '../components/Icon';
import { uiText } from '../lib/ui-text';

export function NotFoundPage() {
  const text = uiText.notFound;
  return (
    <section className="not-found" aria-labelledby="not-found-heading">
      <div className="container not-found-inner">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1 id="not-found-heading">{text.title}</h1>
        <p className="lede">{text.body}</p>
        <a className="btn btn-primary btn-lg" href="/">
          {text.homeLink}
          <Icon name="arrow-right" size={18} />
        </a>
      </div>
    </section>
  );
}
