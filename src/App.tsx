import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  Sparkles,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon
} from "lucide-react";
import { GainsCard, formatINR } from "./components/GainsCard";
import { HoldingsTable } from "./components/HoldingsTable";
import { CardSkeleton, TableSkeleton } from "./components/SkeletonLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { KoinXLogo } from "./components/KoinXLogo";
import { useTaxHarvesting } from "./context/TaxHarvestingContext";

export const App: React.FC = () => {
  const {
    loading,
    error,
    holdings,
    selectedCoins,
    harvestResults,
    theme,
    toggleTheme,
    loadData,
    toggleSelectCoin,
    toggleSelectAll,
    autoSelectLosses,
    executeHarvest,
  } = useTaxHarvesting();

  const [showExplanation, setShowExplanation] = useState(false);
  const [showDisclaimers, setShowDisclaimers] = useState(true);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-darkBg text-slate-900 dark:text-white flex flex-col pb-12 selection:bg-brand-primaryBlue selection:text-white transition-colors duration-300">
        
        {/* Top Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-brand-borderDark/40 py-4 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <KoinXLogo className="h-8 w-auto cursor-pointer" />
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-brand-borderDark/60 bg-brand-cardDark/50 hover:bg-brand-cardLight/50 hover:border-brand-primaryBlue/50 text-brand-textMuted dark:text-brand-textMuted/90 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4.5 w-4.5 text-amber-400" />
                  ) : (
                    <Moon className="h-4.5 w-4.5 text-blue-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-xl border border-brand-borderDark/60 bg-brand-cardDark/50 px-3 py-2 text-xs text-brand-textMuted hover:text-slate-900 dark:hover:text-white hover:border-brand-primaryBlue/50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 mt-8 space-y-6">
          
          {/* Page Title & How it works */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
                Tax Harvesting
              </h1>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs font-semibold text-brand-primaryBlue hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
              >
                How it works?
              </button>
            </div>
            
            {/* Quick Action Simulated Savings Indicator */}
            {harvestResults && harvestResults.taxSavings > 0 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden md:flex items-center space-x-3"
              >
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 dark:text-emerald-400 font-mono block">
                    Simulated Savings
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono leading-none">
                    {formatINR(harvestResults.taxSavings)}
                  </span>
                </div>
                <button
                  onClick={executeHarvest}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-brand-darkBg text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Lock in Savings</span>
                  <Sparkles className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Collapsible How-To Section */}
          <AnimatePresence>
            {showExplanation && (
              <motion.section
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative border border-brand-borderDark/40 bg-brand-cardLight/30 dark:bg-brand-cardDark/30 p-6 rounded-2xl">
                  <button 
                    onClick={() => setShowExplanation(false)}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-brand-cardLight dark:hover:bg-brand-cardLight/50 text-brand-textMuted hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white font-sans flex items-center space-x-2">
                    <Info className="h-4 w-4 text-brand-primaryBlue" />
                    <span>How Tax-Loss Harvesting Works</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-xs font-sans leading-relaxed text-brand-textMuted">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-slate-900 dark:text-white font-semibold">
                        <span className="bg-brand-primaryBlue/20 text-brand-primaryBlue h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                        <span>Identify Losses</span>
                      </div>
                      <p className="pl-6">Look at your current holdings in the table below. Assets labeled with negative STCG or LTCG gains have unrealized losses.</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-slate-900 dark:text-white font-semibold">
                        <span className="bg-brand-primaryBlue/20 text-brand-primaryBlue h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                        <span>Simulate Sales</span>
                      </div>
                      <p className="pl-6">Toggle the checkboxes next to those assets. Realizing the loss offsets profits you've made elsewhere, reducing net taxable gains.</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-slate-900 dark:text-white font-semibold">
                        <span className="bg-brand-primaryBlue/20 text-brand-primaryBlue h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                        <span>Optimize & Save</span>
                      </div>
                      <p className="pl-6">Compare the "After Harvesting" card on the right with the "Pre-Harvesting" card. Verify the estimated tax savings and lock it in.</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Collapsible Important Notes & Disclaimers Section */}
          <section className="rounded-2xl border border-blue-500/20 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10 overflow-hidden transition-all duration-300">
            <button
              onClick={() => setShowDisclaimers(!showDisclaimers)}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all focus:outline-none cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Info className="h-4.5 w-4.5" />
                <span>Important Notes & Disclaimers</span>
              </div>
              {showDisclaimers ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            <AnimatePresence initial={false}>
              {showDisclaimers && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="border-t border-blue-500/10 dark:border-blue-900/20 p-4 pt-2">
                    <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                      <li>
                        Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.
                      </li>
                      <li>
                        Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.
                      </li>
                      <li>
                        Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.
                      </li>
                      <li>
                        Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.
                      </li>
                      <li>
                        Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Cards Section */}
          <section className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : error ? (
              <div className="border border-brand-neonRed/20 bg-brand-neonRed/5 p-6 rounded-2xl text-center">
                <p className="text-brand-neonRed text-sm font-medium">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-3 px-4 py-2 bg-brand-cardLight border border-brand-borderDark hover:border-brand-neonRed/35 text-xs rounded-xl font-bold transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : harvestResults ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GainsCard 
                  type="pre" 
                  data={harvestResults.preHarvest} 
                />
                <GainsCard 
                  type="post" 
                  data={harvestResults.postHarvest} 
                  taxSavings={harvestResults.taxSavings}
                  harvestedCount={selectedCoins.size}
                />
              </div>
            ) : null}
          </section>

          {/* Holdings Table Section */}
          <section>
            {loading ? (
              <TableSkeleton />
            ) : error ? (
              null
            ) : (
              <HoldingsTable
                holdings={holdings}
                selectedCoins={selectedCoins}
                onToggleSelect={toggleSelectCoin}
                onToggleSelectAll={toggleSelectAll}
                onAutoSelectLosses={autoSelectLosses}
              />
            )}
          </section>

        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-brand-borderDark/40 pt-8 text-center text-xs text-brand-textMuted">
          <p>© {new Date().getFullYear()} KoinX. Developed as a Frontend assignment for Tax Loss Harvesting.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};
export default App;
