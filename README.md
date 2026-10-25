# Anannya AK — Interactive Developer Portfolio

> Modern, interactive portfolio website for **Anannya AK** — CSE Student specializing in Data Science & Software Engineering.

**Live Deployment**: [https://anannyaa97.github.io/PORTFOLIO/](https://anannyaa97.github.io/PORTFOLIO/)  
**GitHub Repository**: [https://github.com/anannyaa97/PORTFOLIO](https://github.com/anannyaa97/PORTFOLIO)

---

## 🌟 Overview & Highlights

This project transforms the portfolio of **Anannya AK** into a high-performance web experience built with **React**, **TypeScript**, **Tailwind CSS**, **React Bits**, and **Kokonut UI**.

- **GooeyNav (React Bits)**: Liquid SVG gooey navigation bar with frosted frame, particle transitions, smooth anchor scrolling, and active section spy across `#hero`, `#about`, `#experience`, `#projects`, `#skills`, and `#contact`.
- **Reference B Profile Card**: Centered portrait card with dark gradient overlays, academic credentials, and live status badges.
- **Academic Pulse & Narrative**: Bio overview with `LiquidGlassCard`, dual education cards (St. Thomas College of Engg. & GHSS Chala), verified certifications (IIT Bombay & NPTEL), and language proficiencies.
- **Reference A Project Grid**: Charcoal three-column card grid with visual previews, category badges, real project descriptions, and GitHub links.
- **GitHub Pages Ready**: Automated deployment workflow (`.github/workflows/deploy.yml`) configured for `base: "/PORTFOLIO/"`.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Framework & Runtime** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, PostCSS, Custom Design Tokens |
| **Motion & Physics** | `motion/react`, Spring Animations |
| **Interactive Components** | React Bits (`GooeyNav`, `ProfileCard`, `ElasticSlider`), Kokonut UI (`FlowField`, `LiquidGlassCard`) |
| **Icons** | Lucide React, Hugeicons (`@hugeicons/react`, `@hugeicons/core-free-icons`) |
| **Deployment** | GitHub Pages via GitHub Actions (`/PORTFOLIO/`) |

---

## 📂 Project Structure

```
PORTFOLIO/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── audio/                    # Real audio tracks for Music Player
│   │   ├── deep-focus.wav        # Ambient Lo-Fi / 432Hz focus track
│   │   ├── midnight-pulse.wav    # Synthwave pulse track
│   │   └── neural-drift.wav      # Atmospheric pad soundscape
│   ├── profile/
│   │   └── profile.jpeg          # Verified high-resolution portrait
│   └── resume.pdf                # Verified technical resume
├── src/
│   ├── components/
│   │   ├── reactbits/
│   │   │   ├── GooeyNav.tsx      # React Bits SVG gooey liquid navbar
│   │   │   ├── GooeyNav.css      # GooeyNav styles and SVG filter
│   │   │   ├── ProfileCard.tsx   # React Bits holographic 3D tilt card
│   │   │   ├── ProfileCard.css   # Holographic glare & badge styles
│   │   │   ├── ElasticSlider.tsx # React Bits physics spring volume slider
│   │   │   └── ElasticSlider.css # ElasticSlider styles
│   │   ├── kokonutui/
│   │   │   ├── flow-field.tsx    # Canvas particle wind streamlines
│   │   │   └── liquid-glass-card.tsx # SVG refraction glass cards
│   │   ├── ui/
│   │   │   ├── button.tsx        # Accessible button primitives
│   │   │   └── card.tsx          # Semantic card primitives
│   │   ├── icons.tsx             # Clean SVG icons
│   │   ├── Navbar.tsx            # GooeyNav integration with scrollspy
│   │   ├── MusicPlayer.tsx       # Real audio player with ElasticSlider
│   │   ├── Hero.tsx              # Hero section with FlowField & CTAs
│   │   ├── About.tsx             # ProfileCard & MusicPlayer 2-column layout
│   │   ├── Experience.tsx        # Dinesh IT Systems & Neovent Innovations
│   │   ├── Projects.tsx          # 6-card grid with previews & repo links
│   │   ├── Skills.tsx            # Categorized core tech stack
│   │   ├── Contact.tsx           # Contact form and contact details
│   │   └── Footer.tsx            # Minimalist footer with social links
│   ├── lib/
│   │   └── utils.ts              # cn & getAssetUrl helpers
│   ├── App.tsx                   # Root application component
│   ├── index.css                 # Global styles, fonts, and dark theme
│   ├── main.tsx                  # React DOM root entry with ErrorBoundary
│   └── vite-env.d.ts             # Vite client type definitions
├── index.html                    # Vite HTML template with SEO meta tags
├── package.json                  # Dependencies and npm scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS theme configuration
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite bundler configuration (base: "/PORTFOLIO/")
```

---

## 🎵 Music Player Customization

The Music Player in the About section uses real audio sources located in `public/audio/`.
To add or change the tracks:

1. Place your audio files (e.g. `.mp3` or `.wav`) inside the `public/audio/` directory.
2. Open `src/components/MusicPlayer.tsx`.
3. Update the `PLAYLIST` array with your track details:
   ```ts
   const PLAYLIST: Track[] = [
     {
       id: "track-1",
       title: "Your Song Title",
       artist: "Artist Name",
       src: getAssetUrl("audio/your-song.mp3"),
       duration: "3:45",
       accent: "#2DD4BF"
     },
     // ...
   ];
   ```
4. Save and the player will immediately reflect the new tracks with full play/pause, scrubbing, and volume control.

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static build will be generated in `dist/`.

---

## 🚢 GitHub Pages Deployment

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`).

To deploy:
1. Push this code to the `main` branch of your repository: `https://github.com/anannyaa97/PORTFOLIO`.
2. In GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The deployment workflow will automatically run, build the Vite app, and publish it to [https://anannyaa97.github.io/PORTFOLIO/](https://anannyaa97.github.io/PORTFOLIO/).
