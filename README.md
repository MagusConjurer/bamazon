# bamazon
A CLI Node app that is an Amazon-like storefront with a MySQL database behind it.

### Overview
The app displays the catolog of available items and will take in orders from customers. If the item is available, then it will deplete stock from the inventory and provide the customers to see the total cost.

### How to Use
1. Download the directory
1. In the location of the download, run "npm install"
1. Run database.sql to create the database in your MySQL
   - NOTE: You may need to edit the connection paramaters in bamazonCustomer.js to match your database.
1. Run "node bamazonCustomer.js" to start the customer app
1. Follow the prompts to make a purchase
   1. Enter "y" to make a purchase
   1. Enter a number 1 - 10 to select a product
   1. Enter a quantity to purchase
1. Enter "n" when prompted to make a purchase to end the program

### Examples

bamazonCustomer

### How it Works
Using the mysql NPM, this app queries a local database with a pregenerated products table. The information is then displayed as a table in the console using the cli-table NPM. The user can provide their input with inquirer NPM.

The program will end if the user enters "n" when prompted to make a purchase. The ID request checks that the input is between 1-10, otherwise it requests another number. Once that is selected, the quantity can be selected. 

The placeOrder function queries the database to make sure the stock is available. If enough of the product is in stock, the client will receive the total of their purchase and the stock will be removed from the table. If there is not enough stock, the user will be notified and asked if they would like to make another purchase.

### Technology
- Node.js
- MySQL (with mysql npm)
- inquirer npm
- cli-table npm

