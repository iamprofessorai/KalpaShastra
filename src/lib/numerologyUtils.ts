
export interface NumerologyData {
  driver: number;
  conductor: number;
  kua: number;
  matrix: (number | null)[];
  completion: string;
  driverDesc: string;
  conductorDesc: string;
  kuaDesc: string;
  insights: string[];
}

const NUMBER_DESCRIPTIONS: Record<number, string> = {
  1: "The Independent Leader (Sun)",
  2: "The Intuitive Partner (Moon)",
  3: "The Creative Teacher (Jupiter)",
  4: "The Practical Builder (Rahu)",
  5: "The Versatile Communicator (Mercury)",
  6: "The Nurturing Artist (Venus)",
  7: "The Spiritual Seeker (Ketu)",
  8: "The Disciplined Achiever (Saturn)",
  9: "The Compassionate Warrior (Mars)"
};

export function calculateNumerology(dob: string, gender: 'male' | 'female' = 'male'): NumerologyData {
  const date = new Date(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // 1. Driver Number (Birth Day)
  const driver = reduceToSingleDigit(day);

  // 2. Conductor Number (Full Date sum)
  const fullSum = day + month + year;
  const conductor = reduceToSingleDigit(fullSum);

  // 3. Kua Number
  // Male: 11 - (sum of year digits reduced to single)
  // Female: 4 + (sum of year digits reduced to single)
  const yearSum = reduceToSingleDigit(year);
  let kua;
  if (gender === 'male') {
    kua = 11 - yearSum;
    if (kua === 10) kua = 1;
    if (kua > 9) kua = reduceToSingleDigit(kua);
  } else {
    kua = 4 + yearSum;
    if (kua > 9) kua = reduceToSingleDigit(kua);
  }

  // 4. Lo Shu Matrix (4 9 2, 3 5 7, 8 1 6)
  const digits = dob.replace(/-/g, '').split('').map(Number);
  digits.push(driver, conductor, kua);
  
  const matrixLayout = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const matrix = matrixLayout.map(num => digits.includes(num) ? num : null);
  
  const presentCount = matrix.filter(n => n !== null).length;
  const completion = `${presentCount}/9`;

  // 5. Insights
  const insights = [];
  if (!digits.includes(5)) insights.push("Missing 5: Stability and communication might need conscious effort.");
  if (!digits.includes(8)) insights.push("Missing 8: Financial discipline and structure are key areas for growth.");
  if (!digits.includes(6)) insights.push("Missing 6: Focus on creating harmony in family and luxury sectors.");
  
  if (driver === 4 || driver === 8) insights.push("Karmic Numbers: Your path involves significant structural transformation.");
  if (conductor === 9) insights.push("Humanitarian Path: Your life purpose is tied to serving the greater good.");

  return {
    driver,
    conductor,
    kua,
    matrix,
    completion,
    driverDesc: NUMBER_DESCRIPTIONS[driver],
    conductorDesc: NUMBER_DESCRIPTIONS[conductor],
    kuaDesc: NUMBER_DESCRIPTIONS[kua],
    insights
  };
}

function reduceToSingleDigit(num: number): number {
  let s = num.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  while (s > 9) {
    s = s.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  }
  return s;
}
