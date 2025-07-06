import React, { useState } from 'react';
import { Header } from './components/Header';
import { MeetingInput } from './components/MeetingInput';
import { ProcessingResults } from './components/ProcessingResults';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import type { ProcessingResponse } from './types/api';
import { apiService } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState<'input' | 'results' | 'dashboard'>('input');
  const [processedData, setProcessedData] = useState<ProcessingResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalLeads, setTotalLeads] = useState(0);

  const handleProcessMeeting = async (summary: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await apiService.processMeeting({ summary });
      setProcessedData(result);
      setTotalLeads(prev => prev + 1);
      setCurrentView('results');
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to process meeting summary');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewMeeting = () => {
    setProcessedData(null);
    setError(null);
    setCurrentView('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        totalLeads={totalLeads}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'input' && (
          <MeetingInput 
            onProcessMeeting={handleProcessMeeting}
            isProcessing={isProcessing}
            error={error}
          />
        )}
        
        {currentView === 'results' && processedData && (
          <ProcessingResults 
            data={processedData}
            onNewMeeting={handleNewMeeting}
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard onNewMeeting={handleNewMeeting} />
        )}
      </main>
    </div>
  );
}

export default App;