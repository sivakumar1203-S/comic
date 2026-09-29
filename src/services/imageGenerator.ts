import { ArtStyleId, ComicPanel, ToneId } from '../types/comic';

interface RenderVisualOptions {
  panelNumber: number;
  title: string;
  sceneDescription: string;
  characterName: string;
  setting: string;
  artStyle: ArtStyleId;
  tone: ToneId;
}

// Generates high quality stylized SVG comic artwork based on style, setting, character, and tone
export function generateComicIllustrationSvg(opts: RenderVisualOptions): string {
  const { panelNumber, title, sceneDescription, characterName, setting, artStyle, tone } = opts;

  // Style palettes
  let skyColor1 = '#1e293b';
  let skyColor2 = '#0f172a';
  let groundColor = '#334155';
  let accentColor = '#f59e0b';
  let inkColor = '#000000';
  let halftoneDotColor = '#cbd5e1';
  let moodGlow = '#38bdf8';

  if (artStyle === 'classic-comic') {
    skyColor1 = '#fef08a';
    skyColor2 = '#fb923c';
    groundColor = '#16a34a';
    accentColor = '#dc2626';
    inkColor = '#000000';
    halftoneDotColor = 'rgba(239, 68, 68, 0.25)';
    moodGlow = '#facc15';
  } else if (artStyle === 'manga-anime') {
    skyColor1 = '#1e1b4b';
    skyColor2 = '#312e81';
    groundColor = '#1e293b';
    accentColor = '#818cf8';
    inkColor = '#0f172a';
    halftoneDotColor = 'rgba(255, 255, 255, 0.15)';
    moodGlow = '#a855f7';
  } else if (artStyle === 'retro-cartoon') {
    skyColor1 = '#bae6fd';
    skyColor2 = '#fed7aa';
    groundColor = '#86efac';
    accentColor = '#f43f5e';
    inkColor = '#1c1917';
    halftoneDotColor = 'rgba(244, 63, 94, 0.15)';
    moodGlow = '#fde047';
  } else if (artStyle === 'noir-graphic') {
    skyColor1 = '#09090b';
    skyColor2 = '#18181b';
    groundColor = '#27272a';
    accentColor = '#e11d48';
    inkColor = '#000000';
    halftoneDotColor = 'rgba(255, 255, 255, 0.12)';
    moodGlow = '#ffffff';
  } else if (artStyle === 'superhero-modern') {
    skyColor1 = '#0c4a6e';
    skyColor2 = '#0369a1';
    groundColor = '#0284c7';
    accentColor = '#f97316';
    inkColor = '#000000';
    halftoneDotColor = 'rgba(251, 146, 60, 0.2)';
    moodGlow = '#38bdf8';
  } else if (artStyle === 'watercolor-storybook') {
    skyColor1 = '#fef3c7';
    skyColor2 = '#dbeafe';
    groundColor = '#bbf7d0';
    accentColor = '#fb7185';
    inkColor = '#3f3f46';
    halftoneDotColor = 'rgba(251, 113, 133, 0.12)';
    moodGlow = '#fef08a';
  } else if (artStyle === 'pixel-retro') {
    skyColor1 = '#311465';
    skyColor2 = '#180736';
    groundColor = '#005b41';
    accentColor = '#00ffc6';
    inkColor = '#000000';
    halftoneDotColor = 'rgba(0, 255, 198, 0.2)';
    moodGlow = '#ff007f';
  }

  // Determine setting backdrop elements
  const isForest = setting.toLowerCase().includes('forest') || setting.toLowerCase().includes('wood') || sceneDescription.toLowerCase().includes('forest');
  const isCity = setting.toLowerCase().includes('city') || setting.toLowerCase().includes('neon') || setting.toLowerCase().includes('metropolis') || setting.toLowerCase().includes('alley');
  const isSpace = setting.toLowerCase().includes('space') || setting.toLowerCase().includes('star') || setting.toLowerCase().includes('asteroid');
  const isCastle = setting.toLowerCase().includes('castle') || setting.toLowerCase().includes('cave') || setting.toLowerCase().includes('dragon');

  // Dynamic visual features based on scene
  const isDramatic = tone === 'Dramatic' || tone === 'Dark Noir';
  const isFunny = tone === 'Funny';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad_${panelNumber}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${skyColor1}" />
      <stop offset="100%" stop-color="${skyColor2}" />
    </linearGradient>

    <radialGradient id="sunGrad_${panelNumber}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${moodGlow}" stop-opacity="0.8" />
      <stop offset="60%" stop-color="${accentColor}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${skyColor2}" stop-opacity="0" />
    </radialGradient>

    <!-- Comic Halftone Pattern -->
    <pattern id="halftone_${panelNumber}" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="7" cy="7" r="2.5" fill="${halftoneDotColor}" />
    </pattern>

    <!-- Speed Lines for Action / Anime / Comic -->
    <pattern id="speedlines_${panelNumber}" x="0" y="0" width="100" height="600" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="600" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <line x1="25" y1="0" x2="125" y2="600" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
      <line x1="70" y1="0" x2="170" y2="600" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    </pattern>

    <!-- Filter for Comic Print Texture -->
    <filter id="comicShadow_${panelNumber}">
      <feDropShadow dx="6" dy="6" stdDeviation="0" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Sky / Background -->
  <rect width="800" height="600" fill="url(#bgGrad_${panelNumber})" />
  <circle cx="${panelNumber % 2 === 0 ? 600 : 250}" cy="220" r="260" fill="url(#sunGrad_${panelNumber})" />

  <!-- Ben-Day Halftone Layer -->
  <rect width="800" height="600" fill="url(#halftone_${panelNumber})" opacity="0.85" />

  ${isDramatic || artStyle === 'manga-anime' ? `<rect width="800" height="600" fill="url(#speedlines_${panelNumber})" />` : ''}

  <!-- Background Scenery Elements -->
  ${isForest ? `
    <!-- Enchanted Forest Trees & Bioluminescence -->
    <g fill="${skyColor2}" opacity="0.6">
      <path d="M 0 450 L 50 250 L 90 450 Z" />
      <path d="M 80 470 L 130 200 L 180 470 Z" />
      <path d="M 220 460 L 280 230 L 340 460 Z" />
      <path d="M 450 480 L 520 220 L 590 480 Z" />
      <path d="M 650 460 L 720 260 L 790 460 Z" />
    </g>
    <!-- Foreground Enchanted Trees -->
    <g fill="${groundColor}" stroke="${inkColor}" stroke-width="4">
      <path d="M -40 600 L 120 180 L 170 600 Z" />
      <path d="M 620 600 L 710 160 L 850 600 Z" />
      <!-- Magical vines/foliage -->
      <circle cx="120" cy="180" r="90" fill="#22c55e" opacity="0.8" />
      <circle cx="710" cy="160" r="100" fill="#15803d" opacity="0.8" />
      <circle cx="380" cy="190" r="60" fill="#10b981" opacity="0.4" />
    </g>
    <!-- Glowing Spores / Fireflies -->
    <g fill="${moodGlow}">
      <circle cx="180" cy="320" r="5" opacity="0.9" filter="url(#comicShadow_${panelNumber})"/>
      <circle cx="260" cy="270" r="7" opacity="0.8" />
      <circle cx="540" cy="350" r="6" opacity="0.8" />
      <circle cx="610" cy="290" r="4" opacity="0.9" />
      <circle cx="420" cy="310" r="6" opacity="0.7" />
    </g>
  ` : isCity ? `
    <!-- Cyber City Skyscrapers -->
    <g fill="${skyColor2}" stroke="${inkColor}" stroke-width="3">
      <rect x="50" y="160" width="90" height="440" />
      <rect x="180" y="110" width="130" height="490" />
      <rect x="360" y="190" width="110" height="410" />
      <rect x="520" y="90" width="140" height="510" />
      <rect x="700" y="210" width="80" height="390" />
    </g>
    <!-- Glowing Cyber Windows -->
    <g fill="${accentColor}" opacity="0.8">
      <rect x="200" y="140" width="12" height="16" />
      <rect x="230" y="140" width="12" height="16" />
      <rect x="200" y="180" width="12" height="16" />
      <rect x="260" y="220" width="12" height="16" />
      <rect x="550" y="130" width="16" height="20" fill="${moodGlow}" />
      <rect x="590" y="130" width="16" height="20" fill="${moodGlow}" />
      <rect x="550" y="180" width="16" height="20" fill="${moodGlow}" />
    </g>
    <!-- Neon Signs -->
    <rect x="210" y="290" width="70" height="22" rx="4" fill="${accentColor}" stroke="#ffffff" stroke-width="2" />
    <text x="245" y="305" font-family="Bangers, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">CYBER</text>
  ` : isSpace ? `
    <!-- Space Stars & Nebula Asteroids -->
    <g fill="#ffffff">
      <circle cx="80" cy="90" r="3" />
      <circle cx="210" cy="70" r="2" />
      <circle cx="340" cy="140" r="4" />
      <circle cx="620" cy="110" r="3" />
      <circle cx="730" cy="70" r="2.5" />
      <circle cx="150" cy="240" r="2" />
      <circle cx="680" cy="220" r="3" />
    </g>
    <!-- Giant ringed planet -->
    <circle cx="650" cy="160" r="70" fill="${accentColor}" stroke="${inkColor}" stroke-width="4" />
    <ellipse cx="650" cy="160" rx="110" ry="24" fill="none" stroke="${moodGlow}" stroke-width="6" transform="rotate(-20 650 160)" />
    <!-- Floating Asteroids -->
    <polygon points="120,380 180,360 210,410 160,450 100,420" fill="${groundColor}" stroke="${inkColor}" stroke-width="4" />
    <polygon points="680,410 740,390 770,440 730,470 660,450" fill="${groundColor}" stroke="${inkColor}" stroke-width="4" />
  ` : `
    <!-- Fantasy Landscape / Rolling Hills -->
    <path d="M 0 460 Q 200 370 400 450 T 800 420 L 800 600 L 0 600 Z" fill="${groundColor}" stroke="${inkColor}" stroke-width="4" />
    <path d="M 0 520 Q 300 470 600 530 T 800 500 L 800 600 L 0 600 Z" fill="${inkColor}" opacity="0.3" />
  `}

  <!-- Ground Terrain -->
  <path d="M -10 490 Q 250 460 500 480 T 810 470 L 810 610 L -10 610 Z" fill="${groundColor}" stroke="${inkColor}" stroke-width="5" />

  <!-- Character Presentation Center Stage -->
  <g id="character_figure_${panelNumber}">
    <!-- Dramatic Character Shadow -->
    <ellipse cx="400" cy="520" rx="90" ry="22" fill="#000000" opacity="0.65" />

    <!-- Stylized Character Silhouette & Badge -->
    <g transform="translate(400, 440)">
      <!-- Outer aura for dramatic / superhero -->
      <circle cx="0" cy="-80" r="105" fill="${accentColor}" opacity="0.25" />
      
      <!-- Character Body -->
      <path d="M -45 5 L -35 -90 L 35 -90 L 45 5 Z" fill="${artStyle === 'noir-graphic' ? '#18181b' : accentColor}" stroke="${inkColor}" stroke-width="5" />
      
      <!-- Belt & Accessories -->
      <rect x="-42" y="-15" width="84" height="14" rx="3" fill="#eab308" stroke="${inkColor}" stroke-width="3" />
      <circle cx="0" cy="-8" r="10" fill="#ffffff" stroke="${inkColor}" stroke-width="2" />
      
      <!-- Cape / Scarf / Coat -->
      ${isDramatic || artStyle === 'superhero-modern' ? `
        <path d="M -35 -85 C -80 -70 -120 -20 -110 30 C -80 15 -60 -10 -40 -30 Z" fill="${accentColor}" stroke="${inkColor}" stroke-width="4" />
      ` : ''}

      <!-- Character Head -->
      <circle cx="0" cy="-135" r="48" fill="${artStyle === 'retro-cartoon' ? '#fed7aa' : '#fde047'}" stroke="${inkColor}" stroke-width="5" />

      <!-- Animal Ears if Fox or Hero Mask -->
      ${characterName.toLowerCase().includes('fox') || sceneDescription.toLowerCase().includes('fox') ? `
        <!-- Fox Ears -->
        <polygon points="-38,-160 -48,-210 -15,-175" fill="${accentColor}" stroke="${inkColor}" stroke-width="4" />
        <polygon points="-35,-165 -42,-198 -20,-176" fill="#fef08a" />
        <polygon points="38,-160 48,-210 15,-175" fill="${accentColor}" stroke="${inkColor}" stroke-width="4" />
        <polygon points="35,-165 42,-198 20,-176" fill="#fef08a" />
        <!-- White Fox Cheeks -->
        <ellipse cx="-20" cy="-125" rx="14" ry="12" fill="#ffffff" />
        <ellipse cx="20" cy="-125" rx="14" ry="12" fill="#ffffff" />
        <!-- Fox Snout -->
        <polygon points="-8,-128 8,-128 0,-118" fill="${inkColor}" />
      ` : `
        <!-- Hero Mask / Monocle -->
        <path d="M -30 -140 Q 0 -130 30 -140 Q 0 -152 -30 -140 Z" fill="${inkColor}" />
      `}

      <!-- Expressive Eyes based on Tone -->
      ${isFunny ? `
        <!-- Big Goofy Cartoon Eyes -->
        <ellipse cx="-16" cy="-144" rx="12" ry="15" fill="#ffffff" stroke="${inkColor}" stroke-width="3" />
        <ellipse cx="16" cy="-144" rx="12" ry="15" fill="#ffffff" stroke="${inkColor}" stroke-width="3" />
        <circle cx="-13" cy="-143" r="6" fill="${inkColor}" />
        <circle cx="19" cy="-143" r="6" fill="${inkColor}" />
        <!-- Sparkle dots -->
        <circle cx="-15" cy="-146" r="2.5" fill="#ffffff" />
        <circle cx="17" cy="-146" r="2.5" fill="#ffffff" />
        <!-- Big Smile -->
        <path d="M -18 -115 Q 0 -95 18 -115 Z" fill="#ef4444" stroke="${inkColor}" stroke-width="3" />
      ` : `
        <!-- Determined / Dramatic Anime Eyes -->
        <polygon points="-24,-146 -8,-140 -20,-134" fill="${inkColor}" />
        <polygon points="24,-146 8,-140 20,-134" fill="${inkColor}" />
        <circle cx="-16" cy="-140" r="3" fill="#ffffff" />
        <circle cx="16" cy="-140" r="3" fill="#ffffff" />
        <!-- Serious mouth line -->
        <line x1="-10" y1="-115" x2="10" y2="-115" stroke="${inkColor}" stroke-width="3" stroke-linecap="round" />
      `}

      <!-- Character Arms / Action Poses -->
      <path d="M -40 -70 L -75 -40 L -60 -20" stroke="${inkColor}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M 40 -70 L 75 -40 L 60 -20" stroke="${inkColor}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />

      <!-- Dramatic lighting rim -->
      <circle cx="0" cy="-135" r="48" fill="none" stroke="${moodGlow}" stroke-width="3" opacity="0.6" />
    </g>
  </g>

  <!-- Dynamic Foreground Prop / Action Accent -->
  ${panelNumber === 1 ? `
    <!-- Beginning compass / relic glow -->
    <g transform="translate(400, 480)" filter="url(#comicShadow_${panelNumber})">
      <circle cx="0" cy="0" r="22" fill="#fbbf24" stroke="${inkColor}" stroke-width="3" />
      <polygon points="0,-16 4,0 0,16 -4,0" fill="#dc2626" />
    </g>
  ` : panelNumber === 2 ? `
    <!-- Action sparks -->
    <g stroke="${accentColor}" stroke-width="3" stroke-linecap="round">
      <line x1="330" y1="360" x2="310" y2="330" />
      <line x1="470" y1="360" x2="490" y2="330" />
      <line x1="400" y1="280" x2="400" y2="250" />
    </g>
  ` : panelNumber === 3 ? `
    <!-- Climax Power Surge -->
    <circle cx="400" cy="380" r="140" fill="none" stroke="${accentColor}" stroke-width="5" stroke-dasharray="14,14" opacity="0.7" />
  ` : `
    <!-- Triumphant Crest -->
    <polygon points="400,280 415,315 450,320 425,345 430,380 400,360 370,380 375,345 350,320 385,315" fill="#facc15" stroke="${inkColor}" stroke-width="3" filter="url(#comicShadow_${panelNumber})" />
  `}

  <!-- Comic Panel Heavy Vignette and Border Line -->
  <rect x="4" y="4" width="792" height="592" fill="none" stroke="${inkColor}" stroke-width="8" />

  <!-- Corner Panel Stamp Badge -->
  <rect x="18" y="18" width="120" height="28" rx="4" fill="${inkColor}" />
  <text x="78" y="37" font-family="Bangers, sans-serif" font-size="16" fill="#facc15" text-anchor="middle" letter-spacing="1">PANEL ${panelNumber}</text>

</svg>
`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Request AI image from backend, with instant reliable fallback
export async function requestPanelImage(
  prompt: string,
  artStyle: ArtStyleId,
  panelData: RenderVisualOptions
): Promise<string> {
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        artStyle,
        characterName: panelData.characterName,
        setting: panelData.setting,
        tone: panelData.tone
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.imageUrl && (data.imageUrl.startsWith('data:image/') || data.imageUrl.startsWith('http'))) {
        return data.imageUrl;
      }
    }
  } catch (err) {
    console.warn('API image generation fallback engaged:', err);
  }

  // Graceful fallback to crisp vector comic illustration
  return generateComicIllustrationSvg(panelData);
}
