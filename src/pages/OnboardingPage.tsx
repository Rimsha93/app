import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Wallet, 
  FileCheck, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { OnboardingData } from '@/types';
import { toast } from 'sonner';

const steps = [
  { id: 'academic', title: 'Academic Background', icon: BookOpen },
  { id: 'goals', title: 'Study Goals', icon: Target },
  { id: 'budget', title: 'Budget', icon: Wallet },
  { id: 'exams', title: 'Exam Readiness', icon: FileCheck }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    academic: {
      currentEducation: '',
      degree: '',
      major: '',
      graduationYear: '',
      gpa: ''
    },
    goals: {
      intendedDegree: '',
      fieldOfStudy: '',
      targetIntake: '',
      preferredCountries: []
    },
    budget: {
      range: '',
      fundingPlan: 'self-funded'
    },
    exams: {
      ielts: 'not-started',
      gre: 'not-started',
      sop: 'not-started'
    }
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: formData });
      toast.success('Profile completed! Welcome to AI Counsellor.');
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1500);
  };

  const updateFormData = (section: keyof OnboardingData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Academic
        return formData.academic.currentEducation && 
               formData.academic.degree && 
               formData.academic.major && 
               formData.academic.graduationYear;
      case 1: // Goals
        return formData.goals.intendedDegree && 
               formData.goals.fieldOfStudy && 
               formData.goals.targetIntake && 
               formData.goals.preferredCountries.length > 0;
      case 2: // Budget
        return formData.budget.range && formData.budget.fundingPlan;
      case 3: // Exams
        return true; // All have defaults
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Education Level *</Label>
              <select
                className="w-full h-12 px-3 border rounded-lg bg-white"
                value={formData.academic.currentEducation}
                onChange={(e) => updateFormData('academic', 'currentEducation', e.target.value)}
              >
                <option value="">Select education level</option>
                <option value="high-school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Current/Most Recent Degree *</Label>
              <Input
                placeholder="e.g., Bachelor of Science"
                value={formData.academic.degree}
                onChange={(e) => updateFormData('academic', 'degree', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Major/Field of Study *</Label>
              <Input
                placeholder="e.g., Computer Science"
                value={formData.academic.major}
                onChange={(e) => updateFormData('academic', 'major', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Graduation Year *</Label>
                <select
                  className="w-full h-12 px-3 border rounded-lg bg-white"
                  value={formData.academic.graduationYear}
                  onChange={(e) => updateFormData('academic', 'graduationYear', e.target.value)}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 10 }, (_, i) => 2020 + i).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>GPA/Percentage (Optional)</Label>
                <Input
                  placeholder="e.g., 3.5 or 85%"
                  value={formData.academic.gpa}
                  onChange={(e) => updateFormData('academic', 'gpa', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Intended Degree *</Label>
              <select
                className="w-full h-12 px-3 border rounded-lg bg-white"
                value={formData.goals.intendedDegree}
                onChange={(e) => updateFormData('goals', 'intendedDegree', e.target.value)}
              >
                <option value="">Select degree</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="MBA">MBA</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Field of Study *</Label>
              <Input
                placeholder="e.g., Data Science"
                value={formData.goals.fieldOfStudy}
                onChange={(e) => updateFormData('goals', 'fieldOfStudy', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Intake *</Label>
              <select
                className="w-full h-12 px-3 border rounded-lg bg-white"
                value={formData.goals.targetIntake}
                onChange={(e) => updateFormData('goals', 'targetIntake', e.target.value)}
              >
                <option value="">Select intake</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Countries *</Label>
              <div className="grid grid-cols-2 gap-2">
                {['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Netherlands'].map(country => (
                  <label 
                    key={country} 
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.goals.preferredCountries.includes(country) 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.preferredCountries.includes(country)}
                      onChange={(e) => {
                        const countries = e.target.checked
                          ? [...formData.goals.preferredCountries, country]
                          : formData.goals.preferredCountries.filter(c => c !== country);
                        updateFormData('goals', 'preferredCountries', countries);
                      }}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Budget Range (per year) *</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'under-20k', label: 'Under $20,000', desc: 'Budget-friendly options' },
                  { value: '20k-40k', label: '$20,000 - $40,000', desc: 'Moderate budget' },
                  { value: '40k-60k', label: '$40,000 - $60,000', desc: 'Comfortable budget' },
                  { value: '60k-80k', label: '$60,000 - $80,000', desc: 'Higher budget' },
                  { value: 'above-80k', label: 'Above $80,000', desc: 'Premium options' }
                ].map(option => (
                  <label 
                    key={option.value}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.budget.range === option.value 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="budget"
                        value={option.value}
                        checked={formData.budget.range === option.value}
                        onChange={(e) => updateFormData('budget', 'range', e.target.value)}
                        className="rounded-full border-slate-300"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{option.label}</p>
                        <p className="text-sm text-slate-500">{option.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Funding Plan *</Label>
              <select
                className="w-full h-12 px-3 border rounded-lg bg-white"
                value={formData.budget.fundingPlan}
                onChange={(e) => updateFormData('budget', 'fundingPlan', e.target.value)}
              >
                <option value="self-funded">Self-funded</option>
                <option value="scholarship-dependent">Scholarship-dependent</option>
                <option value="loan-dependent">Loan-dependent</option>
              </select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>IELTS/TOEFL Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'not-started', label: 'Not Started' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' }
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateFormData('exams', 'ielts', status.value)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      formData.exams.ielts === status.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>GRE/GMAT Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'not-started', label: 'Not Started' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' }
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateFormData('exams', 'gre', status.value)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      formData.exams.gre === status.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Statement of Purpose (SOP) Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'not-started', label: 'Not Started' },
                  { value: 'draft', label: 'Draft Ready' },
                  { value: 'ready', label: 'Final Ready' }
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateFormData('exams', 'sop', status.value)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      formData.exams.sop === status.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Counsellor
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-200'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>
              Help us understand you better to provide personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Complete Profile
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
