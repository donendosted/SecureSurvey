import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Shield, CheckCircle } from 'lucide-react';
import type { Survey, QuestionType } from '@midnight-survey/shared';

export default function TakeSurvey() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/surveys/${id}`)
      .then(r => r.json())
      .then(d => { setSurvey(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAnswer = (questionId: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!survey) return;
    try {
      const res = await fetch(`/api/v1/surveys/${survey.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId, value,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch {
      // handle error
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  if (!survey) return <div className="text-center py-20 text-gray-500">Survey not found</div>;
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50">
      <Card className="max-w-md mx-4 text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">Response Submitted</CardTitle>
          <CardDescription className="mb-6">Your response has been encrypted and stored on the Midnight Network. Thank you for your participation!</CardDescription>
          <p className="text-xs text-gray-400 mb-4">Your privacy is protected by zero-knowledge proofs.</p>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </CardContent>
      </Card>
    </div>
  );

  const currentQuestion = survey.questions[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6 animate-fade-in">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 text-sm text-primary-600 mb-2">
              <Shield className="h-4 w-4" />
              <span>Privacy Protected by ZK Proofs</span>
            </div>
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            {survey.description && <CardDescription className="mt-2">{survey.description}</CardDescription>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">Question {step + 1} of {survey.questions.length}</span>
              <div className="flex gap-1">
                {survey.questions.map((_, i) => (
                  <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i <= step ? 'bg-primary-500' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            <div className="space-y-6" key={currentQuestion.id}>
              <div>
                <h3 className="text-lg font-semibold">{currentQuestion.title}</h3>
                {currentQuestion.description && <p className="text-sm text-gray-500 mt-1">{currentQuestion.description}</p>}
              </div>

              {renderQuestion(currentQuestion, answers[currentQuestion.id], val => handleAnswer(currentQuestion.id, val))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</Button>
          {step < survey.questions.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Response</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function renderQuestion(
  question: Survey['questions'][0],
  value: unknown,
  onChange: (val: unknown) => void
) {
  switch (question.type) {
    case 'single_choice':
      return (
        <div className="space-y-2">
          {(question as any).options?.map((opt: string) => (
            <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="radio" name={question.id} checked={value === opt} onChange={() => onChange(opt)} className="text-primary-600" />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'multiple_choice':
      return (
        <div className="space-y-2">
          {(question as any).options?.map((opt: string) => (
            <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={Array.isArray(value) && (value as string[]).includes(opt)} onChange={() => {
                const arr = Array.isArray(value) ? [...value as string[]] : [];
                const idx = arr.indexOf(opt);
                idx >= 0 ? arr.splice(idx, 1) : arr.push(opt);
                onChange(arr);
              }} className="rounded text-primary-600" />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'text_short':
      return <input className="input" value={value as string ?? ''} onChange={e => onChange(e.target.value)} placeholder="Enter your answer..." />;
    case 'text_long':
      return <textarea className="input min-h-[120px] resize-y" value={value as string ?? ''} onChange={e => onChange(e.target.value)} placeholder="Enter your detailed answer..." />;
    case 'rating':
      return (
        <div className="flex gap-2">
          {Array.from({ length: (question as any).maxRating ?? 5 }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => onChange(n)} className={`h-12 w-12 rounded-full font-bold text-lg transition-colors ${value === n ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {n}
            </button>
          ))}
        </div>
      );
    case 'scale':
      return (
        <div className="space-y-2">
          <input type="range" min={(question as any).minValue ?? 1} max={(question as any).maxValue ?? 10} step={(question as any).step ?? 1} value={value as number ?? 5} onChange={e => onChange(parseInt(e.target.value))} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{(question as any).minLabel}`</span>
            <span className="font-bold text-primary-600">{value as number ?? 5}</span>
            <span>{(question as any).maxLabel}</span>
          </div>
        </div>
      );
    case 'yes_no':
      return (
        <div className="flex gap-4">
          {['Yes', 'No'].map(opt => (
            <button key={opt} onClick={() => onChange(opt === 'Yes')} className={`flex-1 p-4 border-2 rounded-lg font-medium transition-colors ${value === (opt === 'Yes') ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-200 hover:border-gray-300'}`}>
              {opt}
            </button>
          ))}
        </div>
      );
    default:
      return <p className="text-gray-500">Unsupported question type</p>;
  }
}
