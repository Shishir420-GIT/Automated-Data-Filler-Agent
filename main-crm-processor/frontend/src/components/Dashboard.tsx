import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  Calendar,
  Target,
  Award,
  Plus,
  RefreshCw
} from 'lucide-react';
import type { Lead, Stats } from '../types/api';
import { apiService } from '../services/api';

interface DashboardProps {
  onNewMeeting: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNewMeeting }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ total_leads: 0, total_deals: 0, total_value: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [leadsResponse, statsResponse] = await Promise.all([
        apiService.getLeads(10), // Get last 10 leads
        apiService.getStats()
      ]);
      
      setLeads(leadsResponse.leads);
      setStats(statsResponse);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (leads.length === 0) {
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

  const avgConfidence = leads.length > 0 
    ? leads.reduce((sum, lead) => sum + lead.confidence, 0) / leads.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview of your CRM data and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={onNewMeeting}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Meeting
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_leads}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>From {leads.length} meetings</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_deals}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Pipeline opportunities</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.total_value.toLocaleString()}
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

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(avgConfidence * 100)}%
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <Award className="w-4 h-4 mr-1" />
            <span>Extraction quality</span>
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meetings</h3>
        <div className="space-y-4">
          {leads.slice(0, 5).map((lead, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.contact.name || lead.company.name || 'New Lead'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(lead.processed_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    {Math.round(lead.confidence * 100)}% confidence
                  </span>
                  {lead.deal.value && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      ${lead.deal.value}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Contact:</span> {lead.contact.name || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Company:</span> {lead.company.name || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Stage:</span> {lead.deal.stage || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};