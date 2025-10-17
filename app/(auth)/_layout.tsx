import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { theme } = useTheme()
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack screenOptions={{ presentation: 'modal', headerShown: false }} />
    // </SafeAreaView>
  )
}
