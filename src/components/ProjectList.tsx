'use client';

import { Building2, MapPin, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCard } from './ProgressCard';
import { SimpleAddProjectDialog } from './SimpleAddProjectDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  globalProgress: number;
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  blocks?: Block[];
  _count?: {
    blocks: number;
  };
}

interface Block {
  id: string;
  name: string;
  globalProgress: number;
}

export function ProjectList() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  if (selectedProject) {
    // Show blocks view
    return (
      <div className="space-y-4 pb-20">
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

        <ProgressCard
          grosOeuvre={selectedProject.grosOeuvreProgress}
          ces={selectedProject.cesProgress}
          cet={selectedProject.cetProgress}
          global={selectedProject.globalProgress}
        />

        {selectedProject.blocks && selectedProject.blocks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium">{t('block.title')}</h3>
            {selectedProject.blocks.map((block) => (
              <Card
                key={block.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{block.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('dashboard.totalProgress')}: {block.globalProgress}%
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                لا توجد مباني في هذا المشروع بعد
              </p>
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
          onClick={() => setSelectedProject(project)}
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

            <ProgressCard
              grosOeuvre={project.grosOeuvreProgress}
              ces={project.cesProgress}
              cet={project.cetProgress}
              global={project.globalProgress}
            />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {project._count?.blocks || project.blocks?.length || 0} {t('project.blocks')}
              </span>
              <span className="font-medium text-primary">
                {t('dashboard.totalProgress')}: {project.globalProgress}%
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
