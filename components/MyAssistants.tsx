import React, { useState } from 'react';
import { Bot, Save, Plus, Trash2, Cpu, Edit2, Play, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Assistant, AssistantDevConfig } from '../types';

interface MyAssistantsProps {
    assistants: Assistant[];
    onSaveAssistant: (assistant: Assistant) => void;
    onDeleteAssistant: (id: string) => void;
    onSelectAssistant: (assistant: Assistant) => void;
}

const MyAssistants: React.FC<MyAssistantsProps> = ({ assistants, onSaveAssistant, onDeleteAssistant, onSelectAssistant }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gemini-3-flash');
  
  // BYOK State
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const customAssistants = assistants.filter(a => a.isCustom);

  const handleEdit = (assistant: Assistant) => {
      setName(assistant.name);
      setDesc(assistant.description);
      setPrompt(assistant.systemPrompt);
      setModel(assistant.devConfig?.modelId || 'gemini-3-flash');
      setApiKey(assistant.devConfig?.apiKey || ''); // Load existing key if any
      setEditingId(assistant.id);
      setIsCreating(true);
  };

  const resetForm = () => {
      setName('');
      setDesc('');
      setPrompt('');
      setModel('gemini-3-flash');
      setApiKey('');
      setEditingId(null);
      setIsCreating(false);
  };

  const handleSave = () => {
      const newAssistant: Assistant = {
          id: editingId || Date.now().toString(),
          name: name || 'Novo Assistente',
          description: desc || 'Assistente personalizado',
          category: 'Meus Assistentes',
          tags: ['Custom', 'BYOK'],
          imageUrl: `https://ui-avatars.com/api/?background=395761&color=D9AA43&name=${name}`,
          systemPrompt: prompt,
          isCustom: true,
          devConfig: {
              modelId: model,
              apiKey: apiKey, // Saves the user's key securely
              temperature: 0.7,
              topP: 0.9,
              frequencyPenalty: 0,
              presencePenalty: 0,
              maxInputTokens: 1000000,
              maxOutputTokens: 8192,
              memoryWindow: 20,
              mcps: []
          }
      };
      onSaveAssistant(newAssistant);
      resetForm();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Meus Assistentes</h1>
            <p className="text-gray-400">Crie e configure seus próprios bots usando BYOK (Bring Your Own Key).</p>
          </div>
          {!isCreating && (
            <button 
                onClick={() => setIsCreating(true)}
                className="bg-adv-gold hover:bg-adv-goldDim text-adv-black px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-lg shadow-adv-gold/20"
            >
                <Plus className="w-4 h-4 mr-2" />
                Novo Assistente
            </button>
          )}
        </div>

        {isCreating ? (
            <div className="bg-adv-gray border border-white/10 rounded-2xl p-6 max-w-3xl animate-in slide-in-from-bottom">
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-lg bg-adv-petrol/20 flex items-center justify-center text-adv-gold">
                        <Bot className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{editingId ? 'Editar Assistente' : 'Configurar Novo Assistente'}</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Assistente</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-adv-gold outline-none" placeholder="Ex: Especialista em Licitações" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo de IA</label>
                            <select value={model} onChange={e => setModel(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-adv-gold outline-none">
                                <option value="gemini-3-flash">Gemini 3 Flash (Recomendado)</option>
                                <option value="gemini-3-pro">Gemini 3 Pro (Raciocínio Complexo)</option>
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* BYOK Section */}
                    <div className="bg-black/30 border border-adv-gold/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-adv-gold flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Chave de API (BYOK)
                            </label>
                            <span className="text-[10px] text-green-400 flex items-center gap-1 border border-green-900 bg-green-900/20 px-2 py-0.5 rounded">
                                <ShieldCheck className="w-3 h-3" /> Criptografia Ponta-a-Ponta
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            Para garantir privacidade total e limites de uso personalizados, insira sua chave da Google AI Studio ou OpenAI. 
                            <a href="#" className="text-blue-400 hover:underline ml-1">Obter chave</a>
                        </p>
                        <div className="relative">
                            <input 
                                type={showApiKey ? "text" : "password"} 
                                value={apiKey} 
                                onChange={e => setApiKey(e.target.value)} 
                                className="w-full bg-black border border-white/10 rounded-lg p-3 pr-10 text-white font-mono text-sm focus:border-adv-gold outline-none" 
                                placeholder="sk-..." 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-white"
                            >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Descrição Curta</label>
                        <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-adv-gold outline-none" placeholder="Breve descrição da função..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Instrução do Sistema (System Prompt)</label>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-adv-gold outline-none" placeholder="Você é um assistente especializado em..."></textarea>
                        <p className="text-xs text-gray-500 mt-1">Defina a personalidade, o tom de voz e as regras de compliance.</p>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Base de Conhecimento (RAG)</label>
                         <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-adv-gold/50 transition-colors cursor-pointer bg-black/20">
                            <p className="text-gray-400 text-sm">Arraste PDFs, DOCX ou TXT aqui</p>
                            <p className="text-xs text-gray-600 mt-1">Otimizado para análise contextual</p>
                         </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                         <button onClick={resetForm} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                         <button onClick={handleSave} className="bg-adv-gold hover:bg-adv-goldDim text-adv-black px-6 py-2 rounded-lg font-bold flex items-center shadow-lg shadow-adv-gold/20">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Assistente
                         </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customAssistants.map(assistant => (
                    <div key={assistant.id} className="bg-adv-gray border border-white/5 rounded-xl p-5 hover:border-adv-gold/50 transition-all group relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/50 rounded-bl-lg backdrop-blur-sm">
                                <button onClick={() => handleEdit(assistant)} className="p-1.5 text-gray-400 hover:text-white bg-black/50 rounded hover:bg-adv-petrol transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                                <button onClick={() => onDeleteAssistant(assistant.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-black/50 rounded hover:bg-red-900/30 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img src={assistant.imageUrl} className="w-10 h-10 rounded-lg" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">{assistant.name}</h3>
                                    <div className="flex gap-1 mt-1">
                                        <span className="text-[9px] bg-adv-petrol/30 text-adv-gold px-1.5 py-0.5 rounded border border-adv-petrol/50">Custom</span>
                                        {assistant.devConfig?.apiKey && (
                                            <span className="text-[9px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-900/50 flex items-center gap-0.5">
                                                <Lock className="w-2 h-2" /> BYOK
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4 h-8">{assistant.description}</p>
                        <button 
                            onClick={() => onSelectAssistant(assistant)}
                            className="w-full py-2 bg-white/5 hover:bg-adv-gold hover:text-black rounded text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Play className="w-3 h-3" /> Iniciar Conversa
                        </button>
                    </div>
                ))}

                {/* Empty State / Placeholder */}
                {customAssistants.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Cpu className="w-12 h-12 text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-white">Você ainda não tem assistentes personalizados</h3>
                        <p className="text-gray-500 max-w-md mt-2">Crie bots que utilizam sua própria chave de API e documentos internos. Eles ficarão privados para sua organização.</p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default MyAssistants;