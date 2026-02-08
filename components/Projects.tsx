import React, { useState } from 'react';
import { Folder, Search, Plus, Filter, Clock, MoreVertical, FileText, MessageSquare, Briefcase, ChevronRight, Download, Trash2, X, Save } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { Project, ProjectDocument } from '../types';

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
    
    // Modal State
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [newCaseNumber, setNewCaseNumber] = useState('');

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.caseNumber && p.caseNumber.includes(searchQuery));
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        const newProject: Project = {
            id: Date.now().toString(),
            name: newProjectName,
            clientName: newClientName,
            caseNumber: newCaseNumber,
            status: 'active',
            updatedAt: new Date(),
            conversationsCount: 0,
            documentsCount: 0,
            description: 'Novo caso criado.',
            documents: []
        };
        setProjects([newProject, ...projects]);
        setSelectedProject(newProject);
        setIsCreating(false);
        setNewProjectName('');
        setNewClientName('');
        setNewCaseNumber('');
    };

    const handleDeleteProject = (id: string) => {
        if (confirm("Tem certeza que deseja arquivar este projeto?")) {
            setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
            if(selectedProject?.id === id) setSelectedProject(null);
        }
    };

    // --- Mock Documents for Detail View ---
    const getMockDocs = (projId: string): ProjectDocument[] => [
        { id: 'd1', name: 'Procuração.pdf', type: 'PDF', size: '1.2 MB', uploadDate: new Date() },
        { id: 'd2', name: 'Documentos_Pessoais.pdf', type: 'PDF', size: '3.5 MB', uploadDate: new Date() },
        { id: 'd3', name: 'Inicial_Rascunho.docx', type: 'DOCX', size: '45 KB', uploadDate: new Date() }
    ];

    return (
        <div className="flex h-full bg-adv-gray overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-black/20">
                <div className="p-4 border-b border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-adv-gold" />
                            Casos & Projetos
                        </h2>
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="p-1.5 bg-adv-gold rounded-lg text-black hover:bg-adv-goldDim transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente ou processo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-adv-gold outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                         {(['all', 'active', 'archived'] as const).map(status => (
                             <button 
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${statusFilter === status ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                             >
                                 {status === 'all' ? 'Todos' : status === 'active' ? 'Ativos' : 'Arquivados'}
                             </button>
                         ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredProjects.map(project => (
                        <div 
                            key={project.id} 
                            onClick={() => setSelectedProject(project)}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer group transition-colors ${selectedProject?.id === project.id ? 'bg-white/5 border-l-2 border-l-adv-gold' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <Folder className={`w-4 h-4 ${project.status === 'archived' ? 'text-gray-600' : 'text-adv-petrol'}`} />
                                    <span className={`text-sm font-medium truncate max-w-[160px] ${selectedProject?.id === project.id ? 'text-white' : 'text-gray-300'}`}>{project.name}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                    {new Date(project.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 pl-6 mb-2 truncate">{project.clientName}</p>
                            
                            <div className="flex gap-3 pl-6">
                                <span className="flex items-center gap-1 text-[10px] text-gray-600">
                                    <MessageSquare className="w-3 h-3" /> {project.conversationsCount}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-gray-600">
                                    <FileText className="w-3 h-3" /> {project.documentsCount}
                                </span>
                                {project.caseNumber && (
                                    <span className="text-[10px] bg-white/5 px-1.5 rounded text-gray-500 font-mono">
                                        {project.caseNumber.slice(0, 10)}...
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-xs">
                            Nenhum projeto encontrado.
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content (Preview or Create) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-pattern relative">
                {isCreating && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-adv-gray border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Novo Caso/Projeto</h3>
                                <button onClick={() => setIsCreating(false)}><X className="w-5 h-5 text-gray-500 hover:text-white"/></button>
                            </div>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Nome do Caso</label>
                                    <input required type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none focus:border-adv-gold mt-1" placeholder="Ex: Silva vs Banco X"/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Cliente</label>
                                    <input required type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none focus:border-adv-gold mt-1" placeholder="Nome do Cliente"/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Processo (Opcional)</label>
                                    <input type="text" value={newCaseNumber} onChange={e => setNewCaseNumber(e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none focus:border-adv-gold mt-1" placeholder="0000000-00.0000.0.00.0000"/>
                                </div>
                                <div className="pt-4 flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-adv-gold text-black font-bold rounded hover:bg-adv-goldDim text-sm">Criar Projeto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedProject ? (
                    <div className="flex flex-col h-full animate-in fade-in">
                        {/* Detail Header */}
                        <div className="h-24 border-b border-white/10 bg-black/40 flex items-center justify-between px-8">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                                    {selectedProject.status === 'archived' && <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px] uppercase">Arquivado</span>}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {selectedProject.clientName}</span>
                                    {selectedProject.caseNumber && <span className="flex items-center gap-1 font-mono bg-white/5 px-2 rounded text-xs"><FileText className="w-3 h-3"/> {selectedProject.caseNumber}</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDeleteProject(selectedProject.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/20 rounded transition-colors" title="Arquivar">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button className="bg-adv-gold text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-adv-goldDim transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Nova Conversa
                                </button>
                            </div>
                        </div>

                        {/* Detail Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-3 gap-6">
                                {/* Left Column: Stats & Notes */}
                                <div className="col-span-1 space-y-6">
                                    <div className="bg-black/20 border border-white/10 rounded-xl p-5">
                                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Resumo</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Documentos</span>
                                                <span className="text-white font-mono">{selectedProject.documentsCount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Conversas</span>
                                                <span className="text-white font-mono">{selectedProject.conversationsCount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Última atualização</span>
                                                <span className="text-white text-xs">{new Date(selectedProject.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-black/20 border border-white/10 rounded-xl p-5 h-64 flex flex-col">
                                        <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Notas Rápidas</h4>
                                        <textarea className="flex-1 bg-transparent text-gray-300 text-sm resize-none outline-none placeholder-gray-600" placeholder="Digite notas sobre o caso aqui..."></textarea>
                                    </div>
                                </div>

                                {/* Right Column: Documents List */}
                                <div className="col-span-2">
                                    <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-adv-gold" /> Documentos do Caso
                                            </h4>
                                            <button 
                                                onClick={() => alert("Simulação: Abrindo janela de upload...")}
                                                className="text-xs text-adv-gold hover:text-white"
                                            >
                                                + Upload
                                            </button>
                                        </div>
                                        <div>
                                            {getMockDocs(selectedProject.id).map((doc) => (
                                                <div key={doc.id} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded ${doc.type === 'PDF' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-white font-medium">{doc.name}</p>
                                                            <p className="text-[10px] text-gray-500">{doc.size} • {doc.uploadDate.toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => alert(`Simulação: Iniciando download de ${doc.name}`)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="p-4 text-center">
                                                <button 
                                                    onClick={() => alert("Simulação: Carregando mais documentos...")}
                                                    className="text-xs text-gray-500 hover:text-white"
                                                >
                                                    Ver todos os arquivos
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                                        <div className="p-4 border-b border-white/10 bg-white/5">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-adv-gold" /> Histórico de Conversas
                                            </h4>
                                        </div>
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            Nenhuma conversa recente registrada para este projeto.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="max-w-md">
                            <Folder className="w-24 h-24 text-gray-700 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">Selecione um Projeto</h3>
                            <p className="text-gray-400">Gerencie documentos, histórico de conversas e informações processuais de seus clientes.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;