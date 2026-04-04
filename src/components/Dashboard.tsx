'use client';

import { CircularProgress } from './CircularProgress';
import { KPICard } from './KPICard';
import { RecentActivity } from './RecentActivity';
import { Building2, FileText, AlertTriangle, Blocks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DashboardProps {
  projects?: any[];
  blocks?: any[];
  reports?: any[];
  problems?: any[];
}

export function Dashboard({
  projects = [],
  blocks = [],
  reports = [],
  problems = [],
}: DashboardProps) {
  const { t } = useLanguage();

  // Calculate overall progress (mock data for now)
  const totalProgress = 68;
  const grosOeuvreProgress = 75;
  const cesProgress = 60;
  const cetProgress = 70;

  // Calculate KPIs
  const openProblems = problems.filter((p) => p.status !== 'RESOLVED').length || 3;
  const weeklyReports = reports.filter(
    (r) => new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length || 12;
  const totalBlocks = blocks.length || 8;

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'pv_constat' as const,
      title: 'PV Constat - Block A',
      description: 'Wall crack detected in R+2, needs immediate attention',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending' as const,
    },
    {
      id: '2',
      type: 'pv_visite' as const,
      title: 'PV de Visite - Block B',
      description: 'Weekly site inspection completed, all systems operational',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'problem' as const,
      title: 'Electrical Issue - Unit 101',
      description: 'Power outage in main panel, electrician dispatched',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'in_progress' as const,
    },
    {
      id: '4',
      type: 'update' as const,
      title: 'Progress Update - Block C',
      description: 'Gros Œuvre phase completed at 85%',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Circular Progress Section */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.title')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <CircularProgress
              value={totalProgress}
              label={t('dashboard.totalProgress')}
              size={100}
              strokeWidth={6}
            />
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{t('dashboard.grosOeuvre')}</span>
                  <span className="font-medium">{grosOeuvreProgress}%</span>
                </div>
                <Progress value={grosOeuvreProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{t('dashboard.ces')}</span>
                  <span className="font-medium">{cesProgress}%</span>
                </div>
                <Progress value={cesProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{t('dashboard.cet')}</span>
                  <span className="font-medium">{cetProgress}%</span>
                </div>
                <Progress value={cetProgress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <KPICard
          title={t('dashboard.openProblems')}
          value={openProblems}
          icon={AlertTriangle}
          trend="2 urgent"
        />
        <KPICard
          title={t('dashboard.weeklyReports')}
          value={weeklyReports}
          icon={FileText}
        />
        <KPICard
          title={t('dashboard.blocks')}
          value={totalBlocks}
          icon={Building2}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  );
}
