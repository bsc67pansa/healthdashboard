import { HealthRecord, Gender, RiskLevel, ScreeningStatus, SmokingStatus, AlcoholStatus, ExerciseStatus } from '../types';

export function parseCSV(csvText: string): HealthRecord[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\r' && nextChar === '\n') || char === '\n' || char === '\r') {
      if (inQuotes) {
        currentLine += ' ';
      } else {
        if (currentLine.trim()) {
          lines.push(currentLine);
        }
        currentLine = '';
        if (char === '\r' && nextChar === '\n') i++;
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  // Parse a line into cells
  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let currentCell = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuote && line[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += c;
      }
    }
    cells.push(currentCell.trim());
    return cells;
  };

  const headers = parseLine(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());

  const findColIndex = (...candidates: string[]): number => {
    for (const cand of candidates) {
      const idx = headers.findIndex(h => {
        const clean = h.toLowerCase().replace(/[\s_]/g, '');
        const target = cand.toLowerCase().replace(/[\s_]/g, '');
        return clean.includes(target) || target.includes(clean);
      });
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const colIdx = {
    id: findColIndex('ลำดับ', 'id', 'รหัส', 'no'),
    name: findColIndex('ชื่อ', 'name', 'ผู้ตรวจ'),
    gender: findColIndex('เพศ', 'gender', 'sex'),
    age: findColIndex('อายุ', 'age'),
    area: findColIndex('พื้นที่', 'area', 'หมู่บ้าน', 'ชุมชน', 'หมู่ที่', 'หมู่'),
    riskScore: findColIndex('คะแนนความเสี่ยง', 'riskscore', 'คะแนนเสี่ยง', 'score'),
    riskLevel: findColIndex('ระดับความเสี่ยง', 'risklevel', 'ความเสี่ยง', 'level'),
    diabetes: findColIndex('เบาหวาน_คัดกรอง', 'เบาหวาน', 'diabetes', 'dm_screen', 'dm'),
    hypertension: findColIndex('ความดันโลหิตสูง_คัดกรอง', 'ความดันโลหิตสูง', 'ความดัน', 'ht_screen', 'ht'),
    smoking: findColIndex('สูบบุหรี่', 'smoking', 'บุหรี่', 'smoke'),
    alcohol: findColIndex('ดื่มแอลกอฮอล์', 'แอลกอฮอล์', 'alcohol', 'เหล้า', 'drink'),
    exercise: findColIndex('การออกกำลังกาย', 'ออกกำลังกาย', 'exercise'),
    bmi: findColIndex('BMI', 'ดัชนีมวลกาย', 'bmi'),
    bloodSugar: findColIndex('น้ำตาล_mg_dL', 'น้ำตาล', 'bloodsugar', 'fpg', 'sugar', 'glucose'),
    sbp: findColIndex('SBP_mmHg', 'SBP', 'sbp', 'ความดันบน', 'systolic'),
    dbp: findColIndex('DBP_mmHg', 'DBP', 'dbp', 'ความดันล่าง', 'diastolic'),
    pulse: findColIndex('ชีพจร_bpm', 'ชีพจร', 'pulse', 'heartrate', 'hr'),
    waist: findColIndex('รอบเอว', 'waist')
  };

  const records: HealthRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    const getValue = (idx: number, fallback = ''): string => {
      if (idx >= 0 && idx < row.length) {
        return row[idx]?.replace(/^["']|["']$/g, '').trim() || fallback;
      }
      return fallback;
    };

    const getNum = (idx: number, fallback = 0): number => {
      const val = getValue(idx);
      const parsed = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? fallback : parsed;
    };

    const rawGender = getValue(colIdx.gender, 'หญิง');
    const gender: Gender = rawGender.includes('ชาย') ? 'ชาย' : 'หญิง';

    const age = getNum(colIdx.age, 45);
    const ageGroup = getAgeGroup(age);

    const bmi = getNum(colIdx.bmi, 22.5);
    const bloodSugar = getNum(colIdx.bloodSugar, 95);
    const sbp = getNum(colIdx.sbp, 120);
    const dbp = getNum(colIdx.dbp, 80);
    const pulse = getNum(colIdx.pulse, 72);

    let rawScore = getNum(colIdx.riskScore, -1);
    if (rawScore < 0) {
      // Calculate DRS risk score estimation if not provided in sheet
      rawScore = calculateRiskScore(age, gender, bmi, sbp, bloodSugar);
    }

    let riskLevel: RiskLevel;
    const rawRiskLevelStr = getValue(colIdx.riskLevel);
    if (rawRiskLevelStr.includes('สูง')) {
      riskLevel = 'เสี่ยงสูง';
    } else if (rawRiskLevelStr.includes('กลาง')) {
      riskLevel = 'เสี่ยงปานกลาง';
    } else if (rawRiskLevelStr.includes('ต่ำ')) {
      riskLevel = 'เสี่ยงต่ำ';
    } else {
      if (rawScore >= 9 || bloodSugar >= 126 || sbp >= 140) riskLevel = 'เสี่ยงสูง';
      else if (rawScore >= 5 || bloodSugar >= 100 || sbp >= 130) riskLevel = 'เสี่ยงปานกลาง';
      else riskLevel = 'เสี่ยงต่ำ';
    }

    // Diabetes screening
    const rawDM = getValue(colIdx.diabetes);
    let diabetesScreening: ScreeningStatus = 'ปกติ';
    if (rawDM.includes('ป่วย') || rawDM.includes('สูง') || bloodSugar >= 126) {
      diabetesScreening = 'สงสัยป่วย';
    } else if (rawDM.includes('เสี่ยง') || (bloodSugar >= 100 && bloodSugar < 126)) {
      diabetesScreening = 'กลุ่มเสี่ยง';
    } else {
      diabetesScreening = 'ปกติ';
    }

    // Hypertension screening
    const rawHT = getValue(colIdx.hypertension);
    let hypertensionScreening: ScreeningStatus = 'ปกติ';
    if (rawHT.includes('ป่วย') || rawHT.includes('สูง') || sbp >= 140 || dbp >= 90) {
      hypertensionScreening = 'สงสัยป่วย';
    } else if (rawHT.includes('เสี่ยง') || (sbp >= 120 && sbp < 140) || (dbp >= 80 && dbp < 90)) {
      hypertensionScreening = 'กลุ่มเสี่ยง';
    } else {
      hypertensionScreening = 'ปกติ';
    }

    // Smoking
    const rawSmoke = getValue(colIdx.smoking);
    let smoking: SmokingStatus = 'ไม่สูบ';
    if (rawSmoke.includes('สูบประจำ') || rawSmoke === 'สูบ' || rawSmoke === 'ใช่') {
      smoking = 'สูบประจำ';
    } else if (rawSmoke.includes('เลิก') || rawSmoke.includes('เคย')) {
      smoking = 'เคยสูบแต่เลิกแล้ว';
    } else {
      smoking = 'ไม่สูบ';
    }

    // Alcohol
    const rawAlc = getValue(colIdx.alcohol);
    let alcohol: AlcoholStatus = 'ไม่ดื่ม';
    if (rawAlc.includes('ประจำ') || rawAlc === 'ดื่มทุกวัน') {
      alcohol = 'ดื่มประจำ';
    } else if (rawAlc.includes('คราว') || rawAlc === 'ดื่ม' || rawAlc === 'ใช่') {
      alcohol = 'ดื่มเป็นครั้งคราว';
    } else {
      alcohol = 'ไม่ดื่ม';
    }

    // Exercise
    const rawEx = getValue(colIdx.exercise);
    let exercise: ExerciseStatus = 'ออกกำลังกายสม่ำเสมอ';
    if (rawEx.includes('ไม่ออก') || rawEx.includes('ไม่ค่อย') || rawEx === 'ไม่') {
      exercise = 'ไม่ออกกำลังกาย';
    } else if (rawEx.includes('บ้าง') || rawEx.includes('สัปดาห์ละ 1-2')) {
      exercise = 'ออกกำลังกายบ้าง';
    } else {
      exercise = 'ออกกำลังกายสม่ำเสมอ';
    }

    const area = getValue(colIdx.area, `หมู่ ${((i - 1) % 5) + 1}`);
    const id = getValue(colIdx.id, `REC-${String(i).padStart(3, '0')}`);
    const name = getValue(colIdx.name, `ผู้รับการคัดกรอง รายที่ ${i}`);

    records.push({
      id,
      name,
      gender,
      age,
      ageGroup,
      area,
      riskScore: rawScore,
      riskLevel,
      diabetesScreening,
      hypertensionScreening,
      smoking,
      alcohol,
      exercise,
      bmi: Number(bmi.toFixed(1)),
      bloodSugar: Math.round(bloodSugar),
      sbp: Math.round(sbp),
      dbp: Math.round(dbp),
      pulse: Math.round(pulse),
      waistCm: getNum(colIdx.waist, 0) || undefined
    });
  }

  return records;
}

export function getAgeGroup(age: number): string {
  if (age < 35) return '< 35 ปี';
  if (age <= 44) return '35-44 ปี';
  if (age <= 54) return '45-54 ปี';
  if (age <= 64) return '55-64 ปี';
  return '≥ 65 ปี';
}

function calculateRiskScore(age: number, gender: Gender, bmi: number, sbp: number, bloodSugar: number): number {
  let score = 0;
  // Age points
  if (age >= 50) score += 4;
  else if (age >= 45) score += 2;
  else if (age >= 35) score += 1;

  // Gender
  if (gender === 'ชาย') score += 1;

  // BMI
  if (bmi >= 27.5) score += 5;
  else if (bmi >= 25) score += 3;
  else if (bmi >= 23) score += 1;

  // SBP
  if (sbp >= 140) score += 3;
  else if (sbp >= 130) score += 2;

  // Sugar
  if (bloodSugar >= 126) score += 4;
  else if (bloodSugar >= 100) score += 2;

  return score;
}
