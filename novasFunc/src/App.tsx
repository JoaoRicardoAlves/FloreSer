import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import CatalogoAdmin from './pages/CatalogoAdmin';
import Perfil from './pages/Perfil';
import Publicacoes from './pages/Publicacoes';
import Contato from './pages/Contato';

function App() {
  const [currentPage, setCurrentPage] = useState('inicio');

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
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;