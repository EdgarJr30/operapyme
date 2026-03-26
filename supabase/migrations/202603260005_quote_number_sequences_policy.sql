create policy "quote_number_sequences_select_global_admin"
on public.quote_number_sequences
for select
using (public.is_global_admin());
