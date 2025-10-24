import apiClient from "@/api/apiClient";
import CampaignCard from "@/components/app/CampaignCard";
import SkeletonCardCampaign from "@/components/app/SkeletonCardCampaign";
import BackButton from "@/components/backButton";
import Button from "@/components/Button";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/modalWrapper";
import Typo from "@/components/Typo";
import { useLanguage } from "@/context/LanguageContext";
import { useSave } from "@/context/SavedContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/UserContext";
import { spacingY } from "@/types/theme";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface SavedCampaign {
    id: number;
    title: string;
    end_date: string;
    featured_image?: string;
    ngo?: string;
    progress: {
        percentage: number;
        raised: number;
        remaining: number;
    };
}

const Saved = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { accessToken, refreshAccessToken, refreshLogout, isAuthenticated } = useAuth();

    const [saved, setSaved] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { savedCampaignIds, fetchSavedCampaigns, handleToggleSave } = useSave();

    const handleLoadMore = () => {
        if (!hasMore || paginationLoading || isLoading) return;
        setPaginationLoading(true);
        const nextPage = page + 1;
        fetchData(nextPage);
        setPage(nextPage);
    };

    const fetchData = useCallback(async (pageNumber = 1) => {
        try {
            setErrorMessage('');
            if (pageNumber === 1) setIsLoading(true);
            else setPaginationLoading(true);

            const response = await apiClient.get(`/api/donor/campaigns/saved?page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const pagination = response.data?.data || {};
            const data = pagination.data || [];
            const totalPages = pagination.last_page || 1;

            if (pageNumber === 1) setSaved(data);
            else setSaved(prev => [...prev, ...data]);

            setHasMore(pageNumber < totalPages);
        } catch (err: any) {
            const status = err?.response?.status;
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while fetching saved campaigns.";
            console.error("Error fetching saved:", message);
            setErrorMessage(message);

            if (status === 401) {
                const newToken = await refreshAccessToken?.();
                if (newToken) {
                    try {
                        const retryResponse = await apiClient.get(
                            `/api/donor/campaigns/saved?page=${pageNumber}`,
                            { headers: { Authorization: `Bearer ${newToken}` } }
                        );

                        const pagination = retryResponse.data?.data || {};
                        const retryData = pagination.data || [];
                        const totalPages = pagination.last_page || 1;

                        if (pageNumber === 1) setSaved(retryData);
                        else setSaved(prev => [...prev, ...retryData]);

                        setHasMore(pageNumber < totalPages);
                        return;
                    } catch (retryErr: any) {
                        console.error("Retry failed:", retryErr.message);
                        setErrorMessage(retryErr.message);
                        await refreshLogout();
                    }
                } else {
                    await refreshLogout();
                }
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setPaginationLoading(false);
        }
    }, [accessToken, refreshAccessToken, refreshLogout]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />
                <Header title={t("saved")} />

                {isLoading ? (
                    <View style={{ marginTop: spacingY._15 }}>
                        {[...Array(3)].map((_, i) => (
                            <SkeletonCardCampaign key={i} />
                        ))}
                    </View>
                ) : errorMessage ? (
                    <View style={styles.emptyContainer}>
                        <Typo style={styles.errorText} size={15} fontWeight={'400'}>{errorMessage}</Typo>
                    </View>
                ) : !isAuthenticated ? (
                    <View style={styles.emptyContainer}>
                        <Typo style={styles.emptyText} color={theme.colors.textSecondary} size={18}>
                            {t("notauth")}!
                        </Typo>
                        <Button style={{ backgroundColor: theme.colors.transparent }} onPress={() => { router.push('/(auth)') }}>
                            <Typo style={styles.emptyText} color={theme.colors.primary} size={15}>
                                {t("clickhere")}
                            </Typo>
                        </Button>
                    </View>
                ) : saved.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Typo style={styles.emptyText} color={theme.colors.textSecondary} size={18}>
                            {t("nosaved")}
                        </Typo>
                    </View>
                ) : (
                    <FlatList
                        data={saved}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primary]}
                                tintColor={theme.colors.primary}
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={{ marginVertical: spacingY._5, alignItems: 'center' }}>
                                <CampaignCard {...item} cardWidth={screenWidth * 0.9} isSaved={savedCampaignIds.includes(item.id)}
                                    onToggleSave={() => isAuthenticated ? handleToggleSave(item.id) : router.push('/(auth)') } isLoading={isLoading} />
                            </View>
                        )}
                        ListFooterComponent={
                            paginationLoading && hasMore ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <Loading />
                                </View>
                            ) : null
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        bounces={false}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </ModalWrapper>
    );
};

export default Saved;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
        marginTop: Platform.OS === "ios" ? spacingY._35 : 0,
    },
    emptyContainer: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        padding: 20,
    },
    emptyText: {
        // fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    listContainer: {
        marginTop: spacingY._15,
        paddingBottom: spacingY._20,
    },
    errorText: {
        color: 'red',
        marginTop: 0,
        alignSelf: 'center',
        paddingHorizontal: verticalScale(50)
    },
});
