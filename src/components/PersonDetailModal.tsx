import React from 'react';
import { X, User, Heart, Activity, AlertTriangle, ShieldCheck, Scale, MapPin, Calendar, Cigarette, Wine } from 'lucide-react';
import { HealthRecord } from '../types';

interface PersonDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-100 transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold shadow-inner">
              {record.gender === 'ชาย' ? '👨' : '👩'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{record.name || record.id}</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  {record.id}
                </span>
              </div>
              <p className="text-xs text-pink-100 flex items-center gap-2 mt-0.5">
                <span>{record.gender}, {record.age} ปี ({record.ageGroup})</span>
                <span>•</span>
                <span>📍 {record.area}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Risk Level Highlight Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            record.riskLevel === 'เสี่ยงสูง'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : record.riskLevel === 'เสี่ยงปานกลาง'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {record.riskLevel === 'เสี่ยงสูง' ? '🔴' : record.riskLevel === 'เสี่ยงปานกลาง' ? '🟡' : '🟢'}
              </span>
              <div>
                <span className="text-xs uppercase tracking-wider block font-semibold">
                  ระดับความเสี่ยงภาพรวม (NCDs Risk Level)
                </span>
                <span className="text-lg font-extrabold">
                  {record.riskLevel}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">คะแนนความเสี่ยง</span>
              <span className="text-xl font-black">{record.riskScore} คะแนน</span>
            </div>
          </div>

          {/* Biological Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Blood Sugar */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-xs text-purple-900 font-semibold block mb-1">
                🩸 น้ำตาลในเลือด (FPG)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-purple-700">{record.bloodSugar}</span>
                <span className="text-xs text-purple-600">mg/dL</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-1">
                ผลคัดกรอง: <strong>{record.diabetesScreening}</strong>
              </span>
            </div>

            {/* Blood Pressure */}
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <span className="text-xs text-rose-900 font-semibold block mb-1">
                💓 ความดันโลหิต (SBP/DBP)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-rose-700">{record.sbp}/{record.dbp}</span>
                <span className="text-xs text-rose-600">mmHg</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-1">
                ผลคัดกรอง: <strong>{record.hypertensionScreening}</strong>
              </span>
            </div>

            {/* BMI */}
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
              <span className="text-xs text-sky-900 font-semibold block mb-1">
                ⚖️ ดัชนีมวลกาย (BMI)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-sky-700">{record.bmi}</span>
                <span className="text-xs text-sky-600">kg/m²</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-1">
                เกณฑ์: <strong>{record.bmi >= 25 ? 'ภาวะอ้วน' : record.bmi >= 23 ? 'น้ำหนักเกิน (ท้วม)' : 'สมส่วน'}</strong>
              </span>
            </div>

            {/* Pulse */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs text-emerald-900 font-semibold block mb-1">
                🩺 อัตราชีพจร (Pulse)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-700">{record.pulse}</span>
                <span className="text-xs text-emerald-600">bpm</span>
              </div>
              <span className="text-[11px] text-slate-600 block mt-1">
                สถานะ: <strong>ปกติ</strong>
              </span>
            </div>

          </div>

          {/* Health Habits */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block">พฤติกรรมสุขภาพที่บันทึก:</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
                <span className="text-slate-400 block text-[10px]">สูบบุหรี่</span>
                <strong className={record.smoking === 'สูบประจำ' ? 'text-rose-600' : 'text-slate-700'}>
                  {record.smoking}
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
                <span className="text-slate-400 block text-[10px]">แอลกอฮอล์</span>
                <strong className={record.alcohol === 'ดื่มประจำ' ? 'text-amber-600' : 'text-slate-700'}>
                  {record.alcohol}
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
                <span className="text-slate-400 block text-[10px]">ออกกำลังกาย</span>
                <strong className={record.exercise === 'ไม่ออกกำลังกาย' ? 'text-rose-600' : 'text-emerald-700'}>
                  {record.exercise}
                </strong>
              </div>
            </div>
          </div>

          {/* Health Recommendations */}
          <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs space-y-1.5">
            <span className="font-bold text-pink-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pink-600" />
              คำแนะนำการดูแลสุขภาพเฉพาะรายบุคคล:
            </span>
            <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px]">
              {record.riskLevel === 'เสี่ยงสูง' && (
                <li className="text-rose-700 font-semibold">ส่งต่อ รพ.สต./แพทย์ เพื่อตรวจยืนยันโรคและรับการรักษาต่อเนื่อง</li>
              )}
              {record.bloodSugar >= 100 && (
                <li>ปรับเปลี่ยนพฤติกรรมการบริโภค ลดหวาน มัน เค็ม และตรวจเลือดซ้ำภายใน 3 เดือน</li>
              )}
              {record.sbp >= 130 && (
                <li>ติดตามวัดความดันโลหิตซ้ำที่บ้านหรือสถานบริการสุขภาพสัปดาห์ละ 1 ครั้ง</li>
              )}
              {record.bmi >= 23 && (
                <li>ควบคุมน้ำหนักตัว และออกกำลังกายระดับปานกลางอย่างน้อย 150 นาที/สัปดาห์</li>
              )}
              {record.smoking === 'สูบประจำ' && (
                <li>เข้าร่วมคลินิกเลิกบุหรี่เพื่อลดความเสี่ยงโรคหัวใจและหลอดเลือด</li>
              )}
              {record.riskLevel === 'เสี่ยงต่ำ' && (
                <li className="text-emerald-700 font-medium">สุขภาพอยู่ในเกณฑ์ดี ควรรักษาสุขนิสัยที่ดีและตรวจคัดกรองประจำปี</li>
              )}
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
