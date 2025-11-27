import { createContext, useContext } from 'react';

export type PageId =
  | 'inicio'
  | 'catalogo'
  | 'catalogoAdmin'
  | 'perfil'
  | 'publicacoes'
  | 'contato'
  | 'login'
  | 'cadastro'
  | 'adocao'
  | 'adocaoSucesso';

export interface NavigationValue {
  currentPage: PageId;
  navigate: (page: PageId) => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export const NavigationProvider = NavigationContext.Provider;

export const useNavigation = (): NavigationValue => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
};

