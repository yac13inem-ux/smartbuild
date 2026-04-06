'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Calendar, Download, Plus, Eye, Pencil, Trash2, MessageCircle } from 'lucide-react';
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
  documentUpdateKey?: number;
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

// Helper function to format date consistently
function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function DocumentHub({ documents = [], onDocumentsChange, documentUpdateKey }: DocumentHubProps) {
  const { t } = useLanguage();
  const [localDocuments, setLocalDocuments] = useState<Document[]>(documents);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    type: 'PV_VISITE' as 'PV_VISITE' | 'PV_CONSTAT' | 'RAPPORT_MENSUEL',
    projectId: '',
    blockId: '',
    date: '',
    description: ''
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const documentsRef = useRef<Document[]>(documents);

  // Fetch documents from API
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch documents when key changes (component remounts)
  useEffect(() => {
    fetchDocuments();
  }, [documentUpdateKey]);

  const fetchDocuments = async () => {
    console.log('Fetching documents...');
    try {
      const response = await fetch('/api/reports?limit=100');
      const result = await response.json();
      console.log('Documents response:', result);
      if (result.success) {
        // Transform reports to documents format
        const transformedDocs = result.data.map((report: any) => ({
          id: report.id,
          title: report.title,
          type: report.type,
          date: new Date(report.date),
          projectName: report.project?.name || 'Unknown',
          blockName: report.block?.name,
          unitName: report.unit?.name,
          pdfPath: report.pdfPath,
          description: report.description,
        }));
        console.log('Transformed documents:', transformedDocs);
        setLocalDocuments(transformedDocs);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Update local documents when prop changes
  useEffect(() => {
    // Only update if the documents array has actually changed
    const documentsChanged = JSON.stringify(documentsRef.current) !== JSON.stringify(documents);
    if (documentsChanged) {
      documentsRef.current = documents;
      setLocalDocuments(documents);
    }
  }, [documents]);

  // Fetch projects when create dialog opens
  useEffect(() => {
    if (isCreateDialogOpen) {
      fetchProjects();
    }
  }, [isCreateDialogOpen]);

  // Fetch blocks when project is selected
  useEffect(() => {
    if (createForm.projectId) {
      fetchBlocks(createForm.projectId);
    } else {
      setBlocks([]);
    }
  }, [createForm.projectId]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchBlocks = async (projectId: string) => {
    try {
      const response = await fetch(`/api/blocks?projectId=${projectId}`);
      const result = await response.json();
      if (result.success) {
        setBlocks(result.data);
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

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
      console.log('Deleting document:', deletingDoc.id);
      // Call API to delete the document
      const response = await fetch(`/api/reports/${deletingDoc.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete result:', result);

      if (response.ok || result.success) {
        // Refresh the documents list
        await fetchDocuments();
      }
      setDeletingDoc(null);
      if (onDocumentsChange) onDocumentsChange();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    
    try {
      console.log('Updating document:', editingDoc.id, editForm);
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

  const handleCreateDocument = async () => {
    console.log('Creating document:', createForm);
    if (!createForm.title || !createForm.type) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          type: createForm.type,
          projectId: createForm.projectId || undefined,
          blockId: createForm.blockId || undefined,
          date: createForm.date ? new Date(createForm.date) : new Date(),
        }),
      });

      const result = await response.json();
      console.log('Create result:', result);
      if (result.success) {
        setIsCreateDialogOpen(false);
        setCreateForm({
          title: '',
          type: 'PV_VISITE',
          projectId: '',
          blockId: '',
          date: '',
          description: ''
        });
        console.log('About to fetch documents...');
        // Fetch documents to refresh the list
        await fetchDocuments();
        console.log('Documents fetched after create');
        if (onDocumentsChange) onDocumentsChange();
      }
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppShare = (doc: Document) => {
    const message = `📄 ${t(documentTypeConfig[doc.type].label)}\n\n` +
      `📍 ${doc.projectName}${doc.blockName ? ` > ${doc.blockName}` : ''}${doc.unitName ? ` > ${doc.unitName}` : ''}\n\n` +
      `Title: ${doc.title}\n` +
      `Date: ${formatDate(doc.date)}\n` +
      (doc.description ? `Description: ${doc.description}\n\n` : '') +
      `Please review this document.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('documents.title')}</h2>
        <Button size="sm" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
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
        {localDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {t('common.noData')}
              </p>
            </CardContent>
          </Card>
        ) : (
          localDocuments.map((doc) => {
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
                  <div className="flex items-center justify-between mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 mr-2"
                      onClick={() => handleWhatsAppShare(doc)}
                    >
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      {t('problems.whatsapp') || 'WhatsApp'}
                    </Button>
                    <div className="flex gap-1">
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
          })
        )}
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
              {viewingDoc.description && (
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

      {/* Create Document Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('documents.createDocument')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-title">{t('documents.documentTitle')}</Label>
              <Input
                id="create-title"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder={t('documents.documentTitle')}
              />
            </div>
            <div>
              <Label htmlFor="create-type">{t('documents.selectType')}</Label>
              <select
                id="create-type"
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as any })}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="PV_VISITE">{t('documents.pvVisite')}</option>
                <option value="PV_CONSTAT">{t('documents.pvConstat')}</option>
                <option value="RAPPORT_MENSUEL">{t('documents.rapportMensuel')}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="create-project">{t('documents.selectProject')}</Label>
              <select
                id="create-project"
                value={createForm.projectId}
                onChange={(e) => setCreateForm({ ...createForm, projectId: e.target.value, blockId: '' })}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="">{t('documents.selectProject')}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="create-block">{t('documents.selectBlock')}</Label>
              <select
                id="create-block"
                value={createForm.blockId}
                onChange={(e) => setCreateForm({ ...createForm, blockId: e.target.value })}
                disabled={!createForm.projectId}
                className="w-full p-2 border rounded-md bg-background disabled:opacity-50"
              >
                <option value="">{t('documents.selectBlock')}</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>{block.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="create-date">{t('documents.date')}</Label>
              <Input
                id="create-date"
                type="date"
                value={createForm.date}
                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <Label htmlFor="create-description">{t('documents.description')}</Label>
              <Textarea
                id="create-description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows={3}
                placeholder={t('documents.description')}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreateDocument} disabled={isLoading || !createForm.title || !createForm.type}>
                {isLoading ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
