import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { styles } from "@/styles/latestCampaign.styles";
import { spacingY } from "@/types/theme";
import { CampaignCardProps } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import Typo from "../Typo";
import SkeletonCardCampaign from "./SkeletonCardCampaign";

const CampaignCard = ({
    id,
    title,
    end_date,
    featured_image,
    ngo,
    progress,
    cardWidth,
    isLoading,
    isSaved,
    onToggleSave,
}: CampaignCardProps & {
    cardWidth?: number;
    isLoading?: boolean;
    isSaved?: boolean;
    onToggleSave?: () => void;
}) => {
    const { theme } = useTheme();
    const { isRTL, t } = useLanguage();

    const daysLeft = useMemo(() => {
        const today = new Date();
        const end = new Date(end_date);
        return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    }, [end_date]);

    if (isLoading) return <SkeletonCardCampaign />;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.containerBackground,
                    shadowColor: theme.colors.textPrimary,
                    width: cardWidth,
                },
            ]}
            onPress={() =>
                router.push({
                    pathname: "/single/[id]",
                    params: { id },
                })
            }
        >
            {/* Image */}
            <View style={[styles.imageWrapper, { shadowColor: theme.colors.text }]}>
                <Image
                    source={featured_image ? { uri: featured_image } : require("../../assets/images/transparent.png")}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Favorite / Save Button */}
                <TouchableOpacity
                    onPress={onToggleSave}
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor: `${theme.colors.containerBackground}BF`,
                            left: isRTL ? 10 : undefined,
                            right: isRTL ? undefined : 10,
                        },
                    ]}
                >
                    <Ionicons
                        name={isSaved ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={isSaved ? theme.colors.secondary : theme.colors.textSecondary}
                    />
                </TouchableOpacity>

                {/* Days Left */}
                <View
                    style={[
                        styles.daysContainer,
                        {
                            backgroundColor: `${theme.colors.containerBackground}BF`,
                            left: isRTL ? 10 : undefined,
                            right: isRTL ? undefined : 10,
                        },
                    ]}
                >
                    <Ionicons name="time-outline" size={14} color={theme.colors.text} />
                    <Typo style={styles.daysText} color={theme.colors.text}>
                        {daysLeft > 0 ? `${daysLeft} ${t("daysleft")}` : t("ended")}
                    </Typo>
                </View>
            </View>

            {/* Title */}
            <Typo style={styles.title} numberOfLines={2} color={theme.colors.textPrimary}>
                {title}
            </Typo>

            {/* Separator */}
            <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

            {/* Progress Bar */}
            <Progress.Bar
                progress={progress.percentage / 100}
                width={null}
                color={theme.colors.primary}
                unfilledColor={theme.colors.skeletonBase}
                borderWidth={0}
                height={6}
                borderRadius={6}
                style={{ marginVertical: 8, marginHorizontal: spacingY._10 }}
            />

            {/* Funding Info */}
            <View style={[styles.fundingRow]}>
                <Typo style={styles.fundingText}>
                    <Typo style={{ fontWeight: "bold", fontSize: 15 }} color={theme.colors.primary}>
                        ${Number(progress.raised).toLocaleString()}
                    </Typo>
                    <Typo style={{ fontSize: 15 }} color={theme.colors.textSecondary}>
                        {" "}
                        {t("of")}{" "}
                    </Typo>
                    <Typo style={{ fontWeight: "bold", fontSize: 15 }} color={theme.colors.textPrimary}>
                        ${(Number(progress.raised) + Number(progress.remaining)).toLocaleString()}
                    </Typo>
                    <Typo style={{ fontSize: 15 }} color={theme.colors.textSecondary}>
                        {" "}
                        {t("funded")}
                    </Typo>
                </Typo>
                <Typo style={{ fontWeight: "bold", fontSize: 15 }} color={theme.colors.textSecondary}>
                    {progress.percentage}%
                </Typo>
            </View>
        </TouchableOpacity>
    );
};

export default CampaignCard;