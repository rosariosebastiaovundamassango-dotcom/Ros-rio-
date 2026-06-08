import React, { useState } from 'react';
import { BookOpen, Award, FileDown, Eye, EyeOff, Brain, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Material, Flashcard } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MaterialsViewProps {
  materials: Material[];
  flashcards: Flashcard[];
}

export function MaterialsView({ materials, flashcards }: MaterialsViewProps) {
  const [activeTab, setActiveTab] = useState<'guides' | 'flashcards'>('guides');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Interactive guide detail state
  const [detailedMaterial, setDetailedMaterial] = useState<Material | null>(null);

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = [
    { value: 'all', label: 'Todos os Temas' },
    { value: 'grammar', label: 'Gramática' },
    { value: 'vocabulary', label: 'Vocabulário' },
    { value: 'reading', label: 'Leitura & Escrita' },
    { value: 'listening', label: 'Listening / Fala' }
  ];

  const levels = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'Iniciante', label: 'Iniciante' },
    { value: 'Intermediário', label: 'Intermediário' },
    { value: 'Avançado', label: 'Avançado' }
  ];

  // Filter materials based on current selectors
  const filteredMaterials = materials.filter((m) => {
    const categoryMatch = selectedCategory === 'all' || m.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || m.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentFlashcardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const simulateDownload = (materialTitle: string) => {
    alert(`Seu download do "${materialTitle}" começou simuladamente com sucesso! Em um ambiente de produção, este arquivo PDF seria baixado diretamente no seu dispositivo.`);
  };

  return (
    <div className="space-y-6" id="materials-container">
      {/* View Switcher Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => {
            setActiveTab('guides');
            setDetailedMaterial(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'guides'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Guias e Artigos
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'flashcards'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Flashcards Interativos
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'guides' && (
          <motion.div
            key="guides"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setDetailedMaterial(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setDetailedMaterial(null);
                  }}
                  className="bg-white border border-slate-200 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-slate-400"
                >
                  {levels.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Split/Grid Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Material List */}
              <div className={`space-y-4 ${detailedMaterial ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
                {filteredMaterials.length === 0 ? (
                  <div className="bg-slate-50 text-center py-12 rounded-2xl border border-dashed border-slate-200">
                    <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-sm">Nenhum material didático encontrado.</p>
                    <p className="text-xs text-slate-400 mt-1">Selecione filtros menos restritivos ou mude a categoria.</p>
                  </div>
                ) : (
                  filteredMaterials.map((material) => {
                    const isSelected = detailedMaterial?.id === material.id;
                    return (
                      <div
                        key={material.id}
                        className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/50 border-indigo-400 shadow-xs'
                            : 'bg-white border-slate-150 hover:border-slate-300 hover:shadow-xs'
                        }`}
                        onClick={() => setDetailedMaterial(material)}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                              material.level === 'Iniciante'
                                ? 'bg-sky-50 text-sky-700'
                                : material.level === 'Intermediário'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {material.level}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 capitalize">
                            {material.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm hover:text-indigo-700 transition-colors">
                          {material.title}
                        </h4>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                          {material.description}
                        </p>

                        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                          <span className="text-indigo-600 text-xs font-bold flex items-center gap-1.5">
                            {isSelected ? 'Lendo Agora' : 'Acessar Conteúdo'}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              simulateDownload(material.title);
                            }}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-50 transition-colors"
                            title="Baixar PDF de estudos"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Material Drawer/Expansion Panel */}
              {detailedMaterial && (
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 space-y-5 shadow-xs shrink-0 self-start">
                  <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        Material de Estudo Integrado
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                        {detailedMaterial.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setDetailedMaterial(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 bg-slate-50 rounded"
                    >
                      Fechar
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="text-slate-700 text-xs leading-relaxed space-y-4">
                    <p className="font-medium bg-indigo-50/40 p-4 border-l-4 border-indigo-500 rounded-r-xl">
                      {detailedMaterial.content}
                    </p>
                  </div>

                  {/* Vocabulary Section */}
                  {detailedMaterial.vocabularyList && detailedMaterial.vocabularyList.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-400 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        Vocabulário Chave Incluído:
                      </h4>

                      <div className="grid grid-cols-1 gap-2.5">
                        {detailedMaterial.vocabularyList.map((item, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex font-semibold text-slate-800 text-xs">
                              <span className="text-indigo-700">{item.term}</span>
                              <span className="mx-2 text-slate-300">|</span>
                              <span className="text-slate-600 font-normal">{item.definition}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 italic">
                              <strong>Exemplo:</strong> "{item.example}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Nível: <strong>{detailedMaterial.level}</strong></span>
                    <button
                      onClick={() => simulateDownload(detailedMaterial.title)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Baixar PDF Completo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'flashcards' && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-xl mx-auto space-y-6 text-center"
          >
            <p className="text-slate-500 text-xs">
              Use nossos flashcard interativos para fixar termos recorrentes e acelerar sua fala. Clique na carta para virá-la.
            </p>

            {/* Flashcard Component */}
            <div className="h-64 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div
                className={`w-full h-full duration-500 transform-style-3d relative ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side (English) */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-slate-100 p-8 flex flex-col justify-between shadow-xs backface-hidden">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>English Term</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[9px]">
                      {flashcards[currentFlashcardIndex].category}
                    </span>
                  </div>

                  <div className="my-auto py-2">
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {flashcards[currentFlashcardIndex].front}
                    </h3>
                    <p className="text-slate-500 text-xs mt-3 italic max-w-sm mx-auto">
                      "{flashcards[currentFlashcardIndex].exampleFront}"
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Clique para ver a tradução
                  </div>
                </div>

                {/* Back Side (Portuguese) */}
                <div className="absolute inset-0 w-full h-full bg-indigo-950 text-white rounded-2xl p-8 flex flex-col justify-between shadow-xs rotate-y-180 backface-hidden">
                  <div className="flex justify-between items-center text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                    <span>Tradução em Português</span>
                    <span>{flashcards[currentFlashcardIndex].category}</span>
                  </div>

                  <div className="my-auto py-2">
                    <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                      {flashcards[currentFlashcardIndex].back}
                    </h3>
                    <p className="text-indigo-200/85 text-xs mt-3 italic max-w-sm mx-auto">
                      "{flashcards[currentFlashcardIndex].exampleBack}"
                    </p>
                  </div>

                  <div className="text-[10px] text-indigo-300 font-semibold flex items-center justify-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" /> Clique para voltar ao termo
                  </div>
                </div>
              </div>
            </div>

            {/* Custom styles for 3D flip since we do not want external large CSS and standard tailwind supports style configs perfectly */}
            <style>{`
              .perspective-1000 {
                perspective: 1000px;
              }
              .transform-style-3d {
                transform-style: preserve-3d;
              }
              .backface-hidden {
                backface-visibility: hidden;
              }
              .rotate-y-180 {
                transform: rotateY(180deg);
              }
            `}</style>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between max-w-xs mx-auto pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevFlashcard();
                }}
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center bg-white text-slate-600 hover:text-slate-900 transition-colors"
                title="Carta Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-xs font-bold text-slate-500">
                {currentFlashcardIndex + 1} de {flashcards.length}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextFlashcard();
                }}
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center bg-white text-slate-600 hover:text-slate-900 transition-colors"
                title="Próxima Carta"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
