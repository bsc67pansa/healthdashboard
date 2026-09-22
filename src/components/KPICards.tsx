import React from 'react';
import { 
  Users, 
  Activity, 
  Heart, 
  Flame, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  PieChart as PieIcon, 
  AlertTriangle,
  CheckCircle2,
  Droplet
} from 'lucide-react';
import { KPISummary } from '../types';

interface KPICardsProps {
  kpi: KPISummary;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpi }) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Section Subtitle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-6 bg-gradient-to-b from-pink-500 to-sky-500 rounded-full inline-block" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Health Overview: สรุปภาพรวมตัวชี้วัดสำคัญ (KPI Summary)
          </h2>
        </div>
        <span className="text-xs text-slate-500 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
          คำนวณจากประชากร {kpi.totalCount} ราย
        </span>
      </div>

      {/* Row 1: Primary Dimensions (จำนวน, ค่าเฉลี่ยหลัก, สัดส่วน, ร้อยละเสี่ยงสูง) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: จำนวน (Total Count) */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-100/50 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg">
              จำนวน (Count)
            </span>
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {kpi.totalCount.toLocaleString()}
              <span className="text-sm font-medium text-slate-500 ml-1.5 font-normal">คน</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">ผู้เข้ารับการคัดกรองสุขภาพทั้งหมด</p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">สัดส่วนประชากร:</span>
            <span className="font-semibold text-pink-600">ครบตามเกณฑ์ 100%</span>
          </div>
        </div>

        {/* KPI 2: ค่าเฉลี่ย (Averages) */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-sky-100/50 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
              ค่าเฉลี่ย (Averages)
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block">เฉลี่ยน้ำตาล</span>
              <span className="text-lg font-bold text-slate-800">{kpi.avgBloodSugar}</span>
              <span className="text-[10px] text-slate-500 ml-1">mg/dL</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">เฉลี่ย BMI</span>
              <span className="text-lg font-bold text-slate-800">{kpi.avgBmi}</span>
              <span className="text-[10px] text-slate-500 ml-1">kg/m²</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">เฉลี่ยความดัน</span>
              <span className="text-sm font-bold text-slate-800">{kpi.avgSbp}/{kpi.avgDbp}</span>
              <span className="text-[10px] text-slate-500 ml-1">mmHg</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">เฉลี่ยคะแนนเสี่ยง</span>
              <span className="text-sm font-bold text-pink-600">{kpi.avgRiskScore}</span>
              <span className="text-[10px] text-slate-500 ml-1">คะแนน</span>
            </div>
          </div>
        </div>

        {/* KPI 3: สัดส่วน (Proportion: ชาย vs หญิง) */}
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-100/50 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              สัดส่วน (Proportion)
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>👨 ชาย: {kpi.genderRatio.male} คน ({kpi.genderRatio.malePercent}%)</span>
              <span>👩 หญิง: {kpi.genderRatio.female} คน ({kpi.genderRatio.femalePercent}%)</span>
            </div>
            {/* Visual ratio bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-sky-500 transition-all duration-500" 
                style={{ width: `${kpi.genderRatio.malePercent}%` }}
                title={`ชาย: ${kpi.genderRatio.malePercent}%`}
              />
              <div 
                className="h-full bg-pink-500 transition-all duration-500" 
                style={{ width: `${kpi.genderRatio.femalePercent}%` }}
                title={`หญิง: ${kpi.genderRatio.femalePercent}%`}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>ชาย</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>หญิง</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>อัตราส่วน (ชาย : หญิง):</span>
            <span className="font-semibold text-slate-700">
              1 : {kpi.genderRatio.male > 0 ? (kpi.genderRatio.female / kpi.genderRatio.male).toFixed(2) : '-'}
            </span>
          </div>
        </div>

        {/* KPI 4: ร้อยละ (Percentage) ของกลุ่มเสี่ยงสูง */}
        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-100/50 rounded-full group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
              ร้อยละ (Percentage)
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                {kpi.highRiskPercent}%
              </span>
              <span className="text-xs text-rose-600 font-medium">กลุ่มเสี่ยงสูง</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              จำนวน {kpi.highRiskCount} คน (จาก {kpi.totalCount} คน)
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              ต้องส่งต่อพบแพทย์:
            </span>
            <span className="font-bold text-rose-600">{kpi.highRiskCount} ราย</span>
          </div>
        </div>

      </div>

      {/* Row 2: Secondary KPI Bar (ค่าต่ำสุด-ค่าสูงสุด & สรุปร้อยละโรครายกลุ่ม) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Min & Max Cards */}
        <div className="bg-gradient-to-r from-sky-50/60 to-pink-50/60 rounded-2xl p-4.5 border border-sky-100/80 shadow-2xs">
          <div className="flex items-center space-x-2 mb-3">
            <span className="p-1.5 bg-white text-sky-600 rounded-lg shadow-2xs border border-sky-100">
              <TrendingDown className="w-4 h-4" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              ค่าต่ำสุด - ค่าสูงสุด (Minimum & Maximum Ranges)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">น้ำตาลในเลือด</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-emerald-600 block">ต่ำสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.minBloodSugar}</span>
                </div>
                <span className="text-slate-300">-</span>
                <div>
                  <span className="text-[10px] text-rose-600 block text-right">สูงสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.maxBloodSugar}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block text-right mt-0.5">mg/dL</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">ความดันตัวบน (SBP)</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-emerald-600 block">ต่ำสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.minSbp}</span>
                </div>
                <span className="text-slate-300">-</span>
                <div>
                  <span className="text-[10px] text-rose-600 block text-right">สูงสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.maxSbp}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block text-right mt-0.5">mmHg</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">ดัชนีมวลกาย (BMI)</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-emerald-600 block">ต่ำสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.minBmi}</span>
                </div>
                <span className="text-slate-300">-</span>
                <div>
                  <span className="text-[10px] text-rose-600 block text-right">สูงสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.maxBmi}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block text-right mt-0.5">kg/m²</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">คะแนนความเสี่ยง</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-emerald-600 block">ต่ำสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.minRiskScore}</span>
                </div>
                <span className="text-slate-300">-</span>
                <div>
                  <span className="text-[10px] text-rose-600 block text-right">สูงสุด</span>
                  <span className="text-sm font-bold text-slate-800">{kpi.maxRiskScore}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block text-right mt-0.5">คะแนน</span>
            </div>

          </div>
        </div>

        {/* Risk Breakdown & Disease Proportions */}
        <div className="bg-white rounded-2xl p-4.5 border border-pink-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-500" />
              การกระจายตัวตามระดับความเสี่ยง (Risk Distribution)
            </span>
            <span className="text-[11px] text-slate-500">เกณฑ์ 3 ระดับสี</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            
            {/* Low Risk */}
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1">
                <span>🟢 เสี่ยงต่ำ</span>
              </div>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                {kpi.lowRiskPercent}%
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">
                {kpi.lowRiskCount} คน
              </div>
            </div>

            {/* Medium Risk */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1">
                <span>🟡 เสี่ยงปานกลาง</span>
              </div>
              <div className="text-xl font-bold text-amber-700 mt-1">
                {kpi.mediumRiskPercent}%
              </div>
              <div className="text-[10px] text-amber-600 mt-0.5">
                {kpi.mediumRiskCount} คน
              </div>
            </div>

            {/* High Risk */}
            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="text-xs font-semibold text-rose-800 flex items-center justify-center gap-1">
                <span>🔴 เสี่ยงสูง</span>
              </div>
              <div className="text-xl font-bold text-rose-700 mt-1">
                {kpi.highRiskPercent}%
              </div>
              <div className="text-[10px] text-rose-600 mt-0.5">
                {kpi.highRiskCount} คน
              </div>
            </div>

          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-purple-500" />
              เสี่ยง/ป่วยเบาหวาน: <strong className="text-purple-700 font-semibold">{kpi.diabetesRiskPercent}%</strong> ({kpi.diabetesRiskCount} คน)
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              เสี่ยง/ป่วยความดัน: <strong className="text-rose-700 font-semibold">{kpi.hypertensionRiskPercent}%</strong> ({kpi.hypertensionRiskCount} คน)
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
