export type ArtStyleId = 
  | 'classic-comic'
  | 'manga-anime'
  | 'retro-cartoon'
  | 'noir-graphic'
  | 'superhero-modern'
  | 'watercolor-storybook'
  | 'pixel-retro';

export type ToneId = 
  | 'Dramatic'
  | 'Funny'
  | 'Adventurous'
  | 'Mysterious'
  | 'Heartwarming'
  | 'Dark Noir'
  | 'Sci-Fi Action'
  | 'Epic Fantasy';

export type BubbleType = 'speech' | 'thought' | 'shout' | 'whisper';
export type BubblePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface ComicDialogue {
  id: string;
  speaker: string;
  text: string;
  type: BubbleType;
  position: BubblePosition;
}

export interface ComicSoundEffect {
  text: string;
  style: 'explosion' | 'action' | 'zap' | 'subtle';
  color: string;
  position: 'top-right' | 'top-left' | 'center' | 'bottom-right';
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  title: string;
  sceneDescription: string;
  imagePrompt: string;
  imageUrl: string;
  imageStatus: 'idle' | 'generating' | 'ready' | 'error';
  narration: string;
  dialogues: ComicDialogue[];
  soundEffect?: ComicSoundEffect;
  cameraAngle: string;
}

export interface ComicProject {
  id: string;
  title: string;
  storyPrompt: string;
  characterName: string;
  characterDescription: string;
  setting: string;
  tone: ToneId;
  artStyle: ArtStyleId;
  panelsCount: number;
  panels: ComicPanel[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComicPreset {
  id: string;
  title: string;
  prompt: string;
  characterName: string;
  characterDescription: string;
  setting: string;
  tone: ToneId;
  artStyle: ArtStyleId;
  tagline: string;
  icon: string;
}

export interface LayoutSettings {
  gridColumns: 2 | 3;
  panelGap: number;
  borderWidth: number;
  showHalftone: boolean;
  paperTexture: boolean;
  captionStyle: 'yellow-box' | 'white-box' | 'vintage-badge';
}
