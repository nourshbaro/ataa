import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacingY } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

type ValidIconName = 'home-outline' | 'football-outline' | 'basket-outline' | 'calendar-outline';

const CustomTabs: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();
    const { isRTL, t } = useLanguage();

    const iconContainerBase: ViewStyle = {
        width: verticalScale(80),
        height: verticalScale(40),
        borderRadius: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    };

    const renderTabIcon = (name: string, label: string, isFocused: boolean) => (
        <View style={{ overflow: 'hidden', borderRadius: verticalScale(20) }}>

            <View style={[
                iconContainerBase,
                isFocused && {
                    backgroundColor: theme.colors.white,
                    // borderRadius: verticalScale(20),
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
                    color={isFocused ? theme.colors.primary : theme.colors.white}
                    style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
                />
            </View>
            {/* <Typo size={12} color={theme.colors.primary}>
                {label}
            </Typo> */}
        </View>
    );

    const tabbarIcons: any = {
        index: (isFocused: boolean) => renderTabIcon('home-outline', t('home'), isFocused),
        categories: (isFocused: boolean) => renderTabIcon('hand-left-outline', t('categories'), isFocused),
        campaigns: (isFocused: boolean) => renderTabIcon('gift-outline', t('campaigns'), isFocused),
        settings: (isFocused: boolean) => renderTabIcon('settings-outline', t('settings'), isFocused),
        // contribute: (isFocused: boolean) => renderTabIcon('heart-outline', 'Contribute', isFocused),
    };

    return (
        <View
            style={[
                styles.tabbar,
                {
                    shadowColor: theme.colors.textPrimary,
                    backgroundColor: theme.colors.primary,
                    borderTopColor: theme.colors.white,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                },
            ]}
        >
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
        // flexDirection: 'row',
        // // width: '100%',
        // height: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(60),
        // justifyContent: 'space-around',
        // alignItems: 'center',
        // alignSelf: 'center',
        // paddingHorizontal: spacingX._7,
        // marginVertical: spacingY._25,
        // marginHorizontal: spacingX._20,
        // borderRadius: radius._30,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        // elevation: 3,

        position: 'absolute', // floating
        bottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(15),
        left: verticalScale(20),
        right: verticalScale(20),
        height: Platform.OS === 'ios' ? verticalScale(45) : verticalScale(45),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'transparent', // main color applied inside inner container
        zIndex: 10,
        borderRadius: radius._30,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        // marginHorizontal: spacingX._10,
        // paddingHorizontal: spacingX._7,
        marginVertical: spacingY._25,
    },
    // tabbarItem: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     // marginBottom: Platform.OS === 'ios' ? spacingY._15 : spacingY._15,
    //     // marginTop: Platform.OS === 'ios' ? spacingX._3 : spacingX._3,
    // }
    tabbarItem: {
        flex: 0, // don't stretch
        alignItems: 'center',
        justifyContent: 'center',
    },
})
