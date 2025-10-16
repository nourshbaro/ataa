import CustomTabs from '@/components/customTabs'
import { useTheme } from '@/context/ThemeContext'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const _layout = () => {
  const { theme } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs tabBar={(props) => <CustomTabs {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="categories" />
        <Tabs.Screen name="campaigns" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </SafeAreaView>
  )
}

export default _layout

const styles = StyleSheet.create({})