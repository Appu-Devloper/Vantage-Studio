
import React from 'react';
import { TemplateStyle, ScreenshotData, AppSettings, DeviceType } from '../types';
import { DeviceFrame } from './DeviceFrame';

interface TemplateRendererProps {
  settings: AppSettings;
  data: ScreenshotData;
  scale?: number;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ settings, data, scale = 1 }) => {
  const { template, primaryColor, secondaryColor, textColor, deviceType, gradientAngle, deviceFinish } = settings;
  const { title, subtitle, imageUrl } = data;

  const baseWidth = 1242;
  const baseHeight = 2208;

  const bgStyle = {
    background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`,
    color: textColor,
  };

  // High-Performance Drop Shadow Engine for professional legibility
  const textShadowStyle = {
    textShadow: textColor === '#FFFFFF' 
      ? `0 20px 80px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.6), 0 0 120px rgba(0,0,0,0.4)` 
      : 'none'
  };

  const renderContent = () => {
    switch (template) {
      case TemplateStyle.CLASSIC:
        return (
          <div className="h-full w-full flex flex-col items-center p-24 text-center relative overflow-hidden" style={bgStyle}>
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
            <div className="z-20 mt-20 mb-24 space-y-12">
              <h2 className="text-[180px] leading-[0.8] font-black font-outfit tracking-tighter uppercase italic" style={textShadowStyle}>{title}</h2>
              <p className="text-[78px] font-black opacity-100 max-w-[1000px] mx-auto leading-[1.0] tracking-tight text-white" style={textShadowStyle}>{subtitle}</p>
            </div>
            <div className="flex-1 w-full max-w-[85%] relative z-10 flex items-end justify-center">
               <div className="absolute bottom-0 inset-x-0 h-32 bg-black/70 blur-[150px] rounded-full scale-75 translate-y-12"></div>
               <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
               </DeviceFrame>
            </div>
          </div>
        );

      case TemplateStyle.BENTO:
        return (
          <div className="h-full w-full flex flex-col p-10 overflow-hidden relative" style={bgStyle}>
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            
            <div className="flex-1 flex flex-col gap-8 relative z-10">
              {/* Massive Device Zone - Calibrated for high-fidelity hardware focus */}
              <div className="flex-[1.1] relative rounded-[110px] bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center p-12 shadow-2xl">
                <div className="w-[72%] relative">
                  <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-[0_150px_300px_rgba(0,0,0,0.9)]">
                    <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                  </DeviceFrame>
                </div>
              </div>

              {/* Massive Glass Information Zone - Engineered for 4K visibility */}
              <div className="flex-[0.9] relative">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-[180px] rounded-[110px] border border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"></div>
                
                <div className="relative h-full p-24 flex flex-col justify-center items-center text-center z-20">
                  <div className="w-48 h-2 bg-white/40 rounded-full mb-16"></div>
                  <h2 className="text-[160px] font-black font-outfit leading-[0.8] tracking-tighter mb-12 text-white drop-shadow-2xl uppercase italic">
                    {title}
                  </h2>
                  <p className="text-[82px] font-black text-white/90 leading-[1.0] tracking-tight max-w-[95%] mx-auto drop-shadow-lg">
                    {subtitle}
                  </p>
                  <div className="mt-16 px-16 py-6 bg-white text-black text-[42px] font-black tracking-[0.2em] rounded-3xl uppercase shadow-2xl">
                     PREMIUM MODULE
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case TemplateStyle.FLOATING_DUO:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-24 overflow-hidden" style={bgStyle}>
            <div className="absolute top-0 inset-x-0 h-[50%] bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
            <div className="text-center mb-24 z-20 space-y-12">
               <h2 className="text-[170px] font-black font-outfit leading-none tracking-tighter uppercase italic" style={textShadowStyle}>{title}</h2>
               <p className="text-[72px] font-black opacity-100 max-w-[950px] leading-tight mx-auto tracking-tight" style={textShadowStyle}>{subtitle}</p>
            </div>
            <div className="relative w-full h-[55%] flex justify-center items-center scale-[1.3] translate-y-24">
                <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-[70%] absolute -translate-x-56 translate-y-40 rotate-[-12deg] z-10 opacity-30 blur-[6px]">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                </DeviceFrame>
                <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-[70%] absolute translate-x-28 rotate-[10deg] z-20 shadow-[0_150px_300px_rgba(0,0,0,1)]">
                  <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                </DeviceFrame>
            </div>
          </div>
        );

      case TemplateStyle.ISOMETRIC:
        return (
          <div className="h-full w-full flex flex-col p-24 overflow-hidden relative" style={bgStyle}>
            <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[70%] bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.8)_0%,transparent_75%)] pointer-events-none z-10"></div>
            <div className="mt-20 mb-24 relative z-20 space-y-16">
               <h2 className="text-[195px] font-black font-outfit leading-[0.8] tracking-tighter italic uppercase" style={textShadowStyle}>{title}</h2>
               <p className="text-[88px] font-black opacity-100 leading-tight tracking-tight max-w-[1200px]" style={textShadowStyle}>{subtitle}</p>
            </div>
            <div className="flex-1 relative perspective-[5000px] flex justify-center items-center scale-[1.4] translate-y-36 translate-x-16">
                <div 
                  className="absolute w-[80%] h-[120%] bg-black/60 blur-[180px] rounded-[180px]" 
                  style={{ transform: 'rotateX(60deg) rotateZ(-35deg) translateZ(-100px) translateY(50px) skewX(10deg)' }}
                ></div>
                <div className="w-[85%] transform-gpu" style={{ transform: 'rotateX(55deg) rotateZ(-35deg) translateZ(50px)' }}>
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-[80px_80px_160px_rgba(0,0,0,0.7)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>
            </div>
          </div>
        );

      case TemplateStyle.EDITORIAL:
        return (
          <div className="h-full w-full flex flex-col bg-white p-0 overflow-hidden text-slate-900">
             <div className="h-[58%] w-full relative" style={bgStyle}>
                <div className="absolute bottom-[-22%] left-16 w-[70%] z-20">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full border-white border-[35px] shadow-[0_120px_240px_rgba(0,0,0,0.5)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>
             </div>
             <div className="flex-1 p-24 flex flex-col justify-end items-start text-left bg-white">
                <h2 className="text-[215px] font-black font-outfit leading-[0.7] tracking-tighter mb-16 text-slate-900 uppercase italic">{title}</h2>
                <div className="w-80 h-20 bg-slate-900 mb-16 rounded-full"></div>
                <p className="text-[92px] font-black text-slate-500 leading-tight max-w-[1000px] tracking-tighter">{subtitle}</p>
             </div>
          </div>
        );

      case TemplateStyle.MINIMAL_LUXE:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-24" style={bgStyle}>
             <div className="w-full h-full border-[22px] border-white/20 rounded-[240px] p-24 flex flex-col items-center justify-between shadow-inner relative">
                <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-black/50 to-transparent pointer-events-none rounded-[inherit]"></div>
                <div className="text-center w-full mt-16 space-y-14 z-10">
                    <h2 className="text-[185px] font-black font-outfit leading-tight tracking-tighter uppercase italic" style={textShadowStyle}>{title}</h2>
                    <p className="text-[80px] font-black opacity-80 tracking-[0.2em] uppercase" style={textShadowStyle}>{subtitle}</p>
                </div>
                <div className="relative w-[80%] mb-12">
                    <DeviceFrame deviceType={deviceType} finish={deviceFinish} textColor={textColor} className="w-full shadow-[0_200px_400px_rgba(0,0,0,0.8)]">
                        <img src={imageUrl} alt="App screen" className="w-full h-full object-cover" />
                    </DeviceFrame>
                </div>
                <div className="w-48 h-12 bg-white/25 rounded-full mb-8"></div>
             </div>
          </div>
        );

      default:
        return <div style={bgStyle}>Template Error</div>;
    }
  };

  return (
    <div 
      className="screenshot-canvas relative overflow-hidden bg-black" 
      style={{ 
        width: baseWidth,
        height: baseHeight,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        flexShrink: 0
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};
