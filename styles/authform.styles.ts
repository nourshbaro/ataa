import { spacingX, spacingY } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._10,
    paddingHorizontal: spacingX._20,
    justifyContent: 'center'
    // marginVertical: spacingY._40
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    //color: Colors.text
  },
  form: {
    gap: spacingY._10,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: '500',
    //color: text
  },
  footer: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: spacingY._30,
  },
  footerText: {
    textAlign: 'center',
    //color: Text,
    fontSize: verticalScale(15),
  },
  // errorText: {
  //   color: 'red',
  //   fontSize: 14,
  //   marginTop: 10,
  //   alignSelf: 'center'
  // },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 0,
    // alignSelf: 'center'
  },
  image: {
    alignSelf: 'center',
    height: verticalScale(150),
    marginTop: verticalScale(50),
    // height: 200,
    borderRadius: 10,
  },
});

export default styles
