import React, { useState } from "react";
import { MessageSquare, Heart, MapPin, Hand, Copy, Check, ShieldCheck, HeartHandshake, Map, Send, Calendar, Users, ExternalLink } from "lucide-react";
import { PrayerRequest, ConnectionCard } from "../types";

export default function QuickActions() {
  const [activeModal, setActiveModal] = useState<"pray" | "tithe" | "connect" | "location" | null>(null);

  // States for Prayer Modal
  const [prayers, setPrayers] = useState<PrayerRequest[]>([
    { id: "p1", nome: "Carlos Eduardo", pedido: "Orar pela completa recuperação pós-cirúrgica da minha mãe, Dona Rita.", categoria: "Cura / Saúde", data: "Hoje", apoiadores: 14 },
    { id: "p2", nome: "Karina Souza", pedido: "Peço direção de Deus e sabedoria em uma decisão profissional importante nesta semana.", categoria: "Carreira", data: "Ontem", apoiadores: 8 },
    { id: "p3", nome: "Anônimo", pedido: "Pela restauração e reconciliação da comunhão familiar no meu lar.", categoria: "Família", data: "Há 2 dias", apoiadores: 27 },
  ]);
  const [newPrayer, setNewPrayer] = useState({ nome: "", pedido: "", categoria: "Saúde" });
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  // States for Tithing Modal
  const [donationValue, setDonationValue] = useState("50");
  const [customValue, setCustomValue] = useState("");
  const [donationType, setDonationType] = useState("Dízimo");
  const [pixCopied, setPixCopied] = useState(false);
  const pixKey = "pix@igrejarecon.org";

  // States for Connection Modal
  const [connectCard, setConnectCard] = useState<ConnectionCard>({ nome: "", telefone: "", email: "", interesse: "Célula (Pequeno Grupo)", mensagem: "" });
  const [connectSubmitted, setConnectSubmitted] = useState(false);

  // Toggle pray support
  const handleSupportPrayer = (id: string) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const alreadySupported = p.apoiadoPorMim;
          return {
            ...p,
            apoiadores: alreadySupported ? p.apoiadores - 1 : p.apoiadores + 1,
            apoiadoPorMim: !alreadySupported,
          };
        }
        return p;
      })
    );
  };

  // Submit prayer request
  const submitPrayerForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.pedido.trim()) return;
    const item: PrayerRequest = {
      id: Date.now().toString(),
      nome: newPrayer.nome.trim() || "Anônimo",
      pedido: newPrayer.pedido,
      categoria: newPrayer.categoria,
      data: "Agora mesmo",
      apoiadores: 1,
      apoiadoPorMim: true
    };
    setPrayers([item, ...prayers]);
    setNewPrayer({ nome: "", pedido: "", categoria: "Saúde" });
    setPrayerSubmitted(true);
    setTimeout(() => setPrayerSubmitted(false), 3000);
  };

  // Copy PIX Code simulated action
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  // Submit Connection card
  const submitConnectionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectCard.nome || !connectCard.telefone) return;
    console.log("Connection card details:", connectCard);
    setConnectSubmitted(true);
    setTimeout(() => {
      setConnectSubmitted(false);
      setActiveModal(null);
      setConnectCard({ nome: "", telefone: "", email: "", interesse: "Célula (Pequeno Grupo)", mensagem: "" });
    }, 4500);
  };

  return (
    <div className="space-y-4">
      {/* 2-Column Action Buttons Grid */}
      <div id="quick-actions-grid" className="grid grid-cols-2 gap-3.5">
        <button
          id="btn-pedidos-oracao"
          onClick={() => setActiveModal("pray")}
          className="bg-[#1e1e24] border border-white/5 hover:border-[#3b82f6]/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-300 text-center select-none active:scale-95 group h-28"
        >
          <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition duration-300">
            <Hand className="w-5.5 h-5.5 fill-none" />
          </div>
          <span className="text-[#f4f4f5] text-xs font-semibold">Pedidos de Oração</span>
          <span className="text-[10px] text-gray-500 leading-none">Apoio em oração</span>
        </button>

        <button
          id="btn-dizimos-ofertas"
          onClick={() => setActiveModal("tithe")}
          className="bg-[#1e1e24] border border-white/5 hover:border-[#3b82f6]/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-300 text-center select-none active:scale-95 group h-28"
        >
          <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition duration-300">
            <Heart className="w-5.5 h-5.5" />
          </div>
          <span className="text-[#f4f4f5] text-xs font-semibold">Dízimos e Ofertas</span>
          <span className="text-[10px] text-gray-500 leading-none">Generosidade e Missões</span>
        </button>

        <button
          id="btn-conectar"
          onClick={() => setActiveModal("connect")}
          className="bg-[#1e1e24] border border-white/5 hover:border-[#3b82f6]/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-300 text-center select-none active:scale-95 group h-28"
        >
          <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition duration-300">
            <MessageSquare className="w-5.5 h-5.5" />
          </div>
          <span className="text-[#f4f4f5] text-xs font-semibold">Conectar</span>
          <span className="text-[10px] text-gray-500 leading-none">Una-se a uma Célula</span>
        </button>

        <button
          id="btn-localizacao"
          onClick={() => setActiveModal("location")}
          className="bg-[#1e1e24] border border-white/5 hover:border-[#3b82f6]/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-300 text-center select-none active:scale-95 group h-28"
        >
          <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition duration-300">
            <MapPin className="w-5.5 h-5.5" />
          </div>
          <span className="text-[#f4f4f5] text-xs font-semibold">Localização</span>
          <span className="text-[10px] text-gray-500 leading-none">Cultos e Horários</span>
        </button>
      </div>

      {/* --- MODAL DIALOGS --- */}
      {activeModal && (
        <div id="modal-container-backdrop" className="fixed inset-0 bg-[#111115]/90 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div 
            id="modal-content-panel" 
            className="bg-[#1e1e24] w-full max-w-lg rounded-t-2xl sm:rounded-2xl border-t sm:border border-gray-800 flex flex-col max-h-[90vh] sm:max-h-[85vh] text-[#f4f4f5]"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800/60 flex items-center justify-between sticky top-0 bg-[#1e1e24] z-10">
              <div className="flex items-center gap-2">
                {activeModal === "pray" && <Hand className="w-5 h-5 text-blue-400" />}
                {activeModal === "tithe" && <Heart className="w-5 h-5 text-rose-500" />}
                {activeModal === "connect" && <Users className="w-5 h-5 text-blue-400" />}
                {activeModal === "location" && <MapPin className="w-5 h-5 text-emerald-400" />}
                <h3 className="font-semibold text-base leading-none">
                  {activeModal === "pray" && "Mural & Pedidos de Oração"}
                  {activeModal === "tithe" && "Dízimos, Ofertas e Contribuições"}
                  {activeModal === "connect" && "Cartão de Conexão RECON"}
                  {activeModal === "location" && "Nosso Endereço e Agendas"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-white p-1 hover:bg-zinc-800 rounded-full cursor-pointer transition text-xs font-semibold"
              >
                Fechar
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {/* 1. PRAYER MODAL */}
              {activeModal === "pray" && (
                <div id="modal-content-pray" className="space-y-5">
                  {/* Community feed */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400">Palavras do Mural de Fé</h4>
                    <div className="space-y-2.5">
                      {prayers.map((p) => (
                        <div key={p.id} className="bg-[#111115] p-3 rounded-lg border border-gray-800/50 flex class-prayer-row flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-xs text-blue-400">{p.nome}</span>
                            <span className="text-[10px] text-gray-500 font-mono bg-zinc-900 px-2 py-0.5 rounded-full">{p.categoria}</span>
                          </div>
                          <p className="text-gray-300 text-xs mt-1 leading-relaxed">{p.pedido}</p>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800/30">
                            <span className="text-[10px] text-gray-500 font-sans">{p.data}</span>
                            <button
                              onClick={() => handleSupportPrayer(p.id)}
                              className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer py-1 px-3.5 rounded-full border transition ${
                                p.apoiadoPorMim
                                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                  : "bg-[#1e1e24] border-gray-800 text-gray-400 hover:text-white"
                              }`}
                            >
                              <HeartHandshake className="w-3.5 h-3.5" />
                              <span>{p.apoiadoPorMim ? "Apoiado em Oração" : "Orar Junto"}</span>
                              <span className="ml-1 font-mono text-[10px] opacity-75">{p.apoiadores}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit pray form */}
                  <div className="bg-[#111115] p-4 rounded-xl border border-gray-800/80">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
                      <Send className="w-3 h-3 text-blue-400" />
                      Pedir Apoio da Igreja
                    </h4>
                    {prayerSubmitted ? (
                      <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-500/30 text-center animate-fadeIn">
                        <p className="text-xs text-blue-400 font-semibold mb-0.5">Seu pedido foi colocado no altar! 🙌</p>
                        <p className="text-[11px] text-gray-400">Nossa equipe de intercessão e pastores estarão de joelhos por você.</p>
                      </div>
                    ) : (
                      <form onSubmit={submitPrayerForm} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Seu Nome (Opcional)</label>
                            <input
                              type="text"
                              maxLength={35}
                              placeholder="Ficar anônimo"
                              value={newPrayer.nome}
                              onChange={(e) => setNewPrayer({ ...newPrayer, nome: e.target.value })}
                              className="w-full bg-[#1e1e24] text-xs px-3 py-2 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Categoria</label>
                            <select
                              value={newPrayer.categoria}
                              onChange={(e) => setNewPrayer({ ...newPrayer, categoria: e.target.value })}
                              className="w-full bg-[#1e1e24] text-xs px-3 py-2 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500 cursor-pointer"
                            >
                              <option value="Saúde / Cura">Saúde / Cura</option>
                              <option value="Família / Lar">Família / Lar</option>
                              <option value="Vida Profissional">Vida Profissional</option>
                              <option value="Agradecimento">Agradecimento</option>
                              <option value="Causas Difíceis">Causas Difíceis</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Qual o seu pedido de oração?</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Escreva aqui onde você necessita que a igreja erga um clamor..."
                            value={newPrayer.pedido}
                            onChange={(e) => setNewPrayer({ ...newPrayer, pedido: e.target.value })}
                            className="w-full bg-[#1e1e24] text-xs px-3 py-2 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500 resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-xs font-semibold transition cursor-pointer"
                        >
                          Publicar Pedido de Clamor
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* 2. TITHE MODAL */}
              {activeModal === "tithe" && (
                <div id="modal-content-tithe" className="space-y-5">
                  <div className="text-center space-y-1.5">
                    <p className="text-xs text-gray-400 leading-relaxed px-4">
                      "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."
                    </p>
                    <p className="text-[10px] text-rose-400 font-mono tracking-wider uppercase">— 2 Coríntios 9:7</p>
                  </div>

                  {/* Purpose Selector */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Finalidade da Contribuição</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["Dízimo", "Oferta", "Missões", "Social"].map((tp) => (
                        <button
                          key={tp}
                          type="button"
                          onClick={() => setDonationType(tp)}
                          className={`py-1.5 px-1 rounded-lg text-center text-xs cursor-pointer font-medium transition ${
                            donationType === tp
                              ? "bg-rose-950/40 border border-rose-500/50 text-rose-400"
                              : "bg-[#111115] border border-gray-800 text-gray-400 hover:text-white"
                          }`}
                        >
                          {tp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simple Value grid */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Selecione ou Insira um Valor</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["30", "50", "100", "200"].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setDonationValue(v);
                            setCustomValue("");
                          }}
                          className={`py-2 rounded-lg text-center font-mono text-xs cursor-pointer transition ${
                            donationValue === v && !customValue
                              ? "bg-blue-950/40 border border-blue-500/50 text-blue-400"
                              : "bg-[#111115] border border-gray-800 text-gray-400 hover:text-white"
                          }`}
                        >
                          R$ {v}
                        </button>
                      ))}
                    </div>
                    {/* Custom input */}
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-mono">Outro Valor: R$</span>
                      <input
                        type="number"
                        placeholder="0,00"
                        value={customValue}
                        onChange={(e) => {
                          setCustomValue(e.target.value);
                          setDonationValue(e.target.value);
                        }}
                        className="w-full bg-[#111115] text-xs pl-28 pr-4 py-2.5 rounded-lg border border-gray-800 outline-none text-[#f4f4f5] focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* PIX Mock screen */}
                  <div className="bg-[#111115] p-4 rounded-xl border border-gray-800/80 flex flex-col items-center text-center space-y-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#f4f4f5] font-semibold bg-zinc-950 px-3 py-1 rounded-full border border-gray-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Contribuição Segura via PIX
                    </div>

                    {/* Faux QR Code Grid */}
                    <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-2 border-2 border-dashed border-gray-300 animate-pulse.no" />
                      <div className="grid grid-cols-6 gap-0.5 w-full h-full opacity-90">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              (i % 3 === 0 || i % 4 === 1 || i < 10 || i > 28 || (i > 15 && i < 22)) && i !== 12 && i !== 24
                                ? "bg-zinc-900"
                                : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Escaneie o QR Code acima ou copie a chave PIX:</p>
                      <span className="inline-block bg-[#1e1e24] px-3.5 py-1.5 rounded-lg text-xs font-mono border border-gray-800 text-blue-400 select-all">
                        {pixKey}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="inline-flex items-center justify-center gap-2 py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-xs font-semibold transition cursor-pointer select-none active:scale-95"
                    >
                      {pixCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" />
                          <span>Chave Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Chave CNPJ / E-mail</span>
                        </>
                      )}
                    </button>
                    
                    <p className="text-[10px] text-gray-500">
                      Dízimo destinado a: <strong className="text-gray-300">{donationType}</strong> no valor de <strong className="text-gray-300">R$ {donationValue || "0.00"}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. CONNECT MODAL */}
              {activeModal === "connect" && (
                <div id="modal-content-connect" className="space-y-5">
                  <div className="text-center space-y-1.5">
                    <p className="text-xs text-gray-400">
                      Queremos caminhar com você! Complete nosso Cartão de Conexão. Seja para conhecer lideranças ou voluntariados.
                    </p>
                  </div>

                  {connectSubmitted ? (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-xl text-center space-y-2 animate-fadeIn">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-sm text-[#f4f4f5]">Cadastro Efetuado com Sucesso!</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Que alegria! Já repassamos seus dados ao líder do ministério ou Pequeno Grupo da RECON. Entraremos em contato via WhatsApp muito em breve. Deus te abençoe!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={submitConnectionForm} className="space-y-4">
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Nome Completo</label>
                          <input
                            type="text"
                            required
                            placeholder="Seu nome"
                            value={connectCard.nome}
                            onChange={(e) => setConnectCard({ ...connectCard, nome: e.target.value })}
                            className="w-full bg-[#111115] text-xs px-3.5 py-2.5 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">WhatsApp / Celular</label>
                            <input
                              type="tel"
                              required
                              placeholder="(11) 99999-9999"
                              value={connectCard.telefone}
                              onChange={(e) => setConnectCard({ ...connectCard, telefone: e.target.value })}
                              className="w-full bg-[#111115] text-xs px-3.5 py-2.5 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">E-mail</label>
                            <input
                              type="email"
                              placeholder="exemplo@email.com"
                              value={connectCard.email}
                              onChange={(e) => setConnectCard({ ...connectCard, email: e.target.value })}
                              className="w-full bg-[#111115] text-xs px-3.5 py-2.5 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Onde você gostaria de se engajar?</label>
                          <select
                            value={connectCard.interesse}
                            onChange={(e) => setConnectCard({ ...connectCard, interesse: e.target.value })}
                            className="w-full bg-[#111115] text-xs px-3.5 py-2.5 rounded-lg border border-gray-850 outline-none text-[#f4f4f5] focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Célula (Pequeno Grupo)">Participar de uma Célula (Pequeno Grupo)</option>
                            <option value="Quero me Batizar">Quero me Batizar / Aceitar Jesus</option>
                            <option value="Curso de Integração">Realizar Curso de Novo Membro</option>
                            <option value="Voluntariado / Mídia">Ser Voluntário (Comunicação, Mídia, Sons, Infantil)</option>
                            <option value="Pedido de Visita">Gostaria de receber uma Visita / Aconselhamento</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Sua Mensagem ou Intenção (Opcional)</label>
                          <textarea
                            rows={2}
                            placeholder="Escreva como podemos orar por você ou qual sua dúvida..."
                            value={connectCard.mensagem}
                            onChange={(e) => setConnectCard({ ...connectCard, mensagem: e.target.value })}
                            className="w-full bg-[#111115] text-xs px-3.5 py-2.5 rounded-lg border border-gray-855 outline-none text-[#f4f4f5] focus:border-blue-500 resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Enviar Cartão de Conexão ao Ministério
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 4. LOCATION MODAL */}
              {activeModal === "location" && (
                <div id="modal-content-location" className="space-y-5">
                  {/* Mock Map Layout */}
                  <div className="w-full aspect-video bg-[#111115] rounded-xl border border-gray-800 overflow-hidden relative flex flex-col items-center justify-center p-3 select-none">
                    {/* Simulated visual grid representing mapped streets */}
                    <div className="absolute inset-0 bg-[#111115] opacity-80 grid grid-cols-8 gap-0.5 pointer-events-none">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-zinc-900 border-dashed" />
                      ))}
                    </div>
                    {/* Faux mapped street block overlay */}
                    <div className="absolute w-28 h-2 bg-zinc-800 rotate-15 left-5 top-8 rounded-full" />
                    <div className="absolute w-36 h-2.5 bg-zinc-800 -rotate-30 right-5 bottom-12 rounded-full" />
                    <div className="absolute w-2 h-24 bg-zinc-800 right-1/3 top-2 rounded-full" />
                    {/* Pulsing Pin locator */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 shadow-xl">
                        <MapPin className="w-6 h-6 text-emerald-400 animate-bounce" />
                      </div>
                      <div className="bg-[#1e1e24] px-2.5 py-1 rounded-md text-[10px] font-semibold border border-gray-800 mt-2 text-emerald-400 uppercase tracking-widest shadow-md">
                        RECON Matriz
                      </div>
                    </div>
                  </div>

                  {/* Informative text about schedule */}
                  <div className="space-y-3.5 bg-[#111115] p-4 rounded-xl border border-gray-800">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-gray-300">Localização Física</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Av. Paulista, 1000 — Edifício Reconciliação — Bela Vista, São Paulo - SP, CEP 01310-100
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-850 my-1 pt-3 flex items-start gap-2.5">
                      <Calendar className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-gray-300">Cultos Presenciais e de Célula</h4>
                        <ul className="text-xs text-gray-400 space-y-1 mt-1 leading-snug">
                          <li>• <strong className="text-gray-300">Culto de Celebração:</strong> Domingos às 10h e 18h</li>
                          <li>• <strong className="text-gray-300">Quarta de Avivamento:</strong> Quartas às 19h30</li>
                          <li>• <strong className="text-gray-300">Células nos Lares:</strong> Quinta-feira a Sábado nos bairros</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* External maps actions */}
                  <div className="flex gap-2">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-xs font-semibold transition cursor-pointer text-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Rotas Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
