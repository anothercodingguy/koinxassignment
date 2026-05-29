import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { fetchCapitalGains, fetchHoldings } from "../services/api";
import type { Holding, CapitalGains } from "../services/api";
import { calculateHarvest } from "../utils/calculations";

export interface HarvestResults {
  preHarvest: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realized: number;
  };
  postHarvest: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realized: number;
  };
  taxSavings: number;
}

interface TaxHarvestingContextType {
  loading: boolean;
  error: string | null;
  holdings: Holding[];
  initialGains: CapitalGains | null;
  selectedCoins: Set<string>;
  harvestResults: HarvestResults | null;
  theme: "light" | "dark";
  toggleTheme: () => void;
  loadData: () => Promise<void>;
  toggleSelectCoin: (coinSymbol: string) => void;
  toggleSelectAll: (selectAll: boolean) => void;
  autoSelectLosses: () => void;
  executeHarvest: () => void;
}

const TaxHarvestingContext = createContext<TaxHarvestingContextType | undefined>(undefined);

export const TaxHarvestingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialGains, setInitialGains] = useState<CapitalGains | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Theme Management
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Fetch data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [gainsRes, holdingsRes] = await Promise.all([
        fetchCapitalGains(),
        fetchHoldings(),
      ]);
      setInitialGains(gainsRes);
      setHoldings(holdingsRes);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tax data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Selection handlers
  const toggleSelectCoin = (coinSymbol: string) => {
    setSelectedCoins((prev) => {
      const next = new Set(prev);
      if (next.has(coinSymbol)) {
        next.delete(coinSymbol);
      } else {
        next.add(coinSymbol);
      }
      return next;
    });
  };

  const toggleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      const allSymbols = holdings.map((h) => h.coin);
      setSelectedCoins(new Set(allSymbols));
    } else {
      setSelectedCoins(new Set());
    }
  };

  const autoSelectLosses = () => {
    const lossSymbols = holdings
      .filter((h) => h.stcg.gain < 0 || h.ltcg.gain < 0)
      .map((h) => h.coin);
    setSelectedCoins(new Set(lossSymbols));
    
    // Sparkles celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#10B981", "#3B82F6", "#F59E0B"]
    });
  };

  // Memoized harvest calculations
  const harvestResults = useMemo(() => {
    if (!initialGains || holdings.length === 0) return null;
    return calculateHarvest(initialGains, holdings, selectedCoins);
  }, [initialGains, holdings, selectedCoins]);

  // Execute Simulated Harvesting with Confetti
  const executeHarvest = () => {
    if (!harvestResults || harvestResults.taxSavings === 0) return;
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <TaxHarvestingContext.Provider
      value={{
        loading,
        error,
        holdings,
        initialGains,
        selectedCoins,
        harvestResults,
        theme,
        toggleTheme,
        loadData,
        toggleSelectCoin,
        toggleSelectAll,
        autoSelectLosses,
        executeHarvest,
      }}
    >
      {children}
    </TaxHarvestingContext.Provider>
  );
};

export const useTaxHarvesting = () => {
  const context = useContext(TaxHarvestingContext);
  if (context === undefined) {
    throw new Error("useTaxHarvesting must be used within a TaxHarvestingProvider");
  }
  return context;
};
