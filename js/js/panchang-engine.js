// panchang-engine.js
// Must load AFTER swisseph.js and await swe.initSwissEph() in your main HTML

// ---- 1. Panchang Data ----
const tithiNames = ["Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima/Amavasya"];
const nakNames = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const yogaNames = ["Vishkumbha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarman","Dhriti","Shoola","Ganda","Vriddhi","Dhruva","Vyaghata","Harsha","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
const karanaNames = ["Bava","Balava","Kaulava","Taitila","Garija","Vanija","Vishti","Bava","Balava","Kaulava","Taitila","Garija","Vanija","Vishti","Bava"];

// ---- 2. 35 Muhurta Names & Types ----
const muhurtaNames = [
  "Brahma Muhurta","Abhijit Muhurta","Amrit Muhurta","Prabhakara Muhurta","Riksha Muhurta","Chandra Muhurta",
  "Lakshmi Muhurta","Vijaya Muhurta","Griha Pravesh Muhurta","Vivah Muhurta","Sthapana Muhurta","Yatra Muhurta",
  "Sampanna Muhurta","Adhyayan Muhurta","Dhyana Muhurta","Vastu Muhurta","Shubha Karya Muhurta","Shanti Muhurta",
  "Rest Night Muhurta","Early Morning Muhurta","Business Muhurta","Travel Muhurta","Study Muhurta","Marriage Muhurta",
  "Temple Muhurta","Donation Muhurta","Cleansing Muhurta","Meditation Muhurta","Artistic Muhurta","Childcare Muhurta",
  "Harvest Muhurta","Spiritual Muhurta","Relaxation Muhurta","Health Muhurta","Planning Muhurta","Creative Muhurta"
];
const muhurtaType = [
  "auspicious","auspicious","auspicious","auspicious","neutral","neutral",
  "auspicious","auspicious","auspicious","auspicious","auspicious","auspicious",
  "auspicious","neutral","neutral","auspicious","auspicious","neutral",
  "night","night","auspicious","neutral","auspicious","auspicious",
  "auspicious","auspicious","neutral","neutral","auspicious","neutral",
  "auspicious","auspicious","night","neutral","auspicious","auspicious"
];

// ---- 3. Calculate Panchang ----
function panchangAt(date){
  const jd = swe.julday(date.getFullYear(), date.getMonth()+1, date.getDate(), 0, swe.GREG_CAL);
  const sun = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH);
  const moon = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH);
  
  const tithi = Math.floor((moon.longitude - sun.longitude)/12) % 30;
  const nakshatra = Math.floor(moon.longitude/13.3333);
  const yoga = Math.floor((sun.longitude + moon.longitude)/13.3333);
  const karana = tithi % 15;
  
  return {tithi,nakshatra,yoga,karana};
}

// ---- 4. Festival Detection (example) ----
function festivalAt(date,lat,lon){
  // Minimal example: can expand with real festivals
  const d = date.getDate();
  const m = date.getMonth()+1;
  if(m===1 && d===14) return "Makar Sankranti";
  if(m===8 && d===15) return "Raksha Bandhan";
  if(m===10 && d===2) return "Gandhi Jayanti";
  return null;
}

// ---- 5. Highlight Current Muhurta ----
function currentMuhurtaIndex(){
  const h = new Date().getHours();
  return h % 35;
}

// ---- 6. Export helper for Muhurtas ----
function renderMuhurtasHTML(){
  return muhurtaNames.map((name,i)=>{
    const start = (i<15?6+i:18+(i-15));
    const end = start+1;
    return `<div class="muhurta ${muhurtaType[i]}">${start}:00 - ${end}:00 — ${name}</div>`;
  }).join('');
}
