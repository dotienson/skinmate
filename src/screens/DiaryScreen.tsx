import { useState } from "react";
import { UserData } from "../types";
import {
  Camera,
  CalendarHeart,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Download,
  Share2
} from "lucide-react";

const downloadImage = (dataUrl: string, title: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `SkinMate_${title}_${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const shareImage = async (dataUrl: string, title: string) => {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `SkinMate_${title}.jpg`, { type: 'image/jpeg' });
    
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `SkinMate - ${title}`,
        files: [file]
      });
    } else {
      // Fallback
      downloadImage(dataUrl, title);
    }
  } catch (e) {
    console.error("Error sharing", e);
    downloadImage(dataUrl, title); // fallback
  }
};

export default function DiaryScreen({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: any;
}) {
  const [activeTab, setActiveTab] = useState<"log" | "history">("log");

  // PROM state
  const [prom, setProm] = useState({
    dryness: 0,
    stinging: 0,
    redness: 0,
    acne: 0,
  });

  // Photo states
  const [photoFront, setPhotoFront] = useState<string | null>(null);
  const [photoLeft, setPhotoLeft] = useState<string | null>(null);
  const [photoRight, setPhotoRight] = useState<string | null>(null);

  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const [showPhotoReminder, setShowPhotoReminder] = useState(false);
  const [pendingInputId, setPendingInputId] = useState<string | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleCameraClick = (e: React.MouseEvent<HTMLLabelElement>, inputId: string) => {
    if (localStorage.getItem("skinmate_hide_photo_reminder") !== "true") {
      e.preventDefault();
      setPendingInputId(inputId);
      setShowPhotoReminder(true);
    }
  };

  const confirmPhotoReminder = () => {
    if (dontShowAgain) {
      localStorage.setItem("skinmate_hide_photo_reminder", "true");
    }
    setShowPhotoReminder(false);
    if (pendingInputId) {
      document.getElementById(pendingInputId)?.click();
    }
  };

  const handleSave = () => {
    // Tự động tải ảnh về máy khi lưu log (có delay ngắn để trình duyệt không chặn popup)
    if (photoFront) setTimeout(() => downloadImage(photoFront, 'TrucDien'), 100);
    if (photoLeft) setTimeout(() => downloadImage(photoLeft, 'Trai'), 400);
    if (photoRight) setTimeout(() => downloadImage(photoRight, 'Phai'), 700);

    const newEntry = {
      date: new Date().toISOString(),
      prom: { ...prom },
      photos: { front: photoFront, left: photoLeft, right: photoRight }
    };
    setUserData({ 
      ...userData, 
      photos: [newEntry, ...userData.photos],
      exp: userData.exp + 15
    });
    setActiveTab("history");
    setProm({ dryness: 0, stinging: 0, redness: 0, acne: 0 }); // reset
    setPhotoFront(null);
    setPhotoLeft(null);
    setPhotoRight(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress carefully to fit localstorage
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          setter(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const hasHighIrritation = prom.stinging >= 6 || prom.redness >= 6;

  return (
    <div className="space-y-6 pb-20 fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">
          SkinLog
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Theo dõi tiến triển và nhận cảnh báo sớm.
        </p>
      </div>

      <div className="bg-gray-100 p-1.5 rounded-2xl flex">
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-1.5 font-bold text-sm rounded-xl transition-all \${activeTab === 'log' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}
        >
          Ghi chép
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-1.5 font-bold text-sm rounded-xl transition-all \${activeTab === 'history' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}
        >
          Lịch sử
        </button>
      </div>

      {activeTab === "log" ? (
        <div className="space-y-6">
          {/* Photo Mock */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Camera size={18} className="text-primary-400" /> Hình ảnh hôm nay
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <label onClick={(e) => handleCameraClick(e, "photo-front")} className="aspect-[3/4] bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 cursor-pointer overflow-hidden relative group">
                <input id="photo-front" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setPhotoFront)} />
                {photoFront ? <img src={photoFront} alt="Front" className="absolute inset-0 w-full h-full object-cover" /> : (
                  <>
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-1">Trực diện</span>
                  </>
                )}
              </label>
              <label onClick={(e) => handleCameraClick(e, "photo-left")} className="aspect-[3/4] bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 cursor-pointer overflow-hidden relative group">
                <input id="photo-left" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setPhotoLeft)} />
                {photoLeft ? <img src={photoLeft} alt="Left" className="absolute inset-0 w-full h-full object-cover" /> : (
                  <>
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-1">Trái</span>
                  </>
                )}
              </label>
              <label onClick={(e) => handleCameraClick(e, "photo-right")} className="aspect-[3/4] bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 cursor-pointer overflow-hidden relative group">
                <input id="photo-right" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setPhotoRight)} />
                {photoRight ? <img src={photoRight} alt="Right" className="absolute inset-0 w-full h-full object-cover" /> : (
                  <>
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-1">Phải</span>
                  </>
                )}
              </label>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl flex gap-2 items-start mt-2 border border-blue-100">
               <ShieldCheck size={16} className="mt-0.5 shrink-0" />
               <p className="text-[11px] font-medium leading-relaxed">
                 <strong>Bảo mật riêng tư:</strong> App không lưu thông tin hay ảnh của bạn trên máy chủ. Mọi dữ liệu hình ảnh chỉ được lưu trữ phân mảnh trên trình duyệt và thiết bị của bạn.
               </p>
            </div>
          </div>

          {/* PROM Sliders */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-700">
              Triệu chứng chủ quan (0-10)
            </h3>

            <Slider
              label="Khô căng"
              value={prom.dryness}
              onChange={(v) => setProm({ ...prom, dryness: v })}
              color="bg-orange-400"
            />
            <Slider
              label="Châm chích/nóng rát"
              value={prom.stinging}
              onChange={(v) => setProm({ ...prom, stinging: v })}
              color="bg-red-400"
            />
            <Slider
              label="Đỏ/kích ứng"
              value={prom.redness}
              onChange={(v) => setProm({ ...prom, redness: v })}
              color="bg-rose-500"
            />
            <Slider
              label="Mụn/viêm bùng phát"
              value={prom.acne}
              onChange={(v) => setProm({ ...prom, acne: v })}
              color="bg-amber-500"
            />
          </div>

          {hasHighIrritation && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex gap-3 border border-red-100 animate-pulse">
              <AlertTriangle className="shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Cảnh báo kích ứng</h4>
                <p className="text-xs mt-1 font-medium">
                  Bạn đang có dấu hiệu đỏ rát đáng kể. Tạm giảm các hoạt chất
                  mạnh (AHA/BHA/Retinoid) 48h và ưu tiên phục hồi.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-primary-500 text-white rounded-full py-3.5 font-black text-sm uppercase tracking-wide hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
          >
            Lưu nhật ký
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userData.photos.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <CalendarHeart size={48} className="mx-auto mb-3" />
              <p className="font-bold">Chưa có nhật ký nào</p>
            </div>
          ) : (
            userData.photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedLog(p)}
                className="w-full text-left bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-300 overflow-hidden shrink-0">
                  {p.photos?.front || p.photos?.left || p.photos?.right ? (
                    <img src={p.photos.front || p.photos.left || p.photos.right} alt="Log" className="w-full h-full object-cover" />
                  ) : (
                    <Camera />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-sm">
                    {new Date(p.date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-400 font-medium mt-1 flex gap-2">
                    <span>Đỏ: {p.prom.redness}</span>
                    <span>Rát: {p.prom.stinging}</span>
                    <span>Khô: {p.prom.dryness}</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Image View Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center fade-in">
          <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
            <button onClick={() => setSelectedLog(null)} className="flex items-center gap-2 text-white font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
              <ArrowLeft size={18} /> Trở lại
            </button>
            <span className="text-white font-medium text-sm">
              {new Date(selectedLog.date).toLocaleDateString("vi-VN", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
          
          <div className="overflow-y-auto w-full h-full p-4 pb-20 flex flex-col items-center mt-16 space-y-6">
            {(!selectedLog.photos?.front && !selectedLog.photos?.left && !selectedLog.photos?.right) ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center justify-center h-full">
                <Camera size={64} className="mx-auto mb-4 opacity-20 text-white" />
                <p className="text-sm font-medium">Không có hình ảnh cho ngày này</p>
              </div>
            ) : (
              <div className="space-y-6 w-full max-w-lg">
                {selectedLog.photos.front && (
                  <div>
                    <img src={selectedLog.photos.front} alt="Front" className="w-full rounded-xl object-contain shadow-2xl mb-3" />
                    <div className="flex justify-end gap-2">
                       <button onClick={() => shareImage(selectedLog.photos.front, 'TrucDien')} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-white/30 backdrop-blur-md"><Share2 size={14}/> Chia sẻ</button>
                       <button onClick={() => downloadImage(selectedLog.photos.front, 'TrucDien')} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-white/30 backdrop-blur-md"><Download size={14}/> Lưu</button>
                    </div>
                  </div>
                )}
                {selectedLog.photos.left && (
                  <div>
                    <img src={selectedLog.photos.left} alt="Left" className="w-full rounded-xl object-contain shadow-2xl mb-3" />
                    <div className="flex justify-end gap-2">
                       <button onClick={() => shareImage(selectedLog.photos.left, 'Trai')} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-white/30 backdrop-blur-md"><Share2 size={14}/> Chia sẻ</button>
                       <button onClick={() => downloadImage(selectedLog.photos.left, 'Trai')} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-white/30 backdrop-blur-md"><Download size={14}/> Lưu</button>
                    </div>
                  </div>
                )}
                {selectedLog.photos.right && (
                  <div>
                    <img src={selectedLog.photos.right} alt="Right" className="w-full rounded-xl object-contain shadow-2xl mb-3" />
                    <div className="flex justify-end gap-2">
                       <button onClick={() => shareImage(selectedLog.photos.right, 'Phai')} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-white/30 backdrop-blur-md"><Share2 size={14}/> Chia sẻ</button>
                       <button onClick={() => downloadImage(selectedLog.photos.right, 'Phai')} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-white/30 backdrop-blur-md"><Download size={14}/> Lưu</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Reminder Modal */}
      {showPhotoReminder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative text-center">
            <div className="mx-auto bg-amber-100 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Camera size={32} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Lưu ý khi chụp ảnh</h3>
            <p className="text-sm text-gray-600 font-medium mb-6 leading-relaxed">
              Hãy chụp ở nơi có điều kiện ánh sáng tốt nhất (tối ưu ánh sáng trắng hoặc ánh sáng tự nhiên), không dùng flash, có thể nhờ bạn bè hoặc người thân hỗ trợ nha!
            </p>
            
            <div className="flex items-center gap-2 justify-center mb-6">
              <input 
                type="checkbox" 
                id="dontShowAgain" 
                checked={dontShowAgain} 
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 w-4 h-4"
              />
              <label htmlFor="dontShowAgain" className="text-xs text-gray-500 font-medium cursor-pointer">
                Không hiện lại lời nhắc này
              </label>
            </div>
            
            <button 
              onClick={confirmPhotoReminder}
              className="w-full bg-primary-500 text-white font-bold py-3.5 rounded-xl hover:bg-primary-600 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-2">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-400">{value}/10</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
    </div>
  );
}
