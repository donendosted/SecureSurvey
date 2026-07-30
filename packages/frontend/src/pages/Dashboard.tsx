import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { Plus, ClipboardList, BarChart3, Shield, Lock, Eye } from 'lucide-react';

const stats = [
  { label: 'Total Surveys', value: '12', change: '+3', icon: ClipboardList, color: 'text-blue-600 bg-blue-50' },
  { label: 'Active Surveys', value: '7', change: '+2', icon: Eye, color: 'text-green-600 bg-green-50' },
  { label: 'Total Responses', value: '1,234', change: '+156', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
  { label: 'ZK Proofs Verified', value: '1,234', change: '100%', icon: Shield, color: 'text-primary-600 bg-primary-50' },
];

const recentSurveys = [
  { id: '1', title: 'Customer Satisfaction Survey', status: 'Published', responses: 234, lastUpdated: '2 hours ago' },
  { id: '2', title: 'Employee Engagement Q1', status: 'Draft', responses: 0, lastUpdated: '1 day ago' },
  { id: '3', title: 'Product Feedback v2', status: 'Published', responses: 89, lastUpdated: '3 days ago' },
  { id: '4', title: 'Market Research 2026', status: 'Closed', responses: 567, lastUpdated: '1 week ago' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connected, connect } = useWallet();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name ?? 'User'}</h1>
          <p className="text-gray-500 mt-1">Manage your privacy-preserving surveys on Midnight Network</p>
        </div>
        <div className="flex items-center gap-3">
          {!connected && (
            <Button variant="outline" onClick={connect}>
              <Lock className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          <Button onClick={() => navigate('/surveys/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Survey
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold mt-3">{stat.label === 'ZK Proofs Verified' ? '1,234' : stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Surveys</CardTitle>
            <CardDescription>Your latest surveys and their status</CardDescription>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>View All</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {recentSurveys.map(survey => {
              const statusColors: Record<string, string> = {
                Published: 'text-green-700 bg-green-50 border-green-200',
                Draft: 'text-yellow-700 bg-yellow-50 border-yellow-200',
                Closed: 'text-gray-600 bg-gray-50 border-gray-200',
              };
              return (
                <div
                  key={survey.id}
                  className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/surveys/${survey.id}`)}
                >
                  <div>
                    <p className="font-medium">{survey.title}</p>
                    <p className="text-sm text-gray-500">{survey.responses} responses</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[survey.status] ?? 'text-gray-600 bg-gray-100'}`}>
                      {survey.status}
                    </span>
                    <span className="text-sm text-gray-400">{survey.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
