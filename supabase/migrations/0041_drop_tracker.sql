-- Aplikacja Tracker została usunięta: kasujemy tabelę tracker_days (razem z wpisami)
-- i czyścimy id aplikacji z profiles.installed_apps.
drop table if exists tracker_days;

update profiles
set installed_apps = array_remove(installed_apps, 'tracker')
where 'tracker' = any (installed_apps);
