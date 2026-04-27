import { UserData } from "../types";
import {
  ArrowRight,
  Sparkles,
  Droplets,
  Sun,
  AlertTriangle,
} from "lucide-react";

export default function DashboardScreen({
  userData,
  setActiveTab,
}: {
  userData: UserData;
  setActiveTab: (t: any) => void;
}) {
  const hasQuiz = userData.quizScores !== null;

  return (
    <div className="space-y-6 pb-20 fade-in">
      <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">DermaButter SkinMate xin chào {userData.name}!</h2>
          <p className="text-primary-50 text-sm font-medium mb-4">
            {hasQuiz
              ? "Cùng xem tình trạng da của bạn hôm nay nhé."
              : "Hoàn thành bài kiểm tra 3 phút để hiểu làn da của bạn."}
          </p>
          {!hasQuiz ? (
            <button
              onClick={() => setActiveTab("quiz")}
              className="bg-white text-primary-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 hover:bg-primary-50 transition-colors"
            >
              Làm SkinCheck ngay <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("auditor")}
              className="bg-white text-primary-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 hover:bg-primary-50 transition-colors"
            >
              Mở MateCheck <ArrowRight size={16} />
            </button>
          )}
        </div>
        <Sparkles
          className="absolute top-2 right-2 text-white opacity-20"
          size={100}
        />
      </div>

      {hasQuiz && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Hồ sơ da của bạn
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ScoreCard
              title="Dầu / Khô"
              score={userData.quizScores!.OD_score}
              icon={<Droplets />}
              color="bg-blue-50 text-blue-600"
            />
            <ScoreCard
              title="Nhạy Cảm"
              score={userData.quizScores!.SB_score}
              icon={<AlertTriangle />}
              color="bg-red-50 text-red-500"
            />
            <ScoreCard
              title="Sắc Tố"
              score={userData.quizScores!.P_score}
              icon={<Sparkles />}
              color="bg-amber-50 text-amber-600"
            />
            <ScoreCard
              title="Lão Hóa"
              score={userData.quizScores!.EA_score}
              icon={<Sun />}
              color="bg-purple-50 text-purple-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => setActiveTab("quiz")}
              className="w-full bg-white border-2 border-primary-100 text-primary-600 py-3 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-primary-50"
            >
              Làm lại SkinCheck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({
  title,
  score,
  icon,
  color,
}: {
  title: string;
  score: number;
  icon: any;
  color: string;
}) {
  return (
    <div
      className={`p-4 rounded-3xl flex flex-col justify-between h-28 \${color.split(' ')[0]} border border-white/50 shadow-sm`}
    >
      <div className={`\${color.split(' ')[1]} flex items-center gap-2`}>
        {icon && (
          <div className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full">{icon}</div>
        )}
        <span className="font-bold text-sm">{title}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-black text-gray-800">
          {score.toFixed(0)}
        </span>
        <span className="text-gray-500 font-bold mb-1 text-xs">/100</span>
      </div>
    </div>
  );
}
