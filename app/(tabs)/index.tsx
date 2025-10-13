import Button from '@/components/Button';
import Header from '@/components/header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

const index = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, theme, mode } = useTheme()
  return (
    <ScreenWrapper>
      <Header rightIcon={<Ionicons
        name='person-circle-outline'
        size={verticalScale(30)}
        color={theme.colors.white}
      />} />
      <Typo>{t('welcome')}</Typo>
      <Typo>{t('home')}</Typo>
      <Button onPress={toggleTheme}>
        <Typo>
          {t('changeLanguage')}
        </Typo>
      </Button>
      <Typo>Current: {mode}</Typo>
      <Button onPress={toggleLanguage}>
        <Typo>
          {t('changeLanguage')}
        </Typo>
      </Button>
      <Typo>Current: {language}</Typo>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({})