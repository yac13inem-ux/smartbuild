'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, MessageCircle, Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

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
  onProblemsChange?: () => void;
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

// Initial mock data
const initialProblems: Problem[] = [
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

// Helper function to format date consistently
function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function ProblemList({ problems = [], onProblemsChange }: ProblemListProps) {
  const { t } = useLanguage();
  const [localProblems, setLocalProblems] = useState<Problem[]>(problems.length > 0 ? problems : initialProblems);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('all');
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [deletingProblem, setDeletingProblem] = useState<Problem | null>(null);
  const [editForm, setEditForm] = useState({ description: '', status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' });

  // Update local problems when prop changes
  useEffect(() => {
    if (problems.length > 0) {
      setLocalProblems(problems);
    }
  }, [problems]);

  const filteredProblems = filter === 'all'
    ? localProblems
    : localProblems.filter((p) => p.status === filter);

  const handleView = (problem: Problem) => {
    setViewingProblem(problem);
  };

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setEditForm({ description: problem.description, status: problem.status });
  };

  const handleDelete = (problem: Problem) => {
    setDeletingProblem(problem);
  };

  const confirmDelete = async () => {
    if (!deletingProblem) return;
    
    try {
      // In production, this would call the API to delete the problem
      console.log('Deleting problem:', deletingProblem.id);
      
      // Remove from local state
      setLocalProblems(prev => prev.filter(p => p.id !== deletingProblem.id));
      
      setDeletingProblem(null);
      if (onProblemsChange) onProblemsChange();
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProblem) return;
    
    try {
      // In production, this would call the API to update the problem
      console.log('Updating problem:', editingProblem.id, editForm);
      
      // Update local state
      setLocalProblems(prev => 
        prev.map(problem => 
          problem.id === editingProblem.id 
            ? { ...problem, description: editForm.description, status: editForm.status }
            : problem
        )
      );
      
      setEditingProblem(null);
      if (onProblemsChange) onProblemsChange();
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

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
          const count = localProblems.filter((p) => p.status === status).length;

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
                          <span>{formatDate(problem.createdAt)}</span>
                        </div>
                        {problem.images && problem.images.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <span>📷 {problem.images.length} {problem.images.length === 1 ? 'photo' : 'photos'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 mr-2"
                      onClick={() => handleWhatsAppShare(problem)}
                    >
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      {t('problems.whatsapp')}
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(problem)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(problem)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(problem)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* View Problem Dialog */}
      <Dialog open={!!viewingProblem} onOpenChange={(open) => !open && setViewingProblem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('problems.viewProblem') || 'View Problem'}</DialogTitle>
          </DialogHeader>
          {viewingProblem && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">{t('problems.problemDescription') || 'Description'}</Label>
                <p className="text-base mt-1">{viewingProblem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('problems.status') || 'Status'}</Label>
                  <div className="mt-2">
                    <Badge className={statusConfig[viewingProblem.status].color}>
                      {t(statusConfig[viewingProblem.status].label)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('problems.date') || 'Date'}</Label>
                  <p className="mt-1">{formatDate(viewingProblem.createdAt)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">{t('project.projectName') || 'Project'}</Label>
                <p className="mt-1">{viewingProblem.projectName}</p>
              </div>
              {viewingProblem.blockName && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('block.blockName') || 'Block'}</Label>
                  <p className="mt-1">{viewingProblem.blockName}</p>
                </div>
              )}
              {viewingProblem.unitName && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('unit.unitName') || 'Unit'}</Label>
                  <p className="mt-1">{viewingProblem.unitName}</p>
                </div>
              )}
              {viewingProblem.images && viewingProblem.images.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('problems.uploadImages') || 'Images'}</Label>
                  <div className="mt-2 flex gap-2">
                    {viewingProblem.images.map((image, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        📷 {image.split('/').pop()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Problem Dialog */}
      <Dialog open={!!editingProblem} onOpenChange={(open) => !open && setEditingProblem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('problems.editProblem') || 'Edit Problem'}</DialogTitle>
          </DialogHeader>
          {editingProblem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-description">{t('problems.problemDescription')}</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">{t('problems.status')}</Label>
                <Select value={editForm.status} onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">{t('problems.pending')}</SelectItem>
                    <SelectItem value="IN_PROGRESS">{t('problems.inProgress')}</SelectItem>
                    <SelectItem value="RESOLVED">{t('problems.resolved')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProblem(null)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSaveEdit}>
                  {t('common.save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProblem} onOpenChange={(open) => !open && setDeletingProblem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete') || 'Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('problems.deleteConfirm') || 'Are you sure you want to delete this problem? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
