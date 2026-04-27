import { useState } from "react";
import { UserData } from "../types";
import { AlertCircle, FileWarning, CheckCircle2, Info } from "lucide-react";

const INGREDIENTS = [
  { id: "retinoid", name: "Retinoids (Retinol, Tretinoin...)" },
  { id: "aha", name: "AHA (Glycolic, Lactic...)" },
  { id: "bha", name: "BHA (Salicylic Acid)" },
  { id: "bpo", name: "Benzoyl Peroxide (BPO)" },
  { id: "vitc_laa", name: "Vitamin C (LAA)" },
  { id: "niacinamide", name: "Niacinamide" },
  { id: "azelaic", name: "Azelaic Acid" },
  { id: "barrier", name: "Phục hồi (B5, Ceramide, Peptide)" },
];

export default function AuditorScreen({ userData }: { userData: UserData }) {
  const [selectedAM, setSelectedAM] = useState<string[]>([]);
  const [selectedPM, setSelectedPM] = useState<string[]>([]);

  const toggleIng = (id: string, time: "AM" | "PM") => {
    if (time === "AM") {
      selectedAM.includes(id)
        ? setSelectedAM(selectedAM.filter((x) => x !== id))
        : setSelectedAM([...selectedAM, id]);
    } else {
      selectedPM.includes(id)
        ? setSelectedPM(selectedPM.filter((x) => x !== id))
        : setSelectedPM([...selectedPM, id]);
    }
  };

  const getAlerts = (list: string[]) => {
    const alerts: any[] = [];
    const activesCount = list.filter((x) =>
      ["retinoid", "aha", "bha", "bpo", "azelaic", "vitc_laa"].includes(x)
    ).length;
    const sb = userData.quizScores?.SB_score || 0;

    if (list.includes("bpo") && list.includes("retinoid")) {
      alerts.push({ level: "red", title: "BPO & Retinoid", reason: "BPO là chất oxy hóa mạnh, làm retinoid mất ổn định và nguy cơ kích ứng rất cao.", fix: "Tách thời điểm: BPO sáng / Retinoid tối." });
    }
    if (list.includes("aha") && list.includes("bha")) {
      alerts.push({ level: "red", title: "AHA & BHA", reason: "Nguy cơ over-exfoliation, phá hủy hàng rào bảo vệ da.", fix: "Chọn 1 loại acid/buổi, hoặc dùng PHA nếu da nhạy cảm." });
    }
    if (list.includes("retinoid") && list.includes("aha")) {
      alerts.push({ level: sb >= 60 ? "red" : "yellow", title: "Retinoid & AHA", reason: "Cộng gộp kích ứng, tăng nhạy cảm hàng rào bảo vệ.", fix: "Luân phiên: Retinoid tối 2-4 lần/tuần, AHA 1-2 lần. Không cùng đêm." });
    }
    if (list.includes("retinoid") && list.includes("bha")) {
      alerts.push({ level: sb >= 60 ? "red" : "yellow", title: "Retinoid & BHA", reason: "BHA làm khô thêm trên nền da nhạy cảm.", fix: "Tách buổi: BHA sáng, Retinoid tối + kèm dưỡng phục hồi." });
    }
    if (list.includes("vitc_laa") && list.includes("retinoid")) {
      alerts.push({ level: sb >= 70 ? "red" : "yellow", title: "Vitamin C (LAA) & Retinoid", reason: "Cả hai đều độ pH khó dung nạp, phối hợp gây châm chích.", fix: "Tối ưu dung nạp: Vitamin C sáng, Retinoid tối." });
    }
    if (activesCount >= 3) {
      alerts.push({ level: sb >= 60 ? "red" : "yellow", title: "Quá nhiều hoạt chất mạnh", reason: "Dùng >= 3 active cùng buổi làm rủi ro kích ứng tăng vọt.", fix: "Giảm còn 1-2 active/buổi; thêm dưỡng phục hồi (Barrier helpers)." });
    }
    if (list.includes("retinoid") && list.includes("barrier") && alerts.filter((a: any) => a.level === "red").length === 0) {
      alerts.push({ level: "green", title: "Bộ đôi phục hồi tốt", reason: "Hoạt chất phục hồi hỗ trợ hàng rào da dung nạp Retinoid tốt hơn.", fix: "Thử nghiệm sandwich: Dưỡng -> Retinoid -> Dưỡng." });
    }
    if (alerts.length === 0 && list.length > 0) {
      alerts.push({ level: "green", title: "Routine an toàn", reason: "Không phát hiện xung đột đáng kể trong buổi này.", fix: "Theo dõi phản ứng da và duy trì đều đặn." });
    }
    return alerts;
  };

  const RenderSection = ({ time, title, list }: { time: "AM"|"PM", title: string, list: string[] }) => {
    const alerts = getAlerts(list);
    return (
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <h3 className="font-black text-lg text-gray-800 mb-3">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {INGREDIENTS.map((ing) => {
            const isSelected = list.includes(ing.id);
            return (
              <button
                key={ing.id}
                onClick={() => toggleIng(ing.id, time)}
                className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all ${
                  isSelected 
                  ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm" 
                  : "border-gray-100 text-gray-500 hover:border-primary-200"
                }`}
              >
                {ing.name}
              </button>
            );
          })}
        </div>

        {list.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-50">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border-2 ${
                  alert.level === "red" ? "bg-red-50 border-red-100" :
                  alert.level === "yellow" ? "bg-amber-50 border-amber-100" :
                  "bg-green-50 border-green-100"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${
                        alert.level === "red" ? "text-red-500" :
                        alert.level === "yellow" ? "text-amber-500" :
                        "text-green-500"
                  }`}>
                    {alert.level === "red" ? <FileWarning size={18} /> : alert.level === "yellow" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm mb-1 ${
                          alert.level === "red" ? "text-red-800" :
                          alert.level === "yellow" ? "text-amber-800" :
                          "text-green-800"
                    }`}>{alert.title}</h4>
                    <p className="text-[11px] font-medium opacity-80 mb-2 leading-relaxed">{alert.reason}</p>
                    <div className="flex items-start gap-1 p-2 bg-white/60 rounded-xl">
                      <Info size={12} className="mt-0.5 opacity-60 shrink-0" />
                      <span className="text-[11px] font-bold opacity-90">{alert.fix}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">MateCheck</h2>
        <p className="text-sm text-gray-500 font-medium">Chọn các actives bạn dùng để xem liệu chúng có xung đột không.</p>
      </div>

      <RenderSection time="AM" title="Routine Buổi Sáng" list={selectedAM} />
      <RenderSection time="PM" title="Routine Buổi Tối" list={selectedPM} />

      {(getAlerts(selectedAM).some((a) => a.level === "red") || getAlerts(selectedPM).some((a) => a.level === "red")) && (
        <button className="w-full bg-red-100 text-red-700 py-3 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-red-200 mt-4 transition-colors">
          Chat với chuyên viên để chỉnh Routine
        </button>
      )}
    </div>
  );
}
