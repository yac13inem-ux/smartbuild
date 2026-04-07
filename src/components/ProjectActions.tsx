'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Home, Building2 } from 'lucide-react';
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
import { AddProjectDialog } from './AddProjectDialog';
import { AddBlockDialog } from './AddBlockDialog';
import { toast } from 'sonner';

interface ProjectActionsProps {
  project: any;
  onProjectUpdate: () => void;
  onNavigateToBlocks: (projectId: string) => void;
}

export function ProjectActions({ project, onProjectUpdate, onNavigateToBlocks }: ProjectActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [addBlockOpen, setAddBlockOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      console.log('🗑️ Starting delete for project:', project.id, project.name);

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('📥 Delete response:', result);

      if (result.success) {
        toast.success('تم حذف المشروع بنجاح');
        setDeleteDialogOpen(false);
        onProjectUpdate();
      } else {
        console.error('❌ Delete failed:', result);
        toast.error(result.error || 'فشل حذف المشروع');
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
            onClick={(e) => handleMenuClick(e, () => onNavigateToBlocks(project.id))}
          >
            <Building2 className="h-4 w-4 mr-2" />
            عرض المباني
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => setEditProject(project))}
          >
            <Pencil className="h-4 w-4 mr-2" />
            تعديل المشروع
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => setAddBlockOpen(true))}
            className="text-primary"
          >
            <Home className="h-4 w-4 mr-2" />
            إضافة مبنى
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleMenuClick(e, () => setDeleteDialogOpen(true))}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            حذف المشروع
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المشروع "{project.name}"؟ سيتم حذف جميع المباني والوحدات والمشاكل والتقارير المرتبطة بهذا المشروع. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'جاري الحذف...' : 'نعم، احذف المشروع'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editProject && (
        <AddProjectDialog
          projectToEdit={editProject}
          onProjectAdded={() => {
            setEditProject(null);
            onProjectUpdate();
          }}
        />
      )}

      {addBlockOpen && (
        <AddBlockDialog
          projectId={project.id}
          onBlockAdded={() => {
            setAddBlockOpen(false);
            onProjectUpdate();
          }}
        />
      )}
    </>
  );
}
