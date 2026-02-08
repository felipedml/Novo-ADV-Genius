import React, { useState } from 'react';
import { Users, Shield, Activity, Settings, Search, Download, Trash2, Check, X, ShieldAlert, Key, UserPlus } from 'lucide-react';
import { MOCK_USERS_LIST, MOCK_AUDIT_LOGS } from '../constants';
import { UserRole, User } from '../types';

const AdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interaction States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>(UserRole.USER);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const openInviteModal = () => {
      setIsEditing(false);
      setFormName('');
      setFormEmail('');
      setFormRole(UserRole.USER);
      setCurrentUserId(null);
      setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
      setIsEditing(true);
      setFormName(user.name);
      setFormEmail(user.email);
      setFormRole(user.role);
      setCurrentUserId(user.id);
      setIsModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isEditing && currentUserId) {
          // Edit Logic
          setUsers(users.map(u => u.id === currentUserId ? { ...u, name: formName, email: formEmail, role: formRole } : u));
          alert(`Usuário ${formName} atualizado com sucesso.`);
      } else {
          // Invite Logic
          const newUser: User = {
            id: Date.now().toString(),
            name: formName,
            email: formEmail,
            role: formRole,
            workspaceId: 'w1',
            organizationName: 'ADV Genius HQ',
            status: 'invited'
          };
          setUsers([...users, newUser]);
          
          // Log Action
          setAuditLogs(prev => [{
            id: Date.now().toString(),
            actorName: 'Dev Master',
            actorEmail: 'dev@advgenius.com.br',
            action: 'INVITE_USER',
            details: `Invited ${formEmail} as ${formRole}`,
            timestamp: new Date(),
            ipAddress: '127.0.0.1'
        }, ...prev]);
          alert(`Convite enviado para ${formEmail}`);
      }
      
      setIsModalOpen(false);
  };

  const handleRevokeUser = (userId: string) => {
      if(confirm("Tem certeza que deseja revogar o acesso deste usuário?")) {
          setUsers(users.map(u => u.id === userId ? { ...u, status: 'disabled' } : u));
           // Log Action
           setAuditLogs(prev => [{
            id: Date.now().toString(),
            actorName: 'Dev Master',
            actorEmail: 'dev@advgenius.com.br',
            action: 'REVOKE_USER',
            details: `Revoked access for user ID ${userId}`,
            timestamp: new Date(),
            ipAddress: '127.0.0.1'
        }, ...prev]);
      }
  };

  const handleExportLogs = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,Actor,Action,Details\n"
        + auditLogs.map(e => `${e.timestamp.toISOString()},${e.actorName},${e.action},"${e.details}"`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "audit_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- USERS TAB ---
  const renderUsersTab = () => (
      <div className="animate-in fade-in relative">
          {isModalOpen && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                  <div className="bg-adv-gray border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                      <h3 className="text-lg font-bold text-white mb-4">{isEditing ? 'Editar Usuário' : 'Convidar Membro'}</h3>
                      <form onSubmit={handleUserSubmit} className="space-y-4">
                          <div>
                              <label className="text-xs text-gray-400 font-bold uppercase">Nome</label>
                              <input required type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none focus:border-adv-gold"/>
                          </div>
                          <div>
                              <label className="text-xs text-gray-400 font-bold uppercase">Email</label>
                              <input required type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none focus:border-adv-gold"/>
                          </div>
                          <div>
                              <label className="text-xs text-gray-400 font-bold uppercase">Permissão</label>
                              <select value={formRole} onChange={e => setFormRole(e.target.value as UserRole)} className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none focus:border-adv-gold">
                                  <option value={UserRole.USER}>User</option>
                                  <option value={UserRole.ADMIN}>Admin</option>
                                  <option value={UserRole.MANAGER}>Manager</option>
                                  <option value={UserRole.VIEWER}>Viewer</option>
                                  <option value={UserRole.BILLING}>Billing</option>
                              </select>
                          </div>
                          <div className="flex gap-2 pt-2">
                              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-gray-400 hover:text-white">Cancelar</button>
                              <button type="submit" className="flex-1 py-2 bg-adv-gold text-black font-bold rounded hover:bg-adv-goldDim">{isEditing ? 'Salvar' : 'Enviar'}</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

          <div className="flex justify-between items-center mb-6">
              <div className="relative w-96">
                  <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Buscar usuários por nome ou email..."
                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-adv-gold outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button onClick={openInviteModal} className="bg-adv-gold text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-adv-goldDim transition-colors flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Convidar Usuário
              </button>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold">
                      <tr>
                          <th className="p-4">Usuário</th>
                          <th className="p-4">Role (Papel)</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Último Acesso</th>
                          <th className="p-4 text-right">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                  <p className="font-bold text-white">{user.name}</p>
                                  <p className="text-gray-500 text-xs">{user.email}</p>
                              </td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                      user.role === UserRole.OWNER ? 'bg-purple-900/30 text-purple-400 border-purple-500/50' :
                                      user.role === UserRole.ADMIN ? 'bg-red-900/30 text-red-400 border-red-500/50' :
                                      'bg-gray-800 text-gray-300 border-gray-600'
                                  }`}>
                                      {user.role}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <span className={`flex items-center gap-1.5 text-xs ${
                                      user.status === 'active' ? 'text-green-400' : 
                                      user.status === 'invited' ? 'text-yellow-400' : 'text-red-500'
                                  }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                          user.status === 'active' ? 'bg-green-400' : 
                                          user.status === 'invited' ? 'bg-yellow-400' : 'bg-red-500'
                                      }`} />
                                      {user.status === 'active' ? 'Ativo' : user.status === 'invited' ? 'Convidado' : 'Revogado'}
                                  </span>
                              </td>
                              <td className="p-4 text-gray-500 text-xs font-mono">
                                  {user.lastLogin ? user.lastLogin.toLocaleDateString() : '-'}
                              </td>
                              <td className="p-4 text-right">
                                  {user.status !== 'disabled' && (
                                      <>
                                        <button onClick={() => openEditModal(user)} className="text-gray-500 hover:text-white mr-3">Editar</button>
                                        <button onClick={() => handleRevokeUser(user.id)} className="text-red-500 hover:text-red-400">Revogar</button>
                                      </>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  // --- AUDIT TAB ---
  const renderAuditTab = () => (
      <div className="animate-in fade-in space-y-4">
          <div className="flex justify-end mb-2">
              <button onClick={handleExportLogs} className="text-xs text-adv-gold hover:text-white flex items-center gap-1 border border-adv-gold/30 px-3 py-1.5 rounded hover:bg-adv-gold/10 transition-colors">
                  <Download className="w-3 h-3" /> Exportar CSV
              </button>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden shadow-xl">
             <table className="w-full text-left text-sm">
                 <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold">
                     <tr>
                         <th className="p-4">Timestamp</th>
                         <th className="p-4">Ator</th>
                         <th className="p-4">Ação</th>
                         <th className="p-4">Detalhes</th>
                         <th className="p-4">IP</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 font-mono text-xs">
                     {auditLogs.map(log => (
                         <tr key={log.id} className="hover:bg-white/5">
                             <td className="p-4 text-gray-500">{log.timestamp.toLocaleString()}</td>
                             <td className="p-4 text-white">{log.actorName}</td>
                             <td className="p-4">
                                 <span className={`px-1.5 py-0.5 rounded ${
                                     ['REVOKE_USER', 'DELETE_PROJECT'].includes(log.action) ? 'bg-red-900/50 text-red-400' : 
                                     log.action === 'EXPORT_DATA' ? 'bg-yellow-900/50 text-yellow-400' : 
                                     'text-blue-400'
                                 }`}>
                                     {log.action}
                                 </span>
                             </td>
                             <td className="p-4 text-gray-300">{log.details}</td>
                             <td className="p-4 text-gray-600">{log.ipAddress}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
          </div>
      </div>
  );

  // --- SETTINGS TAB ---
  const renderSettingsTab = () => (
      <div className="max-w-2xl animate-in fade-in space-y-8">
          {/* General */}
          <section className="space-y-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <Settings className="w-5 h-5 text-adv-gold" /> Geral
             </h3>
             <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
                 <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">Nome da Organização</label>
                     <input type="text" defaultValue="ADV Genius HQ" className="w-full bg-black border border-white/10 rounded p-2 text-white focus:border-adv-gold outline-none" />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">Domínio Autorizado</label>
                     <input type="text" value="@advgenius.com.br" disabled className="w-full bg-black border border-white/10 rounded p-2 text-gray-500 cursor-not-allowed" />
                 </div>
                 <div className="pt-2 text-right">
                    <button 
                        onClick={() => alert("Configurações gerais atualizadas com sucesso.")}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
                    >
                        Salvar Alterações
                    </button>
                 </div>
             </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-red-500" /> Segurança & Compliance
             </h3>
             <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
                 <div className="flex items-center justify-between">
                     <div>
                         <p className="font-bold text-white">Forçar Autenticação 2FA</p>
                         <p className="text-xs text-gray-500">Exige OTP por e-mail para todos os logins.</p>
                     </div>
                     <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow" />
                     </div>
                 </div>
                 <hr className="border-white/5" />
                 <div className="flex items-center justify-between">
                     <div>
                         <p className="font-bold text-white">Retenção de Logs (Audit)</p>
                         <p className="text-xs text-gray-500">Período mínimo de armazenamento legal.</p>
                     </div>
                     <select className="bg-black border border-white/10 rounded text-xs p-1 text-white outline-none">
                         <option>5 Anos (Lei Geral)</option>
                         <option>10 Anos</option>
                     </select>
                 </div>
             </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-4 pt-4">
             <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 flex items-center justify-between">
                 <div>
                     <p className="font-bold text-red-400">Encerrar Workspace</p>
                     <p className="text-xs text-red-900/70">Esta ação é irreversível e excluirá todos os dados.</p>
                 </div>
                 <button onClick={() => alert("Ação bloqueada: Contate o suporte para exclusão de conta Owner.")} className="bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white px-4 py-2 rounded font-bold text-xs transition-colors">
                     Excluir Conta
                 </button>
             </div>
          </section>
      </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-adv-gray text-white">
        {/* Header */}
        <div className="h-20 border-b border-white/10 flex items-center px-8 bg-black/50 justify-between">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-adv-gold" />
                    Admin Console
                </h1>
                <p className="text-xs text-gray-500 mt-1">Gestão de usuários, auditoria e segurança.</p>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-adv-gold text-black shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Users className="w-4 h-4" /> Usuários
                </button>
                <button 
                    onClick={() => setActiveTab('audit')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'audit' ? 'bg-adv-gold text-black shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Activity className="w-4 h-4" /> Auditoria
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-adv-gold text-black shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Settings className="w-4 h-4" /> Configurações
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'audit' && renderAuditTab()}
            {activeTab === 'settings' && renderSettingsTab()}
        </div>
    </div>
  );
};

export default AdminConsole;