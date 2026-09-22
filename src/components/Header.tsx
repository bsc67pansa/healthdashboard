import React from 'react';
import { 
  Activity, 
  RotateCcw, 
  Filter, 
  Database, 
  Calendar, 
  User, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { GOOGLE_SHEET_ID, GOOGLE_SHEET_VIEW_URL } from '../data/defaultData';

interface HeaderProps {
  lastUpdated: string;
  totalRecords: number;
  filteredCount: number;
  activeFilterCount: number;
  onToggleFilter: () => void;
  onResetFilters: () => void;
  onOpenDataSource: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  activeTab: 'overview' | 'charts' | 'table';
  setActiveTab: (tab: 'overview' | 'charts' | 'table') => void;
  onBackToOverview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  totalRecords,
  filteredCount,
  activeFilterCount,
  onToggleFilter,
  onResetFilters,
  onOpenDataSource,
  onRefreshData,
  isRefreshing,
  activeTab,
  setActiveTab,
  onBackToOverview
}) => {
  return (
    <header className="relative bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm sticky top-0 z-30 transition-all">
      {/* Top soft gradient line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 via-sky-400 to-indigo-400" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-sky-400 flex items-center justify-center shadow-md shadow-pink-500/20 text-white">
                <Activity className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                  คัดกรองข้อมูลสุขภาพ
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
                  <Sparkles className="w-3 h-3 mr-1 text-pink-500" />
                  NCDs Screening
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>ระบบวิเคราะห์และคัดกรองความเสี่ยงโรคเบาหวานและความดันโลหิตสูง</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="inline-flex items-center text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                  <User className="w-3 h-3 mr-1 text-pink-500" />
                  ผู้จัดทำ: พรรษา บอนขุนทด
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="inline-flex items-center text-slate-500 text-xs">
                  <Calendar className="w-3 h-3 mr-1 text-sky-500" />
                  อัปเดต: {lastUpdated}
                </span>
              </p>
            </div>
          </div>

          {/* Action & Navigation Controls (Section 5) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            
            {/* Back Button */}
            {activeTab !== 'overview' && (
              <button
                id="btn-nav-back"
                onClick={onBackToOverview}
                className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shadow-xs"
                title="ย้อนกลับไปหน้าภาพรวม"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180 text-slate-600" />
                ย้อนกลับ
              </button>
            )}

            {/* View Switcher Tabs */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs sm:text-sm font-medium">
              <button
                id="tab-overview"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ภาพรวม KPI
              </button>
              <button
                id="tab-charts"
                onClick={() => setActiveTab('charts')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'charts'
                    ? 'bg-white text-slate-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                กราฟวิเคราะห์
              </button>
              <button
                id="tab-table"
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'table'
                    ? 'bg-white text-slate-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ตารางเชิงลึก
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              id="btn-filter-toggle"
              onClick={onToggleFilter}
              className={`relative inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs border ${
                activeFilterCount > 0
                  ? 'bg-pink-500 text-white border-pink-600 shadow-pink-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <span>ตัวกรองข้อมูล</span>
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-white text-pink-600 rounded-full px-1.5 py-0.2 text-[11px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Clear Filter Button */}
            {activeFilterCount > 0 && (
              <button
                id="btn-filter-clear"
                onClick={onResetFilters}
                className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="ล้างการกรองทั้งหมด"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                ล้างการกรอง
              </button>
            )}

            {/* Google Sheet Sync & Source Button */}
            <button
              id="btn-source-modal"
              onClick={onOpenDataSource}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors shadow-xs"
              title="จัดการการเชื่อมโยง Google Sheet"
            >
              <Database className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
              <span>Google Sheet</span>
            </button>

            {/* Quick Refresh Data */}
            <button
              id="btn-data-refresh"
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              title="ดึงข้อมูลล่าสุดจาก Google Sheet"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-pink-500' : ''}`} />
            </button>
          </div>

        </div>

        {/* Sub-bar showing filter status info */}
        {filteredCount !== totalRecords && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>
              แสดงผลข้อมูลที่ผ่านการกรอง: <strong className="text-slate-800 font-semibold">{filteredCount}</strong> จากทั้งหมด {totalRecords} ราย
            </span>
            <button
              onClick={onResetFilters}
              className="text-pink-600 hover:text-pink-700 hover:underline font-medium"
            >
              แสดงทั้งหมด
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
