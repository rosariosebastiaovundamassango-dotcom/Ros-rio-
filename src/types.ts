export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export enum LessonLevel {
  BEGINNER = 'Iniciante (A1-A2)',
  INTERMEDIATE = 'Intermediário (B1-B2)',
  ADVANCED = 'Avançado (C1-C2)'
}

export enum LessonTopic {
  CONVERSATION = 'Conversação Livre',
  BUSINESS = 'Inglês para Negócios',
  GRAMMAR = 'Gramática & Vocabulário',
  EXAM_PREP = 'Preparação para Exames (TOEFL/IELTS)',
  INTERVIEW_PREP = 'Preparação para Entrevistas'
}

export interface TeacherSlot {
  id: string;
  dayOfWeek: number; // 0 for Sunday, 1-6 for Mon-Sat
  time: string; // e.g. "09:00", "14:30"
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  topic: LessonTopic;
  level: LessonLevel;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  category: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  downloadUrl?: string;
  content?: string;
  vocabularyList?: { term: string; definition: string; example: string }[];
}

export interface Flashcard {
  id: string;
  front: string; // English
  back: string; // Portuguese
  exampleFront: string;
  exampleBack: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: string;
  questions: QuizQuestion[];
}

export interface StudyActivity {
  id: string;
  type: 'booking' | 'quiz' | 'material';
  title: string;
  date: string;
  score?: string; // for quizzes
}
