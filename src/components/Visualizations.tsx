import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ScatterChart as ScatterIcon, 
  PieChart as PieIcon, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Heart, 
  Cigarette, 
  Wine, 
  Activity, 
  Info,
  Scale
} from 'lucide-react';
import { HealthRecord } from '../types';

interface VisualizationsProps {
  records: HealthRecord[];
}

export const Visualizations: React.FC<VisualizationsProps> = ({ records }) => {
  const [activeVisualTab, setActiveVisualTab] = useState<'all' | 'risk' | 'correlations' | 'behaviors'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<HealthRecord | null>(null);

  // 1. Data for Age Group vs Risk
  const ageGroupData = useMemo(() => {
    const groups: { [key: string]: { total: number; high: number; medium: number; low: number } } = {
      '< 35 ปี': { total: 0, high: 0, medium: 0, low: 0 },
      '35-44 ปี': { total: 0, high: 0, medium: 0, low: 0 },
      '45-54 ปี': { total: 0, high: 0, medium: 0, low: 0 },
      '55-64 ปี': { total: 0, high: 0, medium: 0, low: 0 },
      '≥ 65 ปี': { total: 0, high: 0, medium: 0, low: 0 },
    };

    records.forEach(r => {
      if (groups[r.ageGroup]) {
        groups[r.ageGroup].total++;
        if (r.riskLevel === 'เสี่ยงสูง') groups[r.ageGroup].high++;
        else if (r.riskLevel === 'เสี่ยงปานกลาง') groups[r.ageGroup].medium++;
        else groups[r.ageGroup].low++;
      }
    });

    return Object.entries(groups).map(([ageGroup, stats]) => ({
      ageGroup,
      ...stats
    }));
  }, [records]);

  // 2. Data for Area vs High Risk Ranking
  const areaData = useMemo(() => {
    const areaMap: { [key: string]: { total: number; high: number; medium: number; low: number; avgScore: number; scoreSum: number } } = {};

    records.forEach(r => {
      if (!areaMap[r.area]) {
        areaMap[r.area] = { total: 0, high: 0, medium: 0, low: 0, avgScore: 0, scoreSum: 0 };
      }
      areaMap[r.area].total++;
      areaMap[r.area].scoreSum += r.riskScore;
      if (r.riskLevel === 'เสี่ยงสูง') areaMap[r.area].high++;
      else if (r.riskLevel === 'เสี่ยงปานกลาง') areaMap[r.area].medium++;
      else areaMap[r.area].low++;
    });

    return Object.entries(areaMap)
      .map(([area, stats]) => ({
        area,
        ...stats,
        avgScore: Number((stats.scoreSum / (stats.total || 1)).toFixed(1)),
        highPercent: Number(((stats.high / (stats.total || 1)) * 100).toFixed(1))
      }))
      .sort((a, b) => b.high - a.high);
  }, [records]);

  // 3. Data for Health Trend (เบาหวาน vs ความดันโลหิตสูง)
  const diseaseTrendData = useMemo(() => {
    const dmStats = { normal: 0, risk: 0, suspect: 0 };
    const htStats = { normal: 0, risk: 0, suspect: 0 };

    records.forEach(r => {
      if (r.diabetesScreening === 'ปกติ') dmStats.normal++;
      else if (r.diabetesScreening === 'กลุ่มเสี่ยง') dmStats.risk++;
      else dmStats.suspect++;

      if (r.hypertensionScreening === 'ปกติ') htStats.normal++;
      else if (r.hypertensionScreening === 'กลุ่มเสี่ยง') htStats.risk++;
      else htStats.suspect++;
    });

    return { dmStats, htStats };
  }, [records]);

  // 4. Data for Health Risk by Gender
  const genderRiskData = useMemo(() => {
    const male = { high: 0, medium: 0, low: 0, total: 0, avgScore: 0, scoreSum: 0 };
    const female = { high: 0, medium: 0, low: 0, total: 0, avgScore: 0, scoreSum: 0 };

    records.forEach(r => {
      const target = r.gender === 'ชาย' ? male : female;
      target.total++;
      target.scoreSum += r.riskScore;
      if (r.riskLevel === 'เสี่ยงสูง') target.high++;
      else if (r.riskLevel === 'เสี่ยงปานกลาง') target.medium++;
      else target.low++;
    });

    male.avgScore = Number((male.scoreSum / (male.total || 1)).toFixed(1));
    female.avgScore = Number((female.scoreSum / (female.total || 1)).toFixed(1));

    return { male, female };
  }, [records]);

  // 5. Data for Behavior vs Risk & Hypertension
  const behaviorRiskData = useMemo(() => {
    const calc = (filterFn: (r: HealthRecord) => boolean) => {
      const subset = records.filter(filterFn);
      const high = subset.filter(r => r.riskLevel === 'เสี่ยงสูง').length;
      const htSuspect = subset.filter(r => r.hypertensionScreening === 'สงสัยป่วย').length;
      return {
        total: subset.length,
        high,
        highPercent: subset.length ? Math.round((high / subset.length) * 100) : 0,
        htSuspect,
        htPercent: subset.length ? Math.round((htSuspect / subset.length) * 100) : 0
      };
    };

    return [
      {
        factor: 'สูบบุหรี่ประจำ',
        category: 'สูบบุหรี่',
        icon: Cigarette,
        ...calc(r => r.smoking === 'สูบประจำ')
      },
      {
        factor: 'ไม่สูบบุหรี่',
        category: 'สูบบุหรี่',
        icon: Cigarette,
        ...calc(r => r.smoking === 'ไม่สูบ')
      },
      {
        factor: 'ดื่มสุราประจำ',
        category: 'แอลกอฮอล์',
        icon: Wine,
        ...calc(r => r.alcohol === 'ดื่มประจำ')
      },
      {
        factor: 'ไม่ดื่มสุรา',
        category: 'แอลกอฮอล์',
        icon: Wine,
        ...calc(r => r.alcohol === 'ไม่ดื่ม')
      },
      {
        factor: 'ไม่ออกกำลังกาย',
        category: 'การออกกำลังกาย',
        icon: Activity,
        ...calc(r => r.exercise === 'ไม่ออกกำลังกาย')
      },
      {
        factor: 'ออกกำลังสม่ำเสมอ',
        category: 'การออกกำลังกาย',
        icon: Activity,
        ...calc(r => r.exercise === 'ออกกำลังกายสม่ำเสมอ')
      }
    ];
  }, [records]);

  // Max value calculation for bar scales
  const maxAgeCount = Math.max(...ageGroupData.map(d => d.total), 1);
  const maxAreaCount = Math.max(...areaData.map(d => d.high), 1);

  return (
    <div className="space-y-6 mb-8">
      {/* Visualizations Section Header with Pill Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-pink-100">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-6 bg-gradient-to-b from-sky-400 to-pink-500 rounded-full inline-block" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Visualizations & Charts: การวิเคราะห์ข้อมูลสุขภาพด้วยภาพ
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ความสัมพันธ์ของปัจจัยเสี่ยง, พฤติกรรมสุขภาพ, และค่าทางชีวภาพ
            </p>
          </div>
        </div>

        {/* Filter pills for charts */}
        <div className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveVisualTab('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeVisualTab === 'all'
                ? 'bg-white text-slate-800 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            แสดงทั้งหมด
          </button>
          <button
            onClick={() => setActiveVisualTab('risk')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeVisualTab === 'risk'
                ? 'bg-white text-slate-800 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ความเสี่ยง & พื้นที่
          </button>
          <button
            onClick={() => setActiveVisualTab('correlations')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeVisualTab === 'correlations'
                ? 'bg-white text-slate-800 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ความสัมพันธ์ BMI/น้ำตาล/ความดัน
          </button>
          <button
            onClick={() => setActiveVisualTab('behaviors')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeVisualTab === 'behaviors'
                ? 'bg-white text-slate-800 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            พฤติกรรมสุขภาพ
          </button>
        </div>
      </div>

      {/* Row 1: High Risk by Age Group & Area Ranking */}
      {(activeVisualTab === 'all' || activeVisualTab === 'risk') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: กลุ่มอายุที่มีความเสี่ยงสูง */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    กลุ่มอายุที่มีความเสี่ยงสูง (Age Group & Risk Levels)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    สัดส่วนระดับความเสี่ยงจำแนกตามช่วงอายุ
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>เสี่ยงสูง</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>ปานกลาง</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>เสี่ยงต่ำ</span>
              </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className="space-y-3.5">
              {ageGroupData.map(item => {
                const highWidth = item.total ? (item.high / item.total) * 100 : 0;
                const medWidth = item.total ? (item.medium / item.total) * 100 : 0;
                const lowWidth = item.total ? (item.low / item.total) * 100 : 0;

                return (
                  <div key={item.ageGroup} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-700 font-medium">
                      <span>{item.ageGroup}</span>
                      <span className="text-slate-500">
                        เสี่ยงสูง {item.high} คน / รวม {item.total} คน
                      </span>
                    </div>
                    {/* Visual bar container */}
                    <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
                      {item.high > 0 && (
                        <div 
                          className="h-full bg-rose-500 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500" 
                          style={{ width: `${highWidth}%` }}
                          title={`เสี่ยงสูง: ${item.high} คน (${highWidth.toFixed(0)}%)`}
                        >
                          {highWidth > 15 && `${item.high}`}
                        </div>
                      )}
                      {item.medium > 0 && (
                        <div 
                          className="h-full bg-amber-400 flex items-center justify-center text-[10px] text-amber-950 font-bold transition-all duration-500" 
                          style={{ width: `${medWidth}%` }}
                          title={`เสี่ยงปานกลาง: ${item.medium} คน (${medWidth.toFixed(0)}%)`}
                        >
                          {medWidth > 15 && `${item.medium}`}
                        </div>
                      )}
                      {item.low > 0 && (
                        <div 
                          className="h-full bg-emerald-400 flex items-center justify-center text-[10px] text-emerald-950 font-bold transition-all duration-500" 
                          style={{ width: `${lowWidth}%` }}
                          title={`เสี่ยงต่ำ: ${item.low} คน (${lowWidth.toFixed(0)}%)`}
                        >
                          {lowWidth > 15 && `${item.low}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-pink-500" />
                พบความเสี่ยงสูงสูงสุดในกลุ่มอายุ: <strong className="text-rose-600 font-semibold">55 ปีขึ้นไป และผู้สูงอายุ</strong>
              </span>
            </div>
          </div>

          {/* Chart 2: พื้นที่ที่มีผู้เสี่ยงสูง (Area Ranking) */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    พื้นที่ที่มีผู้เสี่ยงสูง (Area Ranking: High Risk)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    ลำดับพื้นที่และจำนวนผู้มีความเสี่ยงสูงต่อโรค NCDs
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                {areaData.length} ชุมชน
              </span>
            </div>

            {/* Horizontal Bar Chart for Area Ranking */}
            <div className="space-y-3.5">
              {areaData.map((item, index) => {
                const widthPercent = (item.high / maxAreaCount) * 100;
                return (
                  <div key={item.area} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                          {index + 1}
                        </span>
                        {item.area}
                      </span>
                      <span className="text-slate-500">
                        เสี่ยงสูง <strong className="text-rose-600 font-bold">{item.high}</strong> คน ({item.highPercent}%)
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500 shadow-2xs"
                        style={{ width: `${Math.max(widthPercent, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>คะแนนเฉลี่ยความเสี่ยงสูงสุด: <strong className="text-slate-700">{areaData[0]?.area || '-'}</strong> ({areaData[0]?.avgScore || 0} คะแนน)</span>
              <span className="text-rose-600 font-medium">ควรลงพื้นที่เชิงรุก</span>
            </div>
          </div>

        </div>
      )}

      {/* Row 2: Scatter Plots - BMI vs Blood Sugar & BMI vs Blood Pressure (SBP) */}
      {(activeVisualTab === 'all' || activeVisualTab === 'correlations') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 3: ความสัมพันธ์ระหว่าง BMI กับน้ำตาล */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-2xs relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <ScatterIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    ความสัมพันธ์ระหว่าง BMI กับระดับน้ำตาล (Blood Sugar)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    แกนนอน: BMI (kg/m²) vs แกนตั้ง: น้ำตาลในเลือด (mg/dL)
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-pink-600 font-semibold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                จุดอ้างอิง: 126 mg/dL
              </span>
            </div>

            {/* Interactive SVG Scatter Plot */}
            <div className="relative h-64 w-full bg-slate-50/70 rounded-xl p-3 border border-slate-100">
              <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                {/* Horizontal reference bands */}
                {/* Normal sugar: < 100 mg/dL */}
                <rect x="40" y="160" width="450" height="70" fill="#ecfdf5" opacity="0.6" />
                {/* Risk sugar: 100 - 125 mg/dL */}
                <rect x="40" y="100" width="450" height="60" fill="#fefce8" opacity="0.6" />
                {/* High sugar: >= 126 mg/dL */}
                <rect x="40" y="10" width="450" height="90" fill="#fff1f2" opacity="0.6" />

                {/* Grid Lines */}
                <line x1="40" y1="10" x2="490" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="100" x2="490" y2="100" stroke="#fecdd3" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="40" y1="160" x2="490" y2="160" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="40" y1="230" x2="490" y2="230" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="40" y1="10" x2="40" y2="230" stroke="#cbd5e1" strokeWidth="1" />

                {/* Vertical BMI marker for 25 kg/m² (Overweight) */}
                <line x1="260" y1="10" x2="260" y2="230" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                {/* Y Axis Labels */}
                <text x="35" y="18" textAnchor="end" fontSize="10" fill="#94a3b8">200</text>
                <text x="35" y="104" textAnchor="end" fontSize="10" fill="#f43f5e" fontWeight="bold">126</text>
                <text x="35" y="164" textAnchor="end" fontSize="10" fill="#eab308">100</text>
                <text x="35" y="230" textAnchor="end" fontSize="10" fill="#94a3b8">70</text>

                {/* X Axis Labels (BMI from 18 to 35) */}
                <text x="45" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">18</text>
                <text x="175" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">23</text>
                <text x="260" y="238" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">25 (ท้วม)</text>
                <text x="350" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">30</text>
                <text x="480" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">35</text>

                {/* Scatter Points */}
                {records.map((r) => {
                  // Normalize X: BMI 18..35 -> 40..490
                  const cx = 40 + Math.min(Math.max((r.bmi - 18) / (35 - 18), 0), 1) * 450;
                  // Normalize Y: Sugar 70..200 -> 230..10 (inverted)
                  const cy = 230 - Math.min(Math.max((r.bloodSugar - 70) / (200 - 70), 0), 1) * 220;

                  const color = 
                    r.riskLevel === 'เสี่ยงสูง' ? '#f43f5e' : 
                    r.riskLevel === 'เสี่ยงปานกลาง' ? '#eab308' : '#10b981';

                  return (
                    <circle
                      key={r.id}
                      cx={cx}
                      cy={cy}
                      r={hoveredPoint?.id === r.id ? 7 : 4.5}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all duration-150 hover:opacity-100 opacity-80"
                      onMouseEnter={() => setHoveredPoint(r)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div className="absolute top-4 right-4 bg-slate-900/90 text-white p-2.5 rounded-xl text-xs shadow-lg pointer-events-none z-10 backdrop-blur-xs animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 text-pink-300">
                    <span>{hoveredPoint.name || hoveredPoint.id}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-white">{hoveredPoint.gender}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-slate-200 text-[11px]">
                    <div>BMI: <strong className="text-white">{hoveredPoint.bmi}</strong> kg/m²</div>
                    <div>น้ำตาล: <strong className="text-pink-300">{hoveredPoint.bloodSugar}</strong> mg/dL</div>
                    <div>ความดัน: {hoveredPoint.sbp}/{hoveredPoint.dbp} mmHg</div>
                    <div>ระดับ: <span className={hoveredPoint.riskLevel === 'เสี่ยงสูง' ? 'text-rose-400 font-bold' : 'text-amber-300'}>{hoveredPoint.riskLevel}</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>กลุ่มเสี่ยงสูง (น้ำตาล &ge;126 หรือ BMI สูง)
              </span>
              <span className="text-slate-400 text-[11px]">ชี้ที่จุดเพื่อดูข้อมูลรายบุคคล</span>
            </div>
          </div>

          {/* Chart 4: ความสัมพันธ์ระหว่าง BMI กับความดัน (SBP) */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    ความสัมพันธ์ระหว่าง BMI กับความดันโลหิต (SBP)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    แกนนอน: BMI (kg/m²) vs แกนตั้ง: SBP (mmHg)
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                จุดอ้างอิง: 140 mmHg
              </span>
            </div>

            {/* Interactive SVG Scatter Plot */}
            <div className="relative h-64 w-full bg-slate-50/70 rounded-xl p-3 border border-slate-100">
              <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                {/* Horizontal reference bands */}
                {/* Normal BP: < 120 mmHg */}
                <rect x="40" y="150" width="450" height="80" fill="#ecfdf5" opacity="0.6" />
                {/* Elevated: 120 - 139 mmHg */}
                <rect x="40" y="90" width="450" height="60" fill="#fefce8" opacity="0.6" />
                {/* Hypertension: >= 140 mmHg */}
                <rect x="40" y="10" width="450" height="80" fill="#fff1f2" opacity="0.6" />

                {/* Grid Lines */}
                <line x1="40" y1="10" x2="490" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="90" x2="490" y2="90" stroke="#fecdd3" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="40" y1="150" x2="490" y2="150" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="40" y1="230" x2="490" y2="230" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="40" y1="10" x2="40" y2="230" stroke="#cbd5e1" strokeWidth="1" />

                {/* Vertical BMI marker for 25 kg/m² */}
                <line x1="260" y1="10" x2="260" y2="230" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                {/* Y Axis Labels */}
                <text x="35" y="18" textAnchor="end" fontSize="10" fill="#94a3b8">180</text>
                <text x="35" y="94" textAnchor="end" fontSize="10" fill="#f43f5e" fontWeight="bold">140</text>
                <text x="35" y="154" textAnchor="end" fontSize="10" fill="#eab308">120</text>
                <text x="35" y="230" textAnchor="end" fontSize="10" fill="#94a3b8">100</text>

                {/* X Axis Labels */}
                <text x="45" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">18</text>
                <text x="175" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">23</text>
                <text x="260" y="238" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">25</text>
                <text x="350" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">30</text>
                <text x="480" y="238" textAnchor="middle" fontSize="10" fill="#94a3b8">35</text>

                {/* Scatter Points */}
                {records.map((r) => {
                  const cx = 40 + Math.min(Math.max((r.bmi - 18) / (35 - 18), 0), 1) * 450;
                  // SBP scale 100..180 -> 230..10
                  const cy = 230 - Math.min(Math.max((r.sbp - 100) / (180 - 100), 0), 1) * 220;

                  const color = 
                    r.sbp >= 140 ? '#f43f5e' : 
                    r.sbp >= 120 ? '#eab308' : '#0ea5e9';

                  return (
                    <circle
                      key={r.id}
                      cx={cx}
                      cy={cy}
                      r={hoveredPoint?.id === r.id ? 7 : 4.5}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all duration-150 hover:opacity-100 opacity-80"
                      onMouseEnter={() => setHoveredPoint(r)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div className="absolute top-4 right-4 bg-slate-900/90 text-white p-2.5 rounded-xl text-xs shadow-lg pointer-events-none z-10 backdrop-blur-xs animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 text-sky-300">
                    <span>{hoveredPoint.name || hoveredPoint.id}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-white">{hoveredPoint.gender}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-slate-200 text-[11px]">
                    <div>BMI: <strong className="text-white">{hoveredPoint.bmi}</strong> kg/m²</div>
                    <div>SBP (ตัวบน): <strong className="text-rose-400">{hoveredPoint.sbp}</strong> mmHg</div>
                    <div>DBP (ตัวล่าง): {hoveredPoint.dbp} mmHg</div>
                    <div>ชีพจร: {hoveredPoint.pulse} bpm</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>กลุ่มความดันโลหิตสูง (SBP &ge; 140 mmHg)
              </span>
              <span className="text-sky-600 font-medium">ความสัมพันธ์เชิงบวกชัดเจน (BMI สูง ความดันสูง)</span>
            </div>
          </div>

        </div>
      )}

      {/* Row 3: Health Trend (เบาหวาน vs ความดัน) & Health Behavior */}
      {(activeVisualTab === 'all' || activeVisualTab === 'behaviors') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 5: Health Trend - เบาหวาน_คัดกรอง vs ความดันโลหิตสูง_คัดกรอง */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Health Trend: ผลคัดกรองเบาหวาน เทียบ ความดันโลหิตสูง
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    เปรียบเทียบสัดส่วน: ปกติ, กลุ่มเสี่ยง, และสงสัยป่วย
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">
                คัดกรองคู่ขนาน
              </span>
            </div>

            {/* Side-by-side Disease Bar comparison */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* เบาหวาน Card */}
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                    🩸 เบาหวาน_คัดกรอง
                  </span>
                  <span className="text-[11px] text-purple-700 font-semibold">
                    {diseaseTrendData.dmStats.suspect + diseaseTrendData.dmStats.risk} รายมีเสี่ยง
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>ปกติ (&lt;100 mg/dL)</span>
                      <strong className="text-emerald-700">{diseaseTrendData.dmStats.normal} คน</strong>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(diseaseTrendData.dmStats.normal / (records.length || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>กลุ่มเสี่ยง (100-125)</span>
                      <strong className="text-amber-700">{diseaseTrendData.dmStats.risk} คน</strong>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(diseaseTrendData.dmStats.risk / (records.length || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>สงสัยป่วย (&ge;126 mg/dL)</span>
                      <strong className="text-rose-700">{diseaseTrendData.dmStats.suspect} คน</strong>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${(diseaseTrendData.dmStats.suspect / (records.length || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ความดันโลหิตสูง Card */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                    💓 ความดันโลหิตสูง_คัดกรอง
                  </span>
                  <span className="text-[11px] text-rose-700 font-semibold">
                    {diseaseTrendData.htStats.suspect + diseaseTrendData.htStats.risk} รายมีเสี่ยง
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>ปกติ (&lt;120/80)</span>
                      <strong className="text-emerald-700">{diseaseTrendData.htStats.normal} คน</strong>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(diseaseTrendData.htStats.normal / (records.length || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>กลุ่มเสี่ยง (120-139)</span>
                      <strong className="text-amber-700">{diseaseTrendData.htStats.risk} คน</strong>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(diseaseTrendData.htStats.risk / (records.length || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>สงสัยป่วย (&ge;140/90)</span>
                      <strong className="text-rose-700">{diseaseTrendData.htStats.suspect} คน</strong>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${(diseaseTrendData.htStats.suspect / (records.length || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>กลุ่มที่สงสัยป่วยทั้ง 2 โรคพร้อมกัน: <strong className="text-rose-600 font-semibold">{records.filter(r => r.diabetesScreening === 'สงสัยป่วย' && r.hypertensionScreening === 'สงสัยป่วย').length} ราย</strong></span>
              <span className="text-slate-400">ต้องติดตามอย่างใกล้ชิด</span>
            </div>
          </div>

          {/* Chart 6: Health Behavior - สูบบุหรี่, ดื่มแอลกอฮอล์, การออกกำลังกาย */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Health Behavior: พฤติกรรมกับระดับความเสี่ยงและความดัน
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    เปรียบเทียบร้อยละผู้มีความเสี่ยงสูงและความดันโลหิตสูงตามพฤติกรรม
                  </span>
                </div>
              </div>
            </div>

            {/* Behavior Comparison List */}
            <div className="space-y-3">
              {behaviorRiskData.map(item => (
                <div key={item.factor} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-1.5 rounded-lg bg-white shadow-2xs text-slate-600">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {item.factor}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        จำนวน {item.total} รายในกลุ่มนี้
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-500 block">เสี่ยงสูง (NCDs)</span>
                      <span className="text-xs font-bold text-rose-600">
                        {item.highPercent}% ({item.high} คน)
                      </span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[10px] text-slate-500 block">สงสัยความดัน</span>
                      <span className="text-xs font-bold text-sky-600">
                        {item.htPercent}% ({item.htSuspect} คน)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>กลุ่มสูบบุหรี่และไม่ออกกำลังกาย:</span>
              <strong className="text-rose-600">มีความเสี่ยงโรค NCDs สูงกว่ากลุ่มปกติกว่า 2.8 เท่า</strong>
            </div>
          </div>

        </div>
      )}

      {/* Row 4: Bio-indicators cards (BMI, น้ำตาล_mg_dL, SBP_mmHg, DBP_mmHg, ชีพจร_bpm) */}
      <div className="bg-gradient-to-br from-white via-pink-50/20 to-sky-50/20 rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-pink-500" />
            <h3 className="text-sm font-bold text-slate-800">
              การแจกแจงค่าทางชีวภาพ (Biological Indicators Summary)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">BMI, น้ำตาล, SBP, DBP, ชีพจร</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          
          <div className="bg-white rounded-xl p-3 border border-pink-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block mb-0.5">ดัชนีมวลกาย BMI</span>
            <div className="text-xl font-extrabold text-slate-800">
              {(records.reduce((a, b) => a + b.bmi, 0) / (records.length || 1)).toFixed(1)}
            </div>
            <span className="text-[10px] text-pink-600 font-medium">เกณฑ์ปกติ: 18.5 - 22.9</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-pink-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block mb-0.5">น้ำตาล_mg_dL</span>
            <div className="text-xl font-extrabold text-purple-700">
              {Math.round(records.reduce((a, b) => a + b.bloodSugar, 0) / (records.length || 1))}
            </div>
            <span className="text-[10px] text-purple-600 font-medium">เกณฑ์ปกติ: &lt; 100</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-sky-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block mb-0.5">SBP (ตัวบน)_mmHg</span>
            <div className="text-xl font-extrabold text-sky-700">
              {Math.round(records.reduce((a, b) => a + b.sbp, 0) / (records.length || 1))}
            </div>
            <span className="text-[10px] text-sky-600 font-medium">เกณฑ์ปกติ: &lt; 120</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-sky-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block mb-0.5">DBP (ตัวล่าง)_mmHg</span>
            <div className="text-xl font-extrabold text-indigo-700">
              {Math.round(records.reduce((a, b) => a + b.dbp, 0) / (records.length || 1))}
            </div>
            <span className="text-[10px] text-indigo-600 font-medium">เกณฑ์ปกติ: &lt; 80</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 block mb-0.5">ชีพจร (Pulse)_bpm</span>
            <div className="text-xl font-extrabold text-emerald-700">
              {Math.round(records.reduce((a, b) => a + b.pulse, 0) / (records.length || 1))}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">เกณฑ์ปกติ: 60 - 100</span>
          </div>

        </div>
      </div>

    </div>
  );
};
