import { MarketSnapshot, StrategyInput, StrategyResult, StressResult } from './types';

const LTV_TABLE: Record<StrategyInput['riskTarget'], number> = {
  15: 0.55,
  25: 0.65,
  35: 0.72
};

const DEFAULT_FEES = 0.003;

export function recommendedLtv(riskTarget: StrategyInput['riskTarget']): number {
  return LTV_TABLE[riskTarget];
}

export function simulateStrategy(input: StrategyInput, snapshot: MarketSnapshot): StrategyResult {
  const ltvUsed = input.manualLtv ?? recommendedLtv(input.riskTarget);
  const multiplier = 1 / (1 - ltvUsed);
  const incentivesNet = snapshot.incentivesSupply + snapshot.incentivesBorrow;
  const fees = DEFAULT_FEES + (input.slippage ?? 0) / 100;

  const netROE =
    snapshot.supplyAPY * multiplier -
    snapshot.borrowAPY * (multiplier - 1) +
    incentivesNet -
    fees;

  const collateralValue = input.initialCapital * multiplier;
  const debtValue = collateralValue - input.initialCapital;
  const healthFactor = (collateralValue * snapshot.liquidationThreshold) / debtValue;
  const liquidationPrice = (debtValue / snapshot.liquidationThreshold) / collateralValue;
  const distanceToLiq = 1 - liquidationPrice;

  return {
    netROE,
    healthFactor,
    liquidationPrice,
    distanceToLiq,
    leverage: multiplier,
    supplyAPY: snapshot.supplyAPY,
    borrowAPY: snapshot.borrowAPY,
    incentivesNet,
    fees,
    assumptions: {
      'LTV usado': ltvUsed,
      'Fator de alavancagem': multiplier,
      'Liquidação threshold': snapshot.liquidationThreshold,
      'Bonus liquidação': snapshot.liquidationBonus,
      'Slippage': input.slippage ?? 0,
      'Buffer HF mínimo': input.minHealthFactor ?? 1.6,
      'Depeg haircut': input.depegHaircut ?? 0,
      'Borrow spike': input.borrowSpike ?? 0
    }
  };
}

export function stressTests(input: StrategyInput, snapshot: MarketSnapshot): StressResult[] {
  const base = simulateStrategy(input, snapshot);
  const baseHf = base.healthFactor;
  const baseRoe = base.netROE;

  const shocks: { label: string; priceShock: number; borrowShock: number }[] = [
    { label: 'Preço -10%', priceShock: -0.1, borrowShock: 0 },
    { label: 'Preço -20%', priceShock: -0.2, borrowShock: 0 },
    { label: 'Preço -30%', priceShock: -0.3, borrowShock: 0 },
    { label: 'Borrow +5%', priceShock: 0, borrowShock: 0.05 },
    { label: 'Borrow +10%', priceShock: 0, borrowShock: 0.1 }
  ];

  return shocks.map((shock) => {
    const hf = baseHf * (1 + shock.priceShock);
    const roe = baseRoe - shock.borrowShock;
    return {
      label: shock.label,
      healthFactor: hf,
      netROE: roe
    };
  });
}

export function breakEvenBorrowRate(input: StrategyInput, snapshot: MarketSnapshot): number {
  const ltvUsed = input.manualLtv ?? recommendedLtv(input.riskTarget);
  const multiplier = 1 / (1 - ltvUsed);
  const incentivesNet = snapshot.incentivesSupply + snapshot.incentivesBorrow;
  const fees = DEFAULT_FEES + (input.slippage ?? 0) / 100;

  return (snapshot.supplyAPY * multiplier + incentivesNet - fees) / (multiplier - 1);
}
