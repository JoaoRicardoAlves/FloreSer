/*
  # Florescer Database Schema

  ## Overview
  Creates the complete database structure for the Florescer reforestation platform,
  including plants catalog, user profiles, planting tracking, and publications.

  ## New Tables
  
  ### 1. `plantas` (Native Plants Catalog)
    - `id` (uuid, primary key)
    - `nome` (text) - Plant name
    - `nome_cientifico` (text) - Scientific name
    - `descricao` (text) - Plant description
    - `imagem_url` (text) - Plant image URL
    - `caracteristicas` (jsonb) - Characteristics (medicinal, native, etc.)
    - `curiosidades` (text) - Fun facts
    - `created_at` (timestamptz)
    
  ### 2. `usuarios` (User Profiles)
    - `id` (uuid, primary key, references auth.users)
    - `nome` (text) - User name
    - `avatar_url` (text) - Profile picture
    - `created_at` (timestamptz)
    
  ### 3. `plantios` (User Plantings)
    - `id` (uuid, primary key)
    - `usuario_id` (uuid) - References usuarios
    - `planta_id` (uuid) - References plantas
    - `data_plantio` (date) - Planting date
    - `local` (text) - Location name
    - `status` (text) - Growing status
    - `observacoes` (text) - User notes
    - `created_at` (timestamptz)
    
  ### 4. `areas_plantio` (Planting Areas)
    - `id` (uuid, primary key)
    - `nome` (text) - Area name
    - `localizacao` (text) - Location
    - `descricao` (text) - Description
    - `imagem_url` (text) - Area image
    - `created_at` (timestamptz)
    
  ### 5. `publicacoes` (Blog Posts/Publications)
    - `id` (uuid, primary key)
    - `titulo` (text) - Post title
    - `conteudo` (text) - Post content
    - `autor` (text) - Author name
    - `imagem_capa_url` (text) - Cover image
    - `visualizacoes` (integer) - View count
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated user access
  - Public read access for plantas, areas_plantio, and publicacoes
  - User-specific access for plantios
*/

-- Create plantas table
CREATE TABLE IF NOT EXISTS plantas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  nome_cientifico text NOT NULL,
  descricao text,
  imagem_url text,
  caracteristicas jsonb DEFAULT '[]'::jsonb,
  curiosidades text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plantas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plantas"
  ON plantas FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert plantas"
  ON plantas FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nome text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON usuarios FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create plantios table
CREATE TABLE IF NOT EXISTS plantios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  planta_id uuid REFERENCES plantas(id) ON DELETE CASCADE NOT NULL,
  data_plantio date DEFAULT CURRENT_DATE,
  local text,
  status text DEFAULT 'crescendo',
  observacoes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plantios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plantings"
  ON plantios FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own plantings"
  ON plantios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own plantings"
  ON plantios FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own plantings"
  ON plantios FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Create areas_plantio table
CREATE TABLE IF NOT EXISTS areas_plantio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  localizacao text NOT NULL,
  descricao text,
  imagem_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE areas_plantio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view planting areas"
  ON areas_plantio FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert areas"
  ON areas_plantio FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create publicacoes table
CREATE TABLE IF NOT EXISTS publicacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  conteudo text NOT NULL,
  autor text NOT NULL,
  imagem_capa_url text,
  visualizacoes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE publicacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view publications"
  ON publicacoes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert publications"
  ON publicacoes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update publications"
  ON publicacoes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample plantas
INSERT INTO plantas (nome, nome_cientifico, descricao, caracteristicas, curiosidades, imagem_url) VALUES
('Pitanga', 'Eugenia Uniflora', 'Curiosidade: suas folhas liberam um cheiro muito característico ao serem amassadas, com propriedades medicinais.', '["Muito usada na medicina popular contra diarreias, infestação e febre", "Suas flores são visitadas por abelhas nativas e morcegos", "Há variedades de cor mais escura (roxas) com sabor mais doce e menos resinoso"]'::jsonb, 'Muito usada na medicina popular contra diarreias, infestação e febre. Suas flores são visitadas por abelhas nativas e morcegos.', 'https://images.pexels.com/photos/7728892/pexels-photo-7728892.jpeg'),
('Uvaia', 'Eugenia pyriformis', 'Pequena árvore frutífera nativa da Mata Atlântica, conhecida por seus frutos amarelos aromáticos e saborosos.', '["Frutos ricos em vitamina C", "Atrai aves e fauna nativa", "Adapta-se bem a diferentes solos"]'::jsonb, 'Os frutos são muito apreciados pela fauna silvestre e podem ser consumidos in natura ou em sucos.', 'https://images.pexels.com/photos/6157057/pexels-photo-6157057.jpeg'),
('Jabuticaba', 'Plinia cauliflora', 'Árvore frutífera brasileira famosa por produzir frutos diretamente no tronco.', '["Frutos surgem no tronco", "Rica em antioxidantes", "Floresce duas vezes ao ano"]'::jsonb, 'A jabuticaba é exclusivamente brasileira e seus frutos crescem grudados ao tronco da árvore.', 'https://images.pexels.com/photos/8956561/pexels-photo-8956561.jpeg'),
('Araçá', 'Psidium cattleianum', 'Arbusto nativo que produz pequenos frutos aromáticos amarelos ou vermelhos.', '["Frutos ricos em vitamina C", "Resistente e de fácil cultivo", "Atrai polinizadores"]'::jsonb, 'O araçá é parente da goiaba e seus frutos têm sabor único e refrescante.', 'https://images.pexels.com/photos/5966440/pexels-photo-5966440.jpeg'),
('Bacupari', 'Garcinia brasiliensis', 'Árvore de pequeno porte da Mata Atlântica, com frutos doces e amarelados.', '["Frutos adocicados", "Madeira de boa qualidade", "Cresce bem em áreas sombreadas"]'::jsonb, 'Seus frutos são muito apreciados pela fauna e têm polpa suculenta e doce.', 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg'),
('Ipê Roxo', 'Handroanthus impetiginosus', 'Árvore símbolo do Brasil, conhecida por sua floração exuberante roxa.', '["Floração espetacular", "Madeira nobre", "Atrai abelhas e beija-flores"]'::jsonb, 'O ipê roxo floresce no inverno, quando perde todas as folhas e fica coberto de flores.', 'https://images.pexels.com/photos/14616012/pexels-photo-14616012.jpeg'),
('Pau Brasil', 'Paubrasilia echinata', 'Árvore que deu nome ao nosso país, atualmente ameaçada de extinção.', '["Madeira valiosa historicamente", "Flores amarelas perfumadas", "Espécie ameaçada"]'::jsonb, 'O pau-brasil foi intensamente explorado no período colonial e hoje é protegido por lei.', 'https://images.pexels.com/photos/3076899/pexels-photo-3076899.jpeg')
ON CONFLICT DO NOTHING;

-- Insert sample area
INSERT INTO areas_plantio (nome, localizacao, descricao, imagem_url) VALUES
('Parque Moscoso', 'Vitória - ES', 'Área histórica de reflorestamento urbano com diversas espécies nativas da Mata Atlântica.', 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg')
ON CONFLICT DO NOTHING;

-- Insert sample publications
INSERT INTO publicacoes (titulo, conteudo, autor, visualizacoes, imagem_capa_url) VALUES
('Plantas Nativas vs. Exóticas: Entenda a Diferença', 'As plantas nativas são aquelas que evoluíram naturalmente em uma determinada região, adaptadas às condições locais de clima, solo e interação com a fauna. Já as plantas exóticas vêm de outras regiões e podem, em alguns casos, se tornar invasoras...', 'Equipe Florescer', 1250, 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg'),
('Como as Raízes "Conversam" com o Solo?', 'As raízes das plantas estabelecem uma complexa rede de comunicação química com o solo e outros organismos. Através de exsudatos radiculares, as plantas liberam compostos que atraem microrganismos benéficos...', 'Dr. João Silva', 980, 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg'),
('Quando Plantar Vira Resistência: Movimentos Verdes ao Redor do Mundo', 'Em diversas partes do globo, comunidades têm usado o plantio de árvores como forma de resistência política e ambiental. Desde os movimentos de reflorestamento na África até as hortas urbanas...', 'Maria Santos', 856, 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg'),
('Reflorestamento Urbano: Por que Sua Participação Importa?', 'As cidades brasileiras perderam grande parte de sua cobertura vegetal nativa. O reflorestamento urbano não é apenas estético, mas essencial para qualidade de vida, regulação térmica e biodiversidade...', 'Equipe Florescer', 743, 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg')
ON CONFLICT DO NOTHING;