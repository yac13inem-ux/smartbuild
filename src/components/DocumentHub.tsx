'use client';

import { FileText, Calendar, Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
}

interface DocumentHubProps {
  documents?: Document[];
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

export function DocumentHub({ documents = [] }: DocumentHubProps) {
  const { t } = useLanguage();

  // Mock data
  const mockDocuments: Document[] = [
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

  const displayDocuments = documents.length > 0 ? documents : mockDocuments;

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
          const count = displayDocuments.filter((d) => d.type === type).length;

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
        {displayDocuments.map((doc) => {
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
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.projectName}
                        {doc.blockName && ` > ${doc.blockName}`}
                        {doc.unitName && ` > ${doc.unitName}`}
                      </p>
                    </div>
                  </div>
                  {doc.pdfPath && (
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
