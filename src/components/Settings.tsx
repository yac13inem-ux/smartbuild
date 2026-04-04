'use client';

import { User, Palette, Globe, LogOut, Bell, Shield } from 'lucide-react';
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
      title: t('settings.profile'),
      items: [
        {
          icon: User,
          label: 'John Doe',
          description: 'Engineer',
          action: null,
        },
      ],
    },
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
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Enabled',
          action: null,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: Shield,
          label: 'Change Password',
          description: 'Last changed 30 days ago',
          action: null,
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-lg font-semibold">{t('settings.title')}</h2>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">John Doe</h3>
              <p className="text-sm text-muted-foreground">Civil Engineer</p>
              <p className="text-xs text-muted-foreground mt-1">john.doe@example.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="w-full gap-2"
        onClick={() => {
          // Handle logout
          console.log('Logout clicked');
        }}
      >
        <LogOut className="h-4 w-4" />
        {t('settings.logout')}
      </Button>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground pb-4">
        <p>Construction Management v1.0.0</p>
        <p className="mt-1">© 2025 Construction Team</p>
      </div>
    </div>
  );
}
