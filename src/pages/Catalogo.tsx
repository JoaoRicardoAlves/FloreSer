
import { useEffect, useState } from 'react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, Planta } from '../lib/supabase';

export default function Catalogo() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Planta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlantas();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPlant(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    if (selectedPlant) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [selectedPlant, plantas]);

  const loadPlantas = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('plantas')
        .select('*')
        .order('nome');
      if (error) throw error;
      setPlantas(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao carregar catálogo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedPlant || plantas.length === 0) return;
    const currentIndex = plantas.findIndex(p => p.id === selectedPlant.id);
    const prevIndex = currentIndex === 0 ? plantas.length - 1 : currentIndex - 1;
    setSelectedPlant(plantas[prevIndex]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedPlant || plantas.length === 0) return;
    const currentIndex = plantas.findIndex(p => p.id === selectedPlant.id);
    const nextIndex = currentIndex === plantas.length - 1 ? 0 : currentIndex + 1;
    setSelectedPlant(plantas[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8]">
      <div className="container mx-auto px-6 py-12">
        <h2
          className="text-6xl font-light text-center mb-4 text-[#E86D47]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          CATÁLOGO
        </h2>

        <p className="text-center text-[#5A7C5E] text-xl mb-12 italic">
          "Do clique ao canteiro: cultive o futuro agora."
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {loading && (
            <div className="col-span-2 md:col-span-3 text-center text-[#5A7C5E]">Carregando...</div>
          )}
          {error && (
            <div className="col-span-2 md:col-span-3 text-center text-[#E86D47]" role="alert" aria-live="polite">{error}</div>
          )}
          {!loading && !error && plantas.map((planta) => (
            <div
              key={planta.id}
              onClick={() => setSelectedPlant(planta)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-10"
            >
              <div className="bg-white rounded-[3rem] p-6 border-4 border-[#E86D47] shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="w-32 h-40 mx-auto mb-4 rounded-3xl overflow-hidden bg-gray-50">
                  <img
                    src={planta.imagem_url || ''}
                    alt={planta.nome}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3
                  className="text-center text-xl text-[#4A3933] font-medium"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {planta.nome}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-start max-w-5xl mx-auto">
          <div className="relative">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-4 border-2 border-[#A8C686]/30 shadow-lg">
              <User className="w-12 h-12 text-[#5A7C5E]" />
              <div className="w-24 h-16 bg-[#A8C686]/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {selectedPlant && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedPlant(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="plant-modal-title"
        >
          <div
            className="bg-[#F5F1E8] rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform transition-all duration-300 scale-100 relative flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePrev}
              className="absolute left-[-3rem] md:left-[-4rem] bg-white/80 p-2 rounded-full hover:bg-white transition-colors text-[#E86D47]"
              aria-label="Anterior"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-[-3rem] md:right-[-4rem] bg-white/80 p-2 rounded-full hover:bg-white transition-colors text-[#E86D47]"
              aria-label="Próximo"
            >
              <ChevronRight size={32} />
            </button>

            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-4 right-4 bg-[#E86D47] text-white px-3 py-1 rounded-full text-sm hover:bg-[#D85D37] z-10"
              aria-label="Fechar"
            >
              Fechar
            </button>

            <div className="flex flex-col gap-6 w-full">
              <div className="flex gap-8 w-full">
                <div className="w-48 h-56 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={selectedPlant.imagem_url || ''}
                    alt={selectedPlant.nome}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3
                    className="text-3xl font-medium text-[#3B5A5E] mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                    id="plant-modal-title"
                  >
                    {selectedPlant.nome}
                  </h3>
                  <p className="text-[#5A7C5E] italic mb-4">{selectedPlant.nome_cientifico}</p>

                  <div className="space-y-3 text-[#4A3933]">
                    {selectedPlant.caracteristicas.map((carac, index) => (
                      <p key={index} className="flex items-start gap-2">
                        <span className="text-[#A8C686] mt-1">🌿</span>
                        <span className="text-sm leading-relaxed">{carac}</span>
                      </p>
                    ))}
                  </div>

                  {selectedPlant.curiosidades && (
                    <div className="mt-4 pt-4 border-t border-[#A8C686]/30">
                      <p className="text-sm text-[#5A7C5E] italic">{selectedPlant.curiosidades}</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setSelectedPlant(null)}
                      className="flex-1 border border-[#E86D47] text-[#E86D47] py-3 rounded-full hover:bg-[#FDE5DC] transition-colors duration-300 font-medium"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={() => {
                        window.location.hash = `#/adocao?id=${selectedPlant.id}`;
                      }}
                      className="flex-1 bg-[#E86D47] text-white py-3 rounded-full hover:bg-[#D85D37] transition-colors duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Adotar Planta
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-3 px-1">
                  {plantas.map((p) => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlant(p);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ${selectedPlant.id === p.id
                        ? 'ring-4 ring-[#E86D47] scale-110 z-10'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                        } `}
                    >
                      <img
                        src={p.imagem_url || ''}
                        alt={p.nome}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

