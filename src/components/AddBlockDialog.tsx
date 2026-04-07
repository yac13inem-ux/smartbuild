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
            grosOeuvreProgress: 0,
            concretePourDate: null,
            reinforcementInspectionDate: null,
            grosOeuvreNotes: '',
            cesProgress: 0,
            cetProgress: 0,
            cesCetNotes: '',
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
      toast.error(t('addBlockDialog.validation.blockNameRequired'));
      return;
    }

    if (!blockData.numberOfFloors || parseInt(blockData.numberOfFloors) <= 0) {
      toast.error(t('addBlockDialog.validation.numberOfFloorsRequired'));
      return;
    }

    setLoading(true);

    try {
      // Calculate block progress from floor data
      let totalGrosOeuvre = 0;
      let totalCes = 0;
      let totalCet = 0;

      floorsData.forEach((floor) => {
        totalGrosOeuvre += floor.grosOeuvreProgress || 0;
        totalCes += floor.cesProgress || 0;
        totalCet += floor.cetProgress || 0;
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
        toast.success(t('addBlockDialog.success.blockCreated'));
        setBlockData({
          name: '',
          description: '',
          numberOfFloors: '',
        });
        setFloorsData([]);
        setOpen(false);
        onBlockAdded?.();
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error creating block:', error);
      toast.error('An error occurred while saving');
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('addBlockDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('addBlockDialog.configureFloors')}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)] px-1">
            <div className="space-y-4 py-4">
              {/* Block Basic Information */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="blockName">
                    {t('addBlockDialog.blockName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="blockName"
                    placeholder={t('addBlockDialog.blockNamePlaceholder')}
                    value={blockData.name}
                    onChange={(e) => setBlockData({ ...blockData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfFloors">
                    {t('addBlockDialog.numberOfFloors')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numberOfFloors"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={blockData.numberOfFloors}
                    onChange={(e) =>
                      setBlockData({ ...blockData, numberOfFloors: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockDescription">{t('addBlockDialog.description')}</Label>
                  <Textarea
                    id="blockDescription"
                    placeholder={t('addBlockDialog.descriptionPlaceholder')}
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
                  <Label className="text-sm font-semibold">{t('addBlockDialog.floorsConfiguration')}</Label>

                  <Tabs defaultValue="grosOeuvre" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="grosOeuvre">
                        {t('addBlockDialog.grosOeuvre')}
                      </TabsTrigger>
                      <TabsTrigger value="cesCet">
                        {t('addBlockDialog.ces')} & {t('addBlockDialog.cet')}
                      </TabsTrigger>
                    </TabsList>

                    {/* Gros Œuvre Tab */}
                    <TabsContent value="grosOeuvre" className="space-y-3 mt-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {t('project.floorDetailsGrosOeuvre')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {floorsData.map((floor, floorIndex) => (
                            <Card key={floor.floorNumber} className="border-l-4 border-l-primary">
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-medium text-sm">
                                  {t('addBlockDialog.floorNumber')} {floor.floorNumber}
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
                                      {t('addBlockDialog.apartmentsPerFloor')}
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
                                    placeholder={t('project.grosOeuvreNotes')}
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
                            {t('project.floorDetailsCesCet')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {floorsData.map((floor, floorIndex) => (
                            <Card key={floor.floorNumber} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-medium text-sm">
                                  {t('addBlockDialog.floorNumber')} {floor.floorNumber}
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
                                    placeholder={t('project.cesCetNotes')}
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
              {loading ? t('common.loading') : t('addBlockDialog.createBlock')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
