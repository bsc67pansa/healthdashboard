import { HealthRecord, KPISummary, FilterState } from '../types';
import { getAgeGroup } from '../utils/csvParser';

export const GOOGLE_SHEET_ID = '14v6S8IK1KLEwiauumfj_Kqtz_HjGbtLvBe5RNULksSk';
export const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;
export const GOOGLE_SHEET_VIEW_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;

// Initial screening dataset based on community health screening protocol
export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  { id: 'HN-001', name: 'นายสมชาย คำดี', gender: 'ชาย', age: 58, ageGroup: '55-64 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 11, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'สูบประจำ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ไม่ออกกำลังกาย', bmi: 28.4, bloodSugar: 142, sbp: 154, dbp: 96, pulse: 82 },
  { id: 'HN-002', name: 'นางสมศรี ใจงาม', gender: 'หญิง', age: 46, ageGroup: '45-54 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 6, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 24.8, bloodSugar: 108, sbp: 124, dbp: 80, pulse: 74 },
  { id: 'HN-003', name: 'นายบุญมา ทรัพย์คง', gender: 'ชาย', age: 67, ageGroup: '≥ 65 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 13, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 29.1, bloodSugar: 168, sbp: 162, dbp: 98, pulse: 78 },
  { id: 'HN-004', name: 'นางอำไพ สดใส', gender: 'หญิง', age: 34, ageGroup: '< 35 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 2, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 20.5, bloodSugar: 86, sbp: 112, dbp: 72, pulse: 70 },
  { id: 'HN-005', name: 'นายวิชัย สุวรรณ', gender: 'ชาย', age: 52, ageGroup: '45-54 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 8, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'สูบประจำ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ไม่ออกกำลังกาย', bmi: 26.2, bloodSugar: 114, sbp: 136, dbp: 86, pulse: 84 },
  { id: 'HN-006', name: 'นางสาวมาลี รุ่งเรือง', gender: 'หญิง', age: 39, ageGroup: '35-44 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 3, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 21.8, bloodSugar: 92, sbp: 118, dbp: 76, pulse: 72 },
  { id: 'HN-007', name: 'นายสมพร ชัยมงคล', gender: 'ชาย', age: 62, ageGroup: '55-64 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 12, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'สงสัยป่วย', smoking: 'สูบประจำ', alcohol: 'ดื่มประจำ', exercise: 'ไม่ออกกำลังกาย', bmi: 27.9, bloodSugar: 122, sbp: 158, dbp: 94, pulse: 88 },
  { id: 'HN-008', name: 'นางวรรณา ศรีสุข', gender: 'หญิง', age: 54, ageGroup: '45-54 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 7, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 25.4, bloodSugar: 110, sbp: 132, dbp: 84, pulse: 76 },
  { id: 'HN-009', name: 'นายประสิทธิ์ วงศ์ษา', gender: 'ชาย', age: 41, ageGroup: '35-44 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 4, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 22.9, bloodSugar: 94, sbp: 122, dbp: 78, pulse: 68 },
  { id: 'HN-010', name: 'นางทองหล่อ แก้วมณี', gender: 'หญิง', age: 71, ageGroup: '≥ 65 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 10, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 26.8, bloodSugar: 138, sbp: 150, dbp: 90, pulse: 75 },
  { id: 'HN-011', name: 'นายมนูญ กลิ่นหอม', gender: 'ชาย', age: 49, ageGroup: '45-54 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 6, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'ปกติ', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 24.3, bloodSugar: 98, sbp: 134, dbp: 85, pulse: 77 },
  { id: 'HN-012', name: 'นางสาวรัชนี อินทร์แก้ว', gender: 'หญิง', age: 31, ageGroup: '< 35 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 1, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 19.8, bloodSugar: 84, sbp: 110, dbp: 70, pulse: 72 },
  { id: 'HN-013', name: 'นายอนุชา พูนผล', gender: 'ชาย', age: 56, ageGroup: '55-64 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 10, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'สูบประจำ', alcohol: 'ดื่มประจำ', exercise: 'ไม่ออกกำลังกาย', bmi: 28.0, bloodSugar: 135, sbp: 138, dbp: 88, pulse: 86 },
  { id: 'HN-014', name: 'นางบัวลอย สว่างเนตร', gender: 'หญิง', age: 63, ageGroup: '55-64 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 9, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'สงสัยป่วย', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 27.2, bloodSugar: 118, sbp: 148, dbp: 92, pulse: 79 },
  { id: 'HN-015', name: 'นายชูเกียรติ ยอดทอง', gender: 'ชาย', age: 44, ageGroup: '35-44 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 5, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'ปกติ', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายบ้าง', bmi: 25.1, bloodSugar: 99, sbp: 130, dbp: 82, pulse: 73 },
  { id: 'HN-016', name: 'นางละม่อม ประชาชน', gender: 'หญิง', age: 68, ageGroup: '≥ 65 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 11, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 29.5, bloodSugar: 152, sbp: 160, dbp: 96, pulse: 80 },
  { id: 'HN-017', name: 'นายสุริยา แสงดาว', gender: 'ชาย', age: 36, ageGroup: '35-44 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 3, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 22.4, bloodSugar: 90, sbp: 116, dbp: 74, pulse: 69 },
  { id: 'HN-018', name: 'นางจันทร์ทิพย์ ชัยวัฒน์', gender: 'หญิง', age: 48, ageGroup: '45-54 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 6, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 24.6, bloodSugar: 105, sbp: 126, dbp: 82, pulse: 75 },
  { id: 'HN-019', name: 'นายธีระศักดิ์ ยิ่งยง', gender: 'ชาย', age: 59, ageGroup: '55-64 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 12, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'สูบประจำ', alcohol: 'ดื่มประจำ', exercise: 'ไม่ออกกำลังกาย', bmi: 30.2, bloodSugar: 160, sbp: 164, dbp: 100, pulse: 90 },
  { id: 'HN-020', name: 'นางสาวสุดาพร มั่งมี', gender: 'หญิง', age: 29, ageGroup: '< 35 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 1, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 20.1, bloodSugar: 82, sbp: 108, dbp: 68, pulse: 71 },
  { id: 'HN-021', name: 'นายเกรียงไกร มีโชค', gender: 'ชาย', age: 51, ageGroup: '45-54 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 8, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายบ้าง', bmi: 26.0, bloodSugar: 112, sbp: 135, dbp: 87, pulse: 81 },
  { id: 'HN-022', name: 'นางนภาพร จรัสแสง', gender: 'หญิง', age: 57, ageGroup: '55-64 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 9, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 27.5, bloodSugar: 132, sbp: 128, dbp: 82, pulse: 76 },
  { id: 'HN-023', name: 'นายปรีชา สิทธิโชค', gender: 'ชาย', age: 64, ageGroup: '55-64 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 11, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'สงสัยป่วย', smoking: 'สูบประจำ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 28.2, bloodSugar: 124, sbp: 156, dbp: 95, pulse: 84 },
  { id: 'HN-024', name: 'นางกรรณิการ์ บัวแก้ว', gender: 'หญิง', age: 43, ageGroup: '35-44 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 4, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 23.1, bloodSugar: 93, sbp: 120, dbp: 78, pulse: 72 },
  { id: 'HN-025', name: 'นายสมบัติ ศรีเงิน', gender: 'ชาย', age: 70, ageGroup: '≥ 65 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 13, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 28.8, bloodSugar: 172, sbp: 168, dbp: 98, pulse: 77 },
  { id: 'HN-026', name: 'นางสมจิตต์ กลิ่นประทุม', gender: 'หญิง', age: 50, ageGroup: '45-54 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 7, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 25.6, bloodSugar: 109, sbp: 132, dbp: 84, pulse: 75 },
  { id: 'HN-027', name: 'นายศราวุธ คงมั่น', gender: 'ชาย', age: 38, ageGroup: '35-44 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 3, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 22.0, bloodSugar: 89, sbp: 118, dbp: 75, pulse: 67 },
  { id: 'HN-028', name: 'นางสาวพิมพา พรหมมา', gender: 'หญิง', age: 33, ageGroup: '< 35 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 2, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 20.8, bloodSugar: 87, sbp: 114, dbp: 72, pulse: 73 },
  { id: 'HN-029', name: 'นายทวีป เจริญศิลป์', gender: 'ชาย', age: 61, ageGroup: '55-64 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 10, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'สูบประจำ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ไม่ออกกำลังกาย', bmi: 27.6, bloodSugar: 136, sbp: 139, dbp: 89, pulse: 85 },
  { id: 'HN-030', name: 'นางอารีย์ พงษ์สิทธิ์', gender: 'หญิง', age: 55, ageGroup: '55-64 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 8, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 26.5, bloodSugar: 116, sbp: 136, dbp: 86, pulse: 78 },
  { id: 'HN-031', name: 'นายธวัชชัย รุ่งอรุณ', gender: 'ชาย', age: 47, ageGroup: '45-54 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 7, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'ปกติ', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายบ้าง', bmi: 25.8, bloodSugar: 99, sbp: 138, dbp: 88, pulse: 79 },
  { id: 'HN-032', name: 'นางอุบล ปัญญารักษ์', gender: 'หญิง', age: 66, ageGroup: '≥ 65 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 12, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 28.5, bloodSugar: 155, sbp: 162, dbp: 97, pulse: 81 },
  { id: 'HN-033', name: 'นายชลิต ทองใบ', gender: 'ชาย', age: 35, ageGroup: '35-44 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 2, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 21.5, bloodSugar: 88, sbp: 115, dbp: 74, pulse: 68 },
  { id: 'HN-034', name: 'นางมาลินี สุจริต', gender: 'หญิง', age: 45, ageGroup: '45-54 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 5, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 24.2, bloodSugar: 104, sbp: 122, dbp: 79, pulse: 74 },
  { id: 'HN-035', name: 'นายสุรพล ดำรงเกียรติ', gender: 'ชาย', age: 63, ageGroup: '55-64 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 11, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'สูบประจำ', alcohol: 'ดื่มประจำ', exercise: 'ไม่ออกกำลังกาย', bmi: 29.3, bloodSugar: 148, sbp: 156, dbp: 96, pulse: 87 },
  { id: 'HN-036', name: 'นางสาวสายใจ นวลละออง', gender: 'หญิง', age: 37, ageGroup: '35-44 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 3, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 22.3, bloodSugar: 91, sbp: 116, dbp: 73, pulse: 70 },
  { id: 'HN-037', name: 'นายจรูญ กาญจนา', gender: 'ชาย', age: 53, ageGroup: '45-54 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 8, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'สูบประจำ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ไม่ออกกำลังกาย', bmi: 26.7, bloodSugar: 115, sbp: 137, dbp: 87, pulse: 83 },
  { id: 'HN-038', name: 'นางวรรณวิภา ทองมี', gender: 'หญิง', age: 42, ageGroup: '35-44 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 4, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 23.4, bloodSugar: 94, sbp: 121, dbp: 77, pulse: 71 },
  { id: 'HN-039', name: 'นายอดิศักดิ์ บุญชู', gender: 'ชาย', age: 69, ageGroup: '≥ 65 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 14, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'เคยสูบแต่เลิกแล้ว', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 30.5, bloodSugar: 180, sbp: 170, dbp: 102, pulse: 80 },
  { id: 'HN-040', name: 'นางปราณี พลอยงาม', gender: 'หญิง', age: 58, ageGroup: '55-64 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 9, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 27.8, bloodSugar: 130, sbp: 138, dbp: 88, pulse: 76 },
  { id: 'HN-041', name: 'นายณรงค์ เกียรติสุข', gender: 'ชาย', age: 48, ageGroup: '45-54 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 6, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'ปกติ', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'ไม่สูบ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายบ้าง', bmi: 24.9, bloodSugar: 97, sbp: 133, dbp: 85, pulse: 75 },
  { id: 'HN-042', name: 'นางสุภาพรรณ เรืองรอง', gender: 'หญิง', age: 32, ageGroup: '< 35 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 1, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 20.3, bloodSugar: 85, sbp: 109, dbp: 69, pulse: 68 },
  { id: 'HN-043', name: 'นายประกิต เพ็ญแข', gender: 'ชาย', age: 60, ageGroup: '55-64 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 10, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'สงสัยป่วย', smoking: 'สูบประจำ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ไม่ออกกำลังกาย', bmi: 28.1, bloodSugar: 120, sbp: 152, dbp: 93, pulse: 84 },
  { id: 'HN-044', name: 'นางวิไลพร ยิ่งรวย', gender: 'หญิง', age: 52, ageGroup: '45-54 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 7, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 25.7, bloodSugar: 111, sbp: 134, dbp: 86, pulse: 77 },
  { id: 'HN-045', name: 'นายศักดิ์ชัย ชนะภัย', gender: 'ชาย', age: 40, ageGroup: '35-44 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 4, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 22.7, bloodSugar: 92, sbp: 119, dbp: 76, pulse: 70 },
  { id: 'HN-046', name: 'นางบังอร ชื่นกมล', gender: 'หญิง', age: 65, ageGroup: '≥ 65 ปี', area: 'หมู่ 5 บ้านใหม่สามัคคี', riskScore: 12, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 29.8, bloodSugar: 164, sbp: 165, dbp: 98, pulse: 82 },
  { id: 'HN-047', name: 'นายศิริชัย เลิศล้ำ', gender: 'ชาย', age: 54, ageGroup: '45-54 ปี', area: 'หมู่ 1 บ้านหนองบัว', riskScore: 9, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'กลุ่มเสี่ยง', smoking: 'สูบประจำ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ไม่ออกกำลังกาย', bmi: 27.3, bloodSugar: 132, sbp: 138, dbp: 88, pulse: 86 },
  { id: 'HN-048', name: 'นางดาวเรือง สดใส', gender: 'หญิง', age: 46, ageGroup: '45-54 ปี', area: 'หมู่ 2 บ้านดงเจริญ', riskScore: 5, riskLevel: 'เสี่ยงปานกลาง', diabetesScreening: 'กลุ่มเสี่ยง', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ออกกำลังกายบ้าง', bmi: 24.5, bloodSugar: 106, sbp: 125, dbp: 81, pulse: 73 },
  { id: 'HN-049', name: 'นายกิตติศักดิ์ พรชัย', gender: 'ชาย', age: 37, ageGroup: '35-44 ปี', area: 'หมู่ 3 บ้านโนนสว่าง', riskScore: 3, riskLevel: 'เสี่ยงต่ำ', diabetesScreening: 'ปกติ', hypertensionScreening: 'ปกติ', smoking: 'ไม่สูบ', alcohol: 'ดื่มเป็นครั้งคราว', exercise: 'ออกกำลังกายสม่ำเสมอ', bmi: 22.2, bloodSugar: 89, sbp: 117, dbp: 74, pulse: 69 },
  { id: 'HN-050', name: 'นางพยอม อินทร์พรหม', gender: 'หญิง', age: 72, ageGroup: '≥ 65 ปี', area: 'หมู่ 4 บ้านท่าโพธิ์', riskScore: 11, riskLevel: 'เสี่ยงสูง', diabetesScreening: 'สงสัยป่วย', hypertensionScreening: 'สงสัยป่วย', smoking: 'ไม่สูบ', alcohol: 'ไม่ดื่ม', exercise: 'ไม่ออกกำลังกาย', bmi: 27.0, bloodSugar: 145, sbp: 155, dbp: 92, pulse: 74 }
];

// Calculate KPIs from filtered health records
export function calculateKPIs(records: HealthRecord[]): KPISummary {
  const count = records.length;
  if (count === 0) {
    return {
      totalCount: 0,
      avgBmi: 0,
      avgBloodSugar: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgRiskScore: 0,
      avgPulse: 0,
      minBloodSugar: 0,
      maxBloodSugar: 0,
      minSbp: 0,
      maxSbp: 0,
      minBmi: 0,
      maxBmi: 0,
      minRiskScore: 0,
      maxRiskScore: 0,
      genderRatio: { male: 0, female: 0, malePercent: 0, femalePercent: 0 },
      highRiskCount: 0,
      highRiskPercent: 0,
      mediumRiskCount: 0,
      mediumRiskPercent: 0,
      lowRiskCount: 0,
      lowRiskPercent: 0,
      diabetesRiskCount: 0,
      diabetesRiskPercent: 0,
      hypertensionRiskCount: 0,
      hypertensionRiskPercent: 0
    };
  }

  let totalBmi = 0;
  let totalBloodSugar = 0;
  let totalSbp = 0;
  let totalDbp = 0;
  let totalRiskScore = 0;
  let totalPulse = 0;

  let minBloodSugar = Infinity;
  let maxBloodSugar = -Infinity;
  let minSbp = Infinity;
  let maxSbp = -Infinity;
  let minBmi = Infinity;
  let maxBmi = -Infinity;
  let minRiskScore = Infinity;
  let maxRiskScore = -Infinity;

  let maleCount = 0;
  let femaleCount = 0;

  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;

  let diabetesRiskCount = 0;
  let hypertensionRiskCount = 0;

  for (const r of records) {
    totalBmi += r.bmi;
    totalBloodSugar += r.bloodSugar;
    totalSbp += r.sbp;
    totalDbp += r.dbp;
    totalRiskScore += r.riskScore;
    totalPulse += r.pulse;

    if (r.bloodSugar < minBloodSugar) minBloodSugar = r.bloodSugar;
    if (r.bloodSugar > maxBloodSugar) maxBloodSugar = r.bloodSugar;

    if (r.sbp < minSbp) minSbp = r.sbp;
    if (r.sbp > maxSbp) maxSbp = r.sbp;

    if (r.bmi < minBmi) minBmi = r.bmi;
    if (r.bmi > maxBmi) maxBmi = r.bmi;

    if (r.riskScore < minRiskScore) minRiskScore = r.riskScore;
    if (r.riskScore > maxRiskScore) maxRiskScore = r.riskScore;

    if (r.gender === 'ชาย') maleCount++;
    else femaleCount++;

    if (r.riskLevel === 'เสี่ยงสูง') highRiskCount++;
    else if (r.riskLevel === 'เสี่ยงปานกลาง') mediumRiskCount++;
    else lowRiskCount++;

    if (r.diabetesScreening === 'สงสัยป่วย' || r.diabetesScreening === 'กลุ่มเสี่ยง') {
      diabetesRiskCount++;
    }

    if (r.hypertensionScreening === 'สงสัยป่วย' || r.hypertensionScreening === 'กลุ่มเสี่ยง') {
      hypertensionRiskCount++;
    }
  }

  return {
    totalCount: count,
    avgBmi: Number((totalBmi / count).toFixed(1)),
    avgBloodSugar: Number((totalBloodSugar / count).toFixed(1)),
    avgSbp: Math.round(totalSbp / count),
    avgDbp: Math.round(totalDbp / count),
    avgRiskScore: Number((totalRiskScore / count).toFixed(1)),
    avgPulse: Math.round(totalPulse / count),
    minBloodSugar,
    maxBloodSugar,
    minSbp,
    maxSbp,
    minBmi: Number(minBmi.toFixed(1)),
    maxBmi: Number(maxBmi.toFixed(1)),
    minRiskScore,
    maxRiskScore,
    genderRatio: {
      male: maleCount,
      female: femaleCount,
      malePercent: Number(((maleCount / count) * 100).toFixed(1)),
      femalePercent: Number(((femaleCount / count) * 100).toFixed(1))
    },
    highRiskCount,
    highRiskPercent: Number(((highRiskCount / count) * 100).toFixed(1)),
    mediumRiskCount,
    mediumRiskPercent: Number(((mediumRiskCount / count) * 100).toFixed(1)),
    lowRiskCount,
    lowRiskPercent: Number(((lowRiskCount / count) * 100).toFixed(1)),
    diabetesRiskCount,
    diabetesRiskPercent: Number(((diabetesRiskCount / count) * 100).toFixed(1)),
    hypertensionRiskCount,
    hypertensionRiskPercent: Number(((hypertensionRiskCount / count) * 100).toFixed(1))
  };
}

export function filterRecords(records: HealthRecord[], filter: FilterState): HealthRecord[] {
  return records.filter(r => {
    if (filter.gender !== 'ทั้งหมด' && r.gender !== filter.gender) return false;
    if (filter.area !== 'ทั้งหมด' && r.area !== filter.area) return false;
    if (filter.riskLevel !== 'ทั้งหมด' && r.riskLevel !== filter.riskLevel) return false;
    if (filter.ageGroup !== 'ทั้งหมด' && r.ageGroup !== filter.ageGroup) return false;
    if (filter.diabetesScreening !== 'ทั้งหมด' && r.diabetesScreening !== filter.diabetesScreening) return false;
    if (filter.hypertensionScreening !== 'ทั้งหมด' && r.hypertensionScreening !== filter.hypertensionScreening) return false;
    if (filter.smoking !== 'ทั้งหมด' && r.smoking !== filter.smoking) return false;
    if (filter.alcohol !== 'ทั้งหมด' && r.alcohol !== filter.alcohol) return false;
    if (filter.exercise !== 'ทั้งหมด' && r.exercise !== filter.exercise) return false;
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchName = r.name?.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      const matchArea = r.area.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchArea) return false;
    }
    return true;
  });
}
