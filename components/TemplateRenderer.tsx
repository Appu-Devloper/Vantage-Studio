
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

  const renderContent = () => {
    switch (template) {
      case TemplateStyle.CLASSIC:
        return (
          <div className="h-full w-full flex flex-col items-center p-12 text-center relative overflow-hidden" style={bgStyle}>
            {/* Atmosphere Light */}
            <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="z-20 mt-8 mb-10">
              <h2 className="text-[48px] leading-[1.05] font-black font-outfit mb-4 tracking-tighter drop-shadow-2xl">{title}</h2>
              <p className="text-[21px] opacity-80 max-w-[340px] mx-auto font-medium leading-relaxed">{subtitle}</p>
            </div>
            
            <div className="flex-1 w-full max-w-[80%] relative z-10 flex items-end">
               <div className="absolute bottom-0 inset-x-0 h-10 bg-black/40 blur-3xl rounded-full scale-75 translate-y-6"></div>
               <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-full transform transition-transform duration-1000 group-hover:translate-y-[-10px]">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
               </DeviceFrame>
            </div>
          </div>
        );

      case TemplateStyle.BENTO:
        return (
          <div className="h-full w-full flex flex-col p-8 overflow-hidden relative justify-between" style={bgStyle}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            
            <div className="flex-1 w-full flex items-center justify-center p-6 relative">
                <div className="w-[82%] relative group">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-full">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                    <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-[60px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] p-10 border border-white/10 shadow-2xl relative z-10 mb-2">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[40px]"></div>
                <h2 className="text-[36px] font-black font-outfit leading-[1.1] tracking-tight mb-4">{title}</h2>
                <p className="text-[18px] font-semibold opacity-70 leading-relaxed">{subtitle}</p>
            </div>
          </div>
        );

      case TemplateStyle.FLOATING_DUO:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-12 overflow-hidden" style={bgStyle}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            <div className="text-center mb-16 z-20">
               <h2 className="text-[42px] font-black font-outfit leading-none mb-4 tracking-tighter uppercase">{title}</h2>
               <div className="h-1.5 w-16 bg-white/30 mx-auto rounded-full mb-6"></div>
               <p className="text-[19px] font-bold opacity-80 max-w-[300px] leading-tight">{subtitle}</p>
            </div>
            
            <div className="relative w-full h-[55%] flex justify-center items-center scale-110">
                <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-[65%] absolute -translate-x-16 translate-y-16 rotate-[-10deg] z-10 opacity-40 scale-95">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                </DeviceFrame>
                <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-[65%] absolute translate-x-6 rotate-[8deg] z-20 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                </DeviceFrame>
            </div>
          </div>
        );

      case TemplateStyle.ISOMETRIC:
        return (
          <div className="h-full w-full flex flex-col p-12 overflow-hidden" style={bgStyle}>
            <div className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] bg-white/10 blur-[150px] rounded-full"></div>
            
            <div className="mt-8 mb-12 relative z-10">
               <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white]"></div>
               </div>
               <h2 className="text-[52px] font-black font-outfit leading-[0.9] tracking-tighter italic mb-6 uppercase">{title}</h2>
               <p className="text-[21px] font-bold opacity-70 leading-snug tracking-tight">{subtitle}</p>
            </div>
            
            <div className="flex-1 relative perspective-[3000px] flex justify-center items-center scale-110">
                <div className="w-[78%] transform rotate-x-[50deg] rotate-z-[-30deg] translate-y-8 transition-transform duration-1000 group-hover:translate-y-0 group-hover:scale-105">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-full shadow-[60px_60px_120px_rgba(0,0,0,0.7)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                    <div className="absolute -bottom-16 -left-16 w-full h-full bg-black/20 rounded-[80px] -z-10 blur-2xl"></div>
                </div>
            </div>
          </div>
        );

      case TemplateStyle.EDITORIAL:
        return (
          <div className="h-full w-full flex flex-col bg-white p-0 overflow-hidden text-slate-900">
             <div className="h-[48%] w-full relative group" style={bgStyle}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-[-18%] left-10 w-[68%] z-20">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-full border-white border-[8px] shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>
             </div>
             <div className="flex-1 p-14 flex flex-col justify-end items-start text-left bg-white">
                <h2 className="text-[58px] font-black font-outfit leading-[0.85] tracking-tighter mb-6 text-slate-900 uppercase italic drop-shadow-sm">{title}</h2>
                <div className="w-20 h-2 bg-slate-900 mb-6 rounded-full"></div>
                <p className="text-[23px] font-semibold text-slate-500 leading-tight max-w-[280px]">{subtitle}</p>
             </div>
          </div>
        );

      case TemplateStyle.MINIMAL_LUXE:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-14" style={bgStyle}>
             <div className="w-full h-full border-2 border-white/10 rounded-[56px] p-10 flex flex-col items-center justify-between shadow-inner relative">
                <div className="absolute inset-x-12 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                
                <div className="text-center w-full mt-6 z-10">
                    <h2 className="text-[40px] font-black font-outfit leading-tight mb-4 tracking-tight uppercase">{title}</h2>
                    <p className="text-[17px] font-bold opacity-60 tracking-[0.2em] uppercase">{subtitle}</p>
                </div>
                
                <div className="relative w-[80%] transition-transform duration-1000 group-hover:scale-105">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-full shadow-2xl">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-[40px] pointer-events-none"></div>
                </div>

                <div className="w-12 h-1.5 bg-white/20 rounded-full mb-4"></div>
             </div>
          </div>
        );

      case TemplateStyle.DYNAMIC_BREAK:
        return (
          <div className="h-full w-full flex flex-col items-center p-12 relative overflow-hidden" style={bgStyle}>
             <div className="absolute top-0 left-0 w-full h-[55%] bg-black/10 backdrop-blur-3xl z-0 rounded-b-[100px] border-b border-white/5"></div>
             
             <div className="z-10 mt-8 text-center mb-8">
                <h2 className="text-[50px] font-black font-outfit leading-[1] mb-6 tracking-tighter drop-shadow-2xl uppercase">{title}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20">
                   <div className="w-2 h-2 rounded-full bg-green-400"></div>
                   <span className="text-[14px] font-black tracking-widest uppercase opacity-80">{subtitle}</span>
                </div>
             </div>
             
             <div className="flex-1 w-full flex items-center justify-center relative scale-110 translate-y-12">
                <div className="relative w-[82%] z-20 group transition-all duration-700 hover:scale-110">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} className="w-full shadow-[0_100px_200px_rgba(0,0,0,0.7)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-white text-slate-900 rounded-full flex items-center justify-center text-5xl shadow-2xl z-30 font-black border-4 border-slate-900 animate-pulse">
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
      className="screenshot-canvas shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-[48px] transition-all duration-500 group" 
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
