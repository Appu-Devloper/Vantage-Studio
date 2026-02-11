
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
      <path 
        d="M20,25 L50,80 L80,25" 
        fill="none" 
        stroke="url(#vantageGrad)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="50" cy="40" r="6" fill="white" className="animate-pulse" />
      <path 
        d="M5,5 L95,5 L95,95 L5,95 Z" 
        fill="none" 
        stroke="white" 
        strokeWidth="1" 
        strokeOpacity="0.1" 
      />
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

      setExportProgress(90);
      setExportStatus('Compressing enterprise bundle...');
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vantage_assets_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExportStatus('Bundle dispatched successfully.');
      
      setTimeout(() => setIsExporting(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Production Error. Check console.');
      setTimeout(() => setIsExporting(false), 5000);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden font-sans text-slate-100">
      {/* Sidebar */}
      <aside className="w-[440px] bg-[#121214] border-r border-white/5 flex flex-col shadow-2xl z-20 overflow-hidden">
        <div className="p-10 pb-8 bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <VantageLogo />
              <div>
                <h1 className="text-2xl font-black tracking-tight font-outfit leading-none flex items-center gap-2">
                  VANTAGE
                  <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </h1>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 block">Enterprise Studio v2.5</span>
              </div>
            </div>
          </div>
          
          <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
            {(['design', 'screens', 'settings'] as const).map(tab => (
                <button 
                  key={tab}
                  className={`flex-1 py-3 text-[11px] font-black tracking-widest transition-all rounded-xl capitalize uppercase ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          {activeTab === 'design' && (
            <>
              <section>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Layers className="w-4 h-4 text-white" />
                   </div>
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Master Layouts</label>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {Object.values(TemplateStyle).map(t => (
                    <button
                      key={t}
                      onClick={() => updateSetting('template', t)}
                      className={`group relative h-36 p-6 rounded-[32px] border transition-all flex flex-col justify-end text-left ${settings.template === t ? 'border-white bg-white text-slate-900 shadow-[0_20px_40px_rgba(255,255,255,0.1)]' : 'border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    >
                      <div className={`absolute top-5 right-5 transition-all duration-500 ${settings.template === t ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                         <Zap className="w-4 h-4 text-slate-900" />
                      </div>
                      <span className={`text-[13px] font-black tracking-tight uppercase ${settings.template === t ? 'text-slate-900' : 'text-slate-400'}`}>{t}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Palette className="w-4 h-4 text-white" />
                   </div>
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Chroma Engine</label>
                </div>
                <div className="grid grid-cols-6 gap-3 mb-8">
                  {COLOR_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        updateSetting('primaryColor', p.primary);
                        updateSetting('secondaryColor', p.secondary);
                      }}
                      className="group h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all hover:scale-125"
                    >
                      <div className="flex h-full w-full rotate-45 scale-150">
                        <div className="flex-1 h-full" style={{ backgroundColor: p.primary }}></div>
                        <div className="flex-1 h-full" style={{ backgroundColor: p.secondary }}></div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-8 bg-black/40 p-8 rounded-[40px] border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Text Contrast</span>
                        <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                             {(['#FFFFFF', '#000000', '#64748b'] as const).map(c => (
                               <button 
                                 key={c}
                                 onClick={() => updateSetting('textColor', c)}
                                 className={`w-8 h-8 rounded-full border border-white/10 transition-all ${settings.textColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121214]' : 'opacity-50 hover:opacity-100'}`}
                                 style={{ backgroundColor: c }}
                               />
                             ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware Finish</span>
                        <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                             {(['Titanium', 'Space Black', 'Silver'] as const).map(f => (
                               <button 
                                 key={f}
                                 onClick={() => updateSetting('deviceFinish', f)}
                                 className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${settings.deviceFinish === f ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
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
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Layout className="w-4 h-4 text-white" />
                   </div>
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Asset Stack</label>
                </div>
                <Button variant="ghost" size="sm" className="h-10 gap-2 rounded-2xl border border-white/10 px-5 text-white hover:bg-white/10" onClick={() => setShowAiModal(true)}>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    NEURAL GEN
                </Button>
              </div>
              
              <div className="space-y-6">
                {settings.screenshots.map((screen, idx) => (
                  <div 
                    key={screen.id} 
                    className={`group p-8 rounded-[40px] border transition-all cursor-pointer ${selectedScreenIndex === idx ? 'border-white bg-white/[0.03] shadow-2xl' : 'border-white/5 bg-black/20'}`}
                    onClick={() => setSelectedScreenIndex(idx)}
                  >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <span className="text-[13px] font-black w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg">{idx + 1}</span>
                           <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Screen Metadata</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl bg-white/5" onClick={() => handleImageUpload(idx)}>
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        <input 
                          value={screen.title} 
                          onChange={e => updateScreenshot(idx, { title: e.target.value })}
                          placeholder="Primary Hook Heading"
                          className="w-full bg-transparent font-black text-2xl tracking-tighter focus:outline-none text-white border-b border-white/5 pb-2"
                        />
                        <textarea 
                          value={screen.subtitle} 
                          onChange={e => updateScreenshot(idx, { subtitle: e.target.value })}
                          placeholder="Secondary conversion subtext..."
                          className="w-full bg-transparent text-base text-slate-500 resize-none focus:outline-none h-24"
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
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <Smartphone className="w-4 h-4 text-white" />
                     </div>
                     <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Hardware Targets</label>
                  </div>
                  <div className="space-y-4">
                    {Object.values(DeviceType).map(d => (
                      <button
                        key={d}
                        onClick={() => updateSetting('deviceType', d)}
                        className={`w-full p-6 text-left text-sm font-black rounded-[32px] border transition-all flex items-center justify-between ${settings.deviceType === d ? 'border-white bg-white text-slate-900 shadow-2xl' : 'border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        {d}
                        <div className={`w-3 h-3 rounded-full ${settings.deviceType === d ? 'bg-slate-900' : 'bg-white/20'}`}></div>
                      </button>
                    ))}
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* Sidebar Footer - Appu Branding */}
        <footer className="p-10 pt-6 border-t border-white/5 bg-black/40 space-y-6">
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Architected By</span>
                  <span className="text-[13px] font-black text-white tracking-tight flex items-center gap-2">
                    Appu Studio
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  </span>
                </div>
                <Lock className="w-4 h-4 text-slate-800" />
             </div>
             <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest leading-none">
               © 2025 Vantage Studio. All rights reserved.
             </p>
          </div>
          
          <div className="flex gap-2">
            <button 
               onClick={() => setShowPrivacyModal(true)}
               className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
            >
               <ShieldCheck className="w-3.5 h-3.5" />
               Privacy Policy
            </button>
          </div>

          <Button 
            variant="custom"
            className={`w-full h-18 text-lg font-black tracking-widest rounded-[28px] transition-all active:scale-95 uppercase shadow-2xl border-none ${isExporting ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-900 hover:bg-slate-100'}`} 
            onClick={handleExport}
            isLoading={isExporting}
          >
            {isExporting ? 'Generating Bundle...' : <><Download className="w-6 h-6 mr-3 text-slate-900" /> PACK & EXPORT</>}
          </Button>
        </footer>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[#0a0a0b]">
        {/* Top Navigation Bar */}
        <div className="h-28 bg-[#121214]/80 backdrop-blur-3xl border-b border-white/5 px-16 flex items-center justify-between z-10">
          <div className="flex items-center gap-14">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-[18px] flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[13px] font-black text-white uppercase tracking-[0.3em] block mb-1">LIVE VIEWPORT</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Pixel-Perfect Realtime Previews</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
              {[5, 10].map(n => (
                <button 
                  key={n}
                  onClick={() => handleScreenCountChange(n)}
                  className={`px-8 py-3 text-[11px] font-black tracking-widest rounded-xl transition-all uppercase ${settings.screenCount === n ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {n} SCREENS
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-5 bg-white/[0.02] p-2.5 rounded-[24px] border border-white/5 shadow-inner">
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-white rounded-2xl" onClick={() => setSelectedScreenIndex(prev => Math.max(0, prev - 1))}>
                  <ChevronLeft className="w-7 h-7" />
                </Button>
                <div className="px-6 border-x border-white/5 min-w-[120px] text-center">
                    <span className="text-[16px] font-black text-white tracking-[0.2em] uppercase tabular-nums">{selectedScreenIndex + 1} / {settings.screenCount}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-white rounded-2xl" onClick={() => setSelectedScreenIndex(prev => Math.min(settings.screenCount - 1, prev + 1))}>
                  <ChevronRight className="w-7 h-7" />
                </Button>
             </div>
             
             <div className="h-12 w-px bg-white/10"></div>

             <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-3 rounded-full border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scaling</span>
                <input 
                    type="range" min="0.3" max="0.7" step="0.01"
                    value={zoomScale}
                    onChange={e => setZoomScale(parseFloat(e.target.value))}
                    className="w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
             </div>
          </div>
        </div>

        {/* Studio Canvas */}
        <div className="flex-1 p-24 overflow-auto scroll-smooth bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] [background-size:48px_48px]">
          <div className="flex gap-40 min-w-max h-full items-start px-20">
            {settings.screenshots.map((screen, idx) => (
              <div 
                key={screen.id} 
                className="relative group pt-20"
                ref={el => { screenRefs.current[idx] = el; }}
              >
                {selectedScreenIndex === idx && (
                    <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-none">
                        <div className="px-10 py-4 bg-white text-slate-900 text-[11px] font-black tracking-[0.4em] rounded-full shadow-[0_30px_60px_rgba(255,255,255,0.2)] animate-pulse-slow uppercase">
                           Active Asset
                        </div>
                    </div>
                )}
                
                <div 
                    onClick={() => setSelectedScreenIndex(idx)}
                    className={`transition-all duration-700 transform rounded-[56px] cursor-pointer ${selectedScreenIndex === idx ? 'ring-[60px] ring-white/[0.04] scale-[1.1] shadow-[0_120px_240px_rgba(0,0,0,0.6)]' : 'opacity-40 hover:opacity-100 hover:scale-[1.05]'}`}
                >
                  <TemplateRenderer settings={settings} data={screen} scale={zoomScale / 0.33} />
                </div>
                
                <div className="mt-20 flex items-center justify-between px-10 bg-[#121214] py-8 rounded-[48px] border border-white/5 shadow-2xl group-hover:border-white/20 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[22px] bg-white text-slate-900 flex items-center justify-center text-[20px] font-black shadow-xl">{idx + 1}</div>
                        <div>
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] block mb-1">SCREEN HOOK</span>
                          <span className="text-lg font-black text-white tracking-tighter">{screen.title.length > 20 ? screen.title.substring(0, 18) + '...' : screen.title}</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-14 w-14 p-0 rounded-[20px] border border-white/5 text-slate-500 hover:text-white"
                        onClick={() => handleImageUpload(idx)}
                    >
                        <RefreshCw className="w-6 h-6" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Modal Overlay */}
        {isExporting && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-700">
            <div className="w-full max-w-xl p-16 space-y-16 text-center bg-[#121214] rounded-[80px] border border-white/5 shadow-[0_100px_200px_rgba(0,0,0,0.8)]">
              {exportProgress < 100 ? (
                <div className="space-y-16">
                  <div className="relative mx-auto w-44 h-44 flex items-center justify-center">
                    <div className="absolute inset-0 border-[6px] border-white/5 rounded-full"></div>
                    <div 
                      className="absolute inset-0 border-[6px] border-white rounded-full transition-all duration-300 ease-out" 
                      style={{ 
                        clipPath: `inset(0 0 0 0 round 100%)`, 
                        maskImage: `conic-gradient(white ${exportProgress}%, transparent ${exportProgress}%)`,
                        WebkitMaskImage: `conic-gradient(white ${exportProgress}%, transparent ${exportProgress}%)` 
                      }}
                    ></div>
                    <span className="text-6xl font-black font-outfit text-white tabular-nums">{exportProgress}%</span>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-4xl font-black font-outfit uppercase tracking-tighter text-white animate-pulse">{exportStatus}</h3>
                    <p className="text-slate-500 font-bold tracking-[0.5em] uppercase text-[10px]">Compiling Enterprise Asset Package</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in zoom-in-95 duration-500">
                   <div className="w-32 h-32 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-[0_20px_80px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-16 h-16 text-white" />
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-5xl font-black font-outfit uppercase tracking-tighter text-white">Production Ready</h3>
                      <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">The ZIP bundle has been dispatched.</p>
                   </div>
                   <div className="pt-8">
                      <div className="inline-flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full text-white text-[12px] font-black uppercase tracking-[0.3em]">
                         <FileDown className="w-6 h-6 text-emerald-400" />
                         vantage_export.zip
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* AI Content Engine Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-[#0a0a0b]/98 backdrop-blur-3xl" onClick={() => setShowAiModal(false)}></div>
          <div className="bg-[#121214] rounded-[64px] w-full max-w-3xl shadow-[0_80px_160px_rgba(0,0,0,0.8)] z-10 overflow-hidden relative border border-white/10">
            <div className="p-16 bg-gradient-to-br from-white/[0.04] to-transparent text-white relative">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-[0.4em] mb-12">
                 <Zap className="w-5 h-5 fill-slate-900" />
                 VANTAGE NEURAL ENGINE v4.2
              </div>
              <h3 className="text-6xl font-black font-outfit mb-8 tracking-tighter leading-[0.9]">Synthesize Core Narrative.</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-lg text-2xl">
                Transform feature descriptions into high-conversion copywriting hooks.
              </p>
            </div>
            
            <div className="p-16 space-y-12 bg-black/40">
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 block mb-6">Product Narrative</label>
                <textarea 
                  className="w-full h-56 p-10 rounded-[48px] bg-white/[0.02] border border-white/5 focus:border-white/20 focus:outline-none text-xl leading-relaxed text-white font-medium shadow-inner transition-all"
                  placeholder="Describe your app's unique value proposition..."
                  value={appDescription}
                  onChange={e => setAppDescription(e.target.value)}
                />
              </div>
              
              <div className="flex gap-6">
                <Button variant="ghost" className="flex-1 h-20 rounded-[30px] font-black border border-white/5 uppercase text-slate-500 hover:text-white" onClick={() => setShowAiModal(false)}>Cancel Session</Button>
                <Button 
                    variant="custom"
                    className="flex-[2] h-20 rounded-[30px] bg-white text-slate-900 hover:bg-slate-200 font-black text-[14px] tracking-[0.3em] uppercase shadow-2xl" 
                    onClick={handleAiGeneration} 
                    isLoading={isGenerating}
                    disabled={!appDescription}
                >
                  Synthesize {settings.screenCount} Hooks
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Manifesto Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setShowPrivacyModal(false)}></div>
          <div className="bg-[#121214] w-full max-w-2xl rounded-[60px] border border-white/10 shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-16 bg-gradient-to-br from-white/[0.03] to-transparent relative">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                      <ShieldCheck className="w-7 h-7 text-emerald-500" />
                   </div>
                   <h3 className="text-4xl font-black font-outfit uppercase tracking-tighter text-white">Privacy Manifesto</h3>
                </div>
                <div className="space-y-12 text-slate-400 font-medium text-lg leading-relaxed">
                   <section className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                        <Lock className="w-3.5 h-3.5" /> Zero Data Retention
                      </h4>
                      <p>Vantage Studio is built on a <span className="text-white font-bold">Local-First</span> architecture. Your high-res app screenshots are never uploaded, stored, or indexed on any external cloud server.</p>
                   </section>
                   <section className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                        <Smartphone className="w-3.5 h-3.5" /> Edge Processing
                      </h4>
                      <p>Asset compilation, image synthesizing, and package compression happen exclusively on your device. Your creativity remains your property.</p>
                   </section>
                   <section className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                        <Sparkles className="w-3.5 h-3.5" /> Secure AI Bridge
                      </h4>
                      <p>Neural generation uses a secure, stateless handshake with Google Gemini. Inputs are processed in-flight and are not persisted.</p>
                   </section>
                </div>
                <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-slate-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Protocols v2.5.0-Release</span>
                   </div>
                   <Button variant="ghost" onClick={() => setShowPrivacyModal(false)} className="text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 px-8 h-14 rounded-2xl border border-white/5">I Understand</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
