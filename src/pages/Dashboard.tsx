import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Brain, 
  MapPin, 
  Wallet, 
  Calendar,
  ChevronRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  School,
  FileText,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { UserStage } from '@/types';

const stages: { id: UserStage; label: string; description: string }[] = [
  { id: 'building-profile', label: 'Building Profile', description: 'Complete your profile' },
  { id: 'discovering-universities', label: 'Discovering Universities', description: 'Explore options' },
  { id: 'finalizing-universities', label: 'Finalizing Universities', description: 'Shortlist & lock' },
  { id: 'preparing-applications', label: 'Preparing Applications', description: 'Apply to universities' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { user, currentStage, shortlistedUniversities, lockedUniversity, tasks } = state;

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getProfileStrength = () => {
    let strength = 0;
    if (user?.onboarding?.academic) strength += 25;
    if (user?.onboarding?.goals) strength += 25;
    if (user?.onboarding?.budget) strength += 25;
    if (user?.onboarding?.exams) strength += 25;
    return strength;
  };

  const getExamStatus = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'Completed', color: 'bg-green-100 text-green-700' };
      case 'in-progress': return { label: 'In Progress', color: 'bg-amber-100 text-amber-700' };
      default: return { label: 'Not Started', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI Counsellor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/counsellor')}
                className="hidden sm:flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                AI Counsellor
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/universities')}
                className="hidden sm:flex items-center gap-2"
              >
                <School className="w-4 h-4" />
                Universities
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/application')}
                className="hidden sm:flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Application
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-700">
                    {user?.profile.fullName.charAt(0)}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.profile.fullName.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 mt-1">
            Here's your personalized study abroad dashboard
          </p>
        </div>

        {/* Stage Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-indigo-100 text-sm">Current Stage</p>
                <h2 className="text-2xl font-bold">
                  {stages.find(s => s.id === currentStage)?.label}
                </h2>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex-1 flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index <= currentStageIndex 
                        ? 'bg-white text-indigo-600' 
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {index < currentStageIndex ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < stages.length - 1 && (
                    <div 
                      className={`flex-1 h-1 rounded ${
                        index < currentStageIndex ? 'bg-white' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Profile Summary
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <School className="w-4 h-4" />
                      <span className="text-sm">Education</span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {user?.onboarding?.academic.degree}
                    </p>
                    <p className="text-sm text-slate-600">
                      {user?.onboarding?.academic.major}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Goal</span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {user?.onboarding?.goals.intendedDegree}
                    </p>
                    <p className="text-sm text-slate-600">
                      {user?.onboarding?.goals.fieldOfStudy}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Target Countries</span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {user?.onboarding?.goals.preferredCountries.join(', ')}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Target Intake</span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {user?.onboarding?.goals.targetIntake}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Strength */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Overall Strength</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {getProfileStrength()}%
                    </span>
                  </div>
                  <Progress value={getProfileStrength()} className="h-3" />
                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Academics</p>
                      <Badge className={user?.onboarding?.academic.gpa ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {user?.onboarding?.academic.gpa ? 'Strong' : 'Average'}
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Exams</p>
                      <Badge className={
                        user?.onboarding?.exams.ielts === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : user?.onboarding?.exams.ielts === 'in-progress'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }>
                        {getExamStatus(user?.onboarding?.exams.ielts || 'not-started').label}
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">SOP</p>
                      <Badge className={
                        user?.onboarding?.exams.sop === 'ready' 
                          ? 'bg-green-100 text-green-700' 
                          : user?.onboarding?.exams.sop === 'draft'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }>
                        {user?.onboarding?.exams.sop === 'ready' 
                          ? 'Ready' 
                          : user?.onboarding?.exams.sop === 'draft'
                            ? 'Draft'
                            : 'Not Started'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* University Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <School className="w-5 h-5 text-indigo-600" />
                  University Status
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/universities')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {lockedUniversity ? (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-medium">University Locked</p>
                        <h3 className="text-xl font-bold text-slate-900">{lockedUniversity.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lockedUniversity.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="w-4 h-4" />
                        ${(lockedUniversity.totalCost / 1000).toFixed(0)}k/year
                      </span>
                    </div>
                    <Button 
                      className="mt-4 w-full bg-green-600 hover:bg-green-700"
                      onClick={() => navigate('/application')}
                    >
                      View Application Tasks
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : shortlistedUniversities.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-slate-600">
                      You have {shortlistedUniversities.length} universities shortlisted. 
                      Lock one to unlock application guidance.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {shortlistedUniversities.slice(0, 3).map(uni => (
                        <div key={uni.id} className="p-4 bg-slate-50 rounded-xl">
                          <p className="font-medium text-slate-900 truncate">{uni.name}</p>
                          <Badge className={`mt-2 ${
                            uni.category === 'dream' ? 'bg-purple-100 text-purple-700' :
                            uni.category === 'target' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {uni.category.charAt(0).toUpperCase() + uni.category.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/universities')}
                    >
                      Lock a University
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <School className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      No universities shortlisted yet. Let our AI Counsellor help you find the best matches.
                    </p>
                    <Button 
                      onClick={() => navigate('/counsellor')}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Get AI Recommendations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/counsellor')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Chat with AI Counsellor
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/universities')}
                >
                  <School className="w-4 h-4 mr-2" />
                  Explore Universities
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/application')}
                  disabled={!lockedUniversity}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Application Guidance
                </Button>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  Your Tasks
                </CardTitle>
                <span className="text-sm text-slate-500">
                  {completedTasks}/{totalTasks}
                </span>
              </CardHeader>
              <CardContent>
                <Progress value={taskProgress} className="h-2 mb-4" />
                <div className="space-y-3">
                  {tasks.slice(0, 5).map(task => (
                    <div 
                      key={task.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        task.completed ? 'bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          task.completed ? 'text-green-700 line-through' : 'text-slate-900'
                        }`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">{task.category}</p>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-center text-slate-500 py-4">
                      No tasks yet. Complete onboarding to get started!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Counsellor Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Need Help?</h3>
                    <p className="text-sm text-indigo-100">Chat with your AI Counsellor</p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50"
                  onClick={() => navigate('/counsellor')}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
