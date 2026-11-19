/**
 * Interface microcopy: accessibility labels, structural labels and error-page text.
 * Marketing and legal copy lives in src/content; this module holds only the small strings the
 * page chrome needs that the content schema does not (yet) provide.
 */
export const uiText = {
  skipLink: 'Skip to main content',
  brandDescriptor: 'A service of Hamiltonian Labs Ltd',
  primaryNavLabel: 'Primary',
  footerNavLabel: 'Footer',
  menuButton: 'Menu',
  companyNumberLabel: 'Companies House No.',
  registeredInPrefix: 'Registered in',
  registeredOfficeLabel: 'Registered office:',
  copyrightSymbol: '©',
  lastUpdated: 'Last updated',
  onThisPage: 'On this page',
  allFieldsRequired: 'All fields are required.',
  opensExternalSite: '(external site)',
  notFound: {
    eyebrow: 'Error 404',
    title: 'Page not found',
    body: 'The page you were looking for does not exist or may have moved.',
    homeLink: 'Return to the home page',
    metaDescription: 'The requested page could not be found.',
  },
} as const;
