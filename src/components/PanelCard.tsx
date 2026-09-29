import React, { useState } from 'react';
import { Edit3, RefreshCw, Maximize2, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import { ComicPanel, ArtStyleId } from '../types/comic';

interface PanelCardProps {
  panel: ComicPanel;
  artStyle: ArtStyleId;
  onEdit: (panel: ComicPanel) => void;
  onRegenerateImage: (panel: ComicPanel) => void;
  onZoom: (panel: ComicPanel) => void;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  panel,
  artStyle,
  onEdit,
  onRegenerateImage,
  onZoom
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Read dialogue aloud using speech synthesis
  const handleSpeakDialogue = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const fullNarration = `${panel.narration}. ` + panel.dialogues.map(d => `${d.speaker} says: ${d.text}`).join('. ');
    const utterance = new SpeechSynthesisUtterance(fullNarration);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white border-4 border-black rounded-xl overflow-hidden comic-shadow relative flex flex-col group transition-all duration-200 hover:-translate-y-1">
      {/* Panel Top Header Bar */}
      <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between border-b-2 border-black">
        <div className="flex items-center gap-2">
          <span className="font-comic-title text-sm tracking-wide text-yellow-300">
            PANEL {panel.panelNumber}
          </span>
          <span className="text-stone-300 text-xs font-bold truncate max-w-[180px] sm:max-w-[260px]">
            {panel.title}
          </span>
        </div>

        {/* Hover Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleSpeakDialogue}
            className={`p-1 rounded hover:bg-stone-800 text-stone-200 hover:text-yellow-300 transition-colors ${isSpeaking ? 'text-yellow-300 animate-pulse' : ''}`}
            title="Read Dialogue Aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onRegenerateImage(panel)}
            className="p-1 rounded hover:bg-stone-800 text-stone-200 hover:text-yellow-300 transition-colors"
            title="Regenerate Panel Visuals"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(panel)}
            className="p-1 rounded hover:bg-stone-800 text-stone-200 hover:text-yellow-300 transition-colors"
            title="Edit Dialogue & Text"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onZoom(panel)}
            className="p-1 rounded hover:bg-stone-800 text-stone-200 hover:text-yellow-300 transition-colors"
            title="Zoom In"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Illustration Area */}
      <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden select-none">
        {panel.imageUrl ? (
          <img
            src={panel.imageUrl}
            alt={panel.sceneDescription}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-800 text-stone-400">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin mb-2" />
            <p className="text-xs font-bold text-stone-300">Rendering Scene Illustration...</p>
          </div>
        )}

        {/* Comic Sound Effect Stamp Overlay */}
        {panel.soundEffect && (
          <div
            className={`absolute z-20 pointer-events-none transform -rotate-12 ${
              panel.soundEffect.position === 'top-left'
                ? 'top-4 left-4'
                : panel.soundEffect.position === 'top-right'
                ? 'top-4 right-4'
                : panel.soundEffect.position === 'bottom-right'
                ? 'bottom-6 right-4'
                : 'top-1/3 left-1/3'
            }`}
          >
            <div className="relative">
              {/* Explosion Starburst Badge */}
              <div className="bg-red-600 text-yellow-300 border-2 border-black font-comic-title text-xl md:text-2xl px-3 py-1 comic-shadow-sm tracking-wider uppercase filter drop-shadow-[2px_2px_0px_#000]">
                {panel.soundEffect.text}
              </div>
            </div>
          </div>
        )}

        {/* Speech Bubbles inside panel image area */}
        <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between z-10">
          {panel.dialogues.map((dlg) => {
            const isThought = dlg.type === 'thought';
            const isShout = dlg.type === 'shout';

            return (
              <div
                key={dlg.id}
                className={`max-w-[78%] pointer-events-auto transition-transform ${
                  dlg.position.includes('right') ? 'self-end text-right' : 'self-start text-left'
                }`}
              >
                <div
                  className={`relative p-2.5 rounded-2xl border-2 border-black comic-shadow-sm ${
                    isShout
                      ? 'bg-yellow-200 border-red-600 font-extrabold rotate-1'
                      : isThought
                      ? 'bg-sky-50 border-stone-800 rounded-3xl italic'
                      : 'bg-white border-black'
                  }`}
                >
                  {/* Speaker Name Tag */}
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-comic-title text-[11px] text-red-600 tracking-wider">
                      {dlg.speaker}:
                    </span>
                    {isThought && <span className="text-[9px] text-stone-500 font-bold">(thinking)</span>}
                    {isShout && <span className="text-[9px] text-red-600 font-bold font-comic-title">!</span>}
                  </div>

                  {/* Speech Text */}
                  <p className="font-comic-text text-xs md:text-sm font-bold text-stone-900 leading-snug">
                    "{dlg.text}"
                  </p>

                  {/* Speech Bubble Pointer Tail */}
                  {!isThought && (
                    <div
                      className={`absolute -bottom-2 ${
                        dlg.position.includes('right') ? 'right-4' : 'left-4'
                      } w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black`}
                    />
                  )}
                  {isThought && (
                    <div className="absolute -bottom-2 left-5 flex gap-0.5">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <div className="w-1 h-1 bg-black rounded-full mt-1" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Camera Angle Tag */}
        {panel.cameraAngle && (
          <div className="absolute bottom-1 right-2 bg-black/70 backdrop-blur-xs text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-300/40 pointer-events-none">
            {panel.cameraAngle}
          </div>
        )}
      </div>

      {/* Narration Caption Box (Classic Comic Yellow Box) */}
      {panel.narration && (
        <div className="bg-yellow-200 border-t-2 border-black p-2.5">
          <div className="flex items-start gap-1.5">
            <span className="font-comic-title text-xs text-stone-900 uppercase tracking-wider shrink-0 mt-0.5">
              NARRATION:
            </span>
            <p className="font-comic-text text-xs md:text-sm italic font-bold text-stone-900 leading-snug">
              {panel.narration}
            </p>
          </div>
        </div>
      )}

      {/* Quick Edit Footer Trigger */}
      <div className="bg-stone-100 px-3 py-1.5 border-t border-black/20 flex items-center justify-between text-[11px] text-stone-600 font-bold">
        <span className="truncate max-w-[200px]">Scene: {panel.sceneDescription}</span>
        <button
          onClick={() => onEdit(panel)}
          className="text-stone-800 hover:text-black hover:underline flex items-center gap-1"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};
