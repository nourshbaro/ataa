import { radius } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    scrollViewStyle: {
    // marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    // gap: spacingY._25
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: verticalScale(10),
    alignItems: 'center',
    marginHorizontal: verticalScale(20),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(20),
  },
  mainTitle: {
    fontSize: verticalScale(20),
    fontWeight: '700'
  },
  seeAll: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    marginTop: verticalScale(5)
  },
  errorText: {
    color: 'red',
    marginTop: 0,
    alignSelf: 'center',
    paddingHorizontal: verticalScale(50)
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  notfound: {
    marginTop: 0,
    alignSelf: 'center',
    paddingHorizontal: verticalScale(50)
  },
  image: {
    width: verticalScale(50),
        // backgroundColor: 'red',
        height: verticalScale(50),
    borderRadius: radius._30
  },
  iconButton: {
    // position: "absolute",
    // top: 10,
    borderRadius: 50,
    padding: 6,
  },
})

export default styles