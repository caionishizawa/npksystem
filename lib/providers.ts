import { Market, MarketSnapshot, Network, ProviderName } from './types';

const markets: Market[] = [
  { id: 'eth-aave-usdc', name: 'ETH / USDC Core', network: 'Ethereum', provider: 'Aave V3' },
  { id: 'arb-aave-usdc', name: 'ARB / USDC Core', network: 'Arbitrum', provider: 'Aave V3' },
  { id: 'op-morpho-weth', name: 'OP / WETH Boost', network: 'Optimism', provider: 'Morpho' },
  { id: 'base-custom-usdbc', name: 'BASE / USDbC Custom', network: 'Base', provider: 'Custom' }
];

const snapshots: Record<string, MarketSnapshot> = {
  'eth-aave-usdc': {
    marketId: 'eth-aave-usdc',
    supplyAPY: 0.048,
    borrowAPY: 0.072,
    incentivesSupply: 0.012,
    incentivesBorrow: 0.008,
    ltv: 0.75,
    liquidationThreshold: 0.8,
    liquidationBonus: 0.05,
    availableLiquidity: 320000000,
    utilization: 0.71,
    oracleType: 'Chainlink',
    notes: ['Alta liquidez', 'Recompensas estáveis'],
    riskFlags: ['Recompensas podem variar']
  },
  'arb-aave-usdc': {
    marketId: 'arb-aave-usdc',
    supplyAPY: 0.052,
    borrowAPY: 0.079,
    incentivesSupply: 0.015,
    incentivesBorrow: 0.01,
    ltv: 0.72,
    liquidationThreshold: 0.78,
    liquidationBonus: 0.06,
    availableLiquidity: 180000000,
    utilization: 0.64,
    oracleType: 'Chainlink',
    notes: ['Ambiente L2', 'Baixa latência'],
    riskFlags: ['Risco de congestionamento em picos']
  },
  'op-morpho-weth': {
    marketId: 'op-morpho-weth',
    supplyAPY: 0.061,
    borrowAPY: 0.083,
    incentivesSupply: 0.02,
    incentivesBorrow: 0.012,
    ltv: 0.7,
    liquidationThreshold: 0.76,
    liquidationBonus: 0.055,
    availableLiquidity: 95000000,
    utilization: 0.69,
    oracleType: 'TWAP + Chainlink',
    notes: ['Boost de incentivos temporário'],
    riskFlags: ['Atenção a spikes de borrow']
  },
  'base-custom-usdbc': {
    marketId: 'base-custom-usdbc',
    supplyAPY: 0.043,
    borrowAPY: 0.068,
    incentivesSupply: 0.01,
    incentivesBorrow: 0.006,
    ltv: 0.68,
    liquidationThreshold: 0.74,
    liquidationBonus: 0.07,
    availableLiquidity: 52000000,
    utilization: 0.58,
    oracleType: 'Pyth',
    notes: ['Mercado emergente'],
    riskFlags: ['Liquidez moderada', 'Oráculo híbrido']
  }
};

const assets: Record<string, string[]> = {
  'eth-aave-usdc': ['ETH', 'stETH', 'USDC'],
  'arb-aave-usdc': ['ETH', 'ARB', 'USDC'],
  'op-morpho-weth': ['ETH', 'WETH', 'USDC'],
  'base-custom-usdbc': ['ETH', 'cbETH', 'USDbC']
};

export function listMarkets(network: Network, provider: ProviderName): Market[] {
  return markets.filter((market) => market.network === network && market.provider === provider);
}

export function getMarketSnapshot(marketId: string): MarketSnapshot {
  return snapshots[marketId];
}

export function listAssets(marketId: string): string[] {
  return assets[marketId] ?? [];
}
