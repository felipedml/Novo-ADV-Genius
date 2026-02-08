import React, { useState } from 'react';
import { PlayCircle, Clock, Search, UploadCloud, X } from 'lucide-react';
import { MOCK_TRAININGS } from '../constants';
import { TrainingModule } from '../types';

const Trainings: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<TrainingModule | null>(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 animate-in fade-in duration-500 relative">
      {selectedVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 backdrop-blur-md animate-in zoom-in-95">
              <div className="bg-adv-gray border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black">
                      <h3 className="text-lg font-bold text-white">{selectedVideo.title}</h3>
                      <button onClick={() => setSelectedVideo(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
                  </div>
                  <div className="aspect-video bg-black flex items-center justify-center relative group">
                      {/* Simulation of a player */}
                      <img src={selectedVideo.thumbnailUrl} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-20 h-20 text-adv-gold animate-pulse cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                          <div className="h-full bg-red-600 w-1/3 relative">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow"></div>
                          </div>
                      </div>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      <div className="flex items-center gap-4 mb-4">
                          <span className="text-xs font-bold text-adv-gold border border-adv-gold px-2 py-1 rounded">{selectedVideo.category}</span>
                          <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedVideo.duration}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{selectedVideo.description}</p>
                      
                      <div className="mt-8 border-t border-white/10 pt-6">
                          <h4 className="font-bold text-white mb-4">Arquivos de Apoio</h4>
                          <div className="flex gap-4">
                              <button className="bg-white/5 border border-white/10 rounded p-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
                                  <div className="bg-red-900/30 text-red-400 p-2 rounded"><FileIcon /></div>
                                  <div className="text-left">
                                      <p className="text-sm font-bold text-white">Slides da Aula.pdf</p>
                                      <p className="text-[10px] text-gray-500">2.4 MB</p>
                                  </div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-bold mb-2 text-white">Treinamentos</h1>
           <p className="text-gray-400">Aprimore suas habilidades com a Advogado 4.0 Academy.</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload de Vídeo
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
        <input
            type="text"
            placeholder="Buscar treinamentos..."
            className="w-full md:w-96 bg-adv-gray border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-adv-gold focus:ring-1 focus:ring-adv-gold outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TRAININGS.map((training) => (
          <div 
            key={training.id} 
            onClick={() => setSelectedVideo(training)}
            className="group bg-adv-gray border border-white/5 rounded-xl overflow-hidden hover:border-adv-gold/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <div className="relative aspect-video bg-black">
              <img src={training.thumbnailUrl} alt={training.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <PlayCircle className="w-12 h-12 text-adv-gold drop-shadow-lg" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {training.duration}
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold text-adv-gold uppercase tracking-wider">{training.category}</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 leading-tight">{training.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{training.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FileIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default Trainings;