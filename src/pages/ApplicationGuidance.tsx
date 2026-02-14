import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap, 
  ArrowLeft,
  Lock,
  CheckCircle2,
  Circle,
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  BookOpen,
  Award,
  Send,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function ApplicationGuidance() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { lockedUniversity, tasks } = state;
  const [activeTab, setActiveTab] = useState<'tasks' | 'documents' | 'timeline'>('tasks');

  const applicationTasks = tasks.filter(t => 
    lockedUniversity && t.id.includes(`task-app-${lockedUniversity.id}`)
  );
  
  const otherTasks = tasks.filter(t => 
    !lockedUniversity || !t.id.includes(`task-app-${lockedUniversity.id}`)
  );

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleToggleTask = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      if (!task.completed) {
        toast.success('Task completed! Great job!');
      }
    }
  };

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'exam': return BookOpen;
      case 'document': return FileText;
      case 'application': return Send;
      case 'research': return Award;
      default: return CheckCircle2;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const documents = [
    { name: 'Transcripts', status: 'required', description: 'Official academic transcripts from all institutions' },
    { name: 'Statement of Purpose', status: 'required', description: 'Personal essay explaining your goals' },
    { name: 'Recommendation Letters', status: 'required', description: '2-3 letters from professors/employers' },
    { name: 'Resume/CV', status: 'required', description: 'Updated academic and professional resume' },
    { name: 'English Test Scores', status: 'required', description: 'IELTS/TOEFL score report' },
    { name: 'GRE/GMAT Scores', status: 'conditional', description: 'Required for most MS/MBA programs' },
    { name: 'Financial Documents', status: 'required', description: 'Bank statements, scholarship letters' },
    { name: 'Passport Copy', status: 'required', description: 'Valid passport copy' }
  ];

  const timeline = [
    { month: 'Month 1-2', tasks: ['Research universities', 'Take standardized tests', 'Start SOP draft'], status: 'completed' },
    { month: 'Month 3-4', tasks: ['Finalize university list', 'Request transcripts', 'Contact recommenders'], status: 'in-progress' },
    { month: 'Month 5-6', tasks: ['Submit applications', 'Follow up on LORs', 'Prepare for interviews'], status: 'pending' },
    { month: 'Month 7+', tasks: ['Receive decisions', 'Apply for visa', 'Plan relocation'], status: 'pending' }
  ];

  if (!lockedUniversity) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">Application Guidance</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Application Guidance Locked
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            You need to lock a university before accessing application guidance. 
            Visit the Universities page to shortlist and lock your choice.
          </p>
          <Button 
            onClick={() => navigate('/universities')}
            className="bg-gradient-to-r from-indigo-600 to-violet-600"
          >
            Explore Universities
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Application Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Locked University Header */}
        <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">LOCKED</Badge>
                  <span className="text-sm text-green-600">Application in progress</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{lockedUniversity.name}</h1>
                <p className="text-slate-600">{lockedUniversity.country} • {lockedUniversity.programs[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Application Progress</h2>
                <p className="text-slate-600">Keep track of your application tasks</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">{Math.round(progress)}%</p>
                <p className="text-sm text-slate-500">{completedTasks}/{totalTasks} tasks</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'tasks' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tasks')}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Tasks
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'default' : 'outline'}
            onClick={() => setActiveTab('documents')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Documents
          </Button>
          <Button
            variant={activeTab === 'timeline' ? 'default' : 'outline'}
            onClick={() => setActiveTab('timeline')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Timeline
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Application Tasks */}
            {applicationTasks.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="w-5 h-5 text-indigo-600" />
                    Application Tasks for {lockedUniversity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applicationTasks.map(task => {
                      const Icon = getTaskIcon(task.category);
                      return (
                        <div 
                          key={task.id}
                          className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                            task.completed ? 'bg-green-50' : 'bg-slate-50'
                          }`}
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-4 h-4 ${task.completed ? 'text-green-600' : 'text-slate-500'}`} />
                              <span className={`font-medium ${task.completed ? 'line-through text-green-700' : 'text-slate-900'}`}>
                                {task.title}
                              </span>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className={`text-sm ${task.completed ? 'text-green-600' : 'text-slate-600'}`}>
                              {task.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* General Tasks */}
            {otherTasks.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    General Preparation Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {otherTasks.map(task => {
                      const Icon = getTaskIcon(task.category);
                      return (
                        <div 
                          key={task.id}
                          className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                            task.completed ? 'bg-green-50' : 'bg-slate-50'
                          }`}
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-4 h-4 ${task.completed ? 'text-green-600' : 'text-slate-500'}`} />
                              <span className={`font-medium ${task.completed ? 'line-through text-green-700' : 'text-slate-900'}`}>
                                {task.title}
                              </span>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className={`text-sm ${task.completed ? 'text-green-600' : 'text-slate-600'}`}>
                              {task.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map((doc, i) => (
                  <div 
                    key={i}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.status === 'required' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        {doc.status === 'required' ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">{doc.name}</h3>
                          <Badge className={doc.status === 'required' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{doc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'timeline' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((period, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        period.status === 'completed' ? 'bg-green-500' :
                        period.status === 'in-progress' ? 'bg-indigo-600' :
                        'bg-slate-200'
                      }`}>
                        {period.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : period.status === 'in-progress' ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 my-2 ${
                          period.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className={`font-semibold ${
                        period.status === 'completed' ? 'text-green-700' :
                        period.status === 'in-progress' ? 'text-indigo-700' :
                        'text-slate-600'
                      }`}>
                        {period.month}
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {period.tasks.map((task, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className={`w-4 h-4 ${
                              period.status === 'completed' ? 'text-green-500' :
                              period.status === 'in-progress' && j === 0 ? 'text-indigo-500' :
                              'text-slate-300'
                            }`} />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
