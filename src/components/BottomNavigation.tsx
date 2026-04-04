'use client';

import { LayoutGrid, FileText, AlertTriangle, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type Tab = 'dashboard' | 'projects' | 'documents' | 'problems' | 'settings';

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { t } = useLanguage();

  const navItems = [
    { key: 'dashboard' as Tab, icon: Home },
    { key: 'projects' as Tab, icon: LayoutGrid },
    { key: 'documents' as Tab, icon: FileText },
    { key: 'problems' as Tab, icon: AlertTriangle },
    { key: 'settings' as Tab, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-full flex-1 rounded-none ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => onTabChange(item.key)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{t(`nav.${item.key}`)}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
