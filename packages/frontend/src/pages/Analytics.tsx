import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BarChart3, TrendingUp, Users, Clock, ThumbsUp, Shield } from 'lucide-react';
import type { SurveyAnalytics } from '@midnight-survey/shared';

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/surveys/${id}/analytics`).then(r => r.json()),
      fetch(`/api/v1/surveys/${id}`).then(r => r.json()),
    ]).then(([analyticsData, surveyData]) => {
      setAnalytics(analyticsData.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  if (!analytics) return <div className="text-center py-20 text-gray-500">No analytics available</div>;

  const statsCards = [
    { label: 'Total Responses', value: analytics.totalResponses.toString(), icon: BarChart3, color: 'text-blue-600 bg-blue-50' },
    { label: 'Completion Rate', value: `${(analytics.completionRate * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Avg Duration', value: analytics.averageDurationSeconds ? `${Math.round(analytics.averageDurationSeconds / 60)}m` : 'N/A', icon: Clock, color: 'text-purple-600 bg-purple-50' },
    { label: 'Responses Today', value: analytics.responsesByDate?.slice(-1)[0]?.count.toString() ?? '0', icon: Users, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Survey Analytics</h1>
          <p className="text-gray-500 mt-1">Aggregated, privacy-preserving analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
          <Shield className="h-4 w-4" />
          <span>ZK-Verified Responses</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Responses Over Time</h3>
          {analytics.responsesByDate.length > 0 ? (
            <div className="space-y-2">
              {analytics.responsesByDate.map(d => (
                <div key={d.date} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-24">{d.date}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full transition-all"
                      style={{ width: `${(d.count / Math.max(...analytics.responsesByDate.map(x => x.count), 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No responses yet</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Question Analysis</h3>
          {analytics.questionAnalytics.length > 0 ? (
            <div className="space-y-6">
              {analytics.questionAnalytics.map(qa => (
                <div key={qa.questionId} className="border-b pb-4 last:border-b-0">
                  <p className="font-medium text-sm mb-2">{qa.questionTitle}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Responses: {qa.totalAnswers}</span>
                    <span>Skip rate: {(qa.skipRate * 100).toFixed(1)}%</span>
                    {qa.averageRating && <span>Avg rating: {qa.averageRating.toFixed(2)}</span>}
                  </div>
                  <div className="mt-2 space-y-1">
                    {Object.entries(qa.distribution).slice(0, 5).map(([key, count]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-24 truncate">{key}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-primary-400 h-full rounded-full" style={{ width: `${(count / qa.totalAnswers) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No question data available</p>
          )}
        </div>
      </Card>
    </div>
  );
}
