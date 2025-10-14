import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Dimensions, FlatList, RefreshControl, View } from "react-native";
import Skeleton from "../skeleton";
import CampaignCard from "./CampaignCard";

type LatestCampaignProps = {
  data: any[];
  isRefreshing: boolean;
  onRefresh: () => void;
  isLoading: boolean;
};

const { width: screenWidth } = Dimensions.get('window');

const LatestCampaign = ({ data, isRefreshing, onRefresh, isLoading }: LatestCampaignProps) => {
  const { theme } = useTheme()
  const { isRTL } = useLanguage()
  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Loading />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flexGrow: 0 }}>
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]} // placeholder skeletons
          horizontal
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View
              style={{
                backgroundColor: theme.colors.containerBackground,
                borderRadius: 16,
                paddingBottom: 10,
                marginHorizontal: 6,
                width: screenWidth * 0.75,
                overflow: "hidden",
              }}
            >
              {/* Image */}
              <Skeleton height={200} radius={16} />

              {/* Title */}
              <Skeleton
                height={20}
                width={'50%'}
                radius={6}
                style={{ marginTop: 8, marginHorizontal: 10 }}
              />

              {/* Separator */}
              <Skeleton
                height={1}
                width={'87%'}
                radius={0}
                style={{ marginVertical: 8, marginHorizontal: 20, alignSelf: "center" }}
              />

              {/* Progress Bar */}
              <Skeleton
                height={10}
                width={'90%'}
                radius={6}
                style={{ marginVertical: 8, marginHorizontal: 10, alignSelf: "center" }}
              />

              {/* Funding Info */}
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
          )}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
          }}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CampaignCard {...item} cardWidth={screenWidth * 0.75} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
          }}
          inverted={isRTL}
        />
      )}
    </View>
  );
};


export default LatestCampaign;
