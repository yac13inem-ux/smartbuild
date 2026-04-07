'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, ChevronRight, ArrowLeft, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCard } from './ProgressCard';
import { BlockDetailsCard } from './BlockDetailsCard';
import { UnitDetailsCard } from './UnitDetailsCard';
import { AddProjectDialog } from './AddProjectDialog';
import { AddBlockDialog } from './AddBlockDialog';
import { GrosOeuvreFloorTracker } from './GrosOeuvreFloorTracker';
import { ProjectActions } from './ProjectActions';
import { BlockActions } from './BlockActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Unit {
  id: string;
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
  cesPlumbing?: number;
  cesElectrical?: number;
  cesPainting?: number;
  cesFlooring?: number;
  cesCarpentry?: number;
  cesCeramic?: number;
  cetHvac?: number;
  cetFireFighting?: number;
  cetElevators?: number;
  cetPlumbing?: number;
  cetElectrical?: number;
}

interface Block {
  id: string;
  blockNumber?: string;
  name: string;
  description?: string;
  globalProgress: number;
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  totalFloors?: number;
  completedFloors?: number;
  totalUnits?: number;
  units: Unit[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  globalProgress: number;
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  blocks: Block[];
}

interface ProjectListEnhancedProps {
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onAddProject?: () => void;
}

type View = 'projects' | 'blocks' | 'gros-oeuvre' | 'units' | 'unit-details';

export function ProjectListEnhanced({
  projects: externalProjects,
  onSelectProject,
  onAddProject,
}: ProjectListEnhancedProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<View>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    if (externalProjects && externalProjects.length > 0) {
      setProjects(externalProjects);
    } else {
      fetchProjects();
    }
  }, [externalProjects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();

      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      toast.error(t('projectList.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setView('blocks');
  };

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setView('units');
  };

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setView('unit-details');
  };

  const handleBack = () => {
    if (view === 'units') {
      setView('blocks');
      setSelectedBlock(null);
    } else if (view === 'unit-details') {
      setView('units');
      setSelectedUnit(null);
    } else if (view === 'blocks') {
      setView('projects');
      setSelectedProject(null);
    } else if (view === 'gros-oeuvre') {
      setView('blocks');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'projects':
        return (
          <div className="space-y-3">
            {/* Always show Add Project Button at the top */}
            <div className="flex justify-end">
              <AddProjectDialog onProjectAdded={fetchProjects} />
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{t('common.loading')}</p>
                </CardContent>
              </Card>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-2">
                    {t('projectList.noProjects')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('projectList.startNewProject')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => {
                const totalBlocks = project.blocks?.length || 0;
                const totalUnits = project.blocks?.reduce((sum: number, block: any) => sum + (block.units?.length || 0), 0) || 0;
                const totalFloors = project.blocks?.reduce((sum: number, block: any) => sum + (block.totalFloors || 0), 0) || 0;

                // Calculate Gros Œuvre specific stats
                const completedFloors = project.blocks?.reduce((sum: number, block: any) => sum + (block.completedFloors || 0), 0) || 0;
                const grosOeuvreProgress = project.blocks?.reduce((sum: number, block: any) => sum + (block.grosOeuvreProgress || 0), 0) / (totalBlocks || 1) || 0;

                return (
                  <Card
                    key={project.id}
                    className="hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={(e) => {
                      // Prevent click when clicking on action buttons
                      if ((e.target as HTMLElement).closest('button')) {
                        e.stopPropagation();
                        return;
                      }
                      handleProjectClick(project);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10 mt-1">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base">{project.name}</h3>
                            {project.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {project.description}
                              </p>
                            )}
                            {project.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <MapPin className="h-3 w-3" />
                                <span>{project.location}</span>
                              </div>
                            )}
                            {totalBlocks === 0 && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {t('common.newProject')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ProjectActions
                            project={project}
                            onProjectUpdate={fetchProjects}
                            onNavigateToBlocks={(id) => {
                              const p = projects.find(proj => proj.id === id);
                              if (p) handleProjectClick(p);
                            }}
                          />
                        </div>
                      </div>

                      {/* Project Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                        <div className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{totalBlocks}</div>
                          <div className="text-xs text-muted-foreground">{t('projectList.building')}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{totalUnits}</div>
                          <div className="text-xs text-muted-foreground">{t('projectList.apartment')}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{totalFloors}</div>
                          <div className="text-xs text-muted-foreground">{t('projectList.floor')}</div>
                        </div>
                      </div>

                      {/* Gros Œuvre Progress Details - Only show if project has blocks */}
                      {totalBlocks > 0 ? (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">Gros Œuvre</span>
                              <span className="text-xs bg-orange-200 dark:bg-orange-900/40 px-2 py-0.5 rounded-full text-orange-800 dark:text-orange-300">
                                {Math.round(grosOeuvreProgress)}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-xs text-muted-foreground">
                            <div className="flex justify-between">
                              <span>{t('projectList.completedFloors')}</span>
                              <span className="font-medium">{completedFloors} / {totalFloors}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('projectList.concretePoured')}</span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {project.blocks?.filter((b: any) => b.grosOeuvreFloors?.some((f: any) => f.concretePoured)).length || 0} / {totalBlocks} {t('projectList.buildings')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('projectList.ironReview')}</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {project.blocks?.filter((b: any) => b.grosOeuvreFloors?.some((f: any) => f.ironApproval)).length || 0} / {totalBlocks} {t('projectList.buildings')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30 text-center">
                          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                            {t('projectList.startAddingBlocks')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('projectList.clickToAdd')}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        );

      case 'blocks':
        return (
          <div className="space-y-3">
            {selectedProject?.blocks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">
                    {t('projectList.noBlocks')}
                  </p>
                  <AddBlockDialog
                    projectId={selectedProject?.id}
                    onBlockAdded={fetchProjects}
                  />
                </CardContent>
              </Card>
            ) : (
              selectedProject?.blocks.map((block) => (
                <Card
                  key={block.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <BlockDetailsCard
                          blockNumber={block.blockNumber}
                          name={block.name}
                          description={block.description}
                          totalFloors={block.totalFloors}
                          completedFloors={block.completedFloors}
                          totalUnits={block.totalUnits}
                          grosOeuvreProgress={block.grosOeuvreProgress}
                          cesProgress={block.cesProgress}
                          cetProgress={block.cetProgress}
                          globalProgress={block.globalProgress}
                        />
                      </div>
                      <BlockActions
                        block={block}
                        onBlockUpdate={fetchProjects}
                        onNavigateToUnits={() => handleBlockClick(block)}
                        onNavigateToGrosOeuvre={() => {
                          setSelectedBlock(block);
                          setView('gros-oeuvre');
                        }}
                      />
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedBlock(block);
                          setView('gros-oeuvre');
                        }}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        {t('projectList.trackGrosOeuvre')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {selectedProject && selectedProject.blocks.length > 0 && (
              <AddBlockDialog
                projectId={selectedProject.id}
                onBlockAdded={fetchProjects}
              />
            )}
          </div>
        );

      case 'gros-oeuvre':
        return selectedBlock ? (
          <GrosOeuvreFloorTracker
            blockId={selectedBlock.id}
            blockNumber={selectedBlock.blockNumber}
            totalFloors={selectedBlock.totalFloors}
          />
        ) : null;

      case 'unit-details':
        return selectedUnit ? (
          <UnitDetailsCard {...selectedUnit} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-2">
        {view !== 'projects' && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        )}
        <h2 className="text-lg font-semibold flex-1">
          {view === 'projects' && t('project.title')}
          {view === 'blocks' && selectedProject?.name}
          {view === 'gros-oeuvre' && `${t('projectList.trackGrosOeuvreFor')} ${selectedBlock?.name}`}
          {view === 'units' && selectedBlock?.name}
          {view === 'unit-details' && t('projectList.apartmentDetails')}
        </h2>
      </div>

      {view === 'projects' && selectedProject && (
        <ProgressCard
          grosOeuvre={selectedProject.grosOeuvreProgress}
          ces={selectedProject.cesProgress}
          cet={selectedProject.cetProgress}
          global={selectedProject.globalProgress}
        />
      )}

      {renderView()}
    </div>
  );
}
