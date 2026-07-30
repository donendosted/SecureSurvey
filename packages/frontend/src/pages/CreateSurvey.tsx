import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import type { QuestionType, Question } from '@midnight-survey/shared';

interface QuestionForm {
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[];
}

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [error, setError] = useState('');

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'single_choice', label: 'Multiple Choice' },
    { value: 'multiple_choice', label: 'Checkboxes' },
    { value: 'text_short', label: 'Short Answer' },
    { value: 'rating', label: 'Rating' },
    { value: 'scale', label: 'Scale' },
    { value: 'yes_no', label: 'Yes/No' },
  ];

  const addQuestion = () => {
    setQuestions([...questions, { type: 'single_choice' as QuestionType, title: '', required: false, options: ['Option 1'] }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, updates: Partial<QuestionForm>) => {
    setQuestions(questions.map((q, i) => i === idx ? { ...q, ...updates } : q));
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (questions.length === 0) { setError('At least one question is required'); return; }

    try {
      const res = await fetch('/api/v1/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')!).accessToken : ''}` },
        body: JSON.stringify({ title, description, questions }),
      });
      const data = await res.json();
      if (data.success) navigate(`/surveys/${data.data.id}`);
      else setError(data.error?.message ?? 'Failed to create survey');
    } catch {
      setError('Failed to create survey');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Create Survey</h1>
        <p className="text-gray-500 mt-1">Build your privacy-preserving survey</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

      <Card>
        <CardHeader><CardTitle>Survey Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Survey Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter survey title" />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your survey..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
          <Button onClick={addQuestion} size="sm"><Plus className="h-4 w-4 mr-1" />Add Question</Button>
        </div>

        {questions.map((q, idx) => (
          <Card key={idx} className="relative">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />
                  <span className="text-sm font-medium text-gray-500">Q{idx + 1}</span>
                </div>
                <button onClick={() => removeQuestion(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <Input
                value={q.title}
                onChange={e => updateQuestion(idx, { title: e.target.value })}
                placeholder="Enter your question"
              />

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Question Type</label>
                  <select
                    className="input mt-1"
                    value={q.type}
                    onChange={e => updateQuestion(idx, { type: e.target.value as QuestionType, options: ['single_choice', 'multiple_choice'].includes(e.target.value) ? ['Option 1'] : undefined })}
                  >
                    {questionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 mt-6">
                  <input type="checkbox" checked={q.required} onChange={e => updateQuestion(idx, { required: e.target.checked })} className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Required</span>
                </label>
              </div>

              {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Options</label>
                  {q.options?.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <Input
                        value={opt}
                        onChange={e => {
                          const newOpts = [...(q.options ?? [])];
                          newOpts[oi] = e.target.value;
                          updateQuestion(idx, { options: newOpts });
                        }}
                        placeholder={`Option ${oi + 1}`}
                      />
                      <button
                        onClick={() => updateQuestion(idx, { options: q.options?.filter((_, i) => i !== oi) })}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => updateQuestion(idx, { options: [...(q.options ?? []), `Option ${(q.options?.length ?? 0) + 1}`] })}>
                    <Plus className="h-4 w-4 mr-1" />Add Option
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Survey</Button>
      </div>
    </div>
  );
}
