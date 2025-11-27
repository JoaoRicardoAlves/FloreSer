// src/services/plantService.ts
import { supabase, Planta } from '../lib/supabase';

const BUCKET_NAME = 'plantas';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const plantService = {
  // 1. Busca todas as plantas ordenadas por nome
  async getAll(): Promise<Planta[]> {
    const { data, error } = await supabase
      .from('plantas')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar plantas:', error);
      throw new Error(`Erro ao buscar plantas: ${error.message}`);
    }
    return data || [];
  },

  // 2. Faz o upload da imagem e retorna a URL pública
  async uploadImage(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo inválido: selecione uma imagem.');
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('Imagem muito grande: limite de 5MB.');
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Erro no upload da imagem:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  // 3. Cria o registro da planta no banco de dados
  async create(plantData: Omit<Planta, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('plantas')
      .insert(plantData);

    if (error) {
      console.error('Erro ao salvar planta no banco:', error);
      throw new Error(`Erro ao salvar planta: ${error.message}`);
    }
  }
};
