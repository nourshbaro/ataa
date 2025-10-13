import NetworkGuard from "@/components/NetworkGuard";
import CustomSplashScreen from "@/components/SplashScreen";
import { LanguageProvider } from "@/context/LanguageContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const handleSplashScreenFinish = () => {
    setSplashVisible(false);
  };

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (isSplashVisible) {
    return <CustomSplashScreen onFinish={handleSplashScreenFinish} />;
  }

  return <Stack screenOptions={{ headerShown: false }} initialRouteName={'(tabs)'} />;
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <NetworkProvider>
          <NetworkGuard>
            <RootLayoutInner />
          </NetworkGuard>
        </NetworkProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
