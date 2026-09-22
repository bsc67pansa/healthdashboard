import React, { useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_HEALTH_RECORDS, 
  calculateKPIs, 
  filterRecords,
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_CSV_URL
} from './data/defaultData';
import { HealthRecord, FilterState } from './types';
import { parseCSV } from './utils/csvParser';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KPICards } from './components/KPICards';
import { Visualizations } from './components/Visualizations';
import { DetailTable } from './components/DetailTable';
import { PersonDetailModal } from './components/PersonDetailModal';
import { DataSourceModal } from './components/DataSourceModal';
import { 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [dataSourceLabel, setDataSourceLabel] = useState<string>(
    `ชุดข้อมูลคัดกรองเบื้องต้น (ตรงตาม Sheet ID: ${GOOGLE_SHEET_ID.slice(0, 8)}...)`
  );
  
  // Format current Thai Date Time
  const [lastUpdated, setLastUpdated] = useState<string>('22 ก.ย. 2569 11:22 น.');

  // Filter state
  const initialFilter: FilterState = {
    gender: 'ทั้งหมด',
    area: 'ทั้งหมด',
    riskLevel: 'ทั้งหมด',
    ageGroup: 'ทั้งหมด',
    diabetesScreening: 'ทั้งหมด',
    hypertensionScreening: 'ทั้งหมด',
    smoking: 'ทั้งหมด',
    alcohol: 'ทั้งหมด',
    exercise: 'ทั้งหมด',
    searchQuery: '',
  };

  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'table'>('overview');
  const [selectedPerson, setSelectedPerson] = useState<HealthRecord | null>(null);
  const [isDataSourceOpen, setIsDataSourceOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract unique areas
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set).sort();
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filter);
  }, [records, filter]);

  // KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(filteredRecords);
  }, [filteredRecords]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.gender !== 'ทั้งหมด') count++;
    if (filter.area !== 'ทั้งหมด') count++;
    if (filter.riskLevel !== 'ทั้งหมด') count++;
    if (filter.ageGroup !== 'ทั้งหมด') count++;
    if (filter.diabetesScreening !== 'ทั้งหมด') count++;
    if (filter.hypertensionScreening !== 'ทั้งหมด') count++;
    if (filter.smoking !== 'ทั้งหมด') count++;
    if (filter.alcohol !== 'ทั้งหมด') count++;
    if (filter.exercise !== 'ทั้งหมด') count++;
    if (filter.searchQuery.trim() !== '') count++;
    return count;
  }, [filter]);

  const handleResetFilters = () => {
    setFilter(initialFilter);
  };

  const handleBackToOverview = () => {
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;
      let res = await fetch(gvizUrl);
      if (!res.ok) {
        res = await fetch(GOOGLE_SHEET_CSV_URL);
      }
      if (res.ok) {
        const text = await res.text();
        if (!text.includes('<!DOCTYPE html>')) {
          const parsed = parseCSV(text);
          if (parsed.length > 0) {
            setRecords(parsed);
            setDataSourceLabel(`Google Sheet สด (${GOOGLE_SHEET_ID.slice(0, 8)}...)`);
          }
        }
      }
    } catch (e) {
      // silently keep current data
    } finally {
      const now = new Date();
      setLastUpdated(
        `${now.getDate()} ก.ย. 2569 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`
      );
      setIsRefreshing(false);
    }
  };

  // Attempt initial fetch on mount
  useEffect(() => {
    handleRefreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-sky-50/40 to-white text-slate-800 flex flex-col">
      
      {/* 1. Header & Navigation Controls */}
      <Header
        lastUpdated={lastUpdated}
        totalRecords={records.length}
        filteredCount={filteredRecords.length}
        activeFilterCount={activeFilterCount}
        onToggleFilter={() => setIsFilterOpen(prev => !prev)}
        onResetFilters={handleResetFilters}
        onOpenDataSource={() => setIsDataSourceOpen(true)}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBackToOverview={handleBackToOverview}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Filter Bar (Collapsible with Active Indicator) */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          availableAreas={availableAreas}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onReset={handleResetFilters}
          filteredCount={filteredRecords.length}
          totalCount={records.length}
        />

        {/* Tab 1: Overview (KPIs + Highlight Visualizations + Detailed Table preview) */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards (Section 2) */}
            <KPICards kpi={kpis} />

            {/* Visualizations Quick Section (Section 3) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-6 bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full inline-block" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    สรุปผลการวิเคราะห์ทางสถิติ (Statistical Highlights)
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('charts')}
                  className="text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
                >
                  <span>ดูกราฟวิเคราะห์ทั้งหมด (Visualizations)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <Visualizations records={filteredRecords} />
            </div>

            {/* Deep Detail Data Table (Section 4) */}
            <div>
              <DetailTable 
                records={filteredRecords} 
                onSelectRecord={r => setSelectedPerson(r)} 
              />
            </div>
          </div>
        )}

        {/* Tab 2: Full Visualizations / Charts Focus */}
        {activeTab === 'charts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  ห้องปฏิบัติการวิเคราะห์ข้อมูลด้วยภาพ (Analytics Studio)
                </h2>
                <p className="text-xs text-slate-500">
                  เจาะลึกความสัมพันธ์ระหว่างพฤติกรรม, ค่าชีวภาพ BMI/น้ำตาล/ความดัน, และกลุ่มพื้นที่
                </p>
              </div>
              <button
                onClick={handleBackToOverview}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                ← ย้อนกลับไปภาพรวม
              </button>
            </div>

            <Visualizations records={filteredRecords} />
          </div>
        )}

        {/* Tab 3: Full Table View Focus */}
        {activeTab === 'table' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  ฐานข้อมูลคัดกรองสุขภาพรายบุคคล (Screening Records Table)
                </h2>
                <p className="text-xs text-slate-500">
                  ตารางแสดงข้อมูลจำแนกตามสีความเสี่ยง: 🔴 เสี่ยงสูง / 🟡 เสี่ยงปานกลาง / 🟢 เสี่ยงต่ำ
                </p>
              </div>
              <button
                onClick={handleBackToOverview}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                ← ย้อนกลับไปภาพรวม
              </button>
            </div>

            <DetailTable 
              records={filteredRecords} 
              onSelectRecord={r => setSelectedPerson(r)} 
            />
          </div>
        )}

      </main>

      {/* Person Detail Modal */}
      <PersonDetailModal
        record={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />

      {/* Data Source & Google Sheet Connection Modal */}
      <DataSourceModal
        isOpen={isDataSourceOpen}
        onClose={() => setIsDataSourceOpen(false)}
        onUpdateRecords={(newRecords, label) => {
          setRecords(newRecords);
          setDataSourceLabel(label);
        }}
        currentSource={dataSourceLabel}
        recordCount={records.length}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-pink-100/80 bg-white/70 backdrop-blur-xs py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-semibold text-slate-700">คัดกรองข้อมูลสุขภาพ (Health Screening Dashboard)</span>
            <span>•</span>
            <span>ผู้จัดทำ: <strong className="text-pink-600 font-semibold">พรรษา บอนขุนทด</strong></span>
            <span>•</span>
            <span className="font-mono text-slate-400">Sheet ID: {GOOGLE_SHEET_ID}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span>โทนสีชมพูไล่ฟ้าขาว</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">ระบบพร้อมใช้งาน</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
