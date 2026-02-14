import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  GraduationCap, 
  ArrowLeft,
  Mail,
  BookOpen,
  Target,
  Wallet,
  FileCheck,
  LogOut,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { user } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(user?.onboarding);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSave = () => {
    if (editedData) {
      dispatch({ type: 'UPDATE_PROFILE', payload: editedData });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  const getExamStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-700">In Progress</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-700">Draft</Badge>;
      case 'ready':
        return <Badge className="bg-green-100 text-green-700">Ready</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Not Started</Badge>;
    }
  };

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
                <span className="text-xl font-bold text-slate-900">My Profile</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.profile.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">{user?.profile.fullName}</h1>
                <p className="text-slate-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.profile.email}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className="bg-green-100 text-green-700">
                    Profile Complete
                  </Badge>
                  <span className="text-sm text-slate-500">
                    Member since {user?.profile.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Academic Background */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Academic Background
              </CardTitle>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Education</Label>
                    <Input 
                      value={editedData?.academic.currentEducation}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        academic: { ...prev.academic, currentEducation: e.target.value }
                      } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input 
                      value={editedData?.academic.degree}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        academic: { ...prev.academic, degree: e.target.value }
                      } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Major</Label>
                    <Input 
                      value={editedData?.academic.major}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        academic: { ...prev.academic, major: e.target.value }
                      } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input 
                      value={editedData?.academic.gpa}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        academic: { ...prev.academic, gpa: e.target.value }
                      } : prev)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Current Education</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.academic.currentEducation}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Degree</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.academic.degree}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Major</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.academic.major}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">GPA</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.academic.gpa || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Study Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Intended Degree</Label>
                    <Input 
                      value={editedData?.goals.intendedDegree}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        goals: { ...prev.goals, intendedDegree: e.target.value }
                      } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input 
                      value={editedData?.goals.fieldOfStudy}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        goals: { ...prev.goals, fieldOfStudy: e.target.value }
                      } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Intake</Label>
                    <Input 
                      value={editedData?.goals.targetIntake}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        goals: { ...prev.goals, targetIntake: e.target.value }
                      } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Countries</Label>
                    <Input 
                      value={editedData?.goals.preferredCountries.join(', ')}
                      onChange={(e) => setEditedData(prev => prev ? {
                        ...prev,
                        goals: { ...prev.goals, preferredCountries: e.target.value.split(', ') }
                      } : prev)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Intended Degree</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.goals.intendedDegree}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Field of Study</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.goals.fieldOfStudy}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Target Intake</p>
                    <p className="font-medium text-slate-900">{user?.onboarding?.goals.targetIntake}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Preferred Countries</p>
                    <div className="flex flex-wrap gap-2">
                      {user?.onboarding?.goals.preferredCountries.map(country => (
                        <Badge key={country} variant="secondary">{country}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget & Funding */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-600" />
                Budget & Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Budget Range</p>
                  <p className="font-medium text-slate-900">
                    {user?.onboarding?.budget.range === 'under-20k' && 'Under $20,000'}
                    {user?.onboarding?.budget.range === '20k-40k' && '$20,000 - $40,000'}
                    {user?.onboarding?.budget.range === '40k-60k' && '$40,000 - $60,000'}
                    {user?.onboarding?.budget.range === '60k-80k' && '$60,000 - $80,000'}
                    {user?.onboarding?.budget.range === 'above-80k' && 'Above $80,000'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Funding Plan</p>
                  <Badge className="bg-indigo-100 text-indigo-700">
                    {user?.onboarding?.budget.fundingPlan === 'self-funded' && 'Self-funded'}
                    {user?.onboarding?.budget.fundingPlan === 'scholarship-dependent' && 'Scholarship-dependent'}
                    {user?.onboarding?.budget.fundingPlan === 'loan-dependent' && 'Loan-dependent'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                Exam & Document Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-2">IELTS/TOEFL</p>
                  {getExamStatusBadge(user?.onboarding?.exams.ielts || 'not-started')}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-2">GRE/GMAT</p>
                  {getExamStatusBadge(user?.onboarding?.exams.gre || 'not-started')}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-2">Statement of Purpose</p>
                  {getExamStatusBadge(user?.onboarding?.exams.sop || 'not-started')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="fixed bottom-6 right-6 flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedData(user?.onboarding);
              }}
              className="shadow-lg"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="shadow-lg bg-gradient-to-r from-indigo-600 to-violet-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
