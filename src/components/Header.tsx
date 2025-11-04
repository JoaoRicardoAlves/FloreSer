import { Sprout } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage = 'inicio', onNavigate }: HeaderProps) {
  const navItems = [
    { id: 'inicio', label: 'INÍCIO' },
    { id: 'perfil', label: 'PERFIL' },
    { id: 'publicacoes', label: 'PUBLICAÇÕES' },
    { id: 'catalogo', label: 'CATÁLOGO' },
    { id: 'contato', label: 'CONTATO' },
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
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`px-6 py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#4A6C4E] ${
                  currentPage === item.id
                    ? 'text-white bg-[#4A6C4E]'
                    : 'text-[#F5F1E8]'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
