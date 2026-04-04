'use client';

import { AlertTriangle, Clock, MapPin, MessageCircle, Filter, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

interface Problem {
  id: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  projectName: string;
  blockName?: string;
  unitName?: string;
  createdAt: Date;
  images?: string[];
}

interface ProblemListProps {
  problems?: Problem[];
}

const statusConfig = {
  PENDING: {
    label: 'problems.pending',
    color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  },
  IN_PROGRESS: {
    label: 'problems.inProgress',
    color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  },
  RESOLVED: {
    label: 'problems.resolved',
    color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  },
};

export function ProblemList({ problems = [] }: ProblemListProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('all');

  // Mock data
  const mockProblems: Problem[] = [
    {
      id: '1',
      description: 'Wall crack detected in R+2 corridor, needs immediate structural assessment',
      status: 'PENDING',
      projectName: 'Residential Complex Alpha',
      blockName: 'Block A',
      unitName: 'Unit 201',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      images: ['/uploads/image1.jpg', '/uploads/image2.jpg'],
    },
    {
      id: '2',
      description: 'Electrical panel showing irregular voltage readings',
      status: 'IN_PROGRESS',
      projectName: 'Residential Complex Alpha',
      blockName: 'Block B',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      description: 'Water leakage in basement parking area',
      status: 'PENDING',
      projectName: 'Residential Complex Alpha',
      blockName: 'Block A',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    {
      id: '4',
      description: 'HVAC system malfunction in common areas',
      status: 'RESOLVED',
      projectName: 'Commercial Tower Beta',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const displayProblems = problems.length > 0 ? problems : mockProblems;

  const filteredProblems = filter === 'all'
    ? displayProblems
    : displayProblems.filter((p) => p.status === filter);

  const handleWhatsAppShare = (problem: Problem) => {
    const message = `🔴 ${problem.blockName || ''} - ${t('problems.title')}\n\n` +
      `📍 ${problem.projectName}${problem.blockName ? ` > ${problem.blockName}` : ''}${problem.unitName ? ` > ${problem.unitName}` : ''}\n\n` +
      `Issue: ${problem.description}\n\n` +
      `Please fix urgently.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('problems.title')}</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {filter === 'all' ? t('common.filter') : t(`problems.${filter.toLowerCase() as 'pending' | 'inProgress' | 'resolved'}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                {t('common.filter')} - {t('common.all') || 'All'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('PENDING')}>
                {t('problems.pending')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('IN_PROGRESS')}>
                {t('problems.inProgress')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('RESOLVED')}>
                {t('problems.resolved')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('problems.addProblem')}
          </Button>
        </div>
      </div>

      {/* Problem Stats */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = displayProblems.filter((p) => p.status === status).length;

          return (
            <Card key={status} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(config.label)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Problem List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {t('common.noData')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProblems.map((problem) => {
            const config = statusConfig[problem.status];

            return (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-destructive/10 mt-1">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-medium text-sm flex-1">
                            {problem.description}
                          </p>
                          <Badge
                            variant="secondary"
                            className={config.color}
                          >
                            {t(config.label)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {problem.projectName}
                            {problem.blockName && ` > ${problem.blockName}`}
                            {problem.unitName && ` > ${problem.unitName}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                        </div>
                        {problem.images && problem.images.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <span>📷 {problem.images.length} {problem.images.length === 1 ? 'photo' : 'photos'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleWhatsAppShare(problem)}
                    >
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      {t('problems.whatsapp')}
                    </Button>
                    <Button variant="ghost" size="sm">
                      {t('common.edit')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
