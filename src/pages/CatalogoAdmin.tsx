import { useEffect, useState } from "react";
import { User, Plus, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Planta, supabase } from "../lib/supabase";
import { plantService } from "../services/plantService";
import { usePlantForm } from "../hooks/usePlantForm";
import { useNavigation } from "../context/NavigationContext";

// Componentes menores para Modularidade (podem ser movidos para arquivos separados)
const PlantCard = ({ plant, onClick }: { plant: Planta; onClick: (p: Planta) => void }) => (
    <div
        onClick={() => onClick(plant)}
        className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
    >
        <div className="bg-white rounded-[3rem] p-6 border-4 border-[#E86D47] shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
            <div className="w-32 h-40 mx-auto mb-4 rounded-3xl overflow-hidden bg-gray-50 shrink-0">
                <img
                    src={plant.imagem_url || "/placeholder-plant.png"}
                    alt={plant.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                />
            </div>
            <h3 className="text-center text-xl text-[#4A3933] font-medium font-serif mt-auto">
                {plant.nome}
            </h3>
        </div>
    </div>
);

export default function CatalogoAdmin() {
    const [plantas, setPlantas] = useState<Planta[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<Planta | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { navigate } = useNavigation();

    // Hook customizado controla a lógica do formulário
    const {
        formData,
        handleInputChange,
        handleFileChange,
        handleSubmit,
        loading: formLoading,
        error: formError
    } = usePlantForm(() => {
        setIsCreateOpen(false);
        loadPlantas();
    });

    const loadPlantas = async () => {
        try {
            const data = await plantService.getAll();
            setPlantas(data);
        } catch (error) {
            console.error("Falha ao carregar catálogo", error);
        }
    };

    useEffect(() => {
        const protect = async () => {
            const { data } = await supabase.auth.getSession();
            console.log('Session data:', data);
            const tipo = data.session?.user?.user_metadata?.tipo_usuario;
            console.log('User metadata type:', tipo);

            if (tipo !== 'admin') {
                console.log('Access denied: User is not admin');
                navigate('catalogo');
                return;
            }
            loadPlantas();
        };
        protect();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            const tipo = session?.user?.user_metadata?.tipo_usuario;
            if (tipo !== 'admin') {
                navigate('catalogo');
            }
        });
        return () => {
            sub.subscription.unsubscribe();
        };
    }, [navigate]);

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
                {/* Header Section */}
                <div className="relative mb-4 max-w-5xl mx-auto flex justify-center items-center">
                    <h2 className="text-6xl font-light text-[#E86D47] font-serif">
                        CATÁLOGO
                    </h2>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="absolute right-0 bg-[#E86D47] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow hover:bg-[#D85D37] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#E86D47]"
                        aria-label="Cadastrar nova planta"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">CADASTRAR PLANTA</span>
                    </button>
                </div>

                <p className="text-center text-[#5A7C5E] text-xl mb-12 italic">
                    "Do clique ao canteiro: cultive o futuro agora."
                </p>

                {/* Grid de Plantas */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    {plantas.map((planta) => (
                        <PlantCard key={planta.id} plant={planta} onClick={setSelectedPlant} />
                    ))}
                </div>

                {/* User Icon Footer */}
                <div className="flex justify-start max-w-5xl mx-auto">
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-4 border-2 border-[#A8C686]/30 shadow-lg">
                        <User className="w-12 h-12 text-[#5A7C5E]" />
                        <div className="w-24 h-16 bg-[#A8C686]/20 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Modal de Detalhes (Read-Only) */}
            {selectedPlant && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-6 animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="detail-modal-title"
                    onClick={() => setSelectedPlant(null)}
                >
                    <div
                        className="bg-[#F5F1E8] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative flex items-center"
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
                            <div className="flex gap-8 w-full flex-col md:flex-row">
                                <div className="w-48 h-56 rounded-3xl overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                                    <img
                                        src={selectedPlant.imagem_url || ''}
                                        alt={selectedPlant.nome}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3
                                        id="detail-modal-title"
                                        className="text-3xl font-serif text-[#3B5A5E] mb-2"
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

                                    <button
                                        onClick={() => setSelectedPlant(null)}
                                        className="mt-6 w-full bg-[#E86D47] text-white py-3 rounded-full hover:bg-[#D85D37] transition-colors duration-300 font-medium"
                                    >
                                        Fechar
                                    </button>
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
                                                }`}
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

            {/* Modal de Cadastro (Formulário) */}
            {isCreateOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setIsCreateOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-plant-title"
                >
                    <div
                        className="bg-[#F5F1E8] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === 'Escape') setIsCreateOpen(false); }}
                    >
                        <h3 id="create-plant-title" className="text-2xl font-medium text-[#3B5A5E] mb-4 text-center font-serif">
                            Cadastrar nova espécie
                        </h3>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2" role="alert" aria-live="polite">
                                <AlertCircle className="w-5 h-5" />
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Campos reutilizáveis com estilos padronizados */}
                            <div>
                                <label className="block text-sm text-[#4A3933] mb-1 font-semibold">Nome popular</label>
                                <input
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A3933] mb-1 font-semibold">Nome científico</label>
                                <input
                                    name="nomeCientifico"
                                    value={formData.nomeCientifico}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A3933] mb-1 font-semibold">Descrição</label>
                                <textarea
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white min-h-[60px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A3933] mb-1 font-semibold">Imagem</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-[#4A3933] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E86D47]/10 file:text-[#E86D47] hover:file:bg-[#E86D47]/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A3933] mb-1 font-semibold">Características (uma por linha)</label>
                                <textarea
                                    name="caracteristicasTexto"
                                    value={formData.caracteristicasTexto}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white min-h-[80px]"
                                    placeholder="Ex: Frutos ricos em vitamina C&#10;Resistente ao sol"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A3933] mb-1 font-semibold">Curiosidades</label>
                                <textarea
                                    name="curiosidades"
                                    value={formData.curiosidades}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white min-h-[60px]"
                                />
                            </div>

                            <div className="flex gap-3 mt-6 pt-2 border-t border-[#D3C4AB]/30">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="flex-1 border border-[#E86D47] text-[#E86D47] py-2.5 rounded-full text-sm font-medium hover:bg-[#FDE5DC] transition-colors"
                                    disabled={formLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#E86D47] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#D85D37] transition-colors disabled:opacity-60 flex justify-center items-center gap-2"
                                    disabled={formLoading}
                                >
                                    {formLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        "Salvar"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
