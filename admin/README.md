# Anannya AK — Portfolio CMS Admin Panel

A standalone, production-ready Admin Dashboard application built with **React 18 + TypeScript + Tailwind CSS** for managing portfolio content dynamically.

---

## Features

- **Modern SaaS Dashboard**: Minimalist cards, responsive collapsible sidebar, light/dark theme toggle, toast alerts, confirmation dialogs.
- **Complete Content Management (CRUD)**:
  - **Profile**: Full name, title, headline, bio, avatar, resume, location, email, CGPA, specialization.
  - **About**: Narrative paragraphs, institutional focus, college name, CGPA.
  - **Skills**: Skill name, category, proficiency slider (0–100%), reordering, published toggle.
  - **Projects**: Title, category, full description, short description, visual preview style (`chart`, `terminal`, `hotel`, `hardware`, `web`, `migration`), tech tags, GitHub URL, Live demo URL, featured toggle, publication toggle.
  - **Experience**: Role, company, employment type, period, responsibilities bullet points, tech tags, accent color.
  - **Education**: Degree, field, institution, period, grade, badge.
  - **Certificates**: Title, issuing organization, year, verification URL, credential document.
  - **Achievements**: Title, description, date, event.
  - **Services**: Service name, description, deliverables list.
- **Media Manager**:
  - Upload images, documents (PDF), and audio to Google Drive.
  - Interactive file previews (lightbox for images, inline audio player for audio files).
  - One-click copy asset URL.
  - Delete asset with confirmation.
- **Website Management**:
  - **Navigation**: Manage menu items and anchor links.
  - **Social Links**: Manage external profiles (GitHub, LinkedIn, Email).
  - **Contact**: Email, location, transmission parameters.
  - **Music Player**: Audio tracks, artists, categories, enable/disable tracks.
  - **Appearance**: Theme accent color presets and custom hex picker, section visibility toggles.
- **System**:
  - **Preview Website**: Interactive responsive viewport simulation (Desktop, Tablet, Mobile).
  - **Activity Log**: Full audit trail of administrative actions.
  - **Settings**: Web App endpoint, Google OAuth configuration, connection testing.
- **Authentication & Security**:
  - Google Sign-In with server-side allowlist check (`anannyaak01@gmail.com`).
  - Fallback emergency administrator key authentication.

---

## Local Development

```bash
cd admin
npm install
npm run dev
```

The admin dashboard runs at `http://localhost:5174`.

---

## Deployment (Independent from Public Portfolio)

Deploy independently to **Render**, **Vercel**, or **Netlify**:

### Render Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_APPS_SCRIPT_URL`: Your deployed Apps Script Web App URL
  - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
