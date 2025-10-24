import { useLanguage } from "@/context/LanguageContext";
import { useSave } from "@/context/SavedContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/UserContext";
import { spacingX, spacingY } from "@/types/theme";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native";
import Skeleton from "../skeleton";
import Typo from "../Typo";
import CampaignCard from "./CampaignCard";

type LatestCampaignProps = {
  data: any[];
  // isRefreshing: boolean;
  // onRefresh: () => void;
  isLoading: boolean;
};

const { width: screenWidth } = Dimensions.get('window');

const LatestCampaign = ({ data, isLoading }: LatestCampaignProps) => {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { savedCampaignIds, fetchSavedCampaigns, handleToggleSave } = useSave();

  useEffect(() => {
    fetchSavedCampaigns();
  }, []);

  return (
    <View style={{ flexGrow: 0 }}>
      {isLoading ? (
        <>
          <View style={styles.titleHeader} >
            <Typo style={styles.mainTitle} color={theme.colors.textPrimary}>{t('latestcampaign')}</Typo>
            <Pressable onPress={() => { router.push('/(tabs)/campaigns') }}>
              <Typo style={styles.seeAll} color={theme.colors.textSecondary}>{t('more')}</Typo>
            </Pressable>
          </View >
          <FlatList
            data={[1, 2, 3, 4]}
            horizontal
            keyExtractor={(item) => item.toString()}
            renderItem={() => (
              <View style={{ marginVertical: spacingY._5, alignItems: 'center', marginHorizontal: spacingX._20 }}>
                <View
                  style={{
                    backgroundColor: theme.colors.containerBackground,
                    borderRadius: 16,
                    paddingBottom: 10,
                    width: screenWidth * 0.65,
                    overflow: "hidden",
                  }}
                >
                  <Skeleton height={200} radius={16} />
                  <Skeleton
                    height={20}
                    width={'50%'}
                    radius={6}
                    style={{ marginTop: 8, marginHorizontal: 10 }}
                  />
                  <Skeleton
                    height={1}
                    width={'87%'}
                    radius={0}
                    style={{ marginVertical: 8, marginHorizontal: 20, alignSelf: "center" }}
                  />
                  <Skeleton
                    height={10}
                    width={'90%'}
                    radius={6}
                    style={{ marginVertical: 8, marginHorizontal: 10, alignSelf: "center" }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                      marginTop: 8,
                    }}
                  >
                    <Skeleton width="60%" height={16} radius={4} />
                    <Skeleton width={40} height={16} radius={4} />
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: verticalScale(12),
              marginBottom: verticalScale(10),
            }}
            showsHorizontalScrollIndicator={false}
          />
        </>
      ) : data.length === 0 ? (
        <>
          <View style={styles.titleHeader} >
            <Typo style={styles.mainTitle} color={theme.colors.textPrimary}>{t('latestcampaign')}</Typo>
            <Pressable onPress={() => { router.push('/(tabs)/campaigns') }}>
              <Typo style={styles.seeAll} color={theme.colors.textSecondary}>{t('more')}</Typo>
            </Pressable>
          </View >
          <Typo style={styles.notfound} size={15} fontWeight={'400'} color={theme.colors.textSecondary}>{t('nocampaign')}</Typo>
        </>
      ) : (
        <>
          <View style={styles.titleHeader} >
            <Typo style={styles.mainTitle} color={theme.colors.textPrimary}>{t('latestcampaign')}</Typo>
            <Pressable onPress={() => { router.push('/(tabs)/campaigns') }}>
              <Typo style={styles.seeAll} color={theme.colors.textSecondary}>{t('more')}</Typo>
            </Pressable>
          </View >
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <CampaignCard {...item} cardWidth={screenWidth * 0.65} isLoading={isLoading} isSaved={savedCampaignIds.includes(item.id)}
                onToggleSave={() => isAuthenticated ? handleToggleSave(item.id) : router.push('/(auth)') } />
            )}
            contentContainerStyle={{
              alignItems: "center",
              padding: verticalScale(15),
            }}
            // inverted={isRTL}
            directionalLockEnabled={true}
            bounces={false}
            alwaysBounceVertical={false}
            scrollEventThrottle={16}
          />
        </>
      )}
    </View>
  );
};


export default LatestCampaign;

const styles = StyleSheet.create({
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: verticalScale(10),
    alignItems: 'center',
    marginHorizontal: verticalScale(20),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(20),
  },
  mainTitle: {
    fontSize: verticalScale(20),
    fontWeight: '700'
  },
  seeAll: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    marginTop: verticalScale(5)
  },
  notfound: {
    marginTop: 0,
    alignSelf: 'center',
    paddingHorizontal: verticalScale(50)
  },
});
