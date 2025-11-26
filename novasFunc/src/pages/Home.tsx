import { useEffect, useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { supabase, Planta, AreaPlantio } from '../lib/supabase';

export default function Home() {
  const [featuredPlant, setFeaturedPlant] = useState<Planta | null>(null);
  const [featuredArea, setFeaturedArea] = useState<AreaPlantio | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: plants } = await supabase
      .from('plantas')
      .select('*')
      .eq('nome', 'Pitanga')
      .maybeSingle();

    if (plants) setFeaturedPlant(plants);

    const { data: area } = await supabase
      .from('areas_plantio')
      .select('*')
      .eq('nome', 'Parque Moscoso')
      .maybeSingle();

    if (area) setFeaturedArea(area);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3B5A5E] to-[#2A4548]">
      <div className="container mx-auto px-6 py-12">
        <div className="bg-[#F5F1E8] rounded-3xl p-12 shadow-2xl mb-12">
          <h2 className="text-4xl font-light text-center mb-8 text-[#3B5A5E]" style={{ fontFamily: 'Georgia, serif' }}>
            PROJETO FLORESCER
          </h2>

          <div className="max-w-4xl mx-auto text-[#4A3933] leading-relaxed space-y-4">
            <p className="text-lg">
              <span className="inline-block mr-2">🌱</span>
              <strong>O FLORESCER NASCE A PARTIR DE UMA REFLEXÃO ESSENCIAL:</strong> DE QUE MANEIRA PODEMOS CONTRIBUIR PARA MUDAR O PLANETA?
            </p>
            <p>
              Este projeto tem como objetivo <strong>RAPIDINHO</strong>, reduzir o paísado de casa começou na atmosfera, promovendo o plantio de mudas nativas específicas de cada região do país. Ao fazer isso, <strong>BUSCAMOS NÃO APENAS REVERTER A DEGRADAÇÃO DAS MUDANÇAS CLIMÁTICAS</strong>, mas também para a população das origens das áreas verdes nas metrópoles espalhados pelo Brasil.
            </p>
            <p>
              Com foco em <strong>SUSTENTABILIDADE E RESPEITO À BIODIVERSIDADE LOCAL</strong>, o Florescer visa transformar nossas cidades em espaços mais verdes e saudáveis, <strong>RECICLANDO UM AMBIENTE EQUILIBRADO PARA AS FUTURAS GERAÇÕES</strong>. 🌿
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative group">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-[#A8C686] px-8 py-3 rounded-full shadow-lg">
                <span className="text-[#F5F1E8] font-medium tracking-wide text-lg">BROTINHOS</span>
              </div>
            </div>

            <div className="bg-[#F5F1E8] rounded-[3rem] p-8 pt-16 shadow-xl border-4 border-[#E86D47] transition-all duration-500 hover:shadow-2xl hover:scale-105">
              {featuredPlant && (
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-white shadow-inner">
                    <img
                      src={featuredPlant.imagem_url || ''}
                      alt={featuredPlant.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-medium text-[#3B5A5E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {featuredPlant.nome}
                  </h3>
                  <p className="text-[#5A7C5E] italic">{featuredPlant.nome_cientifico}</p>
                </div>
              )}
            </div>

            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block">
              <ArrowRight className="w-16 h-16 text-[#E86D47] animate-pulse" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-[#A8C686] px-8 py-3 rounded-full shadow-lg">
                <span className="text-[#F5F1E8] font-medium tracking-wide text-lg">ÁREAS DE PLANTIO</span>
              </div>
            </div>

            <div className="bg-[#F5F1E8] rounded-[3rem] p-8 pt-16 shadow-xl border-4 border-[#E86D47] transition-all duration-500 hover:shadow-2xl hover:scale-105">
              {featuredArea && (
                <div className="text-center">
                  <div className="w-64 h-40 mx-auto mb-6 rounded-3xl overflow-hidden shadow-inner">
                    <img
                      src={featuredArea.imagem_url || ''}
                      alt={featuredArea.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-medium text-[#3B5A5E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {featuredArea.nome}
                  </h3>
                  <p className="text-[#5A7C5E]">{featuredArea.localizacao}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-start max-w-6xl mx-auto">
          <div className="relative">
            <div className="bg-[#F5F1E8]/20 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-4 border-2 border-[#A8C686]/30">
              <User className="w-12 h-12 text-[#A8C686]" />
              <div className="w-24 h-16 bg-[#A8C686]/20 rounded-2xl"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-12 opacity-20">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <path
              d="M100 20 Q120 60, 140 100 T180 180"
              stroke="#E86D47"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
