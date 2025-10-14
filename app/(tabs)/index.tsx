import apiClient from '@/api/apiClient';
import LatestCampaign from '@/components/app/LatestCampaign';
import LatestCategories from '@/components/app/LatestCategories';
import Header from '@/components/header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Campaigns, Categories } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const index = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, theme, mode } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLatestCampaign, setIsLoadingLatestCampaign] = useState(true);
  const [isLoadingLatestCategory, setIsLoadingLatestCategory] = useState(true);
  const [latestCampaign, setLatestCampaign] = useState<Campaigns[]>([]);
  const [latestCategories, setLatestCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsLoadingLatestCampaign(true)
    setIsLoadingLatestCategory(true)

    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoadingLatestCampaign(true)
      setIsLoadingLatestCategory(true)
    }
  };

  const fetchData = async () => {
  try {
    setIsLoadingLatestCampaign(true);
    setIsLoadingLatestCategory(true);

    const [latestCampaignRes, latestCategoryRes] = await Promise.all([
      apiClient.get("/api/campaigns/all"),
      apiClient.get("/api/categories/all"),
    ]);

    const categories = latestCategoryRes.data.data;
    setLatestCampaign(latestCampaignRes.data.campaigns.data);
    setLatestCategories(categories);

    // ✅ Automatically select the first category if none is selected yet
    if (selectedCategory === -1 && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  } catch (err: any) {
    console.log("Error:", err.message);
  } finally {
    setIsLoadingLatestCampaign(false);
    setIsLoadingLatestCategory(false);
  }
};

  const handleCategorySelect = (id: number) => {
    setSelectedCategory(id);
    if (id === 0) {
      // Navigate to Category tab
      router.push('/categories');
    } else {
      // fetchData(id);
    }
  };

  return (
    <ScreenWrapper>
      <Header rightIcon={<Ionicons
        name='person-circle-outline'
        size={verticalScale(30)}
        color={theme.colors.primary}
      />} />
      <View style={styles.titleHeader}>
        <Typo style={styles.mainTitle} color={theme.colors.textPrimary}>Latest Campaigns</Typo>
        <Pressable onPress={() => { router.push('/(tabs)/campaigns') }}>
          <Typo style={styles.seeAll} color={theme.colors.textSecondary}>More</Typo>
        </Pressable>
      </View>
      <LatestCampaign
        data={latestCampaign}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        isLoading={isLoadingLatestCampaign}
      />
      <LatestCategories
        categories={latestCategories}
        selectedId={selectedCategory}
        onSelect={handleCategorySelect}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        isLoading={isLoadingLatestCategory}
      />

      {/* <Typo>{t('welcome')}</Typo>
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
      <Typo>Current: {language}</Typo> */}
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: verticalScale(10),
    alignItems: 'center',
    marginHorizontal: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  mainTitle: {
    fontSize: verticalScale(20),
    fontWeight: '700'
  },
  seeAll: {
    fontSize: verticalScale(14),
    fontWeight: '500'
  },
})