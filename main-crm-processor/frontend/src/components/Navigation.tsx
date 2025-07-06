import React from 'react';
import { FileText, BarChart3, Database, Badge } from 'lucide-react';

interface NavigationProps {
  currentView: 'input' | 'results' | 'dashboard';
  onViewChange: (view: 'input' | 'results' | 'dashboard') => void;
  totalLeads: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  totalLeads 
}) => {
  const navItems = [
    { 
      id: 'input' as const, 
      label: 'Process Meeting', 
      icon: FileText,
      description: 'Input meeting summary'
    },
    { 
      id: 'results' as const, 
      label: 'Latest Results', 
      icon: Database,
      description: 'View extracted data'
    },
    { 
      id: 'dashboard' as const, 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Analytics & insights'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium transition-colors relative ${
                    isActive 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {totalLeads > 0 && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-full">
              <Badge className="w-4 h-4" />
              <span className="text-sm font-medium">{totalLeads} Leads Generated</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};