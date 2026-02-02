
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
  finish = 'Space Black'
}) => {
  const config = DEVICE_CONFIGS[deviceType];
  const aspectRatio = config.width / config.height;
  
  const isIphone = deviceType.toLowerCase().includes('iphone');
  const isTablet = deviceType.toLowerCase().includes('ipad');

  // Material Palette - High Precision Colors
  const finishStyles = {
    'Titanium': { 
      frame: 'linear-gradient(180deg, #b8b8b8 0%, #8c8c8c 50%, #707070 100%)',
      bezel: '#0a0a0a', 
      edge: '#ffffff20',
      shadow: 'rgba(0,0,0,0.4)',
      btn: '#888'
    },
    'Space Black': { 
      frame: 'linear-gradient(180deg, #2c2c2c 0%, #151515 50%, #000 100%)',
      bezel: '#020202', 
      edge: '#ffffff10',
      shadow: 'rgba(0,0,0,0.6)',
      btn: '#333'
    },
    'Silver': { 
      frame: 'linear-gradient(180deg, #f8f8f8 0%, #d1d1d1 50%, #bebebe 100%)',
      bezel: '#0d0d0d', 
      edge: '#ffffff40',
      shadow: 'rgba(0,0,0,0.3)',
      btn: '#ddd'
    }
  }[finish];

  return (
    <div 
      className={`relative mx-auto transition-all duration-700 ${className}`}
      style={{
        aspectRatio: `${aspectRatio}`,
        padding: '2px', // Thin edge highlight
        background: finishStyles.edge,
        borderRadius: `${config.cornerRadius / 10}px`,
        boxShadow: `0 30px 60px -12px ${finishStyles.shadow}, 0 18px 36px -18px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Outer Hardware Frame */}
      <div 
        className="w-full h-full relative p-[2px]"
        style={{
          background: finishStyles.frame,
          borderRadius: `${(config.cornerRadius / 10) - 2}px`,
        }}
      >
        {/* Antenna Bands (Top/Bottom) */}
        {!isTablet && (
          <>
            <div className="absolute top-[8%] left-0 w-full h-[1px] bg-black/10 z-10"></div>
            <div className="absolute bottom-[8%] left-0 w-full h-[1px] bg-black/10 z-10"></div>
          </>
        )}

        {/* Physical Buttons - Precision Mode */}
        {!isTablet && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Action Button */}
            <div className="absolute left-[-4px] top-[14%] w-[3px] h-[3%] bg-inherit rounded-l-sm shadow-sm" style={{ background: finishStyles.btn }}></div>
            {/* Volume Up */}
            <div className="absolute left-[-4px] top-[20%] w-[3px] h-[6%] bg-inherit rounded-l-sm shadow-sm" style={{ background: finishStyles.btn }}></div>
            {/* Volume Down */}
            <div className="absolute left-[-4px] top-[27%] w-[3px] h-[6%] bg-inherit rounded-l-sm shadow-sm" style={{ background: finishStyles.btn }}></div>
            {/* Power Button */}
            <div className="absolute right-[-4px] top-[23%] w-[3px] h-[10%] bg-inherit rounded-r-sm shadow-sm" style={{ background: finishStyles.btn }}></div>
          </div>
        )}

        {/* Display Glass / Inner Bezel Container */}
        <div 
          className="w-full h-full relative overflow-hidden flex items-center justify-center p-[8px]"
          style={{
            backgroundColor: finishStyles.bezel,
            borderRadius: `${(config.cornerRadius / 10) - 4}px`,
            boxShadow: 'inset 0 0 1px 1px rgba(255,255,255,0.05)'
          }}
        >
          {/* Inner Screen - Conforming to Bezel Curve */}
          <div 
            className="w-full h-full relative overflow-hidden bg-black flex"
            style={{
              borderRadius: `${(config.cornerRadius / 10) - 12}px`,
            }}
          >
            {/* Dynamic Island / Hardware Sensors */}
            {isIphone && (deviceType.includes('15') || deviceType.includes('16')) && (
              <div className="absolute top-[2.5%] left-1/2 -translate-x-1/2 w-[26%] h-[3.4%] bg-black rounded-full z-50 flex items-center justify-end px-2 border-[0.5px] border-white/5 shadow-inner">
                 <div className="w-[12px] h-[12px] rounded-full bg-[#080808] relative">
                    <div className="absolute inset-[3px] rounded-full bg-indigo-500/10 blur-[1px]"></div>
                 </div>
              </div>
            )}

            {/* App Content */}
            <div className="w-full h-full relative z-10">
              {children}
            </div>

            {/* OLED Deep Black Vignette */}
            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"></div>

            {/* Realistic Light Refractions */}
            {showGloss && (
              <div className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-screen">
                <div className="absolute top-0 left-[-20%] w-[100%] h-[30%] bg-gradient-to-br from-white/20 to-transparent rotate-[-12deg] blur-sm"></div>
                <div className="absolute bottom-0 right-[-10%] w-[60%] h-[20%] bg-gradient-to-tl from-white/10 to-transparent rotate-[10deg] blur-sm"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
