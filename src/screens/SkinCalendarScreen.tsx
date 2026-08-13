import { useState, useMemo } from 'react';
import { UserData } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, FileText, Pill } from 'lucide-react';

export default function SkinCalendarScreen({ userData, setUserData }: { userData: UserData, setUserData: any }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'checkup'|'treatment'|'note'>('note');
  const [eventNotes, setEventNotes] = useState('');

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  const { days, blankDays } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      days: Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
      blankDays: Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i)
    };
  }, [currentDate]);

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const eventsForSelectedDate = (userData.calendarEvents || []).filter(e => e.date === selectedDateStr);

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;
    
    const newEvent = {
      id: Date.now().toString(),
      date: selectedDateStr,
      title: eventTitle,
      type: eventType,
      notes: eventNotes
    };

    setUserData({
      ...userData,
      calendarEvents: [...(userData.calendarEvents || []), newEvent]
    });
    
    setEventTitle('');
    setEventNotes('');
    setShowAddForm(false);
  };

  const deleteEvent = (id: string) => {
    setUserData({
      ...userData,
      calendarEvents: (userData.calendarEvents || []).filter(e => e.id !== id)
    });
  };

  return (
    <div className="space-y-6 pb-20 fade-in relative min-h-[80vh]">
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">SkinCalendar</h2>
        <p className="text-sm text-gray-500 font-medium">Lưu ngày khám, tái khám và theo dõi liệu trình.</p>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-gray-400">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <div key={d}>{d}</div>)}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {blankDays.map(d => <div key={`blank-${d}`} className="h-10"></div>)}
          {days.map(d => {
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            const hasEvent = (userData.calendarEvents || []).some(e => e.date === dateStr);
            const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
            const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

            return (
              <button
                key={d}
                onClick={() => {
                  setSelectedDate(dateObj);
                  setShowAddForm(true);
                }}
                className={`relative h-10 w-full flex items-center justify-center rounded-xl text-sm font-bold transition-all
                  ${isSelected ? 'bg-primary-500 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'}
                  ${isToday && !isSelected ? 'text-primary-600 border border-primary-200' : ''}
                `}
              >
                {d}
                {hasEvent && !isSelected && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-lg">
            Sự kiện ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
          </h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-full transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 fade-in w-full max-w-sm shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800 text-lg">Thêm sự kiện</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>
              <input 
                type="text" 
                placeholder="Tên sự kiện..." 
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:border-primary-400 bg-gray-50"
              />
              <div className="flex gap-2">
                <button onClick={() => setEventType('checkup')} className={`flex-1 p-2 rounded-xl text-xs font-bold border ${eventType === 'checkup' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                  Khám
                </button>
                <button onClick={() => setEventType('treatment')} className={`flex-1 p-2 rounded-xl text-xs font-bold border ${eventType === 'treatment' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                  Liệu trình
                </button>
                <button onClick={() => setEventType('note')} className={`flex-1 p-2 rounded-xl text-xs font-bold border ${eventType === 'note' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                  Ghi chú
                </button>
              </div>
              <textarea 
                placeholder="Chi tiết (Tên thuốc, lời dặn...)" 
                value={eventNotes}
                onChange={e => setEventNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 resize-none h-24 bg-gray-50"
              ></textarea>
              <button onClick={handleAddEvent} className="w-full bg-primary-500 text-white font-bold py-3 rounded-xl hover:bg-primary-600 transition-colors">Lưu Sự Kiện</button>
            </div>
          </div>
        )}

        {eventsForSelectedDate.length === 0 ? (
          <div className="text-center py-6 text-gray-400 flex flex-col items-center">
            <CalendarIcon size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Không có sự kiện nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {eventsForSelectedDate.map(event => (
              <div key={event.id} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-start gap-3">
                <div className={`p-2 rounded-xl ${event.type === 'checkup' ? 'bg-blue-50 text-blue-500' : event.type === 'treatment' ? 'bg-purple-50 text-purple-500' : 'bg-amber-50 text-amber-500'}`}>
                  {event.type === 'checkup' ? <Stethoscope size={20} /> : event.type === 'treatment' ? <Pill size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 text-sm">{event.title}</h4>
                    <button onClick={() => deleteEvent(event.id)} className="text-xs text-red-400 font-bold hover:text-red-500">Xóa</button>
                  </div>
                  {event.notes && (
                    <p className="text-xs text-gray-500 mt-1 font-medium whitespace-pre-wrap">{event.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
