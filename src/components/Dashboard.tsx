'use client';

import { useState, useEffect } from 'react';
import { CircularProgress } from './CircularProgress';
import { KPICard } from './KPICard';
import { RecentActivity } from './RecentActivity';
import { Building2, FileText, AlertTriangle, Blocks, ChevronDown, ChevronRight, HardHat } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress, ProgressBlue, ProgressGreen } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleAddProjectDialog } from './SimpleAddProjectDialog';

interface DashboardProps {
  projects?: any[];
  blocks?: any[];
  reports?: any[];
  problems?: any[];
}

export function Dashboard({
  projects: externalProjects,
  blocks: externalBlocks,
  reports: externalReports,
  problems: externalProblems,
}: DashboardProps) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Use external data if provided, otherwise fetch from API
      if (externalProjects && externalProjects.length > 0) {
        setProjects(externalProjects);
      } else {
        const projectsResponse = await fetch('/api/projects');
        const projectsResult = await projectsResponse.json();
        if (projectsResult.success) {
          setProjects(projectsResult.data);
        }
      }

      if (externalBlocks && externalBlocks.length > 0) {
        setBlocks(externalBlocks);
      } else {
        const blocksResponse = await fetch('/api/blocks');
        const blocksResult = await blocksResponse.json();
        if (blocksResult.success) {
          setBlocks(blocksResult.data);
        }
      }

      if (externalReports && externalReports.length > 0) {
        setReports(externalReports);
      } else {
        const reportsResponse = await fetch('/api/reports');
        const reportsResult = await reportsResponse.json();
        if (reportsResult.success) {
          setReports(reportsResult.data);
        }
      }

      if (externalProblems && externalProblems.length > 0) {
        setProblems(externalProblems);
      } else {
        const problemsResponse = await fetch('/api/problems');
        const problemsResult = await problemsResponse.json();
        if (problemsResult.success) {
          setProblems(problemsResult.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall progress from blocks data
  const calculateOverallProgress = () => {
    if (blocks.length === 0) return 0;
    const totalProgress = blocks.reduce((sum, block) => sum + (block.globalProgress || 0), 0);
    return Math.round(totalProgress / blocks.length);
  };

  const calculateGrosOeuvreProgress = () => {
    if (blocks.length === 0) return 0;
    const totalProgress = blocks.reduce((sum, block) => sum + (block.grosOeuvreProgress || 0), 0);
    return Math.round(totalProgress / blocks.length);
  };

  const calculateCESProgress = () => {
    if (blocks.length === 0) return 0;
    const totalProgress = blocks.reduce((sum, block) => sum + (block.cesProgress || 0), 0);
    return Math.round(totalProgress / blocks.length);
  };

  const calculateCETProgress = () => {
    if (blocks.length === 0) return 0;
    const totalProgress = blocks.reduce((sum, block) => sum + (block.cetProgress || 0), 0);
    return Math.round(totalProgress / blocks.length);
  };

  const totalProgress = calculateOverallProgress();
  const grosOeuvreProgress = calculateGrosOeuvreProgress();
  const cesProgress = calculateCESProgress();
  const cetProgress = calculateCETProgress();

  // Toggle project expansion
  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Group blocks by project
  const blocksByProject = blocks.reduce((acc, block) => {
    if (!acc[block.projectId]) {
      acc[block.projectId] = [];
    }
    acc[block.projectId].push(block);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate KPIs from real data
  const openProblems = problems.filter((p) => p.status !== 'RESOLVED').length;
  const weeklyReports = reports.filter(
    (r) => new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Count total blocks from all projects
  const totalBlocks = blocks.length;

  // Get recent activities from reports and problems
  const recentActivities = [
    ...reports.slice(0, 2).map((report) => ({
      id: `report-${report.id}`,
      type: report.type === 'PV_VISITE' ? 'pv_visite' as const :
            report.type === 'PV_CONSTAT' ? 'pv_constat' as const : 'update' as const,
      title: report.title,
      description: report.description || report.type,
      timestamp: new Date(report.date),
    })),
    ...problems.slice(0, 2).map((problem) => ({
      id: `problem-${problem.id}`,
      type: 'problem' as const,
      title: t('problems.addProblem'),
      description: problem.description,
      timestamp: new Date(problem.createdAt),
      status: problem.status.toLowerCase() as any,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show welcome state if no projects
  if (projects.length === 0) {
    return (
      <div className="space-y-6 pb-20">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <HardHat className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">{t('project.title')}</h2>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة مشروع جديد لتتبع التقدم وإدارة الفريق
            </p>
            <div className="flex justify-center">
              <SimpleAddProjectDialog onProjectAdded={fetchDashboardData} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Progress Sections - All circles in one row */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Gros Œuvre Progress */}
            <div className="flex flex-col items-center text-center">
              <CircularProgress
                value={grosOeuvreProgress}
                label="Gros Œuvre"
                size={70}
                strokeWidth={6}
                color="primary"
              />
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">{t('dashboard.grosOeuvre')}</p>
                <span className="font-bold text-primary text-sm">{grosOeuvreProgress}%</span>
              </div>
            </div>

            {/* CES Progress */}
            <div className="flex flex-col items-center text-center">
              <CircularProgress
                value={cesProgress}
                label="CES"
                size={70}
                strokeWidth={6}
                color="blue"
              />
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">{t('dashboard.ces')}</p>
                <span className="font-bold text-blue-500 text-sm">{cesProgress}%</span>
              </div>
            </div>

            {/* CET Progress */}
            <div className="flex flex-col items-center text-center">
              <CircularProgress
                value={cetProgress}
                label="CET"
                size={70}
                strokeWidth={6}
                color="green"
              />
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">{t('dashboard.cet')}</p>
                <span className="font-bold text-green-500 text-sm">{cetProgress}%</span>
              </div>
            </div>

            {/* Total Progress */}
            <div className="flex flex-col items-center text-center">
              <CircularProgress
                value={totalProgress}
                size={70}
                strokeWidth={6}
                color="orange"
              />
              <div className="mt-2">
                <span className="font-bold text-orange-500 text-sm">{totalProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      {projects.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <KPICard
            title={t('dashboard.openProblems')}
            value={openProblems}
            icon={AlertTriangle}
            trend={openProblems > 0 ? `${openProblems} ${t('problems.openProblem')}` : null}
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
      )}

      {/* Projects and Blocks Progress */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t('dashboard.projectsAndBlocksProgress')}</h2>
          {projects.map((project) => {
            const projectBlocks = blocksByProject[project.id] || [];
            const isExpanded = expandedProjects.has(project.id);

            // Calculate project progress
            const projectTotalProgress = projectBlocks.length > 0
              ? Math.round(projectBlocks.reduce((sum: number, b: any) => sum + (b.globalProgress || 0), 0) / projectBlocks.length)
              : 0;
            const projectGrosOeuvre = projectBlocks.length > 0
              ? Math.round(projectBlocks.reduce((sum: number, b: any) => sum + (b.grosOeuvreProgress || 0), 0) / projectBlocks.length)
              : 0;
            const projectCES = projectBlocks.length > 0
              ? Math.round(projectBlocks.reduce((sum: number, b: any) => sum + (b.cesProgress || 0), 0) / projectBlocks.length)
              : 0;
            const projectCET = projectBlocks.length > 0
              ? Math.round(projectBlocks.reduce((sum: number, b: any) => sum + (b.cetProgress || 0), 0) / projectBlocks.length)
              : 0;

            return (
              <Card key={project.id}>
                <CardHeader
                  className="cursor-pointer hover:bg-muted/50 transition-colors py-4"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {projectBlocks.length} {t('common.blocksCount')}
                      </Badge>
                      <Badge variant={projectTotalProgress === 100 ? 'default' : 'outline'} className="text-sm font-bold">
                        {projectTotalProgress}%
                      </Badge>
                    </div>
                  </div>

                  {/* Project Progress Bar */}
                  {projectBlocks.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-bold">{projectTotalProgress}%</span>
                      </div>

                      {/* Combined Progress Bars in one row with colors */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground font-medium">Gros Œuvre</span>
                            <span className="font-bold text-primary">{projectGrosOeuvre}%</span>
                          </div>
                          <Progress value={projectGrosOeuvre} className="h-2.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground font-medium">CES</span>
                            <span className="font-bold text-blue-500">{projectCES}%</span>
                          </div>
                          <ProgressBlue value={projectCES} className="h-2.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground font-medium">CET</span>
                            <span className="font-bold text-green-500">{projectCET}%</span>
                          </div>
                          <ProgressGreen value={projectCET} className="h-2.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 pb-4 px-4">
                    <div className="space-y-3 mt-3">
                      {projectBlocks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {t('dashboard.noBlocksYet')}
                        </p>
                      ) : (
                        projectBlocks.map((block) => (
                          <div
                            key={block.id}
                            className="border rounded-lg p-3 bg-muted/20"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Blocks className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">
                                  {block.name}
                                  {block.blockNumber && ` (${block.blockNumber})`}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {block.globalProgress || 0}%
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Gros Œuvre</span>
                                  <span className="font-medium text-xs">{block.grosOeuvreProgress || 0}%</span>
                                </div>
                                <Progress value={block.grosOeuvreProgress || 0} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">CES</span>
                                  <span className="font-medium text-xs">{block.cesProgress || 0}%</span>
                                </div>
                                <Progress value={block.cesProgress || 0} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">CET</span>
                                  <span className="font-medium text-xs">{block.cetProgress || 0}%</span>
                                </div>
                                <Progress value={block.cetProgress || 0} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      {recentActivities.length > 0 && <RecentActivity activities={recentActivities} />}
    </div>
  );
}
