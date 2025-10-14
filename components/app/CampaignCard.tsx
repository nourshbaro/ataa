import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { styles } from "@/styles/latestCampaign.styles";
import { spacingY } from "@/types/theme";
import { CampaignCardProps } from "@/types/types"; // adjust path if different
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import Typo from "../Typo";

const CampaignCard = ({
    id,
    title,
    end_date,
    featured_image,
    ngo,
    progress,
    cardWidth,
}: CampaignCardProps & { cardWidth?: number }) => {
    const { theme } = useTheme();
    const { isRTL } = useLanguage();
    const [isFavorite, setIsFavorite] = useState(false);

    // 🕓 Calculate days left
    const daysLeft = useMemo(() => {
        const today = new Date();
        const end = new Date(end_date);
        const diff = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        return diff;
    }, [end_date]);

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.containerBackground,
                    shadowColor: theme.colors.primary,
                    width: cardWidth,
                },
            ]}
        >
            {/* Image Section */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: featured_image }} style={styles.image} resizeMode="cover" />

                {/* Favorite Icon */}
                <TouchableOpacity
                    onPress={() => setIsFavorite(!isFavorite)}
                    style={[styles.iconButton, { backgroundColor: `${theme.colors.white}BF`, left: isRTL ? 10 : undefined, right: isRTL ? undefined : 10 }]}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavorite ? "red" : theme.colors.text}
                    />
                </TouchableOpacity>

                {/* Days Left */}
                <View style={[styles.daysContainer, { backgroundColor: `${theme.colors.white}BF`, left: isRTL ? 10 : undefined, right: isRTL ? undefined : 10 }]}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.text} />
                    <Typo style={styles.daysText} color={theme.colors.text} >
                        {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                    </Typo>
                </View>
            </View>

            {/* Title */}
            <Typo style={styles.title} numberOfLines={2} color={theme.colors.textPrimary} >
                {title}
            </Typo>

            {/* NGO name */}
            {/* <Text style={[styles.ngoText, { color: theme.colors.textSecondary }]}>{ngo}</Text> */}

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
                    <Typo style={{ fontWeight: 'bold', fontSize: 15 }} color={theme.colors.primary}>${Number(progress.raised).toLocaleString()}</Typo>
                    <Typo style={{ fontSize: 15 }} color={theme.colors.textSecondary}> of </Typo>
                    <Typo style={{ fontWeight: 'bold', fontSize: 15 }} color={theme.colors.textPrimary}>
                        ${(Number(progress.raised) + Number(progress.remaining)).toLocaleString()}
                    </Typo>
                    <Typo style={{ fontSize: 15 }} color={theme.colors.textSecondary}> funded</Typo>
                </Typo>
                <Typo style={{ fontWeight: 'bold', fontSize: 15 }} color={theme.colors.textSecondary}>{progress.percentage}%</Typo>
            </View>
        </View >
    );
};

export default CampaignCard;