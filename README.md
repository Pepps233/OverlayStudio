<div align="center">
  <img src="public/logo.svg" alt="Overlay Studio Logo" width="120" height="120">
  
  # Overlay Studio
  
  **Create stunning LinkedIn banners that show your personality**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  
  [Live Demo](#) • [Report Bug](https://github.com/Pepps233/OverlayStudio/issues) • [Request Feature](https://github.com/Pepps233/OverlayStudio/issues)
</div>

---

## About

Overlay Studio is an open-source LinkedIn banner generator with a powerful drag-and-drop editor. Inspired by [ogis.dev](https://ogis.dev/) (check out the [original project](https://github.com/twangodev/ogis)), this tool lets you create professional, eye-catching banners with custom backgrounds, overlays, and cosmetic elements.

### Key Features

- **️Drag-and-Drop Canvas Editor** - Intuitive interface for positioning and resizing elements
- **Asset Library** - Pre-loaded backgrounds, animal overlays, and cosmetic accessories
- **Custom Image Upload** - Add your own images (recommended: 1584 × 396 px)
- **Layer Management** - Reorder, lock, and manage multiple layers with ease
- **Smart Snapping** - Auto-fit backgrounds to banner dimensions
- **Aspect Ratio Lock** - Maintain proportions while resizing
- **Export Options** - Download as PNG (lossless) or JPEG (smaller file size)
- **Real-time Preview** - See your changes instantly
- **Responsive Design** - Works on both desktop and mobile devices
- **AI-Powered Image Blending** - blend two images seamlessly, put a hat on a cat!

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pepps233/OverlayStudio.git
   cd OverlayStudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables (Optional - for analytics)**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup instructions.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Choose a Background** - Select from pre-loaded city backgrounds or upload your own
2. **Add Overlays** - Choose from cute animals (cats, dogs, seals, sea lions)
3. **Add Cosmetics** - Decorate with hats and accessories
4. **Customize** - Drag, resize, rotate, and position elements
5. **Layer Management** - Right-click elements to bring forward, send back, or lock aspect ratio
6. **Export** - Download your banner as PNG or JPEG

### Asset Categories

- **Backgrounds**: City landscapes (NYC, Seattle, Chicago, Austin, Golden Gate Bridge)
- **Overlays**: Animal images (4 cats, 2 dogs, 1 sea lion, 1 seal)
- **Cosmetics**: 8 different hat styles

## Tech Stack

- **Framework**: [Next.js 16.1](https://nextjs.org/) with App Router
- **UI Library**: [React 19.2](https://reactjs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Fonts**: Geist Sans, Geist Mono, Rancho (Google Fonts)
- **Build Tool**: [Turbopack](https://turbo.build/)
- **Backend**: [Supabase](https://supabase.com/) (optional - for analytics)
- **Database**: PostgreSQL (via Supabase)

## Project Structure

```
OverlayStudio/
├── public/
│   ├── assets/
│   │   ├── background/     # City background images
│   │   ├── overlay/        # Animal overlay images
│   │   └── cosmetic/       # Hat and accessory images
│   └── logo.svg            # Application logo
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with fonts
│   │   ├── page.tsx        # Main page component
│   │   └── globals.css     # Global styles
│   └── components/
│       ├── Header.tsx          # Navigation header
│       ├── HeroSection.tsx     # Landing hero section
│       ├── Showcase.tsx        # Feature showcase
│       ├── ClientLayout.tsx    # Client-side wrapper
│       └── canvas/
│           ├── CanvasEditor.tsx    # Main canvas editor
│           ├── AssetLibrary.tsx    # Asset selection panel
│           ├── PreviewPanel.tsx    # Banner preview
│           └── Toolbar.tsx         # Upload toolbar
└── package.json
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [ogis.dev](https://ogis.dev/) by [twangodev]([https://github.com/twangodev/ogis](https://github.com/twangodev))
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Contact

Project Link: [https://github.com/Pepps233/OverlayStudio](https://github.com/Pepps233/OverlayStudio)

---

<div align="center">
  Made with ❤️ by the Overlay Studio team
  
  ⭐ Star us on GitHub if you find this project useful!
</div>
