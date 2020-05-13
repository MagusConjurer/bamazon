CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products(
	item_id INTEGER(11) AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INTEGER(11)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Viola","music",675.00,25
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Sheet Music","music",9.99,1500
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Guitar","music",1295.45,10
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Playstation 5","electronics",499.99,200
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Mario Kart 8","electronics",59.95,150
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Google Pixel 4 XL","electronics",899.00,350
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"6 Person Tent","outdoors",214.99,50
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Sleeping Bag","outdoors",124.95,250
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"Camp Chair","outdoors",45.49,400
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES(
	"One Fish, Two Fish, Red Fish, Blue Fish","books",10.99,600
);

