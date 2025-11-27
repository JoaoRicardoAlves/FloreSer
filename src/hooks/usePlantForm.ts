// src/hooks/usePlantForm.ts
import { useState, FormEvent, ChangeEvent } from 'react';
import { plantService } from '../services/plantService';

// Define o formato dos dados do formulário
interface PlantFormData {
  nome: string;
  nomeCientifico: string;
  descricao: string;
  caracteristicasTexto: string;
  curiosidades: string;
}

const INITIAL_FORM_STATE: PlantFormData = {
  nome: '',
  nomeCientifico: '',
  descricao: '',
  caracteristicasTexto: '',
  curiosidades: ''
};

export function usePlantForm(onSuccess: () => void) {
  const [formData, setFormData] = useState<PlantFormData>(INITIAL_FORM_STATE);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função genérica para atualizar os inputs de texto
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para pegar o arquivo de imagem
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagemFile(e.target.files[0]);
    }
  };

  // Função que envia o formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Iniciando cadastro de planta...', formData);

    try {
      let imagem_url: string | null = null;

      // Se tiver imagem, faz o upload primeiro
      if (imagemFile) {
        imagem_url = await plantService.uploadImage(imagemFile);
      }

      const caracteristicasArray = formData.caracteristicasTexto
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      // Salva os dados no banco usando o Service que criamos
      await plantService.create({
        nome: formData.nome,
        nome_cientifico: formData.nomeCientifico,
        descricao: formData.descricao || null,
        imagem_url,
        caracteristicas: caracteristicasArray,
        curiosidades: formData.curiosidades || null,
      });

      // Limpa o formulário
      setFormData(INITIAL_FORM_STATE);
      setImagemFile(null);
      alert('Planta cadastrada com sucesso!');
      onSuccess(); // Atualiza a lista na tela principal

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      console.error(err);
      console.error('Erro no hook usePlantForm:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    loading,
    error
  };
}
