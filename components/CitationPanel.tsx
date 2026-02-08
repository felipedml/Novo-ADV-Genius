import React, { useState } from 'react';
import { X, CheckCircle, ExternalLink, Image as ImageIcon, ShieldCheck, Clock, FileCheck, Hash, AlertTriangle, Eye } from 'lucide-react';
import { EvidenceBlock } from '../types';

interface CitationPanelProps {
  citation: EvidenceBlock | null;
  onClose: () => void;
}

const CitationPanel: React.FC<CitationPanelProps> = ({ citation, onClose }) => {
  const [activeTab, setActiveTab] = useState<'proof' | 'context'>('proof');

  if (!citation) return null;

  return (
    <div className="w-96 h-full border-l border-white/10 bg-black/90 backdrop-blur-md flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-adv-gray">
        <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Auditoria de Fonte
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">ID: {citation.id} • Confiança: {(citation.confidence * 100).toFixed(0)}%</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1 rounded-md">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('proof')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'proof' ? 'text-adv-gold border-b-2 border-adv-gold bg-white/5' : 'text-gray-500 hover:text-white'}`}
          >
              Verificação
          </button>
          <button 
            onClick={() => setActiveTab('context')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'context' ? 'text-adv-gold border-b-2 border-adv-gold bg-white/5' : 'text-gray-500 hover:text-white'}`}
          >
              Contexto
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'proof' && (
            <div className="space-y-6 animate-in fade-in">
                {/* Source Status */}
                <div className={`p-4 rounded-lg border ${citation.domainStatus === 'verified' ? 'bg-green-900/10 border-green-500/30' : 'bg-yellow-900/10 border-yellow-500/30'}`}>
                    <div className="flex items-start gap-3">
                        {citation.domainStatus === 'verified' ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                        <div>
                            <p className={`text-sm font-bold ${citation.domainStatus === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                                {citation.domainStatus === 'verified' ? 'Domínio Verificado' : 'Domínio Não Verificado'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {citation.domainStatus === 'verified' 
                                    ? 'A fonte possui certificado SSL válido e consta na allowlist de fontes oficiais.' 
                                    : 'A fonte é externa e não possui assinatura digital conhecida.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" /> Data da Raspagem
                        </span>
                        <p className="text-sm text-white font-mono">{citation.scrapedAt.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                         <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
                            <Hash className="w-3 h-3" /> Hash SHA-256 (Integridade)
                        </span>
                        <p className="text-[10px] text-adv-gold font-mono break-all">{citation.contentHash}</p>
                    </div>
                </div>

                {/* Snippet Image */}
                {citation.snippetImage && (
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-3 h-3 text-adv-gold" />
                        Evidência Visual (OCR)
                        </span>
                        <div className="border border-white/10 rounded-lg overflow-hidden group relative">
                            <img 
                                src={citation.snippetImage} 
                                alt="Evidence Crop" 
                                className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-black/80 text-white px-3 py-1 rounded-full text-xs border border-white/20 flex items-center gap-2">
                                    <Eye className="w-3 h-3" /> Ampliar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* External Link */}
                <div className="pt-4 border-t border-white/10">
                     <a 
                        href={citation.sourceUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full block text-center py-2 bg-adv-petrol/20 hover:bg-adv-petrol/40 text-adv-gold border border-adv-petrol/50 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                        Acessar Fonte Original <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        )}

        {activeTab === 'context' && (
            <div className="space-y-4 animate-in fade-in">
                 <div className="space-y-2">
                    <span className="text-xs font-bold text-adv-gold uppercase tracking-wider">Trecho Citado</span>
                    <blockquote className="p-3 bg-adv-gold/10 border-l-2 border-adv-gold text-sm text-white italic rounded-r-lg">
                        "{citation.text}"
                    </blockquote>
                 </div>

                 <div className="flex items-center justify-center py-2">
                     <div className="h-8 w-px bg-white/10"></div>
                 </div>

                 <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck className="w-3 h-3" /> Contexto Completo Raspado
                    </span>
                    <div className="bg-black border border-white/10 p-3 rounded-lg text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {citation.fullContextSnippet || "Contexto não disponível."}
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CitationPanel;