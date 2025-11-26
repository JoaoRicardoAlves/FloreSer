import { useEffect, useState, FormEvent } from "react";
import { User, Plus } from "lucide-react";
import { supabase, Planta } from "../lib/supabase";

export default function CatalogoAdmin() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Planta | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [imagemFile, setImagemFile] = useState<File | null>(null);

  // Campos do formulário de cadastro
  const [nome, setNome] = useState("");
  const [nomeCientifico, setNomeCientifico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [caracteristicasTexto, setCaracteristicasTexto] = useState("");
  const [curiosidades, setCuriosidades] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlantas();
  }, []);

  const loadPlantas = async () => {
    const { data, error } = await supabase
      .from("plantas")
      .select("*")
      .order("nome");

    if (error) {
      console.error(error);
      return;
    }

    if (data) setPlantas(data as Planta[]);
  };

  const resetForm = () => {
    setNome("");
    setNomeCientifico("");
    setDescricao("");
    setImagemFile(null);
    setCaracteristicasTexto("");
    setCuriosidades("");
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const caracteristicasArray = caracteristicasTexto
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    let imagem_url: string | null = null;

    // Se imagem foi selecionada, envia para o Supabase Storage
    if (imagemFile) {
      const fileExt = imagemFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from("plantas")
        .upload(fileName, imagemFile);

      if (storageError) {
        console.error(storageError);
        alert("Erro ao enviar imagem: " + storageError.message);
        setLoading(false);
        return;
      }

      // Gera URL pública
      imagem_url = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/plantas/${fileName}`;
    }

    const { error } = await supabase.from("plantas").insert({
      nome,
      nome_cientifico: nomeCientifico,
      descricao: descricao || null,
      imagem_url: imagem_url, // usa a URL gerada
      caracteristicas: caracteristicasArray,
      curiosidades: curiosidades || null,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar planta: " + error.message);
      return;
    }

    alert("Planta cadastrada com sucesso!");
    resetForm();
    setIsCreateOpen(false);
    loadPlantas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8]">
      <div className="container mx-auto px-6 py-12">
        {/* Título + botão de cadastro */}
        <div className="relative mb-4 max-w-5xl mx-auto">
          <h2
            className="text-6xl font-light text-center text-[#E86D47]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            CATÁLOGO
          </h2>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#E86D47] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow hover:bg-[#D85D37] transition-colors"
          >
            <Plus className="w-4 h-4" />
            CADASTRAR PLANTA
          </button>
        </div>

        <p className="text-center text-[#5A7C5E] text-xl mb-12 italic">
          "Do clique ao canteiro: cultive o futuro agora."
        </p>

        {/* Cards do catálogo */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {plantas.map((planta) => (
            <div
              key={planta.id}
              onClick={() => setSelectedPlant(planta)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-10"
            >
              <div className="bg-white rounded-[3rem] p-6 border-4 border-[#E86D47] shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="w-32 h-40 mx-auto mb-4 rounded-3xl overflow-hidden bg-gray-50">
                  <img
                    src={planta.imagem_url || ""}
                    alt={planta.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3
                  className="text-center text-xl text-[#4A3933] font-medium"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {planta.nome}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Cardzinho com ícone de usuário */}
        <div className="flex justify-start max-w-5xl mx-auto">
          <div className="relative">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-4 border-2 border-[#A8C686]/30 shadow-lg">
              <User className="w-12 h-12 text-[#5A7C5E]" />
              <div className="w-24 h-16 bg-[#A8C686]/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detalhes da planta */}
      {selectedPlant && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-6"
          onClick={() => setSelectedPlant(null)}
        >
          <div
            className="bg-[#F5F1E8] rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8">
              <div className="w-48 h-56 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={selectedPlant.imagem_url || ""}
                  alt={selectedPlant.nome}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3
                  className="text-3xl font-medium text-[#3B5A5E] mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {selectedPlant.nome}
                </h3>
                <p className="text-[#5A7C5E] italic mb-4">
                  {selectedPlant.nome_cientifico}
                </p>

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
                    <p className="text-sm text-[#5A7C5E] italic">
                      {selectedPlant.curiosidades}
                    </p>
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
          </div>
        </div>
      )}

      {/* Cadastro da planta */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="bg-[#F5F1E8] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-2xl font-medium text-[#3B5A5E] mb-4 text-center"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Cadastrar nova espécie
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-[#4A3933] mb-1">
                  Nome popular
                </label>
                <input
                  className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#4A3933] mb-1">
                  Nome científico
                </label>
                <input
                  className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white"
                  value={nomeCientifico}
                  onChange={(e) => setNomeCientifico(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#4A3933] mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white min-h-[60px]"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-[#4A3933] mb-1">
                  Imagem da planta
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm bg-white"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImagemFile(e.target.files[0]);
                    }
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#4A3933] mb-1">
                  Características (uma por linha)
                </label>
                <textarea
                  className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white min-h-[80px]"
                  value={caracteristicasTexto}
                  onChange={(e) => setCaracteristicasTexto(e.target.value)}
                  placeholder={`Frutos ricos em vitamina C\nResistente e de fácil cultivo\nAtrai polinizadores`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#4A3933] mb-1">
                  Curiosidades (opcional)
                </label>
                <textarea
                  className="w-full border border-[#D3C4AB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E86D47]/60 bg-white min-h-[60px]"
                  value={curiosidades}
                  onChange={(e) => setCuriosidades(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 border border-[#E86D47] text-[#E86D47] py-2 rounded-full text-sm font-medium hover:bg-[#FDE5DC] transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#E86D47] text-white py-2 rounded-full text-sm font-medium hover:bg-[#D85D37] transition-colors disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
