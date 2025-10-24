import apiClient from '@/api/apiClient';
import CampaignCard from '@/components/app/CampaignCard';
import LatestCampaign from '@/components/app/LatestCampaign';
import LatestCategories from '@/components/app/LatestCategories';
import SkeletonCardCampaign from '@/components/app/SkeletonCardCampaign';
import Header from '@/components/header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useSave } from '@/context/SavedContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/UserContext';
import styles from '@/styles/index.styles';
import { spacingX, spacingY } from '@/types/theme';
import { Campaigns, Categories } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, RefreshControl, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const index = () => {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()
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
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState<string | null>(null);
  const { savedCampaignIds, fetchSavedCampaigns, handleToggleSave } = useSave();

  useEffect(() => {
    fetchData();
    fetchSavedCampaigns();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsLoadingCatCampaign(true)
    setIsLoadingLatestCampaign(true)
    setIsLoadingLatestCategory(true)

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
      setErrorMessage('');
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
      const message = err?.response?.data?.message || err?.message || 'Something went wrong.';
      setErrorMessage(message);
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

  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }
    };
    fetchName();
  }, []);

  return (
    <ScreenWrapper>
      <Header
        style={{ marginTop: verticalScale(10) }}
        leftIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/ataalogo.png')}
              style={styles.image}
              resizeMode="contain"
            />

            {name ? (
              <View style={{ marginHorizontal: spacingX._10 }}>
                <Typo size={16} fontWeight='bold'>{t('welcome')}</Typo>
                <Typo color={theme.colors.textSecondary}>{name}</Typo>
              </View>
            ) : (
              <View style={{ marginHorizontal: spacingX._10 }}>
                <Typo size={18} fontWeight="bold">{t('welcome')}</Typo>
                <TouchableOpacity onPress={() => router.push('/(auth)')} style={{ flexDirection: 'row' }}>
                  <Typo color={theme.colors.textSecondary} size={16}>{t('login')}</Typo>
                  <Ionicons
                    name={isRTL ? "chevron-back" : "chevron-forward"}
                    size={18}
                    color={theme.colors.text}
                    style={{ marginLeft: isRTL ? undefined : "auto", marginRight: isRTL ? "auto" : undefined, top: 3 }}
                  />
                </TouchableOpacity>
              </View>
            )}

          </View>
        }
        rightIcon={
          <TouchableOpacity
            onPress={() => { router.push('/(modals)/saved') }}
            style={[styles.iconButton, { left: isRTL ? 10 : undefined, right: isRTL ? undefined : 10 }]}
          >
            <Ionicons
              name={"bookmark-outline"}
              size={30}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        } />

      < FlatList
        data={catCampaign}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !showEmpty ? (
            <SkeletonCardCampaign width={screenWidth * 0.9} />
          ) : errorMessage ? (
            <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
          ) : catCampaign.length === 0 ? (
            <Typo style={styles.notfound} size={15} fontWeight={'400'} color={theme.colors.textSecondary}>{t('nocampaign')}</Typo>
          ) : (
            <View style={{ marginTop: spacingY._15 }}>
              <Typo size={15} color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
                {t('nocampaign')}
              </Typo>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginVertical: spacingY._5, alignItems: 'center' }}>
            <CampaignCard {...item} cardWidth={screenWidth * 0.9} isLoading={isLoadingCatCampaign} isSaved={savedCampaignIds.includes(item.id)}
              onToggleSave={() => isAuthenticated ? handleToggleSave(item.id) : router.push('/(auth)') } />
          </View>
        )}
        ListHeaderComponent={
          errorMessage ? (
            null
          ) : (
            <>
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
          )
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
          < RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.white}
          />
        }
        contentContainerStyle={styles.scrollViewStyle}
        // inverted={isRTL}
        ListFooterComponent={
          catCampaign.length > 0 ? (
            <View style={{ alignItems: 'center', marginVertical: spacingY._10 }}>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: '/catCamp/[catcampId]',
                    params: { catcampId: selectedCategory },
                  })
                }}
                style={{
                  // backgroundColor: theme.colors.primary,
                  // paddingVertical: 10,
                  paddingHorizontal: 20,
                  // borderRadius: 12,
                  // shadowColor: theme.colors.primary,
                  // shadowOpacity: 0.3,
                  // shadowRadius: 6,
                  // elevation: 4,
                }}
              >
                <Typo color={theme.colors.textSecondary} style={{ fontSize: 15 }} fontWeight={'bold'}>
                  {t('viewmore')}
                  {/* See more from this category */}
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
    </ScreenWrapper >
  )
}

export default index