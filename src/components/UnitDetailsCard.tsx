'use client';

import { Home, Layers, Ruler, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnitDetailsProps {
  unitNumber?: string;
  name: string;
  description?: string;
  floorNumber?: number;
  unitType?: string;
  area?: number;
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  globalProgress: number;

  // تفاصيل CES
  cesPlumbing?: number;
  cesElectrical?: number;
  cesPainting?: number;
  cesFlooring?: number;
  cesCarpentry?: number;
  cesCeramic?: number;

  // تفاصيل CET
  cetHvac?: number;
  cetFireFighting?: number;
  cetElevators?: number;
  cetPlumbing?: number;
  cetElectrical?: number;
}

export function UnitDetailsCard({
  unitNumber,
  name,
  description,
  floorNumber,
  unitType,
  area,
  grosOeuvreProgress,
  cesProgress,
  cetProgress,
  globalProgress,
  cesPlumbing = 0,
  cesElectrical = 0,
  cesPainting = 0,
  cesFlooring = 0,
  cesCarpentry = 0,
  cesCeramic = 0,
  cetHvac = 0,
  cetFireFighting = 0,
  cetElevators = 0,
  cetPlumbing = 0,
  cetElectrical = 0,
}: UnitDetailsProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {unitNumber && <span className="text-primary mr-2">#{unitNumber}</span>}
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
        {/* معلومات الشقة */}
        <div className="grid grid-cols-3 gap-2">
          {floorNumber !== undefined && (
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Layers className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-sm font-bold">{floorNumber}</p>
              <p className="text-xs text-muted-foreground">الطابق</p>
            </div>
          )}
          {unitType && (
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Home className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-sm font-bold">{unitType}</p>
              <p className="text-xs text-muted-foreground">النوع</p>
            </div>
          )}
          {area && (
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Ruler className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-sm font-bold">{area}m²</p>
              <p className="text-xs text-muted-foreground">المساحة</p>
            </div>
          )}
        </div>

        {/* التقدم العام */}
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
              <span className="text-muted-foreground font-medium">CES - الأشغال التشطيبية</span>
              <span className="font-medium">{cesProgress}% (30%)</span>
            </div>
            <Progress value={cesProgress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground font-medium">CET - الأشغال التقنية</span>
              <span className="font-medium">{cetProgress}% (20%)</span>
            </div>
            <Progress value={cetProgress} className="h-2" />
          </div>
        </div>

        {/* تفاصيل CES */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            تفاصيل CES - الأشغال التشطيبية
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <ProgressItem label="التوصيلات الصحية" value={cesPlumbing} />
            <ProgressItem label="الكهرباء" value={cesElectrical} />
            <ProgressItem label="الطلاء" value={cesPainting} />
            <ProgressItem label="الأرضيات" value={cesFlooring} />
            <ProgressItem label="النجارة" value={cesCarpentry} />
            <ProgressItem label="السيراميك" value={cesCeramic} />
          </div>
        </div>

        {/* تفاصيل CET */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            تفاصيل CET - الأشغال التقنية (MEP)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <ProgressItem label="التكييف والتبريد" value={cetHvac} />
            <ProgressItem label="مكافحة الحريق" value={cetFireFighting} />
            <ProgressItem label="المصاعد" value={cetElevators} />
            <ProgressItem label="الصرف الصحي العام" value={cetPlumbing} />
            <ProgressItem label="الكهرباء العامة" value={cetElectrical} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressItem({ label, value = 0 }: { label: string; value?: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-xs">{value}%</span>
      </div>
      <Progress value={value} className="h-1" />
    </div>
  );
}
