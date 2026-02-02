
export enum DeviceType {
  IPHONE_16_PRO_MAX = 'iPhone 16 Pro Max (6.9")',
  IPHONE_15_PRO_MAX = 'iPhone 15 Pro Max (6.7")',
  IPHONE_8_PLUS = 'iPhone 8 Plus (5.5")',
  IPAD_PRO_12_9 = 'iPad Pro (12.9")',
  PIXEL_9_PRO = 'Google Pixel 9 Pro'
}

export interface DeviceConfig {
  id: DeviceType;
  width: number;
  height: number;
  cornerRadius: number;
  bezelWidth: number;
}

export enum TemplateStyle {
  CLASSIC = 'Classic Pro',
  BENTO = 'Glass Bento',
  FLOATING_DUO = 'Floating Duo',
  ISOMETRIC = 'Isometric 3D',
  EDITORIAL = 'Editorial Bold',
  MINIMAL_LUXE = 'Minimal Luxe',
  DYNAMIC_BREAK = 'Dynamic Breakout'
}

export interface ScreenshotData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface AppSettings {
  deviceType: DeviceType;
  template: TemplateStyle;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  screenCount: number;
  screenshots: ScreenshotData[];
  gradientAngle: number;
  deviceFinish: 'Titanium' | 'Space Black' | 'Silver';
}
