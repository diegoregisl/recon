const fs = require('fs');

// We will hardcode the data from the OCR we saw into JSON objects for Louvor and Multimidia
// Then we read the Excel for Som (wait, we need to read the full Excel for Som).

const louvorSexta = {
  Felipe: "20; 20; 3; 1,29; 26; 10; 7; 18; 16; 27; 11; 22",
  Wesley: "13; 13; 10; 8; 5; 17; 14; 11; 9; 6; 4; 8",
  Lorrane: "6; 6; 17; 15; 12; 3,24; 21; 4; 2,30; 13; -; 15,29",
  Coral: "27; 27; 24; 22; 19; 31; 28; 25; 23; 20; 18; -"
};

const louvorDomingo = {
  Felipe: "1,22; 15,29; 19; 3,24; 21; 12; 2,30; 20; 11; 1,22; 13; 24",
  Wesley: "8; 1,22; 12; 10; 7,28; 19; 9,23; 6,27; 18; 8,29; 20; 10",
  Lorrane: "15; 8; 5,26; 17,31; 14; 5,26; 16; 13; 4,25; 15; 6; 17,31"
};

const louvorSabado = {
  dates: "21/fev; 21/mar; 18/abr; 16/mai; 20/jun; 18/jul; 15/ago; 19/set; 17/out; 21/nov; -; -",
  equipes: "Wesley; Lorrane; Wesley; Felipe; Wesley; Lorrane; Felipe; Wesley; Lorrane; Wesley; -; Lorrane"
};

const multiSexta = {
  Tati: "30/01,20; 20; 3; 1,22,29; 26,19; 10; 7,28; 18; 16; 27; 11; 22",
  Carol: "13,27; 13,27; 10; 8; 5; 17; 14; 11,25; 9,23; 6; 4,18; 8",
  Robson: "6; 6; 17,24; 15; 12; 3,24,31; 21; 4; 2,30; 13,20; -; 15,29"
};

const multiDomingo = {
  Tati: "1,22; 15,29; 19; 3,31; 21; 12; 2,3; 20; 11; 1,22; 13; 24",
  Carol: "8; 1,22; 12; 10; 7,28; 19; 9,23; 6,27; 18; 8,29; 20; 10",
  Robson: "15; 8; 5,26; 17; 14; 5,26; 16; 13; 4,25; 15; 6; 17,31"
};

const multiSabado = {
  dates: "21/fev; 21/mar; 18/abr; 16/mai; 20/jun; 18/jul; 15/ago; 19/set; 17/out; 21/nov; -; -",
  equipes: "Tati; Carol; Tati; Robson; Tati; Carol; Robson; Tati; Tati; Tati; -; Robson"
};

const meses = ["FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ", "JAN"];

// Function to parse the simple string tables into a lookup map
function parseMap(obj) {
  const result = {};
  for (let m = 0; m < 12; m++) {
    result[meses[m]] = {};
  }
  
  for (const [equipe, str] of Object.entries(obj)) {
    if (equipe === 'dates') continue;
    
    const parts = str.split(';');
    for (let m = 0; m < 12; m++) {
      const days = parts[m].trim();
      if (days !== '-') {
        // days can be like "1,22" or "30/01,20"
        const arr = days.split(',').map(d => d.trim().replace(/^0/, ''));
        for (const day of arr) {
          const match = day.match(/^(\d+)/);
          if (match) {
            const dayNum = match[1].padStart(2, '0');
            result[meses[m]][dayNum] = equipe;
          }
        }
      }
    }
  }
  return result;
}

const louvorSexMap = parseMap(louvorSexta);
const louvorDomMap = parseMap(louvorDomingo);
const multiSexMap = parseMap(multiSexta);
const multiDomMap = parseMap(multiDomingo);

// We need an array of Cultos for each month
const allEscalas = [];

for (let mIndex = 0; mIndex < 12; mIndex++) {
  const monthName = meses[mIndex];
  
  // Combine all days that have some event in this month
  const daysInMonth = new Set([
    ...Object.keys(louvorSexMap[monthName] || {}),
    ...Object.keys(louvorDomMap[monthName] || {}),
    ...Object.keys(multiSexMap[monthName] || {}),
    ...Object.keys(multiDomMap[monthName] || {})
  ]);
  
  // Also add Sabado if applies
  const sabadoDates = louvorSabado.dates.split(';');
  const sabDateRaw = sabadoDates[mIndex].trim();
  let sabDay = null;
  if (sabDateRaw !== '-') {
    const match = sabDateRaw.match(/^(\d+)/);
    if (match) {
      sabDay = match[1].padStart(2, '0');
      daysInMonth.add(sabDay);
    }
  }
  
  const sortedDays = Array.from(daysInMonth).sort((a,b) => parseInt(a) - parseInt(b));
  
  for (const day of sortedDays) {
    let diaSemana = "Domingo"; // guess based on maps
    let culto = "Cultos da Família";
    
    if (louvorSexMap[monthName] && louvorSexMap[monthName][day] || multiSexMap[monthName] && multiSexMap[monthName][day]) {
      diaSemana = "Sexta";
      culto = "Culto Evangelístico";
    }
    if (day === sabDay) {
      diaSemana = "Sábado";
      culto = "Culto GPS (Jovens)";
    }
    
    let louvor = "A Definir";
    let multimidia = "A Definir";
    
    if (diaSemana === "Sexta") {
      louvor = (louvorSexMap[monthName][day]) ? "Equipe " + louvorSexMap[monthName][day] : "-";
      multimidia = (multiSexMap[monthName][day]) ? "Equipe " + multiSexMap[monthName][day] : "-";
    } else if (diaSemana === "Domingo") {
      louvor = (louvorDomMap[monthName][day]) ? "Equipe " + louvorDomMap[monthName][day] : "-";
      multimidia = (multiDomMap[monthName][day]) ? "Equipe " + multiDomMap[monthName][day] : "-";
    } else if (diaSemana === "Sábado") {
      louvor = "Equipe " + louvorSabado.equipes.split(';')[mIndex].trim();
      multimidia = "Equipe " + multiSabado.equipes.split(';')[mIndex].trim();
    }
    
    // Hardcode Coral
    if (louvor === "Equipe Coral") louvor = "Coral de Mulheres";

    allEscalas.push({
      mes: monthName,
      data: `${day}/${(mIndex+2).toString().padStart(2, '0')}`, // FEV is 02
      diaSemana,
      culto,
      louvor,
      multimidia,
      som: "-"
    });
  }
}

fs.writeFileSync('./src/data/escalasData.json', JSON.stringify(allEscalas, null, 2));
console.log("Generated JSON for Louvor and Multimidia!");
