import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useEffect, useState } from 'react';

interface NetworkContextType {
  isConnected: boolean | null; // null means "loading"
}

export const NetworkContext = createContext<NetworkContextType>({
  isConnected: null,
});

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      // console.log('NetworkProvider: Network status:', state.isConnected);
    });

    // Also get initial state immediately
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};
