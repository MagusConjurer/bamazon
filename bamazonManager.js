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

// product_name, department_name, price, stock_quantity
function addInventory(){
  connection.query(
    "SELECT item_id, stock_quantity FROM products",
    function(error,results){
      if(error) throw error;
      inquirer.prompt([
        {
          type: "number",
          name: "id",
          message: "Which product ID would you like to add inventory for?"
        }
      ]).then(function(input){
        if(Number.isNaN(input.id) || (parseInt(input.id) < 1 && parseInt(input.id) > results.length)){
          console.log("Please select an ID between 1 and " + results.length);
          addInventory();
        } else{
          inquirer.prompt([
            {
              type: "number",
              name: "stock",
              message: "How much inventory do you have now?"
            }
          ]).then(function(answers){
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: answers.stock
                },
                {
                  item_id: input.id
                }
              ], 
              function(err, res) {
                if(err) throw err;
                console.log("You have updated the inventory of " + res.affectedRows + " product.");
                checkRequest();
              }
            )
          });
        }
      }).catch(function(err){
        if(err) throw err;
      });
  });
}

function addProduct(){
  inquirer.prompt([
    {
      name: "product",
      message: "What product would you like to add?"
    },
    {
      name: "department",
      message: "Which department is that product in?"
    },
    {
      type: "number",
      name: "price",
      message: "How much does each unit cost?"
    },
    {
      type: "number",
      name: "stock",
      message: "What is the starting amount in stock?"
    }
  ]).then(function(input){
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: input.product, 
        department_name: input.department, 
        price: input.price, 
        stock_quantity: input.stock
      },
      function(err,res){
        if(err) throw err;
        console.log(res.affectedRows + " product has been added to your inventory.");
        checkRequest();
      }
    )
  });
}