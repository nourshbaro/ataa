import React from 'react';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const RadialGradientBackground = ({ cardWidth, cardHeight }: { cardWidth: number; cardHeight: number }) => {
  const { theme } = useTheme();

  return (
    <Svg width={cardWidth} height={cardHeight} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <RadialGradient
          id="radial"
          cx="50%"
          cy="50%"
          r="70%"
          fx="50%"
          fy="50%"
        >
          <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.colors.black} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#radial)" />
    </Svg>
  );
};

export default RadialGradientBackground;