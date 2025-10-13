import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locale/en/translation.json';
import ar from '../locale/ar/translation.json';

const STORAGE_KEY = 'ataa_language';

type Language = 'en' | 'ar';
type Translations = Record<string, string>;

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Translations> = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedLanguage === 'en' || storedLanguage === 'ar') {
                    setLanguageState(storedLanguage);
                }
            } catch (error) {
                console.error('Error loading language:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadLanguage();
    }, []);

    const toggleLanguage = async () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        try {
            await AsyncStorage.setItem(STORAGE_KEY, newLang);
            setLanguageState(newLang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving selected language:', error);
        }
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    if (!isLoaded) return null;

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
