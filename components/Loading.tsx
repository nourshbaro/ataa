import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native';

const Loading = ({
    size = 'large',
    color,
}: ActivityIndicatorProps) => {
    const { theme } = useTheme();
    const finalColor = color || theme.colors.primary;
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={size} color={finalColor} />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})