
import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, Smartphone, Palette, Download, Sparkles, Image as ImageIcon,
  ChevronLeft, ChevronRight, RefreshCw, Layers, Zap, Eye, Crown,
  CheckCircle2, ShieldCheck, Info, X, Lock, Star, Cpu, MousePointer2, Settings2, Plus, Trash2, Maximize2
} from 'lucide-react';
import { DeviceType, TemplateStyle, AppSettings, ScreenshotData } from './types';
import { DEVICE_CONFIGS, INITIAL_SCREENSHOTS, COLOR_PRESETS } from './constants';
import { Button } from './components/ui/Button';
import { TemplateRenderer } from './components/TemplateRenderer';
import { generateMarketingCopy } from './services/geminiService';

declare const htmlToImage: any;
declare const JSZip: any;

const VantageLogo = () => (
  <div className="relative w-8 h-8 flex items-center justify-center group cursor-pointer">
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
      <defs>
        <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#71717a', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M20,25 L50,80 L80,25" fill="none" stroke="url(#vGrad)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    deviceType: DeviceType.IPHONE_16_PRO_MAX,
    template: TemplateStyle.CLASSIC,
    primaryColor: '#0c0c0e',
    secondaryColor: '#2d2d3a',
    textColor: '#FFFFFF',
    screenCount: 5,
    screenshots: INITIAL_SCREENSHOTS.slice(0, 5),
    gradientAngle: 145,
    deviceFinish: 'Titanium'
  });

  const [activeTab, setActiveTab] = useState<'visuals' | 'content' | 'device'>('visuals');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(0.28);

  const canvasRef = useRef<HTMLDivElement>(null);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateScreenshot = (index: number, data: Partial<ScreenshotData>) => {
    const newScreens = [...settings.screenshots];
    newScreens[index] = { ...newScreens[index], ...data };
    updateSetting('screenshots', newScreens);
  };

  const handleImageUpload = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateScreenshot(index, { imageUrl: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAiGeneration = async () => {
    if (!appDescription) return;
    setIsGenerating(true);
    const result = await generateMarketingCopy(appDescription, settings.screenCount);
    if (result) {
      const newScreens = settings.screenshots.map((screen, i) => ({
        ...screen,
        title: result[i]?.title || screen.title,
        subtitle: result[i]?.subtitle || screen.subtitle
      }));
      updateSetting('screenshots', newScreens);
      setShowAiModal(false);
    }
    setIsGenerating(false);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Calibrating Canvas...');

    try {
      const zip = new JSZip();
      const canvases = document.querySelectorAll('.screenshot-canvas');
      
      for (let i = 0; i < canvases.length; i++) {
        setExportProgress(Math.floor(10 + ((i / canvases.length) * 80)));
        setExportStatus(`Processing Bundle ${i + 1}/${canvases.length}...`);
        
        const canvas = canvases[i] as HTMLElement;
        const dataUrl = await htmlToImage.toPng(canvas, {
          quality: 1,
          pixelRatio: 1,
          width: 1242,
          height: 2208,
          style: { transform: 'scale(1)', transformOrigin: 'top left' }
        });
        
        zip.file(`asset_${i + 1}.png`, dataUrl.split(',')[1], { base64: true });
      }

      setExportProgress(95);
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vantage_Export_Bundle.zip`;
      link.click();
      setExportProgress(100);
      setExportStatus('Export Complete');
      setTimeout(() => setIsExporting(false), 2000);
    } catch (error) {
      console.error(error);
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden text-[#e4e4e7] font-sans selection:bg-white selection:text-black">
      
      {/* 1. LEFT PANEL: Asset Navigator */}
      <nav className="w-64 bg-[#0c0c0e] border-r border-white/5 flex flex-col z-40">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VantageLogo />
            <h1 className="text-xs font-black tracking-[0.2em] uppercase text-white">Vantage</h1>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Modules</div>
          {settings.screenshots.map((screen, idx) => (
            <button
              key={screen.id}
              onClick={() => setSelectedScreenIndex(idx)}
              className={`w-full group relative flex items-center gap-3 p-3 rounded-lg transition-all ${selectedScreenIndex === idx ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02] border border-transparent'}`}
            >
              <div className="w-8 h-12 rounded bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-white/20">
                <img src={screen.imageUrl} className="w-full h-full object-cover opacity-60" alt="" />
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className={`text-[11px] font-bold truncate ${selectedScreenIndex === idx ? 'text-white' : 'text-zinc-500'}`}>
                  {screen.title || `Untitled Module ${idx + 1}`}
                </div>
                <div className="text-[9px] font-mono text-zinc-600">ID: M0{idx + 1}</div>
              </div>
              {selectedScreenIndex === idx && <div className="w-1 h-1 rounded-full bg-white absolute left-1"></div>}
            </button>
          ))}
          <button className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white border border-dashed border-white/10 rounded-lg transition-all hover:bg-white/[0.02]">
            <Plus size={12} /> ADD MODULE
          </button>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase mb-3">
             <span>System Status</span>
             <span className="text-emerald-500">Live</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-white/10 w-2/3"></div>
          </div>
        </div>
      </nav>

      {/* 2. CENTER PANEL: Infinite Canvas */}
      <main className="flex-1 relative bg-[#09090b] flex flex-col overflow-hidden">
        {/* Workspace Controls */}
        <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-[#0c0c0e]/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-md border border-white/5 text-[10px] font-bold text-zinc-400">
               <Maximize2 size={12} />
               <span>PREVIEW_MODE_4K</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-600 uppercase">Zoom</span>
              <input 
                type="range" min="0.1" max="0.5" step="0.01"
                value={zoomScale}
                onChange={e => setZoomScale(parseFloat(e.target.value))}
                className="w-24 h-1 bg-zinc-800 rounded-full appearance-none accent-white cursor-pointer"
              />
              <span className="text-[10px] font-mono text-zinc-500 w-8">{Math.round(zoomScale * 100)}%</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <Button variant="custom" size="sm" className="bg-white text-black h-8 px-4 text-[10px] font-black uppercase rounded shadow-lg hover:bg-zinc-200 transition-all" onClick={handleExport} isLoading={isExporting}>
              Deploy Assets
            </Button>
          </div>
        </div>

        {/* The Floor */}
        {/* FIX: Correctly format the SVG background URL by using backticks and avoiding escaped quotes within a regular JSX string attribute. */}
        <div className={`flex-1 relative overflow-auto grid place-items-center bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h40v40H0z" fill="none"/%3E%3Ccircle cx="20" cy="20" r="0.5" fill="%23ffffff10"/%3E%3C/svg%3E')] bg-center`}>
          <div 
            className="relative transition-all duration-500 ease-out"
            style={{ 
              width: 1242 * zoomScale, 
              height: 2208 * zoomScale,
              padding: '2px' // Visual separation
            }}
          >
            {/* The Precision Ring (Visual focus indicator) */}
            <div className="absolute -inset-8 border border-white/10 rounded-[64px] pointer-events-none opacity-50"></div>
            <div className="absolute -inset-16 border border-white/5 rounded-[96px] pointer-events-none opacity-20"></div>

            {/* Content Renderer */}
            <div className="origin-top-left" style={{ transform: `scale(${zoomScale})` }}>
              <TemplateRenderer 
                settings={settings} 
                data={settings.screenshots[selectedScreenIndex]} 
                scale={1}
              />
            </div>

            {/* Asset Overlay HUD */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0c0c0e] border border-white/10 p-1.5 rounded-xl shadow-2xl">
               <button onClick={() => handleImageUpload(selectedScreenIndex)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors group" title="Replace Screen">
                  <RefreshCw size={16} className="text-zinc-500 group-hover:text-white" />
               </button>
               <div className="w-px h-4 bg-white/10"></div>
               <button onClick={() => setShowAiModal(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors group" title="Neural Synthesis">
                  <Zap size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. RIGHT PANEL: Inspector */}
      <aside className="w-72 bg-[#0c0c0e] border-l border-white/5 flex flex-col z-30">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Settings2 size={14} className="text-zinc-500" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-widest">Inspector</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Section: Module Content */}
          <section className="p-5 border-b border-white/5 space-y-4">
             <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
               <Layers size={10} /> Module Properties
             </div>
             <div className="space-y-3">
               <div className="space-y-1.5">
                 <label className="text-[10px] text-zinc-500">Primary Headline</label>
                 <input 
                   value={settings.screenshots[selectedScreenIndex].title}
                   onChange={e => updateScreenshot(selectedScreenIndex, { title: e.target.value })}
                   className="w-full bg-black/40 border border-white/5 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[10px] text-zinc-500">Narrative Description</label>
                 <textarea 
                   value={settings.screenshots[selectedScreenIndex].subtitle}
                   onChange={e => updateScreenshot(selectedScreenIndex, { subtitle: e.target.value })}
                   className="w-full h-24 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/20 transition-all text-white resize-none leading-relaxed"
                 />
               </div>
             </div>
          </section>

          {/* Section: Visual Style */}
          <section className="p-5 border-b border-white/5 space-y-4">
             <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
               <Palette size={10} /> Template & Atmosphere
             </div>
             <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500">Master Template</label>
                  <select 
                    value={settings.template}
                    onChange={e => updateSetting('template', e.target.value as TemplateStyle)}
                    className="w-full bg-black/40 border border-white/5 rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    {Object.values(TemplateStyle).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 block">Chroma Presets</label>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PRESETS.map((p, i) => (
                      <button 
                        key={i} 
                        onClick={() => { updateSetting('primaryColor', p.primary); updateSetting('secondaryColor', p.secondary); }}
                        className={`h-6 rounded-sm border transition-all ${settings.primaryColor === p.primary ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})` }}
                      />
                    ))}
                  </div>
               </div>
             </div>
          </section>

          {/* Section: Hardware Spec */}
          <section className="p-5 border-b border-white/5 space-y-4">
             <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
               <Smartphone size={10} /> Hardware Specification
             </div>
             <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500">Device Matrix</label>
                  <select 
                    value={settings.deviceType}
                    onChange={e => updateSetting('deviceType', e.target.value as DeviceType)}
                    className="w-full bg-black/40 border border-white/5 rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    {Object.values(DeviceType).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 block">Frame Material</label>
                  <div className="flex gap-1.5">
                    {['Titanium', 'Space Black', 'Silver'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => updateSetting('deviceFinish', f as any)}
                        className={`flex-1 py-2 text-[9px] font-bold rounded border transition-all ${settings.deviceFinish === f ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-600 border-white/10 hover:border-white/20'}`}
                      >
                        {f.split(' ')[0]}
                      </button>
                    ))}
                  </div>
               </div>
             </div>
          </section>
        </div>

        {/* Global Inspector Footer */}
        <div className="p-5 space-y-4">
          <Button 
            className="w-full h-11 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded shadow-xl hover:bg-zinc-200"
            onClick={handleExport}
            isLoading={isExporting}
          >
            Deploy assets
          </Button>
          <button className="w-full py-2 flex items-center justify-center gap-2 text-[9px] font-bold text-zinc-600 hover:text-white transition-all">
            <ShieldCheck size={12} /> Privacy manifest
          </button>
        </div>
      </aside>

      {/* Synthesis HUD Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="w-full max-w-sm space-y-12 text-center">
              <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 border-[4px] border-white/5 rounded-full"></div>
                  <div 
                    className="absolute inset-0 border-[4px] border-white rounded-full transition-all duration-700" 
                    style={{ clipPath: `inset(0 0 0 0 round 100%)`, maskImage: `conic-gradient(white ${exportProgress}%, transparent ${exportProgress}%)`, WebkitMaskImage: `conic-gradient(white ${exportProgress}%, transparent ${exportProgress}%)` }}
                  ></div>
                  <span className="text-4xl font-black text-white tabular-nums">{exportProgress}%</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">{exportStatus}</h3>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em]">Compiling Master Assets</p>
              </div>
           </div>
        </div>
      )}

      {/* Neural Interface Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAiModal(false)}></div>
          <div className="bg-[#121214] rounded-2xl w-full max-w-xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] z-10 overflow-hidden relative animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Neural Sync Engine</span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-3">Narrative Synthesis.</h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed mb-6">Input your app's core essence to generate optimized store hooks.</p>
              <textarea 
                className="w-full h-40 p-5 rounded-xl bg-black/40 border border-white/5 focus:border-white/20 focus:outline-none text-white text-base placeholder:text-zinc-800 transition-all resize-none"
                placeholder="Ex: A minimal sleep tracker that uses ambient soundscapes..."
                value={appDescription}
                onChange={e => setAppDescription(e.target.value)}
              />
            </div>
            <div className="p-8 pt-2 flex gap-3">
              <Button variant="ghost" className="flex-1 py-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest border border-white/5" onClick={() => setShowAiModal(false)}>Cancel</Button>
              <Button 
                  className="flex-[2] py-3 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded shadow-xl" 
                  onClick={handleAiGeneration} 
                  isLoading={isGenerating}
                  disabled={!appDescription}
              >
                Synthesize Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
