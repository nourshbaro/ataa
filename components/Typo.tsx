import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
// import { TypoProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { TypoProps } from '@/types/types';
import { verticalScale } from '@/utils/styling';

const Typo = ({
    size,
    color,
    fontWeight = '400',
    children,
    style,
    textProps = {},
    onPress,
}: TypoProps) => {

    const { theme, mode } = useTheme();

    const finalColor = color || theme.colors.textPrimary;
    const textStyle: TextStyle = {
        fontSize: size ? verticalScale(size) : verticalScale(18),
        color: finalColor,
        fontWeight
    }
    return (
        <Text style={[textStyle, style]} {...textProps} onPress={onPress}>
            {children}
        </Text>
    )
}

export default Typo

const styles = StyleSheet.create({})