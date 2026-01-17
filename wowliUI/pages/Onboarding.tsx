
import React, { useState } from 'react';
import { Role, User } from '../types';

interface Props {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [role, setRole] = useState<Role>('daughter');
  const [inviteCode, setInviteCode] = useState('');

  const handlePair = () => {
    onComplete({
      id: role === 'daughter' ? 'daughter_id' : 'mom_id',
      role,
      name: role === 'daughter' ? '丽娜' : '苏珊',
      partnerId: role === 'daughter' ? 'mom_id' : 'daughter_id'
    });
  };

  return (
    <div className="flex flex-col px-8 pt-24 pb-12 h-screen bg-background-light">
      <div className="flex flex-col items-center mb-16">
        <div className="size-20 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/20 transform rotate-[10deg]">
          <span className="text-4xl">🐾</span>
        </div>
        <h1 className="text-xl font-black mt-8 tracking-tight text-zinc-800">Wowli Connection</h1>
        <p className="text-[13px] text-warm-gray mt-2 text-center leading-relaxed font-medium">
          跨越时空与代际，<br/>让爱在每一次小小的投喂中传递。
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center mb-4">你是谁？</p>
          <div className="bg-black/[0.03] p-1 rounded-2xl flex gap-1 border border-black/[0.02]">
            {(['daughter', 'mom'] as const).map((r) => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 px-4 rounded-[14px] text-[13px] font-bold transition-all ${role === r ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400'}`}
              >
                {r === 'daughter' ? '女儿' : '妈妈'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-[1.2rem] p-5 ios-card border-none">
            <p className="text-[11px] font-bold text-zinc-400 mb-3">配对邀请码</p>
            <input 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full bg-black/[0.03] border-none focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-zinc-300"
              placeholder="请输入 6 位邀请码"
            />
            <button 
              onClick={handlePair}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[13px] mt-4 shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
            >
              进入 Wowli 世界
            </button>
          </div>
          
          <button className="w-full py-3 text-[11px] font-bold text-warm-gray/60 uppercase tracking-widest hover:text-primary transition-colors">
            没有码？生成我的邀请码
          </button>
        </div>
      </div>

      <footer className="mt-auto text-center">
        <p className="text-[10px] text-zinc-300 font-medium">
          点击即代表同意 <span className="underline">服务条款</span> 与 <span className="underline">隐私政策</span>
        </p>
      </footer>
    </div>
  );
};

export default Onboarding;
