import type { ReactNode } from 'react';
import { company, site } from '../content/site';
import { uiText } from '../lib/ui-text';
import { Footer } from './Footer';
import { Header } from './Header';

/** Built asset URLs injected by the prerenderer (production) or dev server. */
export interface PageAssets {
  styles: string[];
  scripts: string[];
  fontPreloads: string[];
}

export interface PageMeta {
  /** Route path, e.g. "/" or "/privacy/". */
  path: string;
  title: string;
  description: string;
  /** Unknown-route page: no canonical URL, not indexed. */
  noindex?: boolean;
}

interface DocumentProps {
  meta: PageMeta;
  assets: PageAssets;
  year: number;
  children: ReactNode;
}

function organisationJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.tradingName,
    legalName: company.legalName,
    url: `${site.origin}/`,
    email: company.email,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'Companies House company number',
      value: company.companyNumber,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.registeredOffice.join(', '),
      addressCountry: 'GB',
    },
    sameAs: [company.companiesHouseUrl],
  };
  // Escape "<" so the JSON can never close the script element.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function Document({ meta, assets, year, children }: DocumentProps) {
  const canonical = `${site.origin}${meta.path}`;
  const ogImage = `${site.origin}${site.ogImage}`;
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {meta.noindex ? (
          <meta name="robots" content="noindex" />
        ) : (
          <link rel="canonical" href={canonical} />
        )}
        <meta name="theme-color" content={site.themeColor} />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={site.brand} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        {meta.noindex ? null : <meta property="og:url" content={canonical} />}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={site.ogImageAlt} />
        <meta property="og:locale" content={site.locale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={site.ogImageAlt} />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {assets.fontPreloads.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        {assets.styles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <noscript>
          <link rel="stylesheet" href="/noscript.css" />
        </noscript>
        {assets.scripts.map((src) => (
          <script key={src} type="module" src={src} />
        ))}
        {meta.path === '/' ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: organisationJsonLd() }}
          />
        ) : null}
      </head>
      <body>
        <a className="skip-link" href="#main">
          {uiText.skipLink}
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer year={year} />
      </body>
    </html>
  );
}
