var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var running = true;
var table;
var count = 0;
var numProducts;

// Credentials of the local MySQL connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err){
  if (err) throw err;
  displayCatalog();
  runRequest();
});

// Prompt for whether the user would like to make a purchase
function runRequest(){
  if(running){
    var message;
    if(count == 0){
      message = "Would you like to make a purchase?"
    } else {
      message = "Would you like to make another purchase?"
    };
    inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: message
      }]).then(function(answer){
        if(answer.confirm){
          requestID();
        } else {
          running = false;
          runRequest();
        }
      }).catch(function(err){
        if(err) throw err;
      });
  } else{
    connection.end();
  }
};

// Query the database and display a table of the products table
function displayCatalog(){
  connection.query(
    "SELECT * FROM products",
    function(err, res){
      if(err) throw err;
      console.log("\nAvailable Items");
      table = new Table({
        head: ["ID", "Product", "Price"],
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
      });
      numProducts = res.length;
      for(let i = 0; i < res.length; i++){
        table.push([res[i].item_id, res[i].product_name, "$" + res[i].price]);
      }
      console.log(table.toString());
    }
  )
};

// Query the database to make sure product is available and update stock
function placeOrder(item, amount){
  connection.query(
    "SELECT stock_quantity, price FROM products WHERE item_id = ?",
    item,
    function(err, res){
      if(err) throw err;
      var stock = res[0].stock_quantity;
      var cost = res[0].price;
      if(stock >= amount){
        console.log("Your order is being processed.")
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (stock - amount)
            },
            {
              item_id: item
            }
          ],
          function(err, res){
            if(err) throw err;
            console.log(res.affectedRows + " order has been placed.");
            console.log("Your total is: $" + (cost * amount).toFixed(2));
            runRequest();
          }
        );
        
      } else {
        console.log("We do not have enough stock to fulfill that order.");
        runRequest();
      }
    }

  );
};

// Prompt for the ID of the desired product
function requestID(){
  inquirer.prompt([
    {
      type: "number",
      name: "item",
      message: "Enter the ID of the product you would like to purchase:"
    }
  ]).then(function(answer){
    if(answer.item < 0 && answer.item > numProducts){
      console.log("Please select an ID between 1 and 10.")
    } else{
      requestQuantity(answer.item);
    }
  }).catch(function(err){
    if(err) throw err;
  });
};

// Prompt for the desired quantity
function requestQuantity(item){
  inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: "Enter the quantity you would like to purchase:"
    }
  ]).then(function(answer){
    placeOrder(item, answer.amount);
    count++;
  }).catch(function(err){
    if(err) throw err;
  });
};

