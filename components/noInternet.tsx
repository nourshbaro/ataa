import Typo from '@/components/Typo';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ScreenWrapper from './ScreenWrapper';

const NoInternet = () => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/nejmehGold.png')}
                    style={styles.backgroundImage}
                    resizeMode='contain'
                />
                <Typo style={styles.text}>No Internet Connection</Typo>
                <Typo style={styles.text}>Please try again later</Typo>
            </View>
        </ScreenWrapper>
    );
};

export default NoInternet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        opacity: 0.3,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        fontStyle: 'italic'
    },
    text2: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        fontStyle: 'italic'
    },
});
