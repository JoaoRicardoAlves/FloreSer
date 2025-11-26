import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Planta {
  id: string;
  nome: string;
  nome_cientifico: string;
  descricao: string | null;
  imagem_url: string | null;
  caracteristicas: string[];
  curiosidades: string | null;
  created_at: string;
}

export interface Usuario {
  id: string;
  nome: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Plantio {
  id: string;
  usuario_id: string;
  planta_id: string;
  data_plantio: string;
  local: string | null;
  status: string;
  observacoes: string | null;
  created_at: string;
  planta?: Planta;
}

export interface AreaPlantio {
  id: string;
  nome: string;
  localizacao: string;
  descricao: string | null;
  imagem_url: string | null;
  created_at: string;
}

export interface Publicacao {
  id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  imagem_capa_url: string | null;
  visualizacoes: number;
  created_at: string;
  updated_at: string;
}
