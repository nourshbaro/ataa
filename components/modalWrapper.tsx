import { useTheme } from '@/context/ThemeContext';
import { spacingY } from '@/types/theme';
import { ModalWrapperProps } from '@/types/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

const isIOS = Platform.OS == 'ios'

const ModalWrapper = ({
  style,
  children,
  bg
}: ModalWrapperProps) => {

  const { theme } = useTheme();
  const finalColor = bg || theme.colors.black;

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.black]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }} style={[styles.container, { backgroundColor: finalColor }, style && style]}>
      {children}
    </LinearGradient>
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