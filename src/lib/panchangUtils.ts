import { 
  Body, 
  SearchMoonPhase, 
  SearchRiseSet, 
  Observer, 
  Equator, 
  Ecliptic, 
  HelioVector,
  GeoVector,
  Horizon
} from 'astronomy-engine';

export interface PanchangData {
  date: Date;
  tithi: { name: string; index: number; progress: number };
  nakshatra: { name: string; index: number; progress: number };
  yoga: { name: string; index: number; progress: number };
  karana: { name: string; index: number; progress: number };
  masa: string;
  vara: string;
  sunrise: Date;
  sunset: Date;
  moonrise: Date;
  moonset: Date;
  abhijit: { start: Date; end: Date };
  rahuKaal: { start: Date; end: Date };
}

const MASAS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];

const TITHIS = [
  "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami",
  "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami",
  "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const YOGAS = [
  "Vishkumbha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola",
  "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha",
  "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

const KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kinstughna"
];

const VARAS = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];

export function calculatePanchang(date: Date, latitude: number, longitude: number): PanchangData {
  const observer = new Observer(latitude, longitude, 0);
  
  // 1. Tithi (Lunar Day)
  // Tithi = (Moon Longitude - Sun Longitude) / 12
  const sunVector = GeoVector(Body.Sun, date, true);
  const moonVector = GeoVector(Body.Moon, date, true);
  const sunEcl = Ecliptic(sunVector);
  const moonEcl = Ecliptic(moonVector);
  
  let diff = moonEcl.elon - sunEcl.elon;
  if (diff < 0) diff += 360;
  
  const tithiIndex = Math.floor(diff / 12);
  const tithiProgress = (diff % 12) / 12;
  
  // 2. Nakshatra (Lunar Mansion)
  // Nakshatra = Moon Longitude / 13.333333
  // Using Sidereal Longitude (approximate Lahiri Ayanamsa)
  const ayanamsa = 24.2; // Approximate for 2026
  let siderealMoonLong = (moonEcl.elon - ayanamsa + 360) % 360;
  const nakshatraIndex = Math.floor(siderealMoonLong / (360 / 27));
  const nakshatraProgress = (siderealMoonLong % (360 / 27)) / (360 / 27);
  
  // 3. Yoga
  // Yoga = (Sun Longitude + Moon Longitude) / 13.333333
  let siderealSunLong = (sunEcl.elon - ayanamsa + 360) % 360;
  let yogaSum = (siderealSunLong + siderealMoonLong) % 360;
  const yogaIndex = Math.floor(yogaSum / (360 / 27));
  const yogaProgress = (yogaSum % (360 / 27)) / (360 / 27);
  
  // 4. Karana
  // Karana = Half of Tithi
  let karanaIndex;
  if (tithiIndex === 0) {
    karanaIndex = 10; // Kinstughna
  } else if (tithiIndex >= 57) {
    // Fixed Karanas at the end of the lunar month
    if (tithiIndex === 57) karanaIndex = 7; // Shakuni
    else if (tithiIndex === 58) karanaIndex = 8; // Chatushpada
    else karanaIndex = 9; // Naga
  } else {
    // Movable Karanas
    karanaIndex = (tithiIndex - 1) % 7;
  }
  
  // 5. Masa (Lunar Month)
  // Approximate based on Sun's sidereal longitude
  const masaIndex = (Math.floor(siderealSunLong / 30) + 11) % 12; // Adjusted to match Chaitra starting at Meena
  const masa = MASAS[masaIndex];
  
  // 6. Vara
  const vara = VARAS[date.getDay()];
  
  // 7. Sunrise/Sunset
  const sunrise = SearchRiseSet(Body.Sun, observer, 1, date, 1).date;
  const sunset = SearchRiseSet(Body.Sun, observer, -1, date, 1).date;
  const moonrise = SearchRiseSet(Body.Moon, observer, 1, date, 1).date;
  const moonset = SearchRiseSet(Body.Moon, observer, -1, date, 1).date;

  // 8. Abhijit Muhurat
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const muhuratDuration = dayDuration / 15;
  const abhijitStart = new Date(sunrise.getTime() + 7 * muhuratDuration);
  const abhijitEnd = new Date(sunrise.getTime() + 8 * muhuratDuration);

  // 9. Rahu Kaal
  const rahuKaalParts = [8, 2, 7, 5, 6, 4, 3]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  const rahuPartIndex = rahuKaalParts[date.getDay()];
  const rahuDuration = dayDuration / 8;
  const rahuStart = new Date(sunrise.getTime() + (rahuPartIndex - 1) * rahuDuration);
  const rahuEnd = new Date(sunrise.getTime() + rahuPartIndex * rahuDuration);

  return {
    date,
    tithi: { name: TITHIS[tithiIndex], index: tithiIndex, progress: tithiProgress },
    nakshatra: { name: NAKSHATRAS[nakshatraIndex], index: nakshatraIndex, progress: nakshatraProgress },
    yoga: { name: YOGAS[yogaIndex], index: yogaIndex, progress: yogaProgress },
    karana: { name: KARANAS[karanaIndex], index: karanaIndex, progress: 0.5 }, // Simplified
    masa,
    vara,
    sunrise,
    sunset,
    moonrise,
    moonset,
    abhijit: { start: abhijitStart, end: abhijitEnd },
    rahuKaal: { start: rahuStart, end: rahuEnd }
  };
}

export interface PlanetPosition {
  name: string;
  sign: string;
  signName: string;
  degree: string;
  strength: string;
}

export function calculatePlanetaryPositions(date: Date): PlanetPosition[] {
  const bodies = [Body.Sun, Body.Moon, Body.Mars, Body.Mercury, Body.Jupiter, Body.Venus, Body.Saturn];
  const ayanamsa = 24.2;
  const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
  const SIGN_NAMES = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];

  return bodies.map(body => {
    const vector = GeoVector(body, date, true);
    const ecl = Ecliptic(vector);
    const siderealLong = (ecl.elon - ayanamsa + 360) % 360;
    const signIndex = Math.floor(siderealLong / 30);
    const degreeInSign = siderealLong % 30;
    
    // Simple strength logic
    let strength = "Medium";
    if (degreeInSign > 10 && degreeInSign < 20) strength = "Strong";
    if (degreeInSign < 5 || degreeInSign > 25) strength = "Weak";

    return {
      name: body.toString(),
      sign: SIGNS[signIndex],
      signName: SIGN_NAMES[signIndex],
      degree: `${Math.floor(degreeInSign)}° ${Math.floor((degreeInSign % 1) * 60)}'`,
      strength
    };
  });
}

export const COSMIC_EVENTS = [
  { date: '2026-03-20', name: 'Vernal Equinox', description: 'Day and night are equal. A time of balance and new beginnings.' },
  { date: '2026-04-08', name: 'Total Solar Eclipse', description: 'A powerful moment of transformation. The Sun is obscured by the Moon.' },
  { date: '2026-06-21', name: 'Summer Solstice', description: 'The longest day of the year. Peak solar energy.' },
  { date: '2026-08-12', name: 'Perseids Meteor Shower', description: 'Celestial fire raining down. A time for wishes and clarity.' },
  { date: '2026-09-22', name: 'Autumnal Equinox', description: 'Harvest time. Balancing light and dark as we move towards winter.' },
  { date: '2026-12-21', name: 'Winter Solstice', description: 'The shortest day. Rebirth of the Sun.' },
];

export const CELESTIAL_SECRETS = [
  "The Nakshatra of your birth holds the blueprint of your soul's purpose.",
  "Abhijit Muhurat is the most auspicious time for any new beginning.",
  "Rahu Kaal is the shadow period where material actions often face obstacles.",
  "The Tithi reveals the emotional landscape of the day.",
  "Yoga represents the union of solar and lunar energies within you.",
  "Karana dictates the physical energy available for work.",
  "Sunrise is the moment of cosmic rebirth every single day.",
  "The Moon's phase governs the ebb and flow of human consciousness.",
];
