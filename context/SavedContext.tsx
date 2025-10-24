import apiClient from '@/api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useAuth } from './UserContext';

type SaveContextType = {
    savedCampaignIds: number[];
    fetchSavedCampaigns: () => Promise<void>;
    handleToggleSave: (campaignId: number) => Promise<void>;
    isSaving: boolean;
};

const SaveContext = createContext<SaveContextType | undefined>(undefined);

export const SaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, accessToken, refreshAccessToken, refreshLogout } = useAuth();
  const [savedCampaignIds, setSavedCampaignIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved campaigns from API
  const fetchSavedCampaigns = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get('/api/donor/campaigns/saved', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const saved = response.data?.data?.data || [];
      setSavedCampaignIds(saved.map((c: any) => c.id));
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 && refreshAccessToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const retryResponse = await apiClient.get('/api/donor/campaigns/saved', {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            const saved = retryResponse.data?.data?.data || [];
            setSavedCampaignIds(saved.map((c: any) => c.id));
          } catch (retryErr: any) {
            console.error('Retry failed:', retryErr.message);
            await refreshLogout();
          }
        } else {
          await refreshLogout();
        }
      } else {
        console.error('Error fetching saved campaigns:', err.message || err);
      }
    }
  }, [accessToken, isAuthenticated]);

  // Toggle save/unsave campaign
  const handleToggleSave = useCallback(
    async (campaignId: number) => {
      if (!isAuthenticated) return;
      setIsSaving(true);

      try {
        const response = await apiClient.post(
          `/api/donor/campaigns/${campaignId}/toggle-save`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const { status, errNum } = response.data;
        if (status) {
          setSavedCampaignIds(prev => {
            if (errNum === 'S002') {
              // Removed
              return prev.filter(id => id !== campaignId);
            } else {
              // Added
              return [...prev, campaignId];
            }
          });
        }
      } catch (err: any) {
        console.error('Error toggling save:', err.message || err);
      } finally {
        setIsSaving(false);
      }
    },
    [accessToken, isAuthenticated]
  );

  return (
    <SaveContext.Provider
      value={{
        savedCampaignIds,
        fetchSavedCampaigns,
        handleToggleSave,
        isSaving,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export const useSave = () => {
  const context = useContext(SaveContext);
  if (!context) throw new Error('useSave must be used within a SaveProvider');
  return context;
};