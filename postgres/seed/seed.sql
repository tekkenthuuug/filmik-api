BEGIN TRANSACTION;

INSERT into login
  (username, hash, email, verified)
values
  ('dardar', '$2a$10$dvfwkwb/zNNJRoQxFgYHUubPiCkGFpZbBSlyy88/e4pznsZhOaoPq', 'dardar@gmail.com', true);

INSERT into users
  (id, username, email, joined)
values
  (1, 'dardar', 'dardar@gmail.com', '2018-01-01');

INSERT into codes
  (id, email, code)
values
  (1, 'dardar@gmail.com', 'dardar');

COMMIT;