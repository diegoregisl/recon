import React, { useState } from "react";
import { Calendar, Clock, Bell, Check, Sparkles, MapPin } from "lucide-react";
import { ChurchEvent } from "../types";

export default function EventsList() {
  const [events, setEvents] = useState<ChurchEvent[]>([
    {
      id: "ev1",
      titulo: "Culto de Celebração & Reconciliação",
      data: "Próximo Domingo",
      hora: "18:00h",
      detalhes: "Nosso encontro de louvor, mensagens inspiradoras e ceia do Senhor. Venha com sua família adorar e crescer na comunhão.",
      local: "Auditório Principal RECON",
      tag: "Celebração"
    },
    {
      id: "ev2",
      titulo: "Quarta de Clamor & Avivamento",
      data: "Quarta-Feira",
      hora: "19:30h",
      detalhes: "Uma noite focada em profunda busca espiritual, oração fervorosa intercessora por famílias e estudo aprofundado das escrituras.",
      local: "Nave da Igreja",
      tag: "Estudo & Clamor"
    }
  ]);

  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, boolean>>({});

  const toggleReminder = (id: string) => {
    setNotifiedEvents((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div id="recon-events-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-sans font-bold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#3b82f6]" />
          Próximos Encontros
        </h3>
        <span className="text-[10px] text-gray-500 font-medium">Cultos Regulares</span>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 bg-[#1e1e24] rounded-2xl border border-white/5 flex flex-col justify-between hover:border-[#3b82f6]/50 transition relative overflow-hidden group"
          >
            {/* Top Info Banner - Tag */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-bold tracking-wider font-mono px-2 py-0.5 rounded-md uppercase ${
                event.tag === "Celebração" 
                  ? "bg-blue-500/10 text-[#3b82f6] border border-[#3b82f6]/20" 
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {event.tag}
              </span>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#3b82f6]" />
                  {event.data}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#3b82f6]" />
                  {event.hora}
                </span>
              </div>
            </div>

            {/* Event Title & Body */}
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#f4f4f5] group-hover:text-[#3b82f6] transition-colors">
                {event.titulo}
              </h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {event.detalhes}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-white/5 select-none">
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#9b1b22]" />
                {event.local}
              </span>

              {/* Notifying trigger button */}
              <button
                type="button"
                onClick={() => toggleReminder(event.id)}
                className={`py-1.5 px-3 rounded-xl text-[10px] font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer transition active:scale-95 ${
                  notifiedEvents[event.id]
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-[#111115] border border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {notifiedEvents[event.id] ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Lembrete Ativo</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Me Lembrar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
