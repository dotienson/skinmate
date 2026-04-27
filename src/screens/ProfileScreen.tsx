import { UserData } from '../types';
import { Target, Link as LinkIcon, Star, Flame, Gift, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

export default function ProfileScreen({ userData, setActiveTab }: { userData: UserData, setActiveTab: any }) {
  const currentLevel = Math.floor(userData.exp / 100) + 1;
  const currentExp = userData.exp % 100;
  const expProgress = (currentExp / 100) * 100;

  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Check for milestone levels
  const isMilestone = currentLevel >= 10 && currentLevel % 10 === 0;

  useEffect(() => {
    if (isMilestone && !hasCelebrated) {
      celebrateLevelUp();
      setHasCelebrated(true);
    }
  }, [currentLevel, isMilestone, hasCelebrated]);

  const celebrateLevelUp = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  return (
    <div className="space-y-6 pb-20 fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Hồ Sơ</h2>
        <p className="text-sm text-gray-500 font-medium">Bảng theo dõi hành trình của bạn.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-black mb-4 uppercase">
          {userData.name.charAt(0)}
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{userData.name}</h3>
        
        <div className="flex gap-4 mt-6 w-full">
          <div className="flex-1 bg-orange-50 rounded-2xl p-4 flex flex-col items-center border border-orange-100">
            <Flame className="text-orange-500 mb-1" size={24} />
            <span className="text-xs font-bold text-orange-700 uppercase">Chuỗi ngày</span>
            <span className="text-xl font-black text-orange-800">{userData.streak}</span>
          </div>
          <div className="flex-1 bg-blue-50 rounded-2xl p-4 flex flex-col items-center border border-blue-100">
            <Star className="text-blue-500 mb-1" size={24} />
            <span className="text-xs font-bold text-blue-700 uppercase">Cấp độ</span>
            <span className="text-xl font-black text-blue-800">{currentLevel}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-end mb-2">
           <span className="font-bold text-gray-700 font-sm">Tiến trình Level {currentLevel}</span>
           <span className="text-xs text-primary-500 font-bold">{currentExp} / 100 EXP</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden w-full relative">
           <div 
             className="h-full bg-primary-400 absolute left-0 top-0 transition-all duration-1000 ease-out"
             style={{ width: `\${expProgress}%` }}
           />
        </div>
        <p className="text-xs text-gray-400 font-medium mt-3 text-center">
           Hoàn thành quiz, kiểm tra routine hoặc ghi nhật ký để nhận thêm EXP!
        </p>
      </div>

      {isMilestone && (
        <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-md">
           <Gift className="mx-auto mb-2 opacity-90" size={32} />
           <h4 className="font-black text-lg mb-1">Cột mốc Level {currentLevel}!</h4>
           <p className="text-sm font-medium opacity-90">Bạn đã mở khóa món quà đặc biệt. Theo dõi fanpage để nhận thưởng.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button 
           onClick={() => setActiveTab('reference')}
           className="w-full bg-gray-50 text-gray-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
        >
           <BookOpen size={18} /> Nguồn tài liệu khoa học
        </button>

        <a 
          href="https://facebook.com/dermabutter.vn" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <LinkIcon size={18} /> Kết nối Facebook DermaButter
        </a>
      </div>
    </div>
  );
}
