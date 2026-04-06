'use client';

import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Dashboard } from '@/components/Dashboard';
import { ProjectList } from '@/components/ProjectList';
import { DocumentHub } from '@/components/DocumentHub';
import { ProblemList } from '@/components/ProblemList';
import { Settings } from '@/components/Settings';
import { useState } from 'react';

type Tab = 'dashboard' | 'projects' | 'documents' | 'problems' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [documentUpdateKey, setDocumentUpdateKey] = useState(0);
  const [problemUpdateKey, setProblemUpdateKey] = useState(0);

  const handleDocumentChange = () => {
    setDocumentUpdateKey(prev => prev + 1);
  };

  const handleProblemChange = () => {
    setProblemUpdateKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectList />;
      case 'documents':
        return (
          <DocumentHub 
            key={documentUpdateKey}
            onDocumentsChange={handleDocumentChange}
          />
        );
      case 'problems':
        return (
          <ProblemList 
            key={problemUpdateKey}
            onProblemsChange={handleProblemChange}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
