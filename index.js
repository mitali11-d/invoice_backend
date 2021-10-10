const express = require('express')
const mysql = require('mysql')

const bodyParser = require('body-parser');

const {parse}=require('querystring'); 

//create connection
const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'invoice'
})

const app = express();
const urlParser=bodyParser.urlencoded({extended:false});

//connect to mysql
db.connect(err =>{
    if(err){
        throw err
    }
    console.log('MySQL Connected')
})

const app = express()

//create database
app.get('/createdb',(req,res) => {
    let sql ='CREATE DATABASE INVOICE'
    db.query(sql,err => {
        if(err){
            throw err;
        }
        res.send('Database Created');
    })
})

//create table
app.get('/api/createcustomer',(req,res) => {
    let sql='CREATE TABLE customer(customer_id int AUTO_INCREMENT, name VARCHAR(255),address VARCHAR(255),contact_number number(10),email_id VARCHAR(255),CONSTRAINT customer_pk PRIMARY KEY (customer_id))'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('customer table created');
    })
})

//insert into customer table
app.get('/api/customer1', (req, res) => {

    let post = { name: "Jake Smith", address: "plot-38,sector-8,bhubaneswar",contact_number: "7657011836",email_id: "jake@gmail.com" };
    let sql = "INSERT INTO customer SET ?";
    let query = db.query(sql, post, (err) => {
      if (err) {
        throw err;
      }
      res.send("customer 1 added");
    });
});



//insert column into customer
app.get('/api/customer2', (req, res) => {

    let post = { name: "Smith Zam", address: "plot-3,sector-10,bhubaneswar",contact_number: "7657111836",email_id: "smith@gmail.com" };
    let sql = "INSERT INTO customer SET ?";
    let query = db.query(sql, post, (err) => {
      if (err) {
        throw err;
      }
      res.send("customer 2 added");
    });
});



//table-2-order
app.get('/api/createcustomerorder',(req,res) => {
    let sql='CREATE TABLE customerorder(order_id int PRIMARY KEY,customer_id int,date DATE)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('order table created');
    })
})

//table-2-order change datatype
app.get('/api/changedatatypecustomerorder',(req,res) => {
    let sql='ALTER TABLE customerorder  MODIFY order_id VARCHAR(255)  '
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('order table datatype changed');
    })
})
//add foreign key in customerorder
app.get('/api/altercustomerorder',(req,res) => {
    let sql='ALTER TABLE customerorder ADD FOREIGN KEY (customer_id) REFERENCES customer(customer_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('order table altered');
    })
})



//table3-order items
app.get('/api/createorderitem',(req,res) => {
    let sql='CREATE TABLE orderitem(item_id int PRIMARY KEY, item_name VARCHAR(255), item_priceperqty int, item_qty int, item_discount int ,gst INT,total_amount INT)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('oderitem table created');
    })
})

//table-3-order change datatype
app.get('/api/changedatatypeorderitem',(req,res) => {
    let sql='ALTER TABLE orderitem  MODIFY item_id VARCHAR(255)  '
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem table datatype changed');
    })
})

//add column in orderitem
app.get('/api/alterorderitem',(req,res) => {
    let sql='ALTER TABLE orderitem ADD order_id int;'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem table altered');
    })
})


//add foreign key in orderitem
app.get('/api/alterorderitem1',(req,res) => {
    let sql='ALTER TABLE orderitem ADD FOREIGN KEY (customer_id) REFERENCES customer(customer_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem table altered');
    })
})

//add column in orderitem
app.get('/api/alterorderitem2',(req,res) => {
    let sql='ALTER TABLE orderitem ADD customer_id int;'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem table altered');
    })
})

//add foreign key in orderitem
app.get('/api/alterorderitem',(req,res) => {
    let sql='ALTER TABLE orderitem ADD FOREIGN KEY (order_id) REFERENCES customerorder(order_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem table altered');
    })
})


//total_amoutnt formula in orderitem
app.get('/api/alterorderitemtotal_amount',(req,res) => {
    let sql='SELECT SUM(item_qty * item_priceperqty*item_discount%+gst)  AS "total_amount" FROM orderitem;'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem total_amount altered');
    })
})


//table4-invoice details items
app.get('/api/createinvoicedetail',(req,res) => {
    let sql='CREATE TABLE invoicedetail(customer_id int,item_id VARCHAR(255))'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('invoicedetail table created');
    })
})

//add foreign key in invoicedetail
app.get('/api/alterinvoicedetailfk1',(req,res) => {
    let sql='ALTER TABLE invoicedetail ADD FOREIGN KEY (customer_id) REFERENCES customer(customer_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('invoicedetail table altered');
    })
})

//add foreign key in invoicedetail
app.get('/api/alterinvoicedetailfk2',(req,res) => {
    let sql='ALTER TABLE invoicedetail ADD FOREIGN KEY (item_id) REFERENCES orderitem(item_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('invoicedetail table altered');
    })
})

//link tables in invoicedetail
app.get('/api/joincustomertoinvoicedetail',(req,res) => {
    let sql='SELECT invoicedetail.customer_id, customer.name, customer.contact_number FROM customer RIGHT JOIN invoicedetail ON invoicedetail.customer_id = customer.customer_id ORDER BY invoicedetail.customer_id'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('invoicedetail table joined to customer');
    })
})


//link tables2 in invoicedetail
app.get('/api/joinorderitemtoinvoicedetail',(req,res) => {
    let sql='SELECT invoicedetail.item_id, orderitem.item_id FROM orderitem RIGHT JOIN invoicedetail ON invoicedetail.item_id = orderitem.item_id ORDER BY invoicedetail.item_id'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('linked table orderitem and invoicedetail');
    })
})-


//table5-totalamount items
app.get('/api/createtotalamount',(req,res) => {
    let sql='CREATE TABLE totalamount(delivery_charges int,order_id VARCHAR(255),customer_id int,total_tobepaid int)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('totalamount table created');
    })
})


//add foreign key in totalamount
app.get('/api/altertotalamountfk1',(req,res) => {
    let sql='ALTER TABLE totalamount ADD FOREIGN KEY (customer_id) REFERENCES customer(customer_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('totalamount table altered');
    })
})


//add foreign key in totalamount
app.get('/api/altertotalamountfk2',(req,res) => {
    let sql='ALTER TABLE totalamount ADD FOREIGN KEY (order_id) REFERENCES customerorder(order_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('totalamount table altered');
    })
})


//link tables2 in totalamount
app.get('/api/joinototalamountorderitem',(req,res) => {
    let sql='SELECT orderitem.customer_id, totalamount.total_amount FROM orderitem INNER JOIN totalamount ON orderitem.customer_id = totalamount.customer_id'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('linked table orderitem and invoicedetail');
    })
})-


//add column in totalamount
app.get('/api/altertotalamount',(req,res) => {
    let sql='ALTER TABLE totalamount ADD total_amount int;'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('orderitem table altered');
    })
})


//total_amoutnt formula in totalamount
app.get('/api/altertotalamounttotal_amount',(req,res) => {
    let sql='SELECT SUM(total_amount+delivery_charges)  AS "total_tobepaid" FROM totalamount;'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('totalamount total_amount altered');
    })
})


//table5-order items
app.get('/api/createtransaction',(req,res) => {
    let sql='CREATE TABLE transaction(transaction_id int PRIMARY KEY, order_id VARCHAR(255), transactio_date DATE,status VARCHAR(255),date DATE)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('transaction table created');
    })
})

//add foreign key in totalamount
app.get('/api/altertransactionfk1',(req,res) => {
    let sql='ALTER TABLE transaction ADD FOREIGN KEY (order_id) REFERENCES customerorder(order_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('transactio table altered');
    })
})

//add column in transaction
app.get('/api/altertransaction',(req,res) => {
    let sql='ALTER TABLE transaction ADD customer_id int;'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('transaction table altered');
    })
})

//add foreign key in totalamount
app.get('/api/altertransactionfk2',(req,res) => {
    let sql='ALTER TABLE transaction ADD FOREIGN KEY (customer_id) REFERENCES customer(customer_id)'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('transactio1 table altered');
    })
})

//link tables2 transaction and order
app.get('/api/joincustomerordertransaction',(req,res) => {
    let sql='SELECT customerorder.date, transaction.date FROM customerorder INNER JOIN transaction ON customerorder.order_id= transaction.order_id'
    db.query(sql,err => {
        if(err){
            throw err
        }
        res.send('linked table customerorder and transaction');
    })
})


app.listen('8080',() => {
    console.log('Server Starrted on port 8080')
})