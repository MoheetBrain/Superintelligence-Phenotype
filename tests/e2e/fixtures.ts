import { test as base, expect } from '@playwright/test';

interface Fixtures {
  /** Console error messages a test expects (substring match), e.g. the 404 document status. */
  allowedConsoleErrors: string[];
  /** Fails the test on console errors, page errors or any request to another origin. */
  pageGuard: void;
}

export const test = base.extend<Fixtures>({
  allowedConsoleErrors: [[], { option: true }],
  pageGuard: [
    async ({ page, baseURL, allowedConsoleErrors }, use) => {
      const origin = new URL(baseURL!).origin;
      const errors: string[] = [];
      const foreignRequests: string[] = [];

      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const text = message.text();
        if (!allowedConsoleErrors.some((allowed) => text.includes(allowed))) errors.push(text);
      });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        const url = new URL(request.url());
        // data:/blob: are in-page; mailto: is the composer handing off to the visitor's mail app.
        if (['data:', 'blob:', 'mailto:'].includes(url.protocol)) return;
        if (url.origin !== origin) foreignRequests.push(request.url());
      });

      await use();

      expect(errors, 'console errors').toEqual([]);
      expect(foreignRequests, 'requests to other origins').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
