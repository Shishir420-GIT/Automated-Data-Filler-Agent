import React, { useState, useEffect } from 'react';
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
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Check API connection on startup
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await apiService.healthCheck();
        setApiStatus('connected');
        console.log('✅ API connection established');
        
        // Get initial lead count
        const leadsResponse = await apiService.getLeads();
        setTotalLeads(leadsResponse.total);
      } catch (error) {
        console.error('❌ API connection failed:', error);
        setApiStatus('error');
      }
    };

    checkApiConnection();
  }, []);

  const handleProcessMeeting = async (summary: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Processing meeting summary...');
      const result = await apiService.processMeeting({ summary });
      console.log('Processing successful:', result);
      
      setProcessedData(result);
      setTotalLeads(prev => prev + 1);
      setCurrentView('results');
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process meeting summary');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewMeeting = () => {
    setProcessedData(null);
    setError(null);
    setCurrentView('input');
  };

  // Show API connection status
  if (apiStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to API...</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">API Connection Failed</h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the backend API. Please ensure:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1 mb-6">
            <li>• Backend server is running on port 8000</li>
            <li>• Environment variables are configured</li>
            <li>• MongoDB connection is established</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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