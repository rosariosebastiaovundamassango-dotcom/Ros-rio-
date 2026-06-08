import React from 'react';
import { Calendar, Award, BookOpen, Clock, Video, CheckCircle, ExternalLink, CalendarDays, AlertTriangle } from 'lucide-react';
import { Booking, StudyActivity } from '../types';

interface DashboardStatsProps {
  bookings: Booking[];
  activities: StudyActivity[];
  onCancelBooking: (id: string) => void;
}

export function DashboardStats({ bookings, activities, onCancelBooking }: DashboardStatsProps) {
  // Compute metrics
  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const finishedBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length; // simulated hours
  const quizActivities = activities.filter((a) => a.type === 'quiz');

  const stats = [
    { label: 'Aulas Agendadas', value: activeBookings.length, icon: Calendar, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Aulas Concluídas', value: finishedBookingsCount, icon: Clock, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Testes Concluídos', value: quizActivities.length, icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Materiais Consultados', value: activities.filter((a) => a.type === 'material').length, icon: BookOpen, color: 'text-sky-600 bg-sky-50 border-sky-100' },
  ];

  const handleLaunchMeet = () => {
    alert('Simulação de Videochamada: Conectando com o professor no Google Meet para sua aula exclusiva de inglês!');
  };

  return (
    <div className="space-y-6" id="stats-container">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-150 shadow-xxs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xxs font-extrabold uppercase tracking-widest text-slate-400 block">{stat.label}</span>
              <div className={`p-2 rounded-lg border ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Next Lessons */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-150 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              Suas Próximas Aulas
            </h3>
            <span className="text-xxs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Link Ativo
            </span>
          </div>

          {activeBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-semibold">
              <p>Nenhuma aula agendada para os próximos dias.</p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Vá na guia "Agendar Aula" para escolher sua vaga.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        booking.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-105 text-slate-600 bg-slate-100'
                      }`}
                    >
                      {booking.status === 'CONFIRMED' ? 'Confirmada' : 'Aguardando Professor'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs">
                      {booking.topic} <span className="font-medium text-slate-400 text-[11px]">({booking.level})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      Dia: <strong className="text-slate-700">{booking.date}</strong> às <strong className="text-indigo-700">{booking.time}</strong>
                    </p>

                    {booking.notes && (
                      <div className="p-2 bg-indigo-50/50 text-[10px] text-indigo-900 rounded border border-indigo-100 mt-2 max-w-sm">
                        💬 <strong>Anotações do Professor:</strong> "{booking.notes}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={handleLaunchMeet}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xxs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Video className="w-3 h-3" />
                        Sala de Aula
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="py-1.5 px-2.5 border border-slate-200 text-slate-500 hover:text-rose-600 font-bold text-xxs rounded-lg transition-colors bg-white hover:bg-rose-50/30"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-150 p-5 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            Histórico Recente
          </h3>

          {activities.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold">
              Nenhuma atividade registrada no portal ainda.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activities.slice().reverse().map((activity) => (
                <div key={activity.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {activity.type === 'booking' ? 'Aula Reservada' : activity.type === 'quiz' ? 'Teste Prático' : 'Download Estudo'}
                    </span>
                    <p className="font-bold text-slate-800 line-clamp-1">{activity.title}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{activity.date}</span>
                  </div>

                  {activity.score && (
                    <span className="px-2.5 py-1 bg-emerald-100/70 text-emerald-800 font-extrabold text-[10px] rounded-lg">
                      Acertos: {activity.score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
