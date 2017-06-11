CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products (
    item_id INT(11) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(11,2),
    stock_quantity INT (11),
    PRIMARY KEY (item_id)
);

SELECT * FROM Products;

INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES
    ('Persona 5', 'Video Games', 49.99, 100),
    ('The Witcher 3', 'Video Games', 39.99, 50),
    ('Nongshim Shin Cup Noodle Soup', 'Food', 0.99, 500),
    ('Lays Ketchup Chips', 'Food', 1.49, 250),
    ('Samsung Galaxy 8 Plus', 'Electronics', 850.00, 100),
    ('iPhone 8', 'Electronics', 10000.00, 5),
    ('Adidas Yeezy Boost 350 Turtle Dove', 'Apparel', 1999.00, 10),
    ('Adidas Stan Smith', 'Apparel', 59.99, 100),
    ('Henry the Horse', 'Animals', 50000.00, 1),
    ('Maru the Shiba Inu', 'Animals', 1500.00, 1);