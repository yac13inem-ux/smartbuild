'use client';

import { useState, useEffect } from 'react';
import { Plus, DoorOpen, Edit2 } from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface AddUnitDialogProps {
  blockId?: string;
  onUnitAdded?: (unit: any) => void;
  blocks?: any[];
  unitToEdit?: any;
}

export function AddUnitDialog({
  blockId,
  onUnitAdded,
  blocks = [],
  unitToEdit,
}: AddUnitDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(blockId || '');
  const [formData, setFormData] = useState({
    name: '',
    unitNumber: '',
    floorNumber: '',
    unitType: '',
    area: '',
    grosOeuvreProgress: [0],
    cesPlumbing: [0],
    cesElectrical: [0],
    cesPainting: [0],
    cesFlooring: [0],
    cesCarpentry: [0],
    cesCeramic: [0],
    cetHvac: [0],
    cetFireFighting: [0],
    cetElevators: [0],
    cetPlumbing: [0],
    cetElectrical: [0],
  });

  useEffect(() => {
    if (blockId && !selectedBlockId) {
      setSelectedBlockId(blockId);
    }
  }, [blockId, selectedBlockId]);

  useEffect(() => {
    if (unitToEdit) {
      setFormData({
        name: unitToEdit.name || '',
        unitNumber: unitToEdit.unitNumber || '',
        floorNumber: unitToEdit.floorNumber?.toString() || '',
        unitType: unitToEdit.unitType || '',
        area: unitToEdit.area?.toString() || '',
        grosOeuvreProgress: [unitToEdit.grosOeuvreProgress || 0],
        cesPlumbing: [unitToEdit.cesPlumbing || 0],
        cesElectrical: [unitToEdit.cesElectrical || 0],
        cesPainting: [unitToEdit.cesPainting || 0],
        cesFlooring: [unitToEdit.cesFlooring || 0],
        cesCarpentry: [unitToEdit.cesCarpentry || 0],
        cesCeramic: [unitToEdit.cesCeramic || 0],
        cetHvac: [unitToEdit.cetHvac || 0],
        cetFireFighting: [unitToEdit.cetFireFighting || 0],
        cetElevators: [unitToEdit.cetElevators || 0],
        cetPlumbing: [unitToEdit.cetPlumbing || 0],
        cetElectrical: [unitToEdit.cetElectrical || 0],
      });
      setSelectedBlockId(unitToEdit.blockId || blockId || '');
      setOpen(true);
    }
  }, [unitToEdit, blockId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEdit = unitToEdit?.id;
      const url = isEdit ? `/api/units/${unitToEdit.id}` : '/api/units';
      const method = isEdit ? 'PUT' : 'POST';

      if (!selectedBlockId && !isEdit) {
        toast.error('يرجى اختيار المبنى');
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          blockId: isEdit ? unitToEdit.blockId : selectedBlockId,
          floorNumber: parseInt(formData.floorNumber) || null,
          area: parseFloat(formData.area) || null,
          grosOeuvreProgress: formData.grosOeuvreProgress[0],
          cesPlumbing: formData.cesPlumbing[0],
          cesElectrical: formData.cesElectrical[0],
          cesPainting: formData.cesPainting[0],
          cesFlooring: formData.cesFlooring[0],
          cesCarpentry: formData.cesCarpentry[0],
          cesCeramic: formData.cesCeramic[0],
          cetHvac: formData.cetHvac[0],
          cetFireFighting: formData.cetFireFighting[0],
          cetElevators: formData.cetElevators[0],
          cetPlumbing: formData.cetPlumbing[0],
          cetElectrical: formData.cetElectrical[0],
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isEdit ? 'تم تعديل الوحدة بنجاح' : 'تم إضافة الوحدة بنجاح');
        resetForm();
        setOpen(false);
        onUnitAdded?.(result.data);
      } else {
        toast.error(result.error || 'فشل العملية');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      unitNumber: '',
      floorNumber: '',
      unitType: '',
      area: '',
      grosOeuvreProgress: [0],
      cesPlumbing: [0],
      cesElectrical: [0],
      cesPainting: [0],
      cesFlooring: [0],
      cesCarpentry: [0],
      cesCeramic: [0],
      cetHvac: [0],
      cetFireFighting: [0],
      cetElevators: [0],
      cetPlumbing: [0],
      cetElectrical: [0],
    });
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const SliderWithLabel = ({ label, valueKey, value }: { label: string; valueKey: string; value: number[] }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <span className="text-sm font-medium text-primary">{value[0]}%</span>
      </div>
      <Slider
        value={value}
        onValueChange={(val) => setFormData({ ...formData, [valueKey]: val })}
        max={100}
        step={5}
        className="cursor-pointer"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {!unitToEdit && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة وحدة جديدة
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {unitToEdit ? <Edit2 className="h-5 w-5" /> : <DoorOpen className="h-5 w-5" />}
              {unitToEdit ? 'تعديل الوحدة' : 'إضافة وحدة جديدة'}
            </DialogTitle>
            <DialogDescription>
              {unitToEdit ? 'عدّل معلومات الوحدة' : 'أدخل معلومات الوحدة الجديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">المعلومات الأساسية</h4>

              {!blockId && !unitToEdit && (
                <div className="space-y-2">
                  <Label htmlFor="block">اختر المبنى *</Label>
                  <select
                    id="block"
                    value={selectedBlockId}
                    onChange={(e) => setSelectedBlockId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">اختر المبنى</option>
                    {blocks.map((block) => (
                      <option key={block.id} value={block.id}>
                        {block.name} {block.blockNumber && `(Bloc ${block.blockNumber})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الوحدة *</Label>
                  <Input
                    id="name"
                    placeholder="مثال: شقة 101"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">رقم الشقة</Label>
                  <Input
                    id="unitNumber"
                    placeholder="101"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floorNumber">الطابق</Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitType">نوع الوحدة</Label>
                  <Input
                    id="unitType"
                    placeholder="F1, F2, F3..."
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">المساحة (م²)</Label>
                  <Input
                    id="area"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="95"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Gros Œuvre Progress */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">Gros Œuvre (الأشغال الكبرى) - 50%</h4>
              <SliderWithLabel
                label="تقدم Gros Œuvre"
                valueKey="grosOeuvreProgress"
                value={formData.grosOeuvreProgress}
              />
            </div>

            {/* CES Progress */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">CES (الأشغال التشطيبية) - 30%</h4>
              <div className="grid grid-cols-2 gap-4">
                <SliderWithLabel label="التوصيلات الصحية" valueKey="cesPlumbing" value={formData.cesPlumbing} />
                <SliderWithLabel label="الكهرباء" valueKey="cesElectrical" value={formData.cesElectrical} />
                <SliderWithLabel label="الطلاء" valueKey="cesPainting" value={formData.cesPainting} />
                <SliderWithLabel label="الأرضيات" valueKey="cesFlooring" value={formData.cesFlooring} />
                <SliderWithLabel label="النجارة" valueKey="cesCarpentry" value={formData.cesCarpentry} />
                <SliderWithLabel label="السيراميك" valueKey="cesCeramic" value={formData.cesCeramic} />
              </div>
            </div>

            {/* CET Progress */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">CET (الأشغال التقنية) - 20%</h4>
              <div className="grid grid-cols-2 gap-4">
                <SliderWithLabel label="التكييف والتبريد" valueKey="cetHvac" value={formData.cetHvac} />
                <SliderWithLabel label="مكافحة الحريق" valueKey="cetFireFighting" value={formData.cetFireFighting} />
                <SliderWithLabel label="المصاعد" valueKey="cetElevators" value={formData.cetElevators} />
                <SliderWithLabel label="الصرف الصحي العام" valueKey="cetPlumbing" value={formData.cetPlumbing} />
                <SliderWithLabel label="الكهرباء العامة" valueKey="cetElectrical" value={formData.cetElectrical} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ الوحدة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
