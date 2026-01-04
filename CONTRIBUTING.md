# Contributing to Overlay Studio

First off, thank you for considering contributing to Overlay Studio! It's people like you that make Overlay Studio such a great tool. 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Assets](#adding-new-assets)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, code snippets)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications if applicable

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues perfect for newcomers
- `help wanted` - Issues where we need community help
- `bug` - Bug fixes are always appreciated
- `enhancement` - Feature improvements

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- Git

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/OverlayStudio.git
   cd OverlayStudio
   ```

3. **Add the upstream repository**
   ```bash
   git remote add upstream https://github.com/Pepps233/OverlayStudio.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch for your changes**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser** at [http://localhost:3000](http://localhost:3000)

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## 📁 Project Structure

```
OverlayStudio/
├── public/
│   ├── assets/          # Static assets (backgrounds, overlays, cosmetics)
│   └── *.svg/webp       # Public images and icons
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page
│   │   └── globals.css  # Global styles
│   └── components/      # React components
│       ├── canvas/      # Canvas editor components
│       └── *.tsx        # UI components
├── .gitignore
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### Key Files

- **`src/components/canvas/CanvasEditor.tsx`** - Main canvas editor logic
- **`src/components/canvas/AssetLibrary.tsx`** - Asset selection and management
- **`src/components/canvas/PreviewPanel.tsx`** - Banner preview functionality
- **`src/components/canvas/Toolbar.tsx`** - Upload and toolbar controls
- **`src/app/page.tsx`** - Main landing page

## 💻 Coding Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid using `any` type unless absolutely necessary
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Use `"use client"` directive for client components
- Implement proper error boundaries where needed

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme (violet/purple theme)
- Ensure responsive design (mobile-first approach)
- Support both light and dark modes

### Code Style

```typescript
// Good: Clear, typed, functional component
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export default function Button({ onClick, label, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-violet-600 text-white rounded-lg"
    >
      {label}
    </button>
  );
}
```

### Performance

- Optimize images (use WebP format when possible)
- Use `useCallback` and `useMemo` for expensive operations
- Implement proper loading states
- Avoid unnecessary re-renders

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples

```bash
feat(canvas): add rotation control for layers
fix(export): resolve PNG transparency issue
docs(readme): update installation instructions
style(toolbar): improve button spacing
refactor(asset-library): simplify asset loading logic
```

## 🔄 Pull Request Process

1. **Ensure your code follows the coding guidelines**
2. **Update documentation** if you're changing functionality
3. **Add tests** if applicable
4. **Update the README.md** if needed
5. **Ensure the build passes** (`npm run build`)
6. **Write a clear PR description** explaining:
   - What changes you made
   - Why you made them
   - How to test them
   - Any breaking changes

### PR Title Format

Use the same format as commit messages:

```
feat: add layer rotation feature
fix: resolve canvas zoom issue on mobile
docs: improve contributing guidelines
```

### PR Checklist

- [ ] My code follows the project's coding guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
- [ ] Any dependent changes have been merged

## 🎨 Adding New Assets

### Background Images

1. Place images in `public/assets/background/`
2. Recommended size: **1584 × 396 px**
3. Use optimized formats (WebP, JPEG)
4. Update `AssetLibrary.tsx` to include the new asset

```typescript
const backgrounds = [
  // ... existing backgrounds
  { name: "Your City", path: "/assets/background/your-city.jpg" },
];
```

### Overlay Images

1. Place images in `public/assets/overlay/`
2. Use **PNG format with transparency**
3. Optimize file size
4. Update `AssetLibrary.tsx`

### Cosmetic Items

1. Place images in `public/assets/cosmetic/`
2. Use **PNG format with transparency**
3. Keep consistent sizing
4. Update `AssetLibrary.tsx`

## 🐛 Reporting Bugs

### Before Submitting

- Check the [existing issues](https://github.com/Pepps233/OverlayStudio/issues)
- Try the latest version
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., macOS, Windows, Linux]
 - Browser: [e.g., Chrome, Safari, Firefox]
 - Version: [e.g., 22]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Enhancements

### Enhancement Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Screenshots, mockups, or examples.
```

## 🎯 Development Tips

### Testing Your Changes

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Common Issues

**Port already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Dependencies out of sync:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🌟 Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project documentation
- Release notes (for significant contributions)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Pull Requests**: For code review and collaboration

## 📄 License

By contributing to Overlay Studio, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Overlay Studio! 🎉

Your efforts help make this project better for everyone. We appreciate your time and expertise!
