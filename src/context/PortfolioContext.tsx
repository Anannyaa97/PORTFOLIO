import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  PublicPortfolioData,
  DEFAULT_PORTFOLIO_DATA,
  fetchPublicPortfolioData,
} from "../lib/portfolioService";

interface PortfolioContextType {
  data: PublicPortfolioData;
  isLoading: boolean;
  isSyncing: boolean;
  lastSynced: string;
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: DEFAULT_PORTFOLIO_DATA,
  isLoading: true,
  isSyncing: false,
  lastSynced: "",
  refetch: async () => {},
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PublicPortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("");

  const load = useCallback(async (forceRefresh = false) => {
    setIsSyncing(true);
    try {
      const fetched = await fetchPublicPortfolioData(forceRefresh);
      setData(fetched);
      setLastSynced(new Date().toISOString());
    } catch (e) {
      console.warn("Portfolio data loader encountered error, defaults preserved:", e);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    load(false);

    // Cross-tab synchronization listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_timestamp") {
        console.log("[Portfolio Sync] Invalidation received from Admin CMS. Refreshing public content...");
        load(true);
      }
    };

    // In-window custom event listener (e.g. from Admin preview or embedded iframe)
    const handleCustomSync = () => {
      console.log("[Portfolio Sync] Custom sync trigger. Refreshing public content...");
      load(true);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio:synced", handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio:synced", handleCustomSync);
    };
  }, [load]);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSyncing,
        lastSynced,
        refetch: load,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => useContext(PortfolioContext);
