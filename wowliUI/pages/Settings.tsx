
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '互动设置',
      items: [
        { icon: 'widgets', label: '小组件设置指南', color: 'text-orange-400', path: '/widgets' },
        { icon: 'notifications', label: '消息通知', color: 'text-sage', toggle: true }
      ]
    },
    {
      title: '账号管理',
      items: [
        { icon: 'person_search', label: '修改配对对象', color: 'text-blue-400' },
        { icon: 'lock_person', label: '隐私与安全', color: 'text-zinc-400' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7] overflow-hidden">
      {/* iOS Style Fixed Header - 增加 z-index 和点击热区 */}
      <header className="h-[100px] px-4 pt-10 flex items-center bg-white/80 backdrop-blur-xl border-b border-black/[0.03] z-50 relative">
        <button 
          onClick={() => navigate('/')} 
          className="size-10 flex items-center justify-center rounded-full active:bg-zinc-100 transition-colors"
          aria-label="返回主页"
        >
          <span className="material-symbols-outlined text-zinc-800 text-[24px]">chevron_left</span>
        </button>
        
        <h1 className="text-[15px] font-bold text-zinc-800 absolute left-1/2 -translate-x-1/2">设置</h1>
        
        <div className="size-10"></div> {/* 占位平衡 */}
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {sections.map((section, sidx) => (
          <div key={sidx} className="space-y-2">
            <h2 className="px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{section.title}</h2>
            <div className="bg-white rounded-[1.2rem] overflow-hidden border border-black/[0.02] shadow-sm">
              {section.items.map((item, iidx) => (
                <div 
                  key={iidx} 
                  onClick={() => item.path && navigate(item.path)}
                  className="flex items-center justify-between px-4 py-4 border-b border-zinc-50 last:border-0 active:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg flex items-center justify-center bg-zinc-50`}>
                      <span className={`material-symbols-outlined ${item.color} text-[20px]`}>{item.icon}</span>
                    </div>
                    <span className="text-[14px] font-medium text-zinc-800">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <div className="w-11 h-6 bg-primary rounded-full relative p-1 transition-colors">
                      <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-md"></div>
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-zinc-300 text-[18px]">chevron_right</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-10 space-y-4 px-2">
          <button className="w-full bg-white text-red-500 py-4 rounded-[1.2rem] text-[14px] font-bold shadow-sm active:scale-[0.98] active:bg-zinc-50 transition-all border border-black/[0.02]">
            退出登录
          </button>
          <p className="text-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest py-4">
            Wowli for iOS v1.2.4 (Build 42)
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
