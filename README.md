# Bhawana Sahu's Portfolio

A public engineering portfolio with build-time HTML and a progressive Three.js desk. The complete biography, project caveats, native navigation and printable resume do not depend on JavaScript or graphics. No backend, accounts, API, analytics, cloud service or secrets are required.

The reviewed [docs/index.html](docs/index.html) contains the locally refreshed production build. Editable source is in [services/web](services/web); builds only write to its ignored staging output, never directly to the publishable site. Nothing has been published.

## Publish On GitHub Pages

Visitors only need a browser. React, Three.js, fonts and other runtime assets are included in the static build; nobody needs to install Node.js, npm or Azure tools to view the portfolio. Node.js and npm are only needed when rebuilding the editable source.

1. Create a public GitHub repository named exactly `portfolio`. The existing build uses `/portfolio/` asset paths.
2. Upload the complete `docs` folder, including `.nojekyll`, `assets`, `fonts` and `licenses`, to the repository's `main` branch. These are all the files needed to host the site; source code is optional for hosting. Review the public content before uploading, and do not upload private workspace material.
3. In the repository's **Settings > Pages**, choose **Deploy from a branch**, select **main** and **/docs**, then **Save**.
4. Wait for GitHub Pages to finish publishing and open the URL shown in those settings. For a normal GitHub account, it will be `https://YOUR-USERNAME.github.io/portfolio/`, with your actual username in place of the placeholder.
5. In the repository's **About** settings, set **Website** to that published URL so visitors can click it directly from the repository.

No Azure subscription, backend, database, custom build workflow or visitor installation is required. GitHub serves the prebuilt files over HTTPS. A repository file link displays source; use the Pages URL to open the actual portfolio. To publish later changes, rebuild and replace `docs` with the reviewed build as described below, then push or upload it again.

## Develop

Install standard Node.js 24 LTS with npm. From the repository root:

```text
npm --prefix services/web ci
npm --prefix services/web run dev -- --host 127.0.0.1 --port 5173
```

Open the actual URL printed by Vite, normally `http://127.0.0.1:5173/portfolio/`. The production base is `/portfolio/`. If the port is occupied, Vite selects another; do not terminate another application's server. The development page hydrates on the client; verify no-JavaScript behavior against a production build.

```text
npm --prefix services/web run typecheck
npm --prefix services/web run lint
npm --prefix services/web test
npm --prefix services/web run build
npm --prefix services/web run preview -- --host 127.0.0.1 --port 4173
npm --prefix services/web run test:e2e
```

Browser tests use installed Google Chrome and start or reuse the production preview at `http://127.0.0.1:4173/portfolio/`. Build first; the tests run without private migration records. Build output includes complete HTML, base-aware hashed assets, local fonts, notices and `.nojekyll`. Open it through the preview server, not a `file:` URL.

On slow network-mounted filesystems, use a local working copy for npm installation and validation. During this migration a checksum-verified local mirror was necessary; its paths and actual results are recorded in private validation evidence. This does not change the supported Node/npm workflow or authorize publication.

## Edit

- [services/web/src/data/portfolio.ts](services/web/src/data/portfolio.ts): public-only typed content. Preserve contribution wording, all Scope values and unfinished-work distinctions.
- [services/web/src/content/Portfolio.tsx](services/web/src/content/Portfolio.tsx): shared semantic screen, prerender and print structure.
- [services/web/src/styles/site.css](services/web/src/styles/site.css): responsive framing, typography and print rules.
- [services/web/src/scene](services/web/src/scene): optional procedural desk, content-driven stations and camera.
- [services/web/src/lib](services/web/src/lib): pure, tested layout and capability decisions.
- [services/web/public/licenses](services/web/public/licenses): retained reference, font and dependency notices.

The name mesh uses a renamed, locally generated Space Grotesk subset under OFL-1.1. Website fonts are locally bundled Space Grotesk and Source Sans 3. The reference composition is MIT licensed; GSAP has its own Standard No Charge license, not MIT. See the shipped notices before reusing or updating assets.

## Review And Refresh

Check desktop, wide desktop, 390px, 320px, landscape and 200% zoom; inspect actual canvas geometry and camera movement, not just DOM screenshots. Verify keyboard/native links, back navigation, deep links, pause, reduced motion, data saving, unavailable WebGL, context loss and failed graphics imports. Print A4 and Letter with browser-added headers/footers off. All public text, contact destinations and DOI links must remain present.

The redesigned build passed a clean locked install, typecheck, lint, 12 unit tests and 10 browser tests. Additional checks covered all nine camera stations, canvas pixels, native 200% Chrome zoom, graphics fallbacks and six A4/Letter print outputs with JavaScript enabled, disabled and active graphics. Original public text and links were independently checked before the local refresh; the previous site is privately archived. Migration evidence and source inventories remain private, ignored artifacts. The lazy 3D chunk still triggers Vite's size warning. Validation used Chrome/software rendering, not physical printers, Firefox, Safari or a live Pages deployment.

For subsequent refreshes, repeat content, privacy, licensing, build and browser gates. Replace the document root with the reviewed staging build's exact contents, including `.nojekyll`, fonts and notices; remove obsolete generated chunks rather than merging builds. Back up the previous output first. Do not point Vite's `emptyOutDir` at the existing site. No refresh occurs automatically.

## Publication Safety

GitHub Pages is the selected hosting target; Azure deployment is not needed. The GitHub username and repository URL have not been supplied, and this workspace has not been published. No canonical URL is invented. Public copy still requires the owner's and employer's confidentiality review.

The public allowlist is the reviewed `docs` folder, frontend public source/configuration/lockfile, this README and ignore rules. Exclude dependency directories, staging builds, test output and all private planning/source/editor material, including `.azure`, `.copilot-azure`, `.cline_storage` and `.vscode`. Ignore patterns do not protect already-tracked files or manual browser uploads; review the exact files being published. Never upload the entire workspace blindly.

Follow the GitHub Pages steps above and use the real URL GitHub reports. Retest `/portfolio/`, fragments, fonts, lazy chunks and print after publication. Add canonical metadata only after the hostname is known.