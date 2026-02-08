import React, { useState } from 'react';
import { Bot, Save, Plus, Trash2, Cpu, Edit2, Play } from 'lucide-react';
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

  const customAssistants = assistants.filter(a => a.isCustom);

  const handleEdit = (assistant: Assistant) => {
      setName(assistant.name);
      setDesc(assistant.description);
      setPrompt(assistant.systemPrompt);
      setModel(assistant.devConfig?.modelId || 'gemini-3-flash');
      setEditingId(assistant.id);
      setIsCreating(true);
  };

  const resetForm = () => {
      setName('');
      setDesc('');
      setPrompt('');
      setModel('gemini-3-flash');
      setEditingId(null);
      setIsCreating(false);
  };

  const handleSave = () => {
      const newAssistant: Assistant = {
          id: editingId || Date.now().toString(),
          name: name || 'Novo Assistente',
          description: desc || 'Assistente personalizado',
          category: 'Meus Assistentes',
          tags: ['Custom'],
          imageUrl: `https://ui-avatars.com/api/?background=395761&color=D9AA43&name=${name}`,
          systemPrompt: prompt,
          isCustom: true,
          devConfig: {
              modelId: model,
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
                                <option value="gemini-3-flash">Gemini 3 Flash</option>
                                <option value="gemini-3-pro">Gemini 3 Pro</option>
                                <option value="gpt-5">GPT-5</option>
                            </select>
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
                         <button onClick={handleSave} className="bg-adv-gold hover:bg-adv-goldDim text-adv-black px-6 py-2 rounded-lg font-bold flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Assistente
                         </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customAssistants.map(assistant => (
                    <div key={assistant.id} className="bg-adv-gray border border-white/5 rounded-xl p-5 hover:border-adv-gold/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img src={assistant.imageUrl} className="w-10 h-10 rounded-lg" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">{assistant.name}</h3>
                                    <span className="text-[10px] bg-adv-petrol/30 text-adv-gold px-1.5 py-0.5 rounded">Custom</span>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(assistant)} className="p-1.5 text-gray-400 hover:text-white"><Edit2 className="w-4 h-4"/></button>
                                <button onClick={() => onDeleteAssistant(assistant.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{assistant.description}</p>
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