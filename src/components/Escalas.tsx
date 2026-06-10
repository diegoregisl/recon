import React, { useState, useEffect } from "react";
import { Calendar, Music, MonitorPlay, Mic2, ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import escalasData from "../data/escalasData.json";

type Escala = {
  mes: string;
  data: string;
  diaSemana: string;
  culto: string;
  louvor: string;
  multimidia: string;
  som: string | { manha?: string; tarde?: string };
};

const mesesAbreviados = ["FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ", "JAN"];
const mesesNomes: Record<string, string> = {
  "FEV": "Fevereiro", "MAR": "Março", "ABR": "Abril", "MAI": "Maio",
  "JUN": "Junho", "JUL": "Julho", "AGO": "Agosto", "SET": "Setembro",
  "OUT": "Outubro", "NOV": "Novembro", "DEZ": "Dezembro", "JAN": "Janeiro (2027)"
};

const membrosJovemA = ["Miquéias", "João", "Vanessa", "Milena", "Cassiane", "Renata", "Renato", "Gabriel"];
const membrosJovemB = ["Raylan", "Thiago U.", "Gabi", "Tabita", "Natasha", "Jéssica M.", "Samuel"];

const membrosEquipes: Record<string, string[]> = {
  // Louvor
  "Equipe Felipe": ["Vanessa", "Gabriela", "Cassiane", "Jéssica M.", "Alexandre", "Thiago U.", "Renato", "João"],
  "Equipe Wesley": ["Jéssica C.", "Milena", "Renata", "Natasha", "Maurício", "Miquéias", "Samuel", "Douglas"],
  "Equipe Lorrane": ["Tabita", "Thalita", "Amanda", "Raylan", "Beto", "Diego R."],
  "Coral de Mulheres": ["Integrantes não listados. Em breve!"],
  
  // Louvor GPS (Sábado)
  "Equipe Felipe (GPS A)": ["Felipe (Líder)", ...membrosJovemA],
  "Equipe Felipe (GPS B)": ["Felipe (Líder)", ...membrosJovemB],
  "Equipe Wesley (GPS A)": ["Wesley (Líder)", ...membrosJovemA],
  "Equipe Wesley (GPS B)": ["Wesley (Líder)", ...membrosJovemB],
  "Equipe Lorrane (GPS A)": ["Lorrane (Líder)", ...membrosJovemA],
  "Equipe Lorrane (GPS B)": ["Lorrane (Líder)", ...membrosJovemB],

  // Multimídia
  "Equipe Tati": ["Nicolas", "Renata", "Natasha", "Iago", "Samuel"],
  "Equipe Carol": ["Renato", "Cassiane", "Carlos", "João", "Miguel"],
  "Equipe Robson": ["Robson", "José", "Nicole Freitas", "Celena", "Vítor Hugo", "Ane Nicole"]
};

export default function Escalas() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("FEV");
  const [selectedTeam, setSelectedTeam] = useState<{nome: string; membros: string[]} | null>(null);

  useEffect(() => {
    const today = new Date();
    // Use system time metadata or current Date
    today.setHours(0, 0, 0, 0);

    const allData = escalasData as Escala[];
    let foundMonth = null;
    let foundIndex = null;

    for (let i = 0; i < allData.length; i++) {
       const e = allData[i];
       const parts = e.data.split('/');
       if (parts.length === 2) {
          const m = parseInt(parts[1], 10) - 1; // 0-indexed month
          const d = parseInt(parts[0], 10);
          const year = e.mes === "JAN" ? 2027 : 2026;
          const eventDate = new Date(year, m, d);
          
          if (eventDate >= today) {
             foundMonth = e.mes;
             const monthEvents = allData.filter(x => x.mes === e.mes);
             foundIndex = monthEvents.findIndex(x => x.data === e.data);
             break;
          }
       }
    }

    if (foundMonth !== null && foundIndex !== null) {
       setSelectedMonth(foundMonth);
       setExpandedIndex(foundIndex);
    } else {
       const jsMonthToAbbr = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
       setSelectedMonth(jsMonthToAbbr[today.getMonth()]);
    }
  }, []);

  const escalasDoMes = (escalasData as Escala[]).filter(e => e.mes === selectedMonth);

  return (
    <div id="escalas-panel" className="bg-[#1e1e24] shadow-xl p-5 rounded-2xl border border-white/5 space-y-5 animate-fadeIn">
      <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f5] leading-none">Escalas Ministeriais</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1">Ano 2026</p>
          </div>
        </div>
        
        {/* Filtro de Mês */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={selectedMonth} 
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setExpandedIndex(0); // Reset accordion to first item
            }}
            className="bg-[#111115] text-xs font-semibold text-gray-300 border border-white/5 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer w-full"
          >
            {mesesAbreviados.map(m => (
              <option key={m} value={m}>{mesesNomes[m]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {escalasDoMes.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">Nenhuma escala cadastrada para este mês.</p>
        )}
        
        {escalasDoMes.map((escala, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div key={idx} className="bg-[#111115] border border-white/5 rounded-xl overflow-hidden transition-all duration-300">
              {/* Header Toggler */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#1e1e24] text-xs font-bold text-gray-300 px-2.5 py-1 rounded-md border border-white/5 flex flex-col items-center min-w-[3.5rem]">
                    <span>{escala.data.split('/')[0]}</span>
                    <span className="text-[9px] text-gray-500 font-normal">{escala.data.split('/')[1]}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">{escala.culto}</p>
                    <p className="text-[10px] text-gray-400">{escala.diaSemana}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                  <div className="grid grid-cols-1 gap-3">
                    {/* Louvor */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <Music className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Louvor</span>
                        {membrosEquipes[escala.louvor] ? (
                          <span 
                            onClick={() => setSelectedTeam({ nome: escala.louvor, membros: membrosEquipes[escala.louvor] })}
                            className="text-blue-400 font-medium cursor-pointer underline decoration-blue-500/30 underline-offset-2 hover:text-blue-300 transition"
                          >
                            {escala.louvor}
                          </span>
                        ) : (
                          <span className="text-gray-200 font-medium">{escala.louvor}</span>
                        )}
                      </div>
                    </div>

                    {/* Multimídia */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                        <MonitorPlay className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Multimídia</span>
                        {membrosEquipes[escala.multimidia] ? (
                          <span 
                            onClick={() => setSelectedTeam({ nome: escala.multimidia, membros: membrosEquipes[escala.multimidia] })}
                            className="text-pink-400 font-medium cursor-pointer underline decoration-pink-500/30 underline-offset-2 hover:text-pink-300 transition"
                          >
                            {escala.multimidia}
                          </span>
                        ) : (
                          <span className="text-gray-200 font-medium">{escala.multimidia}</span>
                        )}
                      </div>
                    </div>

                    {/* Som */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                        <Mic2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Mesa de Som</span>
                        {typeof escala.som === 'string' ? (
                          <span className="text-gray-200 font-medium">{escala.som}</span>
                        ) : (
                          <div className="flex gap-3 text-gray-200 font-medium">
                            <span><span className="text-gray-500 text-[10px]">Manhã:</span> {escala.som.manha || "-"}</span>
                            <span><span className="text-gray-500 text-[10px]">Tarde:</span> {escala.som.tarde || "-"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Integrantes da Equipe */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1e1e24] w-full max-w-xs rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#111115]">
              <h3 className="font-bold text-white text-sm">{selectedTeam.nome}</h3>
              <button onClick={() => setSelectedTeam(null)} className="text-gray-400 hover:text-white transition">
                 <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              <ul className="space-y-2.5">
                 {selectedTeam.membros.map(m => (
                   <li key={m} className="text-xs text-gray-300 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="font-medium tracking-wide">{m}</span>
                   </li>
                 ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
