'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Layers, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

interface BlockData {
  id: string;
  blockNumber: string;
  name: string;
  totalFloors: number;
  units: {
    f1: number; // 1 room
    f2: number; // 2 rooms
    f3: number; // 3 rooms
    f4: number; // 4 rooms
    f5: number; // 5 rooms
    commercial: number; // Commercial
  };
  floors: Array<{
    floorNumber: number;
    ironReviewDate?: string;
    concretePourDate?: string;
  }>;
}

interface AddProjectDialogProps {
  onProjectAdded?: (project: any) => void;
  projectToEdit?: any;
}

export function AddProjectDialog({ onProjectAdded, projectToEdit }: AddProjectDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    blocksCount: 1,
    floorsPerBlock: 5,
  });

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        description: projectToEdit.description || '',
        location: projectToEdit.location || '',
        blocksCount: projectToEdit.blocks?.length || 1,
        floorsPerBlock: projectToEdit.blocks?.[0]?.totalFloors || 5,
      });
      setOpen(true);
    } else {
      // Reset to initial state
      setFormData({
        name: '',
        description: '',
        location: '',
        blocksCount: 1,
        floorsPerBlock: 5,
      });
      setBlocks([]);
      setAdvancedMode(false);
    }
  }, [projectToEdit, open]);

  // Initialize blocks when blocksCount or floorsPerBlock changes
  useEffect(() => {
    if (!projectToEdit && open && !advancedMode) {
      const newBlocks: BlockData[] = [];
      for (let i = 1; i <= formData.blocksCount; i++) {
        newBlocks.push({
          id: `block-${i}`,
          blockNumber: String.fromCharCode(64 + i), // A, B, C, ...
          name: `المبنى ${i}`,
          totalFloors: formData.floorsPerBlock,
          units: {
            f1: 2,
            f2: 2,
            f3: 2,
            f4: 1,
            f5: 0,
            commercial: 0,
          },
          floors: Array.from({ length: formData.floorsPerBlock }, (_, idx) => ({
            floorNumber: idx + 1,
          })),
        });
      }
      setBlocks(newBlocks);
    }
  }, [formData.blocksCount, formData.floorsPerBlock, open, advancedMode, projectToEdit]);

  const addBlock = () => {
    const blockNumber = blocks.length + 1;
    setBlocks([
      ...blocks,
      {
        id: `block-${Date.now()}`,
        blockNumber: String.fromCharCode(64 + blockNumber),
        name: `المبنى ${blockNumber}`,
        totalFloors: 5,
        units: {
          f1: 2,
          f2: 2,
          f3: 2,
          f4: 1,
          f5: 0,
          commercial: 0,
        },
        floors: Array.from({ length: 5 }, (_, idx) => ({
          floorNumber: idx + 1,
        })),
      },
    ]);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, field: keyof BlockData, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    setBlocks(newBlocks);
  };

  const updateBlockUnits = (index: number, unitType: keyof BlockData['units'], value: number) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      units: { ...newBlocks[index].units, [unitType]: Math.max(0, value) },
    };
    setBlocks(newBlocks);
  };

  const updateFloorDate = (blockIndex: number, floorNumber: number, field: 'ironReviewDate' | 'concretePourDate', value: string) => {
    const newBlocks = [...blocks];
    const floorIndex = newBlocks[blockIndex].floors.findIndex(f => f.floorNumber === floorNumber);
    if (floorIndex !== -1) {
      newBlocks[blockIndex].floors[floorIndex] = {
        ...newBlocks[blockIndex].floors[floorIndex],
        [field]: value,
      };
      setBlocks(newBlocks);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', formData);

    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      console.error('❌ Missing project name');
      toast.error('يرجى إدخال اسم المشروع');
      return;
    }

    if (formData.blocksCount < 1 || formData.floorsPerBlock < 1) {
      console.error('❌ Invalid blocks or floors count');
      toast.error('يجب أن يكون عدد المباني والطوابق على الأقل 1');
      return;
    }

    console.log('✅ Validation passed, starting submission...');
    setLoading(true);

    try {
      const isEdit = projectToEdit?.id;
      const url = isEdit ? `/api/projects/${projectToEdit.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      console.log(`🚀 Making ${method} request to ${url}`);

      // Create the project
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          location: formData.location,
        }),
      });

      console.log('📥 Response status:', response.status);
      const result = await response.json();
      console.log('📥 Response data:', result);

      if (result.success) {
        const projectId = result.data.id;
        console.log(`✅ Project created with ID: ${projectId}`);

        // If creating a new project, create blocks (both Quick and Advanced Mode)
        if (!isEdit && blocks.length > 0) {
          console.log(`🏗️ Creating ${blocks.length} blocks...`);
          for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            console.log(`🏗️ Creating block ${i + 1}/${blocks.length}: ${block.name}`);

            // Create block
            const blockRes = await fetch('/api/blocks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                projectId,
                blockNumber: block.blockNumber,
                name: block.name,
                totalFloors: block.totalFloors,
                totalUnits: Object.values(block.units).reduce((a, b) => a + b, 0),
              }),
            });

            if (!blockRes.ok) {
              const errorText = await blockRes.text();
              console.error(`❌ Failed to create block ${i + 1}:`, errorText);
              continue; // Continue with next block even if one fails
            }

            const blockResult = await blockRes.json();
            console.log(`✅ Block ${i + 1} created with ID: ${blockResult.data.id}`);

            if (blockResult.success) {
              const blockId = blockResult.data.id;

              // Create floors with Gros Œuvre tracking
              console.log(`🏗️ Creating ${block.floors.length} floors for block ${i + 1}...`);
              for (const floor of block.floors) {
                await fetch('/api/gros-oeuvre-floors', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    blockId,
                    floorNumber: floor.floorNumber,
                    ironReviewDate: floor.ironReviewDate ? new Date(floor.ironReviewDate) : null,
                    concretePourDate: floor.concretePourDate ? new Date(floor.concretePourDate) : null,
                  }),
                });
              }
              console.log(`✅ Floors created for block ${i + 1}`);

              // Create units
              const unitTypes = [
                { type: 'F1', count: block.units.f1 },
                { type: 'F2', count: block.units.f2 },
                { type: 'F3', count: block.units.f3 },
                { type: 'F4', count: block.units.f4 },
                { type: 'F5', count: block.units.f5 },
                { type: 'Commercial', count: block.units.commercial },
              ];

              const totalUnits = unitTypes.reduce((sum, { count }) => sum + count, 0);
              console.log(`🏗️ Creating ${totalUnits} units for block ${i + 1}...`);

              let unitNumber = 1;
              for (const { type, count } of unitTypes) {
                for (let i = 0; i < count; i++) {
                  await fetch('/api/units', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      blockId,
                      unitNumber: `${unitNumber++}`,
                      name: `شقة ${unitNumber - 1} (${type})`,
                      unitType: type,
                    }),
                  });
                }
              }
              console.log(`✅ Units created for block ${i + 1}`);
            }
          }
          console.log('✅ All blocks, floors, and units created successfully');
        }

        toast.success(isEdit ? 'تم تعديل المشروع بنجاح' : 'تم إضافة المشروع بنجاح');
        setFormData({ name: '', description: '', location: '', blocksCount: 1, floorsPerBlock: 5 });
        setBlocks([]);
        setAdvancedMode(false);
        setOpen(false);
        onProjectAdded?.(result.data);
      } else {
        console.error('❌ Project creation failed:', result.error);
        toast.error(result.error || 'فشل العملية');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', location: '', blocksCount: 1, floorsPerBlock: 5 });
    setBlocks([]);
    setAdvancedMode(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!projectToEdit && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة مشروع جديد
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {projectToEdit ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {projectToEdit ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
            </DialogTitle>
            <DialogDescription>
              {projectToEdit ? 'عدّل معلومات المشروع' : 'أدخل معلومات المشروع الجديد هنا'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">اسم المشروع *</Label>
              <Input
                id="name"
                placeholder="مثال: مجمع سكني الجزائر"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {!formData.name && (
                <p className="text-xs text-destructive">يرجى إدخال اسم المشروع</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                placeholder="مثال: الجزائر العاصمة - حيدرة"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                placeholder="وصف المشروع..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {!projectToEdit && (
              <>
                {/* Quick Mode */}
                {!advancedMode && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                    <h4 className="font-medium text-sm">إعداد سريع</h4>
                    <p className="text-xs text-muted-foreground">
                      أدخل تفاصيل المباني لإنشاء هيكل المشروع تلقائياً
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="blocksCount">عدد المباني *</Label>
                        <Input
                          id="blocksCount"
                          type="number"
                          min="1"
                          value={formData.blocksCount}
                          onChange={(e) => setFormData({ ...formData, blocksCount: parseInt(e.target.value) || 1 })}
                          required
                        />
                        {formData.blocksCount < 1 && (
                          <p className="text-xs text-destructive">يجب أن يكون العدد على الأقل 1</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floorsPerBlock">الطوابق لكل مبنى *</Label>
                        <Input
                          id="floorsPerBlock"
                          type="number"
                          min="1"
                          value={formData.floorsPerBlock}
                          onChange={(e) => setFormData({ ...formData, floorsPerBlock: parseInt(e.target.value) || 1 })}
                          required
                        />
                        {formData.floorsPerBlock < 1 && (
                          <p className="text-xs text-destructive">يجب أن يكون العدد على الأقل 1</p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdvancedMode(true)}
                      className="w-full"
                    >
                      <Layers className="h-4 w-4 ml-2" />
                      تفعيل الوضع المتقدم (تفاصيل المباني والشقق)
                    </Button>
                  </div>
                )}

                {/* Advanced Mode */}
                {advancedMode && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">تفاصيل المباني</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAdvancedMode(false)}
                      >
                        العودة للوضع السريع
                      </Button>
                    </div>

                    {blocks.map((block, blockIdx) => (
                      <Card key={block.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={block.blockNumber}
                                onChange={(e) => updateBlock(blockIdx, 'blockNumber', e.target.value)}
                                className="w-16 text-center font-bold"
                                placeholder="A"
                              />
                              <Input
                                value={block.name}
                                onChange={(e) => updateBlock(blockIdx, 'name', e.target.value)}
                                className="flex-1"
                                placeholder="اسم المبنى"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBlock(blockIdx)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">الطوابق</Label>
                              <Input
                                type="number"
                                min="1"
                                value={block.totalFloors}
                                onChange={(e) => {
                                  const newFloors = parseInt(e.target.value) || 1;
                                  updateBlock(blockIdx, 'totalFloors', newFloors);
                                  updateBlock(blockIdx, 'floors', Array.from({ length: newFloors }, (_, idx) => ({
                                    floorNumber: idx + 1,
                                  })));
                                }}
                                className="text-sm"
                              />
                            </div>
                          </div>

                          {/* Units Distribution */}
                          <div className="space-y-2 pt-2 border-t">
                            <Label className="text-xs font-medium">توزيع الشقات</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {Object.entries(block.units).map(([type, count]) => (
                                <div key={type} className="space-y-1">
                                  <Label className="text-xs uppercase">{type}</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={count}
                                    onChange={(e) => updateBlockUnits(blockIdx, type as keyof BlockData['units'], parseInt(e.target.value) || 0)}
                                    className="text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Floors with Dates */}
                          <div className="space-y-2 pt-2 border-t">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">مواعيد Gros Œuvre</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newBlocks = [...blocks];
                                  newBlocks[blockIdx].showFloors = !newBlocks[blockIdx].showFloors;
                                  setBlocks(newBlocks);
                                }}
                                className="h-6 px-2"
                              >
                                {block.showFloors ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              </Button>
                            </div>

                            {block.showFloors && (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {block.floors.map((floor) => (
                                  <div key={floor.floorNumber} className="grid grid-cols-2 gap-2 text-xs p-2 bg-muted/30 rounded">
                                    <span className="font-medium">الطابق {floor.floorNumber}</span>
                                    <div className="col-span-2 grid grid-cols-2 gap-2">
                                      <div className="space-y-1">
                                        <Label className="text-[10px] text-muted-foreground">مراجعة التسليح</Label>
                                        <Input
                                          type="date"
                                          value={floor.ironReviewDate || ''}
                                          onChange={(e) => updateFloorDate(blockIdx, floor.floorNumber, 'ironReviewDate', e.target.value)}
                                          className="text-xs h-8"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[10px] text-muted-foreground">صب الخرسانة</Label>
                                        <Input
                                          type="date"
                                          value={floor.concretePourDate || ''}
                                          onChange={(e) => updateFloorDate(blockIdx, floor.floorNumber, 'concretePourDate', e.target.value)}
                                          className="text-xs h-8"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addBlock}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة مبنى
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || formData.blocksCount < 1 || formData.floorsPerBlock < 1}
              className="min-w-[120px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري الإنشاء...
                </span>
              ) : (
                'حفظ'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
