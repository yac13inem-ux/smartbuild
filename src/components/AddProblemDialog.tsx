'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddProblemDialogProps {
  onProblemAdded?: () => void;
}

export function AddProblemDialog({ onProblemAdded }: AddProblemDialogProps) {
  const { t, common } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    projectId: 'none',
    blockId: 'none',
    unitId: 'none',
    description: '',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'RESOLVED',
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchBlocks = async (projectId: string) => {
    try {
      const response = await fetch(`/api/blocks?projectId=${projectId}`);
      const result = await response.json();
      if (result.success) {
        setBlocks(result.data);
        setUnits([]); // Reset units when project changes
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const fetchUnits = async (blockId: string) => {
    try {
      const response = await fetch(`/api/units?blockId=${blockId}`);
      const result = await response.json();
      if (result.success) {
        setUnits(result.data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast.error(t('addProblemDialog.descriptionRequired'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          status: formData.status,
          projectId: formData.projectId !== 'none' ? formData.projectId : null,
          blockId: formData.blockId !== 'none' ? formData.blockId : null,
          unitId: formData.unitId !== 'none' ? formData.unitId : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t('addProblemDialog.success'));
        setFormData({
          projectId: 'none',
          blockId: 'none',
          unitId: 'none',
          description: '',
          status: 'PENDING',
        });
        setBlocks([]);
        setUnits([]);
        setOpen(false);
        onProblemAdded?.();
      } else {
        toast.error(result.error || t('addProblemDialog.error'));
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      toast.error(t('addProblemDialog.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (newOpen) {
        fetchProjects();
      }
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('problems.addProblem')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('addProblemDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('addProblemDialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">{t('addProblemDialog.project')}</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => {
                  setFormData({ ...formData, projectId: value, blockId: 'none', unitId: 'none' });
                  if (value !== 'none') fetchBlocks(value);
                }}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder={t('addProblemDialog.selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('addProblemDialog.noProject')}</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Block Selection */}
            {formData.projectId !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="block">{t('addProblemDialog.block')}</Label>
                <Select
                  value={formData.blockId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, blockId: value, unitId: 'none' });
                    if (value !== 'none') fetchUnits(value);
                  }}
                >
                  <SelectTrigger id="block">
                    <SelectValue placeholder={t('addProblemDialog.selectBlock')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('addProblemDialog.noBlock')}</SelectItem>
                    {blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Unit Selection */}
            {formData.blockId !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="unit">{t('addProblemDialog.unit')}</Label>
                <Select
                  value={formData.unitId}
                  onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder={t('addProblemDialog.selectUnit')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('addProblemDialog.noUnit')}</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">{t('addProblemDialog.status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">{t('problems.pending')}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{t('problems.inProgress')}</SelectItem>
                  <SelectItem value="RESOLVED">{t('problems.resolved')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('addProblemDialog.descriptionLabel')}</Label>
              <Textarea
                id="description"
                placeholder={t('addProblemDialog.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
              {!formData.description.trim() && (
                <p className="text-xs text-destructive">{t('addProblemDialog.enterDescription')}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !formData.description.trim()}>
              {loading ? t('addProblemDialog.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
