'use client';

import { Building2, MapPin, ChevronRight, Calendar, Home, HardHat, Hammer, Settings, FileText, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCard } from './ProgressCard';
import { SimpleAddProjectDialog } from './SimpleAddProjectDialog';
import { AddBlockDialog } from './AddBlockDialog';
import { EditFloorDialog } from './EditFloorDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FloorData {
  floorNumber: number;
  apartments: number;
  // Gros Œuvre data
  grosOeuvreProgress: number;
  concretePourDate: string | null;
  reinforcementInspectionDate: string | null;
  grosOeuvreNotes: string;
  // CES & CET data
  cesProgress: number;
  cetProgress: number;
  cesCetNotes: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  totalApartments?: number;
  blocks?: Block[];
  _count?: {
    blocks: number;
  };
}

interface Block {
  id: string;
  name: string;
  description?: string;
  numberOfFloors?: number;
  floorsData?: string;
  globalProgress: number;
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  projectId: string;
}

export function ProjectList() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [refreshBlocks, setRefreshBlocks] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();

      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('فشل تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjectBlocks = async (projectId: string) => {
    try {
      const response = await fetch(`/api/blocks?projectId=${projectId}`);
      const result = await response.json();

      if (result.success && selectedProject) {
        setSelectedProject({
          ...selectedProject,
          blocks: result.data,
        });
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
      toast.error('فشل تحميل العمارات');
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setSelectedBlock(null);
    await fetchProjectBlocks(project.id);
  };

  const parseFloorsData = (floorsDataString: string | null): FloorData[] => {
    if (!floorsDataString) return [];
    try {
      return JSON.parse(floorsDataString);
    } catch {
      return [];
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-DZ');
  };

  // Show block details view
  if (selectedBlock && selectedProject) {
    const floorsData = parseFloorsData(selectedBlock.floorsData);

    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBlock(null)}
            >
              ← {t('common.back')}
            </Button>
            <h2 className="text-lg font-semibold">{selectedBlock.name}</h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              console.log('Edit button clicked');
              console.log('Selected block:', selectedBlock);
              console.log('Floors data:', floorsData);
              toast.info(`فتح تعديل العمارة: ${selectedBlock.name}`);
              setEditDialogOpen(true);
              console.log('setEditDialogOpen called');
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            {t('common.edit')}
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <ProgressCard
              grosOeuvre={selectedBlock.grosOeuvreProgress}
              ces={selectedBlock.cesProgress}
              cet={selectedBlock.cetProgress}
              global={selectedBlock.globalProgress}
            />
          </CardContent>
        </Card>

        {floorsData.length > 0 ? (
          <Tabs defaultValue="grosOeuvre" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grosOeuvre">
                {t('project.grosOeuvreSection')}
              </TabsTrigger>
              <TabsTrigger value="cesCet">
                {t('project.cesCetSection')}
              </TabsTrigger>
            </TabsList>

            {/* Gros Œuvre Tab */}
            <TabsContent value="grosOeuvre" className="space-y-3 mt-4">
              {floorsData.map((floor) => (
                <Card key={floor.floorNumber} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 space-y-3">
                    {/* Floor Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{t('project.floorNumber')} {floor.floorNumber}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>{floor.apartments} {t('project.apartmentsCount')}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <HardHat className="h-3 w-3" />
                          <span>{t('project.grosOeuvreProgress')}</span>
                        </div>
                        <span className="font-medium">{floor.grosOeuvreProgress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${floor.grosOeuvreProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-xs">{t('project.concretePourDate')}</p>
                          <p className="font-medium">{formatDate(floor.concretePourDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-xs">{t('project.reinforcementInspection')}</p>
                          <p className="font-medium">{formatDate(floor.reinforcementInspectionDate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {floor.grosOeuvreNotes && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>{t('project.grosOeuvreNotes')}</span>
                        </div>
                        <p className="text-sm">{floor.grosOeuvreNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* CES & CET Tab */}
            <TabsContent value="cesCet" className="space-y-3 mt-4">
              {floorsData.map((floor) => (
                <Card key={floor.floorNumber} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4 space-y-3">
                    {/* Floor Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">{t('project.floorNumber')} {floor.floorNumber}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>{floor.apartments} {t('project.apartmentsCount')}</span>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* CES */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Hammer className="h-3 w-3" />
                            <span>{t('project.cesProgress')}</span>
                          </div>
                          <span className="font-medium">{floor.cesProgress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${floor.cesProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* CET */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span>{t('project.cetProgress')}</span>
                          </div>
                          <span className="font-medium">{floor.cetProgress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${floor.cetProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {floor.cesCetNotes && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>{t('project.cesCetNotes')}</span>
                        </div>
                        <p className="text-sm">{floor.cesCetNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                لا توجد بيانات للطوابق بعد
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );

    return (
      <>
        {blockDetails}
        <EditFloorDialog
          blockId={selectedBlock.id}
          blockName={selectedBlock.name}
          floorsData={floorsData}
          numberOfFloors={selectedBlock.numberOfFloors}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={(updatedFloors) => {
            // Update selectedBlock with new floorsData
            setSelectedBlock({
              ...selectedBlock,
              floorsData: JSON.stringify(updatedFloors),
            });
            // Also update the project's blocks list
            if (selectedProject.blocks) {
              setSelectedProject({
                ...selectedProject,
                blocks: selectedProject.blocks.map(b =>
                  b.id === selectedBlock.id
                    ? { ...b, floorsData: JSON.stringify(updatedFloors) }
                    : b
                ),
              });
            }
          }}
        />
      </>
    );
  }

  // Show project blocks view
  if (selectedProject) {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProject(null)}
            >
              ← {t('common.back')}
            </Button>
            <h2 className="text-lg font-semibold">{selectedProject.name}</h2>
          </div>
          <AddBlockDialog
            projectId={selectedProject.id}
            onBlockAdded={() => {
              setRefreshBlocks((prev) => prev + 1);
              fetchProjectBlocks(selectedProject.id);
            }}
          />
        </div>

        {selectedProject.description && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
            </CardContent>
          </Card>
        )}

        {selectedProject.location && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{selectedProject.location}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedProject.blocks && selectedProject.blocks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium">{t('project.blocks')}</h3>
            {selectedProject.blocks.map((block) => (
              <Card
                key={block.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedBlock(block)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{block.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {block.numberOfFloors} {t('project.numberOfFloors')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <ProgressCard
                    grosOeuvre={block.grosOeuvreProgress}
                    ces={block.cesProgress}
                    cet={block.cetProgress}
                    global={block.globalProgress}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">
                لا توجد عمارات في هذا المشروع بعد
              </p>
              <AddBlockDialog
                projectId={selectedProject.id}
                onBlockAdded={() => {
                  setRefreshBlocks((prev) => prev + 1);
                  fetchProjectBlocks(selectedProject.id);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 pb-20">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-4 pb-20">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">{t('project.title')}</h2>
            <p className="text-muted-foreground mb-6">
              لم يتم إنشاء أي مشروع بعد
            </p>
            <div className="flex justify-center">
              <SimpleAddProjectDialog onProjectAdded={fetchProjects} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('project.title')}</h2>
        <SimpleAddProjectDialog onProjectAdded={fetchProjects} />
      </div>

      {projects.map((project) => (
        <Card
          key={project.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleProjectClick(project)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{project.name}</CardTitle>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {project.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                {project.totalApartments && (
                  <span className="text-muted-foreground">
                    {project.totalApartments} {t('project.apartmentsCount')}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {project._count?.blocks || project.blocks?.length || 0} {t('project.blocks')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
