# FloreSer

Projeto web para conectar pessoas à essência da natureza através do cultivo de mudas nativas e da divulgação de conteúdo educativo.

## Contexto do Projeto

- Promove o plantio de espécies nativas em áreas urbanas, com foco em sustentabilidade e respeito à biodiversidade local.
- Estimula a conscientização ambiental por meio de publicações, dicas e acompanhamento de plantios.
- Possui área administrativa para cadastrar novas espécies no catálogo.

## Principais Funcionalidades

- `Home`: apresentação do projeto e destaques de planta e área de plantio.
- `Catálogo`: lista de espécies com detalhes de características e curiosidades.
- `Catálogo (Admin)`: cadastro de novas espécies com upload de imagem para o Storage do Supabase.
- `Perfil`: visualização de espécie destaque e opção de sair da conta.
- `Publicações`: artigos filtráveis e leitura com capa, autor e métricas.
- `Contato`: formulário com informações de email, telefone e endereço.
- `Login` e `Cadastro`: autenticação via Supabase Auth (email/senha).

## Tecnologias

- Vite + React + TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- lucide-react (ícones)

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SEU_ANON_KEY
```

### Banco de Dados e Storage

- Execute as migrações conforme necessário (exemplo disponível em `supabase/migrations/20251103235532_create_florescer_schema.sql`).
- Crie um bucket público chamado `plantas` no Supabase Storage para armazenar imagens de espécies.
- Garanta permissões de leitura pública e de upload para usuários autenticados.

## Passo a Passo para Iniciar a Página

1. Instale as dependências:
   - `npm install`
2. Configure as variáveis de ambiente (`.env`) com sua URL e chave do Supabase.
3. Inicie o servidor de desenvolvimento:
   - `npm run dev`
4. Acesse no navegador a URL exibida (por padrão `http://localhost:5173`).

## Autenticação e Acesso ao Catálogo Admin

- Use `Login` ou `Cadastro` para entrar no sistema.
- No cadastro, é possível marcar a opção “Sou administrador” para definir `tipo_usuario=admin` (armazenado em `user_metadata` e refletido no `localStorage`).
- Ao clicar em `CATÁLOGO` no menu:
  - Usuários com `tipo_usuario=admin` serão redirecionados para `CatalogoAdmin`.
  - Demais usuários irão para `Catalogo`.
- Para sair, acesse `Perfil` e use o botão `SAIR`, que encerra a sessão (`supabase.auth.signOut()`) e limpa `localStorage`.

## Comandos Úteis

- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`

## Estrutura de Arquivos (resumo)

- `src/App.tsx`: roteamento simples por estado para páginas principais e auth.
- `src/components/Header.tsx`: navegação; decide entre `catalogo` e `catalogoAdmin` conforme `localStorage.tipo_usuario`.
- `src/pages/CatalogoAdmin.tsx`: cadastro de espécies e listagem, upload para Storage `plantas`.
- `src/pages/Login.tsx` e `src/pages/Cadastro.tsx`: autenticação e criação de conta com `user_metadata`.
- `src/lib/supabase.ts`: cliente do Supabase e tipos do domínio (Planta, Área de Plantio, Publicação, etc.).

## Observações

- Certifique-se de que o schema do banco contemple a tabela `plantas` com os campos:
  - `nome`, `nome_cientifico`, `descricao`, `imagem_url`, `caracteristicas` (array de texto), `curiosidades`.
- O upload de imagens no `CatalogoAdmin` gera uma URL pública baseada em `VITE_SUPABASE_URL` e no bucket `plantas`.

Com isso, o projeto estará pronto para uso local com autenticação, catálogo e administração de espécies.
