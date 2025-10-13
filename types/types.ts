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

export type MatchCardProps = {
  match: {
    id: number;
    home: string;
    away: string;
    date: string;
    score?: string;
    location?: string;
    image?: any;
    homeLogo?: any;
    awayLogo?: any;
  };
};

export type EventItem = {
  id: number;
  date: string;
  title: { rendered: string };
  class_list?: string[];
  teams?: number[]; // ✅ Add this line
  results?: Record<number, { goals?: string }>;

};

export type MatchesProps = {
  events: EventItem[];
  teams: any[]; // Sportspress team objects
  isLoading: boolean;
};

// The structure of a single event inside calendar.data
export type CalendarEvent = {
  ID: number;
  post_date: string;
  post_title: string;
  post_status: string;
};

// The structure of a calendar returned by the API
export type Calendar = {
  id: number;
  title: { rendered: string };
  data: CalendarEvent[];
};

// What your GamesTab really receives
export type GamesProps = {
  game: Calendar[];   // ⬅️ array of calendars, not events
  teams: any[];
  isLoading: boolean;
};

// For transformed UI items
export type MatchCardItem = {
  id: number;
  home: string;
  away: string;
  date: string;
  location?: string;
  image: any;
  homeLogo?: { uri: string };
  awayLogo?: { uri: string };
  score?: string;
};

export type EventDetails = {
  id: number;
  results?: Record<number, { goals?: string }>;
  teams?: number[];
};



export type TabContainerProps<T extends string> = {
  tab: T;
  setTab: React.Dispatch<React.SetStateAction<T>>;
  tabs: T[];
};

export type Match = {
  id: number
  home: string;
  away: string;
  date: string;
  score?: string;
  location?: string;
  image: any;
  homeLogo?: { uri: string };
  awayLogo?: { uri: string };
};

export type Slide = {
  image: { uri: string };
  text: string;
};

export const positionMap: Record<string, string> = {
  gk: "Goalkeeper",
  cb: "Defender",
  rb: "Right Back",
  lb: "Left Back",
  cm: "Midfielder",
  dm: "Defensive Midfielder",
  am: "Attacking Midfielder",
  rw: "Right Winger",
  lw: "Left Winger",
  cf: "Forward",
  st: "Striker",
};

export type PostType = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url?: string;
    }[];
  };
};

export type NewsProps = {
  data: PostType[];
  loading?: boolean;
  error?: string;
  onSelect?: (item: PostType) => void;
};

export interface Stat {
  playerId: string;
  playerName: string;
  goals: number;
  goalMinutes: string[];
  assists: number;
  assistMinutes: string[];
  yellowcards: number;
  yellowMinutes: string[];
  redcards: number;
  redMinutes: string[];
  sub: string | null;
  subName?: string | null; 
  subMinute: string | null;
}

export interface TeamStanding {
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  _embedded?: {
    team?: { name: string }[];
  };
}

export interface LeagueTableProps {
  // title: string;
  tableData: TeamRow[];
  isLoading: boolean;
}

export interface TeamRow {
  name: string;
  pos: number;
  p: string;
  w: string;
  d: string;
  l: string;
  f: string;
  a: string;
  gd: string;
  pts: string;
}


