'use client';

import { Building2, MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCard } from './ProgressCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

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

interface Block {
  id: string;
  name: string;
  globalProgress: number;
}

interface ProjectListProps {
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onAddProject?: () => void;
}

export function ProjectList({
  projects = [],
  onSelectProject,
  onAddProject,
}: ProjectListProps) {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock data for demo
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Residential Complex Alpha',
      description: 'Modern residential complex with 4 blocks',
      location: 'Algiers, Algeria',
      globalProgress: 68,
      grosOeuvreProgress: 85,
      cesProgress: 50,
      cetProgress: 60,
      blocks: [
        { id: '1-1', name: 'Block A', globalProgress: 75 },
        { id: '1-2', name: 'Block B', globalProgress: 60 },
        { id: '1-3', name: 'Block C', globalProgress: 70 },
        { id: '1-4', name: 'Block D', globalProgress: 65 },
      ],
    },
    {
      id: '2',
      name: 'Commercial Tower Beta',
      description: 'Office building with mixed-use facilities',
      location: 'Oran, Algeria',
      globalProgress: 42,
      grosOeuvreProgress: 60,
      cesProgress: 20,
      cetProgress: 40,
      blocks: [
        { id: '2-1', name: 'Tower A', globalProgress: 42 },
      ],
    },
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  if (selectedProject && onSelectProject) {
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
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('project.title')}</h2>
        {onAddProject && (
          <Button size="sm" onClick={onAddProject}>
            {t('common.add')}
          </Button>
        )}
      </div>

      {displayProjects.map((project) => (
        <Card
          key={project.id}
          className="hover:shadow-md transition-shadow"
          onClick={() => {
            setSelectedProject(project);
            onSelectProject?.(project);
          }}
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
                {project.blocks.length} {t('project.blocks')}
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
