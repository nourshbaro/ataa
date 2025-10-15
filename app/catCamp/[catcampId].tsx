import apiClient from '@/api/apiClient'
import CampaignCard from '@/components/app/CampaignCard'
import BackButton from '@/components/backButton'
import Header from '@/components/header'
import Loading from '@/components/Loading'
import ModalWrapper from '@/components/modalWrapper'
import Skeleton from '@/components/skeleton'
import Typo from '@/components/Typo'
import { useTheme } from '@/context/ThemeContext'
import { spacingX, spacingY } from '@/types/theme'
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

    useEffect(() => {
        if (page > 1 && catcampId) fetchData(page);
    }, [page]);

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

    // const shareNews = () => {
    //     Share.share({
    //         message: `Check out on Digital Star News: \n${post?.title?.rendered || 'Digital Star News Post'}\n\n${post?.link}`,
    //         title: post?.title?.rendered || 'DStar News Post',
    //     })
    // }

    return (
        <ModalWrapper>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Header
                    title=""
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10, flex: 1 }}
                />
                {/* <TouchableOpacity onPress={() => { }} style={{
                    backgroundColor: theme.colors.disabled, alignSelf: 'flex-start',
                    borderRadius: radius._12,
                    borderCurve: 'continuous',
                    padding: 5
                }}>
                    <MaterialIcons
                        name='share'
                        size={verticalScale(26)}
                        color={theme.colors.white}
                        weight='bold'
                    />
                </TouchableOpacity> */}
            </View>
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
                            <Skeleton height={20} width={'50%'} radius={6} style={{ marginTop: 8, marginHorizontal: 10 }} />
                            <Skeleton height={1} width={'87%'} radius={0} style={{ marginVertical: 8, marginHorizontal: 20, alignSelf: "center" }} />
                            <Skeleton height={10} width={'90%'} radius={6} style={{ marginVertical: 8, marginHorizontal: 10, alignSelf: "center" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginTop: 8 }}>
                                <Skeleton width="60%" height={16} radius={4} />
                                <Skeleton width={40} height={16} radius={4} />
                            </View>
                        </View>
                    </View>
                ) : errorMessage ? (
                    <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
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
                                if (hasMore && !paginationLoading) setPage(prev => prev + 1);
                            }}
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
});
