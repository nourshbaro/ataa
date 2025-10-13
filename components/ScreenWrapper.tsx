import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ScreenWrapperProps } from '@/types/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const paddingTop = Platform.OS === 'ios' ? height * 0.01 : height * 0.02;
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === 'ar' ? true : false;

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.fullScreen, { paddingTop, direction: isRTL ? 'rtl' : 'ltr' }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
  },
});