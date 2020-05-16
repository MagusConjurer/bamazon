var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var request = true;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err){
  if (err) throw err;
  selectAction();
});

function selectAction(){
  if(request){
    inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
      }
    ]).then(function(answer){
      switch(answer.action){
        case "View Products for Sale":
          viewProduct();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
      }
    });
  }else{
    connection.end();
  };
};

function checkRequest(){
  inquirer.prompt([
    {
      type: "confirm",
      name: "request",
      message: "Do you need to complete another action?"
    }
  ]).then(function(answer){
    if(answer.request == false){
      request = false;
      selectAction();
    } else{
      selectAction();
    }
  });
};

function viewProduct(){
  connection.query(
    "SELECT * FROM products",
    function(err,res){
      if(err) throw err;
      products = new Table({
        head: ["ID", "Product", "Price", "Stock"],
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
      });
      for(let i = 0; i < res.length; i++){
        products.push([res[i].item_id,res[i].product_name,"$" + res[i].price, res[i].stock_quantity]);
      }
      console.log(products.toString());
      checkRequest();
    });
};

function viewLowInventory(){
  connection.query(
    "SELECT * FROM products WHERE stock_quantity < 10",
    function(err,res){
      if(err) throw err;
      console.log("Products with low inventory");
      inventory = new Table({
        head: ["ID", "Product", "Price", "Stock"],
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
      });
      for(let i = 0; i < res.length; i++){
        inventory.push([res[i].item_id,res[i].product_name,"$" + res[i].price, res[i].stock_quantity]);
      }
      console.log(inventory.toString());
      checkRequest();
    });
};

function addInventory(){

}

function addProduct(){

}