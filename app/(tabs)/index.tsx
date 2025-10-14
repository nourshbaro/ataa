import apiClient from '@/api/apiClient';
import CampaignCard from '@/components/app/CampaignCard';
import LatestCampaign from '@/components/app/LatestCampaign';
import LatestCategories from '@/components/app/LatestCategories';
import Header from '@/components/header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Skeleton from '@/components/skeleton';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { spacingX, spacingY } from '@/types/theme';
import { Campaigns, Categories } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const index = () => {
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const { toggleTheme, theme, mode } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLatestCampaign, setIsLoadingLatestCampaign] = useState(true);
  const [isLoadingLatestCategory, setIsLoadingLatestCategory] = useState(true);
  const [isLoadingCatCampaign, setIsLoadingCatCampaign] = useState(true);
  const [latestCampaign, setLatestCampaign] = useState<Campaigns[]>([]);
  const [latestCategories, setLatestCategories] = useState<Categories[]>([]);
  const [catCampaign, setCatCampaign] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [prevCategory, setPrevCategory] = useState<number>(-1);
  const [showEmpty, setShowEmpty] = useState(false);

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

  useEffect(() => {
    if (!isLoadingCatCampaign && catCampaign.length === 0) {
      const timer = setTimeout(() => setShowEmpty(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [isLoadingCatCampaign, catCampaign]);

  return (
    <ScreenWrapper>
      <Header rightIcon={<Ionicons
        name='person-circle-outline'
        size={verticalScale(30)}
        color={theme.colors.primary}
      />} />
      <FlatList
        data={catCampaign}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !showEmpty ? (
            <View style={{ marginVertical: spacingY._5, alignItems: 'center', marginHorizontal: spacingX._20 }}>
              <View
                style={{
                  backgroundColor: theme.colors.containerBackground,
                  borderRadius: 16,
                  paddingBottom: 10,
                  width: screenWidth * 0.9,
                  overflow: "hidden",
                }}
              >
                <Skeleton height={200} radius={16} />
                <Skeleton
                  height={20}
                  width={'50%'}
                  radius={6}
                  style={{ marginTop: 8, marginHorizontal: 10 }}
                />
                <Skeleton
                  height={1}
                  width={'87%'}
                  radius={0}
                  style={{ marginVertical: 8, marginHorizontal: 20, alignSelf: "center" }}
                />
                <Skeleton
                  height={10}
                  width={'90%'}
                  radius={6}
                  style={{ marginVertical: 8, marginHorizontal: 10, alignSelf: "center" }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                    marginTop: 8,
                  }}
                >
                  <Skeleton width="60%" height={16} radius={4} />
                  <Skeleton width={40} height={16} radius={4} />
                </View>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: spacingY._15 }}>
              <Typo size={15} color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
                {'No items found'}
              </Typo>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginVertical: spacingY._5, alignItems: 'center' }}>
            <CampaignCard {...item} cardWidth={screenWidth * 0.9} />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.titleHeader}>
              <Typo style={styles.mainTitle} color={theme.colors.textPrimary}>Latest Campaigns</Typo>
              <Pressable onPress={() => { router.push('/(tabs)/campaigns') }}>
                <Typo style={styles.seeAll} color={theme.colors.textSecondary}>More</Typo>
              </Pressable>
            </View>

            <LatestCampaign
              data={latestCampaign}
              // isRefreshing={isRefreshing}
              // onRefresh={onRefresh}
              isLoading={isLoadingLatestCampaign}
            />

            <LatestCategories
              categories={latestCategories}
              selectedId={selectedCategory}
              onSelect={handleCategorySelect}
              // isRefreshing={isRefreshing}
              // onRefresh={onRefresh}
              isLoading={isLoadingLatestCategory}
            />
          </>
        }
        // ListFooterComponent={
        //   paginationLoading && hasMore ? (
        //     <View style={{ paddingVertical: 20 }}>
        //       <Loading />
        //     </View>
        //   ) : null
        // }
        // onEndReached={() => {
        //   if (hasMore && !paginationLoading) {
        //     setPage(prev => prev + 1);
        //   }
        // }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.white}
          />
        }
        contentContainerStyle={styles.scrollViewStyle}
        inverted={isRTL}
        ListFooterComponent={
          catCampaign.length > 0 ? (
            <View style={{ alignItems: 'center', marginVertical: spacingY._10 }}>
              <Pressable
                onPress={() => router.push(`/(tabs)/campaigns`)}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  shadowColor: theme.colors.primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Typo color={theme.colors.white} style={{ fontWeight: 'bold' }}>
                  See more from this category
                </Typo>
              </Pressable>
            </View>
          ) : null
        }


        directionalLockEnabled={true}
        bounces={false}
        alwaysBounceVertical={false}
        scrollEventThrottle={16}
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
  scrollViewStyle: {
    // marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    // gap: spacingY._25
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: verticalScale(10),
    alignItems: 'center',
    marginHorizontal: verticalScale(20),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(20),
  },
  mainTitle: {
    fontSize: verticalScale(20),
    fontWeight: '700'
  },
  seeAll: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    marginTop: verticalScale(5)
  },
})