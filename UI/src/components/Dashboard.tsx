import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  Calendar,
  Target,
  Award,
  Plus
} from 'lucide-react';
import { ProcessedData } from '../App';

interface DashboardProps {
  processedData: ProcessedData[];
  onNewMeeting: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  processedData, 
  onNewMeeting 
}) => {
  const totalContacts = processedData.reduce((sum, data) => sum + data.contacts.length, 0);
  const totalCompanies = processedData.reduce((sum, data) => sum + data.companies.length, 0);
  const totalDeals = processedData.reduce((sum, data) => sum + data.deals.length, 0);
  const totalValue = processedData.reduce((sum, data) => 
    sum + data.deals.reduce((dealSum, deal) => dealSum + deal.value, 0), 0
  );
  
  const avgConfidence = processedData.length > 0 
    ? processedData.reduce((sum, data) => sum + data.confidence, 0) / processedData.length
    : 0;

  const recentMeetings = processedData.slice(-5).reverse();

  const dealsByStage = processedData.flatMap(data => data.deals).reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (processedData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
        <p className="text-gray-600 mb-8">
          Process your first meeting to see analytics and insights here
        </p>
        <button
          onClick={onNewMeeting}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Process First Meeting
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview of your CRM data and insights</p>
        </div>
        <button
          onClick={onNewMeeting}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Meeting
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{processedData.length} meetings</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-gray-900">{totalCompanies}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Target className="w-4 h-4 mr-1" />
            <span>Unique organizations</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Pipeline value</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>Potential revenue</span>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Deal Stages */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Stages</h3>
          <div className="space-y-3">
            {Object.entries(dealsByStage).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stage}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / totalDeals) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meetings</h3>
          <div className="space-y-4">
            {recentMeetings.map((meeting, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {meeting.deals[0]?.name || 'New Lead'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {meeting.extractedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      {Math.round(meeting.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{meeting.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Extraction Quality</h4>
            <p className="text-sm text-gray-600">
              Average confidence score: <span className="font-medium text-green-600">
                {Math.round(avgConfidence * 100)}%
              </span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Productivity</h4>
            <p className="text-sm text-gray-600">
              You've processed <span className="font-medium text-blue-600">
                {processedData.length} meetings
              </span> and generated <span className="font-medium text-green-600">
                {totalContacts} leads
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};