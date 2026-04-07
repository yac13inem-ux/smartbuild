'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Calendar, Edit, Save, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Helper function to format date consistently
function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
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
    });
  };

  const handleSave = async (floorNumber: number) => {
    try {
      const response = await fetch('/api/gros-oeuvre-floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockId,
          floorNumber,
          ...editData,
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
