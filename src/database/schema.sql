CREATE TABLE users (
    _id VARCHAR(36) PRIMARY KEY,
    _email VARCHAR(255) UNIQUE NOT NULL,
    _password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    _id VARCHAR(36) PRIMARY KEY,
    _name VARCHAR(255) NOT NULL,
    _description TEXT,
    _image LONGBLOB,
    _price DECIMAL(10,2) NOT NULL,
    _quantity INT NOT NULL,
    _userId VARCHAR(36) NOT NULL,
    FOREIGN KEY (_userId) REFERENCES users(_id) ON DELETE CASCADE
); 

INSERT INTO users (_id, _email, _password) VALUES ('1', 'teste@gmail.com', '123123123');
