import apiClient from '@/api/apiClient'
import BackButton from '@/components/backButton'
import Header from '@/components/header'
import ModalWrapper from '@/components/modalWrapper'
import Skeleton from '@/components/skeleton'
import Typo from '@/components/Typo'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/UserContext'
import { spacingY } from '@/types/theme'
import { useEffect, useState } from 'react'
import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, View } from 'react-native'

interface History {
    id: number;
    campaign_name: string;
    amount: string;
    status: string;
    donated_at: string;
}

export default function Notification() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const [history, setHistory] = useState<History[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken, refreshAccessToken, refreshLogout } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const onRefresh = async () => {
        setIsRefreshing(true);
        setIsLoading(true);
        try {
            setTimeout(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            }, 2000);
        } catch (error) {
            console.error("Error refreshing data:", error);
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await apiClient.get("/api/donor/donations", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setHistory(response.data.donations);
        } catch (err: any) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message || err?.message || 'Something went wrong.';
            console.error("Error fetching History:", message);

            if (status === 401) {
                const newToken = await refreshAccessToken?.();
                if (newToken) {
                    try {
                        const retryResponse = await apiClient.get("/api/donor/donations", {
                            headers: { Authorization: `Bearer ${newToken}` },
                        });
                        setHistory(retryResponse.data.donations);
                        return;
                    } catch (retryErr: any) {
                        console.error("Retry failed:", retryErr.message);
                        await refreshLogout();
                    }
                } else {
                    await refreshLogout();
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }: { item: History }) => {
        const donatedDate = new Date(item.donated_at);
        const formattedDate = donatedDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        const isPending = item.status === 'pending';
        const statusColor = isPending ? theme.colors.pending : theme.colors.success;

        return (
            <Pressable
                style={[
                    styles.card,
                    {
                        backgroundColor: theme.colors.containerBackground,
                        shadowColor: theme.colors.text,
                        borderColor: theme.colors.border,
                    },
                ]}
                android_ripple={{ color: theme.colors.accent }}
                onPress={() => {/* optional: navigate to details */ }}
            >
                {/* Top Row - Campaign & Amount */}
                <View style={styles.rowBetween}>
                    <Typo
                        style={styles.campaignText}
                        fontWeight={600}
                        size={16}
                        color={theme.colors.textPrimary}
                    >
                        {item.campaign_name}
                    </Typo>
                    <Typo
                        style={styles.amountText}
                        fontWeight={700}
                        size={15}
                        color={theme.colors.success}
                    >
                        ${item.amount}
                    </Typo>
                </View>

                {/* Middle - Date */}
                <View style={[styles.rowStart, { marginTop: 6 }]}>
                    <Typo style={styles.date} color={theme.colors.textSecondary}>
                        📅 {formattedDate}
                    </Typo>
                </View>

                {/* Bottom - Status */}
                <View style={[styles.rowBetween, { marginTop: 10 }]}>
                    <View
                        style={{
                            backgroundColor: isPending ? '#FFF5CC' : '#E6FFE6',
                            borderRadius: 12,
                            paddingVertical: 4,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Typo style={styles.status} color={statusColor}>
                            {isPending ? '⏳ Pending' : '✅ Completed'}
                        </Typo>
                    </View>

                    {isPending && (
                        <Typo style={styles.note} color={theme.colors.textSecondary}>
                            {t('contact_support')}
                        </Typo>
                    )}
                </View>
            </Pressable>
        );
    };


    return (
        <ModalWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />
                {/** header */}
                <Header title={t('history')} />

                {isLoading ? (
                    <Skeleton />
                ) : history.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Typo style={styles.emptyText} color={theme.colors.textPrimary}>
                            {t('noDonationsYet')}
                        </Typo>
                    </View>
                ) : (
                    <FlatList
                        data={history}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primary]} // Android
                                tintColor={theme.colors.primary} // iOS
                            />
                        }
                    />
                )}
            </View>
        </ModalWrapper>
    );
}

const styles = StyleSheet.create({

    card: {
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowStart: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    campaignText: {
        fontSize: 16,
    },
    amountText: {
        fontSize: 15,
    },
    date: {
        fontSize: 13,
    },
    status: {
        fontSize: 13,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    note: {
        fontSize: 12,
        fontStyle: 'italic',
    },

    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingY._20,
        marginTop: Platform.OS == 'ios' ? spacingY._35 : 0
    },
    listContainer: {
        // gap: spacingY._30,
        marginTop: spacingY._15
    },
    // card: {
    //     padding: 16,
    //     borderRadius: 12,
    //     // marginBottom: 12,
    //     shadowOffset: { width: 0, height: 4 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 5,
    //     elevation: 5,
    // },
    // campaignText: {
    //     fontSize: 16,
    //     fontWeight: "bold",
    //     marginBottom: 4,
    // },
    // amountText: {
    //     fontSize: 18,
    //     fontWeight: "600",
    //     marginBottom: 4,
    // },
    // status: {
    //     fontSize: 14,
    //     fontWeight: "bold",
    //     marginBottom: 4,
    // },
    // date: {
    //     fontSize: 12,
    // },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // note: {
    //     fontSize: 12,
    //     fontStyle: 'italic',
    //     marginTop: 5
    // },
    // rowBetween: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginBottom: 8,
    // },
    rowEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    rowEven: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    suggestion: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },

});
