import { NetworkContext } from '@/context/NetworkContext';
import React, { useContext } from 'react';
import NoInternet from './noInternet';
import WaitingInternet from './waitingInternet';

const NetworkGuard = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useContext(NetworkContext);

  // console.log('NetworkGuard render, isConnected:', isConnected);

  // Show loading UI while network status is unknown
  if (isConnected === null) {
    return (
      <WaitingInternet />
    );
  }

  // Optionally: show "offline" message if no connection
  if (isConnected === false) {
    return (
      <NoInternet />
    );
  }

  // Connected, render children normally
  return <>{children}</>;
};

export default NetworkGuard;
