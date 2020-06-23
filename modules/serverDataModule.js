const fs = require('fs');

var employees = [];
var departments = [];

//Read employees and department json and assign it to respective arrays
module.exports.initialize = function(){
    return new Promise((resolve, reject) =>{
        fs.readFile('./data/employees.json', 'utf8', function(err,data){
            if(err){
                reject("unable to read file");
            }else{
                employees = JSON.parse(data);
                fs.readFile('./data/departments.json', 'utf8', function(err,data){
                    if(err){
                        reject("unable to read file");
                    }else{
                        departments = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    })
};

//Function to get all the employees
module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject) =>{
        if(employees.length<1){
            reject("no results returned");
        }else{
            resolve(employees);
        }
    });
};

//Function to get all the Employees by department number
module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) =>{
        if(employees.length<1){
            reject("no results returned");
        }else{
            let empArray = [];
            for(let i=0; i<employees.length; i++){
                if(employees[i].department == department){
                    empArray.push(employees[i]);
                }
            }
            if(empArray.length<1){
                reject("no results returned");
            }else{
                resolve(empArray);
            }          
        }
    });
};

//Function to get all the Employees by employee number
module.exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject) =>{
        if(employees.length<1){
            reject("no results returned");
        }else{
            let empArray = [];
            for(let i=0; i<employees.length; i++){
                if(employees[i].employeeNum == num){
                    empArray.push(employees[i]);
                }
            }
            if(empArray.length<1){
                reject("no results returned");
            }else{
                resolve(empArray);
            }          
        }
    });
};

//Function to get all the Managers
module.exports.getManagers = function(){
    return new Promise((resolve, reject) =>{
        if(employees.length<1){
            reject("no results returned");
        }else{
            let empArray = [];
            for(let i=0; i<employees.length; i++){
                if(employees[i].isManager){
                    empArray.push(employees[i]);
                }
            }
            if(empArray.length<1){
                reject("no results returned");
            }else{
                resolve(empArray);
            }          
        }
    });
};

//Function to get all the Departments
module.exports.getDepartments = function(){
    return new Promise((resolve, reject) =>{
        if(departments.length<1){
            reject("no results returned");
        }else{
            resolve(departments);
        }
    });
};

module.exports.addEmployee = function(employeeData){
    return new Promise((resolve, reject)=>{
        if(typeof employeeData.isManager === 'undefined'){
            employeeData.isManager = false;
        }  else{
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length+1;
        employees.push(employeeData);
        resolve();
    });
};

module.exports.getDepartmentById = function(id){
    return new Promise((resolve, reject) =>{
        if(departments.length<1){
            reject("no results returned");
        }else{
            let deptArray = [];
            for(let i=0; i<departments.length; i++){
                if(departments[i].departmentId == id){
                    deptArray.push(departments[i]);
                }
            }
            if(deptArray.length<1){
                reject("query returned 0 results");
            }else{
                resolve(deptArray);
            }          
        }
    });
};

module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve, reject)=>{
        if(typeof employeeData.isManager === 'undefined'){
            employeeData.isManager = false;
        }  else{
            employeeData.isManager = true;
        }
        let empNum = employeeData.employeeNum;
        let found = false;
        for(let i=0; i< employees.length; i++){
            if(empNum == employees[i].employeeNum){
                employees[i] = employeeData;
                found = true;
                break;
            }
        }
        if(found){
            resolve();
        }else{
            reject("Unable to update employee.");
        }
    });
};