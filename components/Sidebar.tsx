import React from 'react';
import { 
  LayoutGrid, 
  MessageSquare, 
  FolderOpen, 
  Bot, 
  GraduationCap, 
  Settings, 
  LogOut,
  ShieldAlert,
  CreditCard,
  Code
} from 'lucide-react';
import { User, ViewState, UserRole } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  currentUser: User;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onChangeView, onLogout }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Início', icon: LayoutGrid },
    { id: ViewState.CHAT, label: 'Conversas', icon: MessageSquare },
    { id: ViewState.MY_ASSISTANTS, label: 'Meus Assistentes', icon: Bot },
    { id: ViewState.TRAININGS, label: 'Treinamentos', icon: GraduationCap },
  ];

  const isAdmin = [UserRole.OWNER, UserRole.ADMIN, UserRole.DEVELOPER].includes(currentUser.role);
  const isDev = currentUser.role === UserRole.DEVELOPER || currentUser.role === UserRole.OWNER;

  return (
    <aside className="w-64 bg-black border-r border-white/10 flex flex-col h-full sticky top-0 z-20">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Logo className="w-8 h-8 mr-3" />
        <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight leading-none">ADV Genius</span>
            <span className="text-[10px] text-adv-gold font-medium tracking-widest mt-1">HUB JURÍDICO</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewState)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id 
                ? 'bg-adv-petrol/20 text-adv-gold border border-adv-gold/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 ${currentView === item.id ? 'text-adv-gold' : 'text-gray-500'}`} />
            {item.label}
          </button>
        ))}

        <div className="pt-6 mt-6 border-t border-white/10">
          <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Workspace</p>
          <button
            onClick={() => onChangeView(ViewState.SETTINGS)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === ViewState.SETTINGS 
                ? 'bg-adv-petrol/20 text-adv-gold' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderOpen className="w-5 h-5 mr-3 text-gray-500" />
            Projetos
          </button>
          
          {isAdmin && (
             <button
                onClick={() => onChangeView(ViewState.ADMIN)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === ViewState.ADMIN 
                    ? 'bg-adv-petrol/20 text-adv-gold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-5 h-5 mr-3 text-gray-500" />
                Admin & Permissões
              </button>
          )}

           {isDev && (
             <button
                onClick={() => onChangeView(ViewState.DEV_STUDIO)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === ViewState.DEV_STUDIO
                    ? 'bg-adv-petrol/20 text-adv-gold border border-adv-gold/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Code className="w-5 h-5 mr-3 text-gray-500" />
                Dev Studio
              </button>
          )}

           {currentUser.role === UserRole.OWNER && (
             <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-white/5">
                <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                Billing & Faturas
              </button>
          )}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 bg-black">
        <div className="flex items-center w-full p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-adv-gold flex items-center justify-center text-adv-black font-bold text-xs shadow-lg shadow-adv-gold/20">
            {currentUser.name.charAt(0)}
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-adv-gold truncate uppercase tracking-wider">{currentUser.role}</p>
          </div>
          <LogOut 
            className="w-4 h-4 text-gray-500 hover:text-red-400 transition-colors" 
            onClick={(e) => { e.stopPropagation(); onLogout(); }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;