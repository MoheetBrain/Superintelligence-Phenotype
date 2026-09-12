# Sites publication — 12 September 2026

The project creator requested publication and replaced the arrival prediction with **IT IS HERE ALREADY!**, attributed directly as **My prediction as an AI student**. The prediction is a personal statement, not an established scientific finding; existing evidence labels and unmeasured project results remain intact.

This checkout is registered with Sites. `.openai/hosting.json` contains the exact project ID and declares the existing Vite `dist` output as static content. GitHub remains the project's source repository; the Sites source repository receives the same committed revision for versioned hosting. No backend, environment secrets, paid assets or plan changes are needed.

New Sites use owner-private access by default. The publication uses that audience. The production URL and terminal deployment status must come from the Sites response; registration alone does not mean the website is live.

For subsequent updates, reuse the project ID, build the existing Vite application, push the exact committed source to the configured Sites repository, package the static build with the Sites packaging helper, save that revision and deploy the resulting version. Keep source-write credentials in memory and authenticate per command; never persist them in files or Git configuration. Deployment status must succeed before claiming an updated website is live.

## Update checks

The updated application passed TypeScript checking, the production Vite build, and the two focused Chromium checks for the attributed student prediction, actual cloud selection and the 390×844 accessible layout. The prediction is stored once in `src/content/arrival.ts` and reused by the banner and dialog.
