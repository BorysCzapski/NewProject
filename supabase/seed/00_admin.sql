-- ============================================================================
-- 00_admin.sql
-- Creates the built-in admin account directly in Supabase's auth schema
-- (login: "admin", password: "admin213") and promotes its profile to role
-- 'admin'. Must be run with a role that can write to auth.* (e.g. the
-- Supabase SQL Editor, which runs as postgres) — the regular anon/service
-- REST APIs cannot insert into auth.users directly.
--
-- SECURITY WARNING: change this password immediately in any real deployment
-- (Supabase Dashboard -> Authentication -> Users -> admin -> Reset password).
-- ============================================================================

do $$
declare
  v_user_id uuid;
  v_email text := 'admin@englishapp.local';
begin
  if not exists (select 1 from auth.users where email = v_email) then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_email,
      crypt('admin213', gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('username', 'admin', 'level', 'B2'),
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email', now(), now(), now()
    );
  end if;

  -- the on_auth_user_created trigger already created a 'user' profile row;
  -- promote it to admin (idempotent, safe to re-run).
  update public.profiles set role = 'admin' where username = 'admin';
end $$;
