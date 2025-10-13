import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { verticalScale } from '@/utils/styling';
import { CustomButtonProps } from '@/types/types';
import { useTheme } from '@/context/ThemeContext';
import Loading from './Loading';
import { radius } from '@/types/theme';

const Button = ({
    style,
    onPress,
    loading = false,
    children
}: CustomButtonProps) => {

    const { theme, mode } = useTheme();

    if (loading) {
        return (
            <View style={[styles.button, style, { backgroundColor: 'transparent' }]}>
                {/** loading */}
                <Loading style={{ flex: 1 }} />
            </View>
        )
    }


    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: theme.colors.secondary }, style,]}>
            {children}
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        borderRadius: radius._17,
        borderCurve: 'continuous',
        height: verticalScale(52),
        justifyContent: 'center',
        alignItems: 'center'
    }
})