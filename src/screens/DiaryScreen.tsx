import { useState } from "react";
import { UserData } from "../types";
import {
  Camera,
  CalendarHeart,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

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

  const handleSave = () => {
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
         setter(reader.result as string);
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
              <label className="aspect-[3/4] bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 cursor-pointer overflow-hidden relative group">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setPhotoFront)} />
                {photoFront ? <img src={photoFront} alt="Front" className="absolute inset-0 w-full h-full object-cover" /> : (
                  <>
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-1">Trực diện</span>
                  </>
                )}
              </label>
              <label className="aspect-[3/4] bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 cursor-pointer overflow-hidden relative group">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setPhotoLeft)} />
                {photoLeft ? <img src={photoLeft} alt="Left" className="absolute inset-0 w-full h-full object-cover" /> : (
                  <>
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-1">Trái</span>
                  </>
                )}
              </label>
              <label className="aspect-[3/4] bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 cursor-pointer overflow-hidden relative group">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setPhotoRight)} />
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
              <div
                key={i}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4"
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
              </div>
            ))
          )}
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
