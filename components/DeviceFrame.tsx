
import React from 'react';
import { DeviceType } from '../types';
import { DEVICE_CONFIGS } from '../constants';

interface DeviceFrameProps {
  deviceType: DeviceType;
  children: React.ReactNode;
  className?: string;
  showGloss?: boolean;
  finish?: 'Titanium' | 'Space Black' | 'Silver';
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  deviceType, 
  children, 
  className = "",
  showGloss = true,
  finish = 'Titanium'
}) => {
  const config = DEVICE_CONFIGS[deviceType];
  const aspectRatio = config.width / config.height;
  
  const isIphone = deviceType.toLowerCase().includes('iphone');
  const isTablet = deviceType.toLowerCase().includes('ipad');

  // Advanced Geometry Calculations
  const outerRadius = config.cornerRadius / 10;
  const frameWidth = 4.5;  // Machined titanium thickness
  const bezelWidth = 3.2;   // Pro-grade black screen border
  
  const midRadius = outerRadius - frameWidth;
  const screenRadius = midRadius - bezelWidth;

  const finishStyles = {
    'Titanium': { 
      frame: 'linear-gradient(180deg, #9d9d9d 0%, #636363 20%, #7d7d7d 50%, #4a4a4a 80%, #6a6a6a 100%)',
      chamfer: 'rgba(255,255,255,0.4)', // The polished metal "lip"
      bezel: '#020202', 
      btn: '#757575',
      innerGlow: 'rgba(255,255,255,0.12)'
    },
    'Space Black': { 
      frame: 'linear-gradient(180deg, #222 0%, #080808 20%, #1a1a1a 50%, #000 80%, #111 100%)',
      chamfer: 'rgba(255,255,255,0.15)',
      bezel: '#010101', 
      btn: '#1a1a1a',
      innerGlow: 'rgba(255,255,255,0.04)'
    },
    'Silver': { 
      frame: 'linear-gradient(180deg, #ffffff 0%, #dcdcdc 20%, #f0f0f0 50%, #b8b8b8 80%, #fdfdfd 100%)',
      chamfer: 'rgba(255,255,255,0.8)',
      bezel: '#080808', 
      btn: '#e5e5e5',
      innerGlow: 'rgba(255,255,255,0.4)'
    }
  }[finish];

  return (
    <div 
      className={`relative mx-auto transition-all duration-700 select-none ${className}`}
      style={{
        aspectRatio: `${aspectRatio}`,
        padding: `${frameWidth}px`,
        background: finishStyles.frame,
        borderRadius: `${outerRadius}px`,
        boxShadow: `
          0 0 0 1px rgba(0,0,0,0.5),
          inset 0 1px 1px ${finishStyles.chamfer},
          inset 0 -0.5px 0.5px rgba(0,0,0,0.5),
          0 50px 100px -30px rgba(0,0,0,0.8),
          0 30px 60px -40px rgba(0,0,0,0.6)
        `,
      }}
    >
      {/* CNC Internal Housing & Screen Bezel */}
      <div 
        className="w-full h-full relative"
        style={{
          padding: `${bezelWidth}px`,
          background: '#000',
          borderRadius: `${midRadius}px`,
          boxShadow: `
            inset 0 0 1px 1.5px rgba(255,255,255,0.05),
            0 0 0 1px rgba(0,0,0,1)
          `
        }}
      >
        {/* Antenna Breaks (Industrial details) */}
        {!isTablet && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[inherit]">
            <div className="absolute top-[10%] left-[-10%] w-[120%] h-[1.5px] bg-black/30 mix-blend-multiply opacity-40"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[120%] h-[1.5px] bg-black/30 mix-blend-multiply opacity-40"></div>
          </div>
        )}

        {/* Machined Aluminum/Titanium Buttons */}
        {!isTablet && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Action Button / Mute Switch */}
            <div 
              className="absolute left-[-9px] top-[14.5%] w-[4.5px] h-[3%] rounded-l-sm border-y border-black/30 shadow-inner" 
              style={{ background: finishStyles.btn, borderLeft: `1px solid ${finishStyles.chamfer}` }}
            ></div>
            {/* Volume Up */}
            <div 
              className="absolute left-[-9px] top-[21.2%] w-[4.5px] h-[6.8%] rounded-l-sm border-y border-black/30 shadow-inner" 
              style={{ background: finishStyles.btn, borderLeft: `1px solid ${finishStyles.chamfer}` }}
            ></div>
            {/* Volume Down */}
            <div 
              className="absolute left-[-9px] top-[29.2%] w-[4.5px] h-[6.8%] rounded-l-sm border-y border-black/30 shadow-inner" 
              style={{ background: finishStyles.btn, borderLeft: `1px solid ${finishStyles.chamfer}` }}
            ></div>
            {/* Power / Side Button */}
            <div 
              className="absolute right-[-9px] top-[24%] w-[4.5px] h-[11%] rounded-r-sm border-y border-black/30 shadow-inner" 
              style={{ background: finishStyles.btn, borderRight: `1px solid ${finishStyles.chamfer}` }}
            ></div>
          </div>
        )}

        {/* The Active Display Panel (OLED Panel) */}
        <div 
          className="w-full h-full relative overflow-hidden bg-black"
          style={{
            borderRadius: `${screenRadius}px`,
          }}
        >
          {/* Dynamic Island Assembly (Layered for Depth) */}
          {isIphone && (deviceType.includes('15') || deviceType.includes('16')) && (
            <div 
              className="absolute top-[2.2%] left-1/2 -translate-x-1/2 w-[27%] h-[3%] bg-[#080808] rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/5"
            >
               <div className="w-[10px] h-[10px] rounded-full bg-[#050505] relative border border-white/10">
                  <div className="absolute inset-[3px] rounded-full bg-indigo-500/10 blur-[1px]"></div>
                  <div className="absolute inset-[2px] border border-white/5 rounded-full"></div>
               </div>
            </div>
          )}

          {/* User Screen Content */}
          <div className="w-full h-full relative z-10 bg-black">
            {children}
          </div>

          {/* Deep OLED Black Vignette */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"></div>

          {/* Luxury Reflection Overlay (The "Glass" feeling) */}
          {showGloss && (
            <div className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-screen">
              {/* Primary Studio Softbox Reflection */}
              <div className="absolute top-[-25%] left-[-20%] w-[140%] h-[70%] bg-gradient-to-br from-white/25 via-white/5 to-transparent rotate-[-18deg] blur-[40px]"></div>
              
              {/* Precision Sub-pixel Edge Highlight */}
              <div 
                className="absolute inset-[0.5px] border-[0.5px] border-white/15 mix-blend-overlay"
                style={{ borderRadius: `${screenRadius}px` }}
              ></div>
              
              {/* Bottom Ambient Floor Bounce */}
              <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[40%] bg-gradient-to-tl from-white/10 to-transparent rotate-[12deg] blur-[30px]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Surface Brushed Texture Shimmer */}
      <div 
        className="absolute inset-0 pointer-events-none z-40 rounded-[inherit] overflow-hidden mix-blend-overlay opacity-10"
        style={{ 
          background: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.4) 0%, transparent 60%)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      ></div>
    </div>
  );
};
