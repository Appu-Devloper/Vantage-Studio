
import { DeviceType, DeviceConfig, TemplateStyle, ScreenshotData } from './types';

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  [DeviceType.IPHONE_16_PRO_MAX]: {
    id: DeviceType.IPHONE_16_PRO_MAX,
    width: 1320,
    height: 2868,
    cornerRadius: 120,
    bezelWidth: 20
  },
  [DeviceType.IPHONE_15_PRO_MAX]: {
    id: DeviceType.IPHONE_15_PRO_MAX,
    width: 1290,
    height: 2796,
    cornerRadius: 110,
    bezelWidth: 24
  },
  [DeviceType.IPHONE_8_PLUS]: {
    id: DeviceType.IPHONE_8_PLUS,
    width: 1242,
    height: 2208,
    cornerRadius: 0,
    bezelWidth: 80
  },
  [DeviceType.IPAD_PRO_12_9]: {
    id: DeviceType.IPAD_PRO_12_9,
    width: 2048,
    height: 2732,
    cornerRadius: 60,
    bezelWidth: 40
  },
  [DeviceType.PIXEL_9_PRO]: {
    id: DeviceType.PIXEL_9_PRO,
    width: 1344,
    height: 2992,
    cornerRadius: 100,
    bezelWidth: 18
  }
};

export const INITIAL_SCREENSHOTS: ScreenshotData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `screen-${i}`,
  title: i === 0 ? "Welcome to Your App" : `Feature Highlight ${i + 1}`,
  subtitle: "Describe your amazing features in a few words here.",
  imageUrl: `https://picsum.photos/seed/${i + 10}/800/1600`
}));

export const COLOR_PRESETS = [
  { primary: '#4F46E5', secondary: '#9333EA', name: 'Indigo Dream' },
  { primary: '#0EA5E9', secondary: '#2DD4BF', name: 'Ocean Breeze' },
  { primary: '#F43F5E', secondary: '#FB923C', name: 'Sunset Glow' },
  { primary: '#10B981', secondary: '#3B82F6', name: 'Fresh Mint' },
  { primary: '#1F2937', secondary: '#4B5563', name: 'Classic Dark' },
  { primary: '#EC4899', secondary: '#8B5CF6', name: 'Berry Mix' },
];
