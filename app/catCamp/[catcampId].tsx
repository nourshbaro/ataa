import apiClient from '@/api/apiClient'
import CampaignCard from '@/components/app/CampaignCard'
import SkeletonCardCampaign from '@/components/app/SkeletonCardCampaign'
import BackButton from '@/components/backButton'
import Header from '@/components/header'
import Loading from '@/components/Loading'
import ModalWrapper from '@/components/modalWrapper'
import Typo from '@/components/Typo'
import { useTheme } from '@/context/ThemeContext'
import { spacingY } from '@/types/theme'
import { verticalScale } from '@/utils/styling'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

const CategoryCampaign = () => {
    const { catcampId } = useLocalSearchParams();
    const { theme } = useTheme();

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (catcampId) fetchData(1);
    }, [catcampId]);

    // useEffect(() => {
    //     if (page > 1 && catcampId) fetchData(page);
    // }, [page]);

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
        if (!hasMore || paginationLoading || isLoadingCampaign) return;
        setPaginationLoading(true);
        const nextPage = page + 1;
        fetchData(nextPage);
        setPage(nextPage);
    };

    const fetchData = async (pageNumber = 1) => {
        try {
            setErrorMessage('');
            if (pageNumber === 1) setIsLoadingCampaign(true);
            else setPaginationLoading(true);

            const res = await apiClient.get(`/api/campaigns/category/${catcampId}?page=${pageNumber}`);

            const newCampaigns = res.data.campaigns?.data || res.data.data || [];
            const totalPages = res.data.campaigns?.last_page || 1;

            if (pageNumber === 1) setCampaigns(newCampaigns);
            else setCampaigns(prev => [...prev, ...newCampaigns]);

            setHasMore(pageNumber < totalPages);
        } catch (e: any) {
            console.log("Error fetching campaigns:", e.message);
            const message = e?.response?.data?.message || e?.message || 'Something went wrong.';
            setErrorMessage(message);
        } finally {
            setIsLoadingCampaign(false);
            setPaginationLoading(false);
        }
    };

    return (
        <ModalWrapper>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Header
                    title=""
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10, flex: 1 }}
                />
            </View>
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
                            //     if (hasMore && !paginationLoading) setPage(prev => prev + 1);
                            // }}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            bounces={false}
                            scrollEventThrottle={16}
                        />
                    </>
                )}
            </View>
        </ModalWrapper>
    );
};

export default CategoryCampaign;

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
    }
});
