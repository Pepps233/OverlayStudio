# Contributing to Overlay Studio

Contributions can improve the editor, fix bugs, add artwork, or make the documentation clearer. Keep each change focused so reviewers can understand its purpose and check the result.

Everyone participating in this repository is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local Setup

Use Node.js 22 or newer (Node.js 24 LTS is recommended), npm, and Git. If you do not have write access, fork the repository and clone your fork instead.

```bash
git clone https://github.com/Pepps233/OverlayStudio.git
cd OverlayStudio
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Stop the server with `Ctrl+C` when finished.

## Before Making Changes

Check [existing issues](https://github.com/Pepps233/OverlayStudio/issues) and [pull requests](https://github.com/Pepps233/OverlayStudio/pulls) for related work. For a substantial editor change or a new dependency, explain the problem and proposed approach in an issue before investing in an implementation.

This is a Next.js application, not a multi-package workspace. Useful starting points are:

- `src/app/` for pages, layout, and global styles.
- `src/components/canvas/CanvasEditor.tsx` for canvas interaction and layer state.
- `src/components/canvas/AssetLibrary.tsx` for the built-in image collection.
- `src/components/canvas/PreviewPanel.tsx` and `Toolbar.tsx` for preview and toolbar controls.
- `public/assets/` for backgrounds, overlays, and cosmetics.

AI-assisted contributions are welcome, but you must understand and review everything you submit. You remain responsible for its behavior, security, licensing, and validation.

## Pull Request Flow

1. Create a focused branch, such as `feat/banner-export`, `chore/update-packages`, or `docs/editor-guide`.
2. For a bug fix, reproduce the problem in the editor before changing the code. Record the steps so reviewers can repeat them.
3. Implement the change and update relevant documentation. Include regression tests when suitable; describe manual coverage when no automated test covers the behavior.
4. Run the checks below and review your diff for unrelated edits, sensitive data, and generated files.
5. Use the [pull request template](.github/pull_request_template.md), completing **Summary**, **Reasoning**, **Changes**, and **Testing**. Include screenshots or a short recording for visual changes, and identify any compatibility risks or new dependencies.
6. Assign yourself and add appropriate labels before requesting review. If repository permissions prevent this, ask a maintainer to help.
7. Respond to feedback with focused changes. Wait for maintainer approval and any required checks before merging.

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and PR titles:

```text
feat(canvas): add rotation controls
fix(export): preserve transparent backgrounds
chore(deps): update editor dependencies
docs(readme): clarify local setup
```

## Validation

Run these checks before requesting review for code changes:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The production build generates the static site used by GitHub Pages. The repository currently has no automated test script; do not claim an automated test suite passed. For documentation-only changes, check links, commands, and `git diff --check`.

For editor changes, exercise the affected workflow in the browser. As relevant, check image uploads, asset selection, dragging, resizing, rotation, layer ordering, zoom, and PNG/JPEG downloads. Open downloaded images to confirm the result, including transparency where applicable. Check changed controls at narrow and wide screen widths and with keyboard navigation. List what you actually tested, along with any remaining gaps.

Fix diagnostics introduced by your change. If an existing warning or environment limitation prevents a check from passing, document it rather than hiding it or disabling a rule without explanation.

For dependency updates, also run `npm ci` and `npm audit`, and include the lockfile changes. TypeScript currently stays on 6.x because the lint tooling does not support TypeScript 7; ESLint stays on 9.x because several Next.js lint plugins do not declare ESLint 10 compatibility. Recheck upstream support before upgrading those major versions.

## Code and Asset Guidelines

- Follow nearby TypeScript and React conventions. Prefer explicit types to `any`, keep components focused, and use client components only where browser APIs or interactive state require them.
- Preserve the existing visual style and give interactive controls meaningful labels, visible focus states, and usable hit targets.
- Use `withBasePath` from `src/utils/basePath.ts` for public asset URLs so they work under the GitHub Pages project path as well as locally.
- Avoid unnecessary dependencies and large image files. Keep secrets, `.env.local`, build output, and local editor state out of commits.
- Add backgrounds to `public/assets/background/`, transparent overlays to `public/assets/overlay/`, and accessories to `public/assets/cosmetic/`. Register built-in assets in `AssetLibrary.tsx` and check their preview and export behavior.
- For backgrounds, 1584 × 396 pixels is the intended banner size. Preserve transparency for assets that need it and optimize images without visibly degrading them.
- Only submit artwork you have permission to redistribute. State its source and license in the PR and include any required attribution. Do not include personal or confidential images in examples or screenshots.

## Issues and Feature Requests

Use [GitHub Issues](https://github.com/Pepps233/OverlayStudio/issues) for reproducible bugs and proposals. Include:

- What you expected and what happened instead.
- The smallest sequence of steps that demonstrates the issue, or the banner-creation task a proposed feature would help with.
- Browser and operating system details, and Node.js version for local setup problems.
- Relevant screenshots, logs, or sample images with private information removed.

For feature requests, describe the user benefit and alternatives rather than only prescribing an implementation. Never post credentials or private conduct reports in public issues; see the [Code of Conduct](CODE_OF_CONDUCT.md) for reporting guidance.

## Review and Licensing

Review focuses on the banner-creation experience, correctness, accessibility, security, asset rights, and maintainability. Small, self-contained PRs are easier to validate than unrelated changes bundled together.

By submitting a contribution, you agree that it can be distributed under the project's [MIT License](LICENSE). Identify any third-party assets and their separate license terms explicitly.
