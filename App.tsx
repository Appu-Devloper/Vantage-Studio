
import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, 
  Smartphone, 
  Palette, 
  Download, 
  Sparkles, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers,
  Zap,
  Eye,
  Crown,
  CheckCircle2,
  FileDown,
  ShieldCheck,
  Heart,
  Info,
  X,
  Lock
} from 'lucide-react';
import { DeviceType, TemplateStyle, AppSettings, ScreenshotData } from './types';
import { DEVICE_CONFIGS, INITIAL_SCREENSHOTS, COLOR_PRESETS } from './constants';
import { Button } from './components/ui/Button';
import { TemplateRenderer } from './components/TemplateRenderer';
import { generateMarketingCopy } from './services/geminiService';

declare const htmlToImage: any;
declare const JSZip: any;

const VantageLogo = () => (
  <div className="relative w-12 h-12 flex items-center justify-center group">
    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-110">
      <defs>
        <linearGradient id="vantageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#71717a', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M20,25 L50,80 L80,25" fill="none" stroke="url(#vantageGrad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="40" r="6" fill="white" className="animate-pulse" />
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

  const [activeTab, setActiveTab] = useState<'design' | 'screens' | 'settings'>('design');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(0.4);

  const screenRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (screenRefs.current[selectedScreenIndex]) {
      screenRefs.current[selectedScreenIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedScreenIndex]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleScreenCountChange = (count: number) => {
    const newCount = Math.min(10, Math.max(1, count));
    const newScreens = Array.from({ length: 10 }, (_, i) => settings.screenshots[i] || INITIAL_SCREENSHOTS[i]);
    updateSetting('screenCount', newCount);
    updateSetting('screenshots', newScreens.slice(0, newCount));
    if (selectedScreenIndex >= newCount) setSelectedScreenIndex(newCount - 1);
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
    setExportStatus('Initializing Production Engine...');

    try {
      const zip = new JSZip();
      const canvases = document.querySelectorAll('.screenshot-canvas');
      
      setExportStatus('Calibrating high-fidelity matrices...');
      setExportProgress(15);

      for (let i = 0; i < canvases.length; i++) {
        const step = Math.floor(15 + ((i / canvases.length) * 70));
        setExportProgress(step);
        setExportStatus(`Rendering Tile ${i + 1} of ${canvases.length}...`);
        
        const canvas = canvases[i] as HTMLElement;
        const dataUrl = await htmlToImage.toPng(canvas, {
          quality: 1,
          pixelRatio: 3, 
          backgroundColor: '#000'
        });
        
        const base64Data = dataUrl.split(',')[1];
        zip.file(`vantage_screen_${i + 1}.png`, base64Data, { base64: true });
      }

      setExportProgress(95);
      setExportStatus('Finalizing enterprise package...');
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vantage_bundle_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExportStatus('Bundle dispatched successfully.');
      setTimeout(() => setIsExporting(false), 2500);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Production Error. Please retry.');
      setTimeout(() => setIsExporting(false), 5000);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden font-sans text-slate-100">
      {/* Sidebar */}
      <aside className="w-[440px] bg-[#121214] border-r border-white/5 flex flex-col shadow-2xl z-20 overflow-hidden">
        <div className="p-10 pb-8 bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <VantageLogo />
              <div>
                <h1 className="text-2xl font-black tracking-tight font-outfit leading-none flex items-center gap-2">
                  VANTAGE
                  <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </h1>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.35em] mt-2 block">Enterprise v2.5.2</span>
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
          </div>
          
          <div className="flex p-1.5 bg-black/50 rounded-2xl border border-white/5 shadow-inner">
            {(['design', 'screens', 'settings'] as const).map(tab => (
                <button 
                  key={tab}
                  className={`flex-1 py-3 text-[11px] font-black tracking-widest transition-all rounded-xl capitalize uppercase ${activeTab === tab ? 'bg-white text-slate-900 shadow-2xl' : 'text-slate-500 hover:text-slate-300'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-14">
          {activeTab === 'design' && (
            <>
              <section>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Layers className="w-5 h-5 text-white" />
                   </div>
                   <label className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-500">Master Layouts</label>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {Object.values(TemplateStyle).map(t => (
                    <button
                      key={t}
                      onClick={() => updateSetting('template', t)}
                      className={`group relative h-40 p-8 rounded-[36px] border transition-all flex flex-col justify-end text-left ${settings.template === t ? 'border-white bg-white text-slate-900 shadow-[0_30px_60px_rgba(255,255,255,0.15)]' : 'border-white/10 hover:border-white/30 bg-white/[0.03]'}`}
                    >
                      <span className={`text-[14px] font-black tracking-tight uppercase ${settings.template === t ? 'text-slate-900' : 'text-slate-400'}`}>{t}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Palette className="w-5 h-5 text-white" />
                   </div>
                   <label className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-500">Chroma Engine</label>
                </div>
                <div className="grid grid-cols-6 gap-3 mb-10">
                  {COLOR_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        updateSetting('primaryColor', p.primary);
                        updateSetting('secondaryColor', p.secondary);
                      }}
                      className="group h-11 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all hover:scale-125 shadow-xl"
                    >
                      <div className="flex h-full w-full rotate-45 scale-150">
                        <div className="flex-1 h-full" style={{ backgroundColor: p.primary }}></div>
                        <div className="flex-1 h-full" style={{ backgroundColor: p.secondary }}></div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-10 bg-black/40 p-10 rounded-[48px] border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Hardware Tone</span>
                        <div className="flex gap-2.5">
                             {(['Titanium', 'Space Black', 'Silver'] as const).map(f => (
                               <button 
                                 key={f}
                                 onClick={() => updateSetting('deviceFinish', f)}
                                 className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${settings.deviceFinish === f ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-600 hover:text-slate-300'}`}
                               >
                                 {f}
                               </button>
                             ))}
                        </div>
                    </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'screens' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Layout className="w-5 h-5 text-white" />
                   </div>
                   <label className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-500">Asset Stack</label>
                </div>
                <Button variant="ghost" size="sm" className="h-11 gap-3 rounded-2xl border border-white/10 px-6 text-white hover:bg-white/10 shadow-lg" onClick={() => setShowAiModal(true)}>
                    <Sparkles className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                    NEURAL GEN
                </Button>
              </div>
              
              <div className="space-y-8">
                {settings.screenshots.map((screen, idx) => (
                  <div 
                    key={screen.id} 
                    className={`group p-10 rounded-[48px] border transition-all cursor-pointer ${selectedScreenIndex === idx ? 'border-white bg-white/[0.04] shadow-2xl' : 'border-white/5 bg-black/30 hover:bg-black/40'}`}
                    onClick={() => setSelectedScreenIndex(idx)}
                  >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                           <span className="text-[15px] font-black w-11 h-11 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-xl">{idx + 1}</span>
                           <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Tile Meta</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-11 w-11 p-0 rounded-2xl bg-white/5" onClick={() => handleImageUpload(idx)}>
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        <input 
                          value={screen.title} 
                          onChange={e => updateScreenshot(idx, { title: e.target.value })}
                          placeholder="Headline Hook"
                          className="w-full bg-transparent font-black text-2xl tracking-tighter focus:outline-none text-white border-b border-white/10 pb-3"
                        />
                        <textarea 
                          value={screen.subtitle} 
                          onChange={e => updateScreenshot(idx, { subtitle: e.target.value })}
                          placeholder="Supporting narrative..."
                          className="w-full bg-transparent text-lg text-slate-500 resize-none focus:outline-none h-24 font-medium leading-relaxed"
                        />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <section className="space-y-12">
               <div>
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Smartphone className="w-5 h-5 text-white" />
                     </div>
                     <label className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-500">Hardware Targets</label>
                  </div>
                  <div className="space-y-5">
                    {Object.values(DeviceType).map(d => (
                      <button
                        key={d}
                        onClick={() => updateSetting('deviceType', d)}
                        className={`w-full p-8 text-left text-[15px] font-black rounded-[36px] border transition-all flex items-center justify-between ${settings.deviceType === d ? 'border-white bg-white text-slate-900 shadow-2xl' : 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        {d}
                        <div className={`w-3.5 h-3.5 rounded-full ${settings.deviceType === d ? 'bg-slate-900' : 'bg-white/20'}`}></div>
                      </button>
                    ))}
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* Sidebar Footer - Optimized Attribution */}
        <footer className="p-10 pt-8 border-t border-white/5 bg-black/60 space-y-8">
          <div className="flex flex-col gap-5">
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-700">Studio Architect</span>
                  <span className="text-[15px] font-black text-white tracking-tight flex items-center gap-2.5 group">
                    Appu
                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:animate-pulse" />
                  </span>
                </div>
                <Lock className="w-4.5 h-4.5 text-slate-800" />
             </div>
             <p className="text-[10px] text-slate-750 font-bold uppercase tracking-[0.2em] leading-none opacity-40">
               © 2025 Vantage Studio. Build 25.02
             </p>
          </div>
          
          <button 
             onClick={() => setShowPrivacyModal(true)}
             className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-black text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.25em]"
          >
             <ShieldCheck className="w-4 h-4" />
             Privacy Manifesto
          </button>

          <Button 
            variant="custom"
            className={`w-full h-20 text-xl font-black tracking-[0.15em] rounded-[32px] transition-all active:scale-95 uppercase shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-none ${isExporting ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-900 hover:bg-slate-100'}`} 
            onClick={handleExport}
            isLoading={isExporting}
          >
            {isExporting ? 'Synthesizing Bundle...' : <><Download className="w-7 h-7 mr-4 text-slate-900" /> GENERATE BUNDLE</>}
          </Button>
        </footer>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[#0a0a0b]">
        {/* Navigation Bar */}
        <div className="h-32 bg-[#121214]/90 backdrop-blur-3xl border-b border-white/5 px-20 flex items-center justify-between z-10">
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[14px] font-black text-white uppercase tracking-[0.35em] block mb-1.5">PRODUCTION STUDIO</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Realtime 4K High-Fidelity Assets</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 bg-black/50 p-2.5 rounded-[24px] border border-white/5 shadow-2xl">
              {[5, 10].map(n => (
                <button 
                  key={n}
                  onClick={() => handleScreenCountChange(n)}
                  className={`px-10 py-3.5 text-[12px] font-black tracking-widest rounded-2xl transition-all uppercase ${settings.screenCount === n ? 'bg-white text-slate-900 shadow-2xl' : 'text-slate-600 hover:text-slate-300'}`}
                >
                  {n} TILES
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-12">
             <div className="flex items-center gap-6 bg-white/[0.02] p-3 rounded-[32px] border border-white/10 shadow-inner">
                <Button variant="ghost" size="sm" className="h-14 w-14 p-0 text-white rounded-[20px] bg-white/5 hover:bg-white/10" onClick={() => setSelectedScreenIndex(prev => Math.max(0, prev - 1))}>
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <div className="px-8 border-x border-white/10 min-w-[140px] text-center">
                    <span className="text-[18px] font-black text-white tracking-[0.25em] uppercase tabular-nums">{selectedScreenIndex + 1} / {settings.screenCount}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-14 w-14 p-0 text-white rounded-[20px] bg-white/5 hover:bg-white/10" onClick={() => setSelectedScreenIndex(prev => Math.min(settings.screenCount - 1, prev + 1))}>
                  <ChevronRight className="w-8 h-8" />
                </Button>
             </div>
             
             <div className="flex items-center gap-5 bg-white/[0.03] px-8 py-4 rounded-full border border-white/10 shadow-2xl">
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.25em]">Viewport</span>
                <input 
                    type="range" min="0.3" max="0.7" step="0.01"
                    value={zoomScale}
                    onChange={e => setZoomScale(parseFloat(e.target.value))}
                    className="w-36 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
             </div>
          </div>
        </div>

        {/* Studio Floor */}
        <div className="flex-1 p-28 overflow-auto scroll-smooth bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1.8px,transparent_1.8px)] [background-size:60px_60px]">
          <div className="flex gap-48 min-w-max h-full items-start px-32">
            {settings.screenshots.map((screen, idx) => (
              <div 
                key={screen.id} 
                className="relative group pt-24"
                ref={el => { screenRefs.current[idx] = el; }}
              >
                {selectedScreenIndex === idx && (
                    <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-none">
                        <div className="px-12 py-5 bg-white text-slate-900 text-[12px] font-black tracking-[0.45em] rounded-full shadow-[0_40px_80px_rgba(255,255,255,0.25)] animate-pulse uppercase">
                           Studio Focus
                        </div>
                    </div>
                )}
                
                <div 
                    onClick={() => setSelectedScreenIndex(idx)}
                    className={`transition-all duration-[800ms] transform rounded-[64px] cursor-pointer ${selectedScreenIndex === idx ? 'ring-[70px] ring-white/[0.04] scale-[1.12] shadow-[0_150px_300px_rgba(0,0,0,0.85)]' : 'opacity-40 hover:opacity-100 hover:scale-[1.05]'}`}
                >
                  <TemplateRenderer settings={settings} data={screen} scale={zoomScale / 0.33} />
                </div>
                
                <div className="mt-24 flex items-center justify-between px-12 bg-[#121214] py-10 rounded-[56px] border border-white/5 shadow-2xl transition-all group-hover:border-white/20">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[24px] bg-white text-slate-900 flex items-center justify-center text-[24px] font-black shadow-2xl">{idx + 1}</div>
                        <div>
                          <span className="text-[12px] font-black text-slate-700 uppercase tracking-[0.35em] block mb-2">MASTER ASSET</span>
                          <span className="text-xl font-black text-white tracking-tighter italic">{screen.title.length > 20 ? screen.title.substring(0, 18) + '...' : screen.title}</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-16 w-16 p-0 rounded-3xl border border-white/10 text-slate-600 hover:text-white bg-white/5"
                        onClick={() => handleImageUpload(idx)}
                    >
                        <RefreshCw className="w-7 h-7" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export HUD */}
        {isExporting && (
          <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/99 backdrop-blur-3xl animate-in fade-in duration-[1000ms]">
            <div className="w-full max-w-2xl p-20 space-y-16 text-center bg-[#121214] rounded-[100px] border border-white/5 shadow-[0_120px_240px_rgba(0,0,0,0.9)]">
              {exportProgress < 100 ? (
                <div className="space-y-20">
                  <div className="relative mx-auto w-56 h-56 flex items-center justify-center">
                    <div className="absolute inset-0 border-[8px] border-white/5 rounded-full"></div>
                    <div 
                      className="absolute inset-0 border-[8px] border-white rounded-full transition-all duration-500 ease-out" 
                      style={{ 
                        clipPath: `inset(0 0 0 0 round 100%)`, 
                        maskImage: `conic-gradient(white ${exportProgress}%, transparent ${exportProgress}%)`,
                        WebkitMaskImage: `conic-gradient(white ${exportProgress}%, transparent ${exportProgress}%)` 
                      }}
                    ></div>
                    <span className="text-7xl font-black font-outfit text-white tabular-nums tracking-tighter">{exportProgress}%</span>
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-5xl font-black font-outfit uppercase tracking-tighter text-white animate-pulse">{exportStatus}</h3>
                    <p className="text-slate-600 font-bold tracking-[0.6em] uppercase text-[11px]">Deploying Hardware-Accurate Asset Matrices</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-16 animate-in zoom-in-95 duration-700">
                   <div className="w-40 h-40 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-[0_30px_100px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 className="w-20 h-20 text-white" />
                   </div>
                   <div className="space-y-8">
                      <h3 className="text-6xl font-black font-outfit uppercase tracking-tighter text-white">Manifest Built</h3>
                      <p className="text-slate-600 font-bold tracking-[0.4em] uppercase text-sm">Download sequence completed successfully.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Neural Gen Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-[#0a0a0b]/99 backdrop-blur-3xl" onClick={() => setShowAiModal(false)}></div>
          <div className="bg-[#121214] rounded-[80px] w-full max-w-4xl shadow-[0_100px_200px_rgba(0,0,0,1)] z-10 overflow-hidden relative border border-white/15">
            <div className="p-20 bg-gradient-to-br from-white/[0.05] to-transparent text-white relative">
              <div className="inline-flex items-center gap-5 px-8 py-3 bg-white text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[0.5em] mb-14 shadow-2xl">
                 <Zap size={20} className="fill-slate-900" />
                 NEURAL ENGINE v2.5
              </div>
              <h3 className="text-7xl font-black font-outfit mb-10 tracking-tighter leading-[0.85] italic">Synthesize hooks.</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xl text-3xl">
                Convert your vision into conversion-optimized asset narratives.
              </p>
            </div>
            
            <div className="p-20 space-y-16 bg-black/50">
              <div>
                <label className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-700 block mb-8">Narrative Payload</label>
                <textarea 
                  className="w-full h-64 p-12 rounded-[56px] bg-white/[0.03] border border-white/10 focus:border-white/30 focus:outline-none text-2xl leading-relaxed text-white font-medium shadow-inner transition-all placeholder:text-slate-800"
                  placeholder="Describe your core product experience..."
                  value={appDescription}
                  onChange={e => setAppDescription(e.target.value)}
                />
              </div>
              
              <div className="flex gap-8">
                <Button variant="ghost" className="flex-1 h-24 rounded-[40px] font-black border border-white/10 uppercase text-slate-600 hover:text-white text-sm tracking-widest" onClick={() => setShowAiModal(false)}>Terminate Session</Button>
                <Button 
                    variant="custom"
                    className="flex-[2] h-24 rounded-[40px] bg-white text-slate-900 hover:bg-slate-200 font-black text-[16px] tracking-[0.4em] uppercase shadow-2xl" 
                    onClick={handleAiGeneration} 
                    isLoading={isGenerating}
                    disabled={!appDescription}
                >
                  Synthesize Stack
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Manifesto Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-black/99 backdrop-blur-2xl animate-in fade-in duration-700" onClick={() => setShowPrivacyModal(false)}></div>
          <div className="bg-[#121214] w-full max-w-2xl rounded-[72px] border border-white/15 shadow-[0_120px_240px_rgba(0,0,0,1)] z-10 overflow-hidden animate-in zoom-in-95 duration-500">
             <div className="p-20 bg-gradient-to-br from-white/[0.04] to-transparent relative">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="absolute top-12 right-12 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/15 transition-all border border-white/10"
                >
                  <X className="w-8 h-8" />
                </button>
                <div className="flex items-center gap-6 mb-16">
                   <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                   </div>
                   <h3 className="text-5xl font-black font-outfit uppercase tracking-tighter text-white">Privacy Manifesto</h3>
                </div>
                <div className="space-y-16 text-slate-400 font-medium text-xl leading-relaxed">
                   <section className="space-y-6">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-4">
                        <Lock size={16} /> Zero Storage Protocol
                      </h4>
                      <p>Vantage is strictly <span className="text-white font-bold">Local-First</span>. Your screenshots are never transmitted, stored, or indexed on our systems.</p>
                   </section>
                   <section className="space-y-6">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-4">
                        <Smartphone size={16} /> Edge Synthesis
                      </h4>
                      <p>Asset compilation and package compression happen entirely on your hardware. Your data sovereignty is absolute.</p>
                   </section>
                   <section className="space-y-6">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-4">
                        <Sparkles size={16} /> Stateless Neural Loop
                      </h4>
                      <p>AI generation utilizes a secure, stateless bridge. Narrative payloads are processed in-flight and wiped instantly.</p>
                   </section>
                </div>
                <div className="mt-20 pt-12 border-t border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Info className="w-5 h-5 text-slate-800" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-800">Protocols v2.5.0</span>
                   </div>
                   <Button variant="ghost" onClick={() => setShowPrivacyModal(false)} className="text-white font-black text-sm uppercase tracking-[0.4em] hover:bg-white/5 px-10 h-16 rounded-2xl border border-white/10">Acknowledge</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
