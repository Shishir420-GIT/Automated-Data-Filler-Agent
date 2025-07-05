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
  Plus
} from 'lucide-react';
import { ProcessedData } from '../App';

interface ProcessingResultsProps {
  data: ProcessedData;
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

  const convertToCSV = (data: ProcessedData) => {
    const rows = [];
    rows.push(['Type', 'Name', 'Details', 'Value']);
    
    data.contacts.forEach(contact => {
      rows.push(['Contact', contact.name, `${contact.title} at ${contact.company}`, contact.email]);
    });
    
    data.companies.forEach(company => {
      rows.push(['Company', company.name, company.industry, `${company.size} employees`]);
    });
    
    data.deals.forEach(deal => {
      rows.push(['Deal', deal.name, deal.stage, `$${deal.value.toLocaleString()}`]);
    });
    
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

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
                Extracted {data.contacts.length + data.companies.length + data.deals.length} entities 
                with {Math.round(data.confidence * 100)}% confidence
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

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
        <p className="text-blue-100">{data.summary}</p>
      </div>

      {/* Results Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
              <p className="text-sm text-gray-600">{data.contacts.length} extracted</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {data.contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  {contact.authority && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Decision Maker
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{contact.title}</p>
                <div className="space-y-1">
                  {contact.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Companies</h3>
              <p className="text-sm text-gray-600">{data.companies.length} extracted</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {data.companies.map((company) => (
              <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{company.name}</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{company.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{company.size} employees</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{company.website}</span>
                    </div>
                  )}
                </div>
                {company.painPoints.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Pain Points:</p>
                    <div className="flex flex-wrap gap-1">
                      {company.painPoints.map((point, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deals */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Deals</h3>
              <p className="text-sm text-gray-600">{data.deals.length} extracted</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {data.deals.map((deal) => (
              <div key={deal.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{deal.name}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value</span>
                    <span className="font-medium text-green-600">
                      ${deal.value.toLocaleString()} {deal.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stage</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {deal.stage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Probability</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">{deal.probability}%</span>
                    </div>
                  </div>
                </div>
                {deal.competitor && (
                  <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-700">
                      <strong>Competitor:</strong> {deal.competitor}
                    </p>
                  </div>
                )}
                {deal.nextStep && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      <strong>Next:</strong> {deal.nextStep}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};