import { ComicPreset, ArtStyleId, ToneId } from '../types/comic';

export const ART_STYLES: { id: ArtStyleId; name: string; description: string; sampleTag: string; badgeColor: string }[] = [
  {
    id: 'classic-comic',
    name: 'Classic Comic Book (Vintage Halftone)',
    description: 'Golden & Silver Age style with Ben-Day dots, bold ink outlines, primary colors, and dramatic comic shading.',
    sampleTag: 'Vintage Ben-Day Dots',
    badgeColor: 'bg-red-500 text-white'
  },
  {
    id: 'manga-anime',
    name: 'Japanese Anime / Manga',
    description: 'Shonen dynamic action lines, large emotive eyes, screentone shading, and cinematic camera angles.',
    sampleTag: 'Shonen Dynamic',
    badgeColor: 'bg-indigo-500 text-white'
  },
  {
    id: 'retro-cartoon',
    name: 'Retro Saturday Cartoon',
    description: 'Whimsical rubber-hose charm, bouncy exaggerated character poses, bright pastel palettes, and slapstick humor.',
    sampleTag: 'Slapstick Rubberhose',
    badgeColor: 'bg-amber-500 text-white'
  },
  {
    id: 'noir-graphic',
    name: 'Noir Graphic Novel',
    description: 'High-contrast black & white chiaroscuro, heavy shadows, rainy neon reflections, gritty detective atmosphere.',
    sampleTag: 'Chiaroscuro Noir',
    badgeColor: 'bg-stone-800 text-white'
  },
  {
    id: 'superhero-modern',
    name: 'Modern Superhero Action',
    description: 'Sleek digital ink, vibrant cinematic lighting, particle sparks, dynamic foreshortening, and intense action.',
    sampleTag: 'Cinematic Superhero',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'watercolor-storybook',
    name: 'Whimsical Watercolor Storybook',
    description: 'Soft organic watercolor washes, gentle pencil contours, enchanted and cozy fairy-tale aesthetics.',
    sampleTag: 'Enchanted Storybook',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'pixel-retro',
    name: 'Retro 16-Bit Pixel Comic',
    description: 'Nostalgic arcade sprites, pixel-art scenery, vibrant retro color ramps, and chunky gaming aesthetics.',
    sampleTag: '16-Bit Arcade',
    badgeColor: 'bg-purple-600 text-white'
  }
];

export const TONES: { id: ToneId; label: string; icon: string; mood: string }[] = [
  { id: 'Dramatic', label: 'Dramatic & Serious', icon: '⚡', mood: 'Intense stakes, heartfelt decisions, cinematic tension' },
  { id: 'Funny', label: 'Funny & Whimsical', icon: '😂', mood: 'Slapstick gags, witty banter, unexpected punchlines' },
  { id: 'Adventurous', label: 'Adventurous & Thrilling', icon: '🗺️', mood: 'Grand exploration, hidden discoveries, heroic bravery' },
  { id: 'Mysterious', label: 'Mysterious & Suspenseful', icon: '🔍', mood: 'Eerie secrets, cryptic clues, unexpected reveals' },
  { id: 'Heartwarming', label: 'Heartwarming & Uplifting', icon: '✨', mood: 'Friendship, empathy, inspiring moments of kindness' },
  { id: 'Dark Noir', label: 'Dark Noir & Gritty', icon: '🕵️', mood: 'Cynical narrators, smoke-filled alleys, moral ambiguity' },
  { id: 'Sci-Fi Action', label: 'Sci-Fi Action', icon: '🚀', mood: 'Futuristic gadgets, laser battles, intergalactic peril' },
  { id: 'Epic Fantasy', label: 'Epic Fantasy', icon: '🐉', mood: 'Ancient magic, mythical beasts, kingdoms in balance' }
];

export const COMIC_PRESETS: ComicPreset[] = [
  {
    id: 'brave-fox',
    title: 'The Brave Fox of Whispering Woods',
    prompt: 'A brave fox exploring an enchanted forest in search of the glowing Tree of Whispers to break a nocturnal spell.',
    characterName: 'Rusty',
    characterDescription: 'A clever, courageous russet-furred fox wearing a green scout scarf and carrying an antique brass compass.',
    setting: 'Enchanted Forest with bioluminescent mushrooms, towering mossy oaks, and shimmering fireflies',
    tone: 'Dramatic',
    artStyle: 'manga-anime',
    tagline: 'Scenario 1: Courageous expedition deep into the unknown woods',
    icon: '🦊'
  },
  {
    id: 'funny-fox',
    title: 'Rusty\'s Forest Fumble',
    prompt: 'A hilarious fox attempts to steal the royal picnic pie from under the nose of a snoozing forest badger.',
    characterName: 'Rusty',
    characterDescription: 'An overly optimistic fox wearing oversized comic goggles and carrying a comical sticky plunger.',
    setting: 'Sun-drenched forest clearing with a comically massive berry pie and a snoring badger',
    tone: 'Funny',
    artStyle: 'classic-comic',
    tagline: 'Scenario 2: Classic slapstick humor and retro Ben-Day dots',
    icon: '🥧'
  },
  {
    id: 'cyber-detective',
    title: 'Neon Detective: Case of the Cyber-Cat',
    prompt: 'A cybernetic private investigator hunts through rain-slicked skyscrapers for an elusive holographic feline holding corporate secrets.',
    characterName: 'Jax Mercer',
    characterDescription: 'A cynical street detective with a glowing trenchcoat collar and a bionic monocle eye.',
    setting: 'Neo-Metropolis year 2089, drenched in neon purple rain, holographic billboard reflections, and dark alleys',
    tone: 'Dark Noir',
    artStyle: 'noir-graphic',
    tagline: 'Rainy neon streets, glowing clues, and hard-boiled narration',
    icon: '🕵️‍♂️'
  },
  {
    id: 'cosmic-delivery',
    title: 'Cosmo\'s Intergalactic Express',
    prompt: 'A rookie star-courier must pilot a beat-up rocket through an asteroid obstacle course to deliver a piping hot pepperoni pizza.',
    characterName: 'Cosmo',
    characterDescription: 'An enthusiastic teenage astronaut with a transparent bubble helmet and patches from every galaxy on his spacesuit.',
    setting: 'Outer space nebula filled with floating cheese asteroids and alien drive-thru satellites',
    tone: 'Sci-Fi Action',
    artStyle: 'superhero-modern',
    tagline: 'Fast-paced zero-gravity thrills with explosive space sound effects',
    icon: '🚀'
  },
  {
    id: 'tiny-dragon',
    title: 'The Knight and the Teacup Dragon',
    prompt: 'A proud armored knight sets out to slay the kingdom\'s most terrifying legendary beast, only to find it is the size of a kitten and loves cinnamon rolls.',
    characterName: 'Sir Reginald',
    characterDescription: 'A chivalrous knight in shining silver plate armor who is surprisingly gentle-hearted.',
    setting: 'A cozy volcanic cave furnished with tiny velvet cushions and a miniature tea kettle',
    tone: 'Heartwarming',
    artStyle: 'watercolor-storybook',
    tagline: 'Whimsical, heartwarming fairy tale with sweet watercolor charm',
    icon: '🐉'
  }
];
