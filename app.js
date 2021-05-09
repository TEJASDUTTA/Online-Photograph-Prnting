const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const app = express();

var nodemailer = require("nodemailer")
var alert = require("alert")
require('dotenv').config();

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'placementseekers1179@gmail.com',
        pass: process.env.GM_PASS
    }
})



app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'db1',
    insecureAuth : true
})

connection.connect(function (error){
    if(error){
        console.log("error occured!!");
        res.render("error");
    }else{
        console.log("Connected To MySQL");
    }
})

app.get("/ind", function (req, res){
    
    connection.query("select * from prices order by length ASC;",function (error,row,feild){
        if(!!error){
            res.render("error")
        }else{
            let arr = [] ;
            for(i in row){
                let obj = {
                    size: row[i].size,
                    length: row[i].length,
                    width: row[i].Width,
                    cost: row[i].cost
                }
                arr.push(obj);
            }
           
            res.render("index",{
                data:arr
            })
            
        }
    })
})
app.post('/verify',function (req, res){
    var detail = [ 
        req.body.num,
        req.body.cvv,
        req.body.year]
    connection.query("select * from cust where cardNo = ? and cvv = ? and year_of_expiry = ?",detail,function (error,result,feild){
        if(error){
            console.log("error occured!!");
            res.render("error");
        }else{
           if(result.length == 0)
            res.render('wrong')
            else {
               
                var tran = [
                    result[0].cardNo + " / " + req.body.date + " / " + req.body.time,
                    result[0].Name,
                    req.body.cost
                ]
                connection.query("insert into tran value(?)",[tran],function(err,ans,feild){
                    if(err)
                        res.render("error")
                    else
                        console.log("Transaction Recorded");
                })

                var mailoptions = { 
                    from:"placementseekers1179@gmail.com",
                    to:result[0].Email_ID,
                    subject:"Receipt of Order",
                    text:`
                    ORDER DETAILS : 

                    Total Cost : ${req.body.cost}
                    Date of Order : ${req.body.date}

                    Name of Customer :  ${result[0].Name}

                    Email ID : ${result[0].Email_ID}

                    Pincode Of Delivery : ${result[0].PinCode}

                    Address of Delivery : ${req.body.addr}
                    
                    Card Used : ${result[0].cardNo}

                    Special Remarks : ${result[0].Other}
            
                    
                    
                    Best Wishes from Team.`
                }
                transporter.sendMail(mailoptions,(error,info)=>{
                    if(error){
                        console.log("Mail Failed");
                        res.render("error")
                    }else{
                        alert("Email Sent");
                    }
                })
                res.render("address",{
                    data : result[0],
                    date:req.body.date,
                    cost:req.body.cost,
                    addr:req.body.addr
                });
            }
            
           
        }
    })
})

app.get("/done",function(req, res){
    res.render("verified");
})


app.post('/addCard', function (req, res){
    var detail = [ 
        req.body.num,
        req.body.name,
        req.body.cvv,
        req.body.year,
        req.body.pincode,
        req.body.email,
        req.body.ddd
    ]
       
    connection.query("insert into cust value(?,?,?,?,?,?,?);",detail,function (error,row,feild){
        if(error)
        {
            console.log("error occured!!");    
        res.render("error");
    }
        else{
            console.log("New Customer Added");
            res.redirect('/ind')
        }
    })
})
app.post('/addPrice', function (req, res){
    var detail = [ 
        req.body.num,
        req.body.name,
        req.body.cvv,
        req.body.year]
    
   
    connection.query("insert into prices value(?,?,?,?);",detail,function (error,row,feild){
        if(error)
        {
            console.log("error occured!!");    
        res.render("error");
    }
        else{
            console.log("New Price Added!");
            res.redirect('/ind')
        }
    })
})


let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.listen(3000, function () {
    console.log("The server is running");
})