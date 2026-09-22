import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ExternalLink, 
  RefreshCw, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Link, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { GOOGLE_SHEET_ID, GOOGLE_SHEET_CSV_URL, GOOGLE_SHEET_VIEW_URL } from '../data/defaultData';
import { parseCSV } from '../utils/csvParser';
import { HealthRecord } from '../types';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecords: (records: HealthRecord[], sourceLabel: string) => void;
  currentSource: string;
  recordCount: number;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  onUpdateRecords,
  currentSource,
  recordCount
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFetchFromSheet = async () => {
    setIsLoading(true);
    setSyncStatus('idle');
    setErrorMessage('');

    try {
      // Try gviz endpoint first as it has open CORS
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;
      let res = await fetch(gvizUrl);
      
      if (!res.ok) {
        // Fallback to export url
        res = await fetch(GOOGLE_SHEET_CSV_URL);
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Google Sheet นี้จำกัดสิทธิ์เข้าถึง (Private/Restricted) กรุณาตั้งค่าแชร์เป็น "ทุกคนที่มีลิงก์มีสิทธิ์อ่าน" หรือใช้ปุ่มอัปโหลดไฟล์ CSV ด้านล่าง');
        }
        throw new Error(`ไม่สามารถเชื่อมต่อได้ (รหัสสถานะ: ${res.status})`);
      }

      const csvText = await res.text();
      // Check if response is actually HTML sign-in page
      if (csvText.includes('<!DOCTYPE html>') || csvText.includes('accounts.google.com')) {
        throw new Error('Google Sheet แจ้งเตือนให้เข้าสู่ระบบบัญชี Google กรุณาเปิดการแชร์แบบสาธารณะใน Google Sheet หรืออัปโหลดไฟล์ CSV ที่ดาวน์โหลดจาก Sheet นี้');
      }

      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        throw new Error('ไม่พบแถวข้อมูลสุขภาพที่ถูกต้องในชีต');
      }

      onUpdateRecords(parsed, `Google Sheet สด (${GOOGLE_SHEET_ID.slice(0, 10)}...)`);
      setSyncStatus('success');
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          alert('ไม่พบข้อมูลที่ตรงกับโครงสร้างการคัดกรองสุขภาพในไฟล์นี้');
          return;
        }
        onUpdateRecords(parsed, `ไฟล์ CSV: ${file.name}`);
        setSyncStatus('success');
        onClose();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-pink-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 via-pink-500 to-rose-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                การเชื่อมต่อแหล่งข้อมูล (Google Sheet Connection)
              </h3>
              <p className="text-xs text-pink-100">
                ระบบจัดการและซิงค์ข้อมูลการคัดกรองสุขภาพ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Active Status Box */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-sky-900 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>แหล่งข้อมูลปัจจุบัน: {currentSource}</span>
              </div>
              <p className="text-xs text-slate-600">
                จำนวนบันทึกข้อมูลที่โหลดในระบบ: <strong className="text-slate-800">{recordCount} ราย</strong>
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              พร้อมใช้งาน
            </span>
          </div>

          {/* Linked Google Sheet Info Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Google Sheet ID ที่กำหนด
              </span>
              <a
                href={GOOGLE_SHEET_VIEW_URL}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>เปิดใน Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-xs text-slate-700 break-all select-all border border-slate-200">
              {GOOGLE_SHEET_ID}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleFetchFromSheet}
                disabled={isLoading}
                className="flex-1 py-2 px-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'กำลังเชื่อมต่อและดึงข้อมูล...' : 'ซิงค์ข้อมูลสดจาก Sheet ID นี้'}</span>
              </button>

              <a
                href={GOOGLE_SHEET_VIEW_URL}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ดูชีตต้นฉบับ</span>
              </a>
            </div>

            {/* Error or Notification Alert */}
            {syncStatus === 'error' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 animate-fadeIn">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>คำแนะนำการเข้าถึง Google Sheet:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {errorMessage}
                </p>
                <div className="mt-1 p-2 bg-white/70 rounded-lg text-[10px] text-slate-600 space-y-1">
                  <div><strong>วิธีเปิดสิทธิ์สาธารณะ:</strong> ในหน้า Google Sheets ให้กดปุ่ม <em>Share (แชร์)</em> &gt; เปลี่ยนสิทธิ์เป็น <em>Anyone with the link (ทุกคนที่มีลิงก์)</em> ให้เป็น <em>Viewer (ผู้มีสิทธิ์อ่าน)</em></div>
                  <div><strong>หรือ:</strong> ใน Google Sheet ให้กด <em>File (ไฟล์) &gt; Download (ดาวน์โหลด) &gt; CSV (.csv)</em> แล้วนำไฟล์มาอัปโหลดด้านล่างได้ทันที</div>
                </div>
              </div>
            )}

            {syncStatus === 'success' && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>ซิงค์ข้อมูลสำเร็จ! ระบบอัปเดตตัวเลขและแผนภูมิตามข้อมูลล่าสุดแล้ว</span>
              </div>
            )}
          </div>

          {/* Fallback Option: Upload exported CSV directly from this sheet */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              หรือ นำเข้าไฟล์ CSV ที่ดาวน์โหลดจาก Sheet นี้โดยตรง
            </span>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                dragActive ? 'border-pink-500 bg-pink-50/50' : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('csv-file-input')?.click()}
            >
              <input
                id="csv-file-input"
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-6 h-6 mx-auto text-pink-500 mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">
                คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์ CSV มาวางที่นี่
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                รองรับไฟล์ CSV ที่ส่งออกจาก Google Sheet นี้
              </p>
            </div>
          </div>

          {/* Strict compliance reminder */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-pink-600 flex-shrink-0" />
            <span>
              <strong>ระเบียบการจัดทำ:</strong> ห้ามนำข้อมูลจากที่อื่นมาใส่ ข้อมูลทั้งหมดอิงตามเกณฑ์การคัดกรองสุขภาพความเสี่ยง NCDs ของชีตนี้โดยเฉพาะ
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
