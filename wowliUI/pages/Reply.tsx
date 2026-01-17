
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoMessage, AICoachResponse } from '../types';
import { analyzePhotoForCoaching } from '../services/geminiService';
import WowliPet from '../components/WowliPet';

interface Props {
  history: PhotoMessage[];
  onReply: (id: string, text: string) => void;
}

const Reply: React.FC<Props> = ({ history, onReply }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const msg = history.find(m => m.id === id);
  
  const [replyText, setReplyText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AICoachResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (msg && !aiAnalysis && !isAnalyzing) {
      const getAI = async () => {
        setIsAnalyzing(true);
        const result = await analyzePhotoForCoaching(msg.imageUrl, msg.caption);
        setAiAnalysis(result);
        setIsAnalyzing(false);
      };
      getAI();
    }
  }, [msg]);

  const handleSubmit = () => {
    if (msg && replyText) {
      onReply(msg.id, replyText);
      navigate('/home');
    }
  };

  if (!msg) return null;

  return (
    <div className="flex flex-col h-screen bg-background-light">
      <header className="px-5 pt-12 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="size-8 flex items-center justify-center rounded-full bg-black/[0.03]">
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <h1 className="flex-1 text-[15px] font-bold text-center pr-8 text-zinc-800">回应当下的温暖</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-2 pb-32">
        <div className="aspect-[4/3] w-full rounded-[1.2rem] overflow-hidden ios-card mb-6 relative">
          <img src={msg.imageUrl} alt="Shared" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-[12px] font-medium text-white">{msg.caption}</p>
          </div>
        </div>

        {/* AI Coaching Refined */}
        <div className="bg-white rounded-[1.5rem] p-5 ios-card border-none relative overflow-hidden">
           <div className="flex items-center gap-2 mb-4">
              <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary text-[14px] fill">auto_awesome</span>
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Wowli 教练</span>
           </div>

           {isAnalyzing ? (
             <div className="flex flex-col items-center py-6">
                <div className="size-12">
                   <WowliPet mood="thinking" size="sm" />
                </div>
                <p className="text-[11px] text-warm-gray mt-4 font-medium animate-pulse">正在解读妈妈的心情...</p>
             </div>
           ) : aiAnalysis && (
             <div className="space-y-4">
               <p className="text-[13px] text-zinc-700 leading-[1.6]">
                 {aiAnalysis.sentiment}
               </p>
               
               <div className="p-4 bg-soft-peach/50 rounded-xl border border-primary/5">
                 <p className="text-[11px] font-bold text-primary mb-1 uppercase tracking-tighter">尝试这样回复：</p>
                 <p className="text-[14px] font-bold text-zinc-800 leading-snug">“{aiAnalysis.samplePhrase}”</p>
                 <button 
                   onClick={() => setReplyText(aiAnalysis.samplePhrase)}
                   className="mt-4 w-full py-2.5 bg-white rounded-lg text-[12px] font-bold text-primary shadow-sm active:scale-[0.98] transition-all"
                 >
                   复制到回复框
                 </button>
               </div>
             </div>
           )}
        </div>
      </main>

      {/* iOS style input bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-black/[0.03] px-5 pt-3 pb-10">
        <div className="flex items-center gap-3 bg-black/[0.03] rounded-[1.5rem] px-4 py-1">
          <input 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-2.5 placeholder-zinc-400" 
            placeholder="写下你的回复..." 
          />
          <button 
            onClick={handleSubmit}
            disabled={!replyText}
            className={`size-8 rounded-full flex items-center justify-center transition-all ${replyText ? 'bg-primary text-white' : 'bg-zinc-200 text-zinc-400'}`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reply;
