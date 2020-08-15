DROP TABLE IF EXISTS review;

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    review VARCHAR
  );