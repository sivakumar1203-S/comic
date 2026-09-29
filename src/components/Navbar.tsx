import React from 'react';
import { BookOpen, Sparkles, Wand2, Download, RefreshCw, Layout, Printer, Layers } from 'lucide-react';
import { ComicProject } from '../types/comic';

interface NavbarProps {
  currentProject: ComicProject | null;
  onNewComic: () => void;
  onOpenPresets: () => void;
  onOpenLayoutBuilder: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExporting: boolean;
  viewMode: 'grid' | 'webtoon' | 'slide';
  onChangeViewMode: (mode: 'grid' | 'webtoon' | 'slide') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  onNewComic,
  onOpenPresets,
  onOpenLayoutBuilder,
  onExportPdf,
  onPrint,
  isExporting,
  viewMode,
  onChangeViewMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-400 border-b-4 border-black px-4 py-2.5 comic-shadow">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onNewComic}>
          <div className="bg-red-600 border-2 border-black p-1.5 rounded-lg comic-shadow-sm rotate-[-2deg] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-300 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-comic-title text-2xl md:text-3xl text-black tracking-wide drop-shadow-[1px_1px_0px_#fff]">
                COMIC<span className="text-red-600">CRAFT</span>
              </span>
              <span className="hidden sm:inline-block bg-black text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Gemini AI
              </span>
            </div>
            <p className="text-[11px] font-bold text-stone-900 tracking-tight -mt-1 hidden sm:block">
              AI Comic Story & Illustration Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Presets Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 bg-white hover:bg-yellow-100 text-black font-bold text-xs md:text-sm px-3 py-1.5 rounded-md border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
            title="Load ready-made story ideas"
          >
            <Wand2 className="w-4 h-4 text-purple-600" />
            <span>Story Presets</span>
          </button>

          {/* New Comic */}
          <button
            onClick={onNewComic}
            className="flex items-center gap-1.5 bg-yellow-200 hover:bg-yellow-300 text-black font-bold text-xs md:text-sm px-3 py-1.5 rounded-md border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">New Comic</span>
          </button>

          {/* View Mode Toggle when project exists */}
          {currentProject && (
            <div className="hidden lg:flex items-center bg-yellow-300/80 border-2 border-black rounded-md p-0.5">
              <button
                onClick={() => onChangeViewMode('grid')}
                className={`px-2 py-1 text-xs font-bold rounded ${viewMode === 'grid' ? 'bg-black text-yellow-300' : 'text-black hover:bg-yellow-200'}`}
                title="Grid Page Layout"
              >
                Grid
              </button>
              <button
                onClick={() => onChangeViewMode('webtoon')}
                className={`px-2 py-1 text-xs font-bold rounded ${viewMode === 'webtoon' ? 'bg-black text-yellow-300' : 'text-black hover:bg-yellow-200'}`}
                title="Vertical Webtoon Scroll"
              >
                Webtoon
              </button>
              <button
                onClick={() => onChangeViewMode('slide')}
                className={`px-2 py-1 text-xs font-bold rounded ${viewMode === 'slide' ? 'bg-black text-yellow-300' : 'text-black hover:bg-yellow-200'}`}
                title="Slide-by-Slide Cinema"
              >
                Cinema
              </button>
            </div>
          )}

          {/* Layout Binding Builder (Scenario 3) */}
          {currentProject && (
            <button
              onClick={onOpenLayoutBuilder}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs md:text-sm px-3 py-1.5 rounded-md border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
              title="Layout Binding Builder"
            >
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Layout</span>
            </button>
          )}

          {/* Print */}
          {currentProject && (
            <button
              onClick={onPrint}
              className="hidden sm:flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-black font-bold text-xs md:text-sm px-2.5 py-1.5 rounded-md border-2 border-black comic-shadow-sm"
              title="Print Comic"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          {/* Export PDF Button (Scenario 3) */}
          {currentProject && (
            <button
              onClick={onExportPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm px-3.5 py-1.5 rounded-md border-2 border-black comic-shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
              title="Export Full Comic as PDF with Layout Binding"
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Compiling PDF...' : 'Download PDF'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
