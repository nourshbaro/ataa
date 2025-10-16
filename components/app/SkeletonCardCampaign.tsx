import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacingX, spacingY } from '@/types/theme'
import { useTheme } from '@/context/ThemeContext'
import Skeleton from '../skeleton';

const { width: screenWidth } = Dimensions.get('window');
type SkeletonCardCampaignProps = {
  width?: number; // optional, fallback to screenWidth * 0.9 if not provided
};

const SkeletonCardCampaign = ({ width = screenWidth * 0.9 }: SkeletonCardCampaignProps) => {

    const { theme } = useTheme()
    return (
        <View style={{ marginVertical: spacingY._5, alignItems: 'center', marginHorizontal: spacingX._20 }}>
            <View
                style={{
                    backgroundColor: theme.colors.containerBackground,
                    borderRadius: 16,
                    paddingBottom: 10,
                    width,
                    overflow: "hidden",
                }}
            >
                <Skeleton height={200} radius={16} />
                <Skeleton height={20} width={'50%'} radius={6} style={{ marginTop: 8, marginHorizontal: 10 }} />
                <Skeleton height={1} width={'87%'} radius={0} style={{ marginVertical: 8, marginHorizontal: 20, alignSelf: "center" }} />
                <Skeleton height={10} width={'90%'} radius={6} style={{ marginVertical: 8, marginHorizontal: 10, alignSelf: "center" }} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginTop: 8 }}>
                    <Skeleton width="60%" height={16} radius={4} />
                    <Skeleton width={40} height={16} radius={4} />
                </View>
            </View>
        </View>
    )
}

export default SkeletonCardCampaign

const styles = StyleSheet.create({})