import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Coins
} from "lucide-react";
import type { Holding } from "../services/api";
import { formatINR } from "./GainsCard";

interface HoldingsTableProps {
  holdings: Holding[];
  selectedCoins: Set<string>;
  onToggleSelect: (coinSymbol: string) => void;
  onToggleSelectAll: (selectAll: boolean) => void;
  onAutoSelectLosses?: () => void;
}

type SortField = "name" | "currentPrice" | "stcg" | "ltcg" | "totalValue";
type SortOrder = "asc" | "desc";

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  selectedCoins,
  onToggleSelect,
  onToggleSelectAll,
  onAutoSelectLosses,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewAll, setViewAll] = useState(false);

  // Toggle sorting order or field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to desc for values
    }
  };

  // Filter and sort holdings
  const filteredAndSortedHoldings = useMemo(() => {
    // 1. Filter
    const filtered = holdings.filter(
      (h) =>
        h.coin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.coinName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Sort
    return filtered.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === "name") {
        valA = a.coinName.toLowerCase();
        valB = b.coinName.toLowerCase();
      } else if (sortField === "currentPrice") {
        valA = a.currentPrice;
        valB = b.currentPrice;
      } else if (sortField === "stcg") {
        valA = a.stcg.gain;
        valB = b.stcg.gain;
      } else if (sortField === "ltcg") {
        valA = a.ltcg.gain;
        valB = b.ltcg.gain;
      } else if (sortField === "totalValue") {
        valA = a.totalHolding * a.currentPrice;
        valB = b.totalHolding * b.currentPrice;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [holdings, searchQuery, sortField, sortOrder]);

  // Determine which items to display based on viewAll state
  const displayedHoldings = viewAll 
    ? filteredAndSortedHoldings 
    : filteredAndSortedHoldings.slice(0, 6);

  const isAllSelected = useMemo(() => {
    if (filteredAndSortedHoldings.length === 0) return false;
    return filteredAndSortedHoldings.every((h) => selectedCoins.has(h.coin));
  }, [filteredAndSortedHoldings, selectedCoins]);

  const handleSelectAllChange = () => {
    onToggleSelectAll(!isAllSelected);
  };

  return (
    <div className="rounded-3xl border border-brand-borderDark bg-brand-cardDark/40 p-6 shadow-xl backdrop-blur-md">
      
      {/* Table Actions Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center space-x-2">
            <span>Asset Holdings</span>
            <span className="text-xs bg-brand-cardLight dark:bg-brand-cardLight/50 px-2 py-0.5 rounded-full font-mono font-medium text-brand-textMuted">
              {holdings.length} total
            </span>
          </h3>
          <p className="text-xs text-brand-textMuted mt-1 font-sans">
            Select underwater tokens to harvest realized losses and minimize your taxes.
          </p>
        </div>

        {/* Action Controls & Search Input */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {onAutoSelectLosses && (
            <button
              onClick={onAutoSelectLosses}
              disabled={holdings.length === 0}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white dark:text-brand-darkBg text-xs font-bold px-4 py-2.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Coins className="h-4 w-4" />
              <span>Harvest All Losses</span>
            </button>
          )}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textMuted" />
            <input
              type="text"
              placeholder="Search coin or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-brand-borderDark/80 bg-brand-darkBg/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-brand-textMuted outline-none transition-all focus:border-brand-primaryBlue focus:ring-1 focus:ring-brand-primaryBlue/20"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-brand-borderDark/60 text-xs font-bold uppercase tracking-wider text-brand-textMuted">
              <th className="py-4 pl-4 w-12">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    className="h-4.5 w-4.5 rounded border-brand-borderDark/80 bg-brand-darkBg text-brand-primaryBlue focus:ring-brand-primaryBlue/30 focus:ring-offset-brand-cardDark"
                  />
                </div>
              </th>
              <th 
                onClick={() => handleSort("name")}
                className="py-4 cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Asset</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("currentPrice")}
                className="py-4 cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Price (INR)</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("totalValue")}
                className="py-4 cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Total Holding</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("stcg")}
                className="py-4 cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end space-x-1 text-brand-textMuted/90">
                  <span>STCG Gain</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("ltcg")}
                className="py-4 cursor-pointer select-none hover:text-slate-900 dark:hover:text-white transition-colors text-right pr-4"
              >
                <div className="flex items-center justify-end space-x-1 text-brand-textMuted/90">
                  <span>LTCG Gain</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-borderDark/30">
            <AnimatePresence initial={false}>
              {displayedHoldings.map((holding) => {
                const isSelected = selectedCoins.has(holding.coin);
                const totalValue = holding.totalHolding * holding.currentPrice;

                return (
                  <motion.tr
                    key={holding.coin}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group transition-colors hover:bg-brand-cardLight/20 ${
                      isSelected ? "bg-brand-primaryBlue/5" : ""
                    }`}
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(holding.coin)}
                          className="h-4.5 w-4.5 rounded border-brand-borderDark/80 bg-brand-darkBg text-brand-primaryBlue focus:ring-brand-primaryBlue/30 focus:ring-offset-brand-cardDark"
                        />
                      </div>
                    </td>
                    <td className="py-4 font-sans">
                      <div className="flex items-center space-x-3">
                        <img
                          src={holding.logo}
                          alt={holding.coin}
                          onError={(e) => {
                            // Fallback logo if broken link
                            (e.target as HTMLImageElement).src =
                              "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                          }}
                          className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 object-contain"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white leading-none">
                            {holding.coin}
                          </div>
                          <div className="text-[11px] text-brand-textMuted mt-1 truncate max-w-[150px] md:max-w-[200px]">
                            {holding.coinName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                      {formatINR(holding.currentPrice)}
                    </td>
                    <td className="py-4 text-right font-sans">
                      <div className="font-bold text-slate-900 dark:text-white font-mono leading-none">
                        {holding.totalHolding > 1e-4 
                          ? holding.totalHolding.toLocaleString(undefined, { maximumFractionDigits: 6 })
                          : holding.totalHolding.toExponential(4)}
                      </div>
                      <div className="text-[10px] text-brand-textMuted font-mono mt-1">
                        ≈ {formatINR(totalValue)}
                      </div>
                    </td>
                    
                    {/* STCG Gain Column */}
                    <td className="py-4 text-right font-sans">
                      {holding.stcg.gain !== 0 ? (
                        <>
                          <div
                            className={`font-mono font-bold leading-none flex items-center justify-end space-x-1 ${
                              holding.stcg.gain > 0
                                ? "text-brand-neonGreen"
                                : "text-brand-neonRed"
                            }`}
                          >
                            {holding.stcg.gain > 0 ? (
                              <TrendingUp className="h-3 w-3 inline mr-0.5" />
                            ) : (
                              <TrendingDown className="h-3 w-3 inline mr-0.5" />
                            )}
                            <span>{formatINR(holding.stcg.gain)}</span>
                          </div>
                          <div className="text-[10px] text-brand-textMuted font-mono mt-1">
                            {holding.stcg.balance > 1e-4
                              ? holding.stcg.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })
                              : holding.stcg.balance.toExponential(2)}{" "}
                            {holding.coin}
                          </div>
                        </>
                      ) : (
                        <span className="text-brand-textMuted font-mono text-xs">-</span>
                      )}
                    </td>

                    {/* LTCG Gain Column */}
                    <td className="py-4 text-right font-sans pr-4">
                      {holding.ltcg.gain !== 0 ? (
                        <>
                          <div
                            className={`font-mono font-bold leading-none flex items-center justify-end space-x-1 ${
                              holding.ltcg.gain > 0
                                ? "text-brand-neonGreen"
                                : "text-brand-neonRed"
                            }`}
                          >
                            {holding.ltcg.gain > 0 ? (
                              <TrendingUp className="h-3 w-3 inline mr-0.5" />
                            ) : (
                              <TrendingDown className="h-3 w-3 inline mr-0.5" />
                            )}
                            <span>{formatINR(holding.ltcg.gain)}</span>
                          </div>
                          <div className="text-[10px] text-brand-textMuted font-mono mt-1">
                            {holding.ltcg.balance > 1e-4
                              ? holding.ltcg.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })
                              : holding.ltcg.balance.toExponential(2)}{" "}
                            {holding.coin}
                          </div>
                        </>
                      ) : (
                        <span className="text-brand-textMuted font-mono text-xs">-</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredAndSortedHoldings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-8 w-8 text-brand-textMuted/70 mb-2" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">No assets found</p>
            <p className="text-xs text-brand-textMuted mt-1">
              Try adjusting your search keywords.
            </p>
          </div>
        )}
      </div>

      {/* View All / Collapse Button */}
      {filteredAndSortedHoldings.length > 6 && (
        <div className="mt-4 flex justify-center border-t border-brand-borderDark/40 pt-4">
          <button
            onClick={() => setViewAll(!viewAll)}
            className="flex items-center space-x-1.5 text-xs font-semibold text-brand-primaryBlue hover:text-blue-400 transition-colors uppercase tracking-wider focus:outline-none"
          >
            <span>{viewAll ? "Show Less" : "View All"}</span>
            {viewAll ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
