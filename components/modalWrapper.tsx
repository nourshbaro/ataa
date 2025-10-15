import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { spacingY } from '@/types/theme';
import { ModalWrapperProps } from '@/types/types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const isIOS = Platform.OS == 'ios'

const ModalWrapper = ({
  style,
  children,
  bg
}: ModalWrapperProps) => {

  const { theme } = useTheme();
  const finalColor = bg || theme.colors.background;
  const { language, isRTL } = useLanguage();

  return (
    // <LinearGradient
    //   colors={[theme.colors.primary, theme.colors.black]}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 0, y: 1 }} style={[styles.container, { backgroundColor: finalColor, direction: isRTL ? 'rtl' : 'ltr' }, style && style]}>
    <View style={[styles.container, { backgroundColor: finalColor }, style && style]}>
      {children}
    </View>
    // </LinearGradient>
  )
}

export default ModalWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIOS ? spacingY._15 : 50,
    paddingBottom: isIOS ? spacingY._20 : spacingY._10
  }
})