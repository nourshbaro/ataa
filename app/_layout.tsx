import NetworkGuard from "@/components/NetworkGuard";
import CustomSplashScreen from "@/components/SplashScreen";
import { LanguageProvider } from "@/context/LanguageContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { router, SplashScreen, Stack } from "expo-router";
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

  useEffect(() => {
    if (!isSplashVisible) {
      router.replace("/(tabs)");
    }
  }, [isSplashVisible]);

  if (isSplashVisible) {
    return <CustomSplashScreen onFinish={handleSplashScreenFinish} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NetworkProvider>
            <NetworkGuard>
              <RootLayoutInner />
            </NetworkGuard>
          </NetworkProvider>
        </ThemeProvider>
      </LanguageProvider>
    </UserProvider>
  )
}
