import apiClient from '@/api/apiClient'
import CampaignCard from '@/components/app/CampaignCard'
import SkeletonCardCampaign from '@/components/app/SkeletonCardCampaign'
import Header from '@/components/header'
import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useLanguage } from '@/context/LanguageContext'
import { useSave } from '@/context/SavedContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/UserContext'
import { radius, spacingX, spacingY } from '@/types/theme'
import { CampaignCardProps } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

const campaign = () => {
    const { theme } = useTheme();
    const { isRTL, t } = useLanguage();
    const { isAuthenticated, logout } = useAuth()
    const { savedCampaignIds, fetchSavedCampaigns, handleToggleSave } = useSave();

    const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState<string | null>(null);

    const onRefresh = async () => {
        setIsRefreshing(true);
        setPage(1);
        try {
            await fetchData(1);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSavedCampaigns();
    }, []);

    const handleLoadMore = () => {
        if (hasMore && !paginationLoading && !isLoadingCampaign) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchData(nextPage);
        }
    };

    const fetchData = async (pageNumber = 1) => {
        try {
            if (pageNumber === 1) {
                setIsLoadingCampaign(true);
                setErrorMessage('');
            } else {
                setPaginationLoading(true);
            }

            const campaignRes = await apiClient.get(`/api/campaigns/all?page=${pageNumber}`)
            const newCampaigns = campaignRes.data.campaigns.data;
            const totalPages = campaignRes.data.campaigns.last_page;

            if (pageNumber === 1) {
                setCampaigns(newCampaigns);
            } else {
                setCampaigns(prev => [...prev, ...newCampaigns]);
            }

            setHasMore(pageNumber < totalPages);
        } catch (err: any) {
            console.log("Error:", err.message);
            const message = err?.response?.data?.message || err?.message || 'Something went wrong.';
            setErrorMessage(message);
        } finally {
            setIsLoadingCampaign(false);
            setPaginationLoading(false);
        }
    };

    useEffect(() => {
        if (!errorMessage) {
            fetchData(page);
        }
    }, [page]);

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
            <View style={{ marginTop: verticalScale(10) }}>
                {isLoadingCampaign ? (
                    <FlatList
                        data={Array.from({ length: 3 })}
                        renderItem={() => (
                            <View style={{ marginVertical: spacingY._5, alignItems: 'center' }}>
                                <SkeletonCardCampaign width={screenWidth * 0.9} />
                            </View>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        scrollEnabled={false}
                    />
                ) : errorMessage ? (
                    <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
                ) : campaigns.length === 0 ? (
                    <Typo style={styles.notfound} size={15} fontWeight={'400'} color={theme.colors.textSecondary}>{t('nocampaign')}</Typo>
                ) : (
                    <>
                        <FlatList
                            data={campaigns}
                            renderItem={({ item }) => (
                                <View style={{ marginVertical: spacingY._5, alignItems: 'center' }}>
                                    <CampaignCard {...item} cardWidth={screenWidth * 0.9} isLoading={isLoadingCampaign} isSaved={savedCampaignIds.includes(item.id)}
                                        onToggleSave={() => isAuthenticated ? handleToggleSave(item.id) : router.push('/(auth)') } />
                                </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: verticalScale(12),
                                marginBottom: verticalScale(10),
                                paddingBottom: verticalScale(150),
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={onRefresh}
                                    colors={[theme.colors.primary]}
                                    tintColor={theme.colors.primary}
                                />
                            }
                            ListFooterComponent={
                                paginationLoading && hasMore ? (
                                    <View style={{ paddingVertical: 20 }}>
                                        <Loading />
                                    </View>
                                ) : null
                            }
                            // onEndReached={() => {
                            //     if (hasMore && !paginationLoading) {
                            //         setPage(prev => prev + 1);
                            //     }
                            // }}
                            onEndReached={handleLoadMore}
                            // inverted={isRTL}
                            directionalLockEnabled={true}
                            bounces={false}
                            alwaysBounceVertical={false}
                            scrollEventThrottle={16}
                        />
                    </>
                )}
            </View>
        </ScreenWrapper>
    )
}

export default campaign

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        marginTop: 0,
        alignSelf: 'center',
        paddingHorizontal: verticalScale(50)
    },
    notfound: {
        marginTop: 0,
        alignSelf: 'center',
        paddingHorizontal: verticalScale(50)
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        width: verticalScale(50),
        // backgroundColor: 'red',
        height: verticalScale(50),
        borderRadius: radius._30
    },
    iconButton: {
        // position: "absolute",
        // top: 10,
        borderRadius: 50,
        padding: 6,
    },
})