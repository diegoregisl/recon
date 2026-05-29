export interface CarouselSlide {
  slide_numero: number;
  titulo: string;
  texto: string;
}

export interface Devotional {
  titulo: string;
  versiculo_base: string;
  reflexao: string;
  oracao_guiada: string;
}

export interface SermonAnalysisResult {
  carrossel: CarouselSlide[];
  devocional: Devotional;
  legenda_instagram: string;
}

export interface ChurchEvent {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  detalhes: string;
  local: string;
  tag: string;
}

export interface PrayerRequest {
  id: string;
  nome: string;
  pedido: string;
  categoria: string;
  data: string;
  apoiadores: number;
  apoiadoPorMim?: boolean;
}

export interface ConnectionCard {
  nome: string;
  telefone: string;
  email: string;
  interesse: string;
  mensagem?: string;
}
