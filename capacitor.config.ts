import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9524f1c0b4c245bc839594f26fe1af74',
  appName: 'space-books-global-read',
  webDir: 'dist',
  server: {
    url: 'https://9524f1c0-b4c2-45bc-8395-94f26fe1af74.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1e1b4b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#7c3aed'
    }
  }
};

export default config;