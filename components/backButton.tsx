import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/types/theme';
import { BackButtonProps } from '@/types/types';
import { verticalScale } from '@/utils/styling';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const BackButton = ({
    style,
    iconSize = 26,
}: BackButtonProps) => {

    const { theme } = useTheme();
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.back()} style={[styles.button, style, { backgroundColor: theme.colors.disabled }]}>
            <MaterialIcons
                name='chevron-left'
                size={verticalScale(iconSize)}
                color={theme.colors.surface}
                weight='bold'
            />
        </TouchableOpacity>
    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        borderRadius: radius._12,
        borderCurve: 'continuous',
        padding: 5
    }
})