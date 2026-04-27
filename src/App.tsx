/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import { Home, ClipboardList, Stethoscope, BookImage, User, BookOpen } from "lucide-react";
import { UserData, defaultUserData } from "./types";
import DashboardScreen from "./screens/DashboardScreen";
import QuizScreen from "./screens/QuizScreen";
import AuditorScreen from "./screens/AuditorScreen";
import DiaryScreen from "./screens/DiaryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ReferenceScreen from "./screens/ReferenceScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "home" | "quiz" | "auditor" | "diary" | "profile" | "reference"
  >("home");
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [nameInput, setNameInput] = useState("");

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "quiz", label: "SkinCheck", icon: ClipboardList },
    { id: "auditor", label: "MateCheck", icon: Stethoscope },
    { id: "diary", label: "SkinLog", icon: BookImage },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  useEffect(() => {
    // Check login streak
    if (userData.name && userData.lastLogin) {
      const today = new Date().toDateString();
      if (userData.lastLogin !== today) {
        // Simple streak logic assuming yesterday
        setUserData(prev => ({
          ...prev,
          lastLogin: today,
          streak: prev.streak + 1,
          exp: prev.exp + 5 // Login bonus
        }));
      }
    }
  }, [userData.name]);

  const handleStart = () => {
    if (nameInput.trim()) {
      setUserData({ 
        ...userData, 
        name: nameInput.trim(), 
        lastLogin: new Date().toDateString(),
        streak: 1,
        exp: 10 // Welcome bonus
      });
    }
  };

  if (!userData.name) {
    return (
      <div className="flex flex-col h-screen bg-[#fffafb] items-center justify-center p-4">
        <h1 className="text-3xl font-extrabold text-primary-600 tracking-tight mb-2">
          DermaButter SkinMate
        </h1>
        <p className="text-gray-500 mb-8 text-center font-medium">Bắt đầu hành trình hiểu làn da của bạn.</p>
        <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">Tên của bạn là gì?</label>
          <input 
            type="text" 
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            className="w-full p-4 mb-4 border-2 border-primary-100 rounded-2xl focus:outline-none focus:border-primary-400 font-bold text-gray-800"
            placeholder="Nhập tên..."
            onKeyDown={e => e.key === 'Enter' && handleStart()}
          />
          <button 
            onClick={handleStart}
            disabled={!nameInput.trim()}
            className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Bắt đầu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#fffafb] w-full max-w-5xl mx-auto shadow-2xl overflow-hidden relative">
      {/* Mobile Header */}
      <header className="md:hidden flex-none bg-white p-4 shadow-sm z-10 sticky top-0">
        <h1 className="text-xl font-extrabold text-primary-600 text-center tracking-tight">
          DermaButter SkinMate
        </h1>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-primary-100 z-10 p-6 flex-none">
        <h1 className="text-2xl font-extrabold text-primary-600 tracking-tight mb-8">
          DermaButter SkinMate
        </h1>
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-primary-600 bg-primary-50 translate-x-2 font-bold"
                    : "text-gray-500 hover:bg-gray-50 font-semibold"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-transform ${isActive ? "scale-110" : ""}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative bg-gray-50/50">
        <div className="absolute inset-0 p-4 md:p-8 max-w-3xl mx-auto">
          {activeTab === "home" && (
            <DashboardScreen userData={userData} setActiveTab={setActiveTab} />
          )}
          {activeTab === "quiz" && (
            <QuizScreen
              userData={userData}
              setUserData={setUserData}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "auditor" && <AuditorScreen userData={userData} />}
          {activeTab === "diary" && (
            <DiaryScreen userData={userData} setUserData={setUserData} />
          )}
          {activeTab === "profile" && <ProfileScreen userData={userData} setActiveTab={setActiveTab} />}
          {activeTab === "reference" && <ReferenceScreen setActiveTab={setActiveTab} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex-none bg-white border-t border-primary-100 flex justify-between items-center p-2 z-10 overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[4rem] ${
                isActive
                  ? "text-primary-600 bg-primary-50 translate-y-[-2px]"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={`mb-1 transition-transform ${isActive ? "scale-110" : ""}`}
              />
              <span
                className={`text-[9px] font-bold ${isActive ? "opacity-100" : "opacity-70"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
