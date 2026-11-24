# ANANNYA AK — PERSONAL PORTFOLIO WEBSITE

High-performance, modern, and fully static personal portfolio website for **[https://anannya-ak.onrender.com](https://anannya-ak.onrender.com)**.

Built with **React 18 + TypeScript + Tailwind CSS + Motion + Kokonut UI**. Fully static with zero external database or serverless backend dependencies.

---

## 1. Architecture & Highlights

* **100% Static & Blazing Fast**: Zero external database latency, cold starts, or runtime network overhead.
* **Component-Driven Content**: Structured, typed portfolio data managed directly in [`src/lib/portfolioService.ts`](./src/lib/portfolioService.ts).
* **Responsive & Fluid UI**:
  * Optimized streamline flow field particle canvas in the Hero section.
  * Modern, hardware-accelerated CSS glassmorphism.
  * Adaptive navigation with smooth scroll tracking.
  * Interactive audio player and volume control.
* **Technical SEO & GEO (Generative Engine Optimization)**:
  * Canonical URLs and semantic headings.
  * Embedded JSON-LD structured data graph for `Person`, `WebSite`, `ProfilePage`, `BreadcrumbList`, and `ItemList`.
  * Automatic `robots.txt` and `sitemap.xml` support.

---

## 2. Project Structure

```
├── public/                 # Static assets (audio tracks, profile images, robots.txt, sitemap)
│   ├── audio/              # Soundscape audio tracks
│   ├── profile/            # Profile portrait image
│   ├── resume.pdf          # Curriculum Vitae PDF
│   ├── robots.txt          # Crawler instructions
│   └── sitemap.xml         # XML sitemap
├── src/
│   ├── components/         # Modular section components
│   │   ├── kokonutui/      # Streamline flow field and glass card primitives
│   │   ├── reactbits/      # Elastic slider and interactive gooey navigation
│   │   ├── ui/             # Core button and card primitives
│   │   ├── About.tsx       # Narrative and education summary
│   │   ├── Achievements.tsx# Honors and recognitions
│   │   ├── Contact.tsx     # Direct contact channels & protocol
│   │   ├── Education.tsx   # Degree milestones and certificates
│   │   ├── Experience.tsx  # Industry internship timeline
│   │   ├── Footer.tsx      # Social links and footer navigation
│   │   ├── Hero.tsx        # Dynamic landing section with particle wind canvas
│   │   ├── MusicPlayer.tsx # Interactive focus soundscape player
│   │   ├── Navbar.tsx      # Fixed responsive navigation
│   │   ├── Projects.tsx    # Showcase of software engineering projects
│   │   └── Skills.tsx      # Categorized technical competencies
│   ├── context/
│   │   └── PortfolioContext.tsx # Centralized data provider
│   ├── lib/
│   │   ├── portfolioService.ts # Typed static portfolio data
│   │   └── utils.ts        # Class merging and asset URL resolver
│   ├── App.tsx             # Root application layout
│   ├── index.css           # Global Tailwind utilities
│   └── main.tsx            # Application entry point
├── index.html              # HTML template with preconnect fonts & JSON-LD
├── package.json            # Scripts and dependencies
├── tailwind.config.js      # Design tokens and color themes
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 3. Local Development Commands

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm run dev
```
The site runs locally at `http://localhost:5173/`.

### Build for Production
```bash
npm run build
```
Generates production-optimized static files in `dist/`.

### Preview Production Build
```bash
npm run preview
```

---

## 4. Customizing Content

All portfolio content is structured and typed in [`src/lib/portfolioService.ts`](./src/lib/portfolioService.ts). You can update your bio, skills, projects, work experience, certifications, and links in one file.
