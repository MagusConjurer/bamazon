var mysql = require("mysql");
var inquirer = require("inquirer");

var running = true;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err){
  if (err) throw err;
  runRequest();
});

function runRequest(){
  if(running){
    displayCatalog();
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
      console.log("ID | Product | Price");
      for(let i = 0; i < res.length; i++){
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
      }

    }
  )
};

function placeOrder(item, selection){
  
};