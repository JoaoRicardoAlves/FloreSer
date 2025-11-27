import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contato() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8]">
      <div className="container mx-auto px-6 py-12">
        <h2
          className="text-6xl font-light text-center mb-4 text-[#E86D47]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          CONTATO
        </h2>

        <p className="text-center text-[#5A7C5E] text-lg mb-12 italic">
          "Vamos crescer juntos? Entre em contato conosco."
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-[#E86D47]">
            <h3
              className="text-2xl font-medium text-[#3B5A5E] mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Envie sua mensagem
            </h3>

            <form className="space-y-4">
              <div>
                <label htmlFor="contato-nome" className="block text-[#4A3933] font-medium mb-2">Nome</label>
                <input
                  type="text"
                  id="contato-nome"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none transition-colors duration-300"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="contato-email" className="block text-[#4A3933] font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="contato-email"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none transition-colors duration-300"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="contato-mensagem" className="block text-[#4A3933] font-medium mb-2">Mensagem</label>
                <textarea
                  rows={5}
                  id="contato-mensagem"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Como podemos ajudar você?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E86D47] text-white py-4 rounded-full hover:bg-[#D85D37] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#A8C686]/30">
              <div className="flex items-start gap-4">
                <div className="bg-[#A8C686] p-4 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3B5A5E] font-medium text-lg mb-2">Email</h4>
                  <p className="text-[#5A7C5E]">contato@florescer.com.br</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#A8C686]/30">
              <div className="flex items-start gap-4">
                <div className="bg-[#E86D47] p-4 rounded-full">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3B5A5E] font-medium text-lg mb-2">Telefone</h4>
                  <p className="text-[#5A7C5E]">(27) 3333-4444</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#A8C686]/30">
              <div className="flex items-start gap-4">
                <div className="bg-[#5A7C5E] p-4 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3B5A5E] font-medium text-lg mb-2">Endereço</h4>
                  <p className="text-[#5A7C5E]">
                    Parque Moscoso
                    <br />
                    Vitória - ES
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#A8C686] to-[#5A7C5E] rounded-3xl p-8 shadow-xl text-white">
              <h4 className="text-2xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Horário de Atendimento
              </h4>
              <div className="space-y-2 text-sm">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 9h às 13h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
