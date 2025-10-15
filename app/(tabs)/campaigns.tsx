import apiClient from '@/api/apiClient'
import CampaignCard from '@/components/app/CampaignCard'
import Header from '@/components/header'
import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Skeleton from '@/components/skeleton'
import Typo from '@/components/Typo'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { spacingX, spacingY } from '@/types/theme'
import { CampaignCardProps } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

const campaign = () => {
    const { theme } = useTheme();
    const { isRTL } = useLanguage();

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
            <Header rightIcon={<Ionicons
                name='person-circle-outline'
                size={verticalScale(30)}
                color={theme.colors.primary}
            />} />
            <View style={{ marginTop: verticalScale(10) }}>
                {isLoadingCampaign ? (
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
                            onEndReached={() => {
                                if (hasMore && !paginationLoading) {
                                    setPage(prev => prev + 1);
                                }
                            }}
                            // inverted={isRTL}
                            directionalLockEnabled={true}
                            bounces={false}
                            alwaysBounceVertical={false}
                            scrollEventThrottle={16}
                        />
                        {errorMessage ? (
                            <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
                        ) : null}
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
})