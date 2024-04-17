-- create a database named book--

CREATE TABLE books(
    id SERIAL PRIMARY KEY ,
    title  VARCHAR(50) NOT NULL,
    notes VARCHAR(800),
    isbn VARCHAR(50),
    rating INTEGER 
    CONSTRAINT chk_rating CHECK(rating>=0 AND rating<=10)
)