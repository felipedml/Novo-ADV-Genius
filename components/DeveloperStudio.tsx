import React, { useState, useEffect } from 'react';
import { Assistant, AssistantDevConfig, MCPAction, ActionInput, ActionEnvVar } from '../types';
import { MODEL_SPECS } from '../constants';
import { Save, Code, Terminal, Database, Server, ChevronRight, Lock, Eye, EyeOff, Sliders, Box, Plus, Trash2, Zap, Play } from 'lucide-react';

interface DeveloperStudioProps {
  assistants: Assistant[];
  onUpdateAssistant: (updatedAssistant: Assistant) => void;
  onClose: () => void;
}

// Ensure every assistant has a valid config object structure
const ensureConfig = (assistant: Assistant): Assistant => {
    if (!assistant.devConfig) {
        return {
            ...assistant,
            devConfig: {
                modelId: 'gemini-3-flash',
                temperature: 0.5,
                topP: 0.9,
                frequencyPenalty: 0,
                presencePenalty: 0,
                maxOutputTokens: 8192,
                maxInputTokens: 1000000,
                memoryWindow: 20,
                mcps: []
            }
        };
    }
    // Ensure MCP array exists
    if (!assistant.devConfig.mcps) {
        return { ...assistant, devConfig: { ...assistant.devConfig, mcps: [] } };
    }
    return assistant;
};

const DeveloperStudio: React.FC<DeveloperStudioProps> = ({ assistants, onUpdateAssistant, onClose }) => {
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(assistants[0]?.id || null);
  const [editedAssistant, setEditedAssistant] = useState<Assistant | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'configure' | 'actions'>('prompt');
  
  // States for MCP Editor
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (selectedAssistantId) {
      const found = assistants.find(a => a.id === selectedAssistantId);
      if (found) {
          setEditedAssistant(ensureConfig({ ...found }));
          setShowApiKey(false);
          setEditingActionId(null);
      }
    }
  }, [selectedAssistantId, assistants]);

  const handleSave = () => {
    if (editedAssistant) {
      onUpdateAssistant(editedAssistant);
      alert('Configurações salvas e aplicadas ao ambiente de produção.');
      onClose();
    }
  };

  const updateConfig = (key: keyof AssistantDevConfig, value: any) => {
      if(!editedAssistant || !editedAssistant.devConfig) return;
      setEditedAssistant({
          ...editedAssistant,
          devConfig: {
              ...editedAssistant.devConfig,
              [key]: value
          }
      });
  };

  const getModelSpec = () => {
      if(!editedAssistant?.devConfig?.modelId) return MODEL_SPECS['default'];
      return MODEL_SPECS[editedAssistant.devConfig.modelId] || MODEL_SPECS['default'];
  };

  // --- RENDERERS ---

  const renderPromptTab = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="space-y-3">
             <div className="flex items-center gap-2 text-adv-gold font-bold text-sm uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                Role / System Prompt
             </div>
             <p className="text-xs text-gray-500">Defina a persona, regras de comportamento e limites éticos. Este é o "cérebro" principal do assistente.</p>
             <div className="relative">
               <textarea 
                  className="w-full h-[500px] bg-adv-gray border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300 focus:border-adv-gold focus:ring-1 focus:ring-adv-gold outline-none resize-none leading-relaxed"
                  value={editedAssistant?.systemPrompt}
                  onChange={(e) => setEditedAssistant(editedAssistant ? {...editedAssistant, systemPrompt: e.target.value} : null)}
               />
               <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-[10px] text-gray-500 font-mono">markdown enabled</div>
             </div>
        </div>
    </div>
  );

  const renderConfigureTab = () => {
      const spec = getModelSpec();
      const config = editedAssistant?.devConfig;
      if (!config) return null;

      // Calculate visualization percentages
      const maxContext = spec.maxContext;
      const systemPromptSize = (editedAssistant?.systemPrompt.length || 0) / 4; // approx tokens
      const outputSize = config.maxOutputTokens;
      const memorySize = config.memoryWindow * 200; // approx 200 tokens per msg
      const reservedPct = ((systemPromptSize + outputSize + memorySize) / maxContext) * 100;
      const availablePct = 100 - reservedPct;

      return (
        <div className="space-y-8 animate-in fade-in">
            {/* Model Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                     <div className="flex items-center gap-2 text-adv-gold font-bold text-sm uppercase tracking-wider">
                        <Server className="w-4 h-4" />
                        Modelo Base
                     </div>
                     <select 
                        className="w-full bg-adv-gray border border-white/10 rounded-lg p-3 text-sm text-white focus:border-adv-gold outline-none"
                        value={config.modelId}
                        onChange={(e) => updateConfig('modelId', e.target.value)}
                    >
                         <optgroup label="GPT Series">
                            <option value="gpt-5.2-pro">GPT-5.2 Pro</option>
                            <option value="gpt-5.1">GPT-5.1</option>
                            <option value="gpt-5">GPT-5</option>
                            <option value="gpt-5-mini">GPT-5 mini</option>
                            <option value="gpt-5-nano">GPT-5 nano</option>
                        </optgroup>
                        <optgroup label="Gemini Series">
                            <option value="gemini-3-pro">Gemini 3 Pro</option>
                            <option value="gemini-3-flash">Gemini 3 Flash</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        </optgroup>
                        <optgroup label="Perplexity / Sonar">
                            <option value="sonar">Sonar</option>
                            <option value="sonar-pro">Sonar Pro</option>
                            <option value="sonar-deep-research">Sonar Deep-Research</option>
                        </optgroup>
                    </select>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-xs text-gray-400">Context Window Cap.</span>
                             <span className="text-xs text-adv-gold font-mono">{spec.maxContext.toLocaleString()} tkns</span>
                        </div>
                        <div className="w-full h-2 bg-black rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500" style={{ width: `${(systemPromptSize/maxContext)*100}%` }} title="Prompt de Sistema" />
                            <div className="h-full bg-green-500" style={{ width: `${(memorySize/maxContext)*100}%` }} title="Memória" />
                            <div className="h-full bg-orange-500" style={{ width: `${(outputSize/maxContext)*100}%` }} title="Reserva de Output" />
                            <div className="h-full bg-gray-700" style={{ width: `${availablePct}%` }} title="Disponível para Input/Docs" />
                        </div>
                        <div className="flex gap-3 mt-2 text-[10px] text-gray-500">
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> System</span>
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/> Memory</span>
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"/> Output</span>
                        </div>
                    </div>
                </div>

                {/* Secure API Key */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-adv-gold font-bold text-sm uppercase tracking-wider">
                        <Lock className="w-4 h-4" />
                        Chave de API (Segura)
                     </div>
                     <div className="relative">
                        <input 
                            type={showApiKey ? "text" : "password"}
                            className="w-full bg-adv-gray border border-white/10 rounded-lg p-3 pr-10 text-sm text-white focus:border-adv-gold outline-none font-mono"
                            placeholder="sk-..."
                            value={config.apiKey || ''}
                            onChange={(e) => updateConfig('apiKey', e.target.value)}
                        />
                        <button 
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-white"
                        >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                     <p className="text-[10px] text-gray-600">A chave é encriptada e injetada apenas no runtime.</p>
                </div>
            </div>

            <hr className="border-white/10" />

            {/* Sliders Area */}
            <div className="space-y-6">
                 <h3 className="font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-adv-gold" /> Parâmetros de Geração
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Temperature */}
                     <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs text-gray-400">Randomness (Temperature)</label>
                            <span className="text-xs text-white bg-white/10 px-1 rounded">{config.temperature}</span>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.01"
                            className="w-full accent-adv-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            value={config.temperature}
                            onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                        />
                         <div className="flex justify-between text-[10px] text-gray-600">
                            <span>Previsível</span>
                            <span>Criativo</span>
                         </div>
                     </div>

                     {/* Top P */}
                     <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs text-gray-400">Diversity (Top P)</label>
                            <span className="text-xs text-white bg-white/10 px-1 rounded">{config.topP || 0.9}</span>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.01"
                            className="w-full accent-adv-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            value={config.topP || 0.9}
                            onChange={(e) => updateConfig('topP', parseFloat(e.target.value))}
                        />
                     </div>

                     {/* Output Length */}
                     <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs text-gray-400">Max Output Length</label>
                            <span className="text-xs text-white bg-white/10 px-1 rounded">{config.maxOutputTokens} tks</span>
                        </div>
                        <input 
                            type="range" min="100" max="32000" step="100"
                            className="w-full accent-adv-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            value={config.maxOutputTokens}
                            onChange={(e) => updateConfig('maxOutputTokens', parseInt(e.target.value))}
                        />
                     </div>

                      {/* Memory Buffer */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs text-gray-400">User Memories (Msgs)</label>
                            <span className="text-xs text-white bg-white/10 px-1 rounded">{config.memoryWindow}</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" step="1"
                            className="w-full accent-adv-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            value={config.memoryWindow}
                            onChange={(e) => updateConfig('memoryWindow', parseInt(e.target.value))}
                        />
                     </div>
                 </div>
            </div>
        </div>
      );
  };

  const renderActionsTab = () => {
      const config = editedAssistant?.devConfig;
      if (!config) return null;

      const activeAction = config.mcps.find(m => m.id === editingActionId);

      const handleAddAction = () => {
          const newAction: MCPAction = {
              id: Date.now().toString(),
              name: 'Nova Action',
              description: '',
              enabled: true,
              pythonCode: 'import requests\n\ndef main(args):\n    # Seu código aqui\n    return {"result": "ok"}',
              inputs: [],
              envVars: []
          };
          updateConfig('mcps', [...config.mcps, newAction]);
          setEditingActionId(newAction.id);
      };

      const handleUpdateAction = (id: string, field: keyof MCPAction, value: any) => {
          const updated = config.mcps.map(m => m.id === id ? { ...m, [field]: value } : m);
          updateConfig('mcps', updated);
      };

      const handleDeleteAction = (id: string) => {
          if(confirm("Tem certeza?")) {
              updateConfig('mcps', config.mcps.filter(m => m.id !== id));
              if(editingActionId === id) setEditingActionId(null);
          }
      };

      return (
          <div className="flex h-full animate-in fade-in">
              {/* Sidebar List of Actions */}
              <div className="w-1/3 border-r border-white/10 pr-4 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-white">Active MCPs</h3>
                      <button onClick={handleAddAction} className="p-1.5 bg-adv-gold rounded hover:bg-adv-goldDim text-black">
                          <Plus className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="space-y-2 overflow-y-auto flex-1">
                      {config.mcps.map(action => (
                          <div 
                            key={action.id}
                            onClick={() => setEditingActionId(action.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center group ${
                                editingActionId === action.id 
                                ? 'bg-adv-petrol/30 border-adv-gold' 
                                : 'bg-white/5 border-white/5 hover:border-white/20'
                            }`}
                          >
                             <div className="flex items-center gap-3 overflow-hidden">
                                 <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-adv-gold">
                                     <Zap className="w-4 h-4" />
                                 </div>
                                 <div className="truncate">
                                     <p className="text-sm font-medium text-white truncate">{action.name}</p>
                                     <p className="text-[10px] text-gray-500 truncate">{action.description || 'No description'}</p>
                                 </div>
                             </div>
                          </div>
                      ))}
                      {config.mcps.length === 0 && (
                          <p className="text-xs text-gray-500 text-center py-4">Nenhuma action configurada.</p>
                      )}
                  </div>
              </div>

              {/* Action Editor */}
              <div className="flex-1 pl-4 flex flex-col h-full overflow-hidden">
                  {activeAction ? (
                      <div className="flex flex-col h-full overflow-y-auto pr-2 space-y-6">
                           <div className="flex justify-between items-start">
                               <div className="space-y-2 w-full">
                                   <label className="text-xs text-adv-gold font-bold uppercase">Nome da Action (Function Name)</label>
                                   <input 
                                     type="text" 
                                     value={activeAction.name}
                                     onChange={(e) => handleUpdateAction(activeAction.id, 'name', e.target.value)}
                                     className="w-full bg-black border border-white/10 rounded p-2 text-white font-mono text-sm focus:border-adv-gold outline-none"
                                   />
                               </div>
                               <button onClick={() => handleDeleteAction(activeAction.id)} className="ml-4 text-gray-500 hover:text-red-500">
                                   <Trash2 className="w-5 h-5" />
                               </button>
                           </div>

                           <div className="space-y-2">
                               <label className="text-xs text-gray-400 font-bold uppercase">Descrição (Para o LLM)</label>
                               <input 
                                 type="text" 
                                 value={activeAction.description}
                                 onChange={(e) => handleUpdateAction(activeAction.id, 'description', e.target.value)}
                                 className="w-full bg-black border border-white/10 rounded p-2 text-white text-sm focus:border-adv-gold outline-none"
                                 placeholder="Ex: Busca jurisprudência no STJ dado um termo..."
                               />
                           </div>

                           {/* Python Editor Mock */}
                           <div className="flex-1 min-h-[300px] flex flex-col">
                               <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs text-blue-400 font-bold uppercase flex items-center gap-2">
                                        <Code className="w-3 h-3" /> Python Code
                                    </label>
                                    <span className="text-[10px] text-gray-500">Runtime v3.11</span>
                               </div>
                               <textarea 
                                  value={activeAction.pythonCode}
                                  onChange={(e) => handleUpdateAction(activeAction.id, 'pythonCode', e.target.value)}
                                  className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-lg p-4 text-gray-300 font-mono text-xs leading-relaxed outline-none resize-none focus:border-blue-500"
                                  spellCheck={false}
                               />
                           </div>

                           {/* Configuration (Inputs & Envs) */}
                           <div className="grid grid-cols-2 gap-4">
                               <div className="bg-white/5 rounded p-3">
                                   <h4 className="text-xs font-bold text-white mb-2">Inputs (Arguments)</h4>
                                   <p className="text-[10px] text-gray-500 mb-2">Defina os argumentos que a IA deve extrair.</p>
                                   <textarea 
                                      className="w-full h-20 bg-black border border-white/10 rounded p-2 text-[10px] font-mono text-green-400"
                                      placeholder='[{"name": "query", "type": "string"}]'
                                      value={JSON.stringify(activeAction.inputs, null, 2)}
                                      onChange={(e) => {
                                          try {
                                              const parsed = JSON.parse(e.target.value);
                                              handleUpdateAction(activeAction.id, 'inputs', parsed);
                                          } catch(err) {}
                                      }}
                                   />
                               </div>
                               <div className="bg-white/5 rounded p-3">
                                   <h4 className="text-xs font-bold text-white mb-2">Environment Variables</h4>
                                   <p className="text-[10px] text-gray-500 mb-2">Chaves de API necessárias para este script.</p>
                                   <div className="space-y-2">
                                       <input type="text" placeholder="KEY_NAME" className="w-full bg-black border border-white/10 rounded p-1 text-xs text-white" />
                                       <input type="password" placeholder="VALUE" className="w-full bg-black border border-white/10 rounded p-1 text-xs text-white" />
                                   </div>
                               </div>
                           </div>
                           
                           {/* Simulation Button */}
                           <div className="pt-2">
                               <button 
                                 onClick={() => alert(`Simulando execução da action ${activeAction.name}...\n\nResult: Success\nOutput: {"status": "ok", "data": [...]}`)}
                                 className="w-full py-2 bg-white/10 hover:bg-green-900/30 text-green-400 border border-green-800/50 rounded flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                               >
                                   <Play className="w-3 h-3" />
                                   Testar Action (Simulação)
                               </button>
                           </div>

                      </div>
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                          <Zap className="w-12 h-12 mb-4" />
                          <p>Selecione ou crie uma Action para editar.</p>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  if (!editedAssistant) return <div>Carregando...</div>;

  return (
    <div className="flex h-full bg-black text-white overflow-hidden">
      {/* List of Assistants */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-adv-gray/50">
        <div className="p-4 border-b border-white/10 bg-black/50">
          <h2 className="font-bold text-adv-gold flex items-center gap-2">
            <Box className="w-4 h-4" /> Studio
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {assistants.map(assistant => (
            <button
              key={assistant.id}
              onClick={() => setSelectedAssistantId(assistant.id)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center justify-between group ${selectedAssistantId === assistant.id ? 'bg-adv-petrol/20 border-l-2 border-l-adv-gold' : ''}`}
            >
              <div>
                <p className={`text-sm font-medium ${selectedAssistantId === assistant.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{assistant.name}</p>
                <p className="text-[10px] text-gray-600">{assistant.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header with Tabs */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black z-10">
           <div className="flex items-center gap-4">
                <h1 className="font-bold text-lg">{editedAssistant.name}</h1>
                <div className="h-6 w-px bg-white/10"></div>
                <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                    {(['prompt', 'configure', 'actions'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                activeTab === tab 
                                ? 'bg-adv-gold text-black shadow-lg shadow-adv-gold/20' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
           </div>
           <button 
                onClick={handleSave}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border border-white/10"
            >
                <Save className="w-3 h-3" />
                Update & Close
            </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
            {activeTab === 'prompt' && renderPromptTab()}
            {activeTab === 'configure' && renderConfigureTab()}
            {activeTab === 'actions' && renderActionsTab()}
        </div>
      </div>
    </div>
  );
};

export default DeveloperStudio;