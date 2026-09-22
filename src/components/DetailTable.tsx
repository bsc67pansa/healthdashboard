import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  EyeOff,
  Filter, 
  User, 
  Heart, 
  Activity, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { HealthRecord, RiskLevel } from '../types';

interface DetailTableProps {
  records: HealthRecord[];
  onSelectRecord: (record: HealthRecord) => void;
}

type SortField = 'id' | 'age' | 'riskScore' | 'bmi' | 'bloodSugar' | 'sbp' | 'area';
type SortOrder = 'asc' | 'desc';

export const DetailTable: React.FC<DetailTableProps> = ({ records, onSelectRecord }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterRiskOnly, setFilterRiskOnly] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTable, setSearchTable] = useState('');
  const [showIdCol, setShowIdCol] = useState(false);

  // Filtering inside table
  const processedRecords = useMemo(() => {
    let result = [...records];

    if (filterRiskOnly === 'high') {
      result = result.filter(r => r.riskLevel === 'เสี่ยงสูง');
    } else if (filterRiskOnly === 'medium') {
      result = result.filter(r => r.riskLevel === 'เสี่ยงปานกลาง');
    } else if (filterRiskOnly === 'low') {
      result = result.filter(r => r.riskLevel === 'เสี่ยงต่ำ');
    }

    if (searchTable.trim()) {
      const q = searchTable.toLowerCase().trim();
      result = result.filter(r => 
        r.id.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.age.toString().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? (aVal as string).localeCompare(bVal as string) 
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [records, filterRiskOnly, searchTable, sortField, sortOrder]);

  const totalPages = Math.ceil(processedRecords.length / pageSize) || 1;
  const currentRecords = processedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportTableCSV = () => {
    const headers = [
      'รหัส', 'ชื่อ-สกุล', 'เพศ', 'อายุ', 'กลุ่มอายุ', 'พื้นที่', 
      'คะแนนความเสี่ยง', 'ระดับความเสี่ยง', 'เบาหวาน_คัดกรอง', 'ความดันโลหิตสูง_คัดกรอง', 
      'สูบบุหรี่', 'ดื่มแอลกอฮอล์', 'การออกกำลังกาย', 'BMI', 'น้ำตาล_mg_dL', 'SBP_mmHg', 'DBP_mmHg', 'ชีพจร_bpm'
    ];
    
    const rows = processedRecords.map(r => [
      `"${r.id}"`,
      `"${r.name || ''}"`,
      `"${r.gender}"`,
      r.age,
      `"${r.ageGroup}"`,
      `"${r.area}"`,
      r.riskScore,
      `"${r.riskLevel}"`,
      `"${r.diabetesScreening}"`,
      `"${r.hypertensionScreening}"`,
      `"${r.smoking}"`,
      `"${r.alcohol}"`,
      `"${r.exercise}"`,
      r.bmi,
      r.bloodSugar,
      r.sbp,
      r.dbp,
      r.pulse
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายงานคัดกรองสุขภาพ_NCDs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for risk badge styling
  const renderRiskBadge = (level: RiskLevel) => {
    if (level === 'เสี่ยงสูง') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
          <span className="mr-1 text-sm">🔴</span>
          เสี่ยงสูง
        </span>
      );
    }
    if (level === 'เสี่ยงปานกลาง') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <span className="mr-1 text-sm">🟡</span>
          เสี่ยงปานกลาง
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
        <span className="mr-1 text-sm">🟢</span>
        เสี่ยงต่ำ
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden mb-8">
      {/* Table Header Section */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-pink-50/30 via-white to-sky-50/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-gradient-to-b from-rose-500 to-amber-400 rounded-full inline-block" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                ตารางระดับความเสี่ยงของโรคเบาหวานและความดันโลหิตสูง
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงรายละเอียดผลการคัดกรองเชิงลึก พร้อมตัวชี้วัดความเสี่ยง 🔴 เสี่ยงสูง / 🟡 เสี่ยงปานกลาง / 🟢 เสี่ยงต่ำ
            </p>
          </div>

          {/* Table quick controls & export */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Quick Risk Buttons */}
            <div className="inline-flex bg-slate-100 p-0.5 rounded-xl text-xs font-medium border border-slate-200">
              <button
                onClick={() => { setFilterRiskOnly('all'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${filterRiskOnly === 'all' ? 'bg-white text-slate-800 shadow-2xs font-semibold' : 'text-slate-600'}`}
              >
                ทั้งหมด ({records.length})
              </button>
              <button
                onClick={() => { setFilterRiskOnly('high'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${filterRiskOnly === 'high' ? 'bg-rose-500 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-rose-600'}`}
              >
                🔴 เสี่ยงสูง ({records.filter(r => r.riskLevel === 'เสี่ยงสูง').length})
              </button>
              <button
                onClick={() => { setFilterRiskOnly('medium'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${filterRiskOnly === 'medium' ? 'bg-amber-400 text-amber-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-amber-600'}`}
              >
                🟡 ปานกลาง ({records.filter(r => r.riskLevel === 'เสี่ยงปานกลาง').length})
              </button>
              <button
                onClick={() => { setFilterRiskOnly('low'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg transition-all ${filterRiskOnly === 'low' ? 'bg-emerald-500 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-600'}`}
              >
                🟢 เสี่ยงต่ำ ({records.filter(r => r.riskLevel === 'เสี่ยงต่ำ').length})
              </button>
            </div>

            {/* Column visibility toggle */}
            <button
              onClick={() => setShowIdCol(!showIdCol)}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
              title={showIdCol ? "ซ่อนคอลัมน์รหัส/ชื่อ" : "แสดงคอลัมน์รหัส/ชื่อ"}
            >
              {showIdCol ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>ซ่อนรหัส/ชื่อ</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>แสดงรหัส/ชื่อ</span>
                </>
              )}
            </button>

            {/* Export CSV button */}
            <button
              onClick={exportTableCSV}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
              title="ส่งออกข้อมูลเป็นไฟล์ CSV"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
              ส่งออก CSV
            </button>
          </div>

        </div>

        {/* Search bar inside table */}
        <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTable}
              onChange={e => { setSearchTable(e.target.value); setCurrentPage(1); }}
              placeholder="ค้นหาในตาราง..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 self-end sm:self-auto">
            <span>แสดงแถว:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer"
            >
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={50}>50 รายการ</option>
            </select>
            <span>(พบ {processedRecords.length} รายการ)</span>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-3 px-3.5 text-center w-12">ลำดับ</th>
              {showIdCol && (
                <th 
                  onClick={() => handleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>รหัส / ชื่อ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              )}
              <th className="py-3 px-3">เพศ/อายุ</th>
              <th 
                onClick={() => handleSort('area')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>📍 พื้นที่</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('riskScore')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>🎯 คะแนนเสี่ยง</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-center font-bold">
                ระดับความเสี่ยง
              </th>
              <th 
                onClick={() => handleSort('bloodSugar')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>🩸 น้ำตาล (mg/dL)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('sbp')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>💓 ความดัน (SBP/DBP)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('bmi')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>⚖️ BMI</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">พฤติกรรม (บุหรี่/สุรา/ออกกำลัง)</th>
              <th className="py-3 px-3 text-center">ดูข้อมูล</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={showIdCol ? 11 : 10} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              currentRecords.map((r, index) => {
                const rowIndex = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr 
                    key={r.id} 
                    className="hover:bg-pink-50/30 transition-colors cursor-pointer group"
                    onClick={() => onSelectRecord(r)}
                  >
                    <td className="py-2.5 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                      {rowIndex}
                    </td>

                    {showIdCol && (
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 group-hover:text-pink-600 transition-colors">
                          {r.name || r.id}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {r.id}
                        </div>
                      </td>
                    )}

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 font-medium">
                        <span>{r.gender === 'ชาย' ? '👨 ชาย' : '👩 หญิง'}</span>
                        <span className="text-slate-400 font-normal">, {r.age} ปี</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {r.ageGroup}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center text-slate-700">
                        {r.area}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded-md ${
                        r.riskScore >= 9 ? 'bg-rose-100 text-rose-700' :
                        r.riskScore >= 5 ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.riskScore}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {renderRiskBadge(r.riskLevel)}
                    </td>

                    {/* Blood sugar with alert coloring */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`font-semibold ${
                        r.bloodSugar >= 126 ? 'text-rose-600 font-bold' :
                        r.bloodSugar >= 100 ? 'text-amber-600' :
                        'text-emerald-700'
                      }`}>
                        {r.bloodSugar}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {r.diabetesScreening}
                      </span>
                    </td>

                    {/* Blood pressure */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`font-semibold ${
                        r.sbp >= 140 || r.dbp >= 90 ? 'text-rose-600 font-bold' :
                        r.sbp >= 120 || r.dbp >= 80 ? 'text-amber-600' :
                        'text-sky-700'
                      }`}>
                        {r.sbp}/{r.dbp}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {r.hypertensionScreening}
                      </span>
                    </td>

                    {/* BMI */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`font-semibold ${
                        r.bmi >= 25 ? 'text-rose-600' :
                        r.bmi >= 23 ? 'text-amber-600' :
                        'text-slate-700'
                      }`}>
                        {r.bmi}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {r.bmi >= 25 ? 'อ้วน' : r.bmi >= 23 ? 'ท้วม' : 'ปกติ'}
                      </span>
                    </td>

                    {/* Health Behaviors */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1.5 text-[11px]">
                        <span 
                          title={`บุหรี่: ${r.smoking}`} 
                          className={`px-1.5 py-0.5 rounded text-[10px] ${r.smoking === 'สูบประจำ' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-400'}`}
                        >
                          🚬 {r.smoking === 'สูบประจำ' ? 'สูบ' : 'ไม่สูบ'}
                        </span>
                        <span 
                          title={`สุรา: ${r.alcohol}`}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${r.alcohol === 'ดื่มประจำ' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400'}`}
                        >
                          🍷 {r.alcohol === 'ดื่มประจำ' ? 'ดื่ม' : 'ไม่ดื่ม'}
                        </span>
                        <span 
                          title={`ออกกำลัง: ${r.exercise}`}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${r.exercise === 'ออกกำลังกายสม่ำเสมอ' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'}`}
                        >
                          🏃 {r.exercise === 'ไม่ออกกำลังกาย' ? 'ไม่ออก' : 'ออกกำลัง'}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(r);
                        }}
                        className="p-1 rounded-lg text-pink-600 hover:text-pink-700 hover:bg-pink-100/70 transition-colors"
                        title="คลิกดูประวัติสุขภาพอย่างละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <span className="text-xs text-slate-500">
          แสดงรายการที่ {processedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} ถึง {Math.min(currentPage * pageSize, processedRecords.length)} จากทั้งหมด {processedRecords.length} รายการ
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-slate-700 px-2">
            หน้า {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
