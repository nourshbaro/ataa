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
import { spacingY } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { styles } from '../../styles/authform.styles';

const login = () => {
    const { theme } = useTheme();
    const router = useRouter();

    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const { setAccessToken } = useAuth();
    const [cooldown, setCooldown] = useState(0); 
    const cooldownSeconds = 60;       

    const canSubmit = cooldown === 0;

    const startCooldown = () => setCooldown(cooldownSeconds);

    useEffect(() => {
        if (cooldown === 0) return;
        const id = setInterval(() => setCooldown(c => c - 1), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const handleSubmit = async () => {
        if (!email || !password) {
            alert('Please Fill All Fields');
            return;
        }
        setError('');
        setIsLoading(true)

        try {
            const response = await apiClient.post("/api/donor/login", { email, password });
            const data = response.data;
            const accessToken = data.access_token.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.access_token.expires_in;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('expires_in', JSON.stringify(expiresIn));

            setAccessToken(accessToken);
            router.replace('/(tabs)')

        } catch (error) {
            console.error('Login failed', error);
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                setError(`Too many attempts. Try again in ${cooldownSeconds}s.`);
                startCooldown();
            } else {
                setError('Invalid email or password.');
            }
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <Header
                    title=""
                    leftIcon={<BackButton />}
                />
                <View style={styles.container}>

                    <View style={{ gap: 5, marginTop: spacingY._20, }}>
                        <Typo size={28} fontWeight={'bold'}>Login</Typo>
                        <Typo size={15} fontWeight={'300'} color={theme.colors.textSecondary}>Create an account or login with your details to get started</Typo>
                    </View>

                    <View style={[styles.form]}>

                        <Input
                            placeholder='Email Address'
                            onChangeText={setUsername}
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
                        <Input
                            placeholder='Password'
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

                        {
                            error ? <Typo style={styles.errorText} size={15} fontWeight={'400'}>{error}</Typo> : null
                        }

                    </View>

                    <View style={styles.footer}>
                        <Button loading={isLoading} disabled={isLoading} onPress={handleSubmit} style={{ width: '100%', marginBottom: spacingY._15 }}>
                            <Typo fontWeight={'500'} color={theme.colors.background} size={21}>Login</Typo>
                        </Button>
                        <Button
                            disabled={isLoading}
                            onPress={() => {
                                router.push('/(auth)/register');
                            }}
                            style={{
                                backgroundColor: theme.colors.transparent,
                                width: '100%',
                                borderColor: theme.colors.textPrimary,
                                borderWidth: 1,
                            }}
                        >
                            <Typo fontWeight={'300'} color={theme.colors.textSecondary} size={18}>Create an account</Typo>
                        </Button>

                    </View>
                </View>
                {/* </ScrollView> */}
            </KeyboardAvoidingView>
        </ScreenWrapper>
    )
}

export default login
