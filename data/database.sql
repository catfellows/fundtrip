drop table if EXISTS favorite;

create table favorite (
    id serial PRIMARY KEY,
    location_id INT,
    name VARCHAR(500),
    description text,
    num_reviews INT,
    rating DEC,
    price_level VARCHAR(100),
    phone VARCHAR(100),
    address text,
    image text,
    latitude DEC,
    longitude DEC
);