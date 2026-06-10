import React, { useState, useEffect } from "react";
import { Tv, Sparkles, BookOpen, Quote, Hash, Clock } from "lucide-react";

export default function AnalyzedSermon() {
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<any>(null);

  useEffect(() => {
    const fetchLatestSermon = async () => {
      try {
        const response = await fetch("/api/latest-sermon");
        if (response.ok) {
          const data = await response.json();
          if (data && data.devocional) {
            setAiSummary(data);
          }
        }
      } catch (err) {
        console.error("No cached sermon available yet", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSermon();
  }, []);

  return (
    <div id="recon-analyzed-sermon" className="bg-[#1e1e24] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative flex flex-col">
      {/* 16:9 Video Player */}
      <div className="relative w-full aspect-video bg-[#111115] flex items-center justify-center overflow-hidden shrink-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Tv className="w-8 h-8 text-gray-500 animate-pulse mb-3" />
            <p className="font-sans text-xs tracking-wide text-gray-400">Carregando análise...</p>
          </div>
        ) : aiSummary?.videoId ? (
          <iframe
            className="w-full h-full absolute inset-0"
            src={`https://www.youtube.com/embed/${aiSummary.videoId}?autoplay=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
           <div className="flex flex-col items-center justify-center p-4 text-center">
            <Tv className="w-8 h-8 text-gray-600 mb-3" />
            <p className="font-sans text-sm font-medium tracking-wide text-gray-400">Sem Culto Analisado</p>
            <p className="font-sans text-xs tracking-wide text-gray-500 mt-1">
              Nenhuma análise de sermão encontrada no servidor.
            </p>
          </div>
        )}
      </div>

      {/* Seção de IA */}
      <div className="p-4 bg-[#1a1a20] border-t border-white/5 flex-1 flex flex-col">
        {!aiSummary && !loading && (
           <div className="text-center py-6">
              <Sparkles className="w-6 h-6 text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-gray-500 font-medium">Os materiais teológicos deste culto estarão disponíveis em breve.</p>
           </div>
        )}

        {/* Resultado da IA */}
        {aiSummary && (
          <div className="space-y-4 mt-2 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Materiais de Estudo
              </span>
            </div>

            {/* Linha do Tempo do Culto */}
            {aiSummary.linha_do_tempo && aiSummary.linha_do_tempo.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-400" />
                  Cronograma do Culto
                </h4>
                <div className="space-y-3 border-l-2 border-gray-800 ml-2 pl-4 relative">
                  {aiSummary.linha_do_tempo.map((item: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#1a1a20]" />
                      <h5 className="font-semibold text-xs text-orange-300">{item.fase}</h5>
                      <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Devocional (Pregação) */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mensagem Principal</h4>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                {aiSummary.devocional?.titulo}
              </h4>
              <p className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/20 px-2 py-1 rounded-md inline-block">
                {aiSummary.devocional?.versiculo_base}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                {aiSummary.devocional?.reflexao}
              </p>
              <div className="bg-[#111115] p-3 rounded-lg border border-white/5 mt-2">
                <p className="text-[11px] text-gray-400 italic flex gap-2">
                  <Quote className="w-3 h-3 text-gray-600 shrink-0 mt-0.5" />
                  {aiSummary.devocional?.oracao_guiada}
                </p>
              </div>
            </div>

            {/* Carrossel */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ideias para Carrossel</h4>
              <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-thin scrollbar-thumb-zinc-800">
                {aiSummary.carrossel?.map((slide: any) => (
                  <div key={slide.slide_numero} className="shrink-0 w-48 h-48 bg-gradient-to-br from-[#1e1e24] to-[#111115] border border-white/10 rounded-xl p-4 flex flex-col snap-center relative">
                    <span className="absolute top-3 right-3 text-[10px] font-mono text-gray-600 font-bold">{slide.slide_numero}/5</span>
                    <h5 className="font-bold text-indigo-400 text-sm mt-4 mb-2">{slide.titulo}</h5>
                    <p className="text-[11px] text-gray-300 leading-snug">{slide.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legenda Instagram */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3 h-3 text-pink-500" />
                Legenda para Instagram
              </h4>
              <div className="bg-[#111115] p-3 rounded-lg border border-white/5 relative group">
                <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap pr-8">
                  {aiSummary.legenda_instagram}
                </p>
                <button 
                  onClick={() => navigator.clipboard.writeText(aiSummary.legenda_instagram)}
                  className="absolute top-2 right-2 p-1.5 bg-[#1e1e24] hover:bg-zinc-700 rounded-md text-gray-400 transition"
                  title="Copiar texto"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
