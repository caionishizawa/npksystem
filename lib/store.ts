import { create } from 'zustand';
import { PointsModel, StrategyInput } from './types';
import { loadSnapshot, saveSnapshot } from './storage';

interface LoopLabState {
  strategies: StrategyInput[];
  points: PointsModel[];
  hydrate: () => void;
  saveStrategy: (strategy: StrategyInput) => void;
  savePoints: (model: PointsModel) => void;
}

export const useLoopLabStore = create<LoopLabState>((set) => ({
  strategies: [],
  points: [],
  hydrate: () => {
    const snapshot = loadSnapshot();
    set({ strategies: snapshot.strategies, points: snapshot.points });
  },
  saveStrategy: (strategy) => {
    set((state) => {
      const strategies = [strategy, ...state.strategies.filter((item) => item.id !== strategy.id)];
      saveSnapshot({ strategies, points: state.points });
      return { strategies };
    });
  },
  savePoints: (model) => {
    set((state) => {
      const points = [model, ...state.points.filter((item) => item.id !== model.id)];
      saveSnapshot({ strategies: state.strategies, points });
      return { points };
    });
  }
}));
