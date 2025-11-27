import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigation } from '../context/NavigationContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Senhas não coincidem');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          tipo_usuario: isAdmin ? 'admin' : 'user',
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate('inicio');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8] flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border-4 border-[#E86D47]">
          <h2 className="text-3xl font-light text-center mb-6 text-[#E86D47]" style={{ fontFamily: 'Georgia, serif' }}>
            CADASTRAR
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cadastro-nome" className="block text-[#4A3933] font-medium mb-2">Nome</label>
              <input
                type="text"
                id="cadastro-nome"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="cadastro-email" className="block text-[#4A3933] font-medium mb-2">Email</label>
              <input
                type="email"
                id="cadastro-email"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="cadastro-senha" className="block text-[#4A3933] font-medium mb-2">Senha</label>
              <input
                type="password"
                id="cadastro-senha"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="cadastro-confirm" className="block text-[#4A3933] font-medium mb-2">Confirmar Senha</label>
              <input
                type="password"
                id="cadastro-confirm"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor="isAdmin" className="text-[#4A3933] text-sm">Sou administrador</label>
            </div>

            {error && <p className="text-[#E86D47] text-sm" role="alert" aria-live="polite">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#5A7C5E] text-white py-3 rounded-full hover:bg-[#4A6C4E] transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <a
              href="#"
              className="text-[#5A7C5E]"
              onClick={(e) => { e.preventDefault(); navigate('login'); }}
            >
              Já tem conta? Entrar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
