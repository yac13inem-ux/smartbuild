'use client';

import { useState } from 'react';
import { Plus, Minus, Building2, Trash2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
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

interface BlockData {
  id: string;
  name: string;
  description: string;
  numberOfFloors: string;
  floorsData: FloorData[];
}

interface SimpleAddProjectDialogProps {
  onProjectAdded?: () => void;
}

export function SimpleAddProjectDialog({ onProjectAdded }: SimpleAddProjectDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    location: '',
    totalApartments: '',
    numberOfBlocks: '',
  });

  const [blocks, setBlocks] = useState<BlockData[]>([]);

  // Update blocks when numberOfBlocks changes
  const handleNumberOfBlocksChange = (value: string) => {
    const numBlocks = parseInt(value) || 0;
    setProjectData({ ...projectData, numberOfBlocks: value });

    setBlocks((prev) => {
      const newBlocks: BlockData[] = [];
      for (let i = 0; i < numBlocks; i++) {
        if (prev[i]) {
          newBlocks.push(prev[i]);
        } else {
          newBlocks.push({
            id: `block-${i}-${Date.now()}`,
            name: `${t('project.blocks')} ${i + 1}`,
            description: '',
            numberOfFloors: '',
            floorsData: [],
          });
        }
      }
      return newBlocks;
    });
  };

  // Update block data
  const handleBlockChange = (blockIndex: number, field: keyof BlockData, value: string) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[blockIndex] = { ...updated[blockIndex], [field]: value };
      return updated;
    });
  };

  // Update floors when numberOfFloors changes for a block
  const handleBlockFloorsChange = (blockIndex: number, numberOfFloors: string) => {
    const numFloors = parseInt(numberOfFloors) || 0;

    setBlocks((prev) => {
      const updated = [...prev];
      const block = { ...updated[blockIndex] };
      block.numberOfFloors = numberOfFloors;

      // Update or create floors
      const newFloors: FloorData[] = [];
      for (let i = 0; i < numFloors; i++) {
        newFloors.push(
          block.floorsData[i] || {
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
      block.floorsData = newFloors;
      updated[blockIndex] = block;
      return updated;
    });
  };

  // Update floor data
  const handleFloorChange = (
    blockIndex: number,
    floorIndex: number,
    field: keyof FloorData,
    value: number | string | null
  ) => {
    setBlocks((prev) => {
      const updated = [...prev];
      const block = { ...updated[blockIndex] };
      const floors = [...block.floorsData];
      floors[floorIndex] = { ...floors[floorIndex], [field]: value };
      block.floorsData = floors;
      updated[blockIndex] = block;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectData.name.trim()) {
      toast.error(t('project.projectName') + ' ' + t('common.required') || 'مطلوب');
      return;
    }

    // Prepare blocks data
    const blocksPayload = blocks.map((block) => ({
      name: block.name,
      description: block.description,
      numberOfFloors: block.numberOfFloors ? parseInt(block.numberOfFloors) : null,
      floorsData: block.floorsData,
    }));

    setLoading(true);

    try {
      const payload = {
        name: projectData.name,
        description: projectData.description,
        location: projectData.location,
        totalApartments: projectData.totalApartments ? parseInt(projectData.totalApartments) : null,
        blocks: blocksPayload,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('تم إضافة المشروع بنجاح');
        setProjectData({
          name: '',
          description: '',
          location: '',
          totalApartments: '',
          numberOfBlocks: '',
        });
        setBlocks([]);
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('project.addProject')}
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات المشروع الجديد والعمارات
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)] px-1">
            <div className="space-y-6 py-4">
              {/* Project Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('project.title')}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t('project.projectName')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="مثال: مجمع سكني الجزائر"
                      value={projectData.name}
                      onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalApartments">{t('project.totalApartments')}</Label>
                    <Input
                      id="totalApartments"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={projectData.totalApartments}
                      onChange={(e) =>
                        setProjectData({ ...projectData, totalApartments: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{t('project.location')}</Label>
                  <Input
                    id="location"
                    placeholder="مثال: الجزائر العاصمة - حيدرة"
                    value={projectData.location}
                    onChange={(e) => setProjectData({ ...projectData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('project.description')}</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف المشروع..."
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <Separator />

              {/* Blocks Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">{t('project.blocks')}</h3>
                  <div className="flex-1 max-w-[150px]">
                    <Input
                      type="number"
                      min="0"
                      placeholder={t('project.numberOfBlocks')}
                      value={projectData.numberOfBlocks}
                      onChange={(e) => handleNumberOfBlocksChange(e.target.value)}
                    />
                  </div>
                </div>

                {blocks.map((block, blockIndex) => (
                  <div key={block.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                    {/* Block Header */}
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor={`block-${blockIndex}-name`} className="text-sm font-medium">
                          {t('project.blockName')}
                        </Label>
                        <Input
                          id={`block-${blockIndex}-name`}
                          value={block.name}
                          onChange={(e) =>
                            handleBlockChange(blockIndex, 'name', e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                      <div className="w-32">
                        <Label htmlFor={`block-${blockIndex}-floors`} className="text-sm">
                          {t('project.numberOfFloors')}
                        </Label>
                        <Input
                          id={`block-${blockIndex}-floors`}
                          type="number"
                          min="0"
                          value={block.numberOfFloors}
                          onChange={(e) =>
                            handleBlockFloorsChange(blockIndex, e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                    </div>

                    {/* Floors Section */}
                    {block.numberOfFloors && parseInt(block.numberOfFloors) > 0 && (
                      <div className="space-y-3 pt-3 border-t">
                        <Label className="text-sm font-medium">
                          {t('project.trackPerFloor')} - {block.name}
                        </Label>

                        {block.floorsData.map((floor, floorIndex) => (
                          <div
                            key={floor.floorNumber}
                            className="p-4 border rounded-lg bg-background space-y-3"
                          >
                            {/* Floor Header */}
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {t('project.floorNumber')} {floor.floorNumber}
                              </h4>
                            </div>

                            {/* Floor Inputs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`block-${blockIndex}-floor-${floorIndex}-apartments`}
                                  className="text-xs"
                                >
                                  {t('project.apartmentsCount')}
                                </Label>
                                <Input
                                  id={`block-${blockIndex}-floor-${floorIndex}-apartments`}
                                  type="number"
                                  min="0"
                                  value={floor.apartments}
                                  onChange={(e) =>
                                    handleFloorChange(
                                      blockIndex,
                                      floorIndex,
                                      'apartments',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label
                                  htmlFor={`block-${blockIndex}-floor-${floorIndex}-grosOeuvre`}
                                  className="text-xs"
                                >
                                  {t('project.grosOeuvreProgress')} (%)
                                </Label>
                                <Input
                                  id={`block-${blockIndex}-floor-${floorIndex}-grosOeuvre`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={floor.grosOeuvre}
                                  onChange={(e) =>
                                    handleFloorChange(
                                      blockIndex,
                                      floorIndex,
                                      'grosOeuvre',
                                      Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                    )
                                  }
                                  className="h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label
                                  htmlFor={`block-${blockIndex}-floor-${floorIndex}-ces`}
                                  className="text-xs"
                                >
                                  {t('project.cesProgress')} (%)
                                </Label>
                                <Input
                                  id={`block-${blockIndex}-floor-${floorIndex}-ces`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={floor.ces}
                                  onChange={(e) =>
                                    handleFloorChange(
                                      blockIndex,
                                      floorIndex,
                                      'ces',
                                      Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                    )
                                  }
                                  className="h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label
                                  htmlFor={`block-${blockIndex}-floor-${floorIndex}-cet`}
                                  className="text-xs"
                                >
                                  {t('project.cetProgress')} (%)
                                </Label>
                                <Input
                                  id={`block-${blockIndex}-floor-${floorIndex}-cet`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={floor.cet}
                                  onChange={(e) =>
                                    handleFloorChange(
                                      blockIndex,
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
                                <Label
                                  htmlFor={`block-${blockIndex}-floor-${floorIndex}-concrete`}
                                  className="text-xs"
                                >
                                  {t('project.concretePourDate')}
                                </Label>
                                <Input
                                  id={`block-${blockIndex}-floor-${floorIndex}-concrete`}
                                  type="date"
                                  value={floor.concretePourDate || ''}
                                  onChange={(e) =>
                                    handleFloorChange(
                                      blockIndex,
                                      floorIndex,
                                      'concretePourDate',
                                      e.target.value || null
                                    )
                                  }
                                  className="h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label
                                  htmlFor={`block-${blockIndex}-floor-${floorIndex}-reinforcement`}
                                  className="text-xs"
                                >
                                  {t('project.reinforcementInspectionDate')}
                                </Label>
                                <Input
                                  id={`block-${blockIndex}-floor-${floorIndex}-reinforcement`}
                                  type="date"
                                  value={floor.reinforcementInspectionDate || ''}
                                  onChange={(e) =>
                                    handleFloorChange(
                                      blockIndex,
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
                ))}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !projectData.name.trim()}>
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
