import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2, Undo } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ThemeSettings: React.FC = () => {
  const { previewData, saveSection, updatePreview, resetPreview } = useApp();

  // Local state variables
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [buttonStyle, setButtonStyle] = useState<'square' | 'rounded' | 'pill'>('rounded');
  const [fontFamily, setFontFamily] = useState('');
  const [bodyFontFamily, setBodyFontFamily] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [borderRadius, setBorderRadius] = useState('');

  // Status flags
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synced fonts lists (Google Fonts matching the elegant theme guidelines)
  const headerFonts = [
    'Playfair Display',
    'Cinzel',
    'Cormorant Garamond',
    'Lora',
    'Cormorant',
    'Prata',
    'Outfit'
  ];

  const bodyFonts = [
    'Inter',
    'Montserrat',
    'Outfit',
    'Roboto',
    'Lato',
    'Open Sans'
  ];

  // Sync state when context data loads
  useEffect(() => {
    if (previewData?.theme) {
      const t = previewData.theme;
      setPrimaryColor(t.primaryColor || '#c5a880');
      setSecondaryColor(t.secondaryColor || '#161616');
      setAccentColor(t.accentColor || '#ffffff');
      setBackgroundColor(t.backgroundColor || '#0c0c0c');
      setButtonStyle(t.buttonStyle || 'rounded');
      setFontFamily(t.fontFamily || 'Playfair Display');
      setBodyFontFamily(t.bodyFontFamily || 'Inter');
      setIsDark(t.isDark !== undefined ? t.isDark : true);
      setBorderRadius(t.borderRadius || '8px');
    }
  }, [previewData?.theme]);

  // Handle edit events (real-time preview synchronization)
  const handleFieldChange = (field: string, val: any) => {
    updatePreview('theme', field, val);

    if (field === 'primaryColor') setPrimaryColor(val);
    if (field === 'secondaryColor') setSecondaryColor(val);
    if (field === 'accentColor') setAccentColor(val);
    if (field === 'backgroundColor') setBackgroundColor(val);
    if (field === 'buttonStyle') setButtonStyle(val);
    if (field === 'fontFamily') setFontFamily(val);
    if (field === 'bodyFontFamily') setBodyFontFamily(val);
    if (field === 'isDark') setIsDark(val);
    if (field === 'borderRadius') setBorderRadius(val);
  };

  // Convert border-radius strings to number for slider (e.g. "8px" -> 8)
  const getRadiusNumber = () => {
    return parseInt(borderRadius) || 0;
  };

  const handleRadiusSliderChange = (num: number) => {
    const val = `${num}px`;
    handleFieldChange('borderRadius', val);
  };

  // Save changes to db
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await saveSection('theme', {
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        buttonStyle,
        fontFamily,
        bodyFontFamily,
        isDark,
        borderRadius
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save theme configurations.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn pb-10">
      
      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 text-red-300 text-xs rounded-lg">{error}</div>
      )}
      
      {saveSuccess && (
        <div className="p-3 bg-green-950/20 border border-green-500/25 text-green-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Theme customizer saved and synchronized successfully!
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Colors Customizer Group */}
        <div className="space-y-4 p-5 bg-[#121212] border border-zinc-800 rounded-xl md:col-span-2">
          <h3 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 uppercase tracking-wider">Color Palette Customizer</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Primary Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">Primary Branding Color (Gold/Accent)</label>
              <div className="flex gap-2.5">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded border border-zinc-800 bg-[#161616] p-0.5 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                  placeholder="#c5a880"
                  className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">App Background Color</label>
              <div className="flex gap-2.5">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded border border-zinc-800 bg-[#161616] p-0.5 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                  placeholder="#0c0c0c"
                  className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">Secondary Container Color</label>
              <div className="flex gap-2.5">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded border border-zinc-800 bg-[#161616] p-0.5 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                  placeholder="#161616"
                  className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Accent Text Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">Base Text/Accent Color</label>
              <div className="flex gap-2.5">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                  className="w-10 h-10 rounded border border-zinc-800 bg-[#161616] p-0.5 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Customizer Group */}
        <div className="space-y-4 p-5 bg-[#121212] border border-zinc-800 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 uppercase tracking-wider">Typography Settings</h3>
          
          {/* Header Font */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Header Typography (Google Fonts)</label>
            <select
              value={fontFamily}
              onChange={(e) => handleFieldChange('fontFamily', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-primary/60"
            >
              {headerFonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Body Font */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Body Typography (Google Fonts)</label>
            <select
              value={bodyFontFamily}
              onChange={(e) => handleFieldChange('bodyFontFamily', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-primary/60"
            >
              {bodyFonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Component Shapes Group */}
        <div className="space-y-4 p-5 bg-[#121212] border border-zinc-800 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 uppercase tracking-wider">Component Shape Settings</h3>
          
          {/* Button Style */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Button Corner Styles</label>
            <select
              value={buttonStyle}
              onChange={(e) => handleFieldChange('buttonStyle', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#161616] border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-primary/60"
            >
              <option value="square">Sharp Square (0px)</option>
              <option value="rounded">Rounded Corners (Dynamic)</option>
              <option value="pill">Pill Shape (Fully Round)</option>
            </select>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-zinc-400">Border Radius Corners ({borderRadius})</label>
            </div>
            <div className="flex gap-4 items-center pt-2">
              <input
                type="range"
                min="0"
                max="24"
                value={getRadiusNumber()}
                onChange={(e) => handleRadiusSliderChange(parseInt(e.target.value) || 0)}
                className="flex-1 accent-primary cursor-pointer"
              />
              <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 bg-[#161616] border border-zinc-800 rounded shrink-0 w-12 text-center">
                {borderRadius}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={resetPreview}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-zinc-800 transition-colors"
        >
          <Undo className="w-3.5 h-3.5" />
          <span>Reset Changes</span>
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-primary/10"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Styles...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Theme Config
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default ThemeSettings;
