import { useTheme } from '@/context/ThemeContext';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Typo from '../Typo';

type Props = {
  id: number;
  name: string;
  icon?: string;
  selectedId: number;
  onSelect: (id: number) => void;
  width?: number;
  height?: number;
};

const CategoryCard = ({
  id,
  name,
  icon,
  selectedId,
  onSelect,
  width = verticalScale(75),
  height = verticalScale(65),
}: Props) => {
  const { theme } = useTheme();
  const isSelected = id === selectedId;
  const borderColor = isSelected ? theme.colors.primary : theme.colors.border;
  const iconColor = isSelected ? theme.colors.primary : theme.colors.textSecondary;

  const isImageUrl = (icon?: string) => {
    if (!icon) return false;
    return icon.startsWith('http') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg');
  };

  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={{
        alignItems: 'center',
        // flex: 1,
        marginHorizontal: verticalScale(8),
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
      }}
    >
      <View
        style={{
          width,
          height,
          borderRadius: 12,
          borderWidth: 2,
          borderColor,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
        }}
      >
        {icon && isImageUrl(icon) ? (
          <Image
            source={{
              uri: icon.startsWith('http')
                ? icon
                : `https://be.donation.matrixvert.com/storage/${icon}`,
            }}
            style={{ width: 32, height: 32, resizeMode: 'contain' }}
          />
        ) : (
          <Ionicons
            name={icon && /^[a-z0-9-]+$/i.test(icon) ? (icon as any) : 'pricetags-outline'}
            size={26}
            color={iconColor}
          />
        )}
      </View>

      <Typo
        color={theme.colors.textPrimary}
        style={{
          fontSize: verticalScale(13),
          marginTop: 6,
          textAlign: 'center',
        }}
      >
        {name}
      </Typo>
    </TouchableOpacity>
  );
};

export default CategoryCard;
