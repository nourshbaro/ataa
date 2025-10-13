import { useTheme } from '@/context/ThemeContext';
import { spacingX } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Typo from './Typo';
// import * as Icons from 'phosphor-react-native'

type ValidIconName = 'home-outline' | 'football-outline' | 'basket-outline' | 'calendar-outline';
//| 'heart-outline'

const CustomTabs: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();

    const iconContainerBase: ViewStyle = {
        width: verticalScale(80),
        height: verticalScale(40),
        borderRadius: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    };

    const renderTabIcon = (name: string, label: string, isFocused: boolean) => (
        <>
            <View style={[
                iconContainerBase,
                isFocused && {
                    backgroundColor: theme.colors.secondary,
                    borderRadius: verticalScale(20),
                    shadowColor: theme.colors.black,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                }
            ]}>
                <Ionicons
                    name={name as ValidIconName}
                    size={verticalScale(22)}
                    color={theme.colors.white}
                />

            </View>
            <Typo size={12} color={theme.colors.white}>
                {label}
            </Typo>
        </>
    );

    const tabbarIcons: any = {
        index: (isFocused: boolean) => renderTabIcon('home-outline', 'Home', isFocused),
        team: (isFocused: boolean) => renderTabIcon('football-outline', 'Team', isFocused),
        shop: (isFocused: boolean) => renderTabIcon('basket-outline', 'Shop', isFocused),
        games: (isFocused: boolean) => renderTabIcon('calendar-outline', 'Games', isFocused),
        // contribute: (isFocused: boolean) => renderTabIcon('heart-outline', 'Contribute', isFocused),
    };

    return (
        <View style={[styles.tabbar, { backgroundColor: theme.colors.primary, borderTopColor: theme.colors.white }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label: any =
                    options.tabBarLabel ?? options.title ?? route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                    >
                        {
                            tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CustomTabs;

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        width: '100%',
        height: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(70),
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: spacingX._7
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: Platform.OS === 'ios' ? spacingY._15 : spacingY._15,
        marginTop: Platform.OS === 'ios' ? spacingX._3 : spacingX._3,
    }
})
