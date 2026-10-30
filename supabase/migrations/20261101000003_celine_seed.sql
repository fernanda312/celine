-- CELINE — seed: the exact catalogue from the static site, same ids, same
-- MT prices, same descriptions. Slugs are the static ids (p01…n16) so the
-- frontend catalogue and the database agree. Run AFTER the RLS migration.
-- Storage buckets are created in the dashboard (see README.md); the image
-- paths below are the static-site paths and are replaced by Storage URLs
-- when the admin uploads a new photo by file.

insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;

insert into public.products (slug, name, category, description, price_mt, image_url, sort_order, published) values
  ('p01', 'Argolas octogonais', 'Brincos', 'Argolas em tom dourado, de desenho geométrico aberto, em octógono.', null, 'images/celine-13.jpg', 1, true),
  ('p02', 'Brincos flor', 'Brincos', 'Brincos em tom dourado, em forma de flor, de superfície trabalhada.', null, 'images/celine-14.jpg', 2, true),
  ('p03', 'Discos borgonha', 'Brincos', 'Brincos com disco borgonha e topo dourado.', null, 'images/celine-15.jpg', 3, true),
  ('p04', 'Argolas duplas torcidas', 'Brincos', 'Argolas duplas em tom dourado, com acabamento torcido.', null, 'images/celine-16.jpg', 4, true),
  ('p05', 'Hexagonais verde', 'Brincos', 'Argolas hexagonais em verde com argolas douradas.', null, 'images/celine-17.jpg', 5, true),
  ('p06', 'Argolas flor', 'Brincos', 'Argolas em tom dourado, em contorno de flor.', null, 'images/celine-18.jpg', 6, true),
  ('p07', 'Quadrados azuis', 'Brincos', 'Brincos quadrados em azul, com detalhe dourado.', null, 'images/celine-19.jpg', 7, true),
  ('p08', 'Argolas triângulo', 'Brincos', 'Argolas em tom dourado, em forma de triângulo.', null, 'images/celine-20.jpg', 8, true),
  ('p09', 'Conjunto bolas douradas', 'Colar · Brincos', 'Conjunto de colar e brincos com bolas em tom dourado.', null, 'images/celine-21.jpg', 9, true),
  ('p10', 'Brincos longos bola', 'Brincos', 'Brincos longos com bola dourada e topo em cristal.', null, 'images/celine-22.jpg', 10, true),
  ('n01', 'Conjunto completo', 'Brincos · Colar · Pulseira · Anel', 'Conjunto completo em manequim: brincos, colar, pulseira e anel em tom dourado com contas cinzentas.', 3500, 'images/celine-new-01.jpg', 11, true),
  ('n02', 'Argolas acrílico', 'Brincos', 'Argolas duplas em acrílico transparente, com topo dourado.', 1200, 'images/celine-new-02.jpg', 12, true),
  ('n03', 'Retangulares verde mármore', 'Brincos', 'Brincos retangulares em verde mármore, com risca dourada.', 1450, 'images/celine-new-03.jpg', 13, true),
  ('n04', 'Redondos verde com brilho', 'Brincos', 'Brincos redondos em verde, com brilho dourado e aro dourado.', 950, 'images/celine-new-04.jpg', 14, true),
  ('n05', 'Folha tartaruga', 'Brincos', 'Brincos em folha, em padrão tartaruga, com topo turquesa.', 1350, 'images/celine-new-05.jpg', 15, true),
  ('n06', 'Gota verde-menta', 'Brincos', 'Brincos em gota, em verde-menta com dourado.', 1100, 'images/celine-new-06.jpg', 16, true),
  ('n07', 'Semicírculo aqua', 'Brincos', 'Brincos em semicírculo aqua, com topo dourado.', 1250, 'images/celine-new-07.jpg', 17, true),
  ('n08', 'Brancos com dourado', 'Brincos', 'Brincos em branco pérola, com bolas douradas e argola.', 1600, 'images/celine-new-08.jpg', 18, true),
  ('n09', 'Disco transparente', 'Brincos', 'Brincos em disco transparente com flocos prateados e topo verde.', 1050, 'images/celine-new-09.jpg', 19, true),
  ('n10', 'Argolas verde mármore', 'Brincos', 'Argolas em verde mármore, com topo dourado.', 1300, 'images/celine-new-10.jpg', 20, true),
  ('n11', 'Disco dourado com turquesa', 'Brincos', 'Brincos com disco dourado e pedra turquesa.', 1750, 'images/celine-new-11.jpg', 21, true),
  ('n12', 'Pretos com pérola', 'Brincos', 'Brincos em preto, com pérola em tom cinzento.', 1400, 'images/celine-new-12.jpg', 22, true),
  ('n15', 'Conjunto rubi', 'Colar · Pulseira · Brincos', 'Conjunto em manequim: colar, pulseira e brincos em rubi e brilho.', 4800, 'images/celine-new-15.jpg', 23, true),
  ('n16', 'Conjunto gota dourada', 'Colar · Pulseira · Brincos', 'Conjunto em manequim: colar, pulseira e brincos em gota dourada.', 2900, 'images/celine-new-16.jpg', 24, true)
  on conflict (slug) do nothing;
