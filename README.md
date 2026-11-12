# ⚔ Adventurers' Guild: 3D Anime Fantasy Portfolio

An interactive developer portfolio set inside a stylized anime-fantasy adventurers' guild hall. Built entirely with procedural code—**zero imported 3D model files (`.glb`/`.gltf`) or external asset downloads**.

Features both a cinematic scroll-driven 3D WebGL experience and an ultra-fast, accessible 2D chronicle fallback.

---

## 🌟 Key Features

* **3D Procedural Guild Hall**:
  * 8 distinct zones: Entrance, Notice Board, Registrar Counter, Appraisal Dais, Hearth Fireplace, Dining Tavern, Bookshelves, and Timber Rafters.
  * Real-time toon shading with procedural ramp gradients, warm flickering lanterns, and atmospheric god-rays.
  * 5-Station Guided Tour with smooth CatmullRom spline camera journey and dwell zones.
  * Explore / Orbit Mode (`Key: O`) for 360° freeform hall inspection.
* **Pure Web Audio API Sound Synth**:
  * Procedurally synthesized tavern drone, fireplace crackle, and melodic UI chimes. Zero audio files.
* **Magic Cursor & Neural Trail**:
  * Glowing teal orb with 10 trailing nodes, interactive expansion rings, and click sparkle bursts.
* **Adaptive Quality & Fallback**:
  * Drei `PerformanceMonitor` dynamically tunes fidelity across High, Medium, and Low tiers.
  * Standalone, code-split 2D Fallback version (< 60 KB gzipped) for low-power devices, mobile, or disabled WebGL.
* **SEO & Social Sharing Ready**:
  * JSON-LD `Person` schema, Open Graph 1200x630 social preview card, web manifest, `robots.txt`, and `sitemap.xml`.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) v18+ (Node 20+ recommended)
* npm or pnpm

### Installation
```bash
# 1. Clone repository
git clone https://github.com/sudhir796/3dportfolio.git
cd 3dportfolio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📜 Editing Portfolio Content

All personal details, projects, skills, timeline events, and contact links are driven from **one single file**:

📁 `src/data/content.js`

### What You Can Edit:
1. **Profile**: Update `name`, `guildTitle`, `rank`, `classes`, `tagline`, and `education`.
2. **Quests (Projects)**: Add or edit quests in the `quests` array:
   ```javascript
   {
     id: 'my-project',
     title: 'My Project Name',
     rank: 'A', // 'A' | 'B' | 'C'
     status: 'Completed',
     statusNote: 'hackathon build',
     track: ['AIML', 'FULLSTACK'],
     summary: 'Brief project pitch...',
     tech: ['Python', 'FastAPI', 'React'],
     links: {
       github: 'https://github.com/your-username/repo',
       demo: 'https://demo-link.com'
     },
     highlights: ['Key achievement 1', 'Key achievement 2']
   }
   ```
3. **Abilities**: Edit skills, certifications, and medals in `abilities`.
4. **Journey**: Add career milestones and timeline entries in `journey`.
5. **Contact**: Add your GitHub, LinkedIn, email, and social links in `contact`.
6. **Resume PDF**: Simply place a file named `resume.pdf` in the `/public` folder (`/public/resume.pdf`). The download button will automatically appear in the UI!

> **Honest Badge Rule**: If any link or field is marked as `TODO` or left empty (`""`), it will automatically hide or render as a graceful placeholder without throwing errors.

---

## 🔍 Link & Content Audit Script

Before deploying, run the automated link and content checker:

```bash
npm run check:links
```

This script will:
* Verify that all configured URLs are syntactically valid and reachable.
* List any remaining `TODO` or unpopulated fields so you can review what needs personalizing.

---

## 🎮 Navigation & Mode Controls

| Key / Action | Function |
| :--- | :--- |
| **Mouse Wheel / Touch Scroll** | Travels smoothly along the 5-station guild journey |
| **Dot Nav (Right Edge)** | Directly scrolls the camera to any station |
| **`O` Key** | Toggles free-camera **Orbit / Explore Mode** |
| **`G` Key** | Toggles dev **Tour Debug View** (camera markers, sightlines & frustum checks) |
| **`P` Key** | Toggles real-time **FPS & Memory Stats** |
| **Gear Icon (Top Right)** | Opens the **Guild Settings Menu** (Quality Tiers, Audio, Cursor Trail, Reduced Motion) |
| **Speaker Icon (Top Right)**| Unmutes the procedural Web Audio ambient soundscape |
| **`?mode=2d` in URL** | Forces the high-speed 2D chronicle fallback version |
| **`?mode=3d` in URL** | Forces the 3D WebGL guild hall experience |

---

## 🌐 Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `3dportfolio` repository.
4. Vercel will auto-detect **Vite**:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. *(Optional)* In **Environment Variables**, set:
   * `VITE_SITE_URL` = `https://your-custom-domain.com` (or your vercel.app URL)
6. Click **Deploy**. Your portfolio will be live with full edge caching and SPA routing configured via `vercel.json`!

### Option 2: Deploy to Netlify

1. Push your repository to **GitHub**.
2. Log into [Netlify](https://netlify.com) and click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Netlify will read the included `netlify.toml`:
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
5. Click **Deploy**.

---

## 🛡 Performance & Accessibility

* **Initial 2D Bundle**: Under ~60 KB gzipped JavaScript.
* **Code Splitting**: Heavy WebGL dependencies (`three`, `@react-three/fiber`, `@react-three/drei`, `postprocessing`) are isolated into an asynchronous chunk loaded only when entering 3D mode.
* **Reduced Motion**: Respects `prefers-reduced-motion` across both 2D and 3D modes.
* **A11y**: Features keyboard-accessible focus outlines, skip link (`Skip to main content`), ARIA dialogs, and a crawlable semantic outline.
