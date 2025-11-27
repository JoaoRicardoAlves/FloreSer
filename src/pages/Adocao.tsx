import { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { supabase, Planta } from '../lib/supabase';
import { Loader2, Sprout, MapPin, FileText, AlertCircle } from 'lucide-react';

export default function Adocao() {
    const { navigate } = useNavigation();
    const [plantId, setPlantId] = useState<string | null>(null);
    const [planta, setPlanta] = useState<Planta | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        local: '',
        observacoes: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const id = params.get('id');
        if (id) {
            setPlantId(id);
            loadPlanta(id);
        } else {
            setError('Planta não especificada.');
            setLoading(false);
        }
    }, []);

    const loadPlanta = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('plantas')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setPlanta(data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar informações da planta.');
        } finally {
            setLoading(false);
        }
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plantId) return;

        setSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Você precisa estar logado para adotar uma planta.');
            }

            // Self-healing: Ensure user exists in 'usuarios' table
            const { data: existingUser } = await supabase
                .from('usuarios')
                .select('id')
                .eq('id', user.id)
                .single();

            if (!existingUser) {
                const { error: createError } = await supabase
                    .from('usuarios')
                    .insert({
                        id: user.id,
                        nome: user.user_metadata.nome || 'Usuário',
                        created_at: new Date().toISOString()
                    });

                if (createError) {
                    console.error('Error creating user record:', createError);
                    // Continue anyway, maybe the trigger worked or it's a race condition
                }
            }

            const { error } = await supabase
                .from('plantios')
                .insert({
                    usuario_id: user.id,
                    planta_id: plantId,
                    local: formData.local,
                    status: 'plantado',
                    data_plantio: new Date().toISOString()
                });

            if (error) {
                console.log('Adoption Error:', error);
                if (error.code === '23505' || error.message.includes('Conflict')) {
                    throw new Error('Você já adotou esta planta!');
                }
                throw error;
            }

            // Success! Show popup
            setShowSuccessModal(true);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erro ao realizar adoção.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
                <Loader2 className="w-8 h-8 animate-spin text-[#5A7C5E]" />
            </div>
        );
    }

    if (!planta) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E8] p-6 text-center">
                <AlertCircle className="w-12 h-12 text-[#E86D47] mb-4" />
                <h2 className="text-2xl font-serif text-[#4A3933] mb-2">Planta não encontrada</h2>
                <button
                    onClick={() => navigate('catalogo')}
                    className="bg-[#5A7C5E] text-white px-6 py-2 rounded-full hover:bg-[#4A664D] transition-colors"
                >
                    Voltar ao Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8] py-12 px-6 relative">
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-[#A8C686]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sprout className="w-10 h-10 text-[#5A7C5E]" />
                        </div>
                        <h3 className="text-2xl font-serif text-[#E86D47] mb-2">Adoção Confirmada!</h3>
                        <p className="text-[#5A7C5E] mb-8">
                            Parabéns! Você acaba de dar um novo lar para esta plantinha.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('perfil')}
                                className="w-full bg-[#E86D47] text-white py-3 rounded-full hover:bg-[#D85D37] transition-colors font-medium shadow-lg"
                            >
                                Ver Minhas Plantas
                            </button>
                            <button
                                onClick={() => navigate('catalogo')}
                                className="w-full border border-[#5A7C5E] text-[#5A7C5E] py-3 rounded-full hover:bg-[#5A7C5E]/10 transition-colors font-medium"
                            >
                                Voltar ao Catálogo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-light text-center mb-2 text-[#E86D47] font-serif">
                    ADOÇÃO DE PLANTA
                </h2>
                <p className="text-center text-[#5A7C5E] text-lg mb-12 italic">
                    "Um novo lar para uma nova vida."
                </p>

                <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] shadow-xl overflow-hidden flex flex-col md:flex-row">
                    {/* Plant Info Side */}
                    <div className="md:w-1/3 bg-[#A8C686]/20 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#A8C686]/30">
                        <div className="w-48 h-56 rounded-3xl overflow-hidden shadow-lg mb-6 bg-white">
                            <img
                                src={planta.imagem_url || ''}
                                alt={planta.nome}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-2xl font-serif text-[#3B5A5E] mb-1">{planta.nome}</h3>
                        <p className="text-[#5A7C5E] italic text-sm">{planta.nome_cientifico}</p>
                    </div>

                    {/* Form Side */}
                    <div className="md:w-2/3 p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-[#4A3933] font-medium mb-2">
                                    <MapPin className="w-5 h-5 text-[#E86D47]" />
                                    Local do Plantio
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Quintal, Vaso na sala, Jardim comunitário..."
                                    value={formData.local}
                                    onChange={e => setFormData(prev => ({ ...prev, local: e.target.value }))}
                                    className="w-full bg-white border border-[#D3C4AB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E86D47]/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[#4A3933] font-medium mb-2">
                                    <FileText className="w-5 h-5 text-[#E86D47]" />
                                    Observações (Opcional)
                                </label>
                                <textarea
                                    placeholder="Alguma nota especial sobre este plantio?"
                                    value={formData.observacoes}
                                    onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                                    className="w-full bg-white border border-[#D3C4AB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E86D47]/50 transition-all min-h-[100px]"
                                />
                            </div>

                            <div className="min-h-[3.5rem]">
                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('catalogo')}
                                    className="flex-1 border border-[#5A7C5E] text-[#5A7C5E] py-3 rounded-full hover:bg-[#5A7C5E]/10 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#E86D47] text-white py-3 rounded-full hover:bg-[#D85D37] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    <div className="flex items-center gap-2 justify-center w-full">
                                        <div className={`flex items-center gap-2 ${submitting ? '' : 'hidden'}`}>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Adotando...</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${submitting ? 'hidden' : ''}`}>
                                            <Sprout className="w-5 h-5" />
                                            <span>Confirmar Adoção</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
