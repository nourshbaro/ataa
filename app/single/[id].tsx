import apiClient from '@/api/apiClient';
import BackButton from '@/components/backButton';
import Button from '@/components/Button';
import Header from '@/components/header';
import Loading from '@/components/Loading';
import ModalWrapper from '@/components/modalWrapper';
import Typo from '@/components/Typo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/UserContext';
import { spacingY } from '@/types/theme';
import { Campaigns } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import * as Progress from "react-native-progress";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Single = () => {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const { isRTL } = useLanguage();
    const { isAuthenticated } = useAuth()

    const [campaign, setCampaign] = useState<Campaigns>();
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setErrorMessage('');
            setIsLoading(true);
            const res = await apiClient.get(`/api/campaign/${id}`);
            setCampaign(res.data.campaign);
        } catch (e: any) {
            console.log("Error fetching campaign:", e.message);
            const message = e?.response?.data?.message || e?.message || 'Something went wrong.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        if (isAuthenticated) {
            router.push({
                pathname: '/payment/[paymentId]',
                params: { paymentId: campaign?.id || 0 },
            });
        } else {
            router.push('/(auth)')
        }
    };

    const daysLeft = useMemo(() => {
        if (!campaign) return 0;
        const today = new Date();
        const end = new Date(campaign.end_date);
        const diff = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        return diff;
    }, [campaign?.end_date]);

    if (errorMessage) {
        <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
    }

    if (isLoading || !campaign) {
        return (
            errorMessage ? (
                <ModalWrapper>
                    <Header
                        title=""
                        leftIcon={<BackButton />}
                        style={{ marginBottom: spacingY._10 }}
                    />
                    <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
                </ModalWrapper>
            ) : (
                <ModalWrapper>
                    <Header
                        title=""
                        leftIcon={<BackButton />}
                        style={{ marginBottom: spacingY._10 }}
                    />
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Loading />
                    </View>
                </ModalWrapper>
            )
        );
    }

    const percentage = campaign.progress?.percentage || 0;
    const raised = Number(campaign.progress?.raised) || 0;
    const goal = percentage ? raised / (percentage / 100) : 0;

    return (
        <ModalWrapper>
            {/* Header Image */}

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: campaign.featured_image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.3)']}
                    style={StyleSheet.absoluteFillObject}
                />

                {/* Header over image */}
                <View style={styles.headerOverlay}>
                    <Header
                        title=""
                        leftIcon={<BackButton />}
                        style={{ marginBottom: spacingY._10 }}
                    />
                </View>
            </View>
            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: spacingY._15 }}
            >
                {/* Title Row */}
                <View style={styles.titleRow}>
                    <Typo style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 28 }} fontWeight={'bold'}>
                        {campaign.title}
                    </Typo>
                    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={26}
                            color={isFavorite ? theme.colors.secondary : theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Organized By + Days Left */}
                <View style={styles.organizedRow}>
                    <Typo color={theme.colors.textSecondary} size={12} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                        Organized by <Typo style={{ fontWeight: '600' }} color={theme.colors.secondary} size={15}>{campaign.ngo}</Typo>
                    </Typo>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                        <Typo style={{ marginHorizontal: 4 }} color={theme.colors.textSecondary} size={12}>
                            {daysLeft || '0'} days left
                        </Typo>
                    </View>
                </View>

                {/* Separator */}
                <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

                {/* Funded Row */}
                <View style={styles.fundedRow}>
                    <Typo style={{ color: theme.colors.primary, fontWeight: 'bold' }} size={15}>
                        ${raised.toLocaleString()}
                    </Typo>
                    <Typo style={{ color: theme.colors.textSecondary }} size={12}> of </Typo>
                    <Typo style={{ color: theme.colors.textPrimary, fontWeight: 'bold' }} size={15}>
                        ${goal.toLocaleString()}
                    </Typo>
                    <Typo style={{ color: theme.colors.textSecondary }} size={12}> funded </Typo>
                    <View style={{ flex: 1 }} />
                    <Typo style={{ color: theme.colors.textSecondary }} size={15}>{percentage}%</Typo>
                </View>

                {/* Progress Bar */}
                <Progress.Bar
                    progress={percentage / 100}
                    width={null}
                    color={theme.colors.primary}
                    unfilledColor={theme.colors.skeletonBase}
                    borderWidth={0}
                    height={6}
                    borderRadius={6}
                    style={{ marginVertical: 8, marginHorizontal: spacingY._10 }}
                />

                {/* Description */}
                <Typo style={{ color: theme.colors.textPrimary, marginBottom: 6 }} fontWeight={'bold'}>
                    Description
                </Typo>
                <Typo style={{ color: theme.colors.textSecondary, lineHeight: 20 }} size={15}>
                    {campaign.description || 'No description available.'}
                </Typo>

            </ScrollView>
            {/* Donate Button */}
            <View style={{ marginHorizontal: 25 }}>
                <Button
                    style={{ width: '100%', paddingVertical: 12, borderRadius: 10 }}
                    onPress={handleClick}
                >
                    <Typo style={{ textAlign: 'center', fontWeight: 'bold' }} color={theme.colors.white}>
                        Donate Now
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    );
};

export default Single;

const styles = StyleSheet.create({
    imageContainer: {
        width: '95%',
        // height: screenWidth * 0.55,
        aspectRatio: 1.8,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: spacingY._15,
        alignSelf: 'center',
        position: 'relative',
    },
    // imageContainer: {
    //   height: 250, // or whatever height you need
    //   position: 'relative',
    //   overflow: 'hidden',
    // },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: spacingY._15,
        // paddingHorizontal: spacingY._15,
        zIndex: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerContent: {
        // ...StyleSheet.absoluteFillObject,
        paddingHorizontal: spacingY._10,
        // paddingTop: spacingY._60,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingY._10,
    },
    organizedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingY._10,
    },
    separator: {
        height: 1,
        marginVertical: spacingY._10,
    },
    fundedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingY._7,
    },
    errorText: {
        color: 'red',
        marginTop: 0,
        alignSelf: 'center',
        paddingHorizontal: verticalScale(50)
    },
});
