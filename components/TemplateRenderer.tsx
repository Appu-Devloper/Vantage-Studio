
import React from 'react';
import { TemplateStyle, ScreenshotData, AppSettings } from '../types';
import { DeviceFrame } from './DeviceFrame';

interface TemplateRendererProps {
  settings: AppSettings;
  data: ScreenshotData;
  scale?: number;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ settings, data, scale = 1 }) => {
  const { template, primaryColor, secondaryColor, textColor, deviceType, gradientAngle, deviceFinish } = settings;
  const { title, subtitle, imageUrl } = data;

  const bgStyle = {
    background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`,
    color: textColor,
  };

  const textShadowStyle = {
    textShadow: textColor === '#FFFFFF' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
  };

  const renderContent = () => {
    switch (template) {
      case TemplateStyle.CLASSIC:
        return (
          <div className="h-full w-full flex flex-col items-center p-12 text-center relative overflow-hidden" style={bgStyle}>
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="z-20 mt-8 mb-12">
              <h2 className="text-[52px] leading-[1] font-black font-outfit mb-5 tracking-tighter drop-shadow-2xl" style={textShadowStyle}>{title}</h2>
              <p className="text-[22px] opacity-80 max-w-[360px] mx-auto font-medium leading-tight">{subtitle}</p>
            </div>
            
            <div className="flex-1 w-full max-w-[82%] relative z-10 flex items-end">
               <div className="absolute bottom-0 inset-x-0 h-10 bg-black/50 blur-[50px] rounded-full scale-75 translate-y-8"></div>
               <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full transform transition-transform duration-1000">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
               </DeviceFrame>
            </div>
          </div>
        );

      case TemplateStyle.BENTO:
        return (
          <div className="h-full w-full flex flex-col p-8 overflow-hidden relative justify-between" style={bgStyle}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            
            <div className="flex-1 w-full flex items-center justify-center p-6 relative">
                <div className="w-[85%] relative group">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-2xl">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                    <div className="absolute -inset-8 bg-white/5 blur-3xl rounded-[80px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            <div className="backdrop-blur-3xl rounded-[48px] p-12 border border-white/10 shadow-2xl relative z-10 mb-2 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[48px]"></div>
                <h2 className="text-[38px] font-black font-outfit leading-[1.1] tracking-tight mb-5" style={textShadowStyle}>{title}</h2>
                <p className="text-[20px] font-semibold opacity-70 leading-snug">{subtitle}</p>
            </div>
          </div>
        );

      case TemplateStyle.FLOATING_DUO:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-12 overflow-hidden" style={bgStyle}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            <div className="text-center mb-16 z-20">
               <h2 className="text-[44px] font-black font-outfit leading-none mb-4 tracking-tighter uppercase" style={textShadowStyle}>{title}</h2>
               <div className="h-2 w-20 bg-white/30 mx-auto rounded-full mb-8"></div>
               <p className="text-[21px] font-bold opacity-80 max-w-[320px] leading-tight mx-auto">{subtitle}</p>
            </div>
            
            <div className="relative w-full h-[58%] flex justify-center items-center scale-110">
                <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-[68%] absolute -translate-x-20 translate-y-20 rotate-[-12deg] z-10 opacity-30 scale-90">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                </DeviceFrame>
                <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-[68%] absolute translate-x-8 rotate-[10deg] z-20 shadow-[0_50px_120px_rgba(0,0,0,0.7)]">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                </DeviceFrame>
            </div>
          </div>
        );

      case TemplateStyle.ISOMETRIC:
        return (
          <div className="h-full w-full flex flex-col p-12 overflow-hidden" style={bgStyle}>
            <div className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] bg-white/10 blur-[180px] rounded-full"></div>
            
            <div className="mt-8 mb-16 relative z-10">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_white]"></div>
               </div>
               <h2 className="text-[58px] font-black font-outfit leading-[0.85] tracking-tighter italic mb-8 uppercase" style={textShadowStyle}>{title}</h2>
               <p className="text-[24px] font-bold opacity-75 leading-tight tracking-tight">{subtitle}</p>
            </div>
            
            <div className="flex-1 relative perspective-[3500px] flex justify-center items-center scale-[1.15]">
                <div className="w-[82%] transform rotate-x-[52deg] rotate-z-[-32deg] translate-y-12 transition-transform duration-1000 group-hover:scale-105">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-[80px_80px_160px_rgba(0,0,0,0.8)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>
            </div>
          </div>
        );

      case TemplateStyle.EDITORIAL:
        return (
          <div className="h-full w-full flex flex-col bg-white p-0 overflow-hidden text-slate-900">
             <div className="h-[50%] w-full relative group" style={bgStyle}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-[-22%] left-12 w-[72%] z-20">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full border-white border-[10px] shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>
             </div>
             <div className="flex-1 p-16 flex flex-col justify-end items-start text-left bg-white">
                <h2 className="text-[64px] font-black font-outfit leading-[0.8] tracking-tighter mb-8 text-slate-900 uppercase italic">{title}</h2>
                <div className="w-24 h-2.5 bg-slate-900 mb-8 rounded-full"></div>
                <p className="text-[26px] font-bold text-slate-500 leading-tight max-w-[320px]">{subtitle}</p>
             </div>
          </div>
        );

      case TemplateStyle.MINIMAL_LUXE:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-16" style={bgStyle}>
             <div className="w-full h-full border-[3px] border-white/10 rounded-[64px] p-12 flex flex-col items-center justify-between shadow-inner relative">
                <div className="absolute inset-x-20 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                
                <div className="text-center w-full mt-8 z-10">
                    <h2 className="text-[44px] font-black font-outfit leading-tight mb-5 tracking-tight uppercase" style={textShadowStyle}>{title}</h2>
                    <p className="text-[19px] font-bold opacity-60 tracking-[0.25em] uppercase">{subtitle}</p>
                </div>
                
                <div className="relative w-[85%] transition-transform duration-1000 group-hover:scale-105">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-[0_60px_120px_rgba(0,0,0,0.5)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>

                <div className="w-16 h-2 bg-white/20 rounded-full mb-6"></div>
             </div>
          </div>
        );

      case TemplateStyle.DYNAMIC_BREAK:
        return (
          <div className="h-full w-full flex flex-col items-center p-14 relative overflow-hidden" style={bgStyle}>
             <div className="absolute top-0 left-0 w-full h-[58%] bg-black/15 backdrop-blur-3xl z-0 rounded-b-[120px] border-b border-white/5"></div>
             
             <div className="z-10 mt-8 text-center mb-12">
                <h2 className="text-[56px] font-black font-outfit leading-[0.95] mb-8 tracking-tighter drop-shadow-2xl uppercase" style={textShadowStyle}>{title}</h2>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 rounded-full border border-white/20 shadow-xl">
                   <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                   <span className="text-[15px] font-black tracking-widest uppercase opacity-90" style={{ color: textColor }}>{subtitle}</span>
                </div>
             </div>
             
             <div className="flex-1 w-full flex items-center justify-center relative scale-110 translate-y-16">
                <div className="relative w-[85%] z-20 group transition-all duration-700 hover:scale-110">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-[0_120px_240px_rgba(0,0,0,0.8)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                    <div className="absolute -top-14 -right-14 w-32 h-32 bg-white text-slate-900 rounded-full flex items-center justify-center text-6xl shadow-2xl z-30 font-black border-[5px] border-slate-900 animate-bounce">
                       ★
                    </div>
                </div>
             </div>
          </div>
        );

      default:
        return <div style={bgStyle}>Template Error</div>;
    }
  };

  return (
    <div 
      className="screenshot-canvas shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] relative overflow-hidden rounded-[56px] transition-all duration-500 group" 
      style={{ 
        width: 1242 / 3,
        height: 2208 / 3,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};
