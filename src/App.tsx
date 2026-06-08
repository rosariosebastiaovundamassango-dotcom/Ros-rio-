import React, { useState, useEffect } from 'react';
import { UserRole, Booking, TeacherSlot, Material, StudyActivity, LessonTopic, LessonLevel } from './types';
import { initialMaterials, initialFlashcards, initialQuizzes, defaultSlots } from './data/materialsData';
import { CalendarView } from './components/CalendarView';
import { MaterialsView } from './components/MaterialsView';
import { QuizSection } from './components/QuizSection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { DashboardStats } from './components/DashboardStats';
import { BookOpen, Calendar, User, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Mode selection
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.STUDENT);

  // Core schedules and active states
  const [slots, setSlots] = useState<TeacherSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activities, setActivities] = useState<StudyActivity[]>([]);

  // Selection tab inside STUDENT view
  const [studentTab, setStudentTab] = useState<'dashboard' | 'book' | 'materials' | 'quizzes'>('dashboard');

  // Load persistence logic
  useEffect(() => {
    const cachedSlots = localStorage.getItem('school_slots');
    if (cachedSlots) {
      setSlots(JSON.parse(cachedSlots));
    } else {
      setSlots(defaultSlots);
      localStorage.setItem('school_slots', JSON.stringify(defaultSlots));
    }

    const cachedBookings = localStorage.getItem('school_bookings');
    if (cachedBookings) {
      setBookings(JSON.parse(cachedBookings));
    } else {
      // Starting mockup student booking for immersion
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startingBooking: Booking = {
        id: 'book_start_1',
        studentName: 'Rosário Vunda', // localized
        studentEmail: 'rosariosebastiaovundamassango@gmail.com',
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        topic: LessonTopic.CONVERSATION,
        level: LessonLevel.INTERMEDIATE,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        notes: 'Gostaria de expandir jargões técnicos para reuniões executivas.'
      };
      setBookings([startingBooking]);
      localStorage.setItem('school_bookings', JSON.stringify([startingBooking]));
    }

    const cachedMaterials = localStorage.getItem('school_materials');
    if (cachedMaterials) {
      setMaterials(JSON.parse(cachedMaterials));
    } else {
      setMaterials(initialMaterials);
      localStorage.setItem('school_materials', JSON.stringify(initialMaterials));
    }

    const cachedActivities = localStorage.getItem('school_activities');
    if (cachedActivities) {
      setActivities(JSON.parse(cachedActivities));
    } else {
      const startingActivity: StudyActivity = {
        id: 'act_1',
        type: 'booking',
        title: 'Mentoria Experimental Concluída',
        date: '2026-06-06'
      };
      setActivities([startingActivity]);
      localStorage.setItem('school_activities', JSON.stringify([startingActivity]));
    }
  }, []);

  // Update storage safely
  const updateCachedState = (key: string, value: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
    setter(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Add booking flow
  const handleAddBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `book_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    updateCachedState('school_bookings', updatedBookings, setBookings);

    // Append as study activity block
    const newActivity: StudyActivity = {
      id: `act_${Date.now()}`,
      type: 'booking',
      title: `Aula de ${newBookingData.topic} Reservada`,
      date: newBookingData.date
    };
    updateCachedState('school_activities', [...activities, newActivity], setActivities);
  };

  // Update Booking Status from teacher cockpit
  const handleUpdateBookingStatus = (id: string, status: 'CONFIRMED' | 'CANCELLED', instructorNotes?: string) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === id) {
        return { 
          ...b, 
          status, 
          notes: instructorNotes !== undefined ? instructorNotes : b.notes 
        };
      }
      return b;
    });
    updateCachedState('school_bookings', updatedBookings, setBookings);
  };

  // Cancel Booking from student side
  const handleCancelBookingByStudent = (id: string) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === id) {
        return { ...b, status: 'CANCELLED' as const };
      }
      return b;
    });
    updateCachedState('school_bookings', updatedBookings, setBookings);
  };

  // Add Slots
  const handleAddSlot = (newSlot: Omit<TeacherSlot, 'id' | 'isAvailable'>) => {
    const slotToAdd: TeacherSlot = {
      ...newSlot,
      id: `slot_${Date.now()}`,
      isAvailable: true
    };
    updateCachedState('school_slots', [...slots, slotToAdd], setSlots);
  };

  // Delete Slot
  const handleDeleteSlot = (id: string) => {
    const updatedSlots = slots.filter((s) => s.id !== id);
    updateCachedState('school_slots', updatedSlots, setSlots);
  };

  // Add New Materials
  const handleAddMaterial = (newMatData: Omit<Material, 'id'>) => {
    const materialToAdd: Material = {
      ...newMatData,
      id: `mat_${Date.now()}`
    };
    updateCachedState('school_materials', [...materials, materialToAdd], setMaterials);
  };

  // Save Quiz result logs
  const handleQuizComplete = (quizTitle: string, score: string) => {
    const newActivity: StudyActivity = {
      id: `act_${Date.now()}`,
      type: 'quiz',
      title: `Desafio: ${quizTitle}`,
      date: new Date().toISOString().split('T')[0],
      score
    };
    updateCachedState('school_activities', [...activities, newActivity], setActivities);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans antialiased text-slate-800 pb-12" id="app-root">
      {/* Dynamic Sub-header Navigation with visual accents */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xxs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo and Brand Title */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                English Gateway Portal
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                Aulas Particulares de Inglês & Coaching
              </p>
            </div>
          </div>

          {/* Role selector and state tools */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
              Navegar Como:
            </span>
            <div className="bg-slate-100 p-1 rounded-xl flex">
              <button
                onClick={() => setCurrentRole(UserRole.STUDENT)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === UserRole.STUDENT
                    ? 'bg-white shadow-xs text-emerald-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3 h-3" />
                Estudante
              </button>
              <button
                onClick={() => setCurrentRole(UserRole.TEACHER)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === UserRole.TEACHER
                    ? 'bg-white shadow-xs text-indigo-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Professor
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Welcome banner */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="relative overflow-hidden bg-emerald-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2 md:max-w-2xl relative z-10 text-center md:text-left">
            <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full uppercase tracking-wider">
              100% de Conversação e Prática Ativa
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
              Seu portal interativo para falar Inglês fluente.
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl font-medium">
              Agende aulas sob medida direto com o professor, teste sua gramática através de desafios interativos estruturados e acesse o guia de estudos exclusivo.
            </p>
          </div>

          {/* Quick Stats overview or launcher */}
          <div className="flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0 w-full md:w-auto md:min-w-[180px]">
            <span className="text-xxs uppercase tracking-widest text-emerald-300 font-extrabold">Seu Nível Estimado</span>
            <span className="text-2xl font-black text-white mt-1">Intermediário</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Baseado nos materiais de hoje</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {currentRole === UserRole.STUDENT ? (
            <motion.div
              key="student-space"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Student Navigation Control */}
              <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-xxs max-w-lg">
                <button
                  onClick={() => setStudentTab('dashboard')}
                  className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
                    studentTab === 'dashboard'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Progresso & Histórico
                </button>
                <button
                  onClick={() => setStudentTab('book')}
                  className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
                    studentTab === 'book'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Agendar Aula
                </button>
                <button
                  onClick={() => setStudentTab('materials')}
                  className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
                    studentTab === 'materials'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Materiais Didáticos
                </button>
                <button
                  onClick={() => setStudentTab('quizzes')}
                  className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
                    studentTab === 'quizzes'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Testes Rápidos
                </button>
              </div>

              {/* Active Tab Screen */}
              <div className="space-y-6">
                {studentTab === 'dashboard' && (
                  <DashboardStats
                    bookings={bookings}
                    activities={activities}
                    onCancelBooking={handleCancelBookingByStudent}
                  />
                )}
                {studentTab === 'book' && (
                  <CalendarView
                    slots={slots}
                    bookings={bookings}
                    onAddBooking={handleAddBooking}
                  />
                )}
                {studentTab === 'materials' && (
                  <MaterialsView
                    materials={materials}
                    flashcards={initialFlashcards}
                  />
                )}
                {studentTab === 'quizzes' && (
                  <QuizSection
                    quizzes={initialQuizzes}
                    onQuizComplete={handleQuizComplete}
                  />
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="teacher-space"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <TeacherDashboard
                bookings={bookings}
                slots={slots}
                materials={materials}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onAddSlot={handleAddSlot}
                onDeleteSlot={handleDeleteSlot}
                onAddMaterial={handleAddMaterial}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
