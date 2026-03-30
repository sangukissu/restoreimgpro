create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

do $$
begin
  if not exists (
    select 1
    from vault.decrypted_secrets
    where name = 'winback_project_url'
  ) then
    raise exception 'Missing vault secret: winback_project_url';
  end if;

  if not exists (
    select 1
    from vault.decrypted_secrets
    where name = 'winback_anon_key'
  ) then
    raise exception 'Missing vault secret: winback_anon_key';
  end if;
end
$$;

select cron.schedule(
  'send-winback-email-1-hourly',
  '0 * * * *',
  $job1$
  select
    net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'winback_project_url') || '/functions/v1/send-winback-email-1',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'winback_anon_key')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 10000
    ) as request_id;
  $job1$
);

select cron.schedule(
  'send-winback-email-2-daily',
  '0 10 * * *',
  $job2$
  select
    net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'winback_project_url') || '/functions/v1/send-winback-email-2',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'winback_anon_key')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 10000
    ) as request_id;
  $job2$
);
