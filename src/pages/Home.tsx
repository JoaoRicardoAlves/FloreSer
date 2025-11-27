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
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="bg-[#F5F1E8] rounded-3xl p-6 md:p-12 shadow-2xl mb-12 relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-6 md:mb-8 text-[#3B5A5E]" style={{ fontFamily: 'Georgia, serif' }}>
            PROJETO FLORESCER
          </h2>

          <div className="max-w-4xl mx-auto text-[#4A3933] leading-relaxed space-y-4 text-sm md:text-base">
            <p className="text-base md:text-lg">
              <span className="inline-block mr-2">🌱</span>
              <strong>O Florescer nasce de uma reflexão essencial:</strong> como podemos contribuir, de forma real, para transformar o planeta?
            </p>
            <p>
              Nosso propósito é reduzir os impactos ambientais e recuperar áreas degradadas por meio do plantio de mudas nativas, respeitando as características de cada região do país. Assim, buscamos não apenas combater os efeitos das mudanças climáticas, mas também restaurar a presença de áreas verdes nas metrópoles e incentivar uma relação mais harmoniosa entre pessoas e natureza.
            </p>
            <p>
              Com foco em <strong>sustentabilidade e preservação da biodiversidade</strong>, o Florescer visa transformar nossas cidades em lugares mais saudáveis, verdes e acolhedores — cultivando um ambiente equilibrado para as futuras gerações. 🌿
            </p>
          </div>

          <div className="absolute top-4 right-4 md:top-20 md:right-12 opacity-20 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 200 200" className="md:w-[200px] md:h-[200px]">
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

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="relative group">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10 w-full text-center">
              <div className="bg-[#A8C686] px-6 py-2 md:px-8 md:py-3 rounded-full shadow-lg inline-block">
                <span className="text-[#F5F1E8] font-medium tracking-wide text-sm md:text-lg">BROTINHOS</span>
              </div>
            </div>

            <div className="bg-[#F5F1E8] rounded-[2rem] md:rounded-[3rem] p-6 pt-12 md:p-8 md:pt-16 shadow-xl border-4 border-[#E86D47] transition-all duration-500 hover:shadow-2xl hover:scale-105">
              {featuredPlant && (
                <div className="text-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-4 md:mb-6 rounded-full overflow-hidden bg-white shadow-inner">
                    <img
                      src={featuredPlant.imagem_url || ''}
                      alt={featuredPlant.nome}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium text-[#3B5A5E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {featuredPlant.nome}
                  </h3>
                  <p className="text-[#5A7C5E] italic text-sm md:text-base">{featuredPlant.nome_cientifico}</p>
                </div>
              )}
            </div>

            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block">
              <ArrowRight className="w-16 h-16 text-[#E86D47] animate-pulse" />
            </div>
          </div>

          <div className="relative group mt-8 md:mt-0">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10 w-full text-center">
              <div className="bg-[#A8C686] px-6 py-2 md:px-8 md:py-3 rounded-full shadow-lg inline-block">
                <span className="text-[#F5F1E8] font-medium tracking-wide text-sm md:text-lg">ÁREAS DE PLANTIO</span>
              </div>
            </div>

            <div className="bg-[#F5F1E8] rounded-[2rem] md:rounded-[3rem] p-6 pt-12 md:p-8 md:pt-16 shadow-xl border-4 border-[#E86D47] transition-all duration-500 hover:shadow-2xl hover:scale-105">
              {featuredArea && (
                <div className="text-center">
                  <div className="w-full h-32 md:w-64 md:h-40 mx-auto mb-4 md:mb-6 rounded-3xl overflow-hidden shadow-inner">
                    <img
                      src={featuredArea.imagem_url || ''}
                      alt={featuredArea.nome}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium text-[#3B5A5E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {featuredArea.nome}
                  </h3>
                  <p className="text-[#5A7C5E] text-sm md:text-base">{featuredArea.localizacao}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex justify-start max-w-6xl mx-auto">
          <div className="relative">
            <div className="bg-[#F5F1E8]/20 backdrop-blur-sm rounded-3xl p-4 md:p-6 flex items-center gap-4 border-2 border-[#A8C686]/30">
              <User className="w-10 h-10 md:w-12 md:h-12 text-[#A8C686]" />
              <div className="w-16 h-12 md:w-24 md:h-16 bg-[#A8C686]/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
