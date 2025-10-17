// import { useAuth } from '@/context/UserContext'
import { spacingX } from '@/types/theme'
import { HeaderProps } from '@/types/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import Typo from './Typo'

const ICON_WIDTH = verticalScale(40); // approximate width of your icon container

const Header = ({ rightIcon, leftIcon, style, logo, title }: HeaderProps) => {
  // const { isAuthenticated } = useAuth()


  return (
    <View style={[styles.container, style]}>
      {/* Left Icon or Spacer */}
      {leftIcon ? (
        // <TouchableOpacity>
          <View style={styles.leftIcon}>{leftIcon}</View>
        // </TouchableOpacity>
      ) : (
        <View style={{ width: ICON_WIDTH }} />
      )}

      {/* Logo */}
      <View style={styles.centerContent}>
        {title ? (
          <Typo size={24} fontWeight={'bold'}>
            {title}
          </Typo>
        ) : logo ? (
          <Image source={logo} style={styles.logo} />
        ) : null}
      </View>

      {/* Right Icon or Spacer */}
      {rightIcon ? (
        // <TouchableOpacity onPress={() => { isAuthenticated ? router.push('/(modals)/settings') : router.replace('/(auth)/login') }}>
          <View style={styles.rightIcon}>{rightIcon}</View>
      ) : (
        <View style={{ width: ICON_WIDTH }} />
      )}
    </View>
  );

}

export default Header

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacingX._10,
  },
  leftIcon: {
    paddingHorizontal: spacingX._12,
    // width: ICON_WIDTH,
    alignItems: 'flex-start',
  },
  rightIcon: {
    paddingHorizontal: spacingX._12,
    // width: ICON_WIDTH,
    alignItems: 'flex-end',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: verticalScale(80),
    resizeMode: 'contain',
    maxWidth: verticalScale(120),
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
