export type Network = 'Ethereum' | 'Arbitrum' | 'Optimism' | 'Base';
export type ProviderName = 'Aave V3' | 'Morpho' | 'Custom';

export interface Market {
  id: string;
  name: string;
  network: Network;
  provider: ProviderName;
}

export interface MarketSnapshot {
  marketId: string;
  supplyAPY: number;
  borrowAPY: number;
  incentivesSupply: number;
  incentivesBorrow: number;
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  availableLiquidity: number;
  utilization: number;
  oracleType: string;
  notes: string[];
  riskFlags: string[];
}

export interface StrategyInput {
  id: string;
  name: string;
  network: Network;
  provider: ProviderName;
  marketId: string;
  collateralAsset: string;
  debtAsset: string;
  initialCapital: number;
  riskTarget: 15 | 25 | 35;
  mode: 'simple' | 'pro';
  manualLtv?: number;
  minHealthFactor?: number;
  borrowSpike?: number;
  slippage?: number;
  liquidationBonus?: number;
  depegHaircut?: number;
  loopStopThreshold?: number;
}

export interface StrategyResult {
  netROE: number;
  healthFactor: number;
  liquidationPrice: number;
  distanceToLiq: number;
  leverage: number;
  supplyAPY: number;
  borrowAPY: number;
  incentivesNet: number;
  fees: number;
  assumptions: Record<string, string | number>;
}

export interface StressResult {
  label: string;
  healthFactor: number;
  netROE: number;
}

export interface PointsModel {
  id: string;
  project: string;
  pointsPerDay: number;
  days: number;
  multiplier: number;
  airdropPercent: number;
  fdv: {
    conservative: number;
    base: number;
    bull: number;
  };
  range: {
    minPoints: number;
    maxPoints: number;
  };
  pro: {
    totalSupply?: number;
    recipients?: number;
    capPerUser?: number;
    sybilDiscount?: number;
    tgeUnlock?: number;
    vestingMonths?: number;
  };
}

export interface SavedSnapshot {
  strategies: StrategyInput[];
  points: PointsModel[];
}
