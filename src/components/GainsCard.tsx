import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ShieldCheck, FlameKindling, TrendingDown } from "lucide-react";

interface GainsBreakdown {
  profits: number;
  losses: number;
  net: number;
}

interface GainsData {
  stcg: GainsBreakdown;
  ltcg: GainsBreakdown;
  realized: number;
}

interface GainsCardProps {
  type: "pre" | "post";
  data: GainsData;
  taxSavings?: number;
  harvestedCount?: number;
}

// Utility to format values as INR currency
export const formatINR = (value: number): string => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const GainsCard: React.FC<GainsCardProps> = ({
  type,
  data,
  taxSavings = 0,
  harvestedCount = 0,
}) => {
  const isPre = type === "pre";
  const { stcg, ltcg, realized } = data;

  // Local adaptive styling classes
  const textPrimaryClass = isPre ? "text-slate-900 dark:text-white" : "text-white";
  const textMutedClass = isPre ? "text-brand-textMuted" : "text-blue-100/70";
  const bgSectionClass = isPre 
    ? "bg-brand-cardLight/50 dark:bg-brand-darkBg/50 border-brand-borderDark/40" 
    : "bg-black/20 border-white/5";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-500 md:p-8 ${
        isPre
          ? "border-brand-borderDark bg-gradient-to-br from-brand-cardDark to-brand-cardDark/90 shadow-xl"
          : "border-blue-500/40 bg-gradient-to-br from-blue-900/90 via-brand-primaryBlue to-blue-800 shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)] animate-glow"
      }`}
    >
      {/* Decorative top glows */}
      <div
        className={`absolute -top-24 -right-24 h-48 w-48 rounded-full filter blur-[60px] opacity-20 ${
          isPre ? "bg-slate-400 dark:bg-slate-500" : "bg-emerald-400"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
              isPre
                ? "bg-brand-cardLight dark:bg-brand-cardLight/50 text-brand-textMuted"
                : "bg-white/10 text-emerald-300"
            }`}
          >
            {isPre ? "Current state" : "Simulated state"}
          </span>
          <h3 className={`text-2xl font-bold tracking-tight mt-2 font-sans ${textPrimaryClass}`}>
            {isPre ? "Pre-Harvesting" : "After Harvesting"}
          </h3>
        </div>
        {!isPre && harvestedCount > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium"
          >
            <FlameKindling className="h-3.5 w-3.5 animate-pulse" />
            <span>{harvestedCount} Harvested</span>
          </motion.div>
        )}
      </div>

      {/* STCG & LTCG Breakdown */}
      <div className="space-y-6">
        {/* Short Term Capital Gains Section */}
        <div className={`rounded-2xl p-4 border transition-all ${bgSectionClass}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-semibold tracking-wide flex items-center ${textMutedClass}`}>
              Short-term (STCG)
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${
                isPre
                  ? "bg-brand-cardLight/85 dark:bg-brand-cardLight/50 text-brand-textMuted"
                  : "bg-white/10 text-white/80"
              }`}
            >
              Held ≤ 1 Year
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>
                Profits
              </p>
              <p className={`text-sm font-semibold font-mono mt-0.5 truncate ${textPrimaryClass}`}>
                {formatINR(stcg.profits)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>
                Losses
              </p>
              <p className={`text-sm font-semibold font-mono mt-0.5 truncate ${isPre ? "text-slate-500 dark:text-brand-textMuted/90" : "text-blue-100/70"}`}>
                {formatINR(stcg.losses)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>
                Net
              </p>
              <p
                className={`text-sm font-bold font-mono mt-0.5 truncate ${
                  stcg.net > 0
                    ? isPre
                      ? "text-brand-neonGreen"
                      : "text-emerald-300"
                    : stcg.net < 0
                    ? isPre
                      ? "text-brand-neonRed"
                      : "text-red-300"
                    : textPrimaryClass
                }`}
              >
                {stcg.net > 0 ? "+" : ""}
                {formatINR(stcg.net)}
              </p>
            </div>
          </div>
        </div>

        {/* Long Term Capital Gains Section */}
        <div className={`rounded-2xl p-4 border transition-all ${bgSectionClass}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-semibold tracking-wide ${textMutedClass}`}>
              Long-term (LTCG)
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${
                isPre
                  ? "bg-brand-cardLight/85 dark:bg-brand-cardLight/50 text-brand-textMuted"
                  : "bg-white/10 text-white/80"
              }`}
            >
              Held &gt; 1 Year
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>
                Profits
              </p>
              <p className={`text-sm font-semibold font-mono mt-0.5 truncate ${textPrimaryClass}`}>
                {formatINR(ltcg.profits)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>
                Losses
              </p>
              <p className={`text-sm font-semibold font-mono mt-0.5 truncate ${isPre ? "text-slate-500 dark:text-brand-textMuted/90" : "text-blue-100/70"}`}>
                {formatINR(ltcg.losses)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>
                Net
              </p>
              <p
                className={`text-sm font-bold font-mono mt-0.5 truncate ${
                  ltcg.net > 0
                    ? isPre
                      ? "text-brand-neonGreen"
                      : "text-emerald-300"
                    : ltcg.net < 0
                    ? isPre
                      ? "text-brand-neonRed"
                      : "text-red-300"
                    : textPrimaryClass
                }`}
              >
                {ltcg.net > 0 ? "+" : ""}
                {formatINR(ltcg.net)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Realized Capital Gains Summary */}
      <div className="mt-8 border-t border-brand-borderDark/40 pt-6">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium flex items-center space-x-1 ${textMutedClass}`}>
            <span>Realised Capital Gains</span>
            <span className="group relative cursor-help">
              <Info className={`h-3.5 w-3.5 transition-colors ${isPre ? "text-brand-textMuted/70 hover:text-slate-900 dark:hover:text-white" : "text-white/70 hover:text-white"}`} />
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 rounded bg-brand-cardLight dark:bg-brand-cardDark border border-brand-borderDark/80 p-2 text-[10px] text-brand-textMuted opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 shadow-xl">
                Net short-term gains aggregated with net long-term gains.
              </span>
            </span>
          </span>
          <span
            className={`text-lg font-bold font-mono ${
              realized > 0
                ? isPre
                  ? "text-brand-neonGreen"
                  : "text-emerald-300"
                : realized < 0
                ? isPre
                  ? "text-brand-neonRed"
                  : "text-red-300"
                : textPrimaryClass
            }`}
          >
            {realized > 0 ? "+" : ""}
            {formatINR(realized)}
          </span>
        </div>
        <p className={`text-[10px] tracking-wider font-light ${textMutedClass}`}>
          SUM OF NET STCG & NET LTCG
        </p>
      </div>

      {/* Dynamic Savings Banner */}
      {!isPre && (
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {taxSavings > 0 ? (
              <motion.div
                key="savings-banner"
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-950/20 backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 rounded-full bg-emerald-400/20 p-1 text-emerald-300">
                      <ShieldCheck className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-300">
                        Tax Harvest Active!
                      </h4>
                      <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                        You're going to save{" "}
                        <span className="font-bold text-white font-mono text-sm underline decoration-emerald-400 decoration-2">
                          {formatINR(taxSavings)}
                        </span>{" "}
                        in tax.
                      </p>
                      <div className="mt-2.5 flex items-center space-x-1 text-[10px] text-emerald-300/80 font-mono">
                        <TrendingDown className="h-3 w-3" />
                        <span>Calculated at 30% flat crypto tax rate.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-savings-banner"
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/70">
                    Select loss-making assets below to simulate harvesting and
                    reveal your estimated tax savings.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
