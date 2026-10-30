-- CELINE — Storage buckets and policies. Run AFTER the RLS migration.
-- Buckets (create in the dashboard if they do not exist yet, both public):
--   celine-images     — product photos, logo and hero, uploaded by admin
--   chat-attachments  — chat files and audio, up to 5 MB (checked in code)
-- Storage policies mirror the table rules: customers read their own chat
-- files, admins manage everything, product images are publicly readable.

insert into storage.buckets (id, name, public)
  values ('celine-images', 'celine-images', true),
         ('chat-attachments', 'chat-attachments', true)
  on conflict (id) do nothing;

-- celine-images: public read; admin write/delete.
drop policy if exists "celine-images public read" on storage.objects;
create policy "celine-images public read" on storage.objects
  for select using (bucket_id = 'celine-images');
drop policy if exists "celine-images admin write" on storage.objects;
create policy "celine-images admin write" on storage.objects
  for insert with check (bucket_id = 'celine-images' and public.is_admin());
drop policy if exists "celine-images admin delete" on storage.objects;
create policy "celine-images admin delete" on storage.objects
  for delete using (bucket_id = 'celine-images' and public.is_admin());

-- chat-attachments: the owner of the folder (first path segment = user id)
-- and admins may read/write; nobody else may.
drop policy if exists "chat own read" on storage.objects;
create policy "chat own read" on storage.objects
  for select using (
    bucket_id = 'chat-attachments' and
    (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );
drop policy if exists "chat own write" on storage.objects;
create policy "chat own write" on storage.objects
  for insert with check (
    bucket_id = 'chat-attachments' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
