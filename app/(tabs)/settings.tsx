import Header from '@/components/header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/UserContext'
import { radius, spacingX, ThemeMode } from '@/types/theme'
import { accountOptionType } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'

const settings = () => {
    const { theme, setThemeMode, mode } = useTheme()
    const { language, setLanguage, isRTL, t } = useLanguage()
    const { isAuthenticated, logout } = useAuth()
    const [notifications, setNotifications] = useState(true);
    const [name, setName] = useState<string | null>(null);

    const accountOptions: accountOptionType[] = [
        {
            title: isAuthenticated ? t('account') : t('login'),
            icon: <Ionicons name="person-outline" size={22} color="#fff" />,
            bgColor: "#4A90E2",
            routeName: isAuthenticated ? "/(modals)/account" : '/(auth)',
        },
        ...(isAuthenticated
            ? [
                {
                    title: t('history'),
                    icon: <Ionicons name="time" size={22} color="#fff" />,
                    bgColor: "#F5A623",
                    routeName: "/(modals)/history",
                },
            ]
            : []),

        // {
        //     title: "Notifications",
        //     icon: <Ionicons name="notifications-outline" size={22} color="#fff" />,
        //     bgColor: "#F5A623",
        //     // routeName: "/notifications",
        // },
        {
            title: t('privacy'),
            icon: <MaterialIcons name="privacy-tip" size={22} color="#fff" />,
            bgColor: "#7ED321",
            // routeName: "/privacy",
        },
        {
            title: t('help'),
            icon: <Ionicons name="help-circle-outline" size={22} color="#fff" />,
            bgColor: "#9013FE",
            // routeName: "/help",
        },
    ];

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
            <View style={[styles.container]}>

                {/* THEME MODE */}
                <View style={[styles.section, { backgroundColor: theme.colors.containerBackground }]}>
                    <Typo style={styles.sectionTitle}>{t('theme')}</Typo>
                    <View style={styles.themeRow}>
                        {['light', 'dark', 'system'].map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => setThemeMode(m as ThemeMode)}
                                style={[
                                    styles.themeButton,
                                    mode === m && { backgroundColor: theme.colors.primary },
                                ]}
                            >
                                <Typo
                                    style={styles.themeText}
                                    color={mode === m ? "#fff" : theme.colors.text}
                                >
                                    {m.toUpperCase()}
                                </Typo>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* LANGUAGES */}
                <View style={[styles.section, { backgroundColor: theme.colors.containerBackground }]}>
                    <Typo style={styles.sectionTitle}>{t('lang')}</Typo>
                    <View style={styles.themeRow}>
                        {["en", "ar"].map((lang) => (
                            <TouchableOpacity
                                key={lang}
                                onPress={() => setLanguage(lang as any)}
                                style={[
                                    styles.themeButton,
                                    language === lang && { backgroundColor: theme.colors.primary },
                                ]}
                            >
                                <Typo
                                    style={styles.themeText}
                                    color={language === lang ? "#fff" : theme.colors.text}
                                >
                                    {lang === "en" ? "English" : "العربية"}
                                </Typo>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* NOTIFICATIONS */}
                {/* <View style={[styles.section, { backgroundColor: theme.colors.containerBackground }]}>
                    <Typo style={styles.sectionTitle}>
                        Notifications
                    </Typo>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        thumbColor={notifications ? "#4A90E2" : "#888"}
                    />
                </View> */}

                {/* OTHER SETTINGS */}
                <FlatList
                    data={accountOptions}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => item.routeName && router.push(item.routeName)}
                            style={[styles.option, { backgroundColor: theme.colors.containerBackground }]}
                        >
                            <View
                                style={[styles.iconWrapper, { backgroundColor: item.bgColor, marginRight: isRTL ? undefined : 12, marginLeft: isRTL ? 12 : undefined }]}
                            >
                                {item.icon}
                            </View>
                            <Typo style={styles.optionText}>
                                {item.title}
                            </Typo>
                            <Ionicons
                                name={isRTL ? "chevron-back" : "chevron-forward"}
                                size={20}
                                color={theme.colors.text}
                                style={{ marginLeft: isRTL ? undefined : "auto", marginRight: isRTL ? "auto" : undefined }}
                            />
                        </TouchableOpacity>
                    )}
                    directionalLockEnabled={true}
                    bounces={false}
                    alwaysBounceVertical={false}
                    scrollEventThrottle={16}
                />
            </View>
        </ScreenWrapper>
    )
}

export default settings

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    section: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
    themeRow: {
        flexDirection: "row",
        gap: 8,
    },
    themeButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    themeText: { fontSize: 14, fontWeight: "500" },
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        // marginRight: 12,
    },
    optionText: { fontSize: 16, fontWeight: "500" },
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