import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, FileText, ChevronLeft, Bot, User as UserIcon, 
  Database, Link as LinkIcon, ScanLine, Loader2, CheckCircle, AlertTriangle, X, Code
} from 'lucide-react';
import { Assistant, Message, Citation, EvidenceBlock, KnowledgeDocument, ProcessingStatus } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import CitationPanel from './CitationPanel';
import { MOCK_EVIDENCE } from '../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  assistant: Assistant;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ assistant, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceBlock | null>(null);
  const [viewRawMap, setViewRawMap] = useState<Record<string, boolean>>({});
  
  // Knowledge Base State
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'model',
        content: `### Olá, sou o **${assistant.name}**. \n\n${assistant.description}\n\n*   Posso analisar documentos com OCR\n*   Busco legislações em inteiro teor\n\nComo posso ajudar hoje?`,
        timestamp: new Date()
      }]);
    }
  }, [assistant]);

  // --- INGESTION SIMULATION ---
  const simulateIngestion = (docId: string, type: 'url' | 'pdf') => {
      setTimeout(() => { updateDocStatus(docId, 'scraping', 10); }, 500);
      setTimeout(() => { updateDocStatus(docId, 'analyzing', 30); }, 1500);
      setTimeout(() => {
          const needsOCR = Math.random() > 0.5;
          if (needsOCR) {
             updateDocStatus(docId, 'ocr_processing', 45, true);
             setTimeout(() => {
                 updateDocStatus(docId, 'ocr_processing', 70, true);
                 finishIngestion(docId, true);
             }, 2500);
          } else {
             finishIngestion(docId, false);
          }
      }, 2500);
  };

  const finishIngestion = (docId: string, ocr: boolean) => {
      updateDocStatus(docId, 'indexing', 85, ocr);
      setTimeout(() => { updateDocStatus(docId, 'ready', 100, ocr); }, 1500);
  };

  const updateDocStatus = (id: string, status: ProcessingStatus, progress: number, ocr = false) => {
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, status, progress, ocrApplied: ocr } : d));
  };

  const handleAddUrl = (e: React.FormEvent) => {
      e.preventDefault();
      if(!urlInput) return;
      
      const newDoc: KnowledgeDocument = {
          id: Date.now().toString(),
          title: urlInput.replace('https://', '').substring(0, 25) + '...',
          type: 'url',
          url: urlInput,
          status: 'queued',
          progress: 0,
          ocrApplied: false,
          addedAt: new Date()
      };
      
      setDocuments(prev => [...prev, newDoc]);
      setUrlInput('');
      setShowUrlInput(false);
      setShowKnowledgePanel(true);
      simulateIngestion(newDoc.id, 'url');
  };

  const handleFileUpload = () => {
      const newDoc: KnowledgeDocument = {
          id: Date.now().toString(),
          title: "Contrato_Social_Scan_001.pdf",
          type: 'pdf',
          status: 'queued',
          progress: 0,
          ocrApplied: false,
          addedAt: new Date()
      };
      setDocuments(prev => [...prev, newDoc]);
      setShowKnowledgePanel(true);
      simulateIngestion(newDoc.id, 'pdf');
  };

  // --- CHAT LOGIC ---

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(
      messages, 
      userMsg.content, 
      assistant.systemPrompt,
      assistant.devConfig 
    );

    const shouldAttachEvidence = userMsg.content.toLowerCase().includes('contrato') || userMsg.content.toLowerCase().includes('boa fé') || userMsg.content.toLowerCase().includes('boa-fé');
    
    let finalContent = responseText;
    let citations: Citation[] = [];

    if (shouldAttachEvidence) {
        finalContent += "\n\n> Conforme disposto no Art. 422 do Código Civil [1].";
        citations = [{
            id: 'cit1',
            evidenceId: MOCK_EVIDENCE.id,
            referenceText: '[1]',
            evidence: MOCK_EVIDENCE
        }];
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: finalContent,
      timestamp: new Date(),
      citations: citations.length > 0 ? citations : undefined
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const toggleRawView = (msgId: string) => {
      setViewRawMap(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const renderMessageContent = (msg: Message) => {
    const isRaw = viewRawMap[msg.id];

    if (isRaw) {
        return (
            <div className="bg-black/50 p-3 rounded-lg border border-white/10 font-mono text-xs text-gray-400 whitespace-pre-wrap">
                {msg.content}
            </div>
        );
    }

    // Split content by citations [n] to render interactive buttons interspersed with Markdown
    const parts = msg.content.split(/(\[\d+\])/g);
    
    return (
        <div className="markdown-body text-sm leading-relaxed text-gray-200">
            {parts.map((part, index) => {
                const citation = msg.citations?.find(c => c.referenceText === part);
                if (citation) {
                    return (
                        <button 
                            key={index}
                            onClick={() => setActiveEvidence(citation.evidence)}
                            className="inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-adv-petrol text-adv-gold hover:bg-adv-gold hover:text-adv-black transition-colors cursor-pointer align-super border border-adv-gold/30"
                            title={`Fonte: ${citation.evidence.sourceTitle}`}
                        >
                            {part.replace('[','').replace(']','')}
                        </button>
                    );
                }
                // Render text chunk as Markdown
                return (
                    <ReactMarkdown 
                        key={index} 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Override default link to open in new tab and style
                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30" />,
                            p: ({node, ...props}) => <span {...props} /> // Use span for inline parts to avoid block breaks in split text
                        }}
                    >
                        {part}
                    </ReactMarkdown>
                );
            })}
        </div>
    );
  };

  const renderStatusIcon = (doc: KnowledgeDocument) => {
      switch(doc.status) {
          case 'ready': return <CheckCircle className="w-4 h-4 text-green-500" />;
          case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
          case 'ocr_processing': return <ScanLine className="w-4 h-4 text-adv-gold animate-pulse" />;
          case 'scraping': 
          case 'indexing': 
          default: return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      }
  };

  return (
    <div className="flex h-full overflow-hidden bg-adv-gray">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b border-white/10 bg-black/60 backdrop-blur-md z-10 justify-between">
          <div className="flex items-center">
             <button onClick={onBack} className="mr-4 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
             </button>
             <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 mr-3">
                    <img src={assistant.imageUrl} alt={assistant.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white">{assistant.name}</h2>
                    <span className="text-xs text-green-500 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        Online
                    </span>
                </div>
             </div>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
                className={`p-2 rounded transition-colors flex items-center gap-2 text-xs font-bold border ${showKnowledgePanel ? 'bg-adv-petrol/30 text-adv-gold border-adv-gold' : 'text-gray-400 border-transparent hover:bg-white/5'}`}
             >
                <Database className="w-4 h-4" />
                Base de Conhecimento
                {documents.length > 0 && (
                    <span className="bg-adv-gold text-black rounded-full px-1.5 py-0.5 text-[9px]">{documents.length}</span>
                )}
             </button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-md group relative ${
                        msg.role === 'user' 
                            ? 'bg-white/10 text-white rounded-br-sm' 
                            : 'bg-black text-gray-200 border border-white/10 rounded-bl-sm'
                    }`}>
                        <div className="flex items-center justify-between gap-4 mb-2 opacity-50 text-xs">
                             <div className="flex items-center gap-2">
                                {msg.role === 'user' ? <UserIcon className="w-3 h-3" /> : <Bot className="w-3 h-3 text-adv-gold" />}
                                <span>{msg.role === 'user' ? 'Você' : assistant.name}</span>
                             </div>
                             {msg.role === 'model' && (
                                 <button 
                                    onClick={() => toggleRawView(msg.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white flex items-center gap-1"
                                    title="Alternar Markdown/Raw"
                                 >
                                     <Code className="w-3 h-3" /> {viewRawMap[msg.id] ? 'Rich' : 'Raw'}
                                 </button>
                             )}
                        </div>
                        
                        {renderMessageContent(msg)}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                     <div className="bg-black border border-white/10 rounded-2xl rounded-bl-sm p-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-adv-gold rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-adv-gold rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-adv-gold rounded-full animate-bounce delay-150"></div>
                     </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/80">
            {showUrlInput && (
                <form onSubmit={handleAddUrl} className="mb-3 flex gap-2 animate-in slide-in-from-bottom">
                    <input 
                        type="url" 
                        placeholder="Cole a URL do documento (ex: planalto.gov.br/...)" 
                        className="flex-1 bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:border-adv-gold outline-none"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="bg-adv-petrol text-white px-3 py-1 rounded-lg text-xs font-bold">Ingerir</button>
                    <button type="button" onClick={() => setShowUrlInput(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4"/></button>
                </form>
            )}

            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <button 
                        type="button" 
                        onClick={handleFileUpload}
                        className="p-2 text-gray-400 hover:text-adv-gold transition-colors tooltip"
                        title="Upload PDF/DOCX (Inteiro Teor)"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="p-2 text-gray-400 hover:text-adv-gold transition-colors tooltip"
                        title="Adicionar Link (Scraping)"
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="w-full bg-adv-gray border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:border-adv-gold focus:ring-1 focus:ring-adv-gold outline-none shadow-inner"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={!inputText.trim() || isLoading}
                    className={`p-3 rounded-xl transition-all ${
                        !inputText.trim() || isLoading
                            ? 'bg-white/5 text-gray-600'
                            : 'bg-adv-gold hover:bg-adv-goldDim text-adv-black shadow-lg shadow-adv-gold/20'
                    }`}
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
            <p className="text-center text-[10px] text-gray-600 mt-2">
                As citações são auditáveis com hash de integridade e snapshot do inteiro teor.
            </p>
        </div>
      </div>

      {/* Right Sidebar - Knowledge & Evidence */}
      {showKnowledgePanel && (
          <div className="w-80 h-full border-l border-white/10 bg-black/90 backdrop-blur flex flex-col animate-in slide-in-from-right">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-adv-gold" />
                    Base Ativa
                </h3>
                <button onClick={() => setShowKnowledgePanel(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {documents.length === 0 ? (
                      <div className="text-center mt-10 p-4 border border-dashed border-white/10 rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">Nenhum documento ingerido.</p>
                        <p className="text-[10px] text-gray-600">Adicione URLs ou PDFs para o assistente citar com evidência.</p>
                      </div>
                  ) : (
                      documents.map(doc => (
                          <div key={doc.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                              <div className="flex items-start gap-3 mb-2">
                                  <div className="mt-1">
                                      {doc.type === 'url' ? <LinkIcon className="w-4 h-4 text-blue-400" /> : <FileText className="w-4 h-4 text-orange-400" />}
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                      <p className="text-xs font-bold text-gray-200 truncate" title={doc.title}>{doc.title}</p>
                                      <p className="text-[10px] text-gray-500">{doc.type.toUpperCase()}</p>
                                  </div>
                                  <div>
                                      {renderStatusIcon(doc)}
                                  </div>
                              </div>
                              
                              <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                      <span className="text-[9px] text-adv-gold font-mono uppercase tracking-tight">
                                          {renderStatusIcon(doc) && doc.status === 'ready' ? 'Processado e Indexado' : 'Processando...'}
                                      </span>
                                      <span className="text-[9px] text-gray-500">{doc.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 ${doc.status === 'error' ? 'bg-red-500' : 'bg-adv-petrol'}`} 
                                        style={{ width: `${doc.progress}%` }} 
                                      />
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      )}

      {/* Evidence Panel (Overlays Knowledge if active) */}
      {activeEvidence && (
          <div className="absolute right-0 top-0 h-full z-20">
             <CitationPanel 
                citation={activeEvidence} 
                onClose={() => setActiveEvidence(null)} 
             />
          </div>
      )}
    </div>
  );
};

export default ChatInterface;