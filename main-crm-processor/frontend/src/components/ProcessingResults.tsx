import React from 'react';
import { 
  User, 
  Building, 
  DollarSign, 
  Download, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Globe,
  Target,
  Plus,
  Shield
} from 'lucide-react';
import type { ProcessingResponse } from '../types/api';

interface ProcessingResultsProps {
  data: ProcessingResponse;
  onNewMeeting: () => void;
}

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({ 
  data, 
  onNewMeeting 
}) => {
  const handleExport = (format: 'csv' | 'json') => {
    const content = format === 'csv' 
      ? convertToCSV(data)
      : JSON.stringify(data, null, 2);
    
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-data-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: ProcessingResponse) => {
    const rows = [];
    rows.push(['Type', 'Field', 'Value']);
    
    // Contact data
    if (data.contact.name) rows.push(['Contact', 'Name', data.contact.name]);
    if (data.contact.title) rows.push(['Contact', 'Title', data.contact.title]);
    if (data.contact.email) rows.push(['Contact', 'Email', data.contact.email]);
    if (data.contact.phone) rows.push(['Contact', 'Phone', data.contact.phone]);
    
    // Company data
    if (data.company.name) rows.push(['Company', 'Name', data.company.name]);
    if (data.company.industry) rows.push(['Company', 'Industry', data.company.industry]);
    if (data.company.size) rows.push(['Company', 'Size', data.company.size]);
    if (data.company.budget) rows.push(['Company', 'Budget', data.company.budget]);
    
    // Deal data
    if (data.deal.value) rows.push(['Deal', 'Value', data.deal.value]);
    if (data.deal.stage) rows.push(['Deal', 'Stage', data.deal.stage]);
    if (data.deal.timeline) rows.push(['Deal', 'Timeline', data.deal.timeline]);
    if (data.deal.competitor) rows.push(['Deal', 'Competitor', data.deal.competitor]);
    if (data.deal.next_action) rows.push(['Deal', 'Next Action', data.deal.next_action]);
    
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const hasContactData = data.contact.name || data.contact.email || data.contact.title || data.contact.phone;
  const hasCompanyData = data.company.name || data.company.industry || data.company.size || data.company.budget;
  const hasDealData = data.deal.value || data.deal.stage || data.deal.timeline || data.deal.competitor || data.deal.next_action;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Processing Complete</h2>
              <p className="text-gray-600">
                Extracted data with {Math.round(data.confidence * 100)}% confidence
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExport('csv')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </button>
            </div>
            <button
              onClick={onNewMeeting}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </button>
          </div>
        </div>
      </div>

      {/* PII Detection Results */}
      {data.pii && data.pii.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">PII Detected</h3>
          </div>
          <p className="text-orange-800 mb-3">
            Found {data.pii.length} potentially sensitive information items. Please review before sharing.
          </p>
          <div className="flex flex-wrap gap-2">
            {data.pii.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                {item.entity} ({Math.round(item.score * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <p className="text-sm text-gray-600">
                {hasContactData ? 'Information extracted' : 'No data found'}
              </p>
            </div>
          </div>
          
          {hasContactData ? (
            <div className="border border-gray-200 rounded-lg p-4">
              {data.contact.name && (
                <h4 className="font-medium text-gray-900 mb-2">{data.contact.name}</h4>
              )}
              {data.contact.title && (
                <p className="text-sm text-gray-600 mb-3">{data.contact.title}</p>
              )}
              <div className="space-y-2">
                {data.contact.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{data.contact.email}</span>
                  </div>
                )}
                {data.contact.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{data.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No contact information found</p>
            </div>
          )}
        </div>

        {/* Companies */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Company</h3>
              <p className="text-sm text-gray-600">
                {hasCompanyData ? 'Information extracted' : 'No data found'}
              </p>
            </div>
          </div>
          
          {hasCompanyData ? (
            <div className="border border-gray-200 rounded-lg p-4">
              {data.company.name && (
                <h4 className="font-medium text-gray-900 mb-2">{data.company.name}</h4>
              )}
              <div className="space-y-2">
                {data.company.industry && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{data.company.industry}</span>
                  </div>
                )}
                {data.company.size && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{data.company.size}</span>
                  </div>
                )}
                {data.company.budget && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{data.company.budget}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No company information found</p>
            </div>
          )}
        </div>

        {/* Deals */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Deal</h3>
              <p className="text-sm text-gray-600">
                {hasDealData ? 'Information extracted' : 'No data found'}
              </p>
            </div>
          </div>
          
          {hasDealData ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                {data.deal.value && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value</span>
                    <span className="font-medium text-green-600">{data.deal.value}</span>
                  </div>
                )}
                {data.deal.stage && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stage</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {data.deal.stage}
                    </span>
                  </div>
                )}
                {data.deal.timeline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Timeline</span>
                    <span className="text-sm font-medium">{data.deal.timeline}</span>
                  </div>
                )}
              </div>
              {data.deal.competitor && (
                <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-700">
                    <strong>Competitor:</strong> {data.deal.competitor}
                  </p>
                </div>
              )}
              {data.deal.next_action && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    <strong>Next:</strong> {data.deal.next_action}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No deal information found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};