import React, { useState } from 'react';
import { Calendar, Users, FilePlus, Sparkles, Check, X, RefreshCw, Trash2, Clock, Volume2 } from 'lucide-react';
import { Booking, LessonLevel, LessonTopic, Material, TeacherSlot } from '../types';
import { motion } from 'motion/react';

interface TeacherDashboardProps {
  bookings: Booking[];
  slots: TeacherSlot[];
  materials: Material[];
  onUpdateBookingStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED', instructorNotes?: string) => void;
  onAddSlot: (slot: Omit<TeacherSlot, 'id' | 'isAvailable'>) => void;
  onDeleteSlot: (id: string) => void;
  onAddMaterial: (material: Omit<Material, 'id'>) => void;
}

export function TeacherDashboard({
  bookings,
  slots,
  materials,
  onUpdateBookingStatus,
  onAddSlot,
  onDeleteSlot,
  onAddMaterial
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'slots' | 'materials'>('bookings');

  // New slot details
  const [newSlotDay, setNewSlotDay] = useState<number>(1); // Mon
  const [newSlotTime, setNewSlotTime] = useState<string>('09:00');

  // New material details
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatLevel, setNewMatLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [newMatCategory, setNewMatCategory] = useState<'vocabulary' | 'grammar' | 'reading' | 'listening'>('vocabulary');
  const [newMatContent, setNewMatContent] = useState('');
  const [matSuccessMsg, setMatSuccessMsg] = useState('');

  // Class reflection/feedback state for booking updates
  const [activeFeedbackBookingId, setActiveFeedbackBookingId] = useState<string | null>(null);
  const [instructorFeedbackText, setInstructorFeedbackText] = useState('');

  const daysOfWeekNames = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSlot({
      dayOfWeek: Number(newSlotDay),
      time: newSlotTime
    });
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim() || !newMatDesc.trim() || !newMatContent.trim()) return;

    onAddMaterial({
      title: newMatTitle,
      description: newMatDesc,
      level: newMatLevel,
      category: newMatCategory,
      content: newMatContent,
      vocabularyList: [] // empty default vocab
    });

    setNewMatTitle('');
    setNewMatDesc('');
    setNewMatContent('');
    setMatSuccessMsg('Material didactic exclusivo listado com sucesso!');
    setTimeout(() => setMatSuccessMsg(''), 4000);
  };

  const openFeedbackDrawer = (bookingId: string) => {
    setActiveFeedbackBookingId(bookingId);
    setInstructorFeedbackText('');
  };

  const handleConfirmWithFeedback = (bookingId: string) => {
    onUpdateBookingStatus(bookingId, 'CONFIRMED', instructorFeedbackText || undefined);
    setActiveFeedbackBookingId(null);
    setInstructorFeedbackText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6" id="teacher-panel">
      {/* Header and Toggle of Teacher features */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
            Área Administrativa do Professor
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Gerenciador da Escola de Inglês</h2>
          <p className="text-slate-500 text-xs">Visualize matrículas, gerencie sua agenda semanal de horários e adicione materiais recomendados.</p>
        </div>

        {/* Local switcher */}
        <div className="flex bg-slate-50 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'bookings' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Aulas ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'slots' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Agenda ({slots.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'materials' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            Novo Material
          </button>
        </div>
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm">Resumo de Solicitações de Estudantes</h3>
            <span className="text-xs text-slate-400 font-medium">{bookings.filter(b => b.status === 'PENDING').length} pendente(s)</span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <p className="text-slate-500 font-semibold text-xs">Nenhum agendamento de aula registrado.</p>
              <p className="text-[10px] text-slate-400 mt-0.5">As reservas dos alunos aparecerão em tempo real aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Estudante</th>
                    <th className="py-2.5 px-3">Data / Hora</th>
                    <th className="py-2.5 px-3">Nível & Tema</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.slice().reverse().map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{booking.studentName}</div>
                        <div className="text-[10px] text-slate-400">{booking.studentEmail}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{booking.date}</div>
                        <div className="text-slate-400">{booking.time}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="block font-semibold text-slate-700">{booking.topic}</span>
                        <span className="text-[10px] text-slate-400">{booking.level}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            booking.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : booking.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-indigo-50 text-indigo-700 font-bold'
                          }`}
                        >
                          {booking.status === 'CONFIRMED'
                            ? 'CONFIRMADA'
                            : booking.status === 'CANCELLED'
                            ? 'CANCELADA'
                            : 'PENDENTE'}
                        </span>
                        {booking.notes && (
                          <div className="text-[10px] text-slate-450 mt-1 italic leading-tight max-w-[200px] line-clamp-1" title={booking.notes}>
                            Obs: "{booking.notes}"
                          </div>
                        )}
                        {booking.notes && booking.status === 'CONFIRMED' && (
                          <div className="bg-sky-50 text-sky-800 p-1.5 rounded text-[9px] mt-1">
                            <strong>Dica Aula:</strong> {booking.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-y-1">
                        {booking.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openFeedbackDrawer(booking.id)}
                              className="p-1 h-7 w-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition-all"
                              title="Confirmar aula com anotações"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onUpdateBookingStatus(booking.id, 'CANCELLED')}
                              className="p-1 h-7 w-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-all"
                              title="Recusar / Cancelar aula"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium italic text-[10px]">Sem pendências</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Feedback/Instruction Modal Sheet (Floating inside dashboard helper) */}
          {activeFeedbackBookingId && (
            <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50/40 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Adicionar Anotação ou Recomendação de Estudo
                </span>
                <button 
                  onClick={() => setActiveFeedbackBookingId(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancelar
                </button>
              </div>
              <textarea
                value={instructorFeedbackText}
                onChange={(e) => setInstructorFeedbackText(e.target.value)}
                placeholder="Ex: Leia o material 'Phrasal Verbs' antes da aula de conversação!"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleConfirmWithFeedback(activeFeedbackBookingId)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Confirmar Aula Completamente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="space-y-6">
          {/* Create custom Slot Form */}
          <form onSubmit={handleCreateSlot} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Adicionar Novo Horário Semanal de Aula
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Dia da Semana</label>
                <select
                  value={newSlotDay}
                  onChange={(e) => setNewSlotDay(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                >
                  <option value={1}>Segunda-feira</option>
                  <option value={2}>Terça-feira</option>
                  <option value={3}>Quarta-feira</option>
                  <option value={4}>Quinta-feira</option>
                  <option value={5}>Sexta-feira</option>
                  <option value={6}>Sábado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Horário da Aula</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 09:30, 14:00"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  Cadastrar vaga
                </button>
              </div>
            </div>
          </form>

          {/* List Slots */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm">Sua Grade de Horários Ativa</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">{daysOfWeekNames[slot.dayOfWeek]}</p>
                      <p className="text-slate-500 font-medium mt-0.5">{slot.time}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteSlot(slot.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50/50 transition-colors"
                    title="Excluir horário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <form onSubmit={handleCreateMaterial} className="space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Criar Guia de Estudos Didático</h3>

          {matSuccessMsg && (
            <div className="p-3 bg-indigo-50 text-indigo-800 font-bold text-xs rounded-lg border border-indigo-100 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> {matSuccessMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Título do Material</label>
              <input
                type="text"
                required
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                placeholder="Ex: Verbos auxiliares e contrações"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Descrição Curta</label>
              <input
                type="text"
                required
                value={newMatDesc}
                onChange={(e) => setNewMatDesc(e.target.value)}
                placeholder="Ex: Guia explicativo rápido sobre do/does/did"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Nível Alvo</label>
                <select
                  value={newMatLevel}
                  onChange={(e) => setNewMatLevel(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Categoria</label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                >
                  <option value="vocabulary">Vocabulário</option>
                  <option value="grammar">Gramática</option>
                  <option value="reading">Leitura</option>
                  <option value="listening">Listening</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Conteúdo Didático Integrado (Artigo/Guia Exclusivo em Markdown)</label>
            <textarea
              required
              rows={4}
              value={newMatContent}
              onChange={(e) => setNewMatContent(e.target.value)}
              placeholder="Digite a explicação pedagógica, dicas e exemplos de uso deste vocabulário para seus alunos..."
              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Publicar Material no Portal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
