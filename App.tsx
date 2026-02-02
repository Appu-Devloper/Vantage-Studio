
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
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
  Type as TypeIcon,
  Crown
} from 'lucide-react';
import { DeviceType, TemplateStyle, AppSettings, ScreenshotData } from './types';
import { DEVICE_CONFIGS, INITIAL_SCREENSHOTS, COLOR_PRESETS } from './constants';
import { Button } from './components/ui/Button';
import { TemplateRenderer } from './components/TemplateRenderer';
import { generateMarketingCopy } from './services/geminiService';

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
  const [appDescription, setAppDescription] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(0.4);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleScreenCountChange = (count: number) => {
    const newCount = Math.min(10, Math.max(1, count));
    const newScreens = Array.from({ length: 10 }, (_, i) => settings.screenshots[i] || INITIAL_SCREENSHOTS[i]);
    updateSetting('screenCount', newCount);
    updateSetting('screenshots', newScreens.slice(0, newCount));
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

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden font-sans text-slate-100">
      {/* Sidebar - Vantage Pro Dark */}
      <aside className="w-[440px] bg-[#121214] border-r border-white/5 flex flex-col shadow-2xl z-20 overflow-hidden">
        <div className="p-10 pb-8 bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-slate-900 rounded-[18px] shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Smartphone className="w-7 h-7" />
              </div>
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
                  className={`flex-1 py-3 text-[11px] font-black tracking-widest transition-all rounded-xl capitalize uppercase ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl scale-100' : 'text-slate-500 hover:text-slate-300'}`}
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
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Gradient Flow</span>
                            <span className="text-white">{settings.gradientAngle}°</span>
                        </div>
                        <input 
                            type="range" min="0" max="360" step="1" 
                            value={settings.gradientAngle}
                            onChange={e => updateSetting('gradientAngle', parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                        />
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
                    className={`group p-8 rounded-[40px] border transition-all cursor-pointer ${selectedScreenIndex === idx ? 'border-white bg-white/[0.03] shadow-2xl scale-[1.02]' : 'border-white/5 hover:border-white/20 bg-black/20'}`}
                    onClick={() => setSelectedScreenIndex(idx)}
                  >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <span className="text-[13px] font-black w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg">{idx + 1}</span>
                           <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Screen Metadata</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl bg-white/5 hover:bg-white/10" onClick={() => handleImageUpload(idx)}>
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        <input 
                          value={screen.title} 
                          onChange={e => updateScreenshot(idx, { title: e.target.value })}
                          placeholder="Primary Hook Heading"
                          className="w-full bg-transparent font-black text-2xl tracking-tighter focus:outline-none placeholder:text-slate-800 text-white border-b border-white/5 pb-2 focus:border-white/20 transition-all"
                        />
                        <textarea 
                          value={screen.subtitle} 
                          onChange={e => updateScreenshot(idx, { subtitle: e.target.value })}
                          placeholder="Secondary conversion subtext..."
                          className="w-full bg-transparent text-base text-slate-500 resize-none focus:outline-none h-24 placeholder:text-slate-800 leading-relaxed font-medium"
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
                        className={`w-full p-6 text-left text-sm font-black rounded-[32px] border transition-all flex items-center justify-between ${settings.deviceType === d ? 'border-white bg-white text-slate-900 shadow-2xl' : 'border-white/5 hover:border-white/20 text-slate-400 hover:text-white'}`}
                      >
                        {d}
                        <div className={`w-3 h-3 rounded-full ${settings.deviceType === d ? 'bg-slate-900 scale-125' : 'bg-white/20'} transition-all`}></div>
                      </button>
                    ))}
                  </div>
               </div>
            </section>
          )}
        </div>

        <div className="p-10 border-t border-white/5 bg-black/40">
          <Button className="w-full h-18 text-lg font-black tracking-widest rounded-[28px] bg-white text-slate-900 hover:bg-slate-200 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all active:scale-95 uppercase" onClick={() => alert("Packaging All Assets in Ultra-HD PNG Formats...")}>
            <Download className="w-6 h-6 mr-3" />
            PACK & EXPORT
          </Button>
        </div>
      </aside>

      {/* Main Studio Viewport */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[#0a0a0b]">
        <div className="h-28 bg-[#121214]/80 backdrop-blur-3xl border-b border-white/5 px-16 flex items-center justify-between z-10">
          <div className="flex items-center gap-14">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-[18px] flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[13px] font-black text-white uppercase tracking-[0.3em] block mb-1">VANTAGE STUDIO</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Pixel Accurate Realtime Engine</span>
              </div>
            </div>
            
            <div className="h-12 w-px bg-white/5"></div>
            
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
              {[5, 10].map(n => (
                <button 
                  key={n}
                  onClick={() => handleScreenCountChange(n)}
                  className={`px-8 py-3 text-[11px] font-black tracking-widest rounded-xl transition-all uppercase ${settings.screenCount === n ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {n} TILES
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-5 bg-white/[0.02] p-2.5 rounded-[24px] border border-white/5 shadow-inner">
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-white/5 rounded-2xl text-white" onClick={() => setSelectedScreenIndex(prev => Math.max(0, prev - 1))}>
                  <ChevronLeft className="w-7 h-7" />
                </Button>
                <div className="px-6 border-x border-white/5 min-w-[120px] text-center">
                    <span className="text-[16px] font-black text-white tracking-widest uppercase">{selectedScreenIndex + 1} / {settings.screenCount}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-white/5 rounded-2xl text-white" onClick={() => setSelectedScreenIndex(prev => Math.min(settings.screenCount - 1, prev + 1))}>
                  <ChevronRight className="w-7 h-7" />
                </Button>
             </div>
             
             <div className="flex items-center gap-5 bg-white/[0.02] px-8 py-3 rounded-[24px] border border-white/5">
                <span className="text-[11px] font-black text-slate-500 tracking-widest uppercase">ZOOM</span>
                <input 
                    type="range" min="0.3" max="0.8" step="0.01"
                    value={zoomScale}
                    onChange={e => setZoomScale(parseFloat(e.target.value))}
                    className="w-40 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
                <span className="text-[12px] font-black text-white min-w-[50px]">{Math.round(zoomScale * 250)}%</span>
             </div>
          </div>
        </div>

        <div className="flex-1 p-24 overflow-auto scroll-smooth bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] [background-size:48px_48px]">
          <div className="flex gap-32 min-w-max h-full items-start px-20">
            {settings.screenshots.map((screen, idx) => (
              <div 
                key={screen.id} 
                className="relative group pt-20"
              >
                {selectedScreenIndex === idx && (
                    <div className="absolute top-0 left-0 w-full flex justify-center z-30">
                        <div className="px-10 py-4 bg-white text-slate-900 text-[11px] font-black tracking-[0.4em] rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.2)] animate-pulse uppercase">
                           Studio Focal Point
                        </div>
                    </div>
                )}
                
                <div 
                    onClick={() => setSelectedScreenIndex(idx)}
                    className={`transition-all duration-700 transform rounded-[56px] cursor-pointer ${selectedScreenIndex === idx ? 'ring-[48px] ring-white/[0.03] scale-[1.1] shadow-[0_100px_200px_rgba(0,0,0,0.5)]' : 'hover:scale-[1.05] opacity-40 hover:opacity-100 hover:shadow-2xl'}`}
                >
                  <TemplateRenderer settings={settings} data={screen} scale={zoomScale / 0.33} />
                </div>
                
                <div className="mt-16 flex items-center justify-between px-10 bg-white/[0.03] py-8 rounded-[48px] border border-white/5 shadow-2xl transition-all group-hover:border-white/20">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[24px] bg-white text-slate-900 flex items-center justify-center text-[20px] font-black shadow-xl">{idx + 1}</div>
                        <div>
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] block mb-1">HOOK</span>
                          <span className="text-lg font-black text-white tracking-tighter">{screen.title.substring(0, 20)}...</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-14 w-14 p-0 rounded-[20px] border border-white/5 text-slate-500 hover:text-white hover:bg-white/10"
                        onClick={() => handleImageUpload(idx)}
                    >
                        <RefreshCw className="w-6 h-6" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Modal - Pro Design */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-2xl" onClick={() => setShowAiModal(false)}></div>
          <div className="bg-[#121214] rounded-[60px] w-full max-w-3xl shadow-[0_100px_200px_rgba(0,0,0,0.8)] z-10 overflow-hidden relative border border-white/5">
            <div className="p-16 bg-gradient-to-br from-white/[0.05] to-transparent text-white relative">
              <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none scale-[2]">
                <Sparkles className="w-64 h-64" />
              </div>
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl">
                 <Zap className="w-5 h-5 fill-slate-900" />
                 NEURAL ENGINE v4
              </div>
              <h3 className="text-6xl font-black font-outfit mb-8 tracking-tighter leading-[0.9]">Transform Narrative into Hook.</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-lg text-2xl">
                Our neural language model synthesizes your core product values into high-conversion copy.
              </p>
            </div>
            
            <div className="p-16 space-y-12 bg-black/40">
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 block mb-6">Product Core Narrative</label>
                <textarea 
                  className="w-full h-56 p-10 rounded-[48px] bg-white/[0.02] border border-white/5 focus:ring-[20px] focus:ring-white/[0.02] focus:border-white/20 focus:outline-none text-xl leading-relaxed placeholder:text-slate-800 text-white font-medium transition-all shadow-inner"
                  placeholder="Describe your app's unique advantage..."
                  value={appDescription}
                  onChange={e => setAppDescription(e.target.value)}
                />
              </div>
              
              <div className="flex gap-8">
                <Button variant="ghost" className="flex-1 h-20 rounded-[32px] font-black border border-white/5 text-[13px] tracking-widest uppercase text-slate-500 hover:text-white" onClick={() => setShowAiModal(false)}>Cancel Session</Button>
                <Button 
                    className="flex-[2] h-20 rounded-[32px] bg-white text-slate-900 hover:bg-slate-200 font-black text-[14px] tracking-[0.2em] shadow-2xl shadow-white/10 uppercase" 
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
    </div>
  );
};

export default App;
