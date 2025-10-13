import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/types/theme';
import { CustomButtonProps } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Loading from './Loading';

const Button = ({
    style,
    onPress,
    loading = false,
    children
}: CustomButtonProps) => {

    const { theme, mode } = useTheme();

    if (loading) {
        return (
            <View style={[styles.button, style, { backgroundColor: 'black' }]}>
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
        borderRadius: radius._12,
        borderCurve: 'continuous',
        height: verticalScale(52),
        justifyContent: 'center',
        alignItems: 'center'
    }
})