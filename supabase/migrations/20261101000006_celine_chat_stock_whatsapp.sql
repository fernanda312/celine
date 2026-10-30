-- CELINE — chat read receipts, stock, and a direct WhatsApp link.
-- read_at on a message = the moment the OTHER side opened the chat and
-- saw it (WhatsApp-style "visto"). Null = sent, not yet seen.
-- stock_qty on a product: null = stock not controlled; 0 = esgotado.
-- The buyer changes the WhatsApp link in admin > Definições da loja.
alter table public.messages
  add column if not exists read_at timestamptz;
alter table public.products
  add column if not exists stock_qty integer;
alter table public.site_settings
  add column if not exists whatsapp_url text not null default 'https://wa.me/258840000000';
