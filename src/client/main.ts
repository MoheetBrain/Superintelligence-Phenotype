/**
 * The only JavaScript shipped to the browser: progressive enhancement for the mobile
 * navigation and the enquiry composer. Every page is fully usable without it.
 */
import { initComposer } from './composer';
import { initNavigation } from './nav';

initNavigation();
initComposer();
