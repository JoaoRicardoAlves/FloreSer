import { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import { supabase, Publicacao } from '../lib/supabase';

export default function Publicacoes() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Publicacao | null>(null);

  useEffect(() => {
    loadPublicacoes();
  }, []);

  const loadPublicacoes = async () => {
    const { data } = await supabase
      .from('publicacoes')
      .select('*')
      .order('visualizacoes', { ascending: false });

    if (data) setPublicacoes(data);
  };

  const filteredPublicacoes = publicacoes.filter((pub) =>
    pub.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8]">
      <div className="container mx-auto px-6 py-12">
        <h2
          className="text-6xl font-light text-center mb-4 text-[#E86D47]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          PUBLICAÇÕES
        </h2>

        <p className="text-center text-[#5A7C5E] text-lg mb-12 italic">
          "De um scroll na natureza: dicas, histórias e descobertas para quem planta o futuro."
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="md:col-span-2">
            {selectedPost ? (
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-[#5A7C5E] hover:text-[#E86D47] mb-4 transition-colors duration-300"
                >
                  ← Voltar
                </button>

                {selectedPost.imagem_capa_url && (
                  <div className="w-full h-64 rounded-2xl overflow-hidden mb-6">
                    <img
                      src={selectedPost.imagem_capa_url}
                      alt={selectedPost.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3
                  className="text-3xl font-medium text-[#3B5A5E] mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {selectedPost.titulo}
                </h3>

                <div className="flex items-center gap-4 text-sm text-[#5A7C5E] mb-6">
                  <span>Por {selectedPost.autor}</span>
                  <span>•</span>
                  <span>{selectedPost.visualizacoes} visualizações</span>
                  <span>•</span>
                  <span>{new Date(selectedPost.created_at).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="prose prose-lg max-w-none text-[#4A3933] leading-relaxed">
                  {selectedPost.conteudo.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-xl min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-[#A8C686]/20 to-[#E86D47]/20">
                    <img
                      src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg"
                      alt="Natureza"
                      className="w-full h-full object-cover opacity-40"
                    />
                  </div>
                  <p className="text-[#5A7C5E] text-lg">
                    Selecione um artigo para começar a leitura
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-[#E86D47]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-4 pr-12 rounded-full border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none transition-colors duration-300"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7C5E] w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#E86D47]">
              <h3
                className="text-2xl font-medium text-[#3B5A5E] mb-6 text-center"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                MAIS LIDOS
              </h3>

              <div className="space-y-4">
                {filteredPublicacoes.map((pub) => (
                  <button
                    key={pub.id}
                    onClick={() => setSelectedPost(pub)}
                    className="w-full text-left p-4 rounded-2xl hover:bg-[#F5F1E8] transition-all duration-300 group border-2 border-transparent hover:border-[#A8C686]/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[#A8C686] text-xl mt-1 group-hover:scale-125 transition-transform duration-300">
                        🌱
                      </span>
                      <div className="flex-1">
                        <h4 className="text-[#4A3933] font-medium mb-1 group-hover:text-[#E86D47] transition-colors duration-300">
                          {pub.titulo}
                        </h4>
                        <p className="text-xs text-[#5A7C5E]">
                          {pub.visualizacoes} visualizações
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-start max-w-7xl mx-auto">
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
