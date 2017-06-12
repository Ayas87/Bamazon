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
        console.log(result.menu);
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
                            let productId = result.productId - 1;
                            let oldstock = productsObj[productId].Stock;
                            let addstock = result.stock;
                            console.log('old stock ' + parseInt(`${oldstock}`));
                            let newStock = parseInt(`${oldstock}`) + parseInt(`${addstock}`);
                            let addStock = {
                                statement: `UPDATE Products SET stock_quantity = ${newStock} WHERE item_id = ${productId} `,
                                callback: (result) => {
                                    console.log('\033[2J');
                                    productsObj = result;
                                    console.log('\n');
                                    console.table(result);
                                }
                            };
                            // query(addStock);
                            console.log(`newStock ${newStock}`);
                            console.log(`productId ${result.productId}`)

                        });
                    });
                break;
            case 'Add New Product':
                //placeholder
                break;
            default:
                console.log('Invalid choice');
        }
    });
};

start();