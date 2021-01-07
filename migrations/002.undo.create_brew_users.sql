ALTER TABLE brew_brews
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS brew_users;
