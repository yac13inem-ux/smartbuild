'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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

interface EditFloorDialogProps {
  blockId: string;
  blockName: string;
  floorsData: FloorData[];
  numberOfFloors?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updatedFloors: FloorData[]) => void;
}

export function EditFloorDialog({
  blockId,
  blockName,
  floorsData,
  numberOfFloors,
  open,
  onOpenChange,
  onSave,
}: EditFloorDialogProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [editFloors, setEditFloors] = useState<FloorData[]>(floorsData);

  // Create empty floors data if empty when dialog opens
  useEffect(() => {
    if (open && floorsData.length === 0 && numberOfFloors) {
      const newFloors: FloorData[] = [];
      for (let i = 1; i <= numberOfFloors; i++) {
        newFloors.push({
          floorNumber: i,
          apartments: 0,
          grosOeuvreProgress: 0,
          concretePourDate: null,
          reinforcementInspectionDate: null,
          grosOeuvreNotes: '',
          cesProgress: 0,
          cetProgress: 0,
          cesCetNotes: '',
        });
      }
      setEditFloors(newFloors);
    } else if (open) {
      setEditFloors(floorsData);
    }
  }, [open, floorsData, numberOfFloors]);

  const handleFloorChange = (
    floorIndex: number,
    field: keyof FloorData,
    value: number | string | null
  ) => {
    setEditFloors((prev) => {
      const updated = [...prev];
      updated[floorIndex] = { ...updated[floorIndex], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Calculate block progress from floor data
      let totalGrosOeuvre = 0;
      let totalCes = 0;
      let totalCet = 0;

      editFloors.forEach((floor) => {
        totalGrosOeuvre += floor.grosOeuvreProgress || 0;
        totalCes += floor.cesProgress || 0;
        totalCet += floor.cetProgress || 0;
      });

      const numFloors = editFloors.length;
      const grosOeuvreProgress = numFloors > 0 ? Math.round(totalGrosOeuvre / numFloors) : 0;
      const cesProgress = numFloors > 0 ? Math.round(totalCes / numFloors) : 0;
      const cetProgress = numFloors > 0 ? Math.round(totalCet / numFloors) : 0;
      const globalProgress = Math.round((grosOeuvreProgress + cesProgress + cetProgress) / 3);

      const payload = {
        floorsData: editFloors,
        grosOeuvreProgress,
        cesProgress,
        cetProgress,
        globalProgress,
      };

      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('تم حفظ التغييرات بنجاح');
        onSave?.(editFloors);
        onOpenChange(false);
      } else {
        toast.error(result.error || 'فشل حفظ التغييرات');
      }
    } catch (error) {
      console.error('Error updating floors:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الطوابق - {blockName}</DialogTitle>
          <DialogDescription>
            قم بتعديل تفاصيل الطوابق وحقوق التتبع
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)] px-1">
          {editFloors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  لم يتم تحديد عدد الطوابق لهذه العمارة.
                  <br />
                  الرجاء إنشاء عمارة جديدة مع عدد الطوابق المحدد.
                </p>
              </CardContent>
            </Card>
          ) : (
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {t('project.grosOeuvreSection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editFloors.map((floor, floorIndex) => (
                    <Card key={floor.floorNumber} className="border-l-4 border-l-primary">
                      <CardContent className="p-4 space-y-3">
                        <h4 className="font-medium text-sm">
                          {t('project.floorNumber')} {floor.floorNumber}
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`go-${floorIndex}-progress`} className="text-xs">
                              {t('project.grosOeuvreProgress')} (%)
                            </Label>
                            <Input
                              id={`go-${floorIndex}-progress`}
                              type="number"
                              min="0"
                              max="100"
                              value={floor.grosOeuvreProgress}
                              onChange={(e) =>
                                handleFloorChange(
                                  floorIndex,
                                  'grosOeuvreProgress',
                                  Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                )
                              }
                              className="h-8"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor={`go-${floorIndex}-apartments`} className="text-xs">
                              {t('project.apartmentsCount')}
                            </Label>
                            <Input
                              id={`go-${floorIndex}-apartments`}
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
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`go-${floorIndex}-concrete`} className="text-xs">
                              {t('project.concretePourDate')}
                            </Label>
                            <Input
                              id={`go-${floorIndex}-concrete`}
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
                            <Label htmlFor={`go-${floorIndex}-reinforcement`} className="text-xs">
                              {t('project.reinforcementInspection')}
                            </Label>
                            <Input
                              id={`go-${floorIndex}-reinforcement`}
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

                        <div className="space-y-1">
                          <Label htmlFor={`go-${floorIndex}-notes`} className="text-xs">
                            {t('project.grosOeuvreNotes')}
                          </Label>
                          <Textarea
                            id={`go-${floorIndex}-notes`}
                            placeholder="أضف ملاحظات عن الأشغال الكبرى..."
                            value={floor.grosOeuvreNotes}
                            onChange={(e) =>
                              handleFloorChange(floorIndex, 'grosOeuvreNotes', e.target.value)
                            }
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CES & CET Tab */}
            <TabsContent value="cesCet" className="space-y-3 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {t('project.cesCetSection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editFloors.map((floor, floorIndex) => (
                    <Card key={floor.floorNumber} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 space-y-3">
                        <h4 className="font-medium text-sm">
                          {t('project.floorNumber')} {floor.floorNumber}
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`ces-${floorIndex}-ces`} className="text-xs">
                              {t('project.cesProgress')} (%)
                            </Label>
                            <Input
                              id={`ces-${floorIndex}-ces`}
                              type="number"
                              min="0"
                              max="100"
                              value={floor.cesProgress}
                              onChange={(e) =>
                                handleFloorChange(
                                  floorIndex,
                                  'cesProgress',
                                  Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                )
                              }
                              className="h-8"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor={`ces-${floorIndex}-cet`} className="text-xs">
                              {t('project.cetProgress')} (%)
                            </Label>
                            <Input
                              id={`ces-${floorIndex}-cet`}
                              type="number"
                              min="0"
                              max="100"
                              value={floor.cetProgress}
                              onChange={(e) =>
                                handleFloorChange(
                                  floorIndex,
                                  'cetProgress',
                                  Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                )
                              }
                              className="h-8"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`ces-${floorIndex}-notes`} className="text-xs">
                            {t('project.cesCetNotes')}
                          </Label>
                          <Textarea
                            id={`ces-${floorIndex}-notes`}
                            placeholder="أضف ملاحظات عن الأشغال التشطيبية والتقنية..."
                            value={floor.cesCetNotes}
                            onChange={(e) =>
                              handleFloorChange(floorIndex, 'cesCetNotes', e.target.value)
                            }
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          )}
        </ScrollArea>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
