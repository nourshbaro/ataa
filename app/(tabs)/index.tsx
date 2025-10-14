import apiClient from '@/api/apiClient';
import CatCampaign from '@/components/app/CatCampaign';
import LatestCampaign from '@/components/app/LatestCampaign';
import LatestCategories from '@/components/app/LatestCategories';
import Header from '@/components/header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Campaigns, CatCampaignType, Categories } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const index = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, theme, mode } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLatestCampaign, setIsLoadingLatestCampaign] = useState(true);
  const [isLoadingLatestCategory, setIsLoadingLatestCategory] = useState(true);
  const [isLoadingCatCampaign, setIsLoadingCatCampaign] = useState(true);
  const [latestCampaign, setLatestCampaign] = useState<Campaigns[]>([]);
  const [latestCategories, setLatestCategories] = useState<Categories[]>([]);
  const [catCampaign, setCatCampaign] = useState<CatCampaignType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [prevCategory, setPrevCategory] = useState<number>(-1);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsLoadingLatestCampaign(true)
    setIsLoadingLatestCategory(true)
    setIsLoadingCatCampaign(true)

    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoadingLatestCampaign(false)
      setIsLoadingLatestCategory(false)
      setIsLoadingCatCampaign(false)
    }
  };

  const fetchData = async () => {
    try {
      setIsLoadingLatestCampaign(true);
      setIsLoadingLatestCategory(true);
      setIsLoadingCatCampaign(true);

      const [latestCampaignRes, latestCategoryRes, catCampaignRes] = await Promise.all([
        apiClient.get("/api/campaigns/all"),
        apiClient.get("/api/categories/all"),
        apiClient.get(`/api/campaigns/category/${selectedCategory}`),
      ]);

      const categories = latestCategoryRes.data.data;
      setLatestCampaign(latestCampaignRes.data.campaigns.data);
      setLatestCategories(categories);
      // setCatCampaign(catCampaignRes.data.campaigns.data);

      if (selectedCategory === -1 && categories.length > 0) {
        setSelectedCategory(categories[0].id);
        // fetch campaigns for default category
        const catRes = await apiClient.get(`/api/campaigns/category/${categories[0].id}`);
        setCatCampaign(catRes.data.campaigns.data);
      } else {
        setCatCampaign(catCampaignRes.data.campaigns.data);
      }
    } catch (err: any) {
      console.log("Error:", err.message);
    } finally {
      setIsLoadingLatestCampaign(false);
      setIsLoadingLatestCategory(false);
      setIsLoadingCatCampaign(false);
    }
  };

  const fetchCatCampaigns = async (categoryId: number) => {
    try {
      const res = await apiClient.get(`/api/campaigns/category/${categoryId}`);
      setCatCampaign(res.data.campaigns.data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCategorySelect = (id: number) => {
    if (id === 0) {
      setPrevCategory(selectedCategory);
      router.push('/categories');
    } else {
      setSelectedCategory(id);
      fetchCatCampaigns(id);
    }
  };

  return (
    <ScreenWrapper>
      <Header rightIcon={<Ionicons
        name='person-circle-outline'
        size={verticalScale(30)}
        color={theme.colors.primary}
      />} />
      <ScrollView showsVerticalScrollIndicator={false}>

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

        <CatCampaign
          data={catCampaign}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
          isLoading={isLoadingCatCampaign}
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
      </ScrollView>
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