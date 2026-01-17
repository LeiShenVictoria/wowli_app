
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WowliPet from '../components/WowliPet';
import { WowliState, PhotoMessage } from '../types';

interface Props {
  wowli: WowliState;
  history: PhotoMessage[];
}

const WidgetGuide: React.FC<Props> = ({ wowli, history }) => {
  const navigate = useNavigate();
  const lastPhoto = history[0];
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7] overflow-hidden">
      {/* iOS Style Fixed Header - 确保 z-index 足够高 */}
      <header className="h-[100px] px-4 pt-10 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-black/[0.03] z-50 relative">
        <button 
          onClick={() => navigate('/settings')} 
          className="size-10 flex items-center justify-center rounded-full active:bg-zinc-100 transition-colors"
          aria-label="返回"
        >
          <span className="material-symbols-outlined text-zinc-800 text-[24px]">chevron_left</span>
        </button>
        
        <h1 className="text-[15px] font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2">小组件指南</h1>
        
        <button 
          onClick={() => navigate('/settings')}
          className="px-3 py-1.5 rounded-full active:bg-zinc-100 transition-colors"
        >
          <span className="text-[14px] font-bold text-primary">完成</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-10">
        {/* 顶部引导说明 */}
        <section className="text-center px-4 py-2">
          <p className="text-[13px] text-warm-gray leading-relaxed font-medium">
            将 Wowli 添加到桌面，<br/>无需打开 App 也能感受彼此的陪伴。
          </p>
        </section>

        {/* 2x2 组件展示 */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">2x2 状态组件 (小)</h2>
          <div className="flex justify-center">
            <div className="w-[155px] h-[155px] bg-white rounded-[1.8rem] shadow-xl p-4 flex flex-col items-center justify-between border border-black/[0.02]">
               <WowliPet size="sm" mood={wowli.hunger < 30 ? 'hungry' : 'happy'} className="mt-2 scale-110" />
               <div className="w-full">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-[9px] font-bold text-primary uppercase">Hungry</span>
                    <span className="text-[9px] font-bold text-zinc-300">{wowli.hunger}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: `${wowli.hunger}%`}}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 4x2 组件展示 */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">4x2 互动组件 (中)</h2>
          <div className="flex justify-center">
            <div className="w-[329px] h-[155px] bg-white rounded-[1.8rem] shadow-xl overflow-hidden flex border border-black/[0.02] active:scale-[0.98] transition-transform cursor-pointer" onClick={() => navigate(`/reply/${lastPhoto.id}`)}>
               <div className="w-1/2 p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Today</p>
                    <p className="text-[13px] font-bold text-zinc-800 mt-1 leading-tight">妈妈想你了</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="size-6 bg-soft-peach rounded-full flex items-center justify-center border border-primary/10">
                        <span className="text-xs">🐾</span>
                     </div>
                     <span className="text-[10px] text-warm-gray font-medium">LV.{wowli.level}</span>
                  </div>
               </div>
               <div className="w-1/2 relative">
                  <img src={lastPhoto?.imageUrl} className="w-full h-full object-cover" alt="Last shared" />
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md size-7 rounded-full flex items-center justify-center shadow-sm">
                     <span className="material-symbols-outlined text-primary text-[14px]">reply</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 4x4 组件展示 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">4x4 全能组件 (大)</h2>
            <span className="text-[9px] text-primary font-bold animate-pulse">点击图片预览动态内容</span>
          </div>
          <div className="flex justify-center pb-12">
            <div className="w-[329px] h-[329px] bg-white rounded-[1.8rem] shadow-xl p-6 flex flex-col border border-black/[0.02]">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <WowliPet size="sm" />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-800">Wowli 正在休息</h3>
                      <p className="text-[11px] text-warm-gray">成长值 1240 / 2000</p>
                    </div>
                  </div>
                  <div className="bg-soft-peach px-3 py-1 rounded-full border border-primary/20">
                    <span className="text-[10px] font-bold text-primary">LV.{wowli.level}</span>
                  </div>
               </div>
               
               <div 
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 rounded-2xl overflow-hidden relative mb-4 cursor-pointer active:scale-[0.97] transition-all group"
               >
                  <img src={lastPhoto?.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Snapshot" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md uppercase shadow-lg">New Moment</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-50 rounded-xl p-3 flex items-center gap-3 active:bg-zinc-100 transition-colors" onClick={() => navigate('/camera')}>
                     <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                     <span className="text-[11px] font-bold text-zinc-600">快捷拍照</span>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-3 flex items-center gap-3 active:bg-zinc-100 transition-colors" onClick={() => navigate('/space')}>
                     <span className="material-symbols-outlined text-sage text-[18px]">favorite</span>
                     <span className="text-[11px] font-bold text-zinc-600">投喂记录</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* 动态照片预览覆盖层 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
            onClick={() => setIsPreviewOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-[420px] px-6 animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center">
            <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative">
              <img 
                src={lastPhoto?.imageUrl} 
                className="w-full h-full object-cover animate-wowli-float" 
                style={{ animationDuration: '8s' }} 
                alt="Full Preview" 
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8">
                <p className="text-white text-lg font-bold leading-tight">
                  {lastPhoto?.caption}
                </p>
                <div className="flex items-center gap-2 mt-3 opacity-60">
                   <span className="material-symbols-outlined text-white text-sm">schedule</span>
                   <span className="text-white text-[10px] font-bold uppercase tracking-widest">2小时前投递</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4 w-full">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="flex-1 py-4 rounded-2xl bg-white/10 text-white text-[13px] font-bold backdrop-blur-md border border-white/10 active:scale-95 transition-all"
              >
                关闭预览
              </button>
              <button 
                onClick={() => navigate(`/reply/${lastPhoto.id}`)}
                className="flex-[2] py-4 rounded-2xl bg-primary text-white text-[13px] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">reply</span>
                立即回应
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white/90 backdrop-blur-md border-t border-black/[0.03] p-6 text-center">
         <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-[14px] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
           去桌面添加小组件
         </button>
      </footer>
    </div>
  );
};

export default WidgetGuide;
