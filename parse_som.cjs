const fs = require('fs');
const xlsx = require('xlsx');

// Map full month names from excel sheets to abbreviations used in our JSON
const monthNameToAbbr = {
  "FEVEREIRO": "FEV",
  "MARÇO": "MAR",
  "ABRIL": "ABR",
  "MAIO": "MAI",
  "JUNHO": "JUN",
  "JULHO": "JUL",
  "AGOSTO": "AGO",
  "SETEMBRO": "SET",
  "OUTUBRO": "OUT",
  "NOVEMBRO": "NOV",
  "DEZEMBRO": "DEZ",
  "JANEIRO": "JAN" // Jan 2027
};

function parseSomExcel(filePath, jsonPath) {
  const workbook = xlsx.readFile(filePath);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Iterate over all sheets in the excel
  workbook.SheetNames.forEach(sheetName => {
    const abbr = monthNameToAbbr[sheetName.toUpperCase().trim()];
    if (!abbr) return;

    const sheet = workbook.Sheets[sheetName];
    const rawJson = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // The format of the excel sheet is roughly:
    // Row X: ÁREA | SEXTA | DOMINGO ...
    // Row X+1: | <date> | <date> ...
    // Row X+2: | MANHÃ | TARDE ... (sometimes, for sunday)
    // Row X+3: SOM | <name> | <name> | <name> ...

    // We'll iterate row by row and try to find dates
    for (let i = 0; i < rawJson.length; i++) {
      const row = rawJson[i];
      if (!row || !row[0]) continue;
      
      // Look for rows where the first column is 'SOM'
      if (typeof row[0] === 'string' && row[0].trim().toUpperCase() === 'SOM') {
        // Go backwards to find the dates and days
        let dateRowIndex = i - 1;
        while (dateRowIndex >= 0) {
          const checkRow = rawJson[dateRowIndex];
          // Usually dates are like "30-Jan", "13-Feb", "20/02", "1-Mar", etc
          // Also check the row before date for "SEXTA" or "DOMINGO"
          let hasDates = false;
          for (let col = 1; col < checkRow.length; col++) {
            if (checkRow[col] && (String(checkRow[col]).includes('-') || String(checkRow[col]).includes('/'))) {
              hasDates = true;
              break;
            }
          }
          if (hasDates) break;
          dateRowIndex--;
        }

        if (dateRowIndex >= 0) {
          const datesRow = rawJson[dateRowIndex];
          const manhaTardeRow = rawJson[i-1]; // Could be MANHÃ/TARDE row if there's one

          // Now match columns to our existing data
          for (let col = 1; col < row.length; col++) {
            const dateStr = datesRow[col];
            if (!dateStr) continue;

            const dateStrClean = String(dateStr).trim();
            // Parse day from dateStr (can be embedded like SEXTA\n05/06)
            const dayMatch = dateStrClean.match(/(\d{1,2})[\/-]\d{2}/);
            if (!dayMatch) continue;
            
            const dayNum = dayMatch[1].padStart(2, '0');
            const dataQuery = `${dayNum}/`; // We match by "DD/"

            // Find the corresponding object in our JSON
            const target = data.find(e => e.mes === abbr && e.data.startsWith(dataQuery));
            if (target) {
              const cellVal = row[col] === undefined ? "" : String(row[col]);
              const val = cellVal.trim() || "-";
              
              // If it's a Sunday or has Manha/Tarde
              if (manhaTardeRow && String(manhaTardeRow[col]).toUpperCase().includes("MANHÃ")) {
                if (typeof target.som === 'string') target.som = { manha: "-", tarde: "-" };
                target.som.manha = val;
              } else if (manhaTardeRow && String(manhaTardeRow[col]).toUpperCase().includes("TARDE")) {
                if (typeof target.som === 'string') target.som = { manha: "-", tarde: "-" };
                target.som.tarde = val;
              } else {
                // If it's Sunday but somehow no explicit Manhã/Tarde label, or it's Friday/Saturday
                if (target.diaSemana === "Domingo") {
                   // If it's Sunday, Excel usually has 2 columns (Manhã and Tarde) mapped to Sunday's merged date cell.
                   // Let's see if the next column is Tarde
                   if (col === 1 && String(manhaTardeRow[col+1]).toUpperCase().includes("TARDE")) {
                      // Handled by standard flow above if we iterate through all columns
                   }
                }
                
                // If it's Friday or Saturday, just assign directly
                if (target.diaSemana !== "Domingo") {
                  target.som = val;
                }
              }
            }
          }
          
          // Special case for Sundays in the Excel where the Date spans two columns but `sheet_to_json` leaves the second col header blank
          for (let col = 1; col < row.length; col++) {
             if (!datesRow[col] && datesRow[col-1]) {
                // It might be the TARDE column for the previous date
                const dateStrClean = String(datesRow[col-1]).trim();
                const dayMatch = dateStrClean.match(/(\d{1,2})[\/-]\d{2}/);
                if (dayMatch) {
                   const dayNum = dayMatch[1].padStart(2, '0');
                   const target = data.find(e => e.mes === abbr && e.data.startsWith(`${dayNum}/`));
                   if (target && target.diaSemana === "Domingo") {
                      if (manhaTardeRow && String(manhaTardeRow[col]).toUpperCase().includes("TARDE")) {
                         const cellVal2 = row[col] === undefined ? "" : String(row[col]);
                         const val = cellVal2.trim() || "-";
                         if (typeof target.som === 'string') target.som = { manha: target.som, tarde: "-" };
                         target.som.tarde = val;
                      }
                   }
                }
             }
          }

        }
      }
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log('Parsed SOM successfully!');
}

parseSomExcel('./ESCALA SOM 2026.xlsx', './src/data/escalasData.json');
