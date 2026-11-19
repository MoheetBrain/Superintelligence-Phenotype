import { company, home } from '../content/site';
import type { SectionIntro as SectionIntroContent } from '../content/types';
import { Icon, IconTile } from '../components/Icon';
import { LedgerIllustration } from '../components/LedgerIllustration';
import { uiText } from '../lib/ui-text';

function SectionIntro({ intro, className }: { intro: SectionIntroContent; className?: string }) {
  return (
    <header className={className ? `section-intro ${className}` : 'section-intro'}>
      <p className="eyebrow">{intro.eyebrow}</p>
      <h2 id={`${intro.id}-heading`}>{intro.heading}</h2>
      {intro.lede ? <p className="lede">{intro.lede}</p> : null}
    </header>
  );
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function Hero() {
  const { hero } = home;
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-heading">{hero.headline}</h1>
          <p className="hero-lede">{hero.lede}</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="btn btn-secondary btn-lg" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
              <Icon name="arrow-right" size={18} />
            </a>
          </div>
          <p className="hero-note">
            <Icon name="shield-check" size={20} />
            <span>{hero.note}</span>
          </p>
        </div>
        <div className="hero-visual">
          <LedgerIllustration />
        </div>
      </div>
    </section>
  );
}

function Recover() {
  const { recover } = home;
  return (
    <section
      id={recover.id}
      className="section section-alt"
      aria-labelledby={`${recover.id}-heading`}
    >
      <div className="container">
        <SectionIntro intro={recover} />
        <div className="ruled-grid recover-grid">
          {recover.cards.map((card) => (
            <article key={card.title} className="card">
              <IconTile name={card.icon} />
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              {card.examples?.length ? (
                <ul className="card-examples">
                  {card.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
          <div className="card card-callout">
            <span className="callout-rule" aria-hidden="true" />
            <h3>{recover.callout.heading}</h3>
            <p>{recover.callout.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function How() {
  const { how } = home;
  const { commercial } = how;
  return (
    <section id={how.id} className="section" aria-labelledby={`${how.id}-heading`}>
      <div className="container">
        <SectionIntro intro={how} />
        <ol className="steps">
          {how.steps.map((step) => (
            <li key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="terms">
          <div className="terms-main">
            <h3 id="commercial-heading" className="terms-heading">
              {commercial.heading}
            </h3>
            <ul className="pillars">
              {commercial.pillars.map((pillar) => (
                <li key={pillar}>
                  <span className="pillar-check">
                    <Icon name="check" size={16} />
                  </span>
                  {pillar}
                </li>
              ))}
            </ul>
            {commercial.body.map((paragraph) => (
              <p key={paragraph} className="terms-body">
                {paragraph}
              </p>
            ))}
          </div>
          <dl className="arrangements">
            {commercial.arrangements.map((arrangement) => (
              <div key={arrangement.title} className="arrangement">
                <dt>{arrangement.title}</dt>
                <dd>{arrangement.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Why() {
  const { why } = home;
  return (
    <section id={why.id} className="section section-alt" aria-labelledby={`${why.id}-heading`}>
      <div className="container split">
        <SectionIntro intro={why} className="split-intro" />
        <div className="principles">
          {why.principles.map((principle) => (
            <article key={principle.title} className="principle">
              <IconTile name={principle.icon} />
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sectors() {
  const { sectors } = home;
  return (
    <section id={sectors.id} className="section" aria-labelledby={`${sectors.id}-heading`}>
      <div className="container">
        <SectionIntro intro={sectors} />
        <ul className="sector-grid">
          {sectors.sectors.map((sector) => (
            <li key={sector.name} className="sector">
              <IconTile name={sector.icon} />
              <div>
                <h3>{sector.name}</h3>
                <p>{sector.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="sector-disclaimer">
          <Icon name="info" size={16} />
          <span>{sectors.disclaimer}</span>
        </p>
        <div className="auditors">
          <div className="auditors-heading-wrap">
            <IconTile name="briefcase" />
            <h3>{sectors.auditors.heading}</h3>
          </div>
          <p>{sectors.auditors.body}</p>
        </div>
      </div>
    </section>
  );
}

function About() {
  const { about } = home;
  return (
    <section id={about.id} className="section section-alt" aria-labelledby={`${about.id}-heading`}>
      <div className="container about-grid">
        <div className="about-copy">
          <SectionIntro intro={about} />
          <div className="prose">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <dl className="facts">
          {about.facts.map((fact) => (
            <div key={fact.label} className="fact">
              <dt>{fact.label}</dt>
              <dd>
                {fact.href ? (
                  <a href={fact.href}>
                    {fact.value}
                    {isExternal(fact.href) ? (
                      <>
                        <Icon name="arrow-up-right" size={16} />
                        <span className="visually-hidden"> {uiText.opensExternalSite}</span>
                      </>
                    ) : null}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Contact() {
  const { contact } = home;
  const { form } = contact;
  return (
    <section
      id={contact.id}
      className="section section-dark"
      aria-labelledby={`${contact.id}-heading`}
    >
      <div className="container contact-grid">
        <div className="contact-copy">
          <SectionIntro intro={contact} />
          <a className="btn btn-light btn-lg contact-cta" href={contact.primaryCta.href}>
            <Icon name="mail" size={20} />
            {contact.primaryCta.label}
          </a>
          <p className="contact-direct">
            <span className="contact-direct-label">{contact.emailLabel}</span>
            <a className="contact-email" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
        </div>

        <div className="composer" data-composer-panel="">
          <h3 id="composer-heading" className="composer-heading">
            {form.heading}
          </h3>
          <p className="composer-intro">
            {form.intro} {uiText.allFieldsRequired}
          </p>
          <form
            className="composer-form"
            aria-labelledby="composer-heading"
            action={`mailto:${company.email}`}
            method="post"
            encType="text/plain"
            data-composer=""
            data-mailto-to={company.email}
            data-mailto-subject={form.emailSubject}
          >
            <div className="field-row">
              <div className="field">
                <label htmlFor="enquiry-name">{form.fields.name}</label>
                <input id="enquiry-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="enquiry-company">{form.fields.company}</label>
                <input
                  id="enquiry-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="enquiry-email">{form.fields.email}</label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="enquiry-message">{form.fields.message}</label>
              <textarea
                id="enquiry-message"
                name="message"
                rows={5}
                placeholder={form.fields.messagePlaceholder}
                required
              />
            </div>
            <div className="composer-actions">
              <button type="submit" className="btn btn-primary btn-lg">
                <Icon name="mail" size={20} />
                {form.submitLabel}
              </button>
            </div>
            <div className="composer-notes">
              <p>
                <Icon name="info" size={16} />
                <span>{form.behaviourNote}</span>
              </p>
              <p>
                <Icon name="lock" size={16} />
                <span>{form.confidentialityNote}</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Recover />
      <How />
      <Why />
      <Sectors />
      <About />
      <Contact />
    </>
  );
}
