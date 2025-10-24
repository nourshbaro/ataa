import { spacingX, spacingY } from '@/types/theme';
import { verticalScale } from '@/utils/styling';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  card: {
          borderRadius: 16,
          padding: 16,
          marginVertical: 8,
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 6,
          elevation: 2,
          borderWidth: 1,
      },
      rowBetween: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
      },
      rowStart: {
          flexDirection: 'row',
          alignItems: 'center',
      },
      campaignText: {
          fontSize: 16,
      },
      amountText: {
          fontSize: 15,
      },
      date: {
          fontSize: 13,
      },
      status: {
          fontSize: 13,
          fontWeight: '500',
          textTransform: 'capitalize',
      },
      note: {
          fontSize: 12,
          fontStyle: 'italic',
      },
  
      container: {
          flex: 1,
          justifyContent: 'space-between',
          paddingHorizontal: spacingY._20,
          marginTop: Platform.OS == 'ios' ? spacingY._35 : 0
      },
      listContainer: {
          // gap: spacingY._30,
          marginTop: spacingY._15
      },
      // card: {
      //     padding: 16,
      //     borderRadius: 12,
      //     // marginBottom: 12,
      //     shadowOffset: { width: 0, height: 4 },
      //     shadowOpacity: 0.2,
      //     shadowRadius: 5,
      //     elevation: 5,
      // },
      // campaignText: {
      //     fontSize: 16,
      //     fontWeight: "bold",
      //     marginBottom: 4,
      // },
      // amountText: {
      //     fontSize: 18,
      //     fontWeight: "600",
      //     marginBottom: 4,
      // },
      // status: {
      //     fontSize: 14,
      //     fontWeight: "bold",
      //     marginBottom: 4,
      // },
      // date: {
      //     fontSize: 12,
      // },
      loader: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
      },
      emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
      },
      emptyText: {
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
      },
      // note: {
      //     fontSize: 12,
      //     fontStyle: 'italic',
      //     marginTop: 5
      // },
      // rowBetween: {
      //     flexDirection: 'row',
      //     justifyContent: 'space-between',
      //     alignItems: 'center',
      //     marginBottom: 8,
      // },
      rowEnd: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 8,
      },
      rowEven: {
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
      },
      suggestion: {
          fontSize: 14,
          marginTop: 8,
          textAlign: 'center',
      },
});

export default styles
