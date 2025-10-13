import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const index = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, mode } = useTheme()
  return (
    <ScreenWrapper>
      <Typo>{t('welcome')}</Typo>
      <Typo>{t('home')}</Typo>
      <Button onPress={toggleTheme}>
        <Typo>
          {t('changeLanguage')}
        </Typo>
      </Button>
      <Typo>Current: {mode}</Typo>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({})