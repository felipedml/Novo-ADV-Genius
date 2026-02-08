import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import MyAssistants from './components/MyAssistants';
import Trainings from './components/Trainings';
import DeveloperStudio from './components/DeveloperStudio';
import Projects from './components/Projects';
import AdminConsole from './components/AdminConsole';
import { MOCK_USER, MOCK_ASSISTANTS, ASSISTANT_CATEGORIES } from './constants';
import { ViewState, Assistant } from './types';
import { Search, Plus, Sparkles, AlertCircle, Bot } from 'lucide-react';
import { initializeGemini } from './services/geminiService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // State for assistants to allow updates from Dev Studio and MyAssistants
  const [assistants, setAssistants] = useState<Assistant[]>(MOCK_ASSISTANTS);

  useEffect(() => {
    // Check for API KEY
    const key = process.env.API_KEY;
    if(key) {
        initializeGemini(key);
        setHasApiKey(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(ViewState.DASHBOARD);
    setSelectedAssistant(null);
  };

  const handleSelectAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setCurrentView(ViewState.CHAT);
  };

  const handleBackToDashboard = () => {
    setSelectedAssistant(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleUpdateAssistant = (updated: Assistant) => {
    setAssistants(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleAddAssistant = (newAssistant: Assistant) => {
      // Check if it's an edit or new
      if (assistants.some(a => a.id === newAssistant.id)) {
          handleUpdateAssistant(newAssistant);
      } else {
          setAssistants([newAssistant, ...assistants]);
      }
  };

  const handleDeleteAssistant = (id: string) => {
      setAssistants(prev => prev.filter(a => a.id !== id));
  };

  const renderContent = () => {
    if (currentView === ViewState.CHAT && selectedAssistant) {
      return <ChatInterface assistant={selectedAssistant} onBack={handleBackToDashboard} />;
    }

    if (currentView === ViewState.MY_ASSISTANTS) {
      return <MyAssistants 
        assistants={assistants} 
        onSaveAssistant={handleAddAssistant}
        onDeleteAssistant={handleDeleteAssistant}
        onSelectAssistant={handleSelectAssistant}
      />;
    }

    if (currentView === ViewState.TRAININGS) {
      return <Trainings />;
    }

    if (currentView === ViewState.DEV_STUDIO) {
        return <DeveloperStudio 
            assistants={assistants} 
            onUpdateAssistant={handleUpdateAssistant} 
            onClose={() => setCurrentView(ViewState.DASHBOARD)} 
        />;
    }

    if (currentView === ViewState.SETTINGS) {
        return <Projects />;
    }

    if (currentView === ViewState.ADMIN) {
        return <AdminConsole />;
    }

    if (currentView === ViewState.DASHBOARD) {
        // Filter assistants logic
        const filteredAssistants = assistants.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === "Todos" || a.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        return (
          <div className="h-full flex flex-col p-8 overflow-y-auto animate-in fade-in duration-500">
             {!hasApiKey && (
                 <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg flex items-center text-yellow-500 gap-3">
                     <AlertCircle className="w-5 h-5" />
                     <p className="text-sm">API Key não detectada. O modo de demonstração usará respostas simuladas.</p>
                 </div>
             )}

            {/* Dashboard Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Catálogo de Assistentes</h1>
                <p className="text-gray-400">Selecione um especialista para iniciar seu trabalho jurídico.</p>
              </div>
              <button 
                onClick={() => setCurrentView(ViewState.MY_ASSISTANTS)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Assistente
              </button>
            </div>

            {/* Search & Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, área ou especialidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-adv-gray border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-adv-gold focus:ring-1 focus:ring-adv-gold outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {ASSISTANT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      selectedCategory === cat
                        ? 'bg-adv-gold text-adv-black border-adv-gold'
                        : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {filteredAssistants.map((assistant) => (
                <div 
                  key={assistant.id}
                  onClick={() => handleSelectAssistant(assistant)}
                  className="group bg-adv-gray border border-white/5 hover:border-adv-gold/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-2xl hover:shadow-adv-gold/5 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-adv-petrol to-adv-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black">
                        <img src={assistant.imageUrl} alt={assistant.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {['Mentores', 'Gerais'].includes(assistant.category) && (
                        <div className="bg-adv-petrol/20 text-adv-gold p-1.5 rounded-full" title="Assistente Premium">
                            <Sparkles className="w-3 h-3" />
                        </div>
                    )}
                    {assistant.isCustom && (
                        <div className="bg-white/10 text-white p-1.5 rounded-full" title="Assistente Próprio">
                            <Bot className="w-3 h-3" />
                        </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-adv-gold transition-colors">{assistant.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{assistant.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {assistant.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-1 rounded bg-black border border-white/10 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAssistants.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p>Nenhum assistente encontrado para esta busca.</p>
                </div>
            )}
          </div>
        );
    }
    return null;
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-adv-gold selection:text-black">
      <Sidebar 
        currentUser={MOCK_USER} 
        currentView={currentView}
        onChangeView={setCurrentView}
        onLogout={handleLogout}
      />

      <main className="flex-1 h-full overflow-hidden relative bg-gradient-to-br from-black to-adv-gray">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;