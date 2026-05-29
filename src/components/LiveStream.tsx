import React, { useState, useEffect } from "react";
import { Tv, Sparkles, Loader2, BookOpen, Quote, Hash, Clock } from "lucide-react";

export default function LiveStream() {
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // AI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        if (!API_KEY || !CHANNEL_ID) {
          console.error("YouTube API Key ou Channel ID ausente nas variáveis de ambiente.");
          setLoading(false);
          return;
        }

        // Busca por transmissões ao vivo atuais
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
        );
        const data = await response.json();

        // Se a cota da API acabar (Erro 403 ou 429), usamos um vídeo fixo para o app não quebrar
        if (data.error) {
          console.error("Erro na API do YouTube (Cota excedida?):", data.error.message);
          setLiveVideoId("3ACwaoXbKVc"); // Vídeo de teste (último culto)
          return;
        }

        if (data.items && data.items.length > 0) {
          setLiveVideoId(data.items[0].id.videoId);
        } else {
          // Se não houver live, buscar o último vídeo do canal como fallback
          const fallbackRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=1&key=${API_KEY}`
          );
          const fallbackData = await fallbackRes.json();
          
          if (fallbackData.error) {
            console.error("Erro na API do YouTube (Fallback):", fallbackData.error.message);
            setLiveVideoId("3ACwaoXbKVc"); // Vídeo de teste
            return;
          }

          if (fallbackData.items && fallbackData.items.length > 0) {
            setLiveVideoId(fallbackData.items[0].id.videoId);
          } else {
            setLiveVideoId("3ACwaoXbKVc"); // Segurança extra
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do YouTube:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStream();
    
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchLiveStream, 300000);
    return () => clearInterval(interval);
  }, [API_KEY, CHANNEL_ID]);

  const handleGenerateSummary = async () => {
    if (!liveVideoId) return;
    
    setIsGenerating(true);
    setAiError(null);
    setAiSummary(null);

    try {
      const response = await fetch("/api/analyze-sermon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: liveVideoId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro desconhecido ao analisar o vídeo.");
      }
      
      setAiSummary(data);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="recon-livestream-card" className="bg-[#1e1e24] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative flex flex-col">
      {/* 16:9 Video Player */}
      <div className="relative w-full aspect-video bg-[#111115] flex items-center justify-center overflow-hidden shrink-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Tv className="w-8 h-8 text-gray-500 animate-pulse mb-3" />
            <p className="font-sans text-xs tracking-wide text-gray-400">Verificando transmissão...</p>
          </div>
        ) : liveVideoId ? (
          <iframe
            className="w-full h-full absolute inset-0"
            src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
           <div className="flex flex-col items-center justify-center p-4 text-center">
            <Tv className="w-8 h-8 text-gray-600 mb-3" />
            <p className="font-sans text-sm font-medium tracking-wide text-gray-400">Canal Offline</p>
            <p className="font-sans text-xs tracking-wide text-gray-500 mt-1">
              Acesse nosso canal no YouTube para ver mais vídeos.
            </p>
            <a 
              href="https://www.youtube.com/igrejarecon" 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Visitar Canal
            </a>
          </div>
        )}
      </div>

      {/* Seção de IA - Aparece logo abaixo do vídeo se tiver um vídeo carregado */}
      {liveVideoId && (
        <div className="p-4 bg-[#1a1a20] border-t border-white/5 flex-1 flex flex-col">
          {!aiSummary && !isGenerating && (
            <button
              onClick={handleGenerateSummary}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Resumo do Culto com IA
            </button>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <p className="text-xs text-gray-400 text-center px-4">
                A Inteligência Artificial está assistindo ao culto e extraindo os pontos principais... <br/> (Isso pode levar alguns segundos)
              </p>
            </div>
          )}

          {aiError && (
            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 text-center mt-2">
              <p className="text-xs text-red-400 font-semibold mb-1">Ops, algo deu errado!</p>
              <p className="text-[10px] text-gray-400">{aiError}</p>
              <button onClick={handleGenerateSummary} className="mt-3 text-[10px] bg-red-900/50 hover:bg-red-900 px-3 py-1.5 rounded-md text-red-200">
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Resultado da IA */}
          {aiSummary && !isGenerating && (
            <div className="space-y-4 mt-2 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Materiais Gerados
                </span>
                <button onClick={() => setAiSummary(null)} className="text-[10px] text-gray-500 hover:text-white">
                  Limpar
                </button>
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
      )}
    </div>
  );
}
