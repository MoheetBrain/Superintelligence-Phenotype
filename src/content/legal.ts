import { company } from './site';
import type { LegalDocument } from './types';

/*
 * Proportionate legal documents for a static, cookie-free website with no backend.
 * They describe the site as built: hosted on Vercel; no cookies, analytics, advertising pixels or
 * third-party trackers; self-hosted fonts; an enquiry form that only composes an email in the
 * visitor's own email application. If any of that changes, these documents must change too.
 * See docs/CONTENT_REVIEW.md for the facts relied on and items for the owner to confirm.
 */

const office = company.registeredOffice.join(', ');
const registration = company.jurisdiction
  ? `a private limited company registered in ${company.jurisdiction} under company number ${company.companyNumber}`
  : `a private limited company registered at Companies House under company number ${company.companyNumber}`;

export const privacyPolicy: LegalDocument = {
  path: '/privacy/',
  title: 'Privacy Policy',
  metaDescription:
    'How Hamiltonian Labs Ltd, which provides Hamiltonian Recovery, handles personal data in connection with this website and email enquiries.',
  lastUpdated: '2026-11-19',
  intro: [
    'This policy explains how Hamiltonian Labs Ltd uses personal data in connection with this website and with enquiries sent to us by email. Hamiltonian Recovery is a service of Hamiltonian Labs Ltd, not a separate company.',
    'The website is deliberately simple. It does not use cookies, analytics or advertising tracking, and its enquiry form does not send anything to us: it prepares an email in your own email application, which you then choose whether to send.',
  ],
  sections: [
    {
      heading: 'Who we are',
      paragraphs: [
        `Hamiltonian Labs Ltd is the controller of the personal data described in this policy. We are ${registration}. Our registered office is ${office}.`,
        `For any question about this policy or your personal data, email ${company.email}.`,
      ],
    },
    {
      heading: 'What this policy covers',
      paragraphs: [
        'This policy covers visits to this website and enquiries you send to us by email, including emails prepared using the enquiry form.',
        'This website is not intended for sending confidential financial records, such as ledgers, supplier statements or payment data. Please do not include them in an initial enquiry. If we agree to carry out a review, how records are shared, and how any personal data in them is handled, will be governed by the engagement contract, which will set out each party’s data protection responsibilities.',
      ],
    },
    {
      heading: 'Information we collect',
      paragraphs: ['We collect only the following:'],
      list: [
        'Enquiries: when you email us, we receive your name, company, work email address and message, anything else you choose to include (such as your job title, telephone number or attachments), and standard email information such as the date and time it was sent.',
        'Website request logs: when you visit the website, our hosting provider automatically processes the technical information needed to deliver and protect the pages, such as your IP address, browser and device type (user agent), the pages requested, the referring page and the date and time of each request.',
      ],
    },
    {
      heading: 'How the enquiry form works',
      paragraphs: [
        'The enquiry form does not submit anything to us. When you select the button, your browser opens a pre-addressed email in your own email application, containing the details you typed. Nothing is sent unless you choose to send that email. This website does not transmit or store what you type into the form.',
        'Once you send the email, we handle it in the same way as any other email sent to us.',
      ],
    },
    {
      heading: 'How we use your information and our lawful bases',
      paragraphs: [
        'Under UK data protection law (the UK GDPR and the Data Protection Act 2018) we need a lawful basis to use personal data. We use your information:',
      ],
      list: [
        'to read, reply to and follow up your enquiry, and to keep a record of our correspondence, on the basis of our legitimate interests in responding to business enquiries and developing our business;',
        'to discuss and prepare a possible engagement, such as agreeing its scope, on the basis that we are taking steps at your request before entering into a contract or, where the contract would be with the organisation you work for, on the basis of our legitimate interests;',
        'to operate the website and keep it secure, on the basis of our legitimate interests in running a secure website;',
        'to comply with our legal obligations, and to establish, exercise or defend legal claims, on the basis of legal obligation or our legitimate interests.',
      ],
    },
    {
      heading: 'What we do not do',
      paragraphs: [
        'We do not sell personal data, build advertising profiles or make decisions about you based solely on automated processing.',
        'We do not ask for special category data, such as information about health, and ask that you do not send it.',
      ],
    },
    {
      heading: 'Cookies and tracking',
      paragraphs: [
        'This website does not set cookies and does not use analytics tools, advertising pixels or other third-party tracking technologies. Fonts are served from this website, so viewing a page does not send requests to third-party font services.',
        'Links to other websites, such as the Companies House register, take you to sites with their own privacy and cookie practices.',
      ],
    },
    {
      heading: 'Who we share it with',
      paragraphs: ['We share personal data only where necessary, with:'],
      list: [
        'Vercel Inc., which hosts this website and processes website request logs as our hosting provider;',
        'the service providers that route, deliver and store email sent to our domain;',
        'professional advisers, where reasonably necessary to obtain advice or to protect our legal rights;',
        'courts, regulators, law enforcement or other public authorities, where the law requires it or where necessary to establish, exercise or defend legal claims;',
        'a prospective buyer or successor, if our business is reorganised or transferred, subject to appropriate confidentiality.',
      ],
    },
    {
      heading: 'International transfers',
      paragraphs: [
        'Some of our service providers, including Vercel Inc., are based in or process data in countries outside the United Kingdom, including the United States. Where personal data is transferred outside the UK, we ensure the transfer is subject to the safeguards required by UK data protection law. You can contact us for more information about these safeguards.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: ['Our policy is to keep personal data only for as long as we need it:'],
      list: [
        'Enquiries that do not lead to an engagement: up to 24 months from our last contact with you, after which they are deleted.',
        'Correspondence relating to an engagement: for the duration of the engagement and up to six years after it ends, so that we can meet legal and accounting requirements and deal with any claims.',
        'Website request logs: kept by our hosting provider for a limited period under its own retention practices. We do not use these logs to identify individual visitors, except where necessary to investigate misuse or a security incident.',
      ],
    },
    {
      heading: 'Keeping information secure',
      paragraphs: [
        'We use appropriate technical and organisational measures to protect personal data and limit access to those who need it. No method of sending information over the internet is completely secure, which is one reason we ask you not to send confidential financial records with an initial enquiry.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Under UK data protection law you have the right, subject to certain conditions and exceptions, to:',
      ],
      list: [
        'ask for a copy of the personal data we hold about you;',
        'ask us to correct inaccurate or incomplete data;',
        'ask us to delete your data;',
        'ask us to restrict how we use your data;',
        'object to our use of your data where we rely on legitimate interests;',
        'ask for data you have provided to us to be transferred to you or to another organisation, where the law gives you this right.',
      ],
    },
    {
      heading: 'How to exercise your rights',
      paragraphs: [
        `Email ${company.email}. We may need to confirm your identity before acting on a request. We will normally respond within one month, which may be extended where the law allows. There is usually no charge.`,
      ],
    },
    {
      heading: 'Complaints',
      paragraphs: [
        'If you are concerned about how we handle your personal data, please contact us first so that we can try to resolve it. We will acknowledge a complaint within 30 days and respond without undue delay.',
        'You also have the right to complain to the Information Commissioner’s Office (ICO), the UK data protection regulator, at ico.org.uk.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy, for example if the website or our service providers change. The “last updated” date on this page shows when it was last revised.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Hamiltonian Labs Ltd, ${office}. Email: ${company.email}.`],
    },
  ],
};

export const websiteTerms: LegalDocument = {
  path: '/terms/',
  title: 'Website Terms',
  metaDescription:
    'Terms of use for the Hamiltonian Recovery website, operated by Hamiltonian Labs Ltd.',
  lastUpdated: '2026-11-19',
  intro: [
    'These terms apply to your use of this website. By using it, you accept them. If you do not agree, please do not use the website.',
    'This website is intended for businesses and their representatives.',
  ],
  sections: [
    {
      heading: 'Who we are',
      paragraphs: [
        `This website is operated by Hamiltonian Labs Ltd (“we”, “us”), ${registration}, whose registered office is at ${office}.`,
        'Hamiltonian Recovery is the name under which Hamiltonian Labs Ltd provides its supplier-account recovery and reconciliation service. It is not a separate company.',
        `You can contact us at ${company.email}.`,
      ],
    },
    {
      heading: 'Using this website',
      paragraphs: [
        'You may use this website for lawful purposes only. You must not misuse it, for example by attempting to gain unauthorised access to it or to the systems that host it, introducing malicious code, or interfering with its operation.',
      ],
    },
    {
      heading: 'Information only',
      paragraphs: [
        'The content of this website is general information about our services. It is not financial, accounting, tax or legal advice and should not be relied on as such. You should obtain advice suited to your circumstances before acting on it.',
        'Nothing on this website is an offer capable of acceptance. Any engagement is subject to a separate written contract setting out the agreed scope, fees and responsibilities. If anything on this website conflicts with that contract, the contract prevails.',
        'References to fee arrangements, including contingency fees, describe arrangements that may be available for suitable engagements. They are not a commitment to offer any particular arrangement.',
      ],
    },
    {
      heading: 'No guarantee of outcome',
      paragraphs: [
        'Whether any recoverable amounts exist depends on each organisation’s records and circumstances. We do not guarantee that a review will identify any discrepancy or recoverable amount, or that any amount identified will be recovered.',
        'The types of discrepancy described on this website are examples of what a review may examine. They are not statements that any particular organisation has recoverable amounts.',
      ],
    },
    {
      heading: 'Accuracy and availability',
      paragraphs: [
        'We take reasonable care over the content of this website, but we do not promise that it is complete, accurate or up to date, or that the website will always be available or free from errors or viruses. The website is provided free of charge and on an “as is” basis.',
        'We may change, suspend or withdraw all or part of the website at any time without notice.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'We own, or are licensed to use, the intellectual property rights in this website and its content. You may view, download and print pages for your own internal business purposes, including evaluating our services. You must not otherwise copy, reproduce or republish the content for commercial purposes without our written permission.',
      ],
    },
    {
      heading: 'Links to other websites',
      paragraphs: [
        'This website links to other websites, such as the Companies House register. We are not responsible for the content or availability of websites we do not control, and a link does not mean we endorse them.',
      ],
    },
    {
      heading: 'Enquiries by email',
      paragraphs: [
        'The enquiry form does not send anything to us: it prepares an email in your own email application, which you choose whether to send. Please do not include confidential financial records in an initial enquiry. Sending an enquiry does not create a contract or any obligation on either side.',
      ],
    },
    {
      heading: 'Our liability',
      paragraphs: [
        'Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot be excluded or limited by law.',
        'Subject to that, and to the extent permitted by law, we will not be liable for any loss or damage, whether in contract, tort (including negligence), breach of statutory duty or otherwise, arising from or in connection with your use of, or inability to use, this website, or your use of or reliance on its content. In particular, we will not be liable for any loss of profits, revenue, business, anticipated savings or goodwill, or for any indirect or consequential loss.',
        'Our liability in connection with any engagement is governed solely by the contract for that engagement.',
      ],
    },
    {
      heading: 'Privacy',
      paragraphs: [
        'We use personal data as described in our Privacy Policy, which is linked at the foot of every page.',
      ],
    },
    {
      heading: 'Governing law and jurisdiction',
      paragraphs: [
        'These terms, and any dispute or claim (including any non-contractual dispute or claim) arising out of or in connection with them or this website, are governed by the law of England and Wales. The courts of England and Wales have exclusive jurisdiction.',
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'We may revise these terms at any time by updating this page. The “last updated” date shows when they were last changed. Please check this page whenever you use the website.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about these terms can be sent to ${company.email}.`],
    },
  ],
};

export const legalDocuments: LegalDocument[] = [privacyPolicy, websiteTerms];
