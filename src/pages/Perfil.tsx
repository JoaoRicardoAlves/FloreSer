import { useState, useEffect } from 'react';
import { ArrowRight, User, MapPin, Calendar, Sprout, BookOpen, ArrowLeft } from 'lucide-react';
import { supabase, Planta, Plantio, AreaPlantio, Publicacao } from '../lib/supabase';

export default function Perfil() {
  const [activeTab, setActiveTab] = useState('plantando');
  const [userPlantings, setUserPlantings] = useState<Plantio[]>([]);
  const [areas, setAreas] = useState<AreaPlantio[]>([]);
  const [tips, setTips] = useState<Publicacao[]>([]);
  const [selectedPlanting, setSelectedPlanting] = useState<Plantio | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch User Plantings with Plant details
        const { data: plantingsData } = await supabase
          .from('plantios')
          .select('*, planta:plantas(*)')
          .eq('usuario_id', user.id);
        
        if (plantingsData) setUserPlantings(plantingsData);
      }

      // Fetch Areas
      const { data: areasData } = await supabase
        .from('areas_plantio')
        .select('*');
      if (areasData) setAreas(areasData);

      // Fetch Tips (Publicacoes)
      const { data: tipsData } = await supabase
        .from('publicacoes')
        .select('*')
        .limit(10);
      if (tipsData) setTips(tipsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (dateString: string) => {
    const start = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tabs = [
    { id: 'plantando', label: 'ESTOU PLANTANDO/JÁ PLANTEI' },
    { id: 'acompanhar', label: 'ACOMPANHAR CRESCIMENTO' },
    { id: 'mapa', label: 'MAPA DE PLANTIO' },
    { id: 'dicas', label: 'DICAS' },
  ];

  const renderPlantingDetails = (planting: Plantio) => {
    const plant = planting.planta!;
    return (
      <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto animate-fadeIn">
        <div className="relative">
          <button 
            onClick={() => {
              setViewMode('list');
              setSelectedPlanting(null);
            }}
            className="absolute -top-12 left-0 flex items-center gap-2 text-[#3B5A5E] hover:text-[#E86D47] transition-colors"
          >
            <ArrowLeft size={20} /> Voltar para lista
          </button>

          <div className="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-[#E86D47] transition-all duration-500 hover:shadow-2xl">
            <div className="text-center">
              <div className="w-56 h-64 mx-auto mb-6 rounded-3xl overflow-hidden bg-gray-50 shadow-inner">
                <img
                  src={plant.imagem_url || ''}
                  alt={plant.nome}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3
                className="text-3xl font-medium text-[#3B5A5E] mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {plant.nome}
              </h3>
              <p className="text-[#5A7C5E] italic text-lg">{plant.nome_cientifico}</p>
              <div className="mt-4 inline-block bg-[#E86D47]/10 px-4 py-2 rounded-full">
                <p className="text-[#E86D47] text-sm font-medium">
                  Plantado em: {new Date(planting.data_plantio).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-[#E86D47] px-8 py-3 rounded-full shadow-lg">
              <span className="text-white font-medium tracking-wide">FICHA TÉCNICA</span>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 pt-16 shadow-xl border-4 border-[#E86D47]">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#F5F1E8] to-white p-6 rounded-3xl border-2 border-[#A8C686]/30">
                <p className="text-[#4A3933] leading-relaxed mb-4">
                  <span className="text-[#E86D47] font-medium">🌿 Curiosidade:</span>{' '}
                  {plant.descricao}
                </p>

                <div className="space-y-3 mt-4">
                  {plant.caracteristicas?.map((carac, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[#A8C686] text-lg mt-1">✓</span>
                      <p className="text-[#4A3933] text-sm leading-relaxed">{carac}</p>
                    </div>
                  ))}
                </div>
              </div>

              {planting.observacoes && (
                <div className="bg-[#A8C686]/10 p-6 rounded-3xl">
                  <h4 className="text-[#3B5A5E] font-medium mb-3 text-lg">Minhas Observações</h4>
                  <p className="text-[#4A3933] text-sm leading-relaxed">
                    {planting.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-12 text-[#3B5A5E]">Carregando...</div>;
    }

    switch (activeTab) {
      case 'plantando':
        if (viewMode === 'details' && selectedPlanting) {
          return renderPlantingDetails(selectedPlanting);
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPlantings.map((planting) => (
              <div 
                key={planting.id}
                onClick={() => {
                  setSelectedPlanting(planting);
                  setViewMode('details');
                }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-[#A8C686]"
              >
                <div className="h-48 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={planting.planta?.imagem_url || ''} 
                    alt={planting.planta?.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#3B5A5E] mb-2">{planting.planta?.nome}</h3>
                <p className="text-[#5A7C5E] text-sm mb-4">{planting.local}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(planting.data_plantio).toLocaleDateString()}</span>
                  <span className="bg-[#A8C686]/20 text-[#3B5A5E] px-3 py-1 rounded-full">
                    {planting.status}
                  </span>
                </div>
              </div>
            ))}
            {userPlantings.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl">
                <Sprout className="w-16 h-16 text-[#A8C686] mx-auto mb-4" />
                <p className="text-[#3B5A5E] text-lg">Você ainda não tem plantios registrados.</p>
              </div>
            )}
          </div>
        );

      case 'acompanhar':
        return (
          <div className="space-y-6">
            {userPlantings.map((planting) => (
              <div key={planting.id} className="bg-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={planting.planta?.imagem_url || ''} 
                    alt={planting.planta?.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#3B5A5E]">{planting.planta?.nome}</h3>
                      <p className="text-[#5A7C5E]">{planting.local}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-[#E86D47]">{calculateDays(planting.data_plantio)}</span>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Dias plantado</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-[#A8C686] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(calculateDays(planting.data_plantio), 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Plantio</span>
                    <span>Crescimento</span>
                  </div>
                </div>
              </div>
            ))}
            {userPlantings.length === 0 && (
              <div className="text-center py-12 bg-white/50 rounded-3xl">
                <p className="text-[#3B5A5E] text-lg">Nenhum plantio para acompanhar.</p>
              </div>
            )}
          </div>
        );

      case 'mapa':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map((area) => (
              <div key={area.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={area.imagem_url || ''} 
                    alt={area.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{area.nome}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-[#E86D47] mt-1 flex-shrink-0" />
                    <p className="text-[#5A7C5E]">{area.localizacao}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.descricao}</p>
                </div>
              </div>
            ))}
            {areas.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl">
                <p className="text-[#3B5A5E] text-lg">Nenhuma área de plantio encontrada.</p>
              </div>
            )}
          </div>
        );

      case 'dicas':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-3xl p-6 shadow-lg border-l-8 border-[#E86D47]">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-[#E86D47]" />
                  <h3 className="text-lg font-bold text-[#3B5A5E]">{tip.titulo}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tip.conteudo}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Por {tip.autor}</span>
                  <span>{new Date(tip.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {tips.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl">
                <p className="text-[#3B5A5E] text-lg">Nenhuma dica disponível no momento.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
                onClick={() => {
                  setActiveTab(tab.id);
                  setViewMode('list');
                  setSelectedPlanting(null);
                }}
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

        {renderContent()}

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
