BEGIN;

TRUNCATE
    brew_brews,
    brew_users
    RESTART IDENTITY CASCADE;

INSERT INTO brew_users (user_name, password)
VALUES 
    ('testuser1', 'password'),
    ('testuser2', 'example'),
    ('testuser3', 'testingpassword');

INSERT INTO brew_brews (name, description, method, input, output, grind, roast_level, user_id)
VALUES
    ('test title 1', 'this is the first test description', 'kalita', '36', '596', 'medium', 'light/medium', 1),
    ('test title 2', 'this is the second test description', 'V60', '21', '380', 'medium', 'light', 2),
    ('test title 3', 'this is the third test description', 'automatic', '36', '596', 'medium/coarse', 'medium', 3);

COMMIT;