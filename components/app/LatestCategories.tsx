import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import Skeleton from '../skeleton';
import CategoryCard from './CategoryCard';

const { width: screenWidth } = Dimensions.get('window');

const numColumns = 4;
const horizontalPadding = verticalScale(24);
const spacingBetweenColumns = verticalScale(10);

const itemWidth =
    (screenWidth - horizontalPadding - spacingBetweenColumns * (numColumns - 1)) / numColumns;


type Props = {
    categories: { id: number; name: string; icon?: string }[];
    selectedId: number;
    onSelect: (id: number) => void;
    // isRefreshing: boolean;
    // onRefresh: () => void;
    isLoading?: boolean;
};

const LatestCategories = ({
    categories,
    selectedId,
    onSelect,
    // isRefreshing,
    // onRefresh,
    isLoading
}: Props) => {
    const { theme } = useTheme();
    const { isRTL } = useLanguage();

    const displayedCategories = categories.slice(0, 3).concat({
        id: 0,
        name: 'Other',
        icon: 'grid-outline',
    });

    return (
        <View style={{ marginTop: verticalScale(10) }}>
            {isLoading ? (
                <FlatList
                    data={[1, 2, 3, 4]} 
                    horizontal
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => (
                        <Skeleton style={{
                            width: itemWidth * 0.9, 
                            height: itemWidth * 0.8,
                            borderRadius: 12,
                            backgroundColor: theme.colors.surface,
                            marginHorizontal: verticalScale(8),
                        }} />
                    )}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: verticalScale(12),
                        marginBottom: verticalScale(10),
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={displayedCategories}
                    key={`numColumns-4`}
                    renderItem={({ item }) => (
                        <View style={{ width: itemWidth, alignItems: 'center', marginBottom: verticalScale(10) }}>
                            <CategoryCard
                                id={item.id}
                                name={item.name}
                                icon={item.icon}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                width={itemWidth * 0.9} // make it slightly smaller to add padding inside
                                height={itemWidth * 0.8}
                            />
                        </View>
                    )}
                    // horizontal
                    numColumns={4}
                    // showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    // refreshControl={
                    //     <RefreshControl
                    //         refreshing={isRefreshing}
                    //         onRefresh={onRefresh}
                    //         colors={[theme.colors.primary]}
                    //         tintColor={theme.colors.primary}
                    //     />
                    // }
                    columnWrapperStyle={{
                        justifyContent: 'space-between', // spread items evenly in each row
                        marginBottom: verticalScale(10),
                        marginHorizontal: verticalScale(6),
                    }}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: verticalScale(12),
                        marginBottom: verticalScale(10),
                        
                    }}
                    inverted={isRTL}
                    directionalLockEnabled={true}
                    bounces={false}
                    alwaysBounceVertical={false}
                    scrollEventThrottle={16}
                />
            )}
        </View>
    );
};

export default LatestCategories;
