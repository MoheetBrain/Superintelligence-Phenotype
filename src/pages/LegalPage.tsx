import type { LegalDocument } from '../content/types';
import { formatLongDate, uniqueSlugs } from '../lib/format';
import { uiText } from '../lib/ui-text';

export function LegalPage({ doc }: { doc: LegalDocument }) {
  const ids = uniqueSlugs(
    doc.sections.map((section) => section.heading),
    'section-',
  );
  const showContents = doc.sections.length > 1;
  return (
    <article className="legal" aria-labelledby="legal-title">
      <header className="legal-header">
        <div className="container">
          <h1 id="legal-title">{doc.title}</h1>
          <p className="legal-updated">
            {uiText.lastUpdated}{' '}
            <time dateTime={doc.lastUpdated}>{formatLongDate(doc.lastUpdated)}</time>
          </p>
        </div>
      </header>
      <div className={`container legal-layout${showContents ? '' : ' legal-layout-single'}`}>
        {showContents ? (
          <nav className="legal-contents" aria-labelledby="legal-contents-heading">
            <h2 id="legal-contents-heading" className="legal-contents-heading">
              {uiText.onThisPage}
            </h2>
            <ol>
              {doc.sections.map((section, index) => (
                <li key={ids[index]}>
                  <a href={`#${ids[index]}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="legal-body prose">
          {doc.intro.map((paragraph, index) => (
            <p key={index} className="legal-intro">
              {paragraph}
            </p>
          ))}
          {doc.sections.map((section, index) => (
            <section key={ids[index]} id={ids[index]} aria-labelledby={`${ids[index]}-heading`}>
              <h2 id={`${ids[index]}-heading`}>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
              {section.list?.length ? (
                <ul>
                  {section.list.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
