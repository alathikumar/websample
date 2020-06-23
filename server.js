/********************************************************************************* 
 * WEB700 – Assignment 06 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *  
 * Name: Abin Lathikumar Student ID: 140968181 Date: 11/27/2019
 * 
 * Online (Heroku) Link: https://abin-web700.herokuapp.com/
 * 
 * ********************************************************************************/

var express = require("express");
var expresshbs = require("express-handlebars");
var path = require("path");
const bodyParser = require('body-parser');

var serverDataModule = require("./modules/serverDataModule");

var HTTP_PORT = process.env.PORT || 8080;

var app = express(); // setup a 'route' to listen on the default url path

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", expresshbs({ 
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li'+ ((url==app.locals.activeRoute ? 
                ' class="nav-item active"': ' class="nav-item"')) 
                +'><a class="nav-link" href="'+ url +'">'+ options.fn(this) +'</a></li>';
        },
        equal: function(lvalue, rvalue, options){
            if(arguments.length<3){
                throw new Error("Handlebar Helper 'equal' requires 3 parameters");               
            }

            return (lvalue==rvalue) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set("view engine", ".hbs");

app.use((req, res, next) =>{
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route=="/") ? "/" : route.replace(/\/$/,"");
    next();
});

app.get("/", (req, res) => { 
    res.render("home");
});

app.get("/about", (req, res) => { 
    res.render("about");
});

app.get("/htmlDemo", (req, res) => { 
    res.render("htmlDemo");
});

app.get("/employees", (req, res)=>{
    let queryString = req.query;
    let deptNum = req.query.department;
    if(JSON.stringify(queryString) == '{}'){
        serverDataModule.getAllEmployees().then((empData)=>{
            res.render("employees",{
                data: empData
            });
        }).catch((msg)=>{
            res.render("employees",{
                message: msg
            });
        });
    }else{
        if(deptNum){
            serverDataModule.getEmployeesByDepartment(deptNum).then((empData)=>{
                res.render("employees",{
                    data: empData
                });
            }).catch((msg)=>{
                res.render("employees",{
                    message: msg
                });
            });
        }else{
            var errorObj = {
                code: 400,
                msg: "Bad Request"
            };
            res.status(404).render("notFound",{
                data: errorObj,
                layout: false
            });
        }
    }
    
    
});

app.get("/employee/:num", (req, res)=>{
    let num = req.params.num;
    serverDataModule.getEmployeeByNum(num).then((empData)=>{
        res.render("employee",{
            employee: empData[0]
        });
    }).catch((msg)=>{
        res.render("employee",{
            message: msg
        });
    });
});

app.get("/employees/add", (req, res)=>{
    res.render("addEmployee");
});

app.get("/departments", (req, res)=>{
    serverDataModule.getDepartments().then((depData)=>{
        res.render("departments",{
            data: depData
        });
    }).catch((msg)=>{
        res.render("departments",{
            message: msg
        });
    });
});

app.get("/department/:num", (req, res) =>{
    let num = req.params.num;
    serverDataModule.getDepartmentById(num).then((deptData)=>{
        res.render("department",{
            department: deptData[0]
        });
    }).catch((msg)=>{
        res.render("department",{
            message: msg
        });
    });
});

app.post("/employees/add", (req, res)=>{
    serverDataModule.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    });
});

app.post("/employee/update", (req, res) =>{
    serverDataModule.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    });
});

app.use((req, res) => {
    var errorObj = {
        code: 404,
        msg: "Not Found"
    };
    res.status(404).render("notFound",{
        data: errorObj,
        layout: false
    });
  });

serverDataModule.initialize().then(()=>{
    // setup http server to listen on HTTP_PORT 
    app.listen(HTTP_PORT, ()=>{
        console.log("server listening on port: " + HTTP_PORT)
    });
}).catch((msg) =>{
    res.json({message:msg});
});
