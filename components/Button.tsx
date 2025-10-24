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
    disabled = false,
    children,
}: CustomButtonProps) => {
    const { theme } = useTheme();

    if (loading) {
        return (
            <View
                style={[
                    styles.button,
                    style,
                    { backgroundColor: theme.colors.transparent },
                ]}
            >
                <Loading style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={!disabled ? onPress : undefined}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
            style={[
                styles.button,
                {
                    backgroundColor: disabled
                        ? theme.colors.textSecondary + '55' // semi-transparent when disabled
                        : theme.colors.primary,
                },
                style,
            ]}
        >
            {children}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        borderRadius: radius._12,
        borderCurve: 'continuous',
        height: verticalScale(52),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
