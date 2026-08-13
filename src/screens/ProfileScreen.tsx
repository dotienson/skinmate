import { UserData } from '../types';
import { Target, Link as LinkIcon, Star, Flame, Gift, BookOpen, Download, MessageCircle } from 'lucide-react';
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

  const exportToWord = () => {
    const sortedEvents = (userData.calendarEvents || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedLogs = (userData.photos || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let eventsHtml = '';
    if (sortedEvents.length === 0) {
      eventsHtml = '<p style="font-family: Arial, sans-serif; font-size: 11pt;">Không có dữ liệu sự kiện.</p>';
    } else {
      eventsHtml = '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 24px;">';
      eventsHtml += `
        <tr style="background-color: #fce7f3;">
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: left; width: 20%; color: #9d174d;">Ngày</th>
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: left; width: 25%; color: #9d174d;">Phân loại / Sự kiện</th>
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: left; width: 55%; color: #9d174d;">Chi tiết</th>
        </tr>
      `;
      sortedEvents.forEach(ev => {
        const typeStr = ev.type === 'checkup' ? 'Khám/Tái khám' : ev.type === 'treatment' ? 'Liệu trình' : 'Ghi chú';
        eventsHtml += `
          <tr>
            <td style="border: 1px solid #fbcfe8; padding: 10px;">${ev.date}</td>
            <td style="border: 1px solid #fbcfe8; padding: 10px;"><strong>${ev.title}</strong><br/><span style="color:#6b7280; font-size: 10pt;">${typeStr}</span></td>
            <td style="border: 1px solid #fbcfe8; padding: 10px;">${ev.notes ? ev.notes.replace(/\n/g, '<br/>') : ''}</td>
          </tr>
        `;
      });
      eventsHtml += '</table>';
    }

    let logsHtml = '';
    if (sortedLogs.length === 0) {
      logsHtml = '<p style="font-family: Arial, sans-serif; font-size: 11pt;">Không có dữ liệu nhật ký.</p>';
    } else {
      logsHtml = '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 24px;">';
      logsHtml += `
        <tr style="background-color: #fce7f3;">
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: center; color: #9d174d;">Ngày</th>
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: center; color: #9d174d;">Khô da</th>
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: center; color: #9d174d;">Châm chích</th>
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: center; color: #9d174d;">Đỏ da</th>
          <th style="border: 1px solid #fbcfe8; padding: 10px; text-align: center; color: #9d174d;">Mụn</th>
        </tr>
      `;
      sortedLogs.forEach(log => {
        const d = new Date(log.date);
        const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        logsHtml += `
          <tr>
            <td style="border: 1px solid #fbcfe8; padding: 10px; text-align: center;">${dateStr}</td>
            <td style="border: 1px solid #fbcfe8; padding: 10px; text-align: center;">${log.prom.dryness}/10</td>
            <td style="border: 1px solid #fbcfe8; padding: 10px; text-align: center;">${log.prom.stinging}/10</td>
            <td style="border: 1px solid #fbcfe8; padding: 10px; text-align: center;">${log.prom.redness}/10</td>
            <td style="border: 1px solid #fbcfe8; padding: 10px; text-align: center;">${log.prom.acne}/10</td>
          </tr>
        `;
      });
      logsHtml += '</table>';
    }

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Báo cáo SkinMate</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #1f2937;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ec4899; font-size: 20pt; margin-bottom: 8px; font-family: Arial, sans-serif; text-transform: uppercase;">Báo cáo Tình trạng Da - 9 p.m. Skinmate</h1>
          <p style="font-size: 12pt; margin: 4px 0;"><strong>Khách hàng:</strong> ${userData.name}</p>
          <p style="font-size: 12pt; margin: 4px 0;"><strong>Ngày xuất báo cáo:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        
        <h2 style="color: #ec4899; font-size: 14pt; border-bottom: 2px solid #ec4899; padding-bottom: 4px; font-family: Arial, sans-serif; margin-bottom: 16px;">1. Lịch trình Can thiệp & Khám (SkinCalendar)</h2>
        ${eventsHtml}
        
        <h2 style="color: #ec4899; font-size: 14pt; border-bottom: 2px solid #ec4899; padding-bottom: 4px; font-family: Arial, sans-serif; margin-bottom: 16px; margin-top: 30px;">2. Nhật ký Cảm nhận Da (SkinLog)</h2>
        ${logsHtml}

        <div style="margin-top: 50px; text-align: center; border-top: 1px solid #fbcfe8; padding-top: 16px;">
          <p style="color: #ec4899; font-size: 10pt; font-family: Arial, sans-serif; margin: 4px 0; font-weight: bold;">
            Ứng dụng phát triển riêng cho khách hàng của 9 p.m. SkinCare<br/>
            Hotline: 0374 558 669 &nbsp;&nbsp;|&nbsp;&nbsp; No.46 / 196 Nguyễn Sơn
          </p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_cao_SkinMate_${userData.name}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

      {/* Streak Milestones */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Target size={18} className="text-primary-500" /> Tích điểm đổi quà (Chuỗi ngày)</h4>
        <div className="space-y-4">
          {[10, 20, 30].map(target => {
             const achieved = userData.streak >= target;
             const progress = achieved ? 100 : Math.min(100, (userData.streak / target) * 100);
             return (
               <div key={target} className="relative">
                 <div className="flex justify-between items-end mb-1">
                   <span className={`text-sm font-bold ${achieved ? 'text-primary-600' : 'text-gray-600'}`}>{target} ngày</span>
                   <span className="text-xs text-gray-400 font-medium">{achieved ? 'Hoàn thành' : `${userData.streak}/${target}`}</span>
                 </div>
                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden w-full relative">
                   <div 
                     className={`h-full absolute left-0 top-0 transition-all duration-1000 ${achieved ? 'bg-green-400' : 'bg-primary-300'}`}
                     style={{ width: `${progress}%` }}
                   />
                 </div>
                 {achieved && <div className="text-[10px] text-green-600 mt-1 font-bold text-right">Bạn đã có thể đổi quà mốc này!</div>}
               </div>
             )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
           onClick={exportToWord}
           className="w-full bg-pink-50 text-pink-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors shadow-sm border border-pink-200"
        >
           <Download size={18} /> Xuất Báo Cáo Cho Bác Sĩ (.doc)
        </button>

        <button 
           onClick={() => setActiveTab('reference')}
           className="w-full bg-gray-50 text-gray-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
        >
           <BookOpen size={18} /> Nguồn tài liệu khoa học
        </button>

        <a 
          href="https://facebook.com/9pmskincare" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <LinkIcon size={18} /> Kết nối 9 p.m. SkinCare
        </a>
        
        <a 
          href="https://zalo.me/0374558669" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-blue-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
        >
          <MessageCircle size={18} /> Chat với Team 9 p.m. SkinCare
        </a>
      </div>
    </div>
  );
}
