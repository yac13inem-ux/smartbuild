'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LanguageTest() {
  const { language, t, isRTL } = useLanguage();

  return (
    <Card className="mb-4 border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-sm">
          {t('common.loading')} - Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div><strong>Current Language:</strong> {language}</div>
        <div><strong>Is RTL:</strong> {isRTL ? 'Yes' : 'No'}</div>
        <div><strong>Document Dir:</strong> {document.documentElement.dir}</div>
        <div><strong>Test Translation:</strong> {t('dashboard.title')}</div>
        <div><strong>Test Translation 2:</strong> {t('problems.title')}</div>
      </CardContent>
    </Card>
  );
}
