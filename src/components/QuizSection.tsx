import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle, XCircle, Award, RotateCcw, AlertCircle, Smile } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuizSectionProps {
  quizzes: Quiz[];
  onQuizComplete: (quizTitle: string, score: string) => void;
}

export function QuizSection({ quizzes, onQuizComplete }: QuizSectionProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (hasSubmitted) return; // can't change once submitted
    setSelectedOptionIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || hasSubmitted) return;
    
    const currentQuestion = selectedQuiz!.questions[currentQuestionIdx];
    if (selectedOptionIdx === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
    setHasSubmitted(true);
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < selectedQuiz!.questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOptionIdx(null);
      setHasSubmitted(false);
    } else {
      setQuizFinished(true);
      const scoreString = `${score}/${selectedQuiz!.questions.length}`;
      onQuizComplete(selectedQuiz!.title, scoreString);
    }
  };

  const resetQuizSelection = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8" id="quiz-container">
      <AnimatePresence mode="wait">
        {!selectedQuiz ? (
          <motion.div
            key="quiz-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">🧪 Testes e Desafios Rápidos</h2>
              <p className="text-xs text-slate-500 mt-1">
                Coloque em prática o que aprendeu em minutos com autoavaliações gamificadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 rounded-xl border border-slate-150 bg-slate-50/40 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] bg-slate-900 text-slate-100 uppercase tracking-wider font-extrabold px-2 py-0.5 rounded">
                        {quiz.level}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {quiz.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{quiz.title}</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {quiz.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-3">
                      {quiz.questions.length} questões de múltipla escolha
                    </span>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full mt-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Iniciar Teste
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : !quizFinished ? (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header / Quiz Progress */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <button
                  onClick={resetQuizSelection}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-1"
                >
                  ← Voltar para a lista
                </button>
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
                  {selectedQuiz.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                Questão {currentQuestionIdx + 1} de {selectedQuiz.questions.length}
              </span>
            </div>

            {/* Main Question Display */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-sans">Pergunta</span>
              <p className="text-base font-extrabold text-slate-800 leading-snug">
                {selectedQuiz.questions[currentQuestionIdx].question}
              </p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {selectedQuiz.questions[currentQuestionIdx].options.map((option, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  const isCorrect = idx === selectedQuiz.questions[currentQuestionIdx].correctAnswerIndex;
                  
                  let optionStyles = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70';
                  
                  if (hasSubmitted) {
                    if (isCorrect) {
                      optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-medium';
                    } else if (isSelected) {
                      optionStyles = 'bg-rose-50 border-rose-300 text-rose-800';
                    } else {
                      optionStyles = 'bg-white border-slate-100 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyles = 'bg-slate-900 border-slate-900 text-white font-medium';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={hasSubmitted}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 text-xs md:text-sm ${optionStyles}`}
                    >
                      <span>{option}</span>
                      
                      {hasSubmitted && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {hasSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submission / Continued Action Button */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmitCheck => handleSubmitAnswer()}
                    disabled={selectedOptionIdx === null}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      selectedOptionIdx !== null
                        ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Verificar Resposta
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {currentQuestionIdx + 1 < selectedQuiz.questions.length ? 'Próxima Pergunta' : 'Finalizar Teste'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Explanatory Panel */}
              <AnimatePresence>
                {hasSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl text-xs bg-sky-50 border border-sky-100 text-sky-800 flex gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Explicação Gramatical:</span>
                      <p>{selectedQuiz.questions[currentQuestionIdx].explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-5"
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Teste Finalizado!</h3>
              <p className="text-slate-500 text-sm mt-1">
                Parabéns por completar o teste prático de inglês.
              </p>
            </div>

            <div className="max-w-xs mx-auto p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Sua Pontuação</span>
                <span className="text-2xl font-extrabold text-indigo-600">
                  {score} / {selectedQuiz.questions.length}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1 justify-end">
                  {score === selectedQuiz.questions.length ? (
                    <>Gênio! <Smile className="w-4 h-4 text-amber-500" /></>
                  ) : score >= selectedQuiz.questions.length / 2 ? (
                    'Muito Bem!'
                  ) : (
                    'Continue Estudando!'
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => startQuiz(selectedQuiz)}
                className="px-5 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1.5"
                title="Tentar Novamente"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refazer Teste
              </button>
              
              <button
                onClick={resetQuizSelection}
                className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all"
              >
                Escolher outro Teste
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
