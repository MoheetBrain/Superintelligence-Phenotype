# Sites publication — 12 September 2026

The atlas is hosted at **https://superintel.site**, publicly accessible without sign-in as explicitly requested by the creator. The existing Sites address is https://asi-atlas.loadingslowly.chatgpt.site. The custom domain and HTTPS were verified active through Sites; its two apex A records and verification TXT records were saved in Spaceship. Preserve the public audience for subsequent publications.

`.openai/hosting.json` retains the existing project ID and static Vite `dist` output. GitHub and the Sites source repository receive the same committed source. No backend, runtime secrets, paid assets or hosting plan changes are needed.

For updates: build the existing application, push the exact source revision, package only the static build through the Sites helper, save that revision and deploy the saved version. Keep source-write credentials in memory, pass authentication per command, and never persist tokens in files or Git configuration. Confirm a successful terminal deployment before reporting an updated website as live.

The current banner says **IT IS HERE ALREADY!**, **My belief as an AI undergraduate**, and **U O W · University of Westminster**. The statement and affiliation are user-supplied and remain separate from the atlas’s evidence classifications. See `src/content/arrival.ts`.

The dual-host update’s implementation, validation and limitations are recorded in [DUAL_HOST_HANDOFF.md](DUAL_HOST_HANDOFF.md).

The subsequent geometry reconstruction is documented in [ROBOT_RECONSTRUCTION.md](ROBOT_RECONSTRUCTION.md). It retains the same public Site and domain. Spaceship auto-renew for `superintel.site` was switched off and verified off on 12 September 2026; the domain remains registered through 12 September 2027.
