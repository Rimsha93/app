import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { 
  User, 
  OnboardingData, 
  University, 
  Task, 
  ChatMessage, 
  UserStage,
  AIAction 
} from '@/types';
import { universities } from '@/data/universities';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentStage: UserStage;
  shortlistedUniversities: University[];
  lockedUniversity: University | null;
  tasks: Task[];
  chatHistory: ChatMessage[];
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'COMPLETE_ONBOARDING'; payload: OnboardingData }
  | { type: 'UPDATE_STAGE'; payload: UserStage }
  | { type: 'SHORTLIST_UNIVERSITY'; payload: University }
  | { type: 'REMOVE_SHORTLIST'; payload: string }
  | { type: 'LOCK_UNIVERSITY'; payload: University }
  | { type: 'UNLOCK_UNIVERSITY' }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_PROFILE'; payload: Partial<OnboardingData> }
  | { type: 'EXECUTE_AI_ACTION'; payload: AIAction };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentStage: 'building-profile',
  shortlistedUniversities: [],
  lockedUniversity: null,
  tasks: [],
  chatHistory: [
    {
      id: 'welcome',
      role: 'ai',
      content: "Hello! I'm your AI Counsellor. I'll help you navigate your study abroad journey. Let's start by completing your profile so I can provide personalized recommendations.",
      timestamp: new Date()
    }
  ]
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentStage: action.payload.onboarding ? 'discovering-universities' : 'building-profile'
      };

    case 'LOGOUT':
      return initialState;

    case 'COMPLETE_ONBOARDING':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          onboarding: action.payload,
          profile: {
            ...state.user.profile,
            isOnboarded: true
          }
        },
        currentStage: 'discovering-universities',
        tasks: generateInitialTasks(action.payload)
      };

    case 'UPDATE_STAGE':
      return {
        ...state,
        currentStage: action.payload
      };

    case 'SHORTLIST_UNIVERSITY':
      if (state.shortlistedUniversities.find(u => u.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        shortlistedUniversities: [...state.shortlistedUniversities, action.payload],
        currentStage: state.currentStage === 'discovering-universities' 
          ? 'finalizing-universities' 
          : state.currentStage
      };

    case 'REMOVE_SHORTLIST':
      return {
        ...state,
        shortlistedUniversities: state.shortlistedUniversities.filter(u => u.id !== action.payload)
      };

    case 'LOCK_UNIVERSITY':
      return {
        ...state,
        lockedUniversity: action.payload,
        currentStage: 'preparing-applications',
        tasks: [...state.tasks, ...generateApplicationTasks(action.payload)]
      };

    case 'UNLOCK_UNIVERSITY':
      return {
        ...state,
        lockedUniversity: null,
        currentStage: 'finalizing-universities'
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };

    case 'UPDATE_PROFILE':
      if (!state.user?.onboarding) return state;
      return {
        ...state,
        user: {
          ...state.user,
          onboarding: {
            ...state.user.onboarding,
            ...action.payload
          }
        }
      };

    case 'EXECUTE_AI_ACTION':
      return handleAIAction(state, action.payload);

    default:
      return state;
  }
}

function handleAIAction(state: AppState, action: AIAction): AppState {
  switch (action.type) {
    case 'shortlist_university':
      const uni = universities.find(u => u.id === action.payload.universityId);
      if (uni && !state.shortlistedUniversities.find(u => u.id === uni.id)) {
        return {
          ...state,
          shortlistedUniversities: [...state.shortlistedUniversities, uni],
          currentStage: state.currentStage === 'discovering-universities' 
            ? 'finalizing-universities' 
            : state.currentStage
        };
      }
      return state;

    case 'lock_university':
      const lockUni = state.shortlistedUniversities.find(u => u.id === action.payload.universityId);
      if (lockUni) {
        return {
          ...state,
          lockedUniversity: lockUni,
          currentStage: 'preparing-applications',
          tasks: [...state.tasks, ...generateApplicationTasks(lockUni)]
        };
      }
      return state;

    case 'add_task':
      return {
        ...state,
        tasks: [...state.tasks, action.payload.task]
      };

    case 'update_stage':
      return {
        ...state,
        currentStage: action.payload.stage
      };

    default:
      return state;
  }
}

function generateInitialTasks(onboarding: OnboardingData): Task[] {
  const tasks: Task[] = [];
  
  if (onboarding.exams.ielts === 'not-started') {
    tasks.push({
      id: 'task-ielts-1',
      title: 'Register for IELTS/TOEFL',
      description: 'Book your English proficiency test date',
      category: 'exam',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    });
  }
  
  if (onboarding.exams.gre === 'not-started' && onboarding.goals.intendedDegree !== 'Bachelor\'s') {
    tasks.push({
      id: 'task-gre-1',
      title: 'Start GRE/GMAT Preparation',
      description: 'Begin studying for your standardized test',
      category: 'exam',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    });
  }
  
  if (onboarding.exams.sop === 'not-started') {
    tasks.push({
      id: 'task-sop-1',
      title: 'Draft Statement of Purpose',
      description: 'Start working on your SOP outline',
      category: 'document',
      completed: false,
      priority: 'medium',
      createdAt: new Date()
    });
  }
  
  tasks.push({
    id: 'task-research-1',
    title: 'Research Universities',
    description: 'Explore universities matching your profile',
    category: 'research',
    completed: false,
    priority: 'high',
    createdAt: new Date()
  });
  
  return tasks;
}

function generateApplicationTasks(university: University): Task[] {
  return [
    {
      id: `task-app-${university.id}-1`,
      title: `Complete ${university.name} Application`,
      description: 'Fill out the online application form',
      category: 'application',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: `task-app-${university.id}-2`,
      title: 'Request Transcripts',
      description: 'Order official transcripts from your institution',
      category: 'document',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: `task-app-${university.id}-3`,
      title: 'Get Recommendation Letters',
      description: 'Contact professors for LORs',
      category: 'document',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: `task-app-${university.id}-4`,
      title: 'Finalize SOP',
      description: `Tailor your SOP for ${university.name}`,
      category: 'document',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    }
  ];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
