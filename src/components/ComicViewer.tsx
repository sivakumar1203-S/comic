import React, { useState } from 'react';
import { 
  Download, 
  Layout, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  Maximize2, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Smile, 
  Palette, 
  ArrowRight,
  User,
  Info
} from 'lucide-react';
import { ComicPanel, ComicProject, ArtStyleId, ToneId, LayoutSettings } from '../types/comic';
import { PanelCard } from './PanelCard';
import { TONES, ART_STYLES } from '../data/presets';

interface ComicViewerProps {
  comic: ComicProject;
  viewMode: 'grid' | 'webtoon' | 'slide';
  onChangeViewMode: (mode: 'grid' | 'webtoon' | 'slide') => void;
  onEditPanel: (panel: ComicPanel) => void;
  onRegeneratePanelImage: (panel: ComicPanel) => void;
  onOpenLayoutBuilder: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExporting: boolean;
  onIterateToneAndStyle: (newTone: ToneId, newStyle: ArtStyleId) => void;
  isIterating: boolean;
}

export const ComicViewer: React.FC<ComicViewerProps> = ({
  comic,
  viewMode,
  onChangeViewMode,
  onEditPanel,
  onRegeneratePanelImage,
  onOpenLayoutBuilder,
  onExportPdf,
  onPrint,
  isExporting,
  onIterateToneAndStyle,
  isIterating
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [zoomedPanel, setZoomedPanel] = useState<ComicPanel | null>(null);

  // Scenario 2 iteration states
  const [selectedTone, setSelectedTone] = useState<ToneId>(comic.tone);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyleId>(comic.artStyle);
  const [showIterateBar, setShowIterateBar] = useState(false);

  const handleApplyIteration = () => {
    onIterateToneAndStyle(selectedTone, selectedStyle);
  };

  const currentPanel = comic.panels[currentSlideIndex] || comic.panels[0];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Comic Header Title Banner */}
      <div className="bg-yellow-300 border-4 border-black rounded-2xl p-5 md:p-6 comic-shadow mb-6 relative overflow-hidden bg-halftone">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-red-600 text-white font-comic-title text-xs px-2.5 py-0.5 rounded border border-black uppercase tracking-wider">
                ISSUE #1
              </span>
              <span className="bg-black text-yellow-300 text-xs font-bold px-2 py-0.5 rounded">
                Tone: {comic.tone}
              </span>
              <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded border border-black">
                Style: {comic.artStyle}
              </span>
            </div>

            <h1 className="font-comic-title text-3xl sm:text-4xl md:text-5xl text-black tracking-wide leading-none">
              {comic.title.toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-stone-800 mt-1 max-w-3xl">
              {comic.summary}
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowIterateBar(!showIterateBar)}
              className="flex items-center gap-1.5 bg-white hover:bg-yellow-100 text-black font-bold text-xs px-3 py-2 rounded-lg border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
              title="Scenario 2: Change tone or art style and regenerate"
            >
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span>{showIterateBar ? 'Hide Mood Tuner' : 'Customize Tone / Style (Scenario 2)'}</span>
            </button>

            <button
              onClick={onOpenLayoutBuilder}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-lg border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
              title="Scenario 3 Layout Binding"
            >
              <Layout className="w-4 h-4" />
              <span>Layout Builder</span>
            </button>

            <button
              onClick={onExportPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg border-2 border-black comic-shadow transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Compiling PDF...' : 'Download PDF (Scenario 3)'}</span>
            </button>
          </div>
        </div>

        {/* Character & Setting Pill Bar */}
        <div className="mt-4 pt-3 border-t-2 border-black/30 flex flex-wrap items-center gap-4 text-xs font-bold text-stone-800">
          <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-black/40">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Character: {comic.characterName}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-black/40 truncate max-w-md">
            <span>Setting: {comic.setting}</span>
          </div>
          <div className="text-stone-600 ml-auto">
            {comic.panels.length} Full Panels Generated
          </div>
        </div>
      </div>

      {/* Scenario 2: Inline Tone & Art Style Iteration Bar */}
      {showIterateBar && (
        <div className="bg-amber-100 border-4 border-black rounded-2xl p-5 comic-shadow mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black/40">
            <div className="flex items-center gap-2">
              <span className="font-comic-title text-xl text-black">
                SCENARIO 2: ITERATE TONE & ART STYLE
              </span>
              <span className="text-xs bg-black text-yellow-300 px-2 py-0.5 rounded font-bold">
                Regenerate Pipeline
              </span>
            </div>
            <button
              onClick={() => setShowIterateBar(false)}
              className="text-xs font-bold text-stone-600 hover:text-black"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs font-semibold text-stone-700 mb-4">
            Test Scenario 2 from the brief: Switch to "Funny" tone and "Classic Comic" art style to regenerate
            the outline, story, and illustrations tailored with humorous narrative and retro Ben-Day dots!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Tone Selector */}
            <div>
              <span className="text-xs font-bold text-stone-800 block mb-1.5 uppercase flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-600" />
                <span>Select New Tone:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {TONES.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    className={`p-2 border-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      selectedTone === t.id
                        ? 'bg-yellow-300 border-black comic-shadow-sm'
                        : 'bg-white border-stone-300'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Art Style Selector */}
            <div>
              <span className="text-xs font-bold text-stone-800 block mb-1.5 uppercase flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>Select New Art Style:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {ART_STYLES.slice(0, 3).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyle(st.id)}
                    className={`p-2 border-2 rounded-lg text-xs font-bold truncate ${
                      selectedStyle === st.id
                        ? 'bg-yellow-300 border-black comic-shadow-sm'
                        : 'bg-white border-stone-300'
                    }`}
                    title={st.name}
                  >
                    {st.sampleTag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleApplyIteration}
              disabled={isIterating}
              className="bg-black hover:bg-stone-800 text-yellow-300 font-comic-title text-lg px-5 py-2 rounded-xl border-2 border-black comic-shadow-sm flex items-center gap-2 disabled:opacity-60 transition-all hover:-translate-y-0.5"
            >
              {isIterating ? (
                <span>REGENERATING PIPELINE WITH NEW MOOD...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>REGENERATE WITH NEW TONE & STYLE</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reader Layout Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-comic-title text-xl text-black">READER VIEW:</span>
          <div className="flex bg-white border-2 border-black rounded-lg p-0.5 comic-shadow-sm">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`px-3 py-1 text-xs font-bold rounded-md ${
                viewMode === 'grid' ? 'bg-yellow-400 text-black border border-black' : 'text-stone-700'
              }`}
            >
              Classic Grid
            </button>
            <button
              onClick={() => onChangeViewMode('webtoon')}
              className={`px-3 py-1 text-xs font-bold rounded-md ${
                viewMode === 'webtoon' ? 'bg-yellow-400 text-black border border-black' : 'text-stone-700'
              }`}
            >
              Webtoon Strip
            </button>
            <button
              onClick={() => onChangeViewMode('slide')}
              className={`px-3 py-1 text-xs font-bold rounded-md ${
                viewMode === 'slide' ? 'bg-yellow-400 text-black border border-black' : 'text-stone-700'
              }`}
            >
              Cinema Slides
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-stone-600">
          <span>Click on any panel's Edit icon to tweak dialog or sound effects!</span>
        </div>
      </div>

      {/* VIEW MODE 1: CLASSIC GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comic.panels.map((panel) => (
            <PanelCard
              key={panel.id}
              panel={panel}
              artStyle={comic.artStyle}
              onEdit={onEditPanel}
              onRegenerateImage={onRegeneratePanelImage}
              onZoom={(p) => setZoomedPanel(p)}
            />
          ))}
        </div>
      )}

      {/* VIEW MODE 2: WEBTOON VERTICAL STRIP */}
      {viewMode === 'webtoon' && (
        <div className="max-w-2xl mx-auto space-y-8 bg-stone-900 p-6 rounded-2xl border-4 border-black comic-shadow">
          <div className="text-center pb-4 border-b border-stone-800">
            <span className="font-comic-title text-2xl text-yellow-300">
              {comic.title.toUpperCase()}
            </span>
            <p className="text-xs text-stone-400 font-semibold mt-1">
              Scroll down to read like a webtoon comic
            </p>
          </div>

          {comic.panels.map((panel) => (
            <div key={panel.id} className="relative">
              <PanelCard
                panel={panel}
                artStyle={comic.artStyle}
                onEdit={onEditPanel}
                onRegenerateImage={onRegeneratePanelImage}
                onZoom={(p) => setZoomedPanel(p)}
              />
            </div>
          ))}

          <div className="text-center pt-6 pb-2 text-stone-500 font-comic-title text-lg">
            ~ END OF CHAPTER 1 ~
          </div>
        </div>
      )}

      {/* VIEW MODE 3: CINEMA SLIDESHOW */}
      {viewMode === 'slide' && (
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <PanelCard
              panel={currentPanel}
              artStyle={comic.artStyle}
              onEdit={onEditPanel}
              onRegenerateImage={onRegeneratePanelImage}
              onZoom={(p) => setZoomedPanel(p)}
            />
          </div>

          {/* Slide Navigation Bar */}
          <div className="flex items-center justify-between bg-white border-3 border-black p-3 rounded-xl comic-shadow-sm">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 border-2 border-black rounded-lg text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Panel</span>
            </button>

            <span className="font-comic-title text-lg text-black">
              PANEL {currentSlideIndex + 1} OF {comic.panels.length}
            </span>

            <button
              onClick={() => setCurrentSlideIndex(Math.min(comic.panels.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === comic.panels.length - 1}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 border-2 border-black rounded-lg text-xs font-bold"
            >
              <span>Next Panel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Zoom / Full Screen Modal */}
      {zoomedPanel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer"
          onClick={() => setZoomedPanel(null)}
        >
          <div
            className="max-w-4xl w-full bg-white border-4 border-black rounded-2xl overflow-hidden comic-shadow p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={zoomedPanel.imageUrl}
                alt={zoomedPanel.title}
                className="w-full aspect-[4/3] object-cover rounded-lg border-2 border-black"
              />
              <div className="p-4 bg-yellow-100 border-2 border-black rounded-lg mt-2 flex items-center justify-between">
                <div>
                  <h3 className="font-comic-title text-xl text-black">
                    PANEL {zoomedPanel.panelNumber}: {zoomedPanel.title}
                  </h3>
                  <p className="font-comic-text text-sm font-bold text-stone-800">
                    {zoomedPanel.narration}
                  </p>
                </div>
                <button
                  onClick={() => setZoomedPanel(null)}
                  className="px-4 py-2 bg-black text-yellow-300 font-bold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
