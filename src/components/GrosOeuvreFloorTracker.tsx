'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Calendar, Edit, Save, Layers, Clock, TrendingUp, Play, PauseCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Helper function to format date consistently
function formatDate(date: string | null): string {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// Calculate days between two dates
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Calculate progress based on iron and concrete status
function calculateProgress(ironApproved: boolean, concretePoured: boolean): number {
  if (concretePoured) return 100;
  if (ironApproved) return 50;
  return 0;
}

interface GrosOeuvreFloor {
  id: string;
  blockId: string;
  floorNumber: number;
  ironReviewDate: string | null;
  concretePourDate: string | null;
  ironApproval: boolean;
  concretePoured: boolean;
  notes: string | null;
  // Timing fields
  startDate: string | null;
  endDate: string | null;
  estimatedDays: number | null;
  actualDays: number | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface GrosOeuvreFloorTrackerProps {
  blockId: string;
  blockNumber?: string;
  totalFloors?: number;
}

export function GrosOeuvreFloorTracker({
  blockId,
  blockNumber,
  totalFloors = 0,
}: GrosOeuvreFloorTrackerProps) {
  const [floors, setFloors] = useState<GrosOeuvreFloor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFloor, setEditingFloor] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<GrosOeuvreFloor>>({});

  useEffect(() => {
    loadFloors();
  }, [blockId]);

  const loadFloors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gros-oeuvre-floors?blockId=${blockId}`);
      const result = await response.json();

      if (result.success) {
        setFloors(result.data);
      }
    } catch (error) {
      toast.error('فشل تحميل بيانات الطوابق');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (floor: GrosOeuvreFloor) => {
    setEditingFloor(floor.floorNumber);
    setEditData({
      ...floor,
      ironReviewDate: floor.ironReviewDate ? floor.ironReviewDate.split('T')[0] : '',
      concretePourDate: floor.concretePourDate ? floor.concretePourDate.split('T')[0] : '',
      startDate: floor.startDate ? floor.startDate.split('T')[0] : '',
      endDate: floor.endDate ? floor.endDate.split('T')[0] : '',
    });
  };

  const handleSave = async (floorNumber: number) => {
    try {
      // Auto-calculate progress if not explicitly set
      const calculatedProgress = editData.progress !== undefined
        ? editData.progress
        : calculateProgress(editData.ironApproval || false, editData.concretePoured || false);

      const response = await fetch('/api/gros-oeuvre-floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockId,
          floorNumber,
          ...editData,
          progress: calculatedProgress,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`تم تحديث الطابق ${floorNumber}`);
        setEditingFloor(null);
        setEditData({});
        loadFloors();
      } else {
        toast.error(result.error || 'فشل التحديث');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const handleCancel = () => {
    setEditingFloor(null);
    setEditData({});
  };

  const generateFloors = () => {
    if (totalFloors === 0) {
      toast.error('يرجى تحديد عدد الطوابق أولاً');
      return;
    }

    const floorNumbers = [];
    for (let i = 1; i <= totalFloors; i++) {
      floorNumbers.push(i);
    }

    setFloorSelectionDialog(true);
    setSelectedFloors(floorNumbers);
  };

  const [floorSelectionDialog, setFloorSelectionDialog] = useState(false);
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);

  const createFloor = async (floorNumber: number) => {
    try {
      const response = await fetch('/api/gros-oeuvre-floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockId,
          floorNumber,
          ironApproval: false,
          concretePoured: false,
          progress: 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        loadFloors();
      }
    } catch (error) {
      console.error('Error creating floor:', error);
    }
  };

  const handleCreateFloors = async () => {
    for (const floorNumber of selectedFloors) {
      await createFloor(floorNumber);
    }
    toast.success(`تم إنشاء ${selectedFloors.length} طابق`);
    setFloorSelectionDialog(false);
    loadFloors();
  };

  // Get status color for progress
  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            تتبع Gros Œuvre - الطوابق
            {blockNumber && <Badge variant="outline">Bloc {blockNumber}</Badge>}
          </CardTitle>
          <Button size="sm" onClick={generateFloors}>
            إنشاء طوابق
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {floors.length === 0 ? (
          <div className="text-center py-8">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-3">
              لم يتم إنشاء أي طابق بعد
            </p>
            <Button size="sm" onClick={generateFloors}>
              إنشاء طوابق
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {floors.map((floor) => (
              <Card key={floor.id} className="border">
                <CardContent className="p-4">
                  {editingFloor === floor.floorNumber ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">الطابق {floor.floorNumber}</h4>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            إلغاء
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(floor.floorNumber)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            حفظ
                          </Button>
                        </div>
                      </div>

                      {/* Timing Section */}
                      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <h5 className="font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          معلومات التوقييت
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>تاريخ البدء</Label>
                            <Input
                              type="date"
                              value={editData.startDate || ''}
                              onChange={(e) =>
                                setEditData({ ...editData, startDate: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>تاريخ الانتهاء</Label>
                            <Input
                              type="date"
                              value={editData.endDate || ''}
                              onChange={(e) =>
                                setEditData({ ...editData, endDate: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>المدة المقدرة (أيام)</Label>
                            <Input
                              type="number"
                              value={editData.estimatedDays || ''}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  estimatedDays: e.target.value ? parseInt(e.target.value) : null,
                                })
                              }
                              min="0"
                            />
                          </div>
                          <div>
                            <Label>نسبة الإنجاز (%)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editData.progress || 0}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                                  })
                                }
                                min="0"
                                max="100"
                              />
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        {(editData.startDate && editData.endDate) && (
                          <div className="text-sm text-muted-foreground">
                            المدة الفعلية: {calculateDays(editData.startDate, editData.endDate)} يوم
                          </div>
                        )}
                      </div>

                      {/* Work Status Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm text-muted-foreground">
                            مراجعة الحديد
                          </h5>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={editData.ironApproval || false}
                              onCheckedChange={(checked) =>
                                setEditData({ ...editData, ironApproval: checked })
                              }
                            />
                            <Label>تمت الموافقة</Label>
                          </div>
                          <div>
                            <Label>تاريخ المراجعة</Label>
                            <Input
                              type="date"
                              value={editData.ironReviewDate || ''}
                              onChange={(e) =>
                                setEditData({ ...editData, ironReviewDate: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-medium text-sm text-muted-foreground">الصب</h5>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={editData.concretePoured || false}
                              onCheckedChange={(checked) =>
                                setEditData({ ...editData, concretePoured: checked })
                              }
                            />
                            <Label>تم الصب</Label>
                          </div>
                          <div>
                            <Label>تاريخ الصب</Label>
                            <Input
                              type="date"
                              value={editData.concretePourDate || ''}
                              onChange={(e) =>
                                setEditData({ ...editData, concretePourDate: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>ملاحظات</Label>
                        <Textarea
                          value={editData.notes || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, notes: e.target.value })
                          }
                          rows={2}
                          placeholder="أضف ملاحظات هنا..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold">الطابق {floor.floorNumber}</span>
                          <div className="flex gap-2">
                            {floor.ironApproval ? (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                الحديد موافق
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <XCircle className="h-3 w-3 mr-1" />
                                الحديد غير موافق
                              </Badge>
                            )}
                            {floor.concretePoured ? (
                              <Badge className="bg-blue-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                تم الصب
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <XCircle className="h-3 w-3 mr-1" />
                                لم يُصب
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(floor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">نسبة الإنجاز</span>
                          <span className="font-semibold">{floor.progress}%</span>
                        </div>
                        <Progress value={floor.progress} className="h-2" />
                      </div>

                      {/* Timing Information */}
                      <div className="grid grid-cols-2 gap-4 text-sm p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Play className="h-4 w-4" />
                          {floor.startDate
                            ? `تاريخ البدء: ${formatDate(floor.startDate)}`
                            : 'لم يتم تحديد تاريخ البدء'}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <PauseCircle className="h-4 w-4" />
                          {floor.endDate
                            ? `تاريخ الانتهاء: ${formatDate(floor.endDate)}`
                            : 'لم يتم تحديد تاريخ الانتهاء'}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {floor.estimatedDays !== null
                            ? `المدة المقدرة: ${floor.estimatedDays} يوم`
                            : 'لم يتم تحديد المدة المقدرة'}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          {floor.actualDays !== null
                            ? `المدة الفعلية: ${floor.actualDays} يوم`
                            : 'لم يتم حساب المدة الفعلية'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {floor.ironReviewDate
                            ? `تاريخ مراجعة الحديد: ${formatDate(new Date(floor.ironReviewDate))}`
                            : 'لم يتم تحديد تاريخ مراجعة الحديد'}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {floor.concretePourDate
                            ? `تاريخ الصب: ${formatDate(new Date(floor.concretePourDate))}`
                            : 'لم يتم تحديد تاريخ الصب'}
                        </div>
                      </div>

                      {floor.notes && (
                        <div className="text-sm bg-muted/50 p-2 rounded">
                          <span className="font-medium">ملاحظات: </span>
                          {floor.notes}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
