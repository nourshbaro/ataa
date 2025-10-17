import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ScreenWrapperProps } from '@/types/types';
import React from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

const { height } = Dimensions.get('window');

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const paddingTop = Platform.OS === 'ios' ? height * 0.01 : height * 0.01;
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  return (
    // <LinearGradient
    //   colors={[theme.colors.primary, theme.colors.background]}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 0, y: 1 }}
    //   style={[styles.fullScreen, { paddingTop, direction: isRTL ? 'rtl' : 'ltr' }, style]}
    // >
    <View style={[styles.fullScreen, { backgroundColor: theme.colors.background, paddingTop, direction: isRTL ? 'rtl' : 'ltr' }, style]}>
      {children}
    </View>
    // </LinearGradient>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
  },
});