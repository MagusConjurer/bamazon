var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var running = true;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

var table = new Table({
  head: ["ID", "Product", "Price"],
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

connection.connect(function(err){
  if (err) throw err;
  runRequest();
});

function runRequest(){
  if(running){
    displayCatalog();
    //placeOrder(3,1);
  } else{
    connection.end();
  }
};

function displayCatalog(){
  connection.query(
    "SELECT * FROM products",
    function(err, res){
      if(err) throw err;
      console.log("Available Items");
      for(let i = 0; i < res.length; i++){
        //console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price);
        table.push([res[i].item_id, res[i].product_name, "$" + res[i].price]);
      }
      console.log(table.toString());
    }
  )
};

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
            console.log("Your total is: $" + (cost * amount));
          }
        );
        
      } else {
        console.log("We do not have enough stock to fulfill that order.");
      }
    }

  );
};