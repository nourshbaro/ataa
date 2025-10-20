import Typo from '@/components/Typo';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ScreenWrapper from './ScreenWrapper';
import { useLanguage } from '@/context/LanguageContext';

const NoInternet = () => {
    const {t}= useLanguage()
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/transparent.png')}
                    style={styles.backgroundImage}
                    resizeMode='contain'
                />
                <Typo style={styles.text}>{t('nointernet')}</Typo>
                <Typo style={styles.text}>{t('trylater')}</Typo>
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
