import { ExternalLink, ChevronLeft } from 'lucide-react';

export default function ReferenceScreen({ setActiveTab }: { setActiveTab: any }) {
  const references = [
    {
      title: "An Overview of Methods to Characterize Skin Type",
      authors: "Oliveira R, Ferreira J, Azevedo LF, Almeida IF.",
      journal: "Cosmetics (2023)",
      link: "https://www.mdpi.com/2079-9284/10/1/14",
      desc: "Nền tảng cho bộ câu hỏi phân loại da tự báo cáo."
    },
    {
      title: "Burden of Sensitive Skin (BoSS) Questionnaire",
      authors: "Polena H, Chavagnac-Bonneville M, Misery L, Sayag M.",
      journal: "Acta Derm Venereol (2021)",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9455310/",
      desc: "Trục chẩn đoán nhạy cảm và hàng rào bảo vệ (SB_score)."
    },
    {
      title: "Environmental Stressors on Skin Aging. Mechanistic Insights",
      authors: "Parrado C, et al.",
      journal: "Front Pharmacol (2019)",
      link: "https://www.frontiersin.org/articles/10.3389/fphar.2019.00759/full",
      desc: "Cơ sở đánh giá Exposome và lão hóa ngoại sinh (EA_score)."
    },
    {
      title: "Impact of Topical Vehicles and Cutaneous Delivery Technologies on Patient Adherence",
      authors: "Del Rosso JQ et al.",
      journal: "PMCID: PMC10243731 (2023)",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10243731/",
      desc: "Hướng dẫn giảm kích ứng và tránh phối hợp hoạt chất sai cách (Routine Auditor)."
    }
  ];

  return (
    <div className="space-y-6 pb-20 fade-in">
      <div className="flex items-center gap-3 mb-2">
         <button onClick={() => setActiveTab('profile')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft />
         </button>
         <div>
           <h2 className="text-2xl font-black text-gray-800 mb-1">Tài Liệu Căn Cứ</h2>
           <p className="text-sm text-gray-500 font-medium">Thuật toán được xây dựng dựa trên các nghiên cứu khoa học uy tín (Evidence-based).</p>
         </div>
      </div>

      <div className="space-y-4">
        {references.map((ref, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-primary-200 hover:shadow-md">
             <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug">{ref.title}</h3>
             <p className="text-xs text-gray-500 mb-2 font-medium">{ref.authors} &bull; <span className="text-primary-600">{ref.journal}</span></p>
             <div className="bg-gray-50 p-2.5 rounded-xl text-xs text-gray-600 font-medium mb-3 border border-gray-100">
                {ref.desc}
             </div>
             <a href={ref.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">
               Truy cập nghiên cứu <ExternalLink size={12} />
             </a>
          </div>
        ))}
      </div>
    </div>
  );
}
