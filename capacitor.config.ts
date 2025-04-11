
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fab55912a1e1401da20fa63401d7eaad',
  appName: 'wake-up-quests-alarm',
  webDir: 'dist',
  server: {
    url: "https://fab55912-a1e1-401d-a20f-a63401d7eaad.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000
    },
    LocalNotifications: {
      smallIcon: "ic_stat_alarm",
      iconColor: "#FF0000"
    }
  }
};

export default config;
