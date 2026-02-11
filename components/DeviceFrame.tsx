
import React from 'react';
import { DeviceType } from '../types';
import { DEVICE_CONFIGS } from '../constants';
import { Wifi, BatteryFull, Signal } from 'lucide-react';

interface DeviceFrameProps {
  deviceType: DeviceType;
  children: React.ReactNode;
  className?: string;
  showGloss?: boolean;
  finish?: 'Titanium' | 'Space Black' | 'Silver';
  textColor?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  deviceType, 
  children, 
  className = "",
  showGloss = true,
  finish = 'Titanium',
  textColor = '#FFFFFF'
}) => {
  const config = DEVICE_CONFIGS[deviceType];
  const aspectRatio = config.width / config.height;
  
  const isIphone = deviceType.toLowerCase().includes('iphone');
  const isTablet = deviceType.toLowerCase().includes('ipad');

  // Advanced Geometry Calculations
  const outerRadius = config.cornerRadius / 10;
  const frameWidth = 4.5;  
  const bezelWidth = 3.2;   
  
  const midRadius = outerRadius - frameWidth;
  const screenRadius = midRadius - bezelWidth;

  const finishStyles = {
    'Titanium': { 
      frame: 'linear-gradient(180deg, #9d9d9d 0%, #636363 20%, #7d7d7d 50%, #4a4a4a 80%, #6a6a6a 100%)',
      chamfer: 'rgba(255,255,255,0.4)',
      bezel: '#020202', 
      btn: '#757575'
    },
    'Space Black': { 
      frame: 'linear-gradient(180deg, #222 0%, #080808 20%, #1a1a1a 50%, #000 80%, #111 100%)',
      chamfer: 'rgba(255,255,255,0.15)',
      bezel: '#010101', 
      btn: '#1a1a1a'
    },
    'Silver': { 
      frame: 'linear-gradient(180deg, #ffffff 0%, #dcdcdc 20%, #f0f0f0 50%, #b8b8b8 80%, #fdfdfd 100%)',
      chamfer: 'rgba(255,255,255,0.8)',
      bezel: '#080808', 
      btn: '#e5e5e5'
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
          0 50px 100px -30px rgba(0,0,0,0.8)
        `,
      }}
    >
      <div 
        className="w-full h-full relative"
        style={{
          padding: `${bezelWidth}px`,
          background: '#000',
          borderRadius: `${midRadius}px`,
          boxShadow: `inset 0 0 1px 1.5px rgba(255,255,255,0.05), 0 0 0 1px #000`
        }}
      >
        <div 
          className="w-full h-full relative overflow-hidden bg-black"
          style={{ borderRadius: `${screenRadius}px` }}
        >
          {/* Simulated Status Bar (Elite Detail) */}
          <div 
            className="absolute top-0 left-0 w-full h-[6%] z-40 flex items-center justify-between px-[8%] pointer-events-none"
            style={{ color: textColor, opacity: 0.9 }}
          >
            <span className="text-[10px] font-bold tracking-tight">10:41</span>
            <div className="flex items-center gap-1.5 scale-75">
              <Signal size={14} />
              <Wifi size={14} />
              <BatteryFull size={14} />
            </div>
          </div>

          {/* Dynamic Island Assembly */}
          {isIphone && (deviceType.includes('15') || deviceType.includes('16')) && (
            <div 
              className="absolute top-[1.8%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-[#080808] rounded-full z-50 flex items-center justify-end px-[4px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border border-white/5"
            >
               <div className="w-[8px] h-[8px] rounded-full bg-[#050505] relative border border-white/10">
                  <div className="absolute inset-[2.5px] rounded-full bg-indigo-500/10 blur-[0.5px]"></div>
               </div>
            </div>
          )}

          {/* User Screen Content */}
          <div className="w-full h-full relative z-10 bg-black">
            {children}
          </div>

          {/* Deep OLED Vignette */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]"></div>

          {/* Luxury Reflection Overlay */}
          {showGloss && (
            <div className="absolute inset-0 pointer-events-none z-30 opacity-30 mix-blend-screen">
              <div className="absolute top-[-25%] left-[-20%] w-[140%] h-[70%] bg-gradient-to-br from-white/20 via-white/5 to-transparent rotate-[-20deg] blur-[50px]"></div>
              <div 
                className="absolute inset-[0.5px] border-[0.5px] border-white/10 mix-blend-overlay"
                style={{ borderRadius: `${screenRadius}px` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Surface Shimmer */}
      <div 
        className="absolute inset-0 pointer-events-none z-40 rounded-[inherit] overflow-hidden mix-blend-overlay opacity-[0.08]"
        style={{ 
          background: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.4) 0%, transparent 60%)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      ></div>
    </div>
  );
};
