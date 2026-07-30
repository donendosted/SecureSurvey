import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import type { Survey } from '@midnight-survey/shared';
import { Eye, Edit, BarChart3, Globe, Lock, ArrowLeft } from 'lucide-react';

export default function SurveyView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/surveys/${id}`)
      .then(r => r.json())
      .then(d => { setSurvey(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  if (!survey) return <div className="text-center py-20 text-gray-500">Survey not found</div>;

  const statusColors: Record<string, string> = {
    draft: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    published: 'text-green-700 bg-green-50 border-green-200',
    closed: 'text-gray-600 bg-gray-50 border-gray-200',
    archived: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{survey.title}</CardTitle>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[survey.status]}`}>
                  {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                </span>
              </div>
              {survey.description && <CardDescription className="mt-2">{survey.description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                const surveyUrl = `${window.location.origin}/survey/${survey.id}/take`;
                navigator.clipboard.writeText(surveyUrl);
              }}>
                <Globe className="h-4 w-4 mr-1" /> Share
              </Button>
              {survey.status === 'draft' && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/surveys/${survey.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold">{survey.questions.length}</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold">{survey.version}</p>
              <p className="text-sm text-gray-500">Version</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Responses</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold">{survey.settings.allowAnonymous ? 'Yes' : 'No'}</p>
              <p className="text-sm text-gray-500">Anonymous</p>
            </div>
          </div>

          <h3 className="font-semibold mb-3">Questions Preview</h3>
          <div className="space-y-2">
            {survey.questions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-400 w-6">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="text-xs text-gray-400">{q.type.replace('_', ' ')}</p>
                </div>
                {q.required && <span className="text-xs text-red-500">*</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
