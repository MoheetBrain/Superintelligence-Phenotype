/**
 * Content contract between the copy (src/content/*.ts) and the interface (src/components, src/pages).
 * Copy lives only in content modules; components never hard-code marketing or legal text.
 */

/** Icon names the interface maps to lucide-react components (rendered to inline SVG at build time). */
export type IconName =
  | 'receipt'
  | 'copy'
  | 'percent'
  | 'file-search'
  | 'git-merge'
  | 'search'
  | 'shield-check'
  | 'scale'
  | 'file-check'
  | 'lock'
  | 'handshake'
  | 'target'
  | 'boxes'
  | 'hard-hat'
  | 'shopping-cart'
  | 'truck'
  | 'factory'
  | 'briefcase'
  | 'mail';

export interface Link {
  label: string;
  href: string;
}

export interface SiteMeta {
  /** Public trading brand, e.g. "Hamiltonian Recovery". */
  brand: string;
  /** Canonical origin without trailing slash, e.g. "https://superintel.site". */
  origin: string;
  /** Default <title> for the home page. */
  title: string;
  /** Default meta description. */
  description: string;
  /** Path (from origin) of the 1200×630 Open Graph image. */
  ogImage: string;
  ogImageAlt: string;
  locale: string;
  themeColor: string;
}

export interface Company {
  legalName: string;
  tradingName: string;
  /** e.g. "Hamiltonian Recovery is a service of Hamiltonian Labs Ltd." */
  relationship: string;
  companyNumber: string;
  /** Only set when confirmed by Companies House, e.g. "England and Wales"; otherwise null. */
  jurisdiction: string | null;
  companyType: string;
  /** Registered office exactly as on the register, one line per element. */
  registeredOffice: string[];
  incorporated: string;
  website: string;
  email: string;
  companiesHouseUrl: string;
  /** ISO date the register was checked. */
  verifiedOn: string;
}

export interface Hero {
  eyebrow: string;
  headline: string;
  lede: string;
  primaryCta: Link;
  secondaryCta: Link;
  /** Short qualifying line under the CTAs. */
  note: string;
}

export interface SectionIntro {
  /** Anchor id used by navigation, e.g. "recover". */
  id: string;
  eyebrow: string;
  heading: string;
  lede?: string;
}

export interface Card {
  icon: IconName;
  title: string;
  body: string;
  /** Optional short examples rendered as a compact list. */
  examples?: string[];
}

export interface Step {
  number: string;
  title: string;
  body: string;
}

export interface Callout {
  heading: string;
  body: string;
}

export interface CommercialTerms {
  heading: string;
  pillars: string[];
  body: string[];
  arrangements: { title: string; body: string }[];
}

export interface Sector {
  icon: IconName;
  name: string;
  body: string;
}

export interface Fact {
  label: string;
  value: string;
  href?: string;
}

export interface ContactSection extends SectionIntro {
  primaryCta: Link;
  emailLabel: string;
  form: {
    heading: string;
    intro: string;
    fields: {
      name: string;
      company: string;
      email: string;
      message: string;
      messagePlaceholder: string;
    };
    submitLabel: string;
    /** Explains exactly what happens on submit (e.g. opens the visitor's email client). */
    behaviourNote: string;
    /** Warning not to send ledgers or confidential documents through the website. */
    confidentialityNote: string;
    /** Subject line used for the composed email. */
    emailSubject: string;
  };
}

export interface HomeContent {
  hero: Hero;
  recover: SectionIntro & { cards: Card[]; callout: Callout };
  how: SectionIntro & { steps: Step[]; commercial: CommercialTerms };
  why: SectionIntro & { principles: Card[] };
  sectors: SectionIntro & { sectors: Sector[]; auditors: Callout; disclaimer: string };
  about: SectionIntro & { paragraphs: string[]; facts: Fact[] };
  contact: ContactSection;
}

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  /** Route path, e.g. "/privacy/". */
  path: string;
  title: string;
  metaDescription: string;
  /** ISO date. */
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
}

export interface Navigation {
  primary: Link[];
  cta: Link;
  footer: Link[];
}
