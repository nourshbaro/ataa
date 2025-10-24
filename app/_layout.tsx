import NetworkGuard from "@/components/NetworkGuard";
import CustomSplashScreen from "@/components/SplashScreen";
import { LanguageProvider } from "@/context/LanguageContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { SaveProvider } from "@/context/SavedContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const { theme } = useTheme()
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

  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}><Stack screenOptions={{ headerShown: false }} /></SafeAreaView>;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <LanguageProvider>
        <ThemeProvider>
          <SaveProvider>
            <NetworkProvider>
              <NetworkGuard>
                <RootLayoutInner />
              </NetworkGuard>
            </NetworkProvider>
          </SaveProvider>
        </ThemeProvider>
      </LanguageProvider>
    </UserProvider>
  )
}
