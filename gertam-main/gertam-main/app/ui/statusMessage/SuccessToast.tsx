import { useEffect } from "react";

type SuccessToastProps = {
  show: boolean;
  message?: string;
  onClose?: () => void;
};


export default function SuccessToast({
  show,
  message = "تم إضافة المنتج بنجاح.",
  onClose
}: SuccessToastProps)  {
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(() => onClose?.(), 3000);
        return () => clearTimeout(t);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center space-x-3 rtl:space-x-reverse bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl shadow-lg">
        <div className="w-12 h-12 flex items-center justify-center">
            {/* الدائرة المتحركة + علامة الصح (SVG) */}
            <div className="relative w-12 h-12">
    <svg className="absolute inset-0 w-12 h-12" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="24" stroke="#16A34A" strokeWidth="2" className="origin-center animate-pop" style={{ strokeLinecap: "round" }} />
    <path d="M15 27l7 7 15-15" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
    className="checkmark" />
        </svg>
        </div>
        </div>

        <div className="flex flex-col">
    <span className="font-medium">{message}</span>
        <small className="text-xs text-green-600/80">تمت العملية بنجاح</small>
    </div>
    </div>

    {/* أنميشن CSS مضمّنة */}
    <style>{`
        @keyframes pop {
          0%   { transform: scale(0.6); opacity: 0 }
          60%  { transform: scale(1.08); opacity: 1 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-pop { animation: pop 420ms cubic-bezier(.2,.8,.2,1) forwards; transform-origin: center; }

        /* رسم علامة الصح تدريجياً */
        .checkmark {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation:
            draw 420ms 180ms ease forwards,
            bounce 900ms 420ms cubic-bezier(.2,.8,.2,1) forwards;
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes bounce {
          0%   { transform: translateY(0) scale(1); }
          30%  { transform: translateY(-6px) scale(1.02); }
          60%  { transform: translateY(0) scale(1); }
          100% { transform: translateY(0) scale(1); }
        }

        /* ظل لطيف يظهر مع الانبثاق */
        .shadow-lg { box-shadow: 0 10px 30px rgba(4, 120, 87, 0.12); }
      `}</style>
    </div>
);
}
