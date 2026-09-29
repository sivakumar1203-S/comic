import React, { useState } from 'react';
import { X, Layout, FileText, Check, Sliders, Eye, Download, Sparkles } from 'lucide-react';
import { ComicProject, LayoutSettings } from '../types/comic';

interface LayoutBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  comic: ComicProject;
  currentSettings: LayoutSettings;
  onApplySettings: (settings: LayoutSettings) => void;
  onCompileAndExport: (settings: LayoutSettings) => void;
  isExporting: boolean;
}

export const LayoutBuilderModal: React.FC<LayoutBuilderModalProps> = ({
  isOpen,
  onClose,
  comic,
  currentSettings,
  onApplySettings,
  onCompileAndExport,
  isExporting
}) => {
  if (!isOpen) return null;

  const [settings, setSettings] = useState<LayoutSettings>(currentSettings);

  const handleApply = () => {
    onApplySettings(settings);
    onClose();
  };

  const handleExport = () => {
    onApplySettings(settings);
    onCompileAndExport(settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto comic-shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-500 border-2 border-black p-1.5 rounded-lg text-white">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-comic-title text-2xl text-black leading-none">
                LAYOUT BUILDER & BINDING
              </h2>
              <p className="text-xs font-bold text-stone-600">
                Scenario 3: Assembles panel title, artwork, and narrative text into a structured print layout
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

        {/* Layout Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Columns & Structure */}
          <div className="bg-amber-50/60 border-2 border-black rounded-xl p-4 space-y-3">
            <h3 className="font-comic-title text-lg text-black flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Grid Structure</span>
            </h3>

            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1.5">Page Columns</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, gridColumns: 2 })}
                  className={`p-2.5 border-2 rounded-lg text-xs font-bold transition-all ${
                    settings.gridColumns === 2
                      ? 'bg-yellow-300 border-black comic-shadow-sm'
                      : 'bg-white border-stone-300'
                  }`}
                >
                  2 Columns (Classic Issue)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, gridColumns: 3 })}
                  className={`p-2.5 border-2 rounded-lg text-xs font-bold transition-all ${
                    settings.gridColumns === 3
                      ? 'bg-yellow-300 border-black comic-shadow-sm'
                      : 'bg-white border-stone-300'
                  }`}
                >
                  3 Columns (Dense Manga)
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1">
                Gutter / Panel Gap: {settings.panelGap}px
              </span>
              <input
                type="range"
                min="6"
                max="24"
                value={settings.panelGap}
                onChange={(e) => setSettings({ ...settings, panelGap: Number(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Aesthetic Bindings */}
          <div className="bg-amber-50/60 border-2 border-black rounded-xl p-4 space-y-3">
            <h3 className="font-comic-title text-lg text-black flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>Print Finishing & Styles</span>
            </h3>

            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1.5">Narration Caption Style</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'yellow-box', label: 'Classic Yellow' },
                  { id: 'white-box', label: 'Modern White' },
                  { id: 'vintage-badge', label: 'Vintage Badge' }
                ].map((cap) => (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, captionStyle: cap.id as any })}
                    className={`p-2 border-2 rounded-lg text-[11px] font-bold text-center ${
                      settings.captionStyle === cap.id
                        ? 'bg-black text-yellow-300 border-black'
                        : 'bg-white border-stone-300'
                    }`}
                  >
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                <input
                  type="checkbox"
                  checked={settings.showHalftone}
                  onChange={(e) => setSettings({ ...settings, showHalftone: e.target.checked })}
                  className="w-4 h-4 accent-black rounded"
                />
                <span>Include Ben-Day halftone screen texture</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                <input
                  type="checkbox"
                  checked={settings.paperTexture}
                  onChange={(e) => setSettings({ ...settings, paperTexture: e.target.checked })}
                  className="w-4 h-4 accent-black rounded"
                />
                <span>Vintage comic newsprint warm tone</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Mini Preview of Layout Binding */}
        <div className="bg-stone-100 border-2 border-black rounded-xl p-4 mb-6">
          <span className="text-xs font-bold uppercase text-stone-600 mb-2 block">
            Layout Preview ({comic.panels.length} panels, {Math.ceil(comic.panels.length / 2)} pages bound)
          </span>

          <div className="bg-white border-2 border-dashed border-black p-3 rounded-lg max-h-56 overflow-y-auto">
            <div className={`grid grid-cols-${settings.gridColumns} gap-2`}>
              {comic.panels.map((p) => (
                <div
                  key={p.id}
                  className="bg-stone-50 border-2 border-black rounded p-2 text-xs flex flex-col justify-between"
                  style={{ minHeight: '80px' }}
                >
                  <div className="flex items-center justify-between border-b pb-1 mb-1">
                    <span className="font-comic-title text-[11px] text-red-600">P.{p.panelNumber}</span>
                    <span className="text-[10px] font-bold truncate max-w-[90px]">{p.title}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 italic line-clamp-2">
                    {p.narration || p.sceneDescription}
                  </div>
                  <div className="mt-1 text-[9px] font-bold text-blue-600">
                    {p.dialogues.length} speech bubble(s)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-black pt-4">
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border-2 border-black rounded-lg text-xs font-bold"
          >
            Apply Layout Settings
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-stone-300 rounded-lg text-xs font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-lg text-xs font-bold comic-shadow-sm flex items-center gap-1.5 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Binding & Compiling...' : 'Bind & Download PDF (Scenario 3)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
