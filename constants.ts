import { Assistant, UserRole, User, EvidenceBlock, TrainingModule, Project, AuditLogEntry } from './types';

// Model Context Window Specifications (Approximations for UI Logic)
export const MODEL_SPECS: Record<string, { maxContext: number, label: string }> = {
  // GPT Series
  'gpt-5.2-pro': { maxContext: 2000000, label: 'GPT-5.2 Pro' },
  'gpt-5.1': { maxContext: 1000000, label: 'GPT-5.1' },
  'gpt-5': { maxContext: 128000, label: 'GPT-5' },
  'gpt-5-mini': { maxContext: 128000, label: 'GPT-5 mini' },
  'gpt-5-nano': { maxContext: 32000, label: 'GPT-5 nano' },
  
  // Gemini Series
  'gemini-3-pro': { maxContext: 2000000, label: 'Gemini 3 Pro' },
  'gemini-3-flash': { maxContext: 1000000, label: 'Gemini 3 Flash' },
  'gemini-2.5-pro': { maxContext: 2000000, label: 'Gemini 2.5 Pro' },
  'gemini-2.5-flash': { maxContext: 1000000, label: 'Gemini 2.5 Flash' },

  // Sonar / Perplexity
  'sonar': { maxContext: 32000, label: 'Sonar' },
  'sonar-pro': { maxContext: 200000, label: 'Sonar Pro' },
  'sonar-deep-research': { maxContext: 128000, label: 'Sonar Deep-Research' },
  
  // Fallback
  'default': { maxContext: 32000, label: 'Unknown Model' }
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Dev Master',
  email: 'dev@advgenius.com.br',
  role: UserRole.DEVELOPER,
  workspaceId: 'w1',
  organizationName: 'ADV Genius HQ',
  status: 'active',
  lastLogin: new Date()
};

export const MOCK_USERS_LIST: User[] = [
    MOCK_USER,
    { id: 'u2', name: 'Ana Silva', email: 'ana@advgenius.com.br', role: UserRole.ADMIN, workspaceId: 'w1', organizationName: 'ADV Genius HQ', status: 'active', lastLogin: new Date(Date.now() - 86400000) },
    { id: 'u3', name: 'Carlos Souza', email: 'carlos@advgenius.com.br', role: UserRole.USER, workspaceId: 'w1', organizationName: 'ADV Genius HQ', status: 'active', lastLogin: new Date(Date.now() - 172800000) },
    { id: 'u4', name: 'Roberto Parecerista', email: 'roberto@external.com', role: UserRole.EXTERNAL, workspaceId: 'w1', organizationName: 'ADV Genius HQ', status: 'invited' }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
    { id: 'l1', actorName: 'Dev Master', actorEmail: 'dev@advgenius.com.br', action: 'LOGIN', details: 'Successful login via 2FA', timestamp: new Date(), ipAddress: '201.12.33.102' },
    { id: 'l2', actorName: 'Ana Silva', actorEmail: 'ana@advgenius.com.br', action: 'EXPORT_DATA', details: 'Exported Conversation #4421 (PDF)', timestamp: new Date(Date.now() - 3600000), ipAddress: '189.44.21.11' },
    { id: 'l3', actorName: 'Carlos Souza', actorEmail: 'carlos@advgenius.com.br', action: 'CREATE_ASSISTANT', details: 'Created "Assistente Trabalhista V2"', timestamp: new Date(Date.now() - 7200000), ipAddress: '200.221.2.3' },
    { id: 'l4', actorName: 'Dev Master', actorEmail: 'dev@advgenius.com.br', action: 'VIEW_SENSITIVE_DOC', details: 'Accessed "Contrato_Sigiloso.pdf"', timestamp: new Date(Date.now() - 10000000), ipAddress: '201.12.33.102' },
];

export const MOCK_PROJECTS: Project[] = [
    { id: 'p1', name: 'Silva vs Banco Nacional', clientName: 'João da Silva', caseNumber: '0012345-88.2024.8.26.0100', status: 'active', updatedAt: new Date(), conversationsCount: 12, documentsCount: 45 },
    { id: 'p2', name: 'Fusão Tech & Corp', clientName: 'Tech Solutions Ltda', status: 'active', updatedAt: new Date(Date.now() - 86400000), conversationsCount: 8, documentsCount: 120 },
    { id: 'p3', name: 'Inventário Família Oliveira', clientName: 'Maria Oliveira', caseNumber: '0005551-22.2023.8.26.0000', status: 'active', updatedAt: new Date(Date.now() - 172800000), conversationsCount: 5, documentsCount: 15 },
    { id: 'p4', name: 'Consultoria Tributária 2024', clientName: 'Grupo Varejo SA', status: 'pending', updatedAt: new Date(Date.now() - 400000000), conversationsCount: 2, documentsCount: 3 },
    { id: 'p5', name: 'Defesa Trabalhista - Reclamante X', clientName: 'Logística Rápida', caseNumber: '0044123-11.2024.5.02.0001', status: 'archived', updatedAt: new Date(Date.now() - 800000000), conversationsCount: 20, documentsCount: 8 }
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

// Helper to create default dev config
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

// FULL LIST RESTORED
export const MOCK_ASSISTANTS: Assistant[] = [
  // --- Ferramentas Gerais ---
  {
    id: 'fg-01',
    name: 'Engenheiro de Prompt',
    description: 'Especialista em criar, refinar e otimizar prompts para extrair o máximo das IAs jurídicas.',
    category: 'Ferramentas Gerais',
    tags: ['Meta-Prompting', 'Otimização'],
    imageUrl: BASE_IMAGE_URL + 'EP',
    systemPrompt: 'Você é um Engenheiro de Prompt Sênior especializado em LLMs jurídicos. Seu objetivo é ajudar o usuário a construir o prompt perfeito.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro', temperature: 0.7 }
  },
  {
    id: 'fg-02',
    name: 'Analista de Jurisprudência',
    description: 'Localiza tendências de decisões em tribunais superiores.',
    category: 'Ferramentas Gerais',
    tags: ['STJ', 'STF', 'Pesquisa'],
    imageUrl: BASE_IMAGE_URL + 'AJ',
    systemPrompt: 'Você é um pesquisador jurídico focado em análise jurisprudencial quantitativa e qualitativa.',
    devConfig: { ...defaultDevConfig, modelId: 'sonar-pro' }
  },

  // --- Escrita ---
  {
    id: 'es-01',
    name: 'Redator de Petições',
    description: 'Cria iniciais, contestações e recursos com linguagem persuasiva e técnica.',
    category: 'Escrita',
    tags: ['Peças', 'Processual'],
    imageUrl: BASE_IMAGE_URL + 'RP',
    systemPrompt: 'Você é um redator jurídico sênior. Escreva com clareza, objetividade e foco na persuasão.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'es-02',
    name: 'Revisor de Contratos',
    description: 'Analisa riscos, cláusulas abusivas e sugere melhorias em minutas contratuais.',
    category: 'Escrita',
    tags: ['Contratos', 'Compliance'],
    imageUrl: BASE_IMAGE_URL + 'RC',
    systemPrompt: 'Você é especialista em Direito Contratual. Analise o documento buscando riscos para o cliente.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro', temperature: 0.2 }
  },

  // --- Mentores Digitais ---
  {
    id: 'md-01',
    name: 'Mentor Constitucional',
    description: 'Especialista em Direito Constitucional, ADIs, ADPFs e Direitos Fundamentais.',
    category: 'Mentores Digitais',
    tags: ['STF', 'Constituição'],
    imageUrl: BASE_IMAGE_URL + 'MC',
    systemPrompt: 'Você é um renomado constitucionalista. Responda com base na CF/88 e jurisprudência do STF.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },
  {
    id: 'md-02',
    name: 'Mentor Trabalhista',
    description: 'Especialista em CLT, Reforma Trabalhista e cálculos de liquidação.',
    category: 'Mentores Digitais',
    tags: ['CLT', 'Trabalho'],
    imageUrl: BASE_IMAGE_URL + 'MT',
    systemPrompt: 'Você é especialista em Direito do Trabalho e Processo do Trabalho.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-flash' }
  },
  {
    id: 'md-03',
    name: 'Mentor Criminalista',
    description: 'Especialista em Direito Penal, Processo Penal e Tribunal do Júri.',
    category: 'Mentores Digitais',
    tags: ['Penal', 'Júri'],
    imageUrl: BASE_IMAGE_URL + 'CP',
    systemPrompt: 'Você é um advogado criminalista experiente. Foque em teses de defesa e garantias fundamentais.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-pro' }
  },

  // --- Rotinas Administrativas ---
  {
    id: 'ra-01',
    name: 'Secretária Virtual',
    description: 'Organiza agenda, redige e-mails formais e gerencia prazos.',
    category: 'Rotinas Administrativas',
    tags: ['Agenda', 'Email'],
    imageUrl: BASE_IMAGE_URL + 'SV',
    systemPrompt: 'Você é uma secretária executiva jurídica eficiente e polida.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-flash' }
  },

  // --- Visual Law ---
  {
    id: 'vl-01',
    name: 'Designer Jurídico',
    description: 'Sugere elementos visuais, infográficos e formatação para peças modernas.',
    category: 'Visual Law',
    tags: ['Design', 'UX'],
    imageUrl: BASE_IMAGE_URL + 'VL',
    systemPrompt: 'Você é especialista em Visual Law e Legal Design. Sugira melhorias visuais para documentos.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-2.5-flash' }
  },

  // --- Comunicação & Marketing ---
  {
    id: 'cm-01',
    name: 'Social Media Jurídico',
    description: 'Cria posts e artigos informativos respeitando o Código de Ética da OAB.',
    category: 'Comunicação',
    tags: ['Marketing', 'OAB'],
    imageUrl: BASE_IMAGE_URL + 'SM',
    systemPrompt: 'Você é especialista em Marketing Jurídico. Crie conteúdo educativo sem mercantilização, conforme regras da OAB.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-flash' }
  },
  {
    id: 'cm-02',
    name: 'Gestor de Tráfego Legal',
    description: 'Estratégias de Google Ads e Meta Ads para escritórios de advocacia.',
    category: 'Tráfego',
    tags: ['Ads', 'Leads'],
    imageUrl: BASE_IMAGE_URL + 'GT',
    systemPrompt: 'Você é especialista em tráfego pago para advogados. Foco em palavras-chave e segmentação ética.',
    devConfig: { ...defaultDevConfig, modelId: 'gemini-3-flash' }
  }
];

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
  fullContextSnippet: "Seção V\nDos Contratos Preliminares\n\nArt. 421. A liberdade de contratar será exercida em razão e nos limites da função social do contrato.\n\nArt. 422. Os contratantes são obrigados a guardar, assim na conclusão do contrato, como em sua execução, os princípios de probidade e boa-fé.\n\nArt. 423. Quando houver no contrato de adesão cláusulas ambíguas ou contraditórias, dever-se-á adotar a interpretação mais favorável ao aderente."
};

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
      title: 'Visual Law na Prática',
      description: 'Transforme petições densas em documentos claros e persuasivos.',
      duration: '60 min',
      thumbnailUrl: 'https://picsum.photos/seed/vl1/400/225',
      category: 'Design'
    },
    {
      id: 't-03',
      title: 'Marketing Jurídico Ético',
      description: 'Como crescer nas redes sociais sem ferir o código da OAB.',
      duration: '30 min',
      thumbnailUrl: 'https://picsum.photos/seed/mkt1/400/225',
      category: 'Marketing'
    }
];