export enum UserRole {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  USER = 'User',
  VIEWER = 'Viewer',
  EXTERNAL = 'Consultor',
  BILLING = 'Financeiro',
  DEVELOPER = 'Developer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaceId: string;
  organizationName: string;
  status?: 'active' | 'invited' | 'disabled';
  lastLogin?: Date;
}

export interface EvidenceBlock {
  id: string;
  text: string;
  sourceTitle: string;
  sourceUrl?: string;
  pageNumber?: number;
  confidence: number;
  snippetImage?: string;
  // Verification Fields
  scrapedAt: Date;
  contentHash: string; // SHA-256 simulation
  domainStatus: 'verified' | 'unverified' | 'warning';
  fullContextSnippet?: string; // Larger context for comparison
}

export interface Citation {
  id: string;
  evidenceId: string;
  referenceText: string;
  evidence: EvidenceBlock;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  isLoading?: boolean;
}

// --- KNOWLEDGE BASE & INGESTION ---

export type ProcessingStatus = 'queued' | 'scraping' | 'analyzing' | 'ocr_processing' | 'indexing' | 'ready' | 'error';

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'url' | 'pdf' | 'image' | 'text';
  url?: string; // For web sources
  fileType?: string; // 'application/pdf', etc.
  status: ProcessingStatus;
  progress: number; // 0 to 100
  ocrApplied: boolean; // Did we need Tesseract/Vision?
  pageCount?: number;
  tokensIndexed?: number;
  addedAt: Date;
}

// --- PROJECTS & CASE MANAGEMENT ---

export interface ProjectDocument {
    id: string;
    name: string;
    type: 'PDF' | 'DOCX' | 'JPG';
    size: string;
    uploadDate: Date;
}

export interface Project {
    id: string;
    name: string; // Ex: "Silva vs Banco X"
    clientName: string;
    caseNumber?: string; // Ex: "0001234-55.2024.8.26.0000"
    status: 'active' | 'archived' | 'pending';
    updatedAt: Date;
    conversationsCount: number;
    documentsCount: number;
    description?: string;
    documents?: ProjectDocument[];
}

// --- ADMIN & AUDIT ---

export interface AuditLogEntry {
    id: string;
    actorName: string;
    actorEmail: string;
    action: 'LOGIN' | 'EXPORT_DATA' | 'CREATE_ASSISTANT' | 'DELETE_PROJECT' | 'VIEW_SENSITIVE_DOC' | 'REVOKE_USER' | 'INVITE_USER';
    details: string;
    timestamp: Date;
    ipAddress: string;
}

// --- MCP / ACTION DEFINITIONS ---

export interface ActionInput {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  example?: string;
}

export interface ActionEnvVar {
  key: string;
  description: string;
  value?: string; // Encrypted in backend usually
}

export interface MCPAction {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  pythonCode: string; // The executable logic
  inputs: ActionInput[];
  envVars: ActionEnvVar[];
  triggerPrompt?: string; // Instruction to the model on when to use this
}

// --- ADVANCED CONFIGURATION ---

export interface AssistantDevConfig {
  // Model Settings
  modelId: string;
  apiKey?: string;
  
  // Creativity & Bias
  temperature: number; // 0-1 (Randomness)
  topP: number; // 0-1 (Diversity)
  frequencyPenalty: number; // 0-2 (Repetition)
  presencePenalty: number; // 0-2 (New topics)

  // Token Management (Context Window)
  maxOutputTokens: number;
  maxInputTokens: number; // Simulated limit for context
  memoryWindow: number; // How many turns/tokens of history to keep
  
  // Integrations
  sruEndpoint?: string;
  mcps: MCPAction[]; // List of defined MCPs
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string; 
  systemPrompt: string;
  isNew?: boolean;
  isCustom?: boolean; // User created
  devConfig?: AssistantDevConfig;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  category: string;
  videoUrl?: string; // For the player
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  MY_ASSISTANTS = 'MY_ASSISTANTS',
  MY_ASSISTANTS_BUILDER = 'MY_ASSISTANTS_BUILDER',
  TRAININGS = 'TRAININGS',
  SETTINGS = 'SETTINGS', // Mapped to PROJECTS in Sidebar
  ADMIN = 'ADMIN',
  DEV_STUDIO = 'DEV_STUDIO'
}