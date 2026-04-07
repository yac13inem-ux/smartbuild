'use client';

import { Building2, Layers, Home, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlockDetailsProps {
  blockNumber?: string;
  name: string;
  description?: string;
  totalFloors?: number;
  completedFloors?: number;
  totalUnits?: number;
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  globalProgress: number;
}

export function BlockDetailsCard({
  blockNumber,
  name,
  description,
  totalFloors = 0,
  completedFloors = 0,
  totalUnits = 0,
  grosOeuvreProgress,
  cesProgress,
  cetProgress,
  globalProgress,
}: BlockDetailsProps) {
  const { t } = useLanguage();

  const floorsProgress = totalFloors > 0 ? Math.round((completedFloors / totalFloors) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              {blockNumber && <span className="text-primary mr-2">Bloc {blockNumber}</span>}
              {name}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Badge variant="outline" className="text-lg font-bold">
            {globalProgress}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* إحصائيات البلوك */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Layers className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{completedFloors}/{totalFloors}</p>
            <p className="text-xs text-muted-foreground">الطوابق</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Home className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{totalUnits}</p>
            <p className="text-xs text-muted-foreground">الشقق</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Building2 className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{floorsProgress}%</p>
            <p className="text-xs text-muted-foreground">إكمال الطوابق</p>
          </div>
        </div>

        {/* تقدم الطوابق */}
        {totalFloors > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">تقدم إنجاز الطوابق</span>
              <span className="font-medium">{completedFloors} من {totalFloors} طابق</span>
            </div>
            <Progress value={floorsProgress} className="h-2" />
          </div>
        )}

        {/* تقدم الأشغال */}
        <div className="space-y-3 pt-2 border-t">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{t('dashboard.grosOeuvre')}</span>
              <span className="font-medium">{grosOeuvreProgress}% (50%)</span>
            </div>
            <Progress value={grosOeuvreProgress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{t('dashboard.ces')} (الأشغال التشطيبية)</span>
              <span className="font-medium">{cesProgress}% (30%)</span>
            </div>
            <Progress value={cesProgress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{t('dashboard.cet')} (الأشغال التقنية)</span>
              <span className="font-medium">{cetProgress}% (20%)</span>
            </div>
            <Progress value={cetProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
