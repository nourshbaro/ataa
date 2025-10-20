import apiClient from '@/api/apiClient'
import CategoryCard from '@/components/app/CategoryCard'
import Header from '@/components/header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Skeleton from '@/components/skeleton'
import Typo from '@/components/Typo'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/UserContext'
import { radius, spacingX } from '@/types/theme'
import { Categories } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import { Entypo, Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

const numColumns = 3;
const horizontalPadding = verticalScale(24);
const spacingBetweenColumns = verticalScale(10);

const itemWidth =
    (screenWidth - horizontalPadding - spacingBetweenColumns * (numColumns - 1)) / numColumns;

const category = () => {
    const { theme } = useTheme();
    const { isRTL,t } = useLanguage();
    const { isAuthenticated, logout } = useAuth()
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState<string | null>(null);

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
            setErrorMessage('');
            setIsLoadingCategory(true);

            const categoryRes = await apiClient.get("/api/categories/all")

            const categories = categoryRes.data.data;
            setCategories(categories)
        } catch (err: any) {
            console.log("Error:", err.message);
            const message = err?.response?.data?.message || err?.message || 'Something went wrong.';
            setErrorMessage(message);
        } finally {
            setIsLoadingCategory(false);
        }
    };

    useEffect(() => {
        const fetchName = async () => {
            const storedName = await AsyncStorage.getItem('name');
            if (storedName) {
                setName(storedName);
            }
        };
        fetchName();
    }, []);


    // router.push({
    //       pathname: '/catCamp/[catcampId]',
    //       params: { id: selectedId },
    //     });
    return (
        <ScreenWrapper>
            <Header
                style={{ marginTop: verticalScale(10) }}
                leftIcon={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/noprofile.jpg')}
                            style={styles.image}
                            resizeMode="cover"
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
                        onPress={() => { }}
                        style={[styles.iconButton, { left: isRTL ? 10 : undefined, right: isRTL ? undefined : 10 }]}
                    >
                        <Ionicons
                            name={"heart-outline"}
                            size={30}
                            color={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                } />
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
                ) : errorMessage ? (
                    <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
                ) : categories.length === 0 ? (
                    <Typo style={styles.notfound} size={15} fontWeight={'400'} color={theme.colors.textSecondary}>{t('nocat')}</Typo>
                ) : (
                    <>
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
                                marginBottom: verticalScale(10),
                                // paddingBottom: verticalScale(100),
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
                        {/* {errorMessage ? (
                            <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
                        ) : null} */}
                    </>
                )}
            </View>
        </ScreenWrapper>
    )
}

export default category

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
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
    notfound: {
        marginTop: 0,
        alignSelf: 'center',
        paddingHorizontal: verticalScale(50)
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