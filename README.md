# CELINE — reconstrução completa (frontend + Supabase + pagamento M-Pesa)

**Não publicado. Não tocar no site ao vivo até estar verificado.**
O site ao vivo continua a ser o site estático em `celine.abrdns.com`
(GitHub Pages). Esta pasta é a reconstrução, em workspace apenas, até o
dono completar os passos abaixo e a verificação passar.

## O que é isto

- Frontend em HTML/CSS/JS simples, com o mesmo desenho do site estático:
  fundo branco puro, botões em degradê vinho → preto, hero com a primeira
  imagem inteira, Destaques em grande, cartões da coleção com 300 px,
  48 px entre colunas e 72 px entre filas, sem cortes nem zoom nas imagens
  (sem `object-cover`, sem `scale()` no hover).
- Backend em Supabase: Auth, base de dados com RLS, Storage e Edge
  Functions para o pagamento.
- **Ninguém conclui uma compra sem conta.** Carrinho → conta (criada
  automaticamente se não existir) → regresso ao checkout → número M-Pesa →
  confirmação. O texto antigo do site estático (“pagamento ainda não
  ligado, copie o resumo”) já não é o fluxo final: só aparece como erro
  quando as chaves do servidor faltam, e nunca marca uma encomenda como paga.

## Regras que este build respeita

- Conta: só email + senha. **Nenhum botão Google em lado nenhum.**
  Sem verificação por email. Email não encontrado no entrar → criar conta
  com o email já preenchido.
- Pagamento: **só M-Pesa, por STK push direto no site.** O cliente fica
  na CELINE e confirma o PIN no próprio telemóvel M-Pesa. **Nunca há
  redirecionamento para uma página de checkout hospedada.** No que o
  cliente vê, nunca aparece o nome do fornecedor de pagamentos, nunca
  e-Mola, nunca cartão. A API usa `POST /charges` com `wallet_id` da
  carteira M-Pesa (obrigatório), número 84/85, e a base é
  `https://zumbopay.com/api/public/v1`.
- Os nomes técnicos do fornecedor (`ZUMBO_API_KEY`, `ZUMBO_MERCHANT_ID`,
  `ZUMBO_WALLET_MPESA`, `ZUMBO_WEBHOOK_SECRET`) aparecem **só** no código
  do servidor (Edge Functions) e nestas instruções de configuração — nunca no
  texto que o cliente vê.
- Admin: só com conta, e só para o email do admin (ver passo 4) ou para
  um perfil com `is_admin = true`. **Nenhuma senha está escrita no código.**
- Fotos do admin: sempre por **ficheiro** (upload para o Storage), nunca
  por link.
- Nada no site diz que é de demonstração, de teste ou de pré-visualização.
- Preços: os da tabela de confiança, em MT, iguais no catálogo, na base de
  dados e no servidor. Peças sem preço (p01–p10, “Preço a confirmar”)
  **não podem ser pagas online** — o servidor recusa-as com erro 400.
- Imagens e vídeos: copiar as pastas `images/` e `videos/` do site
  estático atual para esta pasta no momento da publicação (ver passo 8).
  Não foram copiadas aqui para não duplicar os ficheiros no workspace.

## Ficheiros

```
index.html, colecao.html, produto.html, carrinho.html   (loja + checkout com conta)
conta.html                                              (entrar / criar conta, encomendas)
chat.html                                               (chat em ecrã inteiro, estilo WhatsApp)
admin.html                                              (produtos, textos, logo/hero, encomendas, chats, definições)
css/style.css
js/config.js                                            (PLACEHOLDERS — o dono preenche no passo 3)
js/catalog.js                                           (catálogo exato do site estático)
js/app.js                                               (Supabase, conta, carrinho, definições, botão do grupo)
supabase/migrations/20261101000001_celine_core.sql      (tabelas)
supabase/migrations/20261101000002_celine_rls.sql       (RLS)
supabase/migrations/20261101000003_celine_seed.sql      (produtos + definições, preços exatos)
supabase/migrations/20261101000004_celine_storage.sql   (buckets + políticas)
supabase/functions/_shared/trusted-prices.ts            (preços de confiança do servidor)
supabase/functions/create-payment/index.ts              (cria o pagamento, só M-Pesa, recalcula no servidor)
supabase/functions/zumbopay-webhook/index.ts            (verifica HMAC, marca pago, escreve o recibo no chat)
CHECKLIST.md                                            (feito vs. bloqueado)
```

## Passos do dono, por ordem

### 1. Criar o projeto Supabase
Criar um projeto novo no Supabase (nome à escolha do dono, por exemplo
`celine`). Guardar o URL do projeto e a chave anónima (`anon key`) —
são os dois valores que vão para `js/config.js` no passo 3.

### 2. Desligar a confirmação por email e NÃO ligar o Google
Em Supabase → Authentication → Providers / Sign-in:
- **Desligar “Confirm email”** (confirm email OFF). Sem isto, a conta
  criada no site não abre sessão de imediato e o fluxo “conta criada
  automaticamente” falha.
- **Não ativar o Google** nem nenhum outro fornecedor social. Só
  email + senha.

### 3. Preencher `js/config.js`
Substituir, só neste ficheiro:
- `SUPABASE_URL` pelo URL do projeto do passo 1.
- `SUPABASE_ANON_KEY` pela chave anónima do projeto.
- `ADMIN_EMAIL` pelo email do admin (o email da conta do admin, não
  uma senha — **nunca escrever uma senha neste ficheiro nem em nenhum
  outro**).

### 4. Criar a conta do admin e dar-lhe acesso
1. Abrir o site novo (ainda em local ou num domínio de teste) e criar
   a conta com o email do admin, em `conta.html`.
2. No Supabase → SQL editor, correr:
   ```sql
   update public.profiles set is_admin = true where email = 'EMAIL_DO_ADMIN';
   ```
   (com o email real do admin, entre aspas simples).
3. Confirmar que `admin.html` abre para essa conta e mostra “Sem acesso”
   para qualquer outra conta.

### 5. Correr as migrações, por ordem
No Supabase → SQL editor, correr cada ficheiro, nesta ordem:
1. `supabase/migrations/20261101000001_celine_core.sql`
2. `supabase/migrations/20261101000002_celine_rls.sql`
3. `supabase/migrations/20261101000003_celine_seed.sql`
4. `supabase/migrations/20261101000004_celine_storage.sql`

Confirmar que a tabela `products` tem 24 linhas (p01–p10, n01–n12,
n15, n16) com os preços da tabela de confiança.

### 6. Criar os buckets de Storage
Em Supabase → Storage, confirmar/criar os buckets públicos
`celine-images` e `chat-attachments` (a migração 4 já tenta criá-los;
se o painel pedir criação manual, criar como públicos). As políticas
da migração 4 tratam do resto.

### 7. Ligar o pagamento (segredos do servidor, nunca no chat nem no código)
**Importante: as credenciais NÃO vão para o GitHub.** O repositório
da CELINE é público — qualquer chave posta lá ficava visível para
toda a gente e podia ser usada por outros. No GitHub fica só o
código, com placeholders. As credenciais vão para o Supabase, que é
onde corre o código do servidor (Edge Functions).
1. Ter uma conta de comerciante no fornecedor de pagamentos
   (zumbopay.com). Se ainda não existir, criar uma — é uma conta
   separada da conta da SITIDY, salvo decisão em contrário do dono.
2. Em Supabase → Edge Functions → Secrets, definir:
   - `ZUMBO_API_KEY` (prefixo `zk_live_` em produção, `zk_test_` em teste)
   - `ZUMBO_MERCHANT_ID` (formato `MCH_…`, no painel → Programadores)
   - `ZUMBO_WALLET_MPESA` — OPCIONAL. O sistema escolhe sozinho a
     carteira M-Pesa: chama `GET /wallets` e usa a carteira M-Pesa
     (ou a única carteira da conta). Só se quiseres forçar uma
     carteira em particular é que pões aqui o `wallet_id` / código
     de 6 dígitos. Sem este segredo, o pagamento continua a funcionar.
   - `ZUMBO_WEBHOOK_SECRET`
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`
     (as Edge Functions precisam deles; a chave de serviço fica só nos
     segredos, nunca no frontend).
   A base da API já está no código: `https://zumbopay.com/api/public/v1`,
   com `POST /charges` para o STK push. Antes de publicar, confirmar
   com `GET /merchant/validate` que a conta, a carteira M-Pesa e o
   webhook estão prontos.
3. Publicar as Edge Functions:
   ```bash
   supabase functions deploy create-payment
   supabase functions deploy zumbopay-webhook
   ```
4. No painel do fornecedor de pagamentos, apontar o webhook para:
   ```
   <SUPABASE_URL>/functions/v1/zumbopay-webhook
   ```
   com o mesmo segredo do passo 2. Se o painel mostrar um nome de
   cabeçalho de assinatura diferente de `x-zumbopay-signature`,
   ajustar só essa linha em `zumbopay-webhook/index.ts` e voltar a
   publicar.

### 8. Publicar o frontend
1. Copiar `images/` e `videos/` do site estático atual para a raiz
   desta pasta (os mesmos nomes de ficheiro que `js/catalog.js` usa).
2. Publicar esta pasta no repositório do site (a decisão de substituir
   o site estático ao vivo é do dono, só depois do passo 9 passar).
3. Manter o domínio final pretendido como `celine.abrdns.com` — o
   domínio já aponta para o GitHub Pages hoje; ao publicar aqui, o
   apontamento DNS não muda, só o conteúdo publicado muda.

### 9. Testar, com um pagamento pequeno, antes de dar como pronto
1. Criar uma conta de cliente (email + senha, sem verificação).
2. Sem conta, tentar finalizar a compra: tem de ir para a conta e
   voltar ao carrinho, sem cobrar nada.
3. Com conta, pôr só peças com preço no carrinho, pagar um valor
   pequeno por M-Pesa e confirmar no telemóvel.
4. Confirmar: encomenda passa a `paid`, recibo aparece no chat, e o
   admin vê a encomenda e a conversa.
5. Confirmar o negativo: carrinho só com peças sem preço não pode ser
   pago online; sem chaves do servidor, o pagamento devolve erro e a
   encomenda fica pendente, nunca paga.
6. Só depois destes testes passar é que se pode dizer que o site está
   no ar no domínio final — e verificar abrindo `celine.abrdns.com`
   e vendo a CELINE completa.

## O que NÃO está neste build

- Nenhuma conta Supabase, nenhuma chave, nenhum URL real, nenhum
  telefone, email, morada ou preço novo foi inventado aqui. Tudo o que
  é credencial está como placeholder e é passo do dono.
- Nenhum teste ao vivo foi feito: não há projeto Supabase nem conta
  de comerciante ligados a este build, por isso nada disto foi
  verificado contra um backend real — só a sintaxe do código (ver
  CHECKLIST.md).
