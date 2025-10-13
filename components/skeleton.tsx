import { useTheme } from '@/context/ThemeContext';
import { SkeletonProps } from '@/types/types';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet } from 'react-native';

const Skeleton = ({
  width = '100%',
  height = '100%',
  radius = 20,
  style
}: SkeletonProps) => {
  const { theme } = useTheme();
  const baseColor = theme.colors.skeletonBase;

  return (
    <MotiView
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: baseColor,
          //   borderColor: theme.colors.white,
        },
        style,
      ]}
      transition={{
        type: 'timing',
        duration: 800,
      }}
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    overflow: 'hidden',
  },
});

export default Skeleton;