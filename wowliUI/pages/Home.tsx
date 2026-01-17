
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, WowliState, PhotoMessage } from '../types';
import WowliPet from '../components/WowliPet';

interface Props {
  user: User;
  wowli: WowliState;
  history: PhotoMessage[];
}

const Home: React.FC<Props> = ({ user, wowli, history }) => {
  const navigate = useNavigate();

  // 按日期对消息进行分组
  const groupedHistory = history.reduce((groups: { [key: string]: PhotoMessage[] }, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] pb-32">
      {/* 沉浸式顶部栏 */}
      <header className="sticky top-0 z-50 ios-blur bg-white/60 px-6 pt-12 pb-5 flex items-center justify-between border-b border-black/[0.02]">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/space')} className="relative cursor-pointer group">
            <div className="size-11 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-black/[0.03] overflow-hidden group-active:scale-90 transition-all">
               <WowliPet size="sm" className="scale-125" />
            </div>
            <div className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              {wowli.level}
            </div>
          </div>
          <div>
            <h2 className="text-[17px] font-black text-zinc-800 tracking-tight">喂，丽娜</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
               <p className="text-[11px] font-bold text-warm-gray uppercase tracking-wider">Wowli 状态 {wowli.hunger}%</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/settings')} className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-black/[0.03] text-zinc-400 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>
      </header>

      {/* 顶部互动入口 */}
      <section className="px-6 mt-6">
        <div 
          className="bg-gradient-to-br from-primary to-secondary rounded-[2.2rem] p-5 shadow-xl shadow-primary/20 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => navigate('/space')}
        >
          <div className="flex items-center gap-4">
            <div className="size-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
               <span className="text-2xl">💝</span>
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">距离下次进化</p>
              <h3 className="text-white text-base font-bold">还需 3 次互动</h3>
            </div>
          </div>
          <span className="material-symbols-outlined text-white/50">chevron_right</span>
        </div>
      </section>

      {/* 瀑布流 Feed */}
      <main className="px-6 mt-10">
        {Object.entries(groupedHistory).map(([date, messages], gIdx) => (
          <div key={date} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${gIdx * 150}ms` }}>
            <h3 className="text-[22px] font-black text-zinc-800 mb-6 flex items-center gap-3">
              {date}
              <span className="h-[2px] flex-1 bg-gradient-to-r from-black/[0.05] to-transparent"></span>
            </h3>

            <div className="space-y-12">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="relative"
                  onClick={() => navigate(`/reply/${msg.id}`)}
                >
                  {/* 照片主体卡片 */}
                  <div className="relative z-10 bg-white rounded-[2.5rem] p-2.5 shadow-2xl shadow-black/[0.04] border border-black/[0.01] overflow-hidden group active:scale-[0.99] transition-all">
                    <div className="aspect-[10/11] rounded-[2rem] overflow-hidden relative">
                      <img src={msg.imageUrl} alt="moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      
                      {/* 渐变遮罩确保文字可读 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/40"></div>
                      
                      {/* 时间戳浮层 */}
                      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-bold text-white uppercase">{new Date(msg.timestamp).getHours()}:00</span>
                      </div>
                    </div>

                    {/* 文字互动区 */}
                    <div className="px-3 py-5 space-y-4">
                      {/* 妈妈的话 (左侧) */}
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-full bg-soft-peach flex-shrink-0 border border-primary/10 flex items-center justify-center text-xs shadow-sm">
                          👩‍🍳
                        </div>
                        <div className="bg-zinc-50 rounded-2xl rounded-tl-none px-4 py-3 border border-black/[0.02]">
                          <p className="text-[14px] font-medium leading-relaxed text-zinc-700">
                            {msg.caption}
                          </p>
                        </div>
                      </div>

                      {/* 我的回应 (右侧) */}
                      {msg.reply ? (
                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-primary rounded-2xl rounded-tr-none px-4 py-3 shadow-lg shadow-primary/10">
                            <p className="text-[14px] font-bold leading-relaxed text-white">
                              {msg.reply}
                            </p>
                          </div>
                          <div className="size-8 rounded-full bg-white flex-shrink-0 border border-black/[0.05] flex items-center justify-center text-xs shadow-sm">
                            👧
                          </div>
                        </div>
                      ) : (
                        msg.senderId !== user.id && (
                          <div className="flex justify-end pr-2">
                             <div className="bg-soft-peach/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl px-6 py-3 flex items-center gap-3 animate-pulse">
                               <span className="text-[12px] font-black text-primary uppercase tracking-tight">等待你的投喂</span>
                               <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                             </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 装饰性背景 */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.8rem] -z-10 blur-xl"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* iOS 风格底部悬浮导航 */}
      <nav className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-8">
        <div className="bg-zinc-900/90 text-white ios-blur rounded-[2.5rem] h-[72px] w-full max-w-[340px] flex items-center justify-around px-4 shadow-2xl border border-white/10">
          <button className="flex flex-col items-center gap-1.5 transition-all scale-110">
            <span className="material-symbols-outlined fill text-primary">home</span>
            <div className="size-1 rounded-full bg-primary"></div>
          </button>
          
          <button 
            onClick={() => navigate('/camera')}
            className="size-14 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform -mt-10 border-[5px] border-[#FBFBFB]"
          >
            <span className="material-symbols-outlined text-white text-[28px] font-bold">add</span>
          </button>

          <button onClick={() => navigate('/space')} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-all">
            <span className="material-symbols-outlined">pets</span>
            <div className="size-1 rounded-full bg-transparent"></div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
