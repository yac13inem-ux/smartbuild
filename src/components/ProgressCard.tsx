'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  grosOeuvre: number;
  ces: number;
  cet: number;
  global: number;
  className?: string;
}

export function ProgressCard({
  grosOeuvre,
  ces,
  cet,
  global,
  className,
}: ProgressCardProps) {
  const { t } = useLanguage();

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('project.progress')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Global Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{t('dashboard.totalProgress')}</span>
            <span className="font-bold text-primary">{global}%</span>
          </div>
          <Progress value={global} className="h-3" />
        </div>

        {/* Gros Œuvre - 50% weight */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t('dashboard.grosOeuvre')}</span>
            <span className="text-muted-foreground text-xs">(50%)</span>
            <span className="font-medium">{grosOeuvre}%</span>
          </div>
          <Progress value={grosOeuvre} className="h-2" />
        </div>

        {/* CES - 30% weight */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t('dashboard.ces')}</span>
            <span className="text-muted-foreground text-xs">(30%)</span>
            <span className="font-medium">{ces}%</span>
          </div>
          <Progress value={ces} className="h-2" />
        </div>

        {/* CET - 20% weight */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t('dashboard.cet')}</span>
            <span className="text-muted-foreground text-xs">(20%)</span>
            <span className="font-medium">{cet}%</span>
          </div>
          <Progress value={cet} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
