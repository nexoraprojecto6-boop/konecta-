-- ==================================================
-- KONECTA - Seed de categorias (Fase 4)
-- Seguro rodar repetidamente: usa ON CONFLICT (slug) DO NOTHING
-- ==================================================

-- Categorias principais
INSERT INTO categories (id, name, slug, description, icon, "parentId", active, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Automóveis', 'automoveis', 'Serviços relacionados a veículos', '🚗', NULL, true, now(), now()),
  (gen_random_uuid(), 'Tecnologia', 'tecnologia', 'Serviços digitais e de tecnologia', '💻', NULL, true, now(), now()),
  (gen_random_uuid(), 'Casa e Construção', 'casa-e-construcao', 'Serviços para casa e construção civil', '🏠', NULL, true, now(), now()),
  (gen_random_uuid(), 'Beleza', 'beleza', 'Serviços de beleza e estética', '💇', NULL, true, now(), now()),
  (gen_random_uuid(), 'Eventos', 'eventos', 'Serviços para eventos e celebrações', '🎉', NULL, true, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias: Automóveis
INSERT INTO categories (id, name, slug, description, icon, "parentId", active, "createdAt", "updatedAt")
SELECT gen_random_uuid(), v.name, v.slug, NULL, NULL, c.id, true, now(), now()
FROM (VALUES
  ('Mecânica', 'mecanica'),
  ('Eletricidade automóvel', 'eletricidade-automovel'),
  ('Chaparia', 'chaparia'),
  ('Pintura automóvel', 'pintura-automovel'),
  ('Diagnóstico', 'diagnostico'),
  ('Pneus', 'pneus'),
  ('Lavagem', 'lavagem'),
  ('Peças', 'pecas'),
  ('Guincho', 'guincho')
) AS v(name, slug)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'automoveis') AS c
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias: Tecnologia
INSERT INTO categories (id, name, slug, description, icon, "parentId", active, "createdAt", "updatedAt")
SELECT gen_random_uuid(), v.name, v.slug, NULL, NULL, c.id, true, now(), now()
FROM (VALUES
  ('Programação', 'programacao'),
  ('Desenvolvimento de websites', 'desenvolvimento-de-websites'),
  ('Aplicativos', 'aplicativos'),
  ('Design gráfico', 'design-grafico'),
  ('Marketing digital', 'marketing-digital'),
  ('Manutenção informática', 'manutencao-informatica'),
  ('Redes', 'redes'),
  ('Cibersegurança', 'ciberseguranca'),
  ('Inteligência Artificial', 'inteligencia-artificial')
) AS v(name, slug)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'tecnologia') AS c
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias: Casa e Construção
INSERT INTO categories (id, name, slug, description, icon, "parentId", active, "createdAt", "updatedAt")
SELECT gen_random_uuid(), v.name, v.slug, NULL, NULL, c.id, true, now(), now()
FROM (VALUES
  ('Eletricista', 'eletricista'),
  ('Canalizador', 'canalizador'),
  ('Pedreiro', 'pedreiro'),
  ('Pintor', 'pintor'),
  ('Carpinteiro', 'carpinteiro'),
  ('Serralheiro', 'serralheiro'),
  ('Arquitetura', 'arquitetura'),
  ('Engenharia', 'engenharia'),
  ('Decoração', 'decoracao')
) AS v(name, slug)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'casa-e-construcao') AS c
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias: Beleza
INSERT INTO categories (id, name, slug, description, icon, "parentId", active, "createdAt", "updatedAt")
SELECT gen_random_uuid(), v.name, v.slug, NULL, NULL, c.id, true, now(), now()
FROM (VALUES
  ('Cabeleireiro', 'cabeleireiro'),
  ('Barbeiro', 'barbeiro'),
  ('Maquiagem', 'maquiagem'),
  ('Manicure', 'manicure'),
  ('Pedicure', 'pedicure'),
  ('Estética', 'estetica')
) AS v(name, slug)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'beleza') AS c
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias: Eventos
INSERT INTO categories (id, name, slug, description, icon, "parentId", active, "createdAt", "updatedAt")
SELECT gen_random_uuid(), v.name, v.slug, NULL, NULL, c.id, true, now(), now()
FROM (VALUES
  ('Fotografia', 'fotografia'),
  ('Filmagem', 'filmagem'),
  ('DJ', 'dj'),
  ('Decoração', 'decoracao-eventos'),
  ('Catering', 'catering'),
  ('Organização de eventos', 'organizacao-de-eventos')
) AS v(name, slug)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'eventos') AS c
ON CONFLICT (slug) DO NOTHING;
