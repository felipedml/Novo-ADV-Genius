import { Assistant, UserRole, User, EvidenceBlock, TrainingModule, Project, AuditLogEntry } from './types';

// Model Context Window Specifications
export const MODEL_SPECS: Record<string, { maxContext: number, label: string }> = {
  'gpt-5.2-pro': { maxContext: 2000000, label: 'GPT-5.2 Pro' },
  'gpt-5.1': { maxContext: 1000000, label: 'GPT-5.1' },
  'gpt-5': { maxContext: 128000, label: 'GPT-5' },
  'gemini-3-pro': { maxContext: 2000000, label: 'Gemini 3 Pro' },
  'gemini-3-flash': { maxContext: 1000000, label: 'Gemini 3 Flash' },
  'gemini-2.5-pro': { maxContext: 2000000, label: 'Gemini 2.5 Pro' },
  'gemini-2.5-flash': { maxContext: 1000000, label: 'Gemini 2.5 Flash' },
  'sonar-pro': { maxContext: 200000, label: 'Sonar Pro' },
  'default': { maxContext: 32000, label: 'Unknown Model' }
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Dr. Usuário',
  email: 'usuario@advgenius.com.br',
  role: UserRole.OWNER,
  workspaceId: 'w1',
  organizationName: 'Advocacia Futuro',
  status: 'active',
  lastLogin: new Date()
};

export const MOCK_USERS_LIST: User[] = [
    MOCK_USER,
    { id: 'u2', name: 'Ana Silva', email: 'ana@advgenius.com.br', role: UserRole.ADMIN, workspaceId: 'w1', organizationName: 'Advocacia Futuro', status: 'active' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
    { id: 'l1', actorName: 'Dr. Usuário', actorEmail: 'usuario@advgenius.com.br', action: 'LOGIN', details: 'Successful login via 2FA', timestamp: new Date(), ipAddress: '201.12.33.102' },
];

export const MOCK_PROJECTS: Project[] = [
    { id: 'p1', name: 'Silva vs Banco Nacional', clientName: 'João da Silva', caseNumber: '0012345-88.2024.8.26.0100', status: 'active', updatedAt: new Date(), conversationsCount: 12, documentsCount: 45 },
    { id: 'p2', name: 'Consultoria Tributária 2024', clientName: 'Grupo Varejo SA', status: 'active', updatedAt: new Date(Date.now() - 86400000), conversationsCount: 8, documentsCount: 12 }
];

export const ASSISTANT_CATEGORIES = [
  "Todos",
  "Ferramentas Gerais",
  "Escrita",
  "Produto",
  "Comunicação",
  "Tráfego",
  "Relacionamento",
  "Rotinas Administrativas",
  "Visual Law",
  "Mentores Digitais"
];

const BASE_IMAGE_URL = "https://ui-avatars.com/api/?background=0D0D0D&color=D9AA43&font-size=0.4&length=2&name=";

const defaultDevConfig = {
    modelId: 'gemini-3-flash',
    temperature: 0.5,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    maxOutputTokens: 8192,
    maxInputTokens: 1000000,
    memoryWindow: 20,
    mcps: []
};

// --- CATÁLOGO COMPLETO DE ASSISTENTES ---

export const MOCK_ASSISTANTS: Assistant[] = [
  // 1) FERRAMENTAS GERAIS
  {
    id: 'fg-01',
    name: 'Engenheiro de Prompt',
    description: 'Especialista em criar, refinar e otimizar prompts para extrair o máximo das IAs jurídicas.',
    category: 'Ferramentas Gerais',
    tags: ['Meta-Prompting', 'Otimização'],
    imageUrl: BASE_IMAGE_URL + 'EP',
    systemPrompt: 'Você é um Engenheiro de Prompt Sênior. Ajude o usuário a criar prompts perfeitos para outras IAs.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'fg-02',
    name: 'Buscador de Leis e Jurisprudência',
    description: 'Conectado ao SRU LexML para buscar conteúdo completo de leis, doutrinas e decisões.',
    category: 'Ferramentas Gerais',
    tags: ['LexML', 'Pesquisa', 'SRU'],
    imageUrl: BASE_IMAGE_URL + 'BL',
    systemPrompt: 'Você é um especialista em pesquisa jurídica via LexML/SRU. Busque fontes oficiais e cite com precisão.',
    devConfig: { ...defaultDevConfig, modelId: 'sonar-pro' }
  },
  {
    id: 'fg-03',
    name: 'Leitura Assistida',
    description: 'Analisa documentos PDF/Docx, resume pontos chave e responde perguntas sobre o texto.',
    category: 'Ferramentas Gerais',
    tags: ['Resumo', 'Análise'],
    imageUrl: BASE_IMAGE_URL + 'LA',
    systemPrompt: 'Você é um assistente de leitura. Analise o texto fornecido, resuma e destaque pontos críticos.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'fg-04',
    name: 'Assuntos Aleatórios',
    description: 'Brainstorming criativo e conhecimentos gerais fora da caixa jurídica.',
    category: 'Ferramentas Gerais',
    tags: ['Criatividade', 'Brainstorming'],
    imageUrl: BASE_IMAGE_URL + 'AA',
    systemPrompt: 'Você é um assistente criativo para brainstorming de ideias diversas.',
    devConfig: { ...defaultDevConfig, temperature: 0.9 }
  },

  // 2) ESCRITA
  {
    id: 'esc-01',
    name: 'Estagiário',
    description: 'Auxilia em tarefas básicas, pesquisa preliminar e rascunhos simples.',
    category: 'Escrita',
    tags: ['Júnior', 'Aprendizado'],
    imageUrl: BASE_IMAGE_URL + 'ES',
    systemPrompt: 'Você é um estagiário de direito proativo e ávido por aprender. Ajude com pesquisas e rascunhos.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-flash' }
  },
  {
    id: 'esc-02',
    name: 'Gerador de Contratos',
    description: 'Redige minutas contratuais completas com cláusulas de segurança e compliance.',
    category: 'Escrita',
    tags: ['Contratos', 'Civil'],
    imageUrl: BASE_IMAGE_URL + 'GC',
    systemPrompt: 'Você é especialista em Direito Contratual. Crie contratos seguros, claros e detalhados.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'esc-03',
    name: 'Gerador de Peças',
    description: 'Cria petições iniciais, contestações e recursos com linguagem técnica e persuasiva.',
    category: 'Escrita',
    tags: ['Processual', 'Petições'],
    imageUrl: BASE_IMAGE_URL + 'GP',
    systemPrompt: 'Você é um advogado processualista sênior. Redija peças jurídicas persuasivas e tecnicamente perfeitas.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'esc-04',
    name: 'Gerador de Parecer Jurídico',
    description: 'Elabora opiniões legais fundamentadas com análise de risco e probabilidade.',
    category: 'Escrita',
    tags: ['Consultivo', 'Análise'],
    imageUrl: BASE_IMAGE_URL + 'PJ',
    systemPrompt: 'Você é um parecerista jurídico. Analise o caso e forneça uma opinião legal fundamentada.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'esc-05',
    name: 'Corretor Linguístico-Textual',
    description: 'Revisa ortografia, gramática e adequação ao "Legal Design" textual.',
    category: 'Escrita',
    tags: ['Revisão', 'Gramática'],
    imageUrl: BASE_IMAGE_URL + 'CL',
    systemPrompt: 'Você é um revisor de textos jurídicos. Corrija erros e melhore a clareza e fluidez do texto.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-flash' }
  },

  // 3) PRODUTO
  {
    id: 'prod-01',
    name: 'Gerador de Produtos',
    description: 'Ideação e estruturação de infoprodutos jurídicos (e-books, cursos, mentorias).',
    category: 'Produto',
    tags: ['Infoprodutos', 'Ideação'],
    imageUrl: BASE_IMAGE_URL + 'GP',
    systemPrompt: 'Você é um Product Manager focado no mercado jurídico. Ajude a criar produtos digitais.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'prod-02',
    name: 'Gerador de Produtos via Youtube',
    description: 'Transforma vídeos do Youtube em e-books, resumos ou checklists.',
    category: 'Produto',
    tags: ['Youtube', 'Repurpose'],
    imageUrl: BASE_IMAGE_URL + 'GY',
    systemPrompt: 'Você transforma conteúdo de vídeo em produtos digitais escritos.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },

  // 4) COMUNICAÇÃO
  {
    id: 'com-01',
    name: 'JusCreator',
    description: 'Especialista em Comunicação e Ensino Jurídico para redes sociais.',
    category: 'Comunicação',
    tags: ['Creator', 'Ensino'],
    imageUrl: BASE_IMAGE_URL + 'JC',
    systemPrompt: 'Você é um especialista em comunicar direito de forma simples e educativa.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-02',
    name: 'Assistente de Palestra',
    description: 'Roteiriza palestras, define tópicos e cria slides mentais.',
    category: 'Comunicação',
    tags: ['Speaking', 'Roteiro'],
    imageUrl: BASE_IMAGE_URL + 'AP',
    systemPrompt: 'Ajude a estruturar palestras jurídicas impactantes e didáticas.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-03',
    name: 'Bio do Instagram',
    description: 'Cria biografias atrativas e posicionadas para advogados.',
    category: 'Comunicação',
    tags: ['Instagram', 'Perfil'],
    imageUrl: BASE_IMAGE_URL + 'BI',
    systemPrompt: 'Crie bios de Instagram que convertam visitantes em seguidores e clientes.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-04',
    name: 'Planejador de Linhas Editoriais',
    description: 'Define calendário de conteúdo estratégico por área de atuação.',
    category: 'Comunicação',
    tags: ['Planejamento', 'Conteúdo'],
    imageUrl: BASE_IMAGE_URL + 'PL',
    systemPrompt: 'Crie linhas editoriais estratégicas para advogados nas redes sociais.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-05',
    name: 'Escritor de Headlines Irresistíveis',
    description: 'Gera títulos de alto impacto para artigos, vídeos e posts.',
    category: 'Comunicação',
    tags: ['Copywriting', 'Títulos'],
    imageUrl: BASE_IMAGE_URL + 'HI',
    systemPrompt: 'Escreva headlines que gerem curiosidade e cliques, mantendo a ética.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-06',
    name: 'Gerador de Carrosséis',
    description: 'Estrutura o conteúdo lâmina a lâmina para posts em carrossel.',
    category: 'Comunicação',
    tags: ['Instagram', 'Design'],
    imageUrl: BASE_IMAGE_URL + 'GC',
    systemPrompt: 'Estruture posts de carrossel educativos e engajadores.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-07',
    name: 'Script para Youtube',
    description: 'Roteiros completos para vídeos longos (intro, conteúdo, CTA).',
    category: 'Comunicação',
    tags: ['Youtube', 'Vídeo'],
    imageUrl: BASE_IMAGE_URL + 'SY',
    systemPrompt: 'Crie roteiros para vídeos de Youtube otimizados para retenção.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-08',
    name: 'Script para Reels e TikTok',
    description: 'Roteiros curtos e dinâmicos de 15s a 60s.',
    category: 'Comunicação',
    tags: ['Shorts', 'Viral'],
    imageUrl: BASE_IMAGE_URL + 'SR',
    systemPrompt: 'Crie roteiros curtos e virais para Reels e TikTok.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-09',
    name: 'Gerador de Email de Alta Conversão',
    description: 'Emails para prospecção, newsletter e relacionamento.',
    category: 'Comunicação',
    tags: ['Email Mkt', 'Vendas'],
    imageUrl: BASE_IMAGE_URL + 'GE',
    systemPrompt: 'Escreva emails que gerem resposta e conversão.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-10',
    name: 'Revisor de Textos de Vendas',
    description: 'Analisa copy de páginas de vendas e propostas comerciais.',
    category: 'Comunicação',
    tags: ['Copywriting', 'Revisão'],
    imageUrl: BASE_IMAGE_URL + 'RV',
    systemPrompt: 'Revise textos de vendas para maximizar a persuasão.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-11',
    name: 'Perfil Jornalístico',
    description: 'Escreve press releases e artigos com tom de notícia.',
    category: 'Comunicação',
    tags: ['PR', 'Imprensa'],
    imageUrl: BASE_IMAGE_URL + 'PJ',
    systemPrompt: 'Escreva como um jornalista jurídico.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-12',
    name: 'Gerador de Artigos para Blog',
    description: 'Artigos otimizados para SEO jurídico.',
    category: 'Comunicação',
    tags: ['SEO', 'Blog'],
    imageUrl: BASE_IMAGE_URL + 'GA',
    systemPrompt: 'Escreva artigos jurídicos otimizados para SEO.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'com-13',
    name: 'Gerador de Sustentação Oral',
    description: 'Roteiro de fala com ênfase, pausas e pontos altos para tribunais.',
    category: 'Comunicação',
    tags: ['Tribunal', 'Oratória'],
    imageUrl: BASE_IMAGE_URL + 'GS',
    systemPrompt: 'Crie roteiros de sustentação oral impactantes e cronometrados.',
    devConfig: { ...defaultDevConfig }
  },

  // 5) TRÁFEGO
  {
    id: 'traf-01',
    name: 'Estrategista de Tráfego Pago',
    description: 'Planeja campanhas de Google Ads e Meta Ads.',
    category: 'Tráfego',
    tags: ['Ads', 'Campanhas'],
    imageUrl: BASE_IMAGE_URL + 'TP',
    systemPrompt: 'Você é um gestor de tráfego. Planeje campanhas pagas para advogados.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'traf-02',
    name: 'Estrategista de Tráfego Orgânico',
    description: 'Estratégias de SEO e Marketing de Conteúdo.',
    category: 'Tráfego',
    tags: ['SEO', 'Orgânico'],
    imageUrl: BASE_IMAGE_URL + 'TO',
    systemPrompt: 'Desenvolva estratégias de crescimento orgânico.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'traf-03',
    name: 'Ideias de Anúncios',
    description: 'Sugere criativos e copys para anúncios.',
    category: 'Tráfego',
    tags: ['Criativos', 'Ads'],
    imageUrl: BASE_IMAGE_URL + 'IA',
    systemPrompt: 'Gere ideias criativas para anúncios jurídicos.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'traf-04',
    name: 'Google Meu Negócio',
    description: 'Otimização de perfil para busca local.',
    category: 'Tráfego',
    tags: ['Local', 'GMN'],
    imageUrl: BASE_IMAGE_URL + 'GM',
    systemPrompt: 'Otimize fichas do Google Meu Negócio para advogados.',
    devConfig: { ...defaultDevConfig }
  },

  // 6) RELACIONAMENTO
  {
    id: 'rel-01',
    name: 'Encantador de Clientes',
    description: 'Scripts de atendimento, onboarding e pós-venda (Customer Success).',
    category: 'Relacionamento',
    tags: ['CS', 'Atendimento'],
    imageUrl: BASE_IMAGE_URL + 'EC',
    systemPrompt: 'Você é especialista em Customer Success jurídico. Crie experiências incríveis para clientes.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'rel-02',
    name: 'Recuperador de Clientes',
    description: 'Estratégias e mensagens para reativar base inativa ou cobrar honorários.',
    category: 'Relacionamento',
    tags: ['Cobrança', 'Reativação'],
    imageUrl: BASE_IMAGE_URL + 'RC',
    systemPrompt: 'Crie comunicações empáticas e eficazes para recuperação de clientes.',
    devConfig: { ...defaultDevConfig }
  },

  // 7) ROTINAS ADMINISTRATIVAS
  {
    id: 'adm-01',
    name: 'Gerenciador de Processos',
    description: 'Organiza fluxos de trabalho e etapas processuais.',
    category: 'Rotinas Administrativas',
    tags: ['Workflow', 'Gestão'],
    imageUrl: BASE_IMAGE_URL + 'GP',
    systemPrompt: 'Ajude a organizar o fluxo de processos do escritório.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'adm-02',
    name: 'Gerenciador de Contratos',
    description: 'Controle de prazos, renovações e vigências de contratos internos.',
    category: 'Rotinas Administrativas',
    tags: ['Gestão', 'Contratos'],
    imageUrl: BASE_IMAGE_URL + 'GC',
    systemPrompt: 'Gerencie o ciclo de vida de contratos administrativos.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'adm-03',
    name: 'O Secretário',
    description: 'Secretário pessoal que monta a agenda diária/semanal de forma inteligente para maximizar resultados.',
    category: 'Rotinas Administrativas',
    tags: ['Agenda', 'Eficiência'],
    imageUrl: BASE_IMAGE_URL + 'OS',
    systemPrompt: 'Você é O Secretário. Organize a agenda do advogado priorizando tarefas de alto impacto e garantindo qualidade de vida.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'adm-04',
    name: 'O Agendador',
    description: 'Agenda compromissos e envia lembretes/notificações para não perder prazos.',
    category: 'Rotinas Administrativas',
    tags: ['Lembretes', 'Notificações'],
    imageUrl: BASE_IMAGE_URL + 'OA',
    systemPrompt: 'Você é O Agendador. Gerencie compromissos e crie textos para notificações de lembrete via Email/WhatsApp.',
    devConfig: { ...defaultDevConfig }
  },

  // 8) VISUAL LAW
  {
    id: 'vis-01',
    name: 'Engenheiro de Prompt de Imagem',
    description: 'Cria prompts detalhados para Midjourney/DALL-E focados em contexto jurídico.',
    category: 'Visual Law',
    tags: ['Prompts', 'Imagens'],
    imageUrl: BASE_IMAGE_URL + 'EP',
    systemPrompt: 'Crie prompts de alta qualidade para geradores de imagem, focados em temas jurídicos.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'vis-02',
    name: 'Gerador de Imagem',
    description: 'Gera descrições visuais conceituais para peças (Simulado).',
    category: 'Visual Law',
    tags: ['Conceito', 'Visual'],
    imageUrl: BASE_IMAGE_URL + 'GI',
    systemPrompt: 'Descreva imagens conceituais que explicariam o caso jurídico visualmente.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'vis-03',
    name: 'Transformador de Imagem',
    description: 'Sugere transformações e edições para melhorar a clareza de evidências visuais.',
    category: 'Visual Law',
    tags: ['Edição', 'Melhoria'],
    imageUrl: BASE_IMAGE_URL + 'TI',
    systemPrompt: 'Sugira edições para tornar imagens e evidências mais claras em juízo.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'vis-04',
    name: 'Transcritor de Imagem',
    description: 'Especialista em OCR avançado para documentos digitalizados (manuscritos ou ruins).',
    category: 'Visual Law',
    tags: ['OCR', 'Transcrição'],
    imageUrl: BASE_IMAGE_URL + 'TR',
    systemPrompt: 'Transcreva com exatidão textos de imagens, corrigindo erros de leitura.',
    devConfig: { ...defaultDevConfig }
  },

  // 9) MENTORES DIGITAIS
  {
    id: 'men-01',
    name: 'Mentor Constitucional',
    description: 'Especialista em Direito Constitucional.',
    category: 'Mentores Digitais',
    tags: ['Constituição', 'STF'],
    imageUrl: BASE_IMAGE_URL + 'MC',
    systemPrompt: 'Você é especialista em Direito Constitucional.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'men-02',
    name: 'Mentor Administrativo',
    description: 'Especialista em Direito Administrativo e Público.',
    category: 'Mentores Digitais',
    tags: ['Público', 'Licitações'],
    imageUrl: BASE_IMAGE_URL + 'MA',
    systemPrompt: 'Você é especialista em Direito Administrativo.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-03',
    name: 'Mentor Civil',
    description: 'Especialista em Direito Civil.',
    category: 'Mentores Digitais',
    tags: ['Civil', 'Família'],
    imageUrl: BASE_IMAGE_URL + 'MCI',
    systemPrompt: 'Você é especialista em Direito Civil.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-04',
    name: 'Mentor Processo Civil',
    description: 'Especialista em CPC e Procedimentos.',
    category: 'Mentores Digitais',
    tags: ['CPC', 'Processo'],
    imageUrl: BASE_IMAGE_URL + 'MPC',
    systemPrompt: 'Você é especialista em Processo Civil.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-05',
    name: 'Mentor Penal',
    description: 'Especialista em Direito Penal e Processo Penal.',
    category: 'Mentores Digitais',
    tags: ['Criminal', 'Penal'],
    imageUrl: BASE_IMAGE_URL + 'MP',
    systemPrompt: 'Você é especialista em Direito Penal.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-06',
    name: 'Mentor Empresarial',
    description: 'Especialista em Direito Empresarial e Societário.',
    category: 'Mentores Digitais',
    tags: ['Empresas', 'Societário'],
    imageUrl: BASE_IMAGE_URL + 'ME',
    systemPrompt: 'Você é especialista em Direito Empresarial.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-07',
    name: 'Mentor Trabalhista',
    description: 'Especialista em Direito do Trabalho (CLT).',
    category: 'Mentores Digitais',
    tags: ['Trabalho', 'CLT'],
    imageUrl: BASE_IMAGE_URL + 'MT',
    systemPrompt: 'Você é especialista em Direito Trabalhista.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-08',
    name: 'Mentor Tributário',
    description: 'Especialista em Direito Tributário e Fiscal.',
    category: 'Mentores Digitais',
    tags: ['Impostos', 'Fiscal'],
    imageUrl: BASE_IMAGE_URL + 'MTR',
    systemPrompt: 'Você é especialista em Direito Tributário.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-09',
    name: 'Mentor Financeiro',
    description: 'Especialista em Direito Financeiro.',
    category: 'Mentores Digitais',
    tags: ['Finanças', 'Orçamento'],
    imageUrl: BASE_IMAGE_URL + 'MF',
    systemPrompt: 'Você é especialista em Direito Financeiro.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-10',
    name: 'Mentor Previdenciário',
    description: 'Especialista em INSS e Previdência.',
    category: 'Mentores Digitais',
    tags: ['INSS', 'Aposentadoria'],
    imageUrl: BASE_IMAGE_URL + 'MPR',
    systemPrompt: 'Você é especialista em Direito Previdenciário.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-11',
    name: 'Mentor Bancário',
    description: 'Especialista em Direito Bancário.',
    category: 'Mentores Digitais',
    tags: ['Bancos', 'Contratos'],
    imageUrl: BASE_IMAGE_URL + 'MB',
    systemPrompt: 'Você é especialista em Direito Bancário.',
    devConfig: { ...defaultDevConfig }
  },
  {
    id: 'men-12',
    name: 'Mentor Médico e da Saúde',
    description: 'Especialista em Direito Médico e da Saúde.',
    category: 'Mentores Digitais',
    tags: ['Saúde', 'Médico'],
    imageUrl: BASE_IMAGE_URL + 'MMS',
    systemPrompt: 'Você é especialista em Direito Médico e da Saúde.',
    devConfig: { ...defaultDevConfig }
  }
];

// --- MOCK EVIDENCE ---
export const MOCK_EVIDENCE: EvidenceBlock = {
  id: 'ev1',
  text: "Art. 422. Os contratantes são obrigados a guardar, assim na conclusão do contrato, como em sua execução, os princípios de probidade e boa-fé.",
  sourceTitle: "Código Civil Brasileiro - Lei nº 10.406/2002",
  sourceUrl: "http://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",
  pageNumber: 45,
  confidence: 0.99,
  snippetImage: "https://placehold.co/600x150/1a1a1a/FFF?text=Recorte+Original+do+Diário+Oficial",
  scrapedAt: new Date(),
  contentHash: "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
  domainStatus: 'verified',
  fullContextSnippet: "Seção V\nDos Contratos Preliminares\n..."
};

// --- TREINAMENTOS (LISTA COMPLETA) ---
export const MOCK_TRAININGS: TrainingModule[] = [
    {
      id: 't-01',
      title: 'IA na Advocacia: Como Multiplicar seus Resultados',
      description: 'Fundamentos da IA aplicada ao direito e ganhos de produtividade.',
      duration: '45 min',
      thumbnailUrl: 'https://picsum.photos/seed/ia1/400/225',
      category: 'Estratégia'
    },
    {
      id: 't-02',
      title: 'Advogado 4.0: Novas Fontes de Renda com IA',
      description: 'Como criar novos serviços e produtos usando inteligência artificial.',
      duration: '60 min',
      thumbnailUrl: 'https://picsum.photos/seed/ia2/400/225',
      category: 'Carreira'
    },
    {
      id: 't-03',
      title: 'Pesquisa Jurisprudencial com IA',
      description: 'Técnicas avançadas de busca e análise de decisões.',
      duration: '30 min',
      thumbnailUrl: 'https://picsum.photos/seed/ia3/400/225',
      category: 'Prática'
    },
    {
      id: 't-04',
      title: 'Petição Inicial com IA',
      description: 'Estruturação e redação assistida de peças iniciais.',
      duration: '40 min',
      thumbnailUrl: 'https://picsum.photos/seed/ia4/400/225',
      category: 'Prática'
    },
    {
      id: 't-05',
      title: 'Geração de Contratos com IA',
      description: 'Automação e revisão de minutas contratuais.',
      duration: '35 min',
      thumbnailUrl: 'https://picsum.photos/seed/ia5/400/225',
      category: 'Prática'
    },
    {
      id: 't-06',
      title: 'Como Atrair 10 Clientes por Semana no Instagram com IA',
      description: 'Estratégias de conteúdo e engajamento automatizado.',
      duration: '50 min',
      thumbnailUrl: 'https://picsum.photos/seed/mkt1/400/225',
      category: 'Marketing'
    },
    {
      id: 't-07',
      title: 'Posts Lucrativos para Advogados com IA',
      description: 'Criação de copy e design para redes sociais jurídicas.',
      duration: '25 min',
      thumbnailUrl: 'https://picsum.photos/seed/mkt2/400/225',
      category: 'Marketing'
    },
    {
      id: 't-08',
      title: 'Consultoria Jurídica com IA',
      description: 'Agilizando pareceres e respostas consultivas.',
      duration: '30 min',
      thumbnailUrl: 'https://picsum.photos/seed/ia6/400/225',
      category: 'Negócios'
    },
    {
      id: 't-09',
      title: 'Artigos em Sites Jurídicos que Geram Autoridade',
      description: 'Escrita assistida para portais e blogs.',
      duration: '45 min',
      thumbnailUrl: 'https://picsum.photos/seed/mkt3/400/225',
      category: 'Marketing'
    },
    {
      id: 't-10',
      title: 'Advogado Infoprodutor com IA',
      description: 'Criando cursos e e-books jurídicos do zero.',
      duration: '55 min',
      thumbnailUrl: 'https://picsum.photos/seed/prod1/400/225',
      category: 'Negócios'
    }
];