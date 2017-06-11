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
            productsObj = result;
            console.log('\n');
            console.table(result);
            start();
        }
    };

    let viewLowInventory = {
        statement: `SELECT item_id ID, product_name Product, department_name Department, price Price, stock_quantity Stock FROM Products WHERE stock_quantity <= 5`,
        callback: (result) => {
            productsObj = result;
            console.log('\n');
            console.table(result);
            start();
        }
    };
    

    inquirer.prompt([{
        name: 'menu',
        message: 'What would you like to do?',
        type: 'list',
        choices: ['View Products for Sale','View Low Inventory','Add to Inventory', 'Add New Product']
    }]).then((result) => {
        console.log(result.menu);
        switch(result.menu){
            case 'View Products for Sale':
                query(viewProducts);
                break;
            case 'View Low Inventory':
                query(viewLowInventory);
                break;
            case 'Add to Inventory':
                //placeholder
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