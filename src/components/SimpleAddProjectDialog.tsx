'use client';

import { useState, useMemo } from 'react';
import { Plus, Building2, Check } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
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

interface BlockType {
  type: string;
  label: string;
  floors: number;
  count: number;
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
  });

  const [blockTypes, setBlockTypes] = useState<BlockType[]>([
    { type: 'R+3', label: t('project.blockTypeR+3'), floors: 4, count: 0 },
    { type: 'R+4', label: t('project.blockTypeR+4'), floors: 5, count: 0 },
    { type: 'R+5', label: t('project.blockTypeR5'), floors: 6, count: 0 },
    { type: 'R+6', label: t('project.blockTypeR+6'), floors: 7, count: 0 },
    { type: 'R+7', label: t('project.blockTypeR+7'), floors: 8, count: 0 },
    { type: 'R+8', label: t('project.blockTypeR+8'), floors: 9, count: 0 },
    { type: 'R+9', label: t('project.blockTypeR9'), floors: 10, count: 0 },
    { type: 'R+10', label: t('project.blockTypeR+10'), floors: 11, count: 0 },
  ]);

  const [showSummary, setShowSummary] = useState(false);

  // Calculate total blocks
  const totalBlocks = useMemo(() => {
    return blockTypes.reduce((sum, bt) => sum + bt.count, 0);
  }, [blockTypes]);

  // Generate blocks automatically based on types
  const generatedBlocks = useMemo(() => {
    const blocks: BlockData[] = [];
    let blockCounter = 1;

    blockTypes.forEach((blockType) => {
      for (let i = 0; i < blockType.count; i++) {
        const floorsData: FloorData[] = [];
        for (let f = 0; f < blockType.floors; f++) {
          floorsData.push({
            floorNumber: f + 1,
            apartments: 0,
            grosOeuvre: 0,
            ces: 0,
            cet: 0,
            concretePourDate: null,
            reinforcementInspectionDate: null,
          });
        }

        blocks.push({
          id: `block-${blockType.type}-${i}-${Date.now()}`,
          name: `${t('project.blocks')} ${blockType.type} #${blockCounter}`,
          description: `${t('project.blocks')} ${blockType.type}`,
          numberOfFloors: blockType.floors.toString(),
          floorsData,
        });
        blockCounter++;
      }
    });

    return blocks;
  }, [blockTypes, t]);

  const handleBlockTypeChange = (index: number, count: number) => {
    setBlockTypes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], count: Math.max(0, count) };
      return updated;
    });
    setShowSummary(false);
  };

  const handleGenerateBlocks = () => {
    if (totalBlocks === 0) {
      toast.error('يرجى تحديد عدد العمارات على الأقل');
      return;
    }
    setShowSummary(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectData.name.trim()) {
      toast.error(t('project.projectName') + ' ' + t('common.required') || 'مطلوب');
      return;
    }

    if (totalBlocks === 0) {
      toast.error('يرجى تحديد عدد العمارات');
      return;
    }

    // Prepare blocks data
    const blocksPayload = generatedBlocks.map((block) => ({
      name: block.name,
      description: block.description,
      numberOfFloors: parseInt(block.numberOfFloors),
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
        toast.success('تم إضافة المشروع بنجاح مع ' + totalBlocks + ' عمارة');
        setProjectData({
          name: '',
          description: '',
          location: '',
          totalApartments: '',
        });
        setBlockTypes((prev) => prev.map((bt) => ({ ...bt, count: 0 })));
        setShowSummary(false);
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('project.addProject')}
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات المشروع وسيتم إنشاء العمارات تلقائياً
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

              {/* Block Types Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('project.blockTypes')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {blockTypes.map((blockType, index) => (
                    <div key={blockType.type} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor={`blocktype-${index}`} className="text-sm font-medium">
                          {blockType.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {blockType.floors} {t('project.numberOfFloors')}
                        </p>
                      </div>
                      <Input
                        id={`blocktype-${index}`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={blockType.count || ''}
                        onChange={(e) => handleBlockTypeChange(index, parseInt(e.target.value) || 0)}
                        className="w-24 h-10"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">{t('project.totalBlocks')}: {totalBlocks}</p>
                    <p className="text-sm text-muted-foreground">
                      {blockTypes.filter((bt) => bt.count > 0).length} نوع من العمارات
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateBlocks}
                    disabled={totalBlocks === 0}
                    className="gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    {t('project.createBlocks')}
                  </Button>
                </div>

                {/* Blocks Summary */}
                {showSummary && generatedBlocks.length > 0 && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-primary">{t('project.blocksSummary')}</h4>
                      </div>

                      <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-2">
                          {generatedBlocks.map((block) => (
                            <div
                              key={block.id}
                              className="flex items-center justify-between p-2 bg-background rounded border"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">{block.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {block.numberOfFloors} {t('project.numberOfFloors')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
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
            <Button type="submit" disabled={loading || !projectData.name.trim() || totalBlocks === 0}>
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
