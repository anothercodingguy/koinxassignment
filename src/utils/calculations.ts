import type { Holding, CapitalGains } from "../services/api";

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
  taxRate: number;
}

export const TAX_RATE = 0.30; // 30% flat tax on crypto gains in India

/**
 * Calculates net gains and tax savings based on selected holdings for tax-loss harvesting.
 */
export const calculateHarvest = (
  initialGains: CapitalGains,
  holdings: Holding[],
  selectedCoins: Set<string>
): HarvestResults => {
  // Pre-harvesting gains calculations (direct from API)
  const preStcgNet = initialGains.stcg.profits - initialGains.stcg.losses;
  const preLtcgNet = initialGains.ltcg.profits - initialGains.ltcg.losses;
  const preRealized = preStcgNet + preLtcgNet;

  // Initialize post-harvesting gains with pre-harvesting values
  let postStcgProfits = initialGains.stcg.profits;
  let postStcgLosses = initialGains.stcg.losses;
  let postLtcgProfits = initialGains.ltcg.profits;
  let postLtcgLosses = initialGains.ltcg.losses;

  // Adjust gains for each selected holding
  holdings.forEach((holding) => {
    if (selectedCoins.has(holding.coin)) {
      // Short term gain adjustment
      const stcgGain = holding.stcg.gain;
      if (stcgGain > 0) {
        postStcgProfits += stcgGain;
      } else if (stcgGain < 0) {
        postStcgLosses += Math.abs(stcgGain);
      }

      // Long term gain adjustment
      const ltcgGain = holding.ltcg.gain;
      if (ltcgGain > 0) {
        postLtcgProfits += ltcgGain;
      } else if (ltcgGain < 0) {
        postLtcgLosses += Math.abs(ltcgGain);
      }
    }
  });

  const postStcgNet = postStcgProfits - postStcgLosses;
  const postLtcgNet = postLtcgProfits - postLtcgLosses;
  const postRealized = postStcgNet + postLtcgNet;

  // Calculate tax savings:
  // Tax savings = Tax paid before - Tax paid after
  // Tax paid = Math.max(0, realizedGains) * TAX_RATE
  const preTax = Math.max(0, preRealized) * TAX_RATE;
  const postTax = Math.max(0, postRealized) * TAX_RATE;
  
  // Note: Standard tax savings might also just be the direct reduction in positive tax liability
  const taxSavings = Math.max(0, preTax - postTax);

  return {
    preHarvest: {
      stcg: {
        profits: initialGains.stcg.profits,
        losses: initialGains.stcg.losses,
        net: preStcgNet,
      },
      ltcg: {
        profits: initialGains.ltcg.profits,
        losses: initialGains.ltcg.losses,
        net: preLtcgNet,
      },
      realized: preRealized,
    },
    postHarvest: {
      stcg: {
        profits: postStcgProfits,
        losses: postStcgLosses,
        net: postStcgNet,
      },
      ltcg: {
        profits: postLtcgProfits,
        losses: postLtcgLosses,
        net: postLtcgNet,
      },
      realized: postRealized,
    },
    taxSavings: taxSavings,
    taxRate: TAX_RATE,
  };
};
