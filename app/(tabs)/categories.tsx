import apiClient from '@/api/apiClient'
import CategoryCard from '@/components/app/CategoryCard'
import Header from '@/components/header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Skeleton from '@/components/skeleton'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { Categories } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

const numColumns = 3;
const horizontalPadding = verticalScale(24);
const spacingBetweenColumns = verticalScale(10);

const itemWidth =
    (screenWidth - horizontalPadding - spacingBetweenColumns * (numColumns - 1)) / numColumns;

const category = () => {
    const { theme } = useTheme();
    const { isRTL } = useLanguage();
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [categories, setCategories] = useState<Categories[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setIsRefreshing(true);
        setIsLoadingCategory(true)

        try {
            await fetchData();
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
            setIsLoadingCategory(false)
        }
    };

    const fetchData = async () => {
        try {
            setIsLoadingCategory(true);

            const categoryRes = await apiClient.get("/api/categories/all")

            const categories = categoryRes.data.data;
            setCategories(categories)
        } catch (err: any) {
            console.log("Error:", err.message);
        } finally {
            setIsLoadingCategory(false);
        }
    };


    // router.push({
    //       pathname: '/catCamp/[catcampId]',
    //       params: { id: selectedId },
    //     });
    return (
        <ScreenWrapper>
            <Header rightIcon={<Ionicons
                name='person-circle-outline'
                size={verticalScale(30)}
                color={theme.colors.primary}
            />} />
            <View style={{ marginTop: verticalScale(10) }}>
                {isLoadingCategory ? (
                    <FlatList
                        data={[1, 2, 3]}
                        horizontal
                        keyExtractor={(item) => item.toString()}
                        renderItem={() => (
                            <Skeleton
                                style={{
                                    width: itemWidth * 0.9,
                                    height: itemWidth * 0.8,
                                    borderRadius: 12,
                                    backgroundColor: theme.colors.surface,
                                    marginHorizontal: verticalScale(8),
                                }}
                            />
                        )}
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: verticalScale(12),
                            // marginBottom: verticalScale(10),
                            paddingBottom: verticalScale(100),
                        }}
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={categories}
                        key={`numColumns-3`}
                        renderItem={({ item }) => (
                            <View style={{ width: itemWidth, alignItems: 'center', marginBottom: verticalScale(10) }}>
                                <CategoryCard
                                    id={item.id}
                                    name={item.name}
                                    icon={item.icon}
                                    selectedId={0}
                                    onSelect={() => {
                                        router.push({
                                            pathname: '/catCamp/[catcampId]',
                                            params: { catcampId: item.id },
                                        })
                                    }}
                                    width={itemWidth * 0.9}
                                    height={itemWidth * 0.8}
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={{
                            justifyContent: 'space-between',
                            // marginBottom: verticalScale(10),
                            paddingBottom: verticalScale(100),
                        }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: verticalScale(12),
                            // marginBottom: verticalScale(10),
                            paddingBottom: verticalScale(100),
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primary]}
                                tintColor={theme.colors.primary}
                            />
                        }
                        // inverted={isRTL}
                        directionalLockEnabled={true}
                        bounces={false}
                        alwaysBounceVertical={false}
                        scrollEventThrottle={16}
                    />
                )}
            </View>
        </ScreenWrapper>
    )
}

export default category

const styles = StyleSheet.create({})