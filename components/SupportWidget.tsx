import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Paperclip, Minimize2, Video, Mic, Image as ImageIcon, PlayCircle, HelpCircle } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { Message } from '../types';
import { SUPPORT_SYSTEM_PROMPT } from '../constants';
import ReactMarkdown from 'react-markdown';

const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      {
          id: 'welcome',
          role: 'model',
          content: 'Olá! Sou o **Geni**, o suporte inteligente do ADV Genius. \n\nPosso te ajudar com dúvidas sobre a plataforma, configurações de API, billing ou tutoriais em vídeo. Como posso ajudar?',
          timestamp: new Date()
      }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

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

    // Use default Platform API Key (implicit in service)
    const responseText = await sendMessageToGemini(
      messages, 
      userMsg.content, 
      SUPPORT_SYSTEM_PROMPT,
      { modelId: 'gemini-3-flash-preview' } as any 
    );

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  // Mock Multimedia Actions
  const handleMultimediaRequest = (type: 'video' | 'audio' | 'image') => {
      const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `[Solicitação de ${type === 'video' ? 'Vídeo Tutorial' : type === 'audio' ? 'Áudio Explicativo' : 'Captura de Tela'}]`,
          timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      setTimeout(() => {
          let content = "";
          if(type === 'video') content = "Aqui está um vídeo tutorial rápido sobre como configurar sua chave de API:\n\n![Video Tutorial](https://placehold.co/300x180/1a1a1a/FFF?text=Video+Tutorial:+Configurar+BYOK)\n*(Clique para reproduzir)*";
          if(type === 'audio') content = "Gravei uma explicação rápida para você:\n\n▶️ 🔘────────── 01:45\n\n*Áudio gerado por TTS V2*";
          if(type === 'image') content = "Veja nesta captura de tela onde encontrar o menu de Billing:\n\n![Screenshot](https://placehold.co/300x200/2a2a2a/FFF?text=Menu+Billing+Screenshot)";
          
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'model',
              content: content,
              timestamp: new Date()
          }]);
          setIsLoading(false);
      }, 1500);
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-adv-gold hover:bg-adv-goldDim text-black rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 z-50 animate-in zoom-in"
            title="Suporte ADV Genius"
          >
              <HelpCircle className="w-8 h-8" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-black"></span>
          </button>
      );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-adv-gray border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        {/* Header */}
        <div 
            className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-adv-petrol to-adv-petrolDark rounded-t-2xl cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <img src="https://ui-avatars.com/api/?background=D9AA43&color=000&name=Geni" className="w-full h-full rounded-full" alt="Geni" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Suporte ADV Genius</h3>
                    <p className="text-[10px] text-adv-gold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="text-white/70 hover:text-white">
                    <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-white/70 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
            <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-adv-gold text-black rounded-tr-sm' 
                                : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                            }`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 p-2 rounded-xl rounded-tl-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-black/60 border-t border-white/10">
                    {/* Multimedia Quick Actions */}
                    <div className="flex justify-center gap-4 mb-3 border-b border-white/5 pb-2">
                         <button onClick={() => handleMultimediaRequest('video')} className="text-[10px] text-gray-400 hover:text-adv-gold flex flex-col items-center gap-1 transition-colors">
                             <Video className="w-4 h-4" /> Vídeo
                         </button>
                         <button onClick={() => handleMultimediaRequest('audio')} className="text-[10px] text-gray-400 hover:text-adv-gold flex flex-col items-center gap-1 transition-colors">
                             <Mic className="w-4 h-4" /> Áudio
                         </button>
                         <button onClick={() => handleMultimediaRequest('image')} className="text-[10px] text-gray-400 hover:text-adv-gold flex flex-col items-center gap-1 transition-colors">
                             <ImageIcon className="w-4 h-4" /> Imagem
                         </button>
                    </div>

                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Digite sua dúvida..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-white focus:border-adv-gold outline-none"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputText.trim() || isLoading}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-adv-gold text-black rounded-md hover:bg-adv-goldDim transition-colors disabled:opacity-50"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            </>
        )}
    </div>
  );
};

export default SupportWidget;