create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

do $$
begin
  if not exists (
    select 1 from vault.decrypted_secrets where name = 'memory_book_worker_url'
  ) then
    raise notice 'Skipping memory-book worker schedule: vault secret memory_book_worker_url is missing';
    return;
  end if;

  if not exists (
    select 1 from vault.decrypted_secrets where name = 'memory_book_worker_secret'
  ) then
    raise notice 'Skipping memory-book worker schedule: vault secret memory_book_worker_secret is missing';
    return;
  end if;

  perform cron.unschedule(jobid)
  from cron.job
  where jobname = 'process-memory-book-jobs';

  perform cron.schedule(
    'process-memory-book-jobs',
    '* * * * *',
    $job$
      select net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'memory_book_worker_url'),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' ||
            (select decrypted_secret from vault.decrypted_secrets where name = 'memory_book_worker_secret')
        ),
        body := '{"limit": 20}'::jsonb,
        timeout_milliseconds := 50000
      );
    $job$
  );
end
$$;
