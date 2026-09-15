import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './ResearchPortfolio';
import './styles/globals.css';
import { validateCatalogue } from './data/validateCatalogue';
import { capabilities } from './data/capabilities';
import { domains } from './data/domains';
import { visualMappings } from './data/visualMappings';
const errors = validateCatalogue(
  capabilities,
  domains,
  visualMappings.map((v) => v.partId),
);
if (errors.length) throw new Error(errors.join('\n'));
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
