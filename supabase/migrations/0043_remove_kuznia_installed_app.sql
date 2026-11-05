-- Aplikacja Kuźnia została usunięta z kodu. Tabela prompt_sessions zostaje w bazie
-- nietknięta (jak study_* po Godzinach i math_* po Matmie); tu tylko czyścimy
-- id aplikacji z profiles.installed_apps.
update profiles
set installed_apps = array_remove(installed_apps, 'kuznia')
where 'kuznia' = any (installed_apps);
