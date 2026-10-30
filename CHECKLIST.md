# CELINE full-stack — CHECKLIST

## Construído (em workspace apenas, NÃO publicado, NÃO verificado ao vivo)

- [x] Frontend adaptado do site estático, mesmo desenho (branco puro,
      botões vinho → preto, hero imagem 1, Destaques em grande, cartões
      300 px, sem cortes/zoom): `index.html`, `colecao.html`,
      `produto.html`, `carrinho.html`.
- [x] Catálogo exato copiado do site estático (`js/catalog.js`): 24
      produtos, p01–p10 sem preço, n01–n12/n15/n16 com os preços MT
      exatos (3500, 1200, 1450, 950, 1350, 1100, 1250, 1600, 1050, 1300,
      1750, 1400, 4800, 2900). Nenhum produto, preço, contacto, morada
      ou facto novo inventado.
- [x] Conta: email + senha apenas, sem botão Google em nenhuma página.
      Email não encontrado no entrar → criar conta com o email já
      preenchido. Criação automática de conta no mesmo fluxo.
      `conta.html` + `js/app.js` (signIn/signUp).
- [x] Porta do checkout (regra dura): sem conta, ninguém conclui a
      compra. O carrinho fica guardado como intenção pendente
      (`celine-pending`) e o visitante volta ao checkout depois da
      conta. O texto antigo “pagamento ainda não ligado, copie o
      resumo” foi retirado do fluxo final; só resta como erro de
      fallback quando as chaves do servidor faltam, e nunca marca a
      encomenda como paga.
- [x] Admin robusto (`admin.html`), com porta por email do admin ou
      `is_admin`, sem senha no código: produtos (criar/editar/apagar/
      mover, foto só por ficheiro para o Storage), textos, logo e hero
      (que alimentam também o cabeçalho do chat), encomendas (lista +
      estado), chats (ver + responder), definições da loja incluindo o
      link do grupo.
- [x] Chat em ecrã inteiro, estilo WhatsApp, nunca flutuante
      (`chat.html`): só depois da conta, bolhas com hora, anexos até
      5 MB, áudio com MediaRecorder, recibo depois do pagamento
      confirmado (escrito pelo webhook). Botão do grupo no chat e
      depois de muito tempo no site (tempo/scroll configuráveis no
      admin), com o link das definições.
- [x] Supabase: 4 migrações (tabelas, RLS, seed, Storage).
      RLS: cliente só vê as suas encomendas/chats; público só lê
      produtos publicados e definições; admin vê e gere tudo.
- [x] Pagamento M-Pesa apenas, no servidor, por STK push direto no
      site (atualização 2026-10-30, a partir da documentação oficial
      enviada pela dona): `create-payment` recalcula o total a partir
      da lista de confiança, chama `POST /charges` na base
      `https://zumbopay.com/api/public/v1` com `wallet_id` da carteira
      M-Pesa (obrigatório), número 84/85 normalizado para 25884/25885
      e `source_id` = id da encomenda. O cliente fica na CELINE e
      confirma o PIN no próprio telemóvel — **sem redirecionamento
      para checkout hospedado** (`checkout_url: null`, `redirect:
      false`). Devolve 503 sem chaves e nunca finge um pagamento;
      `zumbopay-webhook` verifica HMAC (`x-zumbopay-signature`),
      aceita `payment.succeeded` e marca pago e escreve o recibo no
      chat. Peças sem preço são recusadas (400).
- [x] Nada no texto do cliente diz o nome do fornecedor de pagamentos,
      e-Mola ou cartão; nada no site diz que é demonstração, teste ou
      pré-visualização. Os nomes técnicos do fornecedor só aparecem no
      código do servidor e no README (instruções de configuração).
- [x] Sintaxe verificada: todos os ficheiros JS e todos os scripts
      inline das páginas passaram em `node --check`; o SQL e o
      TypeScript das Edge Functions foram verificados por equilíbrio de
      parênteses/chavetas e revisão, e por pesquisa de palavras
      proibidas no frontend (ver “Verificações feitas”). O `deno check`
      NÃO estava disponível neste ambiente, por isso as Edge Functions
      não passaram por um type-check do Deno — correr `deno check` ou
      `supabase functions deploy` antes de as publicar é um passo do
      dono (ver README, passo 7).

## Bloqueado — precisa do dono, antes de ir ao ar

- [ ] Projeto Supabase (URL + chave anónima) — preencher em `js/config.js`.
- [ ] Desligar “Confirm email” no Supabase e NÃO ativar o Google.
- [ ] Email do admin — preencher em `js/config.js` e dar `is_admin = true`
      no SQL (passo 4 do README). Nenhuma senha foi usada nem guardada.
- [ ] Correr as 4 migrações e criar os buckets (passos 5–6 do README).
- [ ] Conta de comerciante no fornecedor de pagamentos e segredos das
      Edge Functions (`ZUMBO_API_KEY`, `ZUMBO_MERCHANT_ID`,
      `ZUMBO_WEBHOOK_SECRET`; `ZUMBO_WALLET_MPESA` é opcional — o sistema
      escolhe sozinho a carteira M-Pesa) — por via segura, nunca
      no chat nem no código. Base da API já fixada no código:
      `https://zumbopay.com/api/public/v1`.
- [ ] Apontar o webhook no painel do fornecedor para
      `<SUPABASE_URL>/functions/v1/zumbopay-webhook`.
- [ ] Copiar `images/` e `videos/` do site estático para esta pasta e
      publicar o frontend (passo 8 do README).
- [ ] Teste ao vivo com um pagamento pequeno por M-Pesa (passo 9 do
      README) e verificação abrindo `celine.abrdns.com`.

## Desvios do pedido, com motivo

1. **Imagens/vídeos não copiados para esta pasta.** Para não duplicar
   ~40 ficheiros de imagem no workspace, o frontend referencia os
   mesmos nomes de ficheiro e o README manda copiá-los no momento da
   publicação. O desenho e os caminhos são os mesmos; nada foi alterado
   nas imagens.
2. **Endpoint do fornecedor, corrigido a partir da documentação
   oficial (2026-10-30).** A primeira versão deixava o endpoint como
   segredo por falta de informação; a documentação enviada pela dona
   confirma a base `https://zumbopay.com/api/public/v1` e o fluxo
   STK direto `POST /charges`. A função agora usa essa base fixa
   (com override opcional só se a documentação da conta mostrar
   outra) e já não depende de um URL inventado. O que continua a
   depender da conta real: chave e merchant id. A carteira M-Pesa é
   escolhida sozinha pelo sistema (`GET /wallets`); `ZUMBO_WALLET_MPESA`
   é só um extra opcional.
3. **Nome do cabeçalho da assinatura do webhook.** Usado
   `x-zumbopay-signature`, o padrão já usado noutros sites do mesmo
   padrão; o README diz para ajustar só essa linha se o painel da
   conta mostrar outro nome.
4. **Admin também aceita `is_admin` no perfil, além do email em
   `js/config.js`.** O pedido pede porta por email; o `is_admin` é a
   segunda camada que o RLS já exige, para o dono não ficar trancado
   fora se o email em `js/config.js` estiver por preencher. Nenhuma
   das duas camadas usa senha no código.

## Verificações feitas

- `node --check` em todos os ficheiros `.js` (ver saída no relatório).
- Pesquisa no frontend (HTML/JS/CSS) por nomes do fornecedor, e-Mola,
  e palavras de demonstração/teste/pré-visualização: só ocorrem onde
  são permitidas (código do servidor e README/CHECKLIST).
- Pesquisa por segredos reais no build: nenhum URL, chave, telefone,
  email ou senha real — só os placeholders `SUPABASE_URL`,
  `SUPABASE_ANON_KEY`, `ADMIN_EMAIL_POR_DEFINIR` e os nomes de
  segredos das Edge Functions.
- **Não verificado ao vivo:** não há projeto Supabase nem conta de
  comerciante ligados a este build; nada foi publicado, nada foi
  corrido contra um backend real, e nada aqui deve ser apresentado
  como estando no ar.
