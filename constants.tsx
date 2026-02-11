
import { DeviceType, DeviceConfig, TemplateStyle, ScreenshotData } from './types';

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  [DeviceType.IPHONE_16_PRO_MAX]: {
    id: DeviceType.IPHONE_16_PRO_MAX,
    width: 1320,
    height: 2868,
    cornerRadius: 178, // High curvature squircle
    bezelWidth: 12     // Ultra-thin 1.15mm bezel simulation
  },
  [DeviceType.IPHONE_15_PRO_MAX]: {
    id: DeviceType.IPHONE_15_PRO_MAX,
    width: 1290,
    height: 2796,
    cornerRadius: 154,
    bezelWidth: 18
  },
  [DeviceType.IPHONE_8_PLUS]: {
    id: DeviceType.IPHONE_8_PLUS,
    width: 1242,
    height: 2208,
    cornerRadius: 110,
    bezelWidth: 82
  },
  [DeviceType.IPAD_PRO_12_9]: {
    id: DeviceType.IPAD_PRO_12_9,
    width: 2048,
    height: 2732,
    cornerRadius: 82,
    bezelWidth: 44
  },
  [DeviceType.PIXEL_9_PRO]: {
    id: DeviceType.PIXEL_9_PRO,
    width: 1344,
    height: 2992,
    cornerRadius: 144,
    bezelWidth: 16
  }
};

export const INITIAL_SCREENSHOTS: ScreenshotData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `screen-${i}`,
  title: i === 0 ? "Precision Performance" : `Intuitive Experience ${i + 1}`,
  subtitle: "Designed for those who demand pixel-perfect accuracy.",
  imageUrl: `https://picsum.photos/seed/${i + 20}/800/1600`
}));

export const COLOR_PRESETS = [
  { primary: '#0c0c0e', secondary: '#1e1e24', name: 'Midnight Pro' },
  { primary: '#4F46E5', secondary: '#9333EA', name: 'Indigo Aura' },
  { primary: '#0EA5E9', secondary: '#2DD4BF', name: 'Ocean Mist' },
  { primary: '#F43F5E', secondary: '#FB923C', name: 'Sunset Flux' },
  { primary: '#10B981', secondary: '#3B82F6', name: 'Arctic Mint' },
  { primary: '#EC4899', secondary: '#8B5CF6', name: 'Berry Glaze' },
];
