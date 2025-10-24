import { useLanguage } from '@/context/LanguageContext';
import { useSave } from '@/context/SavedContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/UserContext';
import { spacingY } from '@/types/theme';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Skeleton from '../skeleton';
import CampaignCard from './CampaignCard';

type LatestCampaignProps = {
    data: any[];
    isRefreshing: boolean;
    onRefresh: () => void;
    isLoading: boolean;
};

const { width: screenWidth } = Dimensions.get('window');

const CatCampaign = ({ data, isRefreshing, onRefresh, isLoading }: LatestCampaignProps) => {
    const { theme } = useTheme()
    const { isRTL } = useLanguage()
    const { savedCampaignIds, fetchSavedCampaigns, handleToggleSave } = useSave();
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        fetchSavedCampaigns();
      }, []);

    return (
        <View style={{ flexGrow: 0 }}>
            {isLoading ? (
                <FlatList
                    data={[1]} // placeholder skeletons
                    // horizontal
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => (
                        <View style={{ marginVertical: spacingY._10 }}>
                            <View
                                style={{
                                    backgroundColor: theme.colors.containerBackground,
                                    borderRadius: 16,
                                    paddingBottom: 10,
                                    marginHorizontal: 6,
                                    width: screenWidth * 0.90,
                                    overflow: "hidden",
                                }}
                            >
                                {/* Image */}
                                <Skeleton height={200} radius={16} />

                                {/* Title */}
                                <Skeleton
                                    height={20}
                                    width={'50%'}
                                    radius={6}
                                    style={{ marginTop: 8, marginHorizontal: 10 }}
                                />

                                {/* Separator */}
                                <Skeleton
                                    height={1}
                                    width={'87%'}
                                    radius={0}
                                    style={{ marginVertical: 8, marginHorizontal: 20, alignSelf: "center" }}
                                />

                                {/* Progress Bar */}
                                <Skeleton
                                    height={10}
                                    width={'90%'}
                                    radius={6}
                                    style={{ marginVertical: 8, marginHorizontal: 10, alignSelf: "center" }}
                                />

                                {/* Funding Info */}
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
                    )}
                    contentContainerStyle={{
                        alignItems: "center",
                        paddingHorizontal: 10,
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    //   horizontal
                    //   showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: spacingY._10 }}>
                            <CampaignCard {...item} cardWidth={screenWidth * 0.95} isLoading={isLoading} isSaved={savedCampaignIds.includes(item.id)}
                                onToggleSave={() => isAuthenticated ? handleToggleSave(item.id) : router.push('/(auth)') } />
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    contentContainerStyle={{
                        alignItems: "center",
                        padding: 10,
                        paddingBottom: spacingY._100
                    }}
                    inverted={isRTL}
                />
            )}
        </View>
    );
}

export default CatCampaign

const styles = StyleSheet.create({})