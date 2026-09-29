import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Printer, ArrowLeft, PlusCircle, Share2, Sparkles, FileText, BookOpen, Layers } from 'lucide-react';
import { ComicProject } from '../types/comic';
import { ExportResult } from '../services/pdfExporter';

interface ExportSuccessPageProps {
  comic: ComicProject;
  exportResult: ExportResult;
  onReturnToViewer: () => void;
  onNewComic: () => void;
  onPrint: () => void;
}

export const ExportSuccessPage: React.FC<ExportSuccessPageProps> = ({
  comic,
  exportResult,
  onReturnToViewer,
  onNewComic,
  onPrint
}) => {
  useEffect(() => {
    // Launch comic celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#facc15', '#3b82f6', '#10b981', '#000000']
      });
    } catch (e) {
      // Ignored if canvas not ready
    }
  }, []);

  const handleRedownload = () => {
    if (exportResult.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = exportResult.pdfBlobUrl;
      link.download = exportResult.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopySummary = () => {
    const text = `📖 Read my comic: "${comic.title}" starring ${comic.characterName} in ${comic.setting}! Created with ComicCraft AI.`;
    navigator.clipboard.writeText(text);
    alert('Comic summary copied to clipboard!');
  };

  const formattedSize = (exportResult.fileSizeBytes / 1024).toFixed(1) + ' KB';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Breadcrumb */}
      <button
        onClick={onReturnToViewer}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-black mb-6 bg-white border border-stone-300 px-3 py-1.5 rounded-lg hover:border-black transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Comic Viewer</span>
      </button>

      {/* Main Success Card */}
      <div className="bg-white border-4 border-black rounded-2xl p-6 md:p-10 comic-shadow relative overflow-hidden bg-halftone">
        {/* Celebration Stamp */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-8">
          <div className="w-16 h-16 bg-green-500 border-3 border-black rounded-full flex items-center justify-center text-white comic-shadow-sm mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="inline-block bg-black text-yellow-300 font-comic-title text-sm px-3 py-1 rounded tracking-wider uppercase mb-2">
            Scenario 3 Completed: Export Success
          </div>

          <h1 className="font-comic-title text-4xl sm:text-5xl text-black tracking-wide leading-none mb-3">
            YOUR COMIC HAS BEEN EXPORTED!
          </h1>
          <p className="text-stone-700 text-sm md:text-base font-semibold">
            The layout builder assembled all panel illustrations, dialogues, and narrative text into
            a high-resolution print PDF with a timestamped filename.
          </p>
        </div>

        {/* File Information Box */}
        <div className="bg-yellow-200/90 border-3 border-black rounded-xl p-5 comic-shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black/40">
            <FileText className="w-5 h-5 text-black" />
            <h2 className="font-comic-title text-xl text-black">DOCUMENT EXPORT DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-600 font-bold block uppercase text-[10px]">Filename:</span>
              <span className="font-mono font-bold text-stone-900 break-all">{exportResult.filename}</span>
            </div>
            <div>
              <span className="text-stone-600 font-bold block uppercase text-[10px]">Timestamp:</span>
              <span className="font-semibold text-stone-900">{exportResult.timestamp}</span>
            </div>
            <div>
              <span className="text-stone-600 font-bold block uppercase text-[10px]">Total Pages:</span>
              <span className="font-bold text-stone-900">{exportResult.totalPages} page(s) (A4 Portrait)</span>
            </div>
            <div>
              <span className="text-stone-600 font-bold block uppercase text-[10px]">Panels Bound:</span>
              <span className="font-bold text-stone-900">{comic.panels.length} panels with narration & SFX</span>
            </div>
            <div>
              <span className="text-stone-600 font-bold block uppercase text-[10px]">Approx. File Size:</span>
              <span className="font-bold text-stone-900">{formattedSize}</span>
            </div>
            <div>
              <span className="text-stone-600 font-bold block uppercase text-[10px]">Art Style & Tone:</span>
              <span className="font-bold text-stone-900">{comic.artStyle} ({comic.tone})</span>
            </div>
          </div>
        </div>

        {/* Comic Summary Preview */}
        <div className="bg-stone-50 border-2 border-black rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-comic-title text-base text-black flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Compiled Story: "{comic.title}"</span>
            </span>
            <span className="text-xs font-bold text-stone-500">Character: {comic.characterName}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {comic.panels.map((p) => (
              <div key={p.id} className="border-2 border-black rounded-lg overflow-hidden bg-white">
                <img src={p.imageUrl} alt={p.title} className="w-full aspect-[4/3] object-cover" />
                <div className="p-1.5 bg-black text-yellow-300 text-[10px] font-comic-title truncate">
                  P.{p.panelNumber}: {p.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRedownload}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-xl border-3 border-black comic-shadow transition-all hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF Again</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm px-5 py-3 rounded-xl border-3 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Printer className="w-5 h-5" />
            <span>Print Physical Copy</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-black font-bold text-sm px-4 py-3 rounded-xl border-2 border-black transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Logline</span>
          </button>

          <button
            onClick={onNewComic}
            className="flex items-center gap-2 bg-black hover:bg-stone-800 text-yellow-300 font-bold text-sm px-5 py-3 rounded-xl border-3 border-black comic-shadow-sm transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Comic</span>
          </button>
        </div>
      </div>
    </div>
  );
};
