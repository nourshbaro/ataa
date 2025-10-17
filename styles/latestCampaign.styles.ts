import { spacingX, spacingY } from '@/types/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: "hidden",
        // marginBottom: 20,
        paddingBottom: 10,
        // shadowOffset: { width: 0, height: 5 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
        // elevation: 5,
        marginHorizontal: spacingX._20,
    },
    imageWrapper: {
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    image: {
        width: "100%",
        height: 200,
    },
    iconButton: {
        position: "absolute",
        top: 10,
        borderRadius: 50,
        padding: 6,
    },
    daysContainer: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    daysText: {
        fontSize: 12,
    },
    ngoText: {
        fontSize: 13,
        marginTop: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 8,
        marginHorizontal: spacingY._10
    },
    separator: {
        height: 1,
        marginVertical: 8,
        marginHorizontal: spacingY._20
    },
    fundingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingY._10
    },
    fundingText: {
        fontSize: 14,
    },
})

export default styles