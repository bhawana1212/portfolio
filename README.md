# portfolio
Personal portfolio of Bhawana Sahu, showcasing software engineering, DevOps, CI automation, developer tooling, projects and published research.

# Bhawana Sahu's Portfolio

A static engineering portfolio and printable resume. Open [docs/index.html](docs/index.html) in a browser. No installation, build, server, account, environment variables or network connection is needed to read the site. External contact and publication links require their usual applications or network access.

## Edit

- [docs/index.html](docs/index.html): all biography, experience, projects, publications, education, skills and contact content. Screen and print share this source.
- [docs/assets/styles.css](docs/assets/styles.css): responsive layout, palette and print rules.
- [docs/assets/main.js](docs/assets/main.js): progressive print button. Browser Print works without JavaScript.
- [docs/assets/vendor](docs/assets/vendor): local Pico.css 2.1.1 and selected Lucide 0.468.0 icons. Retain the supplied MIT and ISC/Feather license notices when updating these files.
- [docs/.nojekyll](docs/.nojekyll): disables Jekyll processing for the static site.

Keep assets relative to the HTML document (`./assets/...`) and navigation as fragment links. Do not introduce a root-relative asset path, runtime fetch, private source document, analytics or a fabricated project/live-site URL.

## Review Locally

1. Open the HTML file directly in Chrome or Edge. Check desktop, 390px and 320px widths, then desktop at 200% zoom. Confirm readable text, visible focus, no overlap or horizontal scrolling, and loaded icons.
2. Use Tab and Enter to follow the skip link, section links and print control. All interactive targets should remain at least 44px tall.
3. Disable JavaScript and reload: all biography content and native navigation remain available; the unavailable print button stays hidden. Use the browser's Print command.
4. In developer tools, temporarily disable the Pico stylesheet: content remains readable and the tailored stylesheet still lays out the page. Restore it after checking.
5. Print or save as PDF on A4 and Letter at default scale, with browser headers/footers off. Check every page for clipping, empty sheets and missing academic projects, contact destinations or DOI links. Do not force one-page printing.
6. Follow the email, LinkedIn and publication links. Confirm the intended destination before sharing publicly; this site does not send email or alter external profiles.

With an optional Node.js installation, the syntax check from the repository root is:

```text
node --check docs/assets/main.js
```

There are no npm scripts or required Node dependencies. Local implementation checks used VS Code's bundled Node, temporary Playwright 1.56.1, Chrome 155 and PDF.js 5.4.296. The temporary tooling, screenshots and reports live outside the publish directory and are ignored by Git; they are not required to use the site.

### Validation Recorded on 2026-10-28

- JavaScript syntax, editor diagnostics, local asset references, unique IDs and fragment targets passed.
- Keyboard-only navigation, print callback, reduced-motion behavior and 44px control targets passed.
- Screenshots and overflow checks passed at 1440px, 390px and 320px. Experience begins within the checked initial viewports.
- Disabled JavaScript and unavailable Pico preserve content and layout. The 200% viewport/density equivalent passed; native browser zoom-menu behavior still needs manual review.
- A4 and Letter each produced six pages, including all 167 checked printable text blocks, with no blank pages or detected clipping. Rendered PDF pages were inspected.
- A simulated named-repository base path resolved every local asset. This is not a live GitHub Pages deployment test.
- Public-link allowlist and private-reference scans passed. Live external-site availability, physical printing, Safari and Firefox were not verified.

## Publication Boundary

The site is prepared locally only. No GitHub destination has been chosen and no repository, commit, push or Pages activation is authorized by plan approval. Public copy still requires the owner's and employer's confidentiality review. Project status caveats distinguish implemented work, verified production checks and further development; preserve those distinctions when editing.

Only `docs/` is intended as the Pages document root. The root README and ignore rules may also enter the future repository. Planning artifacts, private source material and local validation files must not be published. The existing ignore rules exclude them, but do not protect files that were already tracked. At scaffold time this workspace was not a Git repository; tracked-file and Git ignore-engine checks therefore remain required before any later authorized publication.

## Publish Later, After Separate Authorization

1. Choose either a profile repository named `USERNAME.github.io` or a named project repository. These are naming examples, not current live destinations.
2. Review every proposed public file and retained third-party license. Do not upload the original resume PDF or private workspace folders.
3. After repository initialization is separately authorized, inspect `git status --short`, `git ls-files`, and `git check-ignore -v` for private paths. Stage only `.gitignore`, `README.md` and the reviewed `docs/` files, never the whole workspace blindly. Inspect `git diff --cached --name-only` and the complete staged diff before committing.
4. Only after commit/push authorization, push to the chosen repository. In GitHub **Settings > Pages**, choose **Deploy from a branch**, the chosen branch, and **/docs**.
5. Use the actual URL GitHub reports. The profile site uses the host root; a named repository uses its repository subpath. Test both a fresh load and section navigation, local assets, external links and printing at that real URL.
6. Add a canonical URL only after the real public destination is confirmed.

For a Pages 404, check the selected branch, `/docs`, the presence and spelling of `index.html`, and the Pages deployment status. Missing styles or icons usually indicate incorrect asset casing or paths; retain relative paths for named repositories. If print output differs, restore default scale, select the intended paper size and turn off browser-added headers/footers.
