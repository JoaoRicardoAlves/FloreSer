import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { supabase } from './lib/supabase';
import './index.css';

// Expose supabase for debugging
(window as any).supabase = supabase;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
