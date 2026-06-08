import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, BookOpen, Layers, CheckCircle2, User, Mail, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { Booking, LessonLevel, LessonTopic, TeacherSlot } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  slots: TeacherSlot[];
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

export function CalendarView({ slots, bookings, onAddBooking }: CalendarViewProps) {
  // Calendar dates: next 14 days
  const getNext14Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      // skip Sundays (0)
      if (nextDate.getDay() !== 0) {
        dates.push(nextDate);
      }
    }
    return dates;
  };

  const datesToBook = getNext14Days();
  const [selectedDate, setSelectedDate] = useState<Date>(datesToBook[0]);
  const [selectedSlot, setSelectedSlot] = useState<TeacherSlot | null>(null);
  
  // Form step
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form details
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<LessonTopic>(LessonTopic.CONVERSATION);
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel>(LessonLevel.BEGINNER);
  const [studentNotes, setStudentNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Get active slots for the selected date's day of week
  const getSlotsForSelectedDate = () => {
    const dayOfWeek = selectedDate.getDay();
    const dateString = selectedDate.toISOString().split('T')[0];

    // Filter slots matching day of week
    return slots.filter((slot) => {
      if (slot.dayOfWeek !== dayOfWeek || !slot.isAvailable) return false;

      // Check if already booked
      const isAlreadyBooked = bookings.some(
        (b) => b.date === dateString && b.time === slot.time && b.status !== 'CANCELLED'
      );
      return !isAlreadyBooked;
    });
  };

  const activeSlots = getSlotsForSelectedDate();

  const handleNextStep = () => {
    if (!selectedSlot) {
      setFormError('Por favor, selecione um horário para sua aula.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      setFormError('Por favor, preencha seu nome e e-mail.');
      return;
    }

    if (!selectedSlot) {
      setFormError('Sessão expirada. Por favor, re-selecione o horário.');
      setStep(1);
      return;
    }

    onAddBooking({
      studentName,
      studentEmail,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedSlot.time,
      topic: selectedTopic,
      level: selectedLevel,
      notes: studentNotes
    });

    setStep(3);
    setFormError('');
  };

  const getDayName = (date: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const getMonthName = (date: Date) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[date.getMonth()];
  };

  const formatDateLabel = (date: Date) => {
    return `${date.getDate()} de ${getMonthName(date).toLowerCase()}`;
  };

  const resetForm = () => {
    setStep(1);
    setSelectedSlot(null);
    setStudentNotes('');
    // keep name and email cached for student convenience, but reset slots
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="booking-container">
      {/* Step Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full mb-3 uppercase tracking-wider">
          {step === 1 ? 'Passo 1: Data & Hora' : step === 2 ? 'Passo 2: Seus Dados' : 'Sucesso!'}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Agende sua Próxima Aula</h2>
        <p className="text-slate-300 text-sm mt-1 max-w-md">
          {step === 1 
            ? 'Escolha a melhor data e horário para falar com um professor certificado.' 
            : step === 2 
            ? 'Complete os seus dados para customizar o conteúdo da sua aula.' 
            : 'Sua aula foi reservada com sucesso! Veja as instruções abaixo.'}
        </p>
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-datetime"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Day Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  1. Selecione o Dia da Aula:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-1">
                  {datesToBook.map((date) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <span className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-400'} font-medium`}>
                          {getDayName(date)}
                        </span>
                        <span className="text-lg font-bold mt-0.5">{date.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots Grid */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  2. Selecione o Horário Disponível para {formatDateLabel(selectedDate)}:
                </label>

                {activeSlots.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Sem horários adicionais neste dia</p>
                      <p className="text-xs text-amber-700 mt-0.5">Todos os horários para este dia já foram agendados. Por favor, escolha outra data acima.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {activeSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-4 rounded-xl border font-semibold text-sm transition-all text-center ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {formError && (
                <div className="text-rose-600 text-sm flex items-center gap-2 bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!selectedSlot}
                  className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                    selectedSlot
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continuar Agendamento
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmitBooking}
              className="space-y-6"
            >
              {/* Slot Summary Card */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-850 p-2.5 rounded-xl">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Data Agendada</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {formatDateLabel(selectedDate)} às {selectedSlot?.time}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-indigo-650 hover:text-indigo-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:shadow-xs"
                >
                  Alterar data/hora
                </button>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    E-mail de Contato *
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Ex: joao@exemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    Foco / Tema Principal da Aula
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value as LessonTopic)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {Object.values(LessonTopic).map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Seu Nível Atual Estimado
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as LessonLevel)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {Object.values(LessonLevel).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Notas para o Professor (Dúvidas ou Objetivos)
                </label>
                <textarea
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Ex: Gostaria de focar na pronúncia do Past Simple ou me preparar para uma apresentação específica da próxima semana."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {formError && (
                <div className="text-rose-600 text-sm flex items-center gap-2 bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 cursor-pointer transition-colors"
                >
                  Confirmar Agendamento de Aula
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 px-4"
            >
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">Aula Agendada com Sucesso!</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
                Nós enviamos um e-mail de confirmação para <strong className="text-slate-800">{studentEmail}</strong> com o link de acesso da videochamada (Google Meet).
              </p>

              <div className="max-w-md bg-slate-50 rounded-xl border border-slate-100 p-5 mx-auto mt-6 text-left space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-200/60 pb-2">Resumo da Reserva</h4>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Aluno:</span>
                  <span className="text-slate-800 font-semibold">{studentName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Data & Hora:</span>
                  <span className="text-slate-800 font-semibold">
                    {formatDateLabel(selectedDate)} às {selectedSlot?.time}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Tema da Aula:</span>
                  <span className="text-slate-800 font-semibold">{selectedTopic}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Nível Indicado:</span>
                  <span className="text-slate-800 font-semibold">{selectedLevel}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl tracking-wide transition-colors"
                >
                  Novo Agendamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
