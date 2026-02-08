'use client';

import { PointsForm } from '@/components/points-form';
import { Card } from '@/components/ui/card';

export default function PointsPage() {
  return (
    <div className="space-y-6">
      <Card className="text-xs text-slate-400">
        Não é conselho financeiro. Modelos de pontos são projeções.
      </Card>
      <PointsForm />
    </div>
  );
}
