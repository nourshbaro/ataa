import apiClient from '@/api/apiClient';
import BackButton from '@/components/backButton';
import Button from '@/components/Button';
import Header from '@/components/header';
import Input from '@/components/input';
import ModalWrapper from '@/components/modalWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/UserContext';
import { radius, spacingY } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

type Data = {
    id: number
    name: string
    email: string
}

const Account = () => {
    const { theme } = useTheme()
    const { accessToken } = useAuth()
    const { t } = useLanguage()
    const { isAuthenticated, logout } = useAuth()
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [data, setData] = useState<Data>();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchData()
    }, [])

    const onRefresh = async () => {
        setIsRefreshing(true);
        setIsLoading(true)

        try {
            await fetchData();
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false)
        }
    };

    const fetchData = async () => {
        try {
            setErrorMessage('');
            setIsLoading(true);

            const response = await apiClient.get("/api/donor/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const result = await response.data;

            setData(result)
            AsyncStorage.setItem('name', result.name || 'Unknown')
        } catch (err: any) {
            console.log("Error:", err.message);
            const message = err?.response?.data?.message || err?.message || 'Something went wrong.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />
                {/** header */}
                <Header title={t('info')} />

                {/** form */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.form}
                >
                    {/* <View style={styles.userInfo}> */}
                    {/** avatar */}
                    {/* <View style={[styles.avatarBackground, { backgroundColor: theme.colors.transparent, borderColor: theme.colors.primary }]}>
                            <Image
                                source={require('@/assets/images/transparent.png')}
                                style={styles.avatarImage}
                                contentFit="contain"
                                transition={100}
                            />
                        </View>

                    </View> */}
                    <View style={styles.form}>

                        {/* <View style={styles.inputContainer}>
                            <Typo>Name</Typo>
                            <Input value={userData.name} editable={false} style={{ height: verticalScale(54), color: theme.colors.textSecondary }} />
                        </View> */}

                        <View style={styles.inputContainer}>
                            <Typo>{t('name')}</Typo>
                            <View style={{ borderWidth: 1, borderRadius: radius._15, paddingHorizontal: spacingY._15, borderColor: theme.colors.text }}>
                                <Input value={data?.name} editable={false} style={{ height: verticalScale(54), color: theme.colors.textPrimary }} />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Typo>{t('email')}</Typo>
                            <View style={{ borderWidth: 1, borderRadius: radius._15, paddingHorizontal: spacingY._15, borderColor: theme.colors.text }}>
                                <Input value={data?.email} editable={false} style={{ height: verticalScale(54), color: theme.colors.white }} />
                            </View>
                        </View>


                    </View>

                    {errorMessage == 'Network Error' ? <Typo style={styles.errorText}>Network Error</Typo> : null}
                </ScrollView>
                <View style={styles.inputContainer}>
                    {/* <Typo>Logout</Typo> */}
                    <Button style={{ backgroundColor: theme.colors.transparent, borderColor: theme.colors.error, borderWidth: 1, flexDirection: 'row' }} onPress={() => logout()}>
                        <Entypo name="log-out" size={24} color={theme.colors.error} />
                        <Typo size={16} fontWeight="medium" style={{ marginHorizontal: verticalScale(8) }} color={theme.colors.error}>
                            {t('logout')}
                        </Typo>
                    </Button>
                    {/* <View style={{ borderWidth: 1, borderRadius: radius._15, paddingHorizontal: spacingY._15, borderColor: theme.colors.text }}>

                            </View> */}
                </View>
            </View>
        </ModalWrapper>
    );
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingY._20,
        marginTop: Platform.OS == 'ios' ? spacingY._35 : 0
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    userInfo: {
        // marginTop: verticalScale(30),
        alignItems: 'center',
        gap: spacingY._15,
    },
    avatarBackground: {
        width: verticalScale(150),
        height: verticalScale(150),
        borderRadius: verticalScale(65),
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: verticalScale(130),
        height: verticalScale(130),
    },
    inputContainer: {
        gap: spacingY._10
    },
    errorText: {
        color: 'red',
        marginTop: 0,
        alignSelf: 'center',
        paddingHorizontal: verticalScale(50)
    },
})