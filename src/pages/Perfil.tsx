import { useState, useEffect } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { supabase, Planta } from '../lib/supabase';

export default function Perfil() {
  const [selectedPlant, setSelectedPlant] = useState<Planta | null>(null);
  const [activeTab, setActiveTab] = useState('plantando');

  useEffect(() => {
    loadFeaturedPlant();
  }, []);

  const loadFeaturedPlant = async () => {
    const { data } = await supabase
      .from('plantas')
      .select('*')
      .eq('nome', 'Pitanga')
      .maybeSingle();

    if (data) setSelectedPlant(data);
  };

  const tabs = [
    { id: 'plantando', label: 'ESTOU PLANTANDO/JÁ PLANTEI' },
    { id: 'acompanhar', label: 'ACOMPANHAR CRESCIMENTO' },
    { id: 'mapa', label: 'MAPA DE PLANTIO' },
    { id: 'dicas', label: 'DICAS' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8]">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-8">
          <h2
            className="text-6xl font-light text-[#E86D47]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            PERFIL
          </h2>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              localStorage.removeItem('tipo_usuario');
              alert('Sessão encerrada');
            }}
            className="bg-[#E86D47] text-white px-6 py-3 rounded-full hover:bg-[#D85D37] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            SAIR
          </button>
        </div>

        <div className="bg-[#3B5A5E] rounded-2xl mb-8 shadow-lg overflow-hidden">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[200px] px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#2A4548] text-white'
                    : 'text-[#F5F1E8] hover:bg-[#2A4548]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="relative">
            {selectedPlant && (
              <div className="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-[#E86D47] transition-all duration-500 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-56 h-64 mx-auto mb-6 rounded-3xl overflow-hidden bg-gray-50 shadow-inner">
                    <img
                      src={selectedPlant.imagem_url || ''}
                      alt={selectedPlant.nome}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3
                    className="text-3xl font-medium text-[#3B5A5E] mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {selectedPlant.nome}
                  </h3>
                  <p className="text-[#5A7C5E] italic text-lg">{selectedPlant.nome_cientifico}</p>
                </div>
              </div>
            )}

            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block">
              <ArrowRight className="w-16 h-16 text-[#E86D47] animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-[#E86D47] px-8 py-3 rounded-full shadow-lg">
                <span className="text-white font-medium tracking-wide">FICHA TÉCNICA</span>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 pt-16 shadow-xl border-4 border-[#E86D47]">
              {selectedPlant && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#F5F1E8] to-white p-6 rounded-3xl border-2 border-[#A8C686]/30">
                    <p className="text-[#4A3933] leading-relaxed mb-4">
                      <span className="text-[#E86D47] font-medium">🌿 Curiosidade:</span>{' '}
                      {selectedPlant.descricao}
                    </p>

                    <div className="space-y-3 mt-4">
                      {selectedPlant.caracteristicas.map((carac, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-[#A8C686] text-lg mt-1">✓</span>
                          <p className="text-[#4A3933] text-sm leading-relaxed">{carac}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#A8C686]/10 p-6 rounded-3xl">
                    <h4 className="text-[#3B5A5E] font-medium mb-3 text-lg">Habitat Natural</h4>
                    <p className="text-[#4A3933] text-sm leading-relaxed">
                      Nativa da Mata Atlântica, cresce bem em diferentes condições de solo e
                      clima.
                    </p>
                  </div>

                  <div className="bg-[#E86D47]/10 p-6 rounded-3xl">
                    <h4 className="text-[#3B5A5E] font-medium mb-3 text-lg">Cuidados</h4>
                    <p className="text-[#4A3933] text-sm leading-relaxed">
                      Requer solo bem drenado e regas regulares nos primeiros meses. Resistente
                      após estabelecida.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-end max-w-6xl mx-auto">
          <div className="relative">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-4 border-2 border-[#A8C686]/30 shadow-lg">
              <User className="w-12 h-12 text-[#5A7C5E]" />
              <div className="w-24 h-16 bg-[#A8C686]/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
