'use client';

import { Palette, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Settings() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const settingsSections = [
    {
      title: t('settings.language'),
      items: [
        {
          icon: Globe,
          label: t('settings.language'),
          description: null,
          action: <LanguageSwitcher />,
        },
      ],
    },
    {
      title: t('settings.theme'),
      items: [
        {
          icon: Palette,
          label: t('settings.theme'),
          description: theme === 'dark' ? t('settings.dark') : t('settings.light'),
          action: <ThemeToggle />,
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-lg font-semibold">{t('settings.title')}</h2>

      {/* Settings Sections */}
      {settingsSections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;

                return (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.action}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* About App */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('settings.about') || 'About'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Construction Management</p>
            <p>Version 1.0.0</p>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground pb-4">
        <p>© 2025 Construction Team</p>
      </div>
    </div>
  );
}
