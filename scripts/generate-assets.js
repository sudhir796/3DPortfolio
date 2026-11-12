import fs from 'fs';
import path from 'path';

const SITE_URL = process.env.VITE_SITE_URL || 'https://sudhir-guild-portfolio.vercel.app';

// 1. Generate public/robots.txt
const robotsTxt = `# Adventurers' Guild Portfolio Robots
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync('public/robots.txt', robotsTxt);
console.log('✓ Generated public/robots.txt');

// 2. Generate public/sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/?mode=2d</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;
fs.writeFileSync('public/sitemap.xml', sitemapXml);
console.log('✓ Generated public/sitemap.xml');

// 3. Generate public/manifest.json
const manifestJson = {
  name: "Sudhir | Adventurers' Guild 3D Portfolio",
  short_name: 'GuildPortfolio',
  description: "Interactive 3D Anime Fantasy Adventurers' Guild Portfolio for Sudhir (AI/ML & Full-Stack Developer)",
  start_url: '/?mode=3d',
  display: 'standalone',
  background_color: '#120d14',
  theme_color: '#120d14',
  icons: [
    {
      src: '/favicon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
    },
  ],
};
fs.writeFileSync('public/manifest.json', JSON.stringify(manifestJson, null, 2));
console.log('✓ Generated public/manifest.json');

// 4. Generate public/favicon.svg
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <radialGradient id="aura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#5ee6ff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#120d14" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#120d14" stroke="#d4af37" stroke-width="2"/>
  <circle cx="32" cy="32" r="26" fill="url(#aura)"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#5ee6ff" stroke-width="1.5" stroke-dasharray="4 3"/>
  <!-- Crossed Swords -->
  <g transform="translate(32, 32)">
    <!-- Sword 1 -->
    <path d="M-14 -14 L14 14" stroke="#f6eedb" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-10 -7 L-7 -10" stroke="#d4af37" stroke-width="3"/>
    <!-- Sword 2 -->
    <path d="M14 -14 L-14 14" stroke="#f6eedb" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M7 -10 L10 -7" stroke="#d4af37" stroke-width="3"/>
    <!-- Center Jewel -->
    <circle cx="0" cy="0" r="3" fill="#ffb347"/>
  </g>
</svg>`;
fs.writeFileSync('public/favicon.svg', faviconSvg);
console.log('✓ Generated public/favicon.svg');

// 5. Generate public/404.html (Guild Themed)
const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Lost in the Wilderness | Adventurers' Guild</title>
  <style>
    body {
      margin: 0;
      background-color: #120d14;
      color: #f6eedb;
      font-family: 'Cinzel', Georgia, serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: rgba(28, 20, 29, 0.95);
      border: 2px solid rgba(212, 175, 55, 0.6);
      border-radius: 12px;
      padding: 40px;
      max-width: 500px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255, 179, 71, 0.15);
    }
    h1 {
      color: #ffb347;
      font-size: 2.8rem;
      margin: 0 0 10px;
    }
    p {
      color: #ebdcb9;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    a {
      display: inline-block;
      padding: 10px 24px;
      background: rgba(168, 35, 40, 0.85);
      border: 1px solid #d4af37;
      color: #f6eedb;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    a:hover {
      background: rgba(212, 175, 55, 0.3);
      color: #ffb347;
    }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 3rem; margin-bottom: 10px;">⚔</div>
    <h1>404: Lost Bounty</h1>
    <p>This quest scroll has been lost to the fog or claimed by another guild. Return to the safety of the main hall.</p>
    <a href="/">Return to Guild Hall</a>
  </div>
</body>
</html>`;
fs.writeFileSync('public/404.html', notFoundHtml);
console.log('✓ Generated public/404.html');

// 6. Generate 1200x630 Open Graph Image HTML template for snapshot
const ogHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background-color: #120d14;
      background-image:
        radial-gradient(ellipse at 50% 0%, rgba(255, 179, 71, 0.15) 0%, transparent 60%),
        radial-gradient(circle at 85% 85%, rgba(94, 230, 255, 0.12) 0%, transparent 45%);
      color: #f6eedb;
      font-family: 'Cinzel', Georgia, serif;
      padding: 60px 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      border: 12px solid #1c141d;
    }
    .filigree-border {
      position: absolute;
      inset: 16px;
      border: 2px solid rgba(212, 175, 55, 0.6);
      pointer-events: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 4px;
      background: rgba(168, 35, 40, 0.85);
      border: 1px solid #d4af37;
      color: #f6eedb;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      width: fit-content;
    }
    h1 {
      font-size: 64px;
      font-weight: 900;
      letter-spacing: 0.05em;
      color: #f6eedb;
      margin: 16px 0 10px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.9);
    }
    .classes {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }
    .class-tag {
      padding: 6px 16px;
      border-radius: 4px;
      background: rgba(94, 230, 255, 0.15);
      border: 1.5px solid #5ee6ff;
      color: #5ee6ff;
      font-family: monospace;
      font-size: 18px;
      font-weight: 700;
    }
    .tagline {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 22px;
      color: #ebdcb9;
      max-width: 800px;
      line-height: 1.5;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(212, 175, 55, 0.4);
      padding-top: 20px;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      color: #ffb347;
      letter-spacing: 0.08em;
    }
    .footer-right {
      font-family: monospace;
      font-size: 18px;
      color: #5ee6ff;
    }
  </style>
</head>
<body>
  <div class="filigree-border"></div>
  <div>
    <div class="badge">✦ Interactive 3D Adventurers' Guild Portfolio</div>
    <h1>SUDHIR</h1>
    <div class="classes">
      <div class="class-tag">AI/ML Developer</div>
      <div class="class-tag">Full-Stack Developer</div>
    </div>
    <div class="tagline">
      Building applied-AI and full-stack projects in a stylized anime-fantasy adventurers' guild hall.
    </div>
  </div>

  <div class="footer">
    <div class="footer-left">
      <span>⚔</span>
      <span>Sri Eshwar College of Engineering</span>
    </div>
    <div class="footer-right">
      <span>Three.js • React • WebGL</span>
    </div>
  </div>
</body>
</html>`;
fs.writeFileSync('public/og-template.html', ogHtml);
console.log('✓ Generated public/og-template.html');

