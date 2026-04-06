'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloorData {
  apartments: number;
  cesProgress: number;
  cetProgress: number;
}

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
    grosOeuvre: false,
    numberOfFloors: '',
    concretePourFloor: '',
    reinforcementInspectionDate: '',
  });

  const [apartmentsPerFloor, setApartmentsPerFloor] = useState<FloorData[]>([]);

  // Update apartmentsPerFloor array when numberOfFloors changes
  useEffect(() => {
    const floors = parseInt(formData.numberOfFloors) || 0;
    setApartmentsPerFloor(prev => {
      const newFloors: FloorData[] = [];
      for (let i = 0; i < floors; i++) {
        newFloors.push(prev[i] || { apartments: 0, cesProgress: 0, cetProgress: 0 });
      }
      return newFloors;
    });
  }, [formData.numberOfFloors]);

  const handleFloorChange = (floorIndex: number, field: keyof FloorData, value: number) => {
    setApartmentsPerFloor(prev => {
      const updated = [...prev];
      updated[floorIndex] = { ...updated[floorIndex], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('project.projectName') + ' ' + t('common.required') || 'مطلوب');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        numberOfFloors: formData.numberOfFloors ? parseInt(formData.numberOfFloors) : null,
        concretePourFloor: formData.concretePourFloor ? parseInt(formData.concretePourFloor) : null,
        reinforcementInspectionDate: formData.reinforcementInspectionDate || null,
        apartmentsPerFloor: formData.numberOfFloors ? JSON.stringify(apartmentsPerFloor) : null,
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
          grosOeuvre: false,
          numberOfFloors: '',
          concretePourFloor: '',
          reinforcementInspectionDate: '',
        });
        setApartmentsPerFloor([]);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
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

          <ScrollArea className="h-[calc(90vh-180px)] px-1">
            <div className="space-y-4 py-4">
              {/* Basic Information */}
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
                  rows={2}
                />
              </div>

              {/* Gros Oeuvre */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="grosOeuvre"
                  checked={formData.grosOeuvre}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, grosOeuvre: checked as boolean })
                  }
                />
                <Label htmlFor="grosOeuvre" className="cursor-pointer">
                  {t('project.grosOeuvre')}
                </Label>
              </div>

              {/* Number of Floors */}
              <div className="space-y-2">
                <Label htmlFor="numberOfFloors">{t('project.numberOfFloors')}</Label>
                <Input
                  id="numberOfFloors"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.numberOfFloors}
                  onChange={(e) => setFormData({ ...formData, numberOfFloors: e.target.value })}
                />
              </div>

              {/* Concrete Pour Floor */}
              <div className="space-y-2">
                <Label htmlFor="concretePourFloor">{t('project.concretePourFloor')}</Label>
                <Input
                  id="concretePourFloor"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.concretePourFloor}
                  onChange={(e) => setFormData({ ...formData, concretePourFloor: e.target.value })}
                />
              </div>

              {/* Reinforcement Inspection Date */}
              <div className="space-y-2">
                <Label htmlFor="reinforcementInspectionDate">
                  {t('project.reinforcementInspectionDate')}
                </Label>
                <Input
                  id="reinforcementInspectionDate"
                  type="date"
                  value={formData.reinforcementInspectionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, reinforcementInspectionDate: e.target.value })
                  }
                />
              </div>

              {/* Apartments Per Floor - Dynamic Form */}
              {formData.numberOfFloors && parseInt(formData.numberOfFloors) > 0 && (
                <div className="space-y-3 pt-2 border-t">
                  <Label className="text-base font-semibold">{t('project.trackPerFloor')}</Label>

                  {apartmentsPerFloor.map((floor, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-muted/20 space-y-3"
                    >
                      <h4 className="font-medium text-sm">
                        {t('project.floorNumber')} {index + 1}
                      </h4>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`floor-${index}-apartments`} className="text-xs">
                            {t('project.apartmentsCount')}
                          </Label>
                          <Input
                            id={`floor-${index}-apartments`}
                            type="number"
                            min="0"
                            value={floor.apartments}
                            onChange={(e) =>
                              handleFloorChange(index, 'apartments', parseInt(e.target.value) || 0)
                            }
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`floor-${index}-ces`} className="text-xs">
                            {t('project.cesProgress')} (%)
                          </Label>
                          <Input
                            id={`floor-${index}-ces`}
                            type="number"
                            min="0"
                            max="100"
                            value={floor.cesProgress}
                            onChange={(e) =>
                              handleFloorChange(index, 'cesProgress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                            }
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`floor-${index}-cet`} className="text-xs">
                            {t('project.cetProgress')} (%)
                          </Label>
                          <Input
                            id={`floor-${index}-cet`}
                            type="number"
                            min="0"
                            max="100"
                            value={floor.cetProgress}
                            onChange={(e) =>
                              handleFloorChange(index, 'cetProgress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="pt-4">
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
