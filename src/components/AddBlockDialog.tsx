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
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloorData {
  floorNumber: number;
  apartments: number;
  grosOeuvre: number;
  ces: number;
  cet: number;
  concretePourDate: string | null;
  reinforcementInspectionDate: string | null;
}

interface AddBlockDialogProps {
  projectId: string;
  onBlockAdded?: () => void;
}

export function AddBlockDialog({ projectId, onBlockAdded }: AddBlockDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [blockData, setBlockData] = useState({
    name: '',
    description: '',
    numberOfFloors: '',
  });

  const [floorsData, setFloorsData] = useState<FloorData[]>([]);

  // Update floors when numberOfFloors changes
  useEffect(() => {
    const numFloors = parseInt(blockData.numberOfFloors) || 0;
    setFloorsData((prev) => {
      const newFloors: FloorData[] = [];
      for (let i = 0; i < numFloors; i++) {
        newFloors.push(
          prev[i] || {
            floorNumber: i + 1,
            apartments: 0,
            grosOeuvre: 0,
            ces: 0,
            cet: 0,
            concretePourDate: null,
            reinforcementInspectionDate: null,
          }
        );
      }
      return newFloors;
    });
  }, [blockData.numberOfFloors]);

  const handleFloorChange = (
    floorIndex: number,
    field: keyof FloorData,
    value: number | string | null
  ) => {
    setFloorsData((prev) => {
      const updated = [...prev];
      updated[floorIndex] = { ...updated[floorIndex], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blockData.name.trim()) {
      toast.error('اسم العمارة مطلوب');
      return;
    }

    if (!blockData.numberOfFloors || parseInt(blockData.numberOfFloors) <= 0) {
      toast.error('عدد الطوابق مطلوب');
      return;
    }

    setLoading(true);

    try {
      // Calculate block progress from floor data
      let totalGrosOeuvre = 0;
      let totalCes = 0;
      let totalCet = 0;

      floorsData.forEach((floor) => {
        totalGrosOeuvre += floor.grosOeuvre || 0;
        totalCes += floor.ces || 0;
        totalCet += floor.cet || 0;
      });

      const numFloors = floorsData.length;
      const grosOeuvreProgress = numFloors > 0 ? Math.round(totalGrosOeuvre / numFloors) : 0;
      const cesProgress = numFloors > 0 ? Math.round(totalCes / numFloors) : 0;
      const cetProgress = numFloors > 0 ? Math.round(totalCet / numFloors) : 0;
      const globalProgress = Math.round((grosOeuvreProgress + cesProgress + cetProgress) / 3);

      const payload = {
        projectId,
        name: blockData.name,
        description: blockData.description,
        numberOfFloors: parseInt(blockData.numberOfFloors),
        floorsData,
        grosOeuvreProgress,
        cesProgress,
        cetProgress,
        globalProgress,
      };

      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('تم إضافة العمارة بنجاح');
        setBlockData({
          name: '',
          description: '',
          numberOfFloors: '',
        });
        setFloorsData([]);
        setOpen(false);
        onBlockAdded?.();
      } else {
        toast.error(result.error || 'فشل العملية');
      }
    } catch (error) {
      console.error('Error creating block:', error);
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
          {t('block.addBlock')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('block.addBlock')}
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات العمارة الجديدة وتفاصيل طوابقها
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)] px-1">
            <div className="space-y-4 py-4">
              {/* Block Basic Information */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="blockName">
                    {t('project.blockName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="blockName"
                    placeholder="مثال: عمارة A"
                    value={blockData.name}
                    onChange={(e) => setBlockData({ ...blockData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfFloors">
                    {t('project.numberOfFloors')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numberOfFloors"
                    type="number"
                    min="1"
                    placeholder="مثال: 10"
                    value={blockData.numberOfFloors}
                    onChange={(e) =>
                      setBlockData({ ...blockData, numberOfFloors: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockDescription">{t('project.description')}</Label>
                  <Textarea
                    id="blockDescription"
                    placeholder="وصف العمارة..."
                    value={blockData.description}
                    onChange={(e) =>
                      setBlockData({ ...blockData, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>

              {/* Floors Section */}
              {blockData.numberOfFloors && parseInt(blockData.numberOfFloors) > 0 && (
                <div className="space-y-3 pt-3 border-t">
                  <Label className="text-sm font-semibold">{t('project.trackPerFloor')}</Label>

                  {floorsData.map((floor, floorIndex) => (
                    <div
                      key={floor.floorNumber}
                      className="p-4 border rounded-lg bg-muted/20 space-y-3"
                    >
                      {/* Floor Header */}
                      <h4 className="font-medium text-sm flex items-center justify-between">
                        <span>{t('project.floorNumber')} {floor.floorNumber}</span>
                        <span className="text-xs text-muted-foreground">
                          {t('project.apartmentsCount')}: {floor.apartments}
                        </span>
                      </h4>

                      {/* Floor Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`floor-${floorIndex}-apartments`} className="text-xs">
                            {t('project.apartmentsCount')}
                          </Label>
                          <Input
                            id={`floor-${floorIndex}-apartments`}
                            type="number"
                            min="0"
                            value={floor.apartments}
                            onChange={(e) =>
                              handleFloorChange(
                                floorIndex,
                                'apartments',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`floor-${floorIndex}-grosOeuvre`} className="text-xs">
                            {t('project.grosOeuvreProgress')} (%)
                          </Label>
                          <Input
                            id={`floor-${floorIndex}-grosOeuvre`}
                            type="number"
                            min="0"
                            max="100"
                            value={floor.grosOeuvre}
                            onChange={(e) =>
                              handleFloorChange(
                                floorIndex,
                                'grosOeuvre',
                                Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                              )
                            }
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`floor-${floorIndex}-ces`} className="text-xs">
                            {t('project.cesProgress')} (%)
                          </Label>
                          <Input
                            id={`floor-${floorIndex}-ces`}
                            type="number"
                            min="0"
                            max="100"
                            value={floor.ces}
                            onChange={(e) =>
                              handleFloorChange(
                                floorIndex,
                                'ces',
                                Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                              )
                            }
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`floor-${floorIndex}-cet`} className="text-xs">
                            {t('project.cetProgress')} (%)
                          </Label>
                          <Input
                            id={`floor-${floorIndex}-cet`}
                            type="number"
                            min="0"
                            max="100"
                            value={floor.cet}
                            onChange={(e) =>
                              handleFloorChange(
                                floorIndex,
                                'cet',
                                Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      </div>

                      {/* Date Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`floor-${floorIndex}-concrete`} className="text-xs">
                            {t('project.concretePourDate')}
                          </Label>
                          <Input
                            id={`floor-${floorIndex}-concrete`}
                            type="date"
                            value={floor.concretePourDate || ''}
                            onChange={(e) =>
                              handleFloorChange(
                                floorIndex,
                                'concretePourDate',
                                e.target.value || null
                              )
                            }
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`floor-${floorIndex}-reinforcement`} className="text-xs">
                            {t('project.reinforcementInspectionDate')}
                          </Label>
                          <Input
                            id={`floor-${floorIndex}-reinforcement`}
                            type="date"
                            value={floor.reinforcementInspectionDate || ''}
                            onChange={(e) =>
                              handleFloorChange(
                                floorIndex,
                                'reinforcementInspectionDate',
                                e.target.value || null
                              )
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
            <Button
              type="submit"
              disabled={
                loading ||
                !blockData.name.trim() ||
                !blockData.numberOfFloors ||
                parseInt(blockData.numberOfFloors) <= 0
              }
            >
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
