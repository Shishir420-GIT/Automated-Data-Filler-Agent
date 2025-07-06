import React, { useState } from 'react';
import { FileText, Sparkles, Clock, Users, AlertCircle } from 'lucide-react';

interface MeetingInputProps {
  onProcessMeeting: (summary: string) => void;
  isProcessing: boolean;
  error?: string;
}

export const MeetingInput: React.FC<MeetingInputProps> = ({ 
  onProcessMeeting, 
  isProcessing,
  error 
}) => {
  const [summary, setSummary] = useState('');
  const [selectedExample, setSelectedExample] = useState('');

  const examples = [
    {
      title: "Sales Discovery Call",
      content: "Had a call with Sarah Johnson, Marketing Director at GrowthTech Solutions. They need marketing automation for their 50-person team. Budget is around $30K annually. Currently evaluating HubSpot vs our solution. Next step: Demo scheduled for Friday. Sarah has decision-making authority. Company is growing fast, currently using manual processes for lead scoring."
    },
    {
      title: "Enterprise Demo",
      content: "Presented to TechCorp leadership team: Mike Chen (CTO), Lisa Rodriguez (VP Engineering), and David Kim (Director of IT). 200+ person engineering team. Looking for DevOps automation platform. Budget approved for $150K. Main competitors: GitLab, Azure DevOps. Timeline: Implementation by Q2 2025. Next step: Technical deep-dive session next Tuesday."
    },
    {
      title: "Follow-up Meeting",
      content: "Follow-up with Jennifer Wang, Product Manager at InnovateAI. Team of 25 developers. Discussed pricing concerns - budget is $45K max. Competitor analysis shows they're also evaluating Atlassian suite. Jennifer mentioned approval process involves CFO. Next: Proposal due end of week. High interest in our analytics features."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim()) {
      onProcessMeeting(summary.trim());
    }
  };

  const handleExampleSelect = (example: string) => {
    setSummary(example);
    setSelectedExample(example);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Transform Meeting Notes into CRM Gold
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Paste your meeting summary below and watch AI extract contacts, companies, and deals with precision
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">Processing Error</p>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Paste your meeting notes here... Include details about contacts, companies, budgets, timelines, and next steps."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>~2-5 seconds</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Multi-entity extraction</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!summary.trim() || isProcessing}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Process Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Examples</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleSelect(example.content)}
              className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600">
                {example.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {example.content}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};