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
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface SimpleAddProjectDialogProps {
  onProjectAdded?: () => void;
}

export function SimpleAddProjectDialog({ onProjectAdded }: SimpleAddProjectDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    totalApartments: '',
    numberOfBlocks: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('project.projectName') + ' مطلوب');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        totalApartments: formData.totalApartments ? parseInt(formData.totalApartments) : null,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('تم إضافة المشروع بنجاح');
        setFormData({
          name: '',
          description: '',
          location: '',
          totalApartments: '',
          numberOfBlocks: '',
        });
        setOpen(false);
        onProjectAdded?.();
      } else {
        toast.error(result.error || 'فشل العملية');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('project.addProject')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('project.addProject')}
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات المشروع الجديد
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('project.projectName')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="مثال: مجمع سكني الجزائر"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalApartments">{t('project.totalApartments')}</Label>
                <Input
                  id="totalApartments"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.totalApartments}
                  onChange={(e) =>
                    setFormData({ ...formData, totalApartments: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfBlocks">{t('project.numberOfBlocks')}</Label>
                <Input
                  id="numberOfBlocks"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.numberOfBlocks}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfBlocks: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t('project.location')}</Label>
              <Input
                id="location"
                placeholder="مثال: الجزائر العاصمة - حيدرة"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('project.description')}</Label>
              <Textarea
                id="description"
                placeholder="وصف المشروع..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
