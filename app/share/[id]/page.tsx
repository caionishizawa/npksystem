'use client';

import { useEffect, useState } from 'react';
import { ShareableView } from '@/components/shareable-view';
import { loadSnapshot } from '@/lib/storage';
import { PointsModel, StrategyInput } from '@/lib/types';

export default function SharePage({ params }: { params: { id: string } }) {
  const [strategy, setStrategy] = useState<StrategyInput | undefined>(undefined);
  const [points, setPoints] = useState<PointsModel | undefined>(undefined);

  useEffect(() => {
    const snapshot = loadSnapshot();
    const foundStrategy = snapshot.strategies.find((item) => item.id === params.id);
    const foundPoints = snapshot.points.find((item) => item.id === params.id);
    setStrategy(foundStrategy);
    setPoints(foundPoints);
  }, [params.id]);

  return (
    <div className="max-w-2xl">
      <ShareableView strategy={strategy} points={points} />
    </div>
  );
}
