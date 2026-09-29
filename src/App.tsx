/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ComicCreatorForm } from './components/ComicCreatorForm';
import { ComicViewer } from './components/ComicViewer';
import { PanelEditorModal } from './components/PanelEditorModal';
import { LayoutBuilderModal } from './components/LayoutBuilderModal';
import { ExportSuccessPage } from './components/ExportSuccessPage';
import { PresetsModal } from './components/PresetsModal';
import { ComicPanel, ComicPreset, ComicProject, LayoutSettings, ToneId, ArtStyleId } from './types/comic';
import { generateComicStory, GenerateComicInput } from './services/geminiService';
import { compileComicPdf, ExportResult } from './services/pdfExporter';
import { requestPanelImage } from './services/imageGenerator';

export default function App() {
  const [currentProject, setCurrentProject] = useState<ComicProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIterating, setIsIterating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'webtoon' | 'slide'>('grid');
  const [activeView, setActiveView] = useState<'form' | 'viewer' | 'exportSuccess'>('form');

  // Modals state
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isLayoutBuilderOpen, setIsLayoutBuilderOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState<ComicPanel | null>(null);

  // Scenario 3 Export Result
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

  // Layout Binding Settings
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    gridColumns: 2,
    panelGap: 12,
    borderWidth: 2,
    showHalftone: true,
    paperTexture: true,
    captionStyle: 'yellow-box'
  });

  // Load saved project from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('comiccraft_latest_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.panels && parsed.panels.length > 0) {
          setCurrentProject(parsed);
          setActiveView('viewer');
        }
      }
    } catch (e) {
      console.warn('Failed to restore saved project:', e);
    }
  }, []);

  // Save project changes
  const saveProject = (project: ComicProject) => {
    setCurrentProject(project);
    try {
      localStorage.setItem('comiccraft_latest_project', JSON.stringify(project));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // Generate a complete new comic (Scenario 1)
  const handleGenerateComic = async (input: GenerateComicInput) => {
    setIsGenerating(true);
    try {
      const project = await generateComicStory(input);
      saveProject(project);
      setActiveView('viewer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to generate comic:', err);
      alert('Error generating comic story: ' + (err?.message || 'Please try again'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Scenario 2: Iterate Tone and Art Style
  const handleIterateToneAndStyle = async (newTone: ToneId, newStyle: ArtStyleId) => {
    if (!currentProject) return;
    setIsIterating(true);
    try {
      const updatedProject = await generateComicStory({
        storyPrompt: currentProject.storyPrompt,
        characterName: currentProject.characterName,
        setting: currentProject.setting,
        tone: newTone,
        artStyle: newStyle,
        panelsCount: currentProject.panelsCount
      });
      saveProject(updatedProject);
    } catch (err: any) {
      console.error('Iteration failed:', err);
      alert('Failed to regenerate comic mood: ' + (err?.message || 'Please try again'));
    } finally {
      setIsIterating(false);
    }
  };

  // Scenario 3: Layout Binding & PDF Export
  const handleCompileAndExportPdf = async (customSettings?: LayoutSettings) => {
    if (!currentProject) return;
    setIsExporting(true);
    try {
      const activeSettings = customSettings || layoutSettings;
      const result = await compileComicPdf(currentProject, activeSettings);
      setExportResult(result);
      setIsLayoutBuilderOpen(false);
      setActiveView('exportSuccess');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Export PDF failed:', err);
      alert('PDF generation encountered an issue: ' + (err?.message || 'Please retry'));
    } finally {
      setIsExporting(false);
    }
  };

  // Print comic
  const handlePrint = () => {
    window.print();
  };

  // Update a single panel
  const handleSavePanel = (updatedPanel: ComicPanel) => {
    if (!currentProject) return;
    const newPanels = currentProject.panels.map((p) =>
      p.id === updatedPanel.id ? updatedPanel : p
    );
    saveProject({ ...currentProject, panels: newPanels });
  };

  // Re-generate individual panel image
  const handleRegeneratePanelImage = async (panel: ComicPanel) => {
    if (!currentProject) return;
    const newImageUrl = await requestPanelImage(panel.sceneDescription, currentProject.artStyle, {
      panelNumber: panel.panelNumber,
      title: panel.title,
      sceneDescription: panel.sceneDescription,
      characterName: currentProject.characterName,
      setting: currentProject.setting,
      artStyle: currentProject.artStyle,
      tone: currentProject.tone
    });

    handleSavePanel({ ...panel, imageUrl: newImageUrl, imageStatus: 'ready' });
  };

  // Select Preset
  const handleSelectPreset = (preset: ComicPreset, autoGenerate: boolean) => {
    if (autoGenerate) {
      handleGenerateComic({
        storyPrompt: preset.prompt,
        characterName: preset.characterName,
        setting: preset.setting,
        tone: preset.tone,
        artStyle: preset.artStyle,
        panelsCount: 4
      });
    } else {
      setActiveView('form');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50 flex flex-col font-comic-text">
      {/* Top Navigation */}
      <Navbar
        currentProject={currentProject}
        onNewComic={() => setActiveView('form')}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenLayoutBuilder={() => setIsLayoutBuilderOpen(true)}
        onExportPdf={() => handleCompileAndExportPdf()}
        onPrint={handlePrint}
        isExporting={isExporting}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: CREATOR FORM */}
        {activeView === 'form' && (
          <ComicCreatorForm
            onGenerate={handleGenerateComic}
            isGenerating={isGenerating}
            initialValues={
              currentProject
                ? {
                    storyPrompt: currentProject.storyPrompt,
                    characterName: currentProject.characterName,
                    setting: currentProject.setting,
                    tone: currentProject.tone,
                    artStyle: currentProject.artStyle,
                    panelsCount: currentProject.panelsCount
                  }
                : undefined
            }
          />
        )}

        {/* VIEW 2: COMIC VIEWER */}
        {activeView === 'viewer' && currentProject && (
          <ComicViewer
            comic={currentProject}
            viewMode={viewMode}
            onChangeViewMode={(mode) => setViewMode(mode)}
            onEditPanel={(panel) => setEditingPanel(panel)}
            onRegeneratePanelImage={handleRegeneratePanelImage}
            onOpenLayoutBuilder={() => setIsLayoutBuilderOpen(true)}
            onExportPdf={() => handleCompileAndExportPdf()}
            onPrint={handlePrint}
            isExporting={isExporting}
            onIterateToneAndStyle={handleIterateToneAndStyle}
            isIterating={isIterating}
          />
        )}

        {/* VIEW 3: SCENARIO 3 EXPORT SUCCESS PAGE */}
        {activeView === 'exportSuccess' && currentProject && exportResult && (
          <ExportSuccessPage
            comic={currentProject}
            exportResult={exportResult}
            onReturnToViewer={() => setActiveView('viewer')}
            onNewComic={() => setActiveView('form')}
            onPrint={handlePrint}
          />
        )}
      </main>

      {/* Modals */}
      {/* 1. Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* 2. Layout Builder Modal (Scenario 3 Layout Binding) */}
      {currentProject && (
        <LayoutBuilderModal
          isOpen={isLayoutBuilderOpen}
          onClose={() => setIsLayoutBuilderOpen(false)}
          comic={currentProject}
          currentSettings={layoutSettings}
          onApplySettings={(settings) => setLayoutSettings(settings)}
          onCompileAndExport={(settings) => handleCompileAndExportPdf(settings)}
          isExporting={isExporting}
        />
      )}

      {/* 3. Panel Editor Modal */}
      {editingPanel && currentProject && (
        <PanelEditorModal
          panel={editingPanel}
          artStyle={currentProject.artStyle}
          characterName={currentProject.characterName}
          isOpen={!!editingPanel}
          onClose={() => setEditingPanel(null)}
          onSave={handleSavePanel}
          onRegenerateImage={handleRegeneratePanelImage}
        />
      )}

      {/* Footer */}
      <footer className="border-t-4 border-black bg-yellow-400 py-6 px-4 mt-12 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-stone-900">
          <div className="flex items-center gap-1.5">
            <span className="font-comic-title text-xl text-black">COMICCRAFT</span>
            <span>• Built with Gemini AI & Modern Web Architecture</span>
          </div>
          <div>
            <span>Scenario 1 (Story/Art) • Scenario 2 (Tone Iteration) • Scenario 3 (Layout Binding & PDF Export)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
