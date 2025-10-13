import { useTheme } from '@/context/ThemeContext';
import { radius, spacingY } from '@/types/theme';
import { TabContainerProps } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Typo from './Typo';

export const TabContainer = <T extends string>({
    tab,
    setTab,
    tabs,
}: TabContainerProps<T>) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.tabContainer,
                {
                    backgroundColor: theme.colors.tabBackground,
                    borderColor: theme.colors.white,
                    borderWidth: 1,
                    borderRadius: radius._12,
                },
            ]}
        >
            {tabs.map((t) => (
                <TouchableOpacity
                    key={t}
                    style={[
                        styles.tabButton,
                        {
                            backgroundColor: tab === t ? theme.colors.secondary : 'transparent',
                        },
                    ]}
                    onPress={() => setTab(t)}
                >
                    <Typo
                        style={styles.tabText}
                        color={theme.colors.white}
                    >
                        {t}
                    </Typo>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TabContainer;

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        padding: 4,
        marginHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(47)
    },
    tabButton: {
        flex: 1,
        paddingVertical: spacingY._5,
        borderRadius: radius._10,
        alignItems: 'center',
    },
    tabText: {
        fontWeight: '600',
    },
});
