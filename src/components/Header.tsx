import { Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PageId } from '../context/NavigationContext';

interface HeaderProps {
  currentPage?: PageId;
  onNavigate: (page: PageId) => void;
}

export default function Header({ currentPage = 'inicio', onNavigate }: HeaderProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user || null;
      const tipo = user?.user_metadata?.tipo_usuario;
      setIsLogged(!!user);
      setIsAdmin(tipo === 'admin');
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      const tipo = user?.user_metadata?.tipo_usuario;
      setIsLogged(!!user);
      setIsAdmin(tipo === 'admin');
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { id: 'inicio' as const, label: 'INÍCIO' },
    { id: 'perfil' as const, label: 'PERFIL' },
    { id: 'publicacoes' as const, label: 'PUBLICAÇÕES' },
    { id: 'catalogo' as const, label: 'CATÁLOGO' },
    { id: 'contato' as const, label: 'CONTATO' },
    ...(!isLogged ? [
      { id: 'login' as const, label: 'ENTRAR' },
      { id: 'cadastro' as const, label: 'CADASTRAR' },
    ] : []),
  ];

  return (
    <header className="w-full">
      <div className="bg-[#E86D47] px-6 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#A8C686] rounded-full blur-2xl opacity-30 transform scale-150"></div>
            <Sprout className="w-16 h-16 text-[#A8C686] mx-auto mb-2 relative z-10" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-light text-[#F5F1E8] tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            FLORESCER
          </h1>
          <p className="text-[#F5F1E8] mt-2 text-sm tracking-wider">
            Conectando você à essência da natureza
          </p>
        </div>
      </div>

      <nav className="bg-[#5A7C5E] shadow-md">
        <ul className="flex justify-center items-center gap-1 px-4">
          {navItems.map((item) => {
            const isActive =
              item.id === 'catalogo'
                ? currentPage === 'catalogo' || currentPage === 'catalogoAdmin'
                : currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'catalogo') {
                      const destino = isAdmin ? 'catalogoAdmin' : 'catalogo';
                      onNavigate(destino);
                      return;
                    }
                    onNavigate(item.id);
                  }}
                  className={`px-6 py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#4A6C4E] ${
                    isActive ? 'text-white bg-[#4A6C4E]' : 'text-[#F5F1E8]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
