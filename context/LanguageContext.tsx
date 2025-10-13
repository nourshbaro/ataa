import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locale/en/translation.json';
import ar from '../locale/ar/translation.json';

const STORAGE_KEY = 'ataa_language';

export type Language = 'en' | 'ar';
type Translations = Record<string, string>;

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
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
        const newLang: Language = language === 'en' ? 'ar' : 'en';
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

    const t = useCallback((key: string): string => {
        const value = translations[language][key];
        if (!value) {
            console.warn(`Missing translation for key: "${key}" in language: "${language}"`);
        }
        return value || key;
    }, [language]);

    const isRTL = language === 'ar';

    if (!isLoaded) return null;

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Optional alias for cleaner usage
export const useTranslation = () => {
    const { t } = useLanguage();
    return t;
};