import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
// import { InputProps } from '@/types'
// import { useTheme } from '@/contexts/ThemeContext';
// import { darkMode, lightMode, radius, spacingX } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacingX } from '@/types/theme';
import { InputProps } from '@/types/types';
import { verticalScale } from '@/utils/styling';

const Input = (props: InputProps) => {

    const { theme, mode } = useTheme();

    return (
        <View
            style={[
                styles.container,
                props.containerStyle,
                { borderColor: theme.colors.white, flexDirection: 'row' }
            ]}
        >
            {props.icon && <View style={styles.iconWrapper}>{props.icon}</View>}

            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, { color: theme.colors.white }, props.inputStyle]}
                    placeholderTextColor={theme.colors.white}
                    ref={props.inputRef}
                    {...props}
                />
            </View>
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(54),
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15,
        flexDirection: 'row',
        gap: spacingX._10,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: spacingX._10,
    },

    inputWrapper: {
        flex: 1,
    },
    input: {
        flex: 1,
        fontSize: verticalScale(14),
        paddingVertical: verticalScale(12), // ensures touchable height
    }
})