drop table if EXISTS favorite;
DROP TABLE if EXISTS subscribe;

create table favorite (
    id serial PRIMARY KEY,
    type VARCHAR(20),
    location_id VARCHAR(200),
    name VARCHAR(500),
    description text,
    num_reviews VARCHAR(200),
    rating DEC,
    price_level VARCHAR(100),
    phone VARCHAR(100),
    address text,
    image text,
    latitude DEC,
    longitude DEC
);

create table subscribe (
    id serial PRIMARY KEY,
    email VARCHAR(255)
);
