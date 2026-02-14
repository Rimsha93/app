// User Profile Types
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  isOnboarded: boolean;
  createdAt: Date;
}

export interface AcademicBackground {
  currentEducation: string;
  degree: string;
  major: string;
  graduationYear: string;
  gpa?: string;
}

export interface StudyGoal {
  intendedDegree: string;
  fieldOfStudy: string;
  targetIntake: string;
  preferredCountries: string[];
}

export interface Budget {
  range: string;
  fundingPlan: 'self-funded' | 'scholarship-dependent' | 'loan-dependent';
}

export interface ExamStatus {
  ielts: 'not-started' | 'in-progress' | 'completed';
  gre: 'not-started' | 'in-progress' | 'completed';
  sop: 'not-started' | 'draft' | 'ready';
}

export interface OnboardingData {
  academic: AcademicBackground;
  goals: StudyGoal;
  budget: Budget;
  exams: ExamStatus;
}

export interface User {
  profile: UserProfile;
  onboarding: OnboardingData | null;
}

// University Types
export type UniversityCategory = 'dream' | 'target' | 'safe';
export type RiskLevel = 'low' | 'medium' | 'high';
export type CostLevel = 'low' | 'medium' | 'high';
export type AcceptanceChance = 'low' | 'medium' | 'high';

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number;
  tuitionFee: number;
  livingCost: number;
  totalCost: number;
  programs: string[];
  acceptanceRate: number;
  minGPA: number;
  requiresGRE: boolean;
  requiresIELTS: boolean;
  category: UniversityCategory;
  riskLevel: RiskLevel;
  costLevel: CostLevel;
  acceptanceChance: AcceptanceChance;
  whyFit: string;
  risks: string[];
  image: string;
}

// Stage Types
export type UserStage = 
  | 'building-profile' 
  | 'discovering-universities' 
  | 'finalizing-universities' 
  | 'preparing-applications';

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'exam' | 'document' | 'application' | 'research';
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: AIAction[];
}

export type AIActionType = 
  | 'shortlist_university' 
  | 'lock_university' 
  | 'add_task' 
  | 'update_stage';

export interface AIAction {
  type: AIActionType;
  payload: any;
  label: string;
}

// App State
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentStage: UserStage;
  shortlistedUniversities: University[];
  lockedUniversity: University | null;
  tasks: Task[];
  chatHistory: ChatMessage[];
}
