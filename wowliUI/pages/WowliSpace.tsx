
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WowliState } from '../types';
import WowliPet from '../components/WowliPet';

interface Props {
  wowli: WowliState;
}

const WowliSpace: React.FC<Props> = ({ wowli }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
          <span className="material-symbols-outlined text-warm-gray">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold flex-1 ml-4">Wowli 空间</h1>
        <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </header>

      <section className="flex flex-col items-center mt-6">
        <div className="bg-sage/10 px-4 py-1.5 rounded-full border border-sage/20 mb-2">
          <span className="text-[10px] font-bold text-sage tracking-widest uppercase">成长树</span>
        </div>
        <div className="text-sage mb-4 animate-bounce">
          <span className="material-symbols-outlined text-4xl fill">arrow_upward</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-8 py-2.5 rounded-full shadow-sm border border-primary/10">
          <span className="text-sm font-bold text-primary tracking-tight">亲密度等级：{wowli.level}</span>
        </div>
      </section>

      <section className="flex-1 flex flex-col items-center justify-center py-8 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
           <div className="w-64 h-64 border-4 border-primary rounded-full"></div>
           <div className="absolute w-80 h-80 border border-primary rounded-full"></div>
        </div>
        
        <WowliPet size="lg" mood={wowli.hunger < 20 ? 'hungry' : 'happy'} />
        
        <div className="mt-12 bg-white/40 backdrop-blur rounded-2xl px-6 py-3 border border-white">
          <p className="text-xs font-bold text-warm-gray text-center">
            {wowli.hunger > 50 ? 'Wowli 感觉很有活力！' : 'Wowli 似乎有点饿了...'}
          </p>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-warm-gray/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary fill">workspace_premium</span>
              <h2 className="text-lg font-bold">成就墙</h2>
            </div>
            <button className="text-xs text-warm-gray font-bold">查看全部</button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: 'camera', label: '分享达人', color: 'bg-orange-100', text: 'text-orange-400' },
              { icon: 'dark_mode', label: '晚安天使', color: 'bg-blue-100', text: 'text-blue-400' },
              { icon: 'favorite', label: '暖心陪伴', color: 'bg-pink-100', text: 'text-pink-400' },
              { icon: 'lock', label: '待解锁', color: 'bg-slate-50', text: 'text-slate-300', locked: true }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center border-2 border-white shadow-sm`}>
                  <span className={`material-symbols-outlined ${item.text} ${!item.locked ? 'fill' : ''}`}>{item.icon}</span>
                </div>
                <span className={`text-[10px] font-bold ${item.locked ? 'text-slate-300' : 'text-warm-gray'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WowliSpace;
