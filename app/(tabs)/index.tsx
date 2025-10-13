import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const index = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme } = useTheme()
  return (
    <ScreenWrapper>
      <Text>{t('welcome')}</Text>
      <Text>{t('home')}</Text>
      <Button onPress={toggleTheme}>
        <Typo>
          {t('changeLanguage')}
        </Typo>
      </Button>
      <Text>Current: {language}</Text>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({})