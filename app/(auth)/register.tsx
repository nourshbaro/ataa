import apiClient from '@/api/apiClient';
import BackButton from '@/components/backButton';
import Button from '@/components/Button';
import Header from '@/components/header';
import Input from '@/components/input';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/UserContext';
import { radius, spacingY } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { styles } from '../../styles/authform.styles';
import { useLanguage } from '@/context/LanguageContext';

const register = () => {
    const { theme } = useTheme();
    const { t } = useLanguage()
    const { setAccessToken } = useAuth()
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            alert('Please Fill All Fields');
            return;
        }
        setError('');
        setIsLoading(true)

        try {
            const response = await apiClient.post('/api/donor/register', { name, email, password });
            const data = response.data;
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.expires_in;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('expires_in', JSON.stringify(expiresIn));
            await AsyncStorage.setItem('name', data.user.name);

            setAccessToken(accessToken);

            router.replace('/(tabs)')
        } catch (error) {
            console.error('Signup failed', error);
            console.log(name, email, password);

            setError('Invalid email.');
        } finally {
            setIsLoading(false)
        }
    };

    {
        isLoading && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </View>
        )
    }

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <Header
                    title=""
                    leftIcon={<BackButton />}
                />
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>

                        <View style={{ gap: 5, marginTop: spacingY._20, }}>
                            <Typo size={28} fontWeight={'bold'}>{t('createaccount')}</Typo>
                            <Typo size={15} fontWeight={'300'} color={theme.colors.textSecondary}>{t('fill')}</Typo>
                        </View>

                        {/** form */}

                        <View style={[styles.form]}>

                            <View style={{ borderWidth: 1, borderRadius: radius._15, paddingHorizontal: spacingY._15, borderColor: theme.colors.text }}>
                                <Input
                                    placeholder={t('name')}
                                    onChangeText={setName}
                                    editable={!isLoading}
                                    style={{ height: verticalScale(54), color: theme.colors.textPrimary }}
                                    icon={<MaterialIcons
                                        name='person'
                                        size={verticalScale(26)}
                                        color={theme.colors.textSecondary}
                                        weight='fill'
                                    />
                                    }
                                />
                            </View>
                            {/** input */}
                            <View style={{ borderWidth: 1, borderRadius: radius._15, paddingHorizontal: spacingY._15, borderColor: theme.colors.text }}>
                                <Input
                                    placeholder={t('email')}
                                    onChangeText={setEmail}
                                    editable={!isLoading}
                                    style={{ height: verticalScale(54), color: theme.colors.textPrimary }}
                                    icon={<MaterialIcons
                                        name='email'
                                        size={verticalScale(26)}
                                        color={theme.colors.textSecondary}
                                        weight='fill'
                                    />
                                    }
                                />
                            </View>
                            <View style={{ borderWidth: 1, borderRadius: radius._15, paddingHorizontal: spacingY._15, borderColor: theme.colors.text }}>
                                <Input
                                    placeholder={t('pass')}
                                    secureTextEntry
                                    onChangeText={setPassword}
                                    editable={!isLoading}
                                    style={{ height: verticalScale(54), color: theme.colors.textPrimary }}
                                    icon={<MaterialIcons
                                        name='lock'
                                        size={verticalScale(26)}
                                        color={theme.colors.textSecondary}
                                        weight='fill'
                                    />
                                    }
                                />
                            </View>
                            {error ? <Typo style={styles.errorText}>{stripHtml(error)}</Typo> : null}

                        </View>

                        <View style={styles.footer}>
                            <Button loading={isLoading} disabled={isLoading} onPress={handleSubmit} style={{ width: '100%', marginBottom: spacingY._15 }}>
                                <Typo fontWeight={'500'} color={theme.colors.background} size={21}>{t('proceed')}</Typo>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    )
}

export default register
