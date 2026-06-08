import { Material, Quiz, Flashcard, TeacherSlot } from '../types';

export const initialMaterials: Material[] = [
  {
    id: 'mat_1',
    title: 'Guia de Phrasal Verbs Essenciais para o Trabalho',
    description: 'Aprenda os 15 phrasal verbs mais utilizados no ambiente corporativo internacional com exemplos práticos.',
    category: 'vocabulary',
    level: 'Intermediário',
    downloadUrl: '#',
    content: 'Os phrasal verbs são fundamentais para soar natural em inglês. No ambiente de trabalho, termos como "bring up" (mencionar), "fill in" (substituir ou atualizar alguém) e "follow up" (acompanhar) são diários.',
    vocabularyList: [
      { term: 'Bring up', definition: 'Mencionar um assunto em uma conversa ou reunião.', example: 'Don\'t forget to bring up the budget restrictions in today\'s meeting.' },
      { term: 'Fill in (someone)', definition: 'Atualizar ou dar informações detalhadas a alguém sobre algo.', example: 'Please fill me in on what happened while I was out.' },
      { term: 'Follow up', definition: 'Acompanhar o progresso de algo ou retomar contato após uma ação inicial.', example: 'I will follow up with the client tomorrow morning.' },
      { term: 'Call off', definition: 'Cancelar um evento ou compromisso.', example: 'The manager decided to call off the meeting due to technical issues.' },
      { term: 'Carry out', definition: 'Executar ou realizar uma tarefa ou projeto.', example: 'We need to carry out a survey to understand our students\' needs.' }
    ]
  },
  {
    id: 'mat_2',
    title: 'Dominando o Present Perfect de uma Vez por Todas',
    description: 'Uma explicação descomplicada sobre a diferença entre o Present Perfect e o Simple Past com exercícios de fixação.',
    category: 'grammar',
    level: 'Iniciante',
    downloadUrl: '#',
    content: 'O Present Perfect causa confusão porque não tem tradução direta exata no português para todas as situações. A regra de ouro é: se o tempo em que a ação aconteceu no passado NÃO importa ou está conectado ao presente, use o Present Perfect. Se o momento específico no passado é mencionado, use o Simple Past.',
    vocabularyList: [
      { term: 'Since', definition: 'Desde um ponto específico no tempo.', example: 'I have lived in São Paulo since 2018.' },
      { term: 'For', definition: 'Por uma duração ou período de tempo.', example: 'She has studied English for six months.' },
      { term: 'Already', definition: 'Já (usado em afirmações para indicar que algo ocorreu antes do esperado).', example: 'I have already booked my lesson with the teacher.' },
      { term: 'Yet', definition: 'Ainda (usado em negações e perguntas no final de frases).', example: 'Have you finished your English exercises yet?' }
    ]
  },
  {
    id: 'mat_3',
    title: 'Vocabulário Avançado para Reuniões e Negociações',
    description: 'Termos formais, expressões idiomáticas de negócios (idioms) e como discordar educadamente.',
    category: 'reading',
    level: 'Avançado',
    downloadUrl: '#',
    content: 'Em reuniões de alto nível, usar expressões precisas eleva sua autoridade profissional. Em vez de "I don\'t agree", você pode dizer "I understand your point, but I have a professional reservation". Aprenda também expressões como "on the same page" e "touch base".',
    vocabularyList: [
      { term: 'On the same page', definition: 'Estar em pleno acordo e alinhamento sobre as informações ou planos.', example: 'Before we start the presentation, let\'s make sure we are all on the same page.' },
      { term: 'Touch base', definition: 'Fazer um contato rápido com alguém para atualizar informações.', example: 'Let\'s touch base on Thursday to review the slides.' },
      { term: 'Bottom line', definition: 'O resultado final, o fator decisivo ou o lucro de uma empresa.', example: 'The bottom line is that we need to decrease our operating costs.' },
      { term: 'Play devil\'s advocate', definition: 'Apresentar um ponto de vista contrário apenas para testar a força do argumento.', example: 'Just to play devil\'s advocate, what if our competitors lower their prices first?' }
    ]
  }
];

export const initialFlashcards: Flashcard[] = [
  {
    id: 'flash_1',
    category: 'Viagem',
    front: 'Where is the baggage claim?',
    back: 'Onde fica a esteira de bagagem?',
    exampleFront: 'Excuse me, where is the baggage claim area?',
    exampleBack: 'Com licença, onde fica a área de recolha de bagagens?'
  },
  {
    id: 'flash_2',
    category: 'Negócios',
    front: 'I would like to schedule a follow-up meeting.',
    back: 'Gostaria de agendar uma reunião de acompanhamento.',
    exampleFront: 'Are you free on Tuesday? I would like to schedule a follow-up.',
    exampleBack: 'Você está livre na terça? Gostaria de agendar um acompanhamento.'
  },
  {
    id: 'flash_3',
    category: 'Geral',
    front: 'By the way',
    back: 'A propósito / Por falar nisso',
    exampleFront: 'By the way, what was your score on the English quiz?',
    exampleBack: 'A propósito, qual foi a sua pontuação no teste de inglês?'
  },
  {
    id: 'flash_4',
    category: 'Idioms',
    front: 'Piece of cake',
    back: 'Mamão com açúcar / Muito fácil',
    exampleFront: 'Don’t worry about the job interview, it will be a piece of cake!',
    exampleBack: 'Não se preocupe com a entrevista de emprego, vai ser mamão com açúcar!'
  },
  {
    id: 'flash_5',
    category: 'Gramática',
    front: 'I look forward to hearing from you.',
    back: 'Fico no aguardo de notícias suas / contato seu.',
    exampleFront: 'Please let me know if you can attend. I look forward to hearing from you.',
    exampleBack: 'Por favor, avise se puder comparecer. Fico no aguardo de seu contato.'
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'Desafio Rápido: Preposições de Tempo (In, On, At)',
    description: 'Teste seus conhecimentos sobre o uso correto das preposições mais comuns no inglês.',
    level: 'Iniciante',
    category: 'Gramática',
    questions: [
      {
        id: 'q1_1',
        question: 'Sabemos que usamos preposições para falar sobre tempo. Qual a preposição correta para completar: "We have English classes ______ Mondays and Wednesdays"?',
        options: ['in', 'at', 'on', 'by'],
        correctAnswerIndex: 2,
        explanation: 'Usamos a preposição "on" para dias da semana específicos (on Mondays, on Wednesday, on my birthday).'
      },
      {
        id: 'q1_2',
        question: 'Como você completaria: "The conference starts ______ 9:00 AM"?',
        options: ['in', 'at', 'on', 'for'],
        correctAnswerIndex: 1,
        explanation: 'Usamos "at" para horas exatas e pontos precisos do tempo (at 9:00 AM, at noon, at midnight).'
      },
      {
        id: 'q1_3',
        question: 'E para completar: "The new training starts ______ October"?',
        options: ['at', 'on', 'in', 'to'],
        correctAnswerIndex: 2,
        explanation: 'Usamos "in" para meses, anos, estações e longos períodos sem data exata (in October, in 2026, in the summer).'
      }
    ]
  },
  {
    id: 'quiz_2',
    title: 'Inglês para Negócios: Expressões e Etiqueta',
    description: 'Você sabe como falar formalmente e se comunicar de forma polida com clientes estrangeiros?',
    level: 'Intermediário',
    category: 'Business English',
    questions: [
      {
        id: 'q2_1',
        question: 'Qual a maneira mais polida de discordar em uma reunião de negócios?',
        options: [
          'You are completely wrong about this plan.',
          'I respect your opinion, but I see it a bit differently.',
          'No, that is not a good idea.',
          'I don\'t agree with any of your points.'
        ],
        correctAnswerIndex: 1,
        explanation: '"I respect your opinion, but I see it a bit differently" é polido, acolhe a ideia do outro e introduz seu contra-argumento de forma diplomática.'
      },
      {
        id: 'q2_2',
        question: 'O que significa a expressão idiomática "Keep me in the loop"?',
        options: [
          'Me mantenha preso em no círculo.',
          'Me mantenha atualizado sobre as novidades e andamento do projeto.',
          'Faça o trabalho por mim.',
          'Não me chame para reuniões.'
        ],
        correctAnswerIndex: 1,
        explanation: '"Keep someone in the loop" significa manter alguém informado sobre um assunto ou projeto.'
      }
    ]
  }
];

export const defaultSlots: TeacherSlot[] = [
  // Monday (1)
  { id: 'slot_1', dayOfWeek: 1, time: '08:00', isAvailable: true },
  { id: 'slot_2', dayOfWeek: 1, time: '10:00', isAvailable: true },
  { id: 'slot_3', dayOfWeek: 1, time: '14:00', isAvailable: true },
  { id: 'slot_4', dayOfWeek: 1, time: '16:00', isAvailable: true },
  { id: 'slot_5', dayOfWeek: 1, time: '19:00', isAvailable: true },

  // Tuesday (2)
  { id: 'slot_6', dayOfWeek: 2, time: '09:00', isAvailable: true },
  { id: 'slot_7', dayOfWeek: 2, time: '11:00', isAvailable: true },
  { id: 'slot_8', dayOfWeek: 2, time: '15:00', isAvailable: true },
  { id: 'slot_9', dayOfWeek: 2, time: '17:00', isAvailable: true },
  { id: 'slot_10', dayOfWeek: 2, time: '20:00', isAvailable: true },

  // Wednesday (3)
  { id: 'slot_11', dayOfWeek: 3, time: '08:00', isAvailable: true },
  { id: 'slot_12', dayOfWeek: 3, time: '10:00', isAvailable: true },
  { id: 'slot_13', dayOfWeek: 3, time: '14:00', isAvailable: true },
  { id: 'slot_14', dayOfWeek: 3, time: '16:00', isAvailable: true },
  { id: 'slot_15', dayOfWeek: 3, time: '19:00', isAvailable: true },

  // Thursday (4)
  { id: 'slot_16', dayOfWeek: 4, time: '09:00', isAvailable: true },
  { id: 'slot_17', dayOfWeek: 4, time: '11:00', isAvailable: true },
  { id: 'slot_18', dayOfWeek: 4, time: '15:00', isAvailable: true },
  { id: 'slot_19', dayOfWeek: 4, time: '17:00', isAvailable: true },
  { id: 'slot_20', dayOfWeek: 4, time: '20:00', isAvailable: true },

  // Friday (5)
  { id: 'slot_21', dayOfWeek: 5, time: '08:00', isAvailable: true },
  { id: 'slot_22', dayOfWeek: 5, time: '10:00', isAvailable: true },
  { id: 'slot_23', dayOfWeek: 5, time: '14:00', isAvailable: true },
  { id: 'slot_24', dayOfWeek: 5, time: '16:00', isAvailable: true }
];
