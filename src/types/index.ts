export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor';
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Experience {
  title: string;
  institution: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Tutor {
  _id: string;
  userId: User | string;
  title: string;
  bio: string;
  education: Education[];
  experience: Experience[];
  subjects: string[];
  hourlyRate: number;
  teachingMode: 'online' | 'offline' | 'both';
  location: string;
  availability: Availability[];
  rating: number;
  totalReviews: number;
  totalStudents: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  tutorId: string;
  studentId: User | string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  _id: string;
  userId: string;
  tutorId: Tutor | string;
  createdAt: string;
}

export interface AIHistory {
  _id: string;
  userId: string;
  type: 'tutor_recommendation' | 'study_plan';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  createdAt: string;
}

export interface TutorRecommendation {
  tutor: Tutor;
  matchPercentage: number;
  reason: string;
  strengths: string[];
  concerns: string[];
}

export interface StudyPlan {
  dailyPlan: DailyPlan[];
  weeklyGoals: WeeklyGoal[];
  revisionPlan: RevisionPlan;
  practiceSchedule: PracticeSchedule;
  tips: string[];
}

export interface DailyPlan {
  day: number;
  date: string;
  topics: string[];
  hours: number;
  activities: string[];
  notes: string;
}

export interface WeeklyGoal {
  week: number;
  goals: string[];
  milestone: string;
}

export interface RevisionPlan {
  schedule: string[];
  techniques: string[];
}

export interface PracticeSchedule {
  weeklyTests: string[];
  finalPractice: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TutorFilters {
  search?: string;
  subject?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  teachingMode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
