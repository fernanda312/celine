# CELINE — Bijuteria de luxo

Site construído a partir do desenho do export giellygreen.co.uk, com as imagens e vídeos enviados pela dona.

- Fundo branco puro em todo o site.
- Botões em degradê vinho → preto, arredondados, delicados.
- Hero: imagem 1, inteira, sem cortes nem zoom, com moldura fina.
- Destaques: todas as fotografias com pessoa, em grande, nunca em cartões pequenos.
- Coleção: cartões de 300px, com 48px entre colunas e 72px entre filas, moldura fina branca.
- Vídeos: os 2 vídeos enviados — o mesmo conjunto colar + pulseira, um completo e outro em detalhe.
- Logótipo: imagem 23 com o fundo branco removido (PNG transparente), no cabeçalho, no rodapé e como favicon.
- Sem zoom no hover, sem object-cover: as imagens mantêm a sua proporção.
- Imagem 7 e imagem 12 são o mesmo ficheiro (hash idêntico) — usada só uma vez, para não repetir.
- Por confirmar pela dona: preços, contactos e entrega. Nenhum contacto ou preço foi inventado.

## Atualização 2026-10-30 — nova coleção, vídeos automáticos, loja
- Vídeos: sem player — autoplay, muted, loop, playsinline, sem som.
- Nova coleção: cartaz "Eleve o seu estilo" + 14 cartões com preços em MT escolhidos pela agente a pedido da dona (950–4.800 MT; conjuntos 2.900–4.800 MT).
- Destaques: +1 foto com pessoa (colar de diamantes, new-14), em grande.
- Loja: secção "Loja física e online" em Maputo, em alguns pontos da cidade — sem moradas inventadas; moradas exatas por dar pela dona.
- Imagens novas 16, sem duplicados; duas delas trazem texto/marca próprios na foto (sorbet accessory, EVERSTYLISH) e foram mantidas como enviadas, sem apagar nada.

## Atualização 2026-10-30 — coleção em página própria
- colecao.html: página própria da coleção, a começar pela Nova coleção (cartaz + 14 cartões com preços em MT), seguida da coleção original (10 cartões).
- Todos os botões "Ver coleção" / "Ver a coleção" abrem colecao.html numa nova página (target _blank), incluindo o botão novo dentro da secção Nova coleção na página inicial, a partir da captura enviada pela dona.
- A página inicial mantém a sua secção de coleção como pré-visualização; a página própria é a coleção completa.

## Atualização 2026-10-30 — inicial só com as primeiras imagens; detalhes e carrinho
- Página inicial: secção Nova coleção com preços REMOVIDA — a inicial fica só com as primeiras imagens (hero, destaques, coleção original sem preços, vídeos, loja). A Nova coleção com preços só aparece em colecao.html.
- Cada cartão tem "Ver brinco" (ou "Ver conjunto" nos conjuntos), que abre produto.html?id=... numa nova página, com foto grande, descrição, preço (ou "Preço a confirmar" na coleção original) e quantidade.
- Cada cartão e cada detalhe têm "Adicionar ao carrinho"; o carrinho (carrinho.html) guarda-se no navegador do visitante, mostra quantidades, total em MT das peças com preço e botão Finalizar compra.
- Comprar: no detalhe, "Comprar" mete a peça no carrinho e vai para o carrinho. A finalização, nesta fase, NÃO cobra nada: mostra o resumo do pedido para copiar/enviar à CELINE, porque o pagamento online e o contacto ainda não estão ligados — por dar pela dona (M-Pesa, WhatsApp ou outro).
