import React, { useState, useEffect } from "react";
import { 
  Tv, 
  Sparkles, 
  Heart, 
  MapPin, 
  MessageCircle, 
  Home, 
  BookOpen, 
  Clock, 
  Shield, 
  ChevronRight, 
  Instagram, 
  Mail, 
  Phone,
  Signal,
  Wifi,
  Battery,
  Facebook,
  Radio,
  Calendar
} from "lucide-react";
import AnalyzedSermon from "./components/AnalyzedSermon";
import LiveStreamPlayer from "./components/LiveStreamPlayer";

import SermonAssistant from "./components/SermonAssistant";
import Escalas from "./components/Escalas";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "studio" | "about" | "live" | "escalas">("home");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch("/api/live-video");
        const data = await res.json();
        setIsLive(!!data.isLive);
      } catch (e) {
        console.error(e);
      }
    };
    checkLive();
    const interval = setInterval(checkLive, 300000);
    return () => clearInterval(interval);
  }, []);
  const [systime, setSystime] = useState("10:00");

  // Keep a mock local smartphone clock updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hStr = now.getHours().toString().padStart(2, "0");
      const mStr = now.getMinutes().toString().padStart(2, "0");
      setSystime(`${hStr}:${mStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0c] min-h-screen flex items-center justify-center font-sans antialiased text-[#f4f4f5] p-0 sm:p-4">
      {/* 
        Smartphone Frame matching the 'Immersive UI' template layout guidelines.
        Thick frame border, responsive width, gorgeous native look.
      */}
      <div 
        id="smartphone-frame" 
        className="w-full max-w-sm sm:max-w-md bg-[#111115] sm:rounded-[3rem] min-h-screen sm:min-h-[820px] sm:max-h-[870px] flex flex-col shadow-2xl overflow-hidden border-0 sm:border-[8px] border-[#1e1e24] relative"
      >
        {/* Smartphone Camera Notch & Top Status Bar */}
        <div className="hidden sm:flex bg-black h-8 w-full sticky top-0 z-40 items-center justify-between px-6 text-[10px] text-gray-400 select-none">
          <span className="font-semibold font-mono text-[9px] tracking-wide text-gray-300">{systime}</span>
          {/* Faux speaker notch */}
          <div className="bg-[#111115] h-3 w-16 rounded-full border border-white/5" />
          <div className="flex items-center gap-1.5 opacity-80 scale-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5 text-gray-300" />
          </div>
        </div>

        {/* RECON Header */}
        <header className="bg-[#111115]/95 backdrop-blur-md sticky top-0 z-30 border-b border-white/5 p-4 pt-6 flex items-center justify-between select-none relative">
          <div className="w-8" /> {/* Balance spacer */}
          <div className="text-center">
            {/* Bold Display Logo with Space Grotesk Font and Immersive UI heavy typography */}
            <h1 className="font-display font-black text-xl uppercase tracking-[0.15em] text-white leading-none mb-1 flex items-center justify-center gap-1">
              RECON DIGITAL
            </h1>
            <p className="text-[9px] text-[#3b82f6] font-bold uppercase tracking-[0.1em]">
              Ministério da Reconciliação
            </p>
          </div>
          
          {/* Glowing Status Indicator Bulb from Immersive UI */}
          <div className="absolute right-5 top-7 w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6] animate-pulseGlow" />

          {/* Quick trigger to admin/studio tab */}
          <button
            onClick={() => {
              if (activeTab !== "studio") {
                const pwd = window.prompt("Senha de Acesso (Área Ministerial):");
                if (pwd === "recon123") {
                  setActiveTab("studio");
                } else if (pwd !== null) {
                  alert("Senha incorreta.");
                }
              } else {
                setActiveTab("home");
              }
            }}
            className="w-8 h-8 rounded-lg bg-[#1e1e24] hover:bg-zinc-800 border border-white/5 flex items-center justify-center text-blue-400 group cursor-pointer transition relative z-10"
            title="Estúdio de Mídia"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-5 py-5 space-y-6 pb-24 scrollbar-thin scrollbar-thumb-zinc-800 select-none">
          
          {/* --- TAB 1: HOME FEED --- */}
          {activeTab === "home" && (
            <div id="tab-content-home" className="space-y-6 animate-fadeIn">
              {/* Introduction bar */}
              <div className="bg-[#1e1e24] border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] shrink-0">
                  <Heart className="w-4.5 h-4.5 text-[#3b82f6] fill-[#3b82f6]/10" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Bem-vindo à RECON Digital</h4>
                  <p className="text-[10px] text-gray-400 font-sans">"Tudo isso provém de Deus, que nos reconciliou consigo mesmo..."</p>
                </div>
              </div>

              {/* 1. Playback Transmissão ao Vivo */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-bold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-[#3b82f6]" />
                    Mensagem da Semana
                  </h3>
                </div>
                <AnalyzedSermon />
              </div>

              {/* QuickActions e EventsList foram removidos para limpeza do MVP */}
            </div>
          )}

          {/* --- TAB LIVE: CULTO AO VIVO --- */}
          {activeTab === "live" && isLive && (
            <div id="tab-content-live" className="space-y-6 animate-fadeIn">
              <div className="bg-red-950/30 border border-red-500/20 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 animate-pulse">
                  <Radio className="w-4.5 h-4.5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Estamos Ao Vivo</h4>
                  <p className="text-[10px] text-gray-400 font-sans">Acompanhe nossa transmissão em tempo real.</p>
                </div>
              </div>
              <LiveStreamPlayer />
            </div>
          )}

          {/* --- TAB 2: SERMON ASSISTANT / STUDIO --- */}
          {activeTab === "studio" && (
            <div id="tab-content-studio" className="space-y-5 animate-fadeIn">
              {/* Context intro banner */}
              <div className="bg-blue-950/20 border border-white/5 p-4 rounded-2xl space-y-1.5">
                <span className="inline-flex bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full border border-white/5">
                  Diretor de Mídia Pastoral
                </span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  Insira anotações teológicas ou a transcrição de um sermão para gerar automaticamente carrosséis para redes sociais, captações de legenda para o Instagram e devocionais bíblicos práticos.
                </p>
              </div>

              <SermonAssistant />
            </div>
          )}

          {/* --- TAB ESCALAS: ESCALAS MINISTERIAIS --- */}
          {activeTab === "escalas" && (
            <Escalas />
          )}

          {/* --- TAB 3: ABOUT CHURCH PROFILE --- */}
          {activeTab === "about" && (
            <div id="tab-content-about" className="space-y-6 animate-fadeIn">
              {/* Mission Statement */}
              <div className="bg-[#1e1e24] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden text-center">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
                <h4 className="text-sm font-bold text-[#3b82f6] uppercase tracking-widest">Contato</h4>
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                  Obrigado por visitar nosso app! Seria muito legal recebê-lo(a) em um dos cultos de nossa igreja para conversarmos e tomarmos um café juntos.
                </p>
              </div>

              {/* Agenda */}
              <div className="bg-[#1e1e24] border border-white/5 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Agenda
                </h4>
                <div className="space-y-3 text-xs leading-tight font-sans">
                  <div className="flex flex-col text-gray-400 py-1.5 border-b border-white/5 gap-1">
                    <span className="text-gray-200 font-semibold">Domingo 10:00</span>
                    <span className="text-[11px]">Culto da Família</span>
                  </div>
                  <div className="flex flex-col text-gray-400 py-1.5 border-b border-white/5 gap-1">
                    <span className="text-gray-200 font-semibold">Domingo 18:00</span>
                    <span className="text-[11px]">Culto da Família</span>
                  </div>
                  <div className="flex flex-col text-gray-400 py-1.5 gap-1">
                    <span className="text-gray-200 font-semibold">Sexta-feira 20:00</span>
                    <span className="text-[11px]">Culto Evangelístico</span>
                  </div>
                </div>
              </div>

              {/* Conecte-se conosco */}
              <div className="space-y-3 bg-[#1e1e24] border border-white/5 p-4 rounded-2xl text-xs font-sans">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Conecte-se conosco</h4>
                
                <a href="tel:+551127070700" className="flex items-center gap-3 text-gray-300 py-1.5 border-b border-white/5 hover:text-white transition cursor-pointer">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>+55 11 2707-0700</span>
                </a>
                
                <a href="https://maps.google.com/?q=Rua+Pedro+Gonçalves+Varejão,+124,+Jardim+Mimar,+São+Paulo" target="_blank" rel="noreferrer" className="flex items-start gap-3 text-gray-300 py-2 border-b border-white/5 hover:text-white transition cursor-pointer">
                  <MapPin className="w-4 h-4 text-[#9b1b22] shrink-0 mt-0.5" />
                  <span className="leading-snug">Rua Pedro Gonçalves Varejão, 124. Jardim Mimar<br/>São Paulo/SP CEP: 03986-170</span>
                </a>
                
                <a href="mailto:secretaria@igrejarecon.org.br" className="flex items-center gap-3 text-gray-300 py-1.5 border-b border-white/5 hover:text-white transition cursor-pointer">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>secretaria@igrejarecon.org.br</span>
                </a>

                <a href="https://wa.me/551127070700" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 py-1.5 border-b border-white/5 hover:text-white transition cursor-pointer">
                  <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>WhatsApp Igreja RECON</span>
                </a>

                <a href="https://facebook.com/igrejarecon/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 py-1.5 border-b border-white/5 hover:text-white transition cursor-pointer">
                  <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>facebook.com/igrejarecon/</span>
                </a>

                <a href="https://instagram.com/igrejareconoficial/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 py-1.5 hover:text-white transition cursor-pointer">
                  <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>instagram.com/igrejareconoficial/</span>
                </a>
              </div>
            </div>
          )}
        </main>

        {/* Global Bottom Tab Bar matching the aesthetic Immersive tab bar */}
        <nav 
          id="smartphone-navbar" 
          className="absolute bottom-0 inset-x-0 h-20 bg-[#1e1e24] border-t border-white/5 flex justify-between items-center px-10 z-40 rounded-t-[2.5rem] select-none pb-4"
        >
          {/* Tab 1: Home Button */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center cursor-pointer outline-none relative transition-all duration-200 ${
              activeTab === "home" ? "text-[#3b82f6] scale-110" : "text-gray-500 hover:text-white"
            }`}
          >
            <Home className="w-5.5 h-5.5" />
          </button>

          {/* Tab Ao Vivo (Conditional) */}
          {isLive && (
            <button
              onClick={() => setActiveTab("live")}
              className={`flex flex-col items-center justify-center cursor-pointer outline-none relative transition-all duration-200 ${
                activeTab === "live" ? "text-red-500 scale-110" : "text-gray-500 hover:text-red-400"
              }`}
            >
              <Radio className="w-5.5 h-5.5 animate-pulse" />
            </button>
          )}

          {/* Tab 2: Media Studio Button (Protected) */}
          <button
            onClick={() => {
              if (activeTab !== "studio") {
                const pwd = window.prompt("Senha de Acesso (Área Ministerial):");
                if (pwd === "recon123") {
                  setActiveTab("studio");
                } else if (pwd !== null) {
                  alert("Senha incorreta.");
                }
              } else {
                setActiveTab("home");
              }
            }}
            className={`flex flex-col items-center justify-center cursor-pointer outline-none relative transition-all duration-200 ${
              activeTab === "studio" ? "text-[#3b82f6] scale-110" : "text-gray-500 hover:text-white"
            }`}
          >
            <Sparkles className="w-5.5 h-5.5" />
          </button>

          {/* Tab Escalas Button (Protected) */}
          <button
            onClick={() => {
              if (activeTab !== "escalas") {
                const pwd = window.prompt("Senha de Acesso (Escalas):");
                if (pwd === "escalas123") {
                  setActiveTab("escalas");
                } else if (pwd !== null) {
                  alert("Senha incorreta.");
                }
              } else {
                setActiveTab("home");
              }
            }}
            className={`flex flex-col items-center justify-center cursor-pointer outline-none relative transition-all duration-200 ${
              activeTab === "escalas" ? "text-[#3b82f6] scale-110" : "text-gray-500 hover:text-white"
            }`}
          >
            <Calendar className="w-5.5 h-5.5" />
          </button>

          {/* Tab 3: About Button */}
          <button
            onClick={() => setActiveTab("about")}
            className={`flex flex-col items-center justify-center cursor-pointer outline-none relative transition-all duration-200 ${
              activeTab === "about" ? "text-[#3b82f6] scale-110" : "text-gray-500 hover:text-white"
            }`}
          >
            <BookOpen className="w-5.5 h-5.5" />
          </button>
        </nav>

        {/* Realistic iOS indicators for high-fidelity native phone screen */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}
