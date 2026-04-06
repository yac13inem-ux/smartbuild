'use client';

import { useState, useEffect } from 'react';
import { FileText, Calendar, Download, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface Document {
  id: string;
  title: string;
  type: 'PV_VISITE' | 'PV_CONSTAT' | 'RAPPORT_MENSUEL';
  date: Date;
  projectName: string;
  blockName?: string;
  unitName?: string;
  pdfPath?: string;
  description?: string;
}

interface DocumentHubProps {
  documents?: Document[];
  onDocumentsChange?: () => void;
}

const documentTypeConfig = {
  PV_VISITE: {
    icon: FileText,
    label: 'documents.pvVisite',
    color: 'bg-blue-500/10 text-blue-500',
  },
  PV_CONSTAT: {
    icon: FileText,
    label: 'documents.pvConstat',
    color: 'bg-orange-500/10 text-orange-500',
  },
  RAPPORT_MENSUEL: {
    icon: FileText,
    label: 'documents.rapportMensuel',
    color: 'bg-green-500/10 text-green-500',
  },
};

// Initial mock data
const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Weekly Site Visit - Block A',
    type: 'PV_VISITE',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    projectName: 'Residential Complex Alpha',
    blockName: 'Block A',
  },
  {
    id: '2',
    title: 'Wall Crack Constat',
    type: 'PV_CONSTAT',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    projectName: 'Residential Complex Alpha',
    blockName: 'Block A',
  },
  {
    id: '3',
    title: 'Monthly Progress Report',
    type: 'RAPPORT_MENSUEL',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    projectName: 'Residential Complex Alpha',
  },
  {
    id: '4',
    title: 'Structural Inspection - Block B',
    type: 'PV_VISITE',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    projectName: 'Residential Complex Alpha',
    blockName: 'Block B',
  },
];

// Helper function to format date consistently
function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function DocumentHub({ documents = [], onDocumentsChange }: DocumentHubProps) {
  const { t } = useLanguage();
  const [localDocuments, setLocalDocuments] = useState<Document[]>(documents.length > 0 ? documents : initialDocuments);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Update local documents when prop changes
  useEffect(() => {
    if (documents.length > 0) {
      setLocalDocuments(documents);
    }
  }, [documents]);

  const handleView = (doc: Document) => {
    setViewingDoc(doc);
  };

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
    setEditForm({ title: doc.title, description: doc.description || '' });
  };

  const handleDelete = (doc: Document) => {
    setDeletingDoc(doc);
  };

  const confirmDelete = async () => {
    if (!deletingDoc) return;
    
    try {
      // In production, this would call the API to delete the document
      console.log('Deleting document:', deletingDoc.id);
      
      // Remove from local state
      setLocalDocuments(prev => prev.filter(d => d.id !== deletingDoc.id));
      
      setDeletingDoc(null);
      if (onDocumentsChange) onDocumentsChange();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    
    try {
      // In production, this would call the API to update the document
      console.log('Updating document:', editingDoc.id, editForm);
      
      // Update local state
      setLocalDocuments(prev => 
        prev.map(doc => 
          doc.id === editingDoc.id 
            ? { ...doc, title: editForm.title, description: editForm.description }
            : doc
        )
      );
      
      setEditingDoc(null);
      if (onDocumentsChange) onDocumentsChange();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('documents.title')}</h2>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('documents.createDocument')}
        </Button>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(documentTypeConfig).map(([type, config]) => {
          const Icon = config.icon;
          const count = localDocuments.filter((d) => d.type === type).length;

          return (
            <Card
              key={type}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className={`p-3 rounded-lg ${config.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-medium">{t(config.label)}</p>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Document List */}
      <div className="space-y-3">
        <h3 className="font-medium">{t('common.recentActivity') || 'Recent'}</h3>
        {localDocuments.map((doc) => {
          const config = documentTypeConfig[doc.type];
          const Icon = config.icon;

          return (
            <Card
              key={doc.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${config.color} mt-1`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{doc.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(doc.date)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.projectName}
                        {doc.blockName && ` > ${doc.blockName}`}
                        {doc.unitName && ` > ${doc.unitName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(doc)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(doc)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {doc.pdfPath && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Document Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('documents.viewDocument') || 'View Document'}</DialogTitle>
          </DialogHeader>
          {viewingDoc && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">{t('documents.documentTitle') || 'Title'}</Label>
                <p className="text-lg font-semibold mt-1">{viewingDoc.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('documents.date') || 'Date'}</Label>
                  <p className="mt-1">{formatDate(viewingDoc.date)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('documents.selectType') || 'Type'}</Label>
                  <p className="mt-1">{t(documentTypeConfig[viewingDoc.type].label)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">{t('project.projectName') || 'Project'}</Label>
                <p className="mt-1">{viewingDoc.projectName}</p>
              </div>
              {viewingDoc.blockName && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('block.blockName') || 'Block'}</Label>
                  <p className="mt-1">{viewingDoc.blockName}</p>
                </div>
              )}
              {viewingDoc.unitName && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('unit.unitName') || 'Unit'}</Label>
                  <p className="mt-1">{viewingDoc.unitName}</p>
                </div>
              )}
              {(viewingDoc.description) && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('documents.description') || 'Description'}</Label>
                  <p className="mt-1">{viewingDoc.description}</p>
                </div>
              )}
              {viewingDoc.pdfPath && (
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  {t('documents.downloadPDF') || 'Download PDF'}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documents.editDocument') || 'Edit Document'}</DialogTitle>
          </DialogHeader>
          {editingDoc && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">{t('documents.documentTitle')}</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">{t('documents.description')}</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingDoc(null)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSaveEdit}>
                  {t('common.save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingDoc} onOpenChange={(open) => !open && setDeletingDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete') || 'Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('documents.deleteConfirm') || 'Are you sure you want to delete this document? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
