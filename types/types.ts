import React, { ReactNode } from "react";
import {
  DimensionValue,
  ImageSourcePropType,
  StyleProp,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  // bg?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  logo?: ImageSourcePropType;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
  numberOfLines?: number;
  backgroundColor?: string;
  onPress?: () => void;
};

export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
  // label?: string;
  // error?: string;
};

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  loading?: boolean;
  //hasShadow?: boolean;
  children: React.ReactNode;
};

export type ModalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};

export type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  //   orientation?: 'horizontal' | 'vertical';
  radius?: number;
  style?: ViewStyle;
};

export type Campaigns = {
  id: number;
  ngo_id: number;
  title: string;
  description: string;
  goal_amount: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  featured_image: string;
  category_id: number;
  ngo: {
    id: number;
    name: string;
  }
  category: {
    id: number;
    name: string;
  }
  progress: {
    raised: string;
    percentage: number;
    remaining: number;
  },
};

export type CampaignCardProps = {
  id: number;
  title: string;
  end_date: string;
  featured_image: string;
  ngo: string;
  progress: {
    raised: string;
    percentage: number;
    remaining: number;
  },
}

export type LatestCategoriesProps = {
  categories: Categories[];
  selectedId: number;
  onSelect: (id: number) => void;
};

export type Categories = {
  id: number;
  name: string;
  icon_name?: string;
}

export type CatCampaignType = {
  id: number;
  title: string;
  description: string;
  goal_amount: string;
  start_date: string;
  end_date: string;
  featured_image: string | null;
  category: string;
  ngo: string;
  progress: {
    raised: string | number;
    percentage: number;
    remaining: number;
  };
};
