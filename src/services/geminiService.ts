import { ArtStyleId, ComicPanel, ComicProject, ToneId } from '../types/comic';
import { generateComicIllustrationSvg, requestPanelImage } from './imageGenerator';

export interface GenerateComicInput {
  storyPrompt: string;
  characterName: string;
  setting: string;
  tone: ToneId;
  artStyle: ArtStyleId;
  panelsCount: number;
}

// Generate the comic story via server proxy route or intelligent fallback
export async function generateComicStory(input: GenerateComicInput): Promise<ComicProject> {
  const { storyPrompt, characterName, setting, tone, artStyle, panelsCount } = input;

  let rawStoryData: any = null;

  try {
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.panels && Array.isArray(data.panels)) {
        rawStoryData = data;
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API call encountered error, using local storytelling engine:', err);
  }

  // If backend was not reached or returned fallback, generate dynamic thematic story
  if (!rawStoryData) {
    rawStoryData = generateLocalThematicStory(input);
  }

  // Assemble full ComicProject
  const projectId = `comic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const panels: ComicPanel[] = [];

  for (let i = 0; i < rawStoryData.panels.length; i++) {
    const rawP = rawStoryData.panels[i];
    const panelNumber = i + 1;
    const visualOpts = {
      panelNumber,
      title: rawP.title || `Panel ${panelNumber}`,
      sceneDescription: rawP.sceneDescription || storyPrompt,
      characterName,
      setting,
      artStyle,
      tone
    };

    // Generate panel SVG / artwork
    const svgIllustration = generateComicIllustrationSvg(visualOpts);

    panels.push({
      id: `p_${projectId}_${panelNumber}`,
      panelNumber,
      title: rawP.title || `Episode Part ${panelNumber}`,
      sceneDescription: rawP.sceneDescription || `Action scene for ${characterName}`,
      imagePrompt: rawP.imagePrompt || `${artStyle} illustration: ${characterName} in ${setting}`,
      imageUrl: svgIllustration,
      imageStatus: 'ready',
      narration: rawP.narration || '',
      dialogues: rawP.dialogues && rawP.dialogues.length > 0 ? rawP.dialogues.map((d: any, idx: number) => ({
        id: `dlg_${panelNumber}_${idx}`,
        speaker: d.speaker || characterName,
        text: d.text || '...',
        type: d.type || 'speech',
        position: d.position || (idx % 2 === 0 ? 'top-left' : 'top-right')
      })) : [
        {
          id: `dlg_${panelNumber}_0`,
          speaker: characterName,
          text: tone === 'Funny' ? 'Wait a second... this wasn\'t in the manual!' : 'I must keep going, no matter what lies ahead.',
          type: 'speech',
          position: 'top-left'
        }
      ],
      soundEffect: rawP.soundEffect || (panelNumber === 2 || panelNumber === 3 ? {
        text: tone === 'Funny' ? 'BOING!' : 'WHOOSH!',
        style: tone === 'Funny' ? 'zap' : 'action',
        color: tone === 'Funny' ? '#f59e0b' : '#ef4444',
        position: 'center'
      } : undefined),
      cameraAngle: rawP.cameraAngle || (panelNumber === 1 ? 'Wide establishing shot' : panelNumber === 2 ? 'Dynamic action medium' : panelNumber === 3 ? 'Dramatic close-up' : 'Heroic cinematic wide')
    });
  }

  const project: ComicProject = {
    id: projectId,
    title: rawStoryData.title || `${characterName}'s Quest in ${setting.split(' ')[0] || 'Adventure'}`,
    storyPrompt,
    characterName,
    characterDescription: rawStoryData.characterDescription || `${characterName}, a brave figure venturing into ${setting}.`,
    setting,
    tone,
    artStyle,
    panelsCount: panels.length,
    panels,
    summary: rawStoryData.summary || `A ${tone.toLowerCase()} tale of ${characterName} within ${setting}.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return project;
}

// Fallback high-quality narrative creator when server is offline
function generateLocalThematicStory(input: GenerateComicInput) {
  const { storyPrompt, characterName, setting, tone, panelsCount } = input;
  const isFunny = tone === 'Funny';
  const isDramatic = tone === 'Dramatic' || tone === 'Dark Noir';

  if (isFunny) {
    return {
      title: `${characterName} & The Great Shenanigans`,
      summary: `A hilarious, chaotic misadventure where ${characterName} attempts an easy task in ${setting} with comically disastrous results!`,
      characterDescription: `${characterName}, armed with boundless optimism, clumsy reflexes, and ridiculous confidence.`,
      panels: [
        {
          panelNumber: 1,
          title: 'The Master Plan',
          sceneDescription: `${characterName} stands proudly in ${setting}, smirking with an overly intricate blueprint.`,
          imagePrompt: `Classic comic art: ${characterName} holding upside-down treasure map in ${setting}`,
          narration: `It was supposed to be the easiest morning of ${characterName}'s life. What could possibly go wrong?`,
          dialogues: [
            { speaker: characterName, text: 'Step 1: Sneak in quietly. Step 2: Grab the prize. Flawless!', type: 'speech', position: 'top-left' }
          ],
          soundEffect: { text: 'TIPTOE...', style: 'subtle', color: '#3b82f6', position: 'bottom-right' },
          cameraAngle: 'Medium shot with exaggerated confident pose'
        },
        {
          panelNumber: 2,
          title: 'The Unforeseen Snag',
          sceneDescription: `${characterName} accidentally trips over a root or triggers a loud trap in ${setting}.`,
          imagePrompt: `Slapstick comic panel: ${characterName} losing balance, comically wide eyes, snacks flying`,
          narration: `Nature, however, had an entirely different comedic routine prepared.`,
          dialogues: [
            { speaker: characterName, text: 'Who put this gravity here?!', type: 'shout', position: 'top-right' }
          ],
          soundEffect: { text: 'CLANG!', style: 'zap', color: '#eab308', position: 'center' },
          cameraAngle: 'Dynamic low angle tumble'
        },
        {
          panelNumber: 3,
          title: 'Total Mayhem',
          sceneDescription: `A comedic chain reaction causes pure chaos across ${setting} as ${characterName} scrambles.`,
          imagePrompt: `Wild slapstick comic panel with dust clouds, flying objects, ${characterName} fleeing`,
          narration: `Things escalated with the speed and elegance of an avalanche of custard pies.`,
          dialogues: [
            { speaker: characterName, text: 'Plan B! Execute Plan B immediately!!', type: 'shout', position: 'top-left' },
            { speaker: 'Bystander', text: 'Did we even have a Plan B?!', type: 'speech', position: 'top-right' }
          ],
          soundEffect: { text: 'KABOOM!', style: 'explosion', color: '#ef4444', position: 'center' },
          cameraAngle: 'Wide panoramic chaos view'
        },
        {
          panelNumber: 4,
          title: 'Task Failed Successfully',
          sceneDescription: `${characterName} covered in soot or confetti, holding the prize with an awkward grin in ${setting}.`,
          imagePrompt: `Retro comic finish: ${characterName} bruised but grinning sheepishly, thumbs up`,
          narration: `In the end, victory was achieved. Dignity, on the other hand, was permanently lost.`,
          dialogues: [
            { speaker: characterName, text: 'I meant to do that all along. Totally intentional.', type: 'speech', position: 'top-left' }
          ],
          soundEffect: { text: 'TA-DA!', style: 'action', color: '#10b981', position: 'top-right' },
          cameraAngle: 'Close-up hero punchline finish'
        }
      ].slice(0, panelsCount)
    };
  }

  // Dramatic / Adventure default (Scenario 1)
  return {
    title: `${characterName} and the Whispers of ${setting.split(' ')[0] || 'Destiny'}`,
    summary: `A high-stakes heroic journey where ${characterName} confronts ancient perils and discovers inner bravery in ${setting}.`,
    characterDescription: `${characterName}, a resolute wanderer with keen instincts and an unwavering moral compass.`,
    panels: [
      {
        panelNumber: 1,
        title: 'Threshold of the Unknown',
        sceneDescription: `${characterName} pauses at the ancient boundary of ${setting}, gazing into the misty depths.`,
        imagePrompt: `Atmospheric anime manga panel: ${characterName} overlooking misty enchanted forest with glowing foliage`,
        narration: `Legends spoke of ${setting} as a place where no traveler returns unchanged.`,
        dialogues: [
          { speaker: characterName, text: 'The warnings were clear... yet I cannot turn back now.', type: 'thought', position: 'top-left' }
        ],
        cameraAngle: 'Wide establishing cinematic landscape'
      },
      {
        panelNumber: 2,
        title: 'The Hidden Trail',
        sceneDescription: `${characterName} advances cautiously as mystical signs illuminate the path in ${setting}.`,
        imagePrompt: `Dynamic comic panel: ${characterName} leaping over glowing roots, determined expression`,
        narration: `Every step deeper seemed to awaken whispers buried beneath centuries of silence.`,
        dialogues: [
          { speaker: characterName, text: 'The relic is close. I can feel the energy pulsing.', type: 'speech', position: 'top-right' }
        ],
        soundEffect: { text: 'RUSTLE...', style: 'subtle', color: '#6366f1', position: 'bottom-left' },
        cameraAngle: 'Dynamic low angle tracking shot'
      },
      {
        panelNumber: 3,
        title: 'The Trial of Shadows',
        sceneDescription: `A formidable challenge or guardian rises to test ${characterName}'s courage in ${setting}.`,
        imagePrompt: `Climactic action comic panel: swirling energy, glowing aura, ${characterName} bracing with weapon or magic`,
        narration: `Fear was a companion, but hesitation meant certain defeat.`,
        dialogues: [
          { speaker: characterName, text: 'Stand down! I have not traveled this far to be broken!', type: 'shout', position: 'top-left' }
        ],
        soundEffect: { text: 'CRASH!', style: 'explosion', color: '#dc2626', position: 'center' },
        cameraAngle: 'Intense close-up dramatic confrontation'
      },
      {
        panelNumber: 4,
        title: 'Dawn of the Guardian',
        sceneDescription: `${characterName} stands victorious amidst golden rays of sunlight breaking through ${setting}.`,
        imagePrompt: `Heroic comic conclusion: ${characterName} bathed in radiant morning light, peaceful smile, glowing artifact`,
        narration: `As the shadows retreated, a new dawn broke over ${setting}—and with it, a true protector was born.`,
        dialogues: [
          { speaker: characterName, text: 'The forest is at peace again. Our journey is just beginning.', type: 'speech', position: 'top-right' }
        ],
        soundEffect: { text: 'CHIME...', style: 'subtle', color: '#f59e0b', position: 'top-left' },
        cameraAngle: 'Triumphant golden-hour heroic wide shot'
      }
    ].slice(0, panelsCount)
  };
}
