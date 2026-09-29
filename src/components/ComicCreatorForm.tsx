import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, BookOpen, User, MapPin, Smile, Palette, Layers, HelpCircle, Flame } from 'lucide-react';
import { ArtStyleId, ToneId } from '../types/comic';
import { ART_STYLES, TONES, COMIC_PRESETS } from '../data/presets';
import { GenerateComicInput } from '../services/geminiService';

interface ComicCreatorFormProps {
  onGenerate: (data: GenerateComicInput) => Promise<void>;
  isGenerating: boolean;
  initialValues?: Partial<GenerateComicInput>;
}

export const ComicCreatorForm: React.FC<ComicCreatorFormProps> = ({
  onGenerate,
  isGenerating,
  initialValues
}) => {
  const [storyPrompt, setStoryPrompt] = useState(
    initialValues?.storyPrompt || 'A brave fox exploring an enchanted forest in search of the glowing Tree of Whispers to break a nocturnal spell.'
  );
  const [characterName, setCharacterName] = useState(initialValues?.characterName || 'Rusty');
  const [characterDescription, setCharacterDescription] = useState(
    'A courageous russet-furred fox wearing a green scout scarf with keen golden eyes.'
  );
  const [setting, setSetting] = useState(
    initialValues?.setting || 'Enchanted Forest filled with ancient mossy oaks, glowing mushrooms, and twilight mist'
  );
  const [tone, setTone] = useState<ToneId>(initialValues?.tone || 'Dramatic');
  const [artStyle, setArtStyle] = useState<ArtStyleId>(initialValues?.artStyle || 'manga-anime');
  const [panelsCount, setPanelsCount] = useState<number>(initialValues?.panelsCount || 4);

  // Quick scenario presets
  const handleLoadScenario1 = () => {
    setStoryPrompt('A brave fox exploring an enchanted forest in search of the glowing Tree of Whispers to break a nocturnal spell.');
    setCharacterName('Rusty');
    setCharacterDescription('A brave russet fox with a leaf scout scarf and an antique brass compass.');
    setSetting('Enchanted Forest filled with ancient mossy oaks, glowing mushrooms, and twilight mist');
    setTone('Dramatic');
    setArtStyle('manga-anime');
    setPanelsCount(4);
  };

  const handleLoadScenario2 = () => {
    setStoryPrompt('A hilarious fox attempts to stealthily snatch a giant blackberry pie from a snoozing forest bear, triggering funny slapstick chaos.');
    setCharacterName('Rusty');
    setCharacterDescription('An overly confident, silly fox wearing goofy comic goggles and mismatched boots.');
    setSetting('Sunny woodland clearing centered around a giant cartoon picnic table');
    setTone('Funny');
    setArtStyle('classic-comic');
    setPanelsCount(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyPrompt.trim() || !characterName.trim()) return;

    onGenerate({
      storyPrompt: storyPrompt.trim(),
      characterName: characterName.trim(),
      setting: setting.trim() || 'A mysterious realm',
      tone,
      artStyle,
      panelsCount
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Hero Welcome Banner */}
      <div className="bg-yellow-300 border-4 border-black rounded-2xl p-6 md:p-8 comic-shadow mb-8 relative overflow-hidden bg-halftone">
        {/* Comic sound stamp */}
        <div className="absolute top-3 right-4 rotate-6 bg-red-600 border-2 border-black px-3 py-1 rounded comic-shadow-sm hidden md:block">
          <span className="font-comic-title text-xl text-yellow-300 tracking-wider">GENERATE!</span>
        </div>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-black text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Gemini AI Comic Engine</span>
          </div>
          <h1 className="font-comic-title text-4xl sm:text-5xl md:text-6xl text-black tracking-wide leading-none mb-3">
            CREATE YOUR OWN COMIC BOOK
          </h1>
          <p className="text-stone-800 text-sm md:text-base font-semibold leading-relaxed">
            Turn your imagination into a panel-by-panel comic strip complete with illustrations,
            narration caption boxes, dynamic speech bubbles, sound effects, and professional PDF export.
          </p>

          {/* Quick Scenario Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase text-stone-700">Quick Demos:</span>
            <button
              type="button"
              onClick={handleLoadScenario1}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span>🦊 Scenario 1: Brave Fox (Dramatic + Manga)</span>
            </button>
            <button
              type="button"
              onClick={handleLoadScenario2}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-yellow-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span>🥧 Scenario 2: Iteration (Funny + Classic Comic)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white border-4 border-black rounded-2xl p-6 md:p-8 comic-shadow">
        <div className="space-y-6">
          {/* Section 1: Story Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-comic-title text-2xl text-black flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-red-600" />
                <span>1. Story Prompt</span>
              </label>
              <span className="text-xs font-bold text-stone-500">
                {storyPrompt.length} characters
              </span>
            </div>
            <textarea
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              rows={3}
              placeholder="Describe what happens in your comic... e.g. A brave fox exploring an enchanted forest in search of an ancient glowing relic."
              className="w-full p-3.5 bg-amber-50/50 border-2 border-black rounded-xl font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 comic-shadow-sm resize-none"
              required
            />
            {/* Suggestion tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs font-bold text-stone-500 mr-1 self-center">Ideas:</span>
              {[
                'A brave fox exploring an enchanted forest',
                'Detective solving mystery in cyberpunk city',
                'Astronaut delivering space pizza through asteroid belt',
                'A knight discovering a dragon the size of a teacup'
              ].map((idea) => (
                <button
                  type="button"
                  key={idea}
                  onClick={() => setStoryPrompt(idea)}
                  className="text-[11px] bg-stone-100 hover:bg-yellow-200 border border-stone-300 hover:border-black font-semibold text-stone-700 px-2 py-0.5 rounded-md transition-colors"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Character & Setting Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Character Info */}
            <div className="bg-amber-50/60 border-2 border-black rounded-xl p-4 comic-shadow-sm">
              <label className="font-comic-title text-xl text-black flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>2. Main Character</span>
              </label>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold text-stone-600 uppercase">Character Name</span>
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="e.g. Rusty the Fox"
                    className="w-full mt-1 p-2.5 bg-white border-2 border-black rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-600 uppercase">Appearance & Traits</span>
                  <input
                    type="text"
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    placeholder="e.g. Courageous fox wearing a green scout scarf"
                    className="w-full mt-1 p-2 bg-white border border-black rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Setting Info */}
            <div className="bg-amber-50/60 border-2 border-black rounded-xl p-4 comic-shadow-sm">
              <label className="font-comic-title text-xl text-black flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>3. Setting / World</span>
              </label>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold text-stone-600 uppercase">Location & Atmosphere</span>
                  <input
                    type="text"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    placeholder="e.g. Enchanted Forest with glowing bioluminescent flora"
                    className="w-full mt-1 p-2.5 bg-white border-2 border-black rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                {/* Setting Quick Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Enchanted Forest', 'Neon Cyberpunk City', 'Outer Space Station', 'Medieval Castle'].map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => setSetting(loc)}
                      className="text-[11px] bg-white hover:bg-emerald-100 border border-stone-300 font-semibold px-2 py-0.5 rounded transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tone & Mood Selection */}
          <div className="pt-2">
            <label className="font-comic-title text-2xl text-black flex items-center gap-2 mb-3">
              <Smile className="w-6 h-6 text-amber-500" />
              <span>4. Story Tone (Mood & Style)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TONES.map((t) => {
                const isSelected = tone === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-3 text-left border-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-yellow-300 border-black comic-shadow-sm font-bold scale-[1.02]'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-lg">{t.icon}</span>
                      <span className="font-bold text-xs sm:text-sm text-black">{t.id}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-tight">
                      {t.mood}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Art Style Selection */}
          <div className="pt-2">
            <label className="font-comic-title text-2xl text-black flex items-center gap-2 mb-3">
              <Palette className="w-6 h-6 text-purple-600" />
              <span>5. Art Style</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ART_STYLES.map((style) => {
                const isSelected = artStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setArtStyle(style.id)}
                    className={`p-3.5 text-left border-2 rounded-xl transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-100/80 border-black comic-shadow scale-[1.02] ring-2 ring-black'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-bold text-xs sm:text-sm text-black">{style.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badgeColor}`}>
                        {style.sampleTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Panels Count */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stone-200 pt-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-stone-700" />
              <span className="font-comic-title text-xl text-black">Comic Panels:</span>
              <div className="flex items-center gap-2 ml-2">
                {[4, 6, 8].map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setPanelsCount(count)}
                    className={`w-9 h-9 rounded-lg border-2 border-black font-comic-title text-lg flex items-center justify-center transition-all ${
                      panelsCount === count
                        ? 'bg-black text-yellow-300 comic-shadow-sm scale-105'
                        : 'bg-white hover:bg-yellow-100 text-black'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-stone-600 font-semibold">
              Includes full storyline, dialogue balloons, sound effects & PDF layout binding
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-comic-title text-2xl md:text-3xl py-4 rounded-xl border-4 border-black comic-shadow transition-all hover:-translate-y-1 active:translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer select-none"
            >
              {isGenerating ? (
                <>
                  <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <span>CREATING YOUR COMIC STRIP WITH GEMINI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7 text-yellow-300 stroke-[2.5]" />
                  <span>GENERATE COMIC WITH GEMINI AI</span>
                  <ArrowRight className="w-7 h-7 text-yellow-300 stroke-[2.5]" />
                </>
              )}
            </button>

            {isGenerating && (
              <div className="mt-4 p-4 bg-yellow-100 border-2 border-black rounded-xl text-center">
                <p className="font-comic-title text-lg text-black animate-pulse">
                  Storyboarding panels... Inking speech balloons... Generating Ben-Day dot artwork!
                </p>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Using Gemini 3.8 Flash for narrative & dialog, and comic illustration engine for panels.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
