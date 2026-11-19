import type { Company, HomeContent, Navigation, SiteMeta } from './types';

export const site: SiteMeta = {
  brand: 'Hamiltonian Recovery',
  origin: 'https://superintel.site',
  title: 'Hamiltonian Recovery | Supplier-account recovery and reconciliation',
  description:
    'Independent reconciliation technology for UK businesses: overlooked supplier credits, duplicate payments and unclaimed rebates. A service of Hamiltonian Labs Ltd.',
  ogImage: '/og-image.png',
  ogImageAlt: 'Hamiltonian Recovery: recover money hidden in your supplier accounts.',
  locale: 'en_GB',
  themeColor: '#0b1f33',
};

export const company: Company = {
  legalName: 'HAMILTONIAN LABS LTD',
  tradingName: 'Hamiltonian Recovery',
  relationship: 'Hamiltonian Recovery is a service of Hamiltonian Labs Ltd.',
  companyNumber: '17347944',
  // Confirmed 2026-11-19 from the Certificate of Incorporation and form IN01 filed at Companies House
  // (20 July 2026): "the situation of its registered office is in England and Wales". See docs/CONTENT_REVIEW.md.
  jurisdiction: 'England and Wales',
  companyType: 'Private limited company',
  // Joined with ', ' this reproduces the register entry exactly:
  // "10 Westway, Room 3.28, London, Acton, United Kingdom, W12 0DD". Line grouping follows form IN01.
  registeredOffice: ['10 Westway, Room 3.28', 'London, Acton', 'United Kingdom', 'W12 0DD'],
  incorporated: '20 July 2026',
  website: 'https://www.hamiltonianlabs.co/',
  email: 'moheet@hamiltonianlabs.co',
  companiesHouseUrl: 'https://find-and-update.company-information.service.gov.uk/company/17347944',
  verifiedOn: '2026-11-19',
};

const enquirySubject = 'Confidential Recovery Review enquiry';

export const navigation: Navigation = {
  primary: [
    { label: 'What We Recover', href: '/#recover' },
    { label: 'How It Works', href: '/#how' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ],
  cta: { label: 'Request a Review', href: '/#contact' },
  footer: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Website Terms', href: '/terms/' },
    { label: 'Contact', href: '/#contact' },
  ],
};

export const home: HomeContent = {
  hero: {
    eyebrow: 'Supplier-account recovery and reconciliation',
    headline: 'Recover money hidden in your supplier accounts.',
    lede: 'Independent reconciliation technology helps businesses identify potentially overlooked supplier credits, duplicate payments and contractual discrepancies.',
    primaryCta: { label: 'Request a Confidential Recovery Review', href: '/#contact' },
    secondaryCta: { label: 'How It Works', href: '/#how' },
    note: 'Each finding is checked against supporting evidence before any recovery action is proposed. You decide what is pursued.',
  },

  recover: {
    id: 'recover',
    eyebrow: 'What we recover',
    heading: 'Where money can be lost in high-volume supplier accounts',
    lede: 'Large purchasing operations process thousands of invoices, credit notes, payments and adjustments each year. Some items can remain unresolved. A review is designed to find and verify them.',
    cards: [
      {
        icon: 'receipt',
        title: 'Unapplied supplier credit notes',
        body: 'Credit notes for returns, damaged goods or pricing adjustments that appear never to have been refunded, offset against a later invoice or otherwise settled.',
      },
      {
        icon: 'copy',
        title: 'Duplicate and incorrect payments',
        body: 'Invoices paid more than once, payments above the agreed price and payments made to the wrong supplier account.',
      },
      {
        icon: 'percent',
        title: 'Supplier rebates and contractual entitlements',
        body: 'Volume rebates, discounts and allowances agreed with suppliers that appear unclaimed, or miscalculated against eligible purchases.',
      },
      {
        icon: 'git-merge',
        title: 'Post-acquisition reconciliation',
        body: 'Supplier ledgers inherited through an acquisition, including duplicate supplier records and historical balances not reconciled when systems were combined.',
      },
      {
        icon: 'file-search',
        title: 'Supplier statements and outstanding credits',
        body: 'Differences between supplier statements and your own ledger, including credits shown on the supplier’s statement that have not been received or applied.',
      },
    ],
    callout: {
      heading: 'An anomaly is not a recovery',
      body: 'A credit that has already been recognised, claimed, scheduled for settlement or previously recovered is not a new recovery. We report only items that remain unresolved after verification, so that anything reported is genuinely additional.',
    },
  },

  how: {
    id: 'how',
    eyebrow: 'How it works',
    heading: 'A scoped review, evidence first',
    lede: 'Each engagement follows four stages, with the scope agreed in advance with your finance team.',
    steps: [
      {
        number: '01',
        title: 'Define the scope',
        body: 'Agree a limited historical review with your finance team: the entities, suppliers, periods and records to be included.',
      },
      {
        number: '02',
        title: 'Analyse the records',
        body: 'Reconcile the relevant invoices, supplier accounts, payments and credit notes to identify candidate discrepancies.',
      },
      {
        number: '03',
        title: 'Verify the findings',
        body: 'Check each candidate against supporting evidence and existing claims, removing anything already recognised, claimed or resolved.',
      },
      {
        number: '04',
        title: 'Recover and reconcile',
        body: 'You approve any recovery action before it is taken. Fees are as set out in the agreed contract and, where so agreed, linked to verified, realised recoveries.',
      },
    ],
    commercial: {
      heading: 'Commercial terms',
      pillars: [
        'Performance-aligned fees',
        'Independently verified findings',
        'Client-controlled recovery decisions',
      ],
      body: [
        'Contingency-fee arrangements are available for suitable recovery engagements, subject to an agreed scope and contract.',
        'Other work, such as a proof-of-value review or specialist reconciliation, may be charged on a different basis. Fees, scope and responsibilities are set out in writing before any review begins.',
      ],
      arrangements: [
        {
          title: 'Proof-of-value review',
          body: 'A limited review of a defined period, entity or supplier group.',
        },
        {
          title: 'Recovery engagement',
          body: 'A broader review in which fees may be linked to verified, realised recoveries, where agreed in the contract.',
        },
        {
          title: 'Specialist reconciliation',
          body: 'Analytical support for a specific reconciliation problem, such as a post-acquisition ledger.',
        },
        {
          title: 'Recovery-audit partnership',
          body: 'Second-pass reconciliation technology for established recovery-audit firms, on terms agreed case by case.',
        },
      ],
    },
  },

  why: {
    id: 'why',
    eyebrow: 'Our approach',
    heading: 'Designed for finance teams who need to rely on the result',
    principles: [
      {
        icon: 'search',
        title: 'Evidence-led analysis',
        body: 'Each potential finding is traced to the underlying invoices, credit notes, statements and payments.',
      },
      {
        icon: 'target',
        title: 'Clearly scoped reviews',
        body: 'Periods, entities and record types are agreed in writing before work begins.',
      },
      {
        icon: 'file-check',
        title: 'Explainable findings',
        body: 'Each discrepancy is documented so your team can see why it was raised and check it independently.',
      },
      {
        icon: 'lock',
        title: 'Your control over records',
        body: 'You decide which records are shared, and agree how they are transferred, held and returned or deleted.',
      },
      {
        icon: 'shield-check',
        title: 'Independent verification',
        body: 'Candidate discrepancies are checked against existing claims and settlements before they are reported.',
      },
      {
        icon: 'scale',
        title: 'Performance-aligned arrangements',
        body: 'Where appropriate, fees are linked to verified, realised recoveries under an agreed contract.',
      },
    ],
  },

  sectors: {
    id: 'sectors',
    eyebrow: 'Who it is for',
    heading: 'Organisations with substantial accounts-payable activity',
    lede: 'Our initial focus is UK businesses that buy from many suppliers, at volume, over several years.',
    sectors: [
      {
        icon: 'boxes',
        name: 'Wholesale and distribution',
        body: 'High invoice volumes, frequent returns and supplier-funded promotions.',
      },
      {
        icon: 'hard-hat',
        name: 'Builders’ merchants',
        body: 'Branch networks, rebate schedules and complex pricing.',
      },
      {
        icon: 'shopping-cart',
        name: 'Retail',
        body: 'Large supplier bases, promotional allowances and returns.',
      },
      {
        icon: 'truck',
        name: 'Logistics',
        body: 'Carrier, fuel and subcontractor invoicing across many accounts.',
      },
      {
        icon: 'factory',
        name: 'Industrial suppliers',
        body: 'Component purchasing, framework agreements and volume discounts.',
      },
      {
        icon: 'handshake',
        name: 'Recovery-audit firms',
        body: 'Second-pass reconciliation technology to complement existing reviews.',
      },
    ],
    auditors: {
      heading: 'For recovery-audit firms',
      body: 'Hamiltonian Recovery is designed to work alongside established recovery auditors as a second-pass reconciliation capability, applying entity resolution and matching techniques to records your team has already reviewed. Partnership terms are agreed case by case.',
    },
    disclaimer: 'These are the sectors the service is designed for. They do not describe existing client relationships.',
  },

  about: {
    id: 'about',
    eyebrow: 'About',
    heading: 'A service of Hamiltonian Labs Ltd',
    paragraphs: [
      'Hamiltonian Recovery is the supplier-account recovery and reconciliation service of Hamiltonian Labs Ltd, a private limited company registered in England and Wales. It is not a separate company.',
      'The service uses AI-assisted analysis, entity resolution and reconciliation algorithms to surface candidate discrepancies across large volumes of supplier transactions. Each candidate is then checked against supporting records and existing claims before it is reported.',
      'Hamiltonian Recovery is a new service. Proof-of-value reviews and specialist reconciliation work are available by arrangement.',
    ],
    facts: [
      { label: 'Legal entity', value: company.legalName },
      {
        label: 'Company number',
        value: company.companyNumber,
        href: company.companiesHouseUrl,
      },
      { label: 'Registered in', value: 'England and Wales' },
      { label: 'Registered office', value: company.registeredOffice.join(', ') },
      { label: 'Incorporated', value: company.incorporated },
      { label: 'Company website', value: 'hamiltonianlabs.co', href: company.website },
    ],
  },

  contact: {
    id: 'contact',
    eyebrow: 'Contact',
    heading: 'Could there be money hidden in your supplier accounts?',
    lede: 'Tell us briefly about your reconciliation problem. We will reply to discuss whether a confidential review is appropriate and how it could be scoped.',
    primaryCta: {
      label: 'Request a Confidential Review',
      href: `mailto:${company.email}?subject=${encodeURIComponent(enquirySubject)}`,
    },
    emailLabel: 'Or email us directly',
    form: {
      heading: 'Prepare your enquiry',
      intro: 'Four details are enough to start a conversation.',
      fields: {
        name: 'Name',
        company: 'Company',
        email: 'Work email',
        message: 'Brief description of the reconciliation problem',
        messagePlaceholder:
          'For example: we suspect unapplied supplier credits across two business units over the past three years.',
      },
      submitLabel: 'Open in my email app',
      behaviourNote:
        'This opens a pre-addressed email in your own email application, ready for you to review and send. Nothing is sent until you send it, and this website does not transmit or store what you type.',
      confidentialityNote:
        'Please do not include ledgers, statements or other confidential financial records. If a review goes ahead, we will agree a secure way to share records.',
      emailSubject: enquirySubject,
    },
  },
};
