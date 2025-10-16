import apiClient from '@/api/apiClient'
import CampaignCard from '@/components/app/CampaignCard'
import SkeletonCardCampaign from '@/components/app/SkeletonCardCampaign'
import Header from '@/components/header'
import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/UserContext'
import { spacingY } from '@/types/theme'
import { CampaignCardProps } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

const campaign = () => {
    const { theme } = useTheme();
    const { isRTL } = useLanguage();
    const { isAuthenticated, logout } = useAuth()

    const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    return (
        <ScreenWrapper>
            <Header
                style={{ marginTop: verticalScale(10) }}
                rightIcon={
                    <TouchableOpacity
                        onPress={() => {
                            isAuthenticated ?
                                logout() : router.push('/(auth)')
                        }}
                        style={[
                            styles.loginButton,
                            { borderColor: isAuthenticated ? theme.colors.error : theme.colors.textPrimary }
                        ]}
                    >
                        {
                            isAuthenticated ? (
                                <>
                                    <Entypo name="log-out" size={24} color={theme.colors.error} />
                                    <Typo size={16} fontWeight="medium" style={{ marginHorizontal: verticalScale(8) }} color={theme.colors.error}>
                                        Logout
                                    </Typo>
                                </>
                            ) : (
                                <>
                                    <Entypo name="login" size={24} color={theme.colors.textPrimary} />
                                    <Typo size={16} fontWeight="medium" style={{ marginHorizontal: verticalScale(8) }}>
                                        Login
                                    </Typo>
                                </>
                            )
                        }
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
                    <Typo style={styles.notfound} size={15} fontWeight={'400'} color={theme.colors.textSecondary}>No campaigns found</Typo>
                ) : (
                    <>
                        <FlatList
                            data={campaigns}
                            renderItem={({ item }) => (
                                <View style={{ marginVertical: spacingY._5, alignItems: 'center' }}>
                                    <CampaignCard {...item} cardWidth={screenWidth * 0.9} isLoading={isLoadingCampaign} />
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
})