import apiClient from '@/api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, AppState } from 'react-native';

type AuthContextType = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  const isTokenExpired = (token: string): boolean => {
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!storedRefreshToken) {
        refreshLogout();
        return;
      }

      // Replace with your actual refresh endpoint
      const response = await apiClient.post(
        "/api/donor/refresh",
        {},
        {
          headers: { Authorization: `Bearer ${storedRefreshToken}` },
        }
      );

      const newAccessToken = response.data.access_token.access_token;
      const newRefreshToken = response.data.refresh_token;
      await SecureStore.setItemAsync('accessToken', newAccessToken);
      await SecureStore.setItemAsync('refreshToken', newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      return newAccessToken;
    } catch {
      return null;
    }
  };

  const refreshLogout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await AsyncStorage.removeItem('expires_in');
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    let isMounted = true;

    let loadingInProgress = false;

    const loadAccessToken = async () => {
      if (loadingInProgress) return;
      loadingInProgress = true;
      try {
        const storedToken = await SecureStore.getItemAsync('accessToken');
        if (storedToken && isTokenExpired(storedToken)) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            setAccessToken(newToken);
          } else {
            refreshLogout();
          }
        } else {
          setAccessToken(storedToken);
        }
      } catch {
        refreshLogout();
      } finally {
        setIsLoading(false);
        loadingInProgress = false;
      }
    };


    loadAccessToken();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        loadAccessToken();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const logout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            if (accessToken) {
              try {
                await apiClient.post("/api/donor/logout", {}, {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });

                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                await AsyncStorage.removeItem('name')
                await AsyncStorage.removeItem('expires_in');
                setAccessToken(null);
                setRefreshToken(null);
                router.replace('/(tabs)')
              } catch (error) {
                console.error('Logout API call failed', error);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const isAuthenticated = useMemo(() => {
    return !!accessToken && !isTokenExpired(accessToken);
  }, [accessToken]);
  useEffect(() => {
    AsyncStorage.setItem('AuthState', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider value={{
      accessToken,
      isAuthenticated,
      isLoading,
      setAccessToken,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};