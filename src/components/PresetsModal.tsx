import React from 'react';
import { X, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { COMIC_PRESETS } from '../data/presets';
import { ComicPreset } from '../types/comic';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: ComicPreset, autoGenerate: boolean) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto comic-shadow p-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-300 border-2 border-black p-1.5 rounded-lg">
              <Wand2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-comic-title text-2xl text-black leading-none">
                STORY INSPIRATION & PRESETS
              </h2>
              <p className="text-xs font-bold text-stone-600">
                Choose a pre-configured comic story or scenario
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 border-2 border-transparent hover:border-black transition-all"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="space-y-3">
          {COMIC_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-amber-50/70 border-3 border-black rounded-xl p-4 comic-shadow-sm hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{preset.icon}</span>
                  <h3 className="font-comic-title text-xl text-black">{preset.title}</h3>
                  <span className="bg-black text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {preset.tone}
                  </span>
                </div>
                <p className="text-xs font-bold text-red-700">{preset.tagline}</p>
                <p className="text-xs text-stone-700 leading-snug">{preset.prompt}</p>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-stone-600 pt-1">
                  <span>Hero: <strong className="text-black">{preset.characterName}</strong></span>
                  <span>•</span>
                  <span>Setting: <strong className="text-black">{preset.setting}</strong></span>
                  <span>•</span>
                  <span>Style: <strong className="text-black">{preset.artStyle}</strong></span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    onSelectPreset(preset, true);
                    onClose();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg border-2 border-black comic-shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Now</span>
                </button>
                <button
                  onClick={() => {
                    onSelectPreset(preset, false);
                    onClose();
                  }}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-white hover:bg-yellow-100 text-stone-900 font-bold text-xs rounded-lg border border-black flex items-center justify-center gap-1 transition-all"
                >
                  <span>Load Into Form</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
