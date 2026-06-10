import React, { useState } from "react";
import { Sparkles, ArrowRight, Copy, Check, ChevronLeft, ChevronRight, BookOpen, Quote, HelpCircle, Instagram, Code, Heart, RotateCcw } from "lucide-react";
import { SermonAnalysisResult, CarouselSlide } from "../types";

export default function SermonAssistant() {
  const [sermonText, setSermonText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [vibe, setVibe] = useState("Edificante & Prático");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<SermonAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carousel current slide preview state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Copy feedback states
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedDevotional, setCopiedDevotional] = useState(false);
  const [copiedSlide, setCopiedSlide] = useState<number | null>(null);

  // Inspirational loader messages
  const loadingMessages = [
    "Analisando texto e estruturando hermenêutica...",
    "Sondando referências bíblicas e teológicas...",
    "Desenvolvendo slides de impacto para mídias sociais...",
    "Estruturando reflexão devocional para vida diária...",
    "Formatando legendas de conversão com hashtags..."
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sermonText.trim() && !videoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentSlideIndex(0);

    // Simulate stepping through messages to raise UX drama
    setLoadingStep(0);
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    try {
      let extractedVideoId = null;
      if (videoUrl.trim()) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = videoUrl.trim().match(regExp);
        extractedVideoId = (match && match[2].length === 11) ? match[2] : videoUrl.trim();
      }

      const response = await fetch("/api/analyze-sermon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sermonText, videoId: extractedVideoId, vibe })
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o servidor de inteligência artificial.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Algo inesperado ocorreu ao processar o sermão.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSampleSermon = () => {
    setVideoUrl("https://www.youtube.com/watch?v=3ACwaoXbKVc");
    setSermonText(
      "Sermão deste Culto de Celebração:\nTema: A Coragem de Dar o Primeiro Passo para a Restauração.\nTexto Base: Lucas 15 - A parábola do filho pródigo que decide voltar ao pai.\n\nPrincipais tópicos do Pastor:\n1. O orgulho nos afasta das pessoas e da presença de Deus. O filho pródigo reivindica a herança e vai herdar um deserto. Muitas vezes corremos atrás de prazeres imediatos que dissolvem nosso propósito espiritual na terra.\n2. O arrependimento começa na mente e exige uma atitude física. O texto diz 'caindo em si, ele diz: vou levantar-me e ir para o meu pai'. Foram necessários quilômetros de caminhada de volta ao lar.\n3. O Pai nunca deixou de esperar e olhar para o horizonte. Ao avistar o filho de longe, Ele correu e o abraçou. A cruz é a prova cabal de que o amor restaura, conforta e reorganiza nossa mente. Não precisamos ficar envergonhados pelas falhas de ontem, pois em Cristo iniciamos uma nova história.\n4. O ministério da reconciliação é colocar anéis nos dedos de quem estava quebrado e fazer banquetes onde antes havia sofrimento."
    );
  };

  return (
    <div id="media-pastoral-assistant" className="bg-[#1e1e24] shadow-xl p-5 rounded-2xl border border-white/5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f5] leading-none">Área Ministerial / Diretor de Mídia</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1">Análise teológica e gerador de mídias RECON</p>
          </div>
        </div>
        <button
          onClick={loadSampleSermon}
          className="text-[10px] text-[#3b82f6] font-bold bg-[#111115] hover:bg-zinc-800 border border-white/5 px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1"
        >
          Carregar Exemplo
        </button>
      </div>

      {/* Input box */}
      {!result && !loading && (
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Link do Culto no YouTube</label>
            <input
              type="text"
              placeholder="Ex: https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-[#111115] text-[#f4f4f5] text-xs p-3.5 rounded-xl border border-white/5 outline-none focus:border-[#3b82f6] placeholder-gray-650"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Sermão / Transcrição (Opcional)</label>
              <span className="text-[10px] text-gray-500 font-sans">Forneça esboço ou anotações</span>
            </div>
            <textarea
              required={!videoUrl.trim()}
              rows={4}
              placeholder="Cole aqui o texto do sermão, esboço do pastor, transcrição do áudio ou pontos cruciais do culto..."
              value={sermonText}
              onChange={(e) => setSermonText(e.target.value)}
              className="w-full bg-[#111115] text-[#f4f4f5] text-xs p-3.5 rounded-xl border border-white/5 outline-none focus:border-[#3b82f6] placeholder-gray-650 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Estilo Pastoral</label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#111115] text-xs px-3 py-2.5 rounded-xl border border-white/5 text-gray-300 outline-none focus:border-[#3b82f6] cursor-pointer"
              >
                <option value="Edificante e Prático">Edificante e Prático</option>
                <option value="Profundo e Expositivo">Profundo e Expositivo</option>
                <option value="Teológico e Pastoral">Teológico e Pastoral</option>
                <option value="Encorajador e Familiar">Encorajador e Familiar</option>
                <option value="Radical para Jovens">Radical para Jovens</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#3b82f6] hover:bg-blue-600 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-98 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              >
                Analisar Sermão
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Loading Block */}
      {loading && (
        <div id="loader-sermon" className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
          {/* Pulsing and spinning loading ring */}
          <div className="relative flex items-center justify-center">
            <span className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <Sparkles className="w-5 h-5 text-blue-400 absolute animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#f4f4f5]">Processando com IA do Reino</p>
            <p className="text-[11px] text-gray-400 px-6 max-w-sm transition-all duration-300 italic">
              "{loadingMessages[loadingStep]}"
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && !loading && (
        <div className="p-4 bg-rose-950/20 rounded-lg border border-red-500/40 text-center space-y-2">
          <p className="text-xs text-rose-400 font-semibold">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-[10px] text-gray-400 hover:text-white underline"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Results Block */}
      {result && !loading && (
        <div id="sermon-generation-results" className="space-y-5 animate-fadeIn">
          {/* Tabs bar */}
          <div className="flex items-center justify-between bg-[#111115] p-1.5 rounded-xl border border-white/5">
            <span className="text-[11px] text-emerald-400 font-mono tracking-wider px-2 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Extração Concluída
            </span>
            <button
              onClick={() => {
                setResult(null);
                setSermonText("");
              }}
              className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1.5 bg-[#1e1e24] border border-white/5 px-2.5 py-1 rounded-full transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Analisar Outro
            </button>
          </div>

          {/* Section 1: Visual Carrossel de Instagram */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-rose-400" />
                Preview do Carrossel (Instagram Post)
              </h4>
              <span className="text-[10px] text-gray-500 font-sans">
                Slide {currentSlideIndex + 1} de {result.carrossel.length}
              </span>
            </div>

            {/* Simulated Mobile Instagram Slide Frame */}
            <div className="relative bg-gradient-to-br from-[#1e1e24] via-[#23232c] to-[#111115] border border-white/5 rounded-2xl p-6 h-60 flex flex-col justify-between shadow-2xl overflow-hidden group">
              {/* Layout watermark of the RECON church */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute left-6 top-6 text-[10px] font-mono uppercase text-[#3b82f6]/50 tracking-widest leading-none">
                Ministério RECON
              </div>
              <div className="absolute right-6 top-6 text-[10px] font-mono text-gray-600">
                {(currentSlideIndex + 1).toString().padStart(2, "0")}
              </div>

              {/* Slide content inside frame */}
              <div className="my-auto space-y-3 relative z-10">
                <h5 className="font-sans font-extrabold text-[#f4f4f5] text-base leading-tight tracking-tight uppercase">
                  {result.carrossel[currentSlideIndex].titulo}
                </h5>
                <p className="text-gray-300 text-xs font-sans leading-relaxed">
                  {result.carrossel[currentSlideIndex].texto}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-600 relative z-10 pt-2 border-t border-gray-900/40 select-none">
                <span className="flex items-center gap-1 italic">
                  <Heart className="w-3 h-3 text-[#9b1b22] fill-[#9b1b22]/10" />
                  @igrejarecon
                </span>
                <span className="font-medium">Arraste para o lado ›</span>
              </div>

              {/* Left Slider Click trigger */}
              {currentSlideIndex > 0 && (
                <button
                  onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900/95 text-white p-1 rounded-full cursor-pointer transition border border-gray-850 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Right Slider Click trigger */}
              {currentSlideIndex < result.carrossel.length - 1 && (
                <button
                  onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900/95 text-white p-1 rounded-full cursor-pointer transition border border-gray-850 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick selectors & copy slide bullet points */}
            <div className="flex items-center justify-between gap-2 bg-[#111115] p-2 rounded-xl border border-white/5">
              <div className="flex gap-1">
                {result.carrossel.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`w-5 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      currentSlideIndex === i ? "bg-[#3b82f6] w-8" : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => {
                  const s = result.carrossel[currentSlideIndex];
                  const textToCopy = `Slide ${s.slide_numero}\nTítulo: ${s.titulo}\nTexto: ${s.texto}`;
                  handleCopyText(textToCopy, () => setCopiedSlide(s.slide_numero));
                }}
                className="text-[10px] font-bold text-gray-300 flex items-center gap-1.5 bg-[#1e1e24] hover:bg-zinc-800 px-2.5 py-1.5 rounded-full border border-white/5 transition cursor-pointer select-none active:scale-95"
              >
                {copiedSlide === result.carrossel[currentSlideIndex].slide_numero ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Slide</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section 2: Devocional Escrito */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Devocional Escrito para Membros
              </h4>
              <button
                onClick={() => {
                  const d = result.devocional;
                  const textToCopy = `DEVOCIONAL RECON: ${d.titulo}\n\nVersículo Base: ${d.versiculo_base}\n\nReflexão:\n${d.reflexao}\n\nOração Guiada:\n${d.oracao_guiada}`;
                  handleCopyText(textToCopy, setCopiedDevotional);
                }}
                className="text-[10px] font-semibold text-blue-400 flex items-center gap-1 hover:underline cursor-pointer select-none"
              >
                {copiedDevotional ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Conteúdo Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Devocional Inteiro</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#111115] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex flex-col">
              {/* Devotional Banner Cover */}
              <div className="bg-[#1e1e24]/80 p-4 border-b border-white/5 flex flex-col gap-1">
                <h5 className="text-xs font-bold text-gray-200 tracking-tight">{result.devocional.titulo}</h5>
                {/* Scripture Base Callout */}
                <span className="text-[11px] text-[#3b82f6] font-mono tracking-wide mt-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-2.5 py-1 rounded inline-block">
                  {result.devocional.versiculo_base}
                </span>
              </div>

              {/* Devotional Reflection Body */}
              <div className="p-4.5 space-y-3.5 text-xs text-gray-400 leading-relaxed font-sans max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                {result.devocional.reflexao.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}

                {/* Guided Prayer Block */}
                <div className="bg-[#111115] p-4 rounded-xl border border-white/5 text-center relative mt-3.5">
                  <div className="absolute top-1 left-3 text-[14px] opacity-10 text-[#3b82f6] font-mono">“</div>
                  <h6 className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
                    Oração Guiada
                  </h6>
                  <p className="text-[11px] text-gray-300 italic leading-relaxed px-4">
                    "{result.devocional.oracao_guiada}"
                  </p>
                  <div className="absolute bottom-1 right-3 text-[14px] opacity-10 text-[#3b82f6] font-mono">”</div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section 3: Instagram Caption */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 flex items-center gap-1.5">
                <span className="w-1 px-1 h-3 rounded bg-emerald-500" />
                Legenda de Rede Social
              </h4>
              <button
                onClick={() => handleCopyText(result.legenda_instagram, setCopiedCaption)}
                className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer select-none"
              >
                {copiedCaption ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Legenda</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#111115] border border-white/5 rounded-2xl p-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 relative shadow-inner">
              <pre className="font-sans text-xs text-gray-400 leading-relaxed whitespace-pre-wrap select-all">
                {result.legenda_instagram}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
