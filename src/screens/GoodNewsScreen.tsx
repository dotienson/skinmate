import { Sparkles, Newspaper } from 'lucide-react';

export default function GoodNewsScreen() {
  return (
    <div className="space-y-6 pb-20 fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Good News</h2>
        <p className="text-sm text-gray-500 font-medium">Cập nhật điểm báo, xu hướng và kiến thức chăm sóc da mới nhất.</p>
      </div>

      <div className="space-y-6">
        {/* Card 1 */}
        <article className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <Sparkles size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Tin Tức</span>
              <span className="text-gray-400 text-xs font-medium">{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 leading-snug">
              Đột Phá Phục Hồi Da Sinh Học Cùng Rejuran Turnover Ampoule – "Chìa Khóa" Cho Chuẩn Da Glass Skin Từ Hàn Quốc!
            </h3>
            
            <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed font-medium">
              <p>
                Bạn đang tìm kiếm một giải pháp tối ưu cho làn da tổn thương sau các liệu trình treatment, hoặc đơn giản là muốn đẩy lùi các dấu hiệu lão hóa sớm? Rejuran Turnover Ampoule chính là tâm điểm chú ý trong xu hướng chăm sóc da chuyên sâu hiện nay.
              </p>
              
              <p>
                Được phát triển dựa trên nền tảng y học tái tạo, tinh chất Rejuran Turnover Ampoule ứng dụng công nghệ <strong className="text-gray-800">c-PDRN® (Polydeoxyribonucleotide)</strong> độc quyền. Đây là phân tử sinh học chiết xuất từ ADN sinh vật biển, có độ tương đồng lên tới 95% với ADN người, mang lại khả năng tương thích và hiệu quả vượt trội trong việc đánh thức sức sống của làn da.
              </p>
              
              <p>
                Sự kết hợp hoàn hảo giữa c-PDRN® cùng Hyaluronic Acid, Niacinamide và các chiết xuất thực vật (lô hội, việt quất, cúc vạn thọ) mang đến những lợi ích toàn diện:
              </p>
              
              <ul className="list-disc pl-5 space-y-3 my-4">
                <li><strong className="text-gray-800">Phục hồi chuyên sâu:</strong> Thúc đẩy mạnh mẽ chu trình thay mới tế bào (turnover), củng cố hàng rào bảo vệ tự nhiên, cực kỳ lý tưởng cho làn da mỏng yếu, nhạy cảm hoặc đang phục hồi sau laser, peel.</li>
                <li><strong className="text-gray-800">Trẻ hóa và làm mờ nếp nhăn:</strong> Kích thích tăng sinh collagen nội sinh, giúp cải thiện độ đàn hồi, làm đầy các rãnh nhăn nông và tinh chỉnh lỗ chân lông.</li>
                <li><strong className="text-gray-800">Cấp ẩm đa tầng:</strong> Nuôi dưỡng bề mặt da mềm mịn, căng mướt và làm đều màu vùng da xỉn màu, mang lại hiệu ứng da căng bóng "Glass Skin" rạng rỡ.</li>
              </ul>
              
              <p>
                Với kết cấu ampoule mỏng nhẹ, thẩm thấu nhanh và không gây nhờn rít, Rejuran Turnover Ampoule chính là khoản đầu tư xứng đáng để thiết lập lại nền da khỏe mạnh không tì vết.
              </p>
              
              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 mt-6">
                <p className="text-pink-700 font-bold text-center">
                  Hãy nâng cấp chu trình dưỡng da của bạn ngay hôm nay để trực tiếp cảm nhận sức mạnh tái sinh kỳ diệu từ Rejuran Turnover Ampoule!
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
