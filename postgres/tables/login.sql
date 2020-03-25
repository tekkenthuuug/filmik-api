BEGIN TRANSACTION;

CREATE TABLE login
(
  id serial PRIMARY KEY,
  username varchar(32) NOT NULL,
  hash varchar(100) NOT NULL,
  email text UNIQUE NOT NULL,
  verified boolean NOT NULL DEFAULT false
);

COMMIT;