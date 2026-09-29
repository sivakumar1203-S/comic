import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function handleGenerateStory(body: any) {
  const { storyPrompt, characterName, setting, tone, artStyle, panelsCount = 4 } = body;

  if (!ai) {
    throw new Error('GEMINI_API_KEY not configured on server');
  }

  const promptText = `You are ComicCraft's master comic book writer and storyboard director.
Create a personalized ${panelsCount}-panel comic book storyline based on the following creative specifications:
- Core Story Prompt: "${storyPrompt}"
- Main Character: "${characterName}"
- Setting: "${setting}"
- Tone: "${tone}" (e.g. dramatic, funny, adventurous, noir, sci-fi)
- Art Style: "${artStyle}"

Instructions:
1. Provide a catchy, classic comic book title (e.g., "The Legend of...", "The Misadventures of...", "Tales from the...").
2. Provide a 1-sentence engaging logline/summary.
3. Provide a brief visual character description for comic artist consistency.
4. For each of the ${panelsCount} panels, provide:
   - panelNumber (1 to ${panelsCount})
   - title: Short dramatic or funny title for the panel
   - sceneDescription: Concise visual description of the action and composition
   - imagePrompt: Rich, vivid visual prompt describing the scene, character pose, camera angle, lighting, and style
   - narration: A caption box narration line (captures tone: serious and atmospheric if dramatic/noir, witty and slapstick if funny)
   - dialogues: 1 or 2 speech bubbles between characters (speaker name, text, type: "speech"|"thought"|"shout"|"whisper", position: "top-left"|"top-right")
   - soundEffect: Optional iconic comic SFX (e.g. "WHOOSH!", "KABOOM!", "POW!", "CLANG!", "SIZZLE!") with style and position
   - cameraAngle: Cinematic comic shot (e.g. "Wide establishing shot", "Extreme close-up", "Low-angle heroic", "Bird's eye view")

Format response strictly as valid JSON adhering to the schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: promptText,
    config: {
      temperature: tone === 'Funny' ? 1.0 : 0.75,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          characterDescription: { type: Type.STRING },
          panels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                panelNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                sceneDescription: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                narration: { type: Type.STRING },
                cameraAngle: { type: Type.STRING },
                dialogues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      speaker: { type: Type.STRING },
                      text: { type: Type.STRING },
                      type: { type: Type.STRING },
                      position: { type: Type.STRING }
                    },
                    required: ['speaker', 'text', 'type', 'position']
                  }
                },
                soundEffect: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    style: { type: Type.STRING },
                    color: { type: Type.STRING },
                    position: { type: Type.STRING }
                  },
                  required: ['text', 'style', 'color', 'position']
                }
              },
              required: ['panelNumber', 'title', 'sceneDescription', 'imagePrompt', 'narration', 'dialogues', 'cameraAngle']
            }
          }
        },
        required: ['title', 'summary', 'characterDescription', 'panels']
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response received from Gemini');
  }

  return JSON.parse(text);
}

export async function handleGenerateImage(body: any) {
  const { prompt, artStyle, characterName } = body;

  if (!ai) {
    return { imageUrl: null, fallback: true };
  }

  try {
    // Attempt nano banana / flash image model
    const enhancedPrompt = `${artStyle} comic book panel illustration: ${prompt}, featuring character ${characterName}. Graphic comic ink, vibrant colors, comic book art, detailed scene.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: '4:3'
        }
      }
    });

    if (response && response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          return { imageUrl: `data:${mime};base64,${part.inlineData.data}` };
        }
      }
    }
  } catch (err) {
    // Graceful fallback to SVG/Canvas comic rendering
    console.log('Gemini image generation unavailable or paid quota needed, falling back to SVG renderer:', (err as any)?.message);
  }

  return { imageUrl: null, fallback: true };
}
