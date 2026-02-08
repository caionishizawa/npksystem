import { SavedSnapshot, StrategyInput, PointsModel } from './types';

const STORAGE_KEY = 'looplab:snapshot:v1';

export function loadSnapshot(): SavedSnapshot {
  if (typeof window === 'undefined') {
    return { strategies: [], points: [] };
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { strategies: [], points: [] };
  }
  try {
    const parsed = JSON.parse(raw) as SavedSnapshot;
    return {
      strategies: parsed.strategies ?? [],
      points: parsed.points ?? []
    };
  } catch {
    return { strategies: [], points: [] };
  }
}

export function saveSnapshot(snapshot: SavedSnapshot) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function saveStrategy(strategy: StrategyInput) {
  const snapshot = loadSnapshot();
  const next = {
    ...snapshot,
    strategies: [strategy, ...snapshot.strategies.filter((item) => item.id !== strategy.id)]
  };
  saveSnapshot(next);
}

export function savePoints(model: PointsModel) {
  const snapshot = loadSnapshot();
  const next = {
    ...snapshot,
    points: [model, ...snapshot.points.filter((item) => item.id !== model.id)]
  };
  saveSnapshot(next);
}

export function exportSnapshot(): string {
  return JSON.stringify(loadSnapshot(), null, 2);
}

export function importSnapshot(raw: string) {
  try {
    const parsed = JSON.parse(raw) as SavedSnapshot;
    saveSnapshot({
      strategies: parsed.strategies ?? [],
      points: parsed.points ?? []
    });
  } catch {
    // ignore
  }
}
