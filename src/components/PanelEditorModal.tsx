import React, { useState } from 'react';
import { X, Plus, Trash2, RefreshCw, MessageSquare, Volume2, Save, Sparkles } from 'lucide-react';
import { ComicPanel, BubbleType, BubblePosition, ArtStyleId } from '../types/comic';

interface PanelEditorModalProps {
  panel: ComicPanel;
  artStyle: ArtStyleId;
  characterName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPanel: ComicPanel) => void;
  onRegenerateImage: (panel: ComicPanel) => void;
}

export const PanelEditorModal: React.FC<PanelEditorModalProps> = ({
  panel,
  artStyle,
  characterName,
  isOpen,
  onClose,
  onSave,
  onRegenerateImage
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(panel.title);
  const [sceneDescription, setSceneDescription] = useState(panel.sceneDescription);
  const [narration, setNarration] = useState(panel.narration);
  const [cameraAngle, setCameraAngle] = useState(panel.cameraAngle);
  const [dialogues, setDialogues] = useState(panel.dialogues);
  const [sfxText, setSfxText] = useState(panel.soundEffect?.text || '');
  const [sfxStyle, setSfxStyle] = useState<'explosion' | 'action' | 'zap' | 'subtle'>(
    panel.soundEffect?.style || 'action'
  );

  const handleAddDialogue = () => {
    setDialogues([
      ...dialogues,
      {
        id: `dlg_${Date.now()}`,
        speaker: characterName,
        text: 'New line of dialogue...',
        type: 'speech',
        position: dialogues.length % 2 === 0 ? 'top-left' : 'top-right'
      }
    ]);
  };

  const handleUpdateDialogue = (index: number, field: string, value: any) => {
    const updated = [...dialogues];
    updated[index] = { ...updated[index], [field]: value };
    setDialogues(updated);
  };

  const handleRemoveDialogue = (index: number) => {
    setDialogues(dialogues.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedPanel: ComicPanel = {
      ...panel,
      title,
      sceneDescription,
      narration,
      cameraAngle,
      dialogues,
      soundEffect: sfxText.trim() ? {
        text: sfxText.trim().toUpperCase(),
        style: sfxStyle,
        color: sfxStyle === 'explosion' ? '#ef4444' : sfxStyle === 'zap' ? '#eab308' : '#3b82f6',
        position: 'center'
      } : undefined
    };
    onSave(updatedPanel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-4 border-black rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto comic-shadow p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-300 border-2 border-black px-2 py-0.5 rounded font-comic-title text-base text-black">
              PANEL {panel.panelNumber}
            </span>
            <h2 className="font-comic-title text-2xl text-black">EDIT COMIC PANEL</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 border-2 border-transparent hover:border-black transition-all"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Panel Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Panel Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border-2 border-black rounded-lg text-sm font-bold text-black"
            />
          </div>

          {/* Scene Action Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Scene Visual & Action
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                className="flex-1 p-2 border-2 border-black rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => onRegenerateImage({ ...panel, sceneDescription })}
                className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 border-2 border-black rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Regenerate artwork based on new prompt"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-ink</span>
              </button>
            </div>
          </div>

          {/* Narration Caption Box */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Narration Caption (Yellow Box)
            </label>
            <textarea
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              rows={2}
              className="w-full p-2 bg-yellow-50 border-2 border-black rounded-lg text-sm font-comic-text font-bold"
              placeholder="Atmospheric story narration caption..."
            />
          </div>

          {/* Dialogues & Speech Bubbles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 uppercase flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Speech Bubbles & Dialogue</span>
              </label>
              <button
                type="button"
                onClick={handleAddDialogue}
                className="text-xs bg-black text-yellow-300 px-2 py-1 rounded font-bold hover:bg-stone-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Bubble</span>
              </button>
            </div>

            <div className="space-y-2">
              {dialogues.map((dlg, idx) => (
                <div
                  key={dlg.id || idx}
                  className="p-3 bg-stone-50 border-2 border-black rounded-xl space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={dlg.speaker}
                      onChange={(e) => handleUpdateDialogue(idx, 'speaker', e.target.value)}
                      placeholder="Speaker"
                      className="w-1/3 p-1.5 border border-black rounded text-xs font-bold"
                    />
                    <select
                      value={dlg.type}
                      onChange={(e) => handleUpdateDialogue(idx, 'type', e.target.value as BubbleType)}
                      className="p-1.5 border border-black rounded text-xs font-semibold"
                    >
                      <option value="speech">Speech Bubble</option>
                      <option value="thought">Thought Bubble</option>
                      <option value="shout">Shout / Exclamation</option>
                      <option value="whisper">Whisper</option>
                    </select>
                    <select
                      value={dlg.position}
                      onChange={(e) => handleUpdateDialogue(idx, 'position', e.target.value as BubblePosition)}
                      className="p-1.5 border border-black rounded text-xs font-semibold"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveDialogue(idx)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={dlg.text}
                    onChange={(e) => handleUpdateDialogue(idx, 'text', e.target.value)}
                    placeholder="Dialogue words..."
                    className="w-full p-2 border border-black rounded text-sm font-comic-text font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Comic Sound Effect */}
          <div className="border-t pt-3">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Comic Sound Effect (SFX)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sfxText}
                onChange={(e) => setSfxText(e.target.value)}
                placeholder="e.g. KABOOM!, WHOOSH!, POW!"
                className="w-1/2 p-2 border-2 border-black rounded-lg text-sm font-comic-title uppercase"
              />
              <select
                value={sfxStyle}
                onChange={(e) => setSfxStyle(e.target.value as any)}
                className="w-1/2 p-2 border-2 border-black rounded-lg text-xs font-bold"
              >
                <option value="action">Action (Red)</option>
                <option value="explosion">Explosion (Yellow/Orange)</option>
                <option value="zap">Zap / Electric (Blue)</option>
                <option value="subtle">Subtle (Purple)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-black pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm rounded-lg border-2 border-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg border-2 border-black comic-shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Panel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
