import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import Skeleton from '../skeleton';
import CategoryCard from './CategoryCard';

type Props = {
    categories: { id: number; name: string; icon?: string }[];
    selectedId: number;
    onSelect: (id: number) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
    isLoading?: boolean;
};

const LatestCategories = ({
    categories,
    selectedId,
    onSelect,
    isRefreshing,
    onRefresh,
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
                    data={[1, 2, 3, 4]} // placeholder items
                    horizontal
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => (
                        <Skeleton style={{
                            width: verticalScale(75),
                            height: verticalScale(65),
                            borderRadius: 12,
                            backgroundColor: theme.colors.surface,
                            marginHorizontal: verticalScale(8),
                        }} />
                    )}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: verticalScale(12),
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={displayedCategories}
                    renderItem={({ item }) => (
                        <CategoryCard
                            id={item.id}
                            name={item.name}
                            icon={item.icon}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: verticalScale(12),
                    }}
                    inverted={isRTL}
                />
            )}
        </View>

    );
};

export default LatestCategories;
