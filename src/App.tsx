import { Suspense, lazy, useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { NavigationProvider } from './context/NavigationContext';
import type { PageId } from './context/NavigationContext';

const Home = lazy(() => import('./pages/Home'));
const Catalogo = lazy(() => import('./pages/Catalogo'));
const CatalogoAdmin = lazy(() => import('./pages/CatalogoAdmin'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Publicacoes = lazy(() => import('./pages/Publicacoes'));
const Contato = lazy(() => import('./pages/Contato'));
const Login = lazy(() => import('./pages/Login'));
const Cadastro = lazy(() => import('./pages/Cadastro'));
const Adocao = lazy(() => import('./pages/Adocao'));
const AdocaoSucesso = lazy(() => import('./pages/AdocaoSucesso'));

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('inicio');

  useEffect(() => {
    const pages: PageId[] = ['inicio', 'catalogo', 'catalogoAdmin', 'perfil', 'publicacoes', 'contato', 'login', 'cadastro', 'adocao', 'adocaoSucesso'];
    const parseHash = (): PageId => {
      const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      return pages.includes(raw as PageId) ? (raw as PageId) : 'inicio';
    };

    setCurrentPage(parseHash());

    const onHashChange = () => {
      setCurrentPage(parseHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    const hash = `#/${currentPage}`;
    if (!window.location.hash.startsWith(hash)) {
      // Only update if the base path is different, preserving query params if any
      // But since we are simple, let's just update if it doesn't match base
      // Actually, to support params we should be careful.
      // If we are navigating via state change, we might want to update hash.
      // For now, let's just check if the current hash starts with the page.
      if (!window.location.hash.includes(currentPage)) {
        window.location.hash = hash;
      }
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <Home />;
      case 'catalogo':
        return <Catalogo />;
      case 'catalogoAdmin':
        return <CatalogoAdmin />;
      case 'perfil':
        return <Perfil />;
      case 'publicacoes':
        return <Publicacoes />;
      case 'contato':
        return <Contato />;
      case 'login':
        return <Login />;
      case 'cadastro':
        return <Cadastro />;
      case 'adocao':
        return <Adocao />;
      case 'adocaoSucesso':
        return <AdocaoSucesso />;
      default:
        return <Home />;
    }
  };

  return (
    <NavigationProvider value={{ currentPage, navigate: setCurrentPage }}>
      <div className="min-h-screen flex flex-col">
        <Header
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
          }}
        />
        <main className="flex-1">
          <Suspense fallback={<div className="flex items-center justify-center py-12 text-[#5A7C5E]">Carregando...</div>}>
            {renderPage()}
          </Suspense>
        </main>
        <Footer />
      </div>
    </NavigationProvider>
  );
}

export default App;
