import React, { useState } from 'react';
import { Header } from './components/Header';
import { MeetingInput } from './components/MeetingInput';
import { ProcessingResults } from './components/ProcessingResults';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  authority: boolean;
  company: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: number;
  website: string;
  techStack: string[];
  painPoints: string[];
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  stage: string;
  competitor: string;
  nextStep: string;
  timeline: string;
  probability: number;
}

export interface ProcessedData {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  summary: string;
  confidence: number;
  extractedAt: Date;
}

function App() {
  const [currentView, setCurrentView] = useState<'input' | 'results' | 'dashboard'>('input');
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [allProcessedData, setAllProcessedData] = useState<ProcessedData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessMeeting = async (summary: string) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate AI processing with realistic data
    const mockProcessedData: ProcessedData = {
      contacts: [
        {
          id: `contact-${Date.now()}`,
          name: "Sarah Johnson",
          title: "Marketing Director",
          email: "sarah.johnson@growthtech.com",
          phone: "+1 (555) 123-4567",
          authority: true,
          company: "GrowthTech Solutions"
        }
      ],
      companies: [
        {
          id: `company-${Date.now()}`,
          name: "GrowthTech Solutions",
          industry: "Marketing Technology",
          size: 50,
          website: "https://growthtech.com",
          techStack: ["HubSpot", "Salesforce", "Google Analytics"],
          painPoints: ["Manual lead scoring", "Fragmented data", "Limited automation"]
        }
      ],
      deals: [
        {
          id: `deal-${Date.now()}`,
          name: "Marketing Automation Implementation",
          value: 30000,
          currency: "USD",
          stage: "Demo Scheduled",
          competitor: "HubSpot",
          nextStep: "Product demo on Friday",
          timeline: "Q1 2025",
          probability: 65
        }
      ],
      summary: "High-potential lead with clear budget and timeline. Decision maker identified.",
      confidence: 0.92,
      extractedAt: new Date()
    };
    
    setProcessedData(mockProcessedData);
    setAllProcessedData(prev => [...prev, mockProcessedData]);
    setIsProcessing(false);
    setCurrentView('results');
  };

  const handleNewMeeting = () => {
    setProcessedData(null);
    setCurrentView('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        totalLeads={allProcessedData.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'input' && (
          <MeetingInput 
            onProcessMeeting={handleProcessMeeting}
            isProcessing={isProcessing}
          />
        )}
        
        {currentView === 'results' && processedData && (
          <ProcessingResults 
            data={processedData}
            onNewMeeting={handleNewMeeting}
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            processedData={allProcessedData}
            onNewMeeting={handleNewMeeting}
          />
        )}
      </main>
    </div>
  );
}

export default App;