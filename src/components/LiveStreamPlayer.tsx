import React, { useState, useEffect } from "react";
import { Tv } from "lucide-react";

export default function LiveStreamPlayer() {
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const response = await fetch("/api/live-video");
        const data = await response.json();
        
        if (data.videoId) {
          setLiveVideoId(data.videoId);
        } else {
          setLiveVideoId("3ACwaoXbKVc");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do YouTube via servidor:", error);
        setLiveVideoId("3ACwaoXbKVc");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStream();
    
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchLiveStream, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="recon-livestream-player" className="bg-[#1e1e24] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative flex flex-col">
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
            src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1`}
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
    </div>
  );
}
