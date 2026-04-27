import { useState } from "react";
import { UserData } from "../types";
import { CheckCircle2, ChevronLeft } from "lucide-react";

const quizQuestions = [
  // OD Axis (Oil-Dry)
  {
    id: "q1",
    text: "Cuối ngày, vùng chữ T của bạn:",
    options: [
      { label: "Không bóng", val: 0 },
      { label: "Hơi bóng", val: 1 },
      { label: "Bóng nhiều", val: 2 },
    ],
  },
  {
    id: "q2",
    text: "Sau khi rửa mặt không dưỡng 10 phút:",
    options: [
      { label: "Căng rát, bong nhẹ", val: 0 },
      { label: "Hơi căng", val: 1 },
      { label: "Không căng", val: 2 },
    ],
  },
  {
    id: "q3",
    text: "Lỗ chân lông vùng má của bạn:",
    options: [
      { label: "Khó thấy", val: 0 },
      { label: "Vừa", val: 1 },
      { label: "To rõ", val: 2 },
    ],
  },
  // SB Axis (Sensitive-Barrier)
  {
    id: "q7",
    text: "Bạn có hay châm chích/nóng rát khi bôi mỹ phẩm mới?",
    options: [
      { label: "Không", val: 0 },
      { label: "Đôi khi", val: 1 },
      { label: "Thường xuyên", val: 2 },
    ],
  },
  {
    id: "q8",
    text: "Bạn có đỏ mặt khi thay đổi thời tiết (nóng–lạnh, gió)?",
    options: [
      { label: "Không", val: 0 },
      { label: "Đôi khi", val: 1 },
      { label: "Thường xuyên", val: 2 },
    ],
  },
  {
    id: "q10",
    text: "Từng bị viêm da kích ứng vì retinoid/AHA/BHA?",
    options: [
      { label: "Không", val: 0 },
      { label: "1 lần", val: 1 },
      { label: "Nhiều lần", val: 2 },
    ],
  },
  // P Axis (Pigment)
  {
    id: "q15",
    text: "Da bạn dễ để lại vết thâm sau mụn?",
    options: [
      { label: "Không", val: 0 },
      { label: "Đôi khi", val: 1 },
      { label: "Thường xuyên", val: 2 },
    ],
  },
  {
    id: "q16",
    text: "Bạn có tiền sử nám/tàn nhang tăng lên theo nắng?",
    options: [
      { label: "Không", val: 0 },
      { label: "Có", val: 2 },
    ],
  },
  {
    id: "q18",
    text: "Bạn có hay cạy nặn mụn/ma sát mạnh?",
    options: [
      { label: "Không", val: 0 },
      { label: "Đôi khi", val: 1 },
      { label: "Thường xuyên", val: 2 },
    ],
  },
  // EA Axis (Extrinsic Aging)
  {
    id: "q20",
    text: "Trung bình bạn ra nắng (10h–15h) thời gian bao lâu?",
    options: [
      { label: "Hiếm", val: 0 },
      { label: "2–4 ngày/tuần", val: 1 },
      { label: "Gần như mỗi ngày", val: 2 },
    ],
  },
  {
    id: "q21",
    text: "Thói quen bôi lại kem chống nắng khi ở ngoài trời?",
    options: [
      { label: "Thường xuyên", val: 0 },
      { label: "Đôi khi", val: 1 },
      { label: "Không", val: 2 },
    ],
  }, // Inversed: less reapply = more aging
  {
    id: "q24",
    text: "Bạn ngủ <6.5 giờ/đêm kéo dài?",
    options: [
      { label: "Không", val: 0 },
      { label: "Có", val: 2 },
    ],
  },
];

export default function QuizScreen({
  userData,
  setUserData,
  setActiveTab,
}: {
  userData: UserData;
  setUserData: any;
  setActiveTab: any;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const q = quizQuestions[currentIdx];

  const handleSelect = (val: number) => {
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);

    if (currentIdx < quizQuestions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 300);
    } else {
      calculateAndSave(newAnswers);
    }
  };

  const calculateAndSave = (finalAnswers: Record<string, number>) => {
    // OD (q1, q2, q3) max 6
    const od_sum =
      (finalAnswers["q1"] || 0) +
      (finalAnswers["q2"] || 0) +
      (finalAnswers["q3"] || 0);
    // SB (q7, q8, q10) max 6
    const sb_sum =
      (finalAnswers["q7"] || 0) +
      (finalAnswers["q8"] || 0) +
      (finalAnswers["q10"] || 0);
    // P (q15, q16, q18) max 6
    const p_sum =
      (finalAnswers["q15"] || 0) +
      (finalAnswers["q16"] || 0) +
      (finalAnswers["q18"] || 0);
    // EA (q20, q21, q24) max 6
    const ea_sum =
      (finalAnswers["q20"] || 0) +
      (finalAnswers["q21"] || 0) +
      (finalAnswers["q24"] || 0);

    const scores = {
      OD_score: (od_sum / 6) * 100,
      SB_score: (sb_sum / 6) * 100,
      P_score: (p_sum / 6) * 100,
      EA_score: (ea_sum / 6) * 100,
    };

    setUserData({ 
      ...userData, 
      quizScores: scores,
      exp: userData.exp + 25 
    });
    setShowResults(true);
  };

  if (showResults && userData.quizScores) {
    const { OD_score, SB_score, P_score, EA_score } = userData.quizScores;
    const isSensitive = SB_score >= 70;
    const isAging = EA_score >= 70;
    const isPigment = P_score >= 70;
    const isOily = OD_score >= 65;
    const isDry = OD_score <= 35; // Derived from spec

    return (
      <div className="space-y-6 pb-20 fade-in">
        <div className="text-center space-y-2 mt-4">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">Hoàn thành!</h2>
          <p className="text-gray-500 text-sm pb-4">
            Cùng xem nhãn nhận diện da của bạn.
          </p>
        </div>

        <div className="space-y-3">
          {isSensitive && (
            <ResultPhenotype
              title="Nhạy cảm do hàng rào suy yếu"
              color="bg-red-50 border-red-200 text-red-700"
              desc="Dễ kích ứng, cần phục hồi hàng rào, tránh hoạt chất mạnh."
            />
          )}
          {isAging && (
            <ResultPhenotype
              title="Nguy cơ lão hóa ngoại sinh cao"
              color="bg-purple-50 border-purple-200 text-purple-700"
              desc="UV/ô nhiễm/lối sống là yếu tố chính; chống nắng là ưu tiên."
            />
          )}
          {isPigment && (
            <ResultPhenotype
              title="Dễ tăng sắc tố sau viêm"
              color="bg-amber-50 border-amber-200 text-amber-700"
              desc="Dễ thâm/nám; cần kiểm soát viêm và chống nắng kỹ."
            />
          )}
          {isOily && (
            <ResultPhenotype
              title="Dầu / Comedone-prone"
              color="bg-blue-50 border-blue-200 text-blue-700"
              desc="Cần kiểm soát bã nhờn, ưu tiên hoạt chất ít kích ứng."
            />
          )}
          {isDry && (
            <ResultPhenotype
              title="Khô / Thiếu ẩm"
              color="bg-orange-50 border-orange-200 text-orange-700"
              desc="Cần tăng dưỡng ẩm-lipid, giảm tẩy rửa mạnh."
            />
          )}

          {!isSensitive && !isAging && !isPigment && !isOily && !isDry && (
            <ResultPhenotype
              title="Da cân bằng"
              color="bg-green-50 border-green-200 text-green-700"
              desc="Da khỏe mạnh, tiếp tục duy trì routine hiện tại!"
            />
          )}

          {/* CTA Box based on logic */}
          <div className="mt-8 bg-primary-50 rounded-3xl p-6 text-center border-2 border-primary-100">
            <h4 className="font-bold text-primary-700 mb-2">
              Lời khuyên cho bạn
            </h4>
            <p className="text-sm text-primary-600 mb-4">
              Dựa trên kết quả này, bạn có thể kiểm tra xem quy trình chăm sóc
              da hiện tại có phù hợp không.
            </p>
            <button
              onClick={() => setActiveTab("auditor")}
              className="w-full bg-primary-500 text-white py-3 rounded-full font-bold shadow-md hover:bg-primary-600 transition-colors"
            >
              Trải nghiệm MateCheck
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex items-center mb-6">
        {currentIdx > 0 && (
          <button
            onClick={() => setCurrentIdx((c) => c - 1)}
            className="p-2 -ml-2 text-gray-500"
          >
            <ChevronLeft />
          </button>
        )}
        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden mx-2">
          <div
            className="bg-primary-400 h-full transition-all duration-300"
            style={{
              width: `\${((currentIdx) / quizQuestions.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400 w-8 text-right">
          {currentIdx + 1}/{quizQuestions.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-extrabold text-gray-800 mb-6 leading-snug">
          {q.text}
        </h3>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.val)}
              className={`w-full text-left p-3.5 rounded-2xl border-2 font-bold text-sm transition-all
                \${answers[q.id] === opt.val ? 'border-primary-400 bg-primary-50 text-primary-700 shadow-sm translate-y-[-2px]' : 'border-gray-100 bg-white text-gray-600 hover:border-primary-200'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultPhenotype({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className={`p-4 rounded-2xl border-2 \${color}`}>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-xs opacity-90 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
