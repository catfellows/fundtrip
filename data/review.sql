DROP TABLE IF EXISTS review;

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    review VARCHAR
  );

  INSERT INTO review (name,review) Values ('Milka Antony' , 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis
                                cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit
                                amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat.'),
                                 ('Hisham' , 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis
                                cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit
                                amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat.'),
                                ('Walid' , 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis
                                cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit
                                amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat.');