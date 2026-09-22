export type RiskLevel = 'เสี่ยงต่ำ' | 'เสี่ยงปานกลาง' | 'เสี่ยงสูง';

export type ScreeningStatus = 'ปกติ' | 'กลุ่มเสี่ยง' | 'สงสัยป่วย';

export type Gender = 'ชาย' | 'หญิง';

export type SmokingStatus = 'ไม่สูบ' | 'เคยสูบแต่เลิกแล้ว' | 'สูบประจำ';

export type AlcoholStatus = 'ไม่ดื่ม' | 'ดื่มเป็นครั้งคราว' | 'ดื่มประจำ';

export type ExerciseStatus = 'ออกกำลังกายสม่ำเสมอ' | 'ออกกำลังกายบ้าง' | 'ไม่ออกกำลังกาย';

export interface HealthRecord {
  id: string;
  name?: string;
  gender: Gender;
  age: number;
  ageGroup: string;
  area: string;
  riskScore: number;
  riskLevel: RiskLevel;
  diabetesScreening: ScreeningStatus;
  hypertensionScreening: ScreeningStatus;
  smoking: SmokingStatus;
  alcohol: AlcoholStatus;
  exercise: ExerciseStatus;
  bmi: number;
  bloodSugar: number; // mg/dL
  sbp: number;        // mmHg (Systolic)
  dbp: number;        // mmHg (Diastolic)
  pulse: number;      // bpm
  waistCm?: number;
}

export interface FilterState {
  gender: string;
  area: string;
  riskLevel: string;
  ageGroup: string;
  diabetesScreening: string;
  hypertensionScreening: string;
  smoking: string;
  alcohol: string;
  exercise: string;
  searchQuery: string;
}

export interface KPISummary {
  totalCount: number;
  // Averages
  avgBmi: number;
  avgBloodSugar: number;
  avgSbp: number;
  avgDbp: number;
  avgRiskScore: number;
  avgPulse: number;
  // Min & Max
  minBloodSugar: number;
  maxBloodSugar: number;
  minSbp: number;
  maxSbp: number;
  minBmi: number;
  maxBmi: number;
  minRiskScore: number;
  maxRiskScore: number;
  // Proportions
  genderRatio: {
    male: number;
    female: number;
    malePercent: number;
    femalePercent: number;
  };
  // Percentages
  highRiskCount: number;
  highRiskPercent: number;
  mediumRiskCount: number;
  mediumRiskPercent: number;
  lowRiskCount: number;
  lowRiskPercent: number;
  diabetesRiskCount: number;
  diabetesRiskPercent: number;
  hypertensionRiskCount: number;
  hypertensionRiskPercent: number;
}
