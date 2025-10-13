import { useTheme } from '@/context/ThemeContext';
import { verticalScale } from '@/utils/styling';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import ScreenWrapper from './ScreenWrapper';
import Typo from './Typo';

const { width, height } = Dimensions.get("window");

type CustomSplashScreenProps = {
  onFinish: () => void;
};

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish(); // remove from parent AFTER fade out
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     router.replace('/../components/slides');
  //   } else {
  //     router.replace('(tabs)/index');
  //   }
  // }, []);

  return (
    <ScreenWrapper>
      <Animated.View style={[styles.container, { opacity }]}>
        <Image
          source={require('@/assets/images/transparent.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.footer}>
          <View style={styles.branding}>
            <Image
              source={require('@/assets/images/transparent.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.textBlock}>
              <Typo style={styles.footerText} color={theme.colors.white}>
                Powered by
              </Typo>
              <Typo style={styles.bold} color={theme.colors.white}>
                Ja-Square
              </Typo>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default CustomSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(100),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  image: {
    width: width - 30,
    height: 200,
    borderRadius: 10,
  },
  footer: {
    position: 'absolute',
    bottom: verticalScale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },

  branding: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: verticalScale(30),
    height: verticalScale(30),
    marginRight: 10,
  },

  textBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});