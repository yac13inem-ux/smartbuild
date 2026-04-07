'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Layers, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AddBlockDialog } from './AddBlockDialog';
import { AddUnitDialog } from './AddUnitDialog';
import { toast } from 'sonner';

interface BlockActionsProps {
  block: any;
  onBlockUpdate: () => void;
  onNavigateToUnits: (blockId: string) => void;
  onNavigateToGrosOeuvre: (blockId: string) => void;
}

export function BlockActions({ block, onBlockUpdate, onNavigateToUnits, onNavigateToGrosOeuvre }: BlockActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editBlock, setEditBlock] = useState<any>(null);
  const [addUnitOpen, setAddUnitOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setDeleting(true);
      console.log('🗑️ Starting delete for block:', block.id, block.name);

      const response = await fetch(`/api/blocks/${block.id}`, {
        method: 'DELETE',
      });

      console.log('📥 Delete response status:', response.status);
      const result = await response.json();
      console.log('📥 Delete response:', result);

      if (result.success) {
        toast.success('تم حذف المبنى بنجاح');
        setDeleteDialogOpen(false);
        onBlockUpdate();
      } else {
        console.error('❌ Delete failed:', result);
        toast.error(result.error || 'فشل حذف المبنى');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleting(false);
    }
  };

  const handleMenuClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[100]">
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => onNavigateToUnits(block.id))}
          >
            <DoorOpen className="h-4 w-4 mr-2" />
            عرض الوحدات
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => onNavigateToGrosOeuvre(block.id))}
          >
            <Layers className="h-4 w-4 mr-2" />
            تتبع Gros Œuvre
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => setAddUnitOpen(true))}
            className="text-primary"
          >
            <DoorOpen className="h-4 w-4 mr-2" />
            إضافة وحدة
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => setEditBlock(block))}
          >
            <Pencil className="h-4 w-4 mr-2" />
            تعديل المبنى
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => setDeleteDialogOpen(true))}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.delete')} {t('block.title')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')} {t('common.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('block.deleteBlockConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? t('common.loading') : `${t('common.yes')}, ${t('common.delete')}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editBlock && (
        <AddBlockDialog
          blockToEdit={editBlock}
          onBlockAdded={() => {
            setEditBlock(null);
            onBlockUpdate();
          }}
        />
      )}

      {addUnitOpen && (
        <AddUnitDialog
          blockId={block.id}
          onUnitAdded={() => {
            setAddUnitOpen(false);
            onBlockUpdate();
          }}
        />
      )}
    </>
  );
}
