import React from 'react';
import { Filter, X, RotateCcw, Search, CheckCircle2, ChevronDown } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  availableAreas: string[];
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  availableAreas,
  isOpen,
  onClose,
  onReset,
  filteredCount,
  totalCount
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = 
    filter.gender !== 'ทั้งหมด' ||
    filter.area !== 'ทั้งหมด' ||
    filter.riskLevel !== 'ทั้งหมด' ||
    filter.ageGroup !== 'ทั้งหมด' ||
    filter.diabetesScreening !== 'ทั้งหมด' ||
    filter.hypertensionScreening !== 'ทั้งหมด' ||
    filter.smoking !== 'ทั้งหมด' ||
    filter.alcohol !== 'ทั้งหมด' ||
    filter.exercise !== 'ทั้งหมด' ||
    filter.searchQuery !== '';

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 mb-6 border border-pink-100 shadow-sm transition-all animate-fadeIn">
      {/* Header of Filter Panel */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-pink-100/70 text-pink-600 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
              ระบบตัวกรองข้อมูลสุขภาพ (Filters)
            </h3>
            <p className="text-xs text-slate-500">
              พบ {filteredCount} รายการ จากทั้งหมด {totalCount} รายการ
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              ล้างค่าทั้งหมด
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            title="ปิดแผงตัวกรอง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            value={filter.searchQuery}
            onChange={e => handleChange('searchQuery', e.target.value)}
            placeholder="ค้นหาตามชื่อ-นามสกุล, รหัส HN, หรือพื้นที่..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {filter.searchQuery && (
            <button
              onClick={() => handleChange('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Main Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Filter: ระดับความเสี่ยง */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>ระดับความเสี่ยง</span>
            <span className="text-[10px] text-pink-600 font-normal">หัวข้อหลัก</span>
          </label>
          <div className="relative">
            <select
              id="filter-risk-level"
              value={filter.riskLevel}
              onChange={e => handleChange('riskLevel', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer font-medium"
            >
              <option value="ทั้งหมด">ระดับความเสี่ยงทั้งหมด</option>
              <option value="เสี่ยงสูง">🔴 เสี่ยงสูง (High Risk)</option>
              <option value="เสี่ยงปานกลาง">🟡 เสี่ยงปานกลาง (Moderate Risk)</option>
              <option value="เสี่ยงต่ำ">🟢 เสี่ยงต่ำ (Low Risk)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Filter: เพศ */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            เพศ (Gender)
          </label>
          <div className="relative">
            <select
              id="filter-gender"
              value={filter.gender}
              onChange={e => handleChange('gender', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">เพศทั้งหมด</option>
              <option value="ชาย">👨 ชาย</option>
              <option value="หญิง">👩 หญิง</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Filter: พื้นที่ / ชุมชน */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            พื้นที่ / ชุมชน (Area)
          </label>
          <div className="relative">
            <select
              id="filter-area"
              value={filter.area}
              onChange={e => handleChange('area', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">พื้นที่ทั้งหมด</option>
              {availableAreas.map(a => (
                <option key={a} value={a}>📍 {a}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 4. Filter: กลุ่มอายุ */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            กลุ่มอายุ (Age Group)
          </label>
          <div className="relative">
            <select
              id="filter-age-group"
              value={filter.ageGroup}
              onChange={e => handleChange('ageGroup', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">ทุกกลุ่มอายุ</option>
              <option value="< 35 ปี">น้อยกว่า 35 ปี</option>
              <option value="35-44 ปี">35 - 44 ปี</option>
              <option value="45-54 ปี">45 - 54 ปี</option>
              <option value="55-64 ปี">55 - 64 ปี</option>
              <option value="≥ 65 ปี">65 ปีขึ้นไป (ผู้สูงอายุ)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Filter: เบาหวาน_คัดกรอง */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ผลคัดกรองเบาหวาน
          </label>
          <div className="relative">
            <select
              id="filter-diabetes"
              value={filter.diabetesScreening}
              onChange={e => handleChange('diabetesScreening', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">ผลคัดกรองเบาหวานทั้งหมด</option>
              <option value="ปกติ">ปกติ (&lt;100 mg/dL)</option>
              <option value="กลุ่มเสี่ยง">กลุ่มเสี่ยง (100-125 mg/dL)</option>
              <option value="สงสัยป่วย">สงสัยป่วย (&ge;126 mg/dL)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 6. Filter: ความดันโลหิตสูง_คัดกรอง */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ผลคัดกรองความดันโลหิตสูง
          </label>
          <div className="relative">
            <select
              id="filter-hypertension"
              value={filter.hypertensionScreening}
              onChange={e => handleChange('hypertensionScreening', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">ผลคัดกรองความดันทั้งหมด</option>
              <option value="ปกติ">ปกติ (&lt;120/80 mmHg)</option>
              <option value="กลุ่มเสี่ยง">กลุ่มเสี่ยง (120-139 / 80-89)</option>
              <option value="สงสัยป่วย">สงสัยป่วย (&ge;140/90 mmHg)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 7. Filter: สูบบุหรี่ */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            การสูบบุหรี่ (Smoking)
          </label>
          <div className="relative">
            <select
              id="filter-smoking"
              value={filter.smoking}
              onChange={e => handleChange('smoking', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="ไม่สูบ">ไม่สูบ</option>
              <option value="เคยสูบแต่เลิกแล้ว">เคยสูบแต่เลิกแล้ว</option>
              <option value="สูบประจำ">สูบประจำ</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 8. Filter: การออกกำลังกาย */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            การออกกำลังกาย (Exercise)
          </label>
          <div className="relative">
            <select
              id="filter-exercise"
              value={filter.exercise}
              onChange={e => handleChange('exercise', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="ออกกำลังกายสม่ำเสมอ">ออกกำลังกายสม่ำเสมอ</option>
              <option value="ออกกำลังกายบ้าง">ออกกำลังกายบ้าง</option>
              <option value="ไม่ออกกำลังกาย">ไม่ออกกำลังกาย</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">กำลังกรอง:</span>
          {filter.riskLevel !== 'ทั้งหมด' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
              ความเสี่ยง: {filter.riskLevel}
              <button onClick={() => handleChange('riskLevel', 'ทั้งหมด')} className="ml-1 hover:text-pink-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.gender !== 'ทั้งหมด' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
              เพศ: {filter.gender}
              <button onClick={() => handleChange('gender', 'ทั้งหมด')} className="ml-1 hover:text-sky-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.area !== 'ทั้งหมด' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              พื้นที่: {filter.area}
              <button onClick={() => handleChange('area', 'ทั้งหมด')} className="ml-1 hover:text-indigo-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.ageGroup !== 'ทั้งหมด' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              อายุ: {filter.ageGroup}
              <button onClick={() => handleChange('ageGroup', 'ทั้งหมด')} className="ml-1 hover:text-amber-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.diabetesScreening !== 'ทั้งหมด' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              เบาหวาน: {filter.diabetesScreening}
              <button onClick={() => handleChange('diabetesScreening', 'ทั้งหมด')} className="ml-1 hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter.hypertensionScreening !== 'ทั้งหมด' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ความดัน: {filter.hypertensionScreening}
              <button onClick={() => handleChange('hypertensionScreening', 'ทั้งหมด')} className="ml-1 hover:text-red-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
