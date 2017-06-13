require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'Bamazon'
});

let start = () => {
    let productsObj = {};

    let query = (options) => {
        let queryPromise = new Promise((resolve, reject) => {
            connection.query({
                sql: options.statement
            }, (error, results) => {
                if (error) throw error;
                resolve(options.callback(results));
            });
        });
        return queryPromise;
    };


    let viewProducts = {
        statement: `SELECT item_id ID, product_name Product, department_name Department, price Price, stock_quantity Stock FROM Products`,
        callback: (result) => {
            console.log('\033[2J');
            productsObj = result;
            console.log('\n');
            console.table(result);
            start();
        }
    };

    let viewLowInventory = {
        statement: `SELECT item_id ID, product_name Product, department_name Department, price Price, stock_quantity Stock FROM Products WHERE stock_quantity <= 5`,
        callback: (result) => {
            console.log('\033[2J');
            productsObj = result;
            console.log('\n');
            console.table(result);
            start();

        }
    };

    let selectStock = {
        statement: `SELECT item_id ID, product_name Product, department_name Department, price Price, stock_quantity Stock FROM Products`,
        callback: (result) => {
            console.log('\033[2J');
            productsObj = result;
            console.log('\n');
            console.table(result);
        }
    };

    inquirer.prompt([{
        name: 'menu',
        message: 'What would you like to do?',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then((result) => {
        // console.log(result.menu);
        switch (result.menu) {
            case 'View Products for Sale':
                query(viewProducts);
                break;
            case 'View Low Inventory':
                query(viewLowInventory);
                break;
            case 'Add to Inventory':
                query(selectStock)
                    .then((result) => {
                        inquirer.prompt([{
                                name: 'productId',
                                message: 'What Product ID would you like up add stock to?',
                                type: 'input'
                            },
                            {
                                name: 'stock',
                                message: 'How many would you like to add?',
                                type: 'input'
                            }
                        ]).then((result) => {
                            let productId = result.productId;
                            let oldstock = productsObj[productId - 1].Stock;
                            let addstock = result.stock;
                            console.log('old stock ' + parseInt(`${oldstock}`));
                            let newStock = parseInt(`${oldstock}`) + parseInt(`${addstock}`);
                            let addStock = {
                                statement: `UPDATE Products SET stock_quantity = ${newStock} WHERE item_id = ${productId}`,
                                callback: (result) => {
                                    console.log('\033[2J');
                                    console.log('\n');
                                    console.log(`Current stock is ${newStock} of product ID ${productId}. \n`);
                                    start();
                                }
                            };
                            query(addStock);
                        });
                    });
                break;
            case 'Add New Product':
                let departmentNames = {
                    statement: `SELECT department_name FROM Products`,
                    callback: (result) => {
                        console.log('\033[2J');
                        console.log('\n');
                        return result;
                    }
                };

                query(departmentNames)
                    .then((result) => {
                        let departments = [];
                        for (i = 0; i < result.length; i++) {
                            if (departments.indexOf(result[i].department_name) == -1) {
                                departments.push(result[i].department_name);
                            }
                        }
                        inquirer.prompt([{
                            name: 'department',
                            message: 'What department do you want to add your product to?',
                            type: 'list',
                            choices: departments
                        },
                        {
                            name: 'product',
                            message: 'What is the name of the product do you want to add?',
                            type: 'input',
                        },
                        {
                            name: 'price',
                            message: 'How much does each item cost?',
                            type: 'input',
                        },
                        {
                            name: 'stock',
                            message: 'How many do you want to add?',
                            type: 'input',
                        },
                        ]).then((result) => {
                            let department = result.department;
                            let product = result.product;
                            let price = result.price;
                            let stock = result.stock;
                            console.log(product,department, price, stock);
                            let addNewItem = {
                                statement: `INSERT INTO Products (product_name, department_name, price ,stock_quantity) VALUES ('${product}', '${department}', ${price}, ${stock})`,
                                // statement: 'SELECT * FROM Products',
                                callback: (result)=>{
                                    console.log(`${stock} ${product} was added to ${department} for ${price} per unit.`);
                                    start();
                                }
                            };
                            query(addNewItem);
                        });
                    });
                break;
            default:
                console.log('Invalid choice');
        }
    });
};

start();