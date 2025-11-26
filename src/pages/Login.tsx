import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const tipo = data.user?.user_metadata?.tipo_usuario ?? 'user';
    localStorage.setItem('tipo_usuario', tipo);
    (window as any).navigateTo?.('inicio');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8] flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border-4 border-[#E86D47]">
          <h2 className="text-3xl font-light text-center mb-6 text-[#E86D47]" style={{ fontFamily: 'Georgia, serif' }}>
            ENTRAR
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#4A3933] font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[#4A3933] font-medium mb-2">Senha</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#A8C686]/30 focus:border-[#E86D47] focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-[#E86D47] text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#5A7C5E] text-white py-3 rounded-full hover:bg-[#4A6C4E] transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-[#5A7C5E]" onClick={() => (window as any).navigateTo?.('cadastro')}>
              Não tem conta? Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
