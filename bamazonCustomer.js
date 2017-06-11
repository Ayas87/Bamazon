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

    let allProducts = {
        statement: `SELECT item_id ID, product_name Product, department_name Department, price Price, stock_quantity Stock FROM Products`,
        callback: (result) => {
            productsObj = result;
            console.log('\n');
            console.table(result);
        }
    };

    query(allProducts)
        .then(() => {
            inquirer.prompt([{
                    name: 'productId',
                    message: 'What is the product ID you would like to purchase?',
                    type: 'input'
                    // validate: (input) => {
                    //     for (i = 0; i < productsObj.length; i++) {
                    //         console.log(`\n ${productsObj[i]}`);
                    //         // if (!(ID in productsObj[i])) {
                    //         //     console.log(` \n ${input} is not a valid product ID, please select a valid ID`);
                    //         // } else {
                    //         //     return true;
                    //         // }
                    //     }
                    // }
                }])
                .then((result) => {
                    let productId = parseInt(result.productId) - 1;
                    inquirer.prompt([{
                            name: 'productQty',
                            message: `How many ${productsObj[productId].Product} would you like to purchase?`,
                            type: 'input',
                            validate: (input) => {
                                if (input > productsObj[productId].Stock) {
                                    console.log(` \n Not enough in stock. There are only ${productsObj[productId].Stock} of ${productsObj[productId].Product} left in stock.`);
                                } else {
                                    return true;
                                }
                            }
                        }])
                        .then((result) => {
                            let remainingStock = parseInt(`${productsObj[productId].Stock}`) - parseInt(`${result.productQty}`);
                            console.log(remainingStock);
                            console.log(`You have purchased ${result.productQty} of ${productsObj[productId].Product}.`);
                            let purchaseItem = {
                                statement: `UPDATE Products SET stock_quantity = ${remainingStock} WHERE item_id = ${productsObj[productId].ID} `,
                                callback: (result) => {
                                    console.log(`There are ${remainingStock} of ${productsObj[productId].Product} remaining.`);
                                }
                            };
                            query(purchaseItem);
                            start();
                        });
                });
        });
};
start();