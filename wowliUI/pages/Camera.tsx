
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onPost: (imageUrl: string, caption: string) => void;
}

const Camera: React.FC<Props> = ({ onPost }) => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isFlash, setIsFlash] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化摄像头
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', aspectRatio: 1 }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("相机开启失败:", err);
        setHasPermission(false);
      }
    }

    if (!preview) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [preview]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // 拍照逻辑
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        setIsFlash(true);
        setTimeout(() => setIsFlash(false), 150);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (preview) {
      onPost(preview, caption || '看看我的今日瞬间');
      navigate('/home');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 z-20">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur active:scale-90 transition-transform">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="bg-primary/20 px-4 py-1.5 rounded-full border border-primary/30">
          <p className="text-xs font-bold text-primary tracking-widest uppercase">Wowli Camera</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur active:scale-90 transition-transform">
          <span className="material-symbols-outlined">photo_library</span>
        </button>
      </header>

      {/* Viewfinder / Preview Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <div 
          className="w-full aspect-square max-w-[360px] relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border-4 border-white/20 shadow-2xl transition-all duration-500"
          onClick={() => preview && inputRef.current?.focus()}
        >
          {preview ? (
            <div className="w-full h-full relative">
              <img src={preview} alt="Capture" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-300" />
              
              {/* 文字叠加层 (直接在照片上) */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <input 
                  ref={inputRef}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  autoFocus
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center font-medium shadow-2xl"
                  placeholder="说点什么吧..."
                />
              </div>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="size-20 border border-primary/40 rounded-sm animate-pulse"></div>
              </div>
              {hasPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 p-8 text-center">
                   <span className="material-symbols-outlined text-4xl text-zinc-500 mb-4">videocam_off</span>
                   <p className="text-sm font-bold text-zinc-300">无法访问摄像头</p>
                </div>
              )}
            </>
          )}
          
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-10 pointer-events-none">
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
          </div>

          {isFlash && <div className="absolute inset-0 bg-white animate-in fade-in fade-out duration-150 z-50"></div>}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="pb-16 flex flex-col items-center gap-10 z-20">
        {preview ? (
          <div className="flex gap-4 w-full max-w-[360px] px-6">
            <button 
              onClick={() => { setPreview(null); setCaption(''); }} 
              className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-bold text-[13px] backdrop-blur active:scale-95 transition-all border border-white/5"
            >
              放弃
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold text-[13px] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>确认投喂</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-12">
            <button className="size-12 rounded-full bg-white/10 flex items-center justify-center opacity-40">
              <span className="material-symbols-outlined">flash_off</span>
            </button>
            
            <div className="relative group">
              <div className="absolute inset-[-12px] rounded-full border-2 border-white/20 group-active:scale-90 transition-transform"></div>
              <button 
                onClick={takePhoto}
                className="size-20 rounded-full bg-white border-[6px] border-primary shadow-lg active:scale-90 transition-transform flex items-center justify-center"
              >
                <div className="size-14 rounded-full bg-primary/5 flex items-center justify-center">
                  <div className="size-4 rounded-full bg-primary animate-pulse"></div>
                </div>
              </button>
            </div>

            <button className="size-12 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
              <span className="material-symbols-outlined">flip_camera_ios</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Camera;
