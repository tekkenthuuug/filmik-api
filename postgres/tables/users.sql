BEGIN TRANSACTION;

CREATE TABLE users
(
  id int PRIMARY KEY NOT NULL,
  username varchar(32) NOT NULL,
  email text UNIQUE NOT NULL,
  joined TIMESTAMP NOT NULL
);

COMMIT;