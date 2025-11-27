import { useNavigation } from '../context/NavigationContext';
import { CheckCircle, Sprout, Home } from 'lucide-react';

export default function AdocaoSucesso() {
    const { navigate } = useNavigation();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8] flex items-center justify-center p-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 max-w-lg w-full text-center shadow-xl border border-[#A8C686]/30">
                <div className="w-24 h-24 bg-[#A8C686]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-[#5A7C5E]" />
                </div>

                <h2 className="text-3xl md:text-4xl font-serif text-[#E86D47] mb-4">
                    Adoção Confirmada!
                </h2>

                <p className="text-[#5A7C5E] text-lg mb-8">
                    Parabéns! Você acaba de dar um novo lar para uma plantinha. Cuide dela com carinho.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('perfil')}
                        className="w-full bg-[#E86D47] text-white py-3 rounded-full hover:bg-[#D85D37] transition-colors font-medium flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Sprout className="w-5 h-5" />
                        Ver Minhas Plantas
                    </button>

                    <button
                        onClick={() => navigate('catalogo')}
                        className="w-full border border-[#5A7C5E] text-[#5A7C5E] py-3 rounded-full hover:bg-[#5A7C5E]/10 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Voltar ao Catálogo
                    </button>
                </div>
            </div>
        </div>
    );
}
