//Express installation - npm install express
//SQL installation - npm install mysql
//Nodemon installation - npm i nodemon -g
//cd into root folder - nodemon js/jasonserver.js

const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8888;
const app = express();
const endPointRoot = "/API/v1/"

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "isaproject"
});

app.use(function (req, res, next) {
    //change this to accept one client side later instead of using * to accecpt all client side
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-Width');
    next();
});

//*************************
//*****HELPER FUNCTION ****
//*************************

/**
 * @return {Promise}
 */
function queryIncrement(uri, type) {
    let ret = new Promise((res, rej) => {

        let query = `insert into queries (uri, type, \`stat\`) values ("${uri}", "${type}", 1) on duplicate key update \`stat\` = \`stat\` + 1;`;

        connection.query(query, (err, result) => {
            if (err) {
                throw err;
            };
            console.log(result);
            res("");
        });
    });

    return ret;
}

//*************************
//*****POST SERVER SIDE****
//*************************

//this api inserts 1 job post into the database
app.post(endPointRoot + "companyjob/", (req, res) => {

    let data = "";
    let postObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        console.log("BEGIN OF POST SERVER SIDE");

        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        postObj = req.jsonBody;
        //console.log(Object.keys(req.jsonBody).length);

        queryIncrement('companyjob/', 'post').then((resolveMes) => {
            let companyjobQuery = 'INSERT INTO job (jobID, employerID, jobTITLE, jobCOMPANY, jobSALARY, jobDESCRIPTIONTITLE, jobDESCRIPTION) values (' + postObj.jobID + ',' + postObj.employerID + ',' + '"' + postObj.title + '","' + postObj.company + '","' + postObj.salary + '","' + postObj.descriptiontitle + '","' + postObj.description + '"' + ')';
            connection.query(companyjobQuery,
                (err, result) => {
                    if (err) {
                        throw err;
                    };
                    console.log(result);
                });
        });
    })
});

//this api inserts 1 user into the user table
app.post(endPointRoot + "newuser/", (req, res) => {

    let data = "";
    let postObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        postObj = req.jsonBody;
        //console.log(Object.keys(req.jsonBody).length);

        queryIncrement('newuser/', 'post')
            .then((resolveMes) => {
                let newuserQuery = 'INSERT INTO user (userID, username, password, email, firstname, lastname) values (' + '"' + postObj.accountID + '","' + postObj.accountUsername + '","' + postObj.accountPassword + '","' + postObj.accountEmail + '","' + postObj.accountFirstName + '","' + postObj.accountLastName + '"' + ')';
                connection.query(newuserQuery,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });
            })
    })
});


//this api inserts 1 applicant into the applicant table
app.post(endPointRoot + "applytojob/", (req, res) => {

    let data = "";
    let postObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        postObj = req.jsonBody;
        //console.log(Object.keys(req.jsonBody).length);

        queryIncrement('applytojob/', 'post')
            .then((resolveMes) => {
                let newapplicationQuery = 'INSERT INTO application (applicationID, jobID, applicantID) values (' + postObj.applicationID + ',' + postObj.jobID + ',' + postObj.applicantID + ')';
                connection.query(newapplicationQuery,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });
            });

    })
});


//*************************
//*****GET SERVER SIDE*****
//*************************

// user GET to send all request counts to admin side
app.get(endPointRoot + 'queries/', (req, res) => {
    queryIncrement('queries/', 'get')
            .then((resolveMes) => {
    let query = `select * from queries;`
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
})
});

//use GET to send all job data to client side
app.get(endPointRoot + "getjobhistory/", (req, res) => {
    //holds the questions data json object
    let jsonJobListArray = [];

    queryIncrement('getjobhistory/', 'get').then((resolveMes) => {
        connection.query("SELECT * FROM job", (err, result) => {
            if (err) throw err;
            //res.send(result);

            //if there is nothing in jobpost database
            if (result.length === null) {
                console.log("nothing is in the database");

                //else if there is something in the jobpost database
            } else if (result.length > 0) {
                for (let position = 0; position < result.length; position++) {
                    jsonJobListArray.push(result[position]);
                    // console.log("each job: " + result[position]);
                }
                res.send(jsonJobListArray);
            }
        });
    })


});

//use GET to send all user account data to client side
app.get(endPointRoot + "getuserhistory/", (req, res) => {
    console.log("app.get for user history");
    let jsonLoginListArray = [];

    queryIncrement('getuserhistory/', 'get')
        .then((resolveMes) => {
            connection.query("SELECT * FROM user", (err, result) => {
                if (err) throw err;
                //res.send(result);

                //if there is nothing in jobpost database
                if (result.length === null) {
                    console.log("nothing is in the database");

                    //else if there is something in the jobpost database
                } else if (result.length > 0) {
                    for (let position = 0; position < result.length; position++) {
                        jsonLoginListArray.push(result[position]);
                        // console.log("each user account: " + result[position]);
                    }
                    res.send(jsonLoginListArray);
                }
            });
        })
});

//use GET to send all application data to client side
app.get(endPointRoot + "getapplicationhistory/", (req, res) => {
    console.log("app.get for application history");
    let jsonApplicationListArray = [];
    queryIncrement('getapplicationhistory/', 'get')
        .then((resolveMes) => {
            connection.query("SELECT * FROM application", (err, result) => {
                if (err) throw err;
                //res.send(result);

                //if there is nothing in jobpost database
                if (result.length === null) {
                    console.log("nothing is in the database");

                    //else if there is something in the jobpost database
                } else if (result.length > 0) {
                    for (let position = 0; position < result.length; position++) {
                        jsonApplicationListArray.push(result[position]);
                    }
                    res.send(jsonApplicationListArray);
                }
            });
        })
});

//*************************
//*****PUT SERVER SIDE*****
//*************************

//use PUT to update respective job in the job table database
app.put(endPointRoot + "updateonejob/", (req, res) => {
    console.log("app.put on server side is being hit");
    let data = "";
    let putObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        console.log("BEGIN OF POST SERVER SIDE");

        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        putObj = req.jsonBody;
        putString = JSON.stringify(putObj);
        queryIncrement('updateonejob/', 'put')
            .then((resolveMes) => {
                //sql query to change all data of a specific job post in the job table
                let query = "" + 'update job set jobTITLE ="' + putObj.jobTITLE + '", jobCOMPANY = "' + putObj.jobCOMPANY + '", jobSALARY = "' + putObj.jobSALARY + '", jobDESCRIPTIONTITLE = "' + putObj.jobDESCRIPTIONTITLE + '", jobDESCRIPTION = "' + putObj.jobDESCRIPTION + '" where jobID = ' + putObj.jobID + ' and employerID = ' + putObj.employerID;

                connection.query(query,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });
            })
    })
});

//use PUT to update respective user profile in the user database
app.put(endPointRoot + "updateuserprofile/", (req, res) => {
    console.log("app.put on server side is being hit");
    let data = "";
    let userObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        console.log("BEGIN OF POST SERVER SIDE");

        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        userObj = req.jsonBody;
        queryIncrement('updateuserprofile/', 'put')
            .then((resolveMes) => {
                //sql query to change all data of a specific user in the user table
                let query = "" + 'update user set username ="' + userObj.username + '", password = "' + userObj.password + '", email = "' + userObj.email + '", firstname = "' + userObj.firstname + '", lastname = "' + userObj.lastname + '" where userID = ' + userObj.userID;
                connection.query(query,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });
            })
    })
});

//*************************
//***DELETE SERVER SIDE****
//*************************

//use DELETE to remove the respective job and all the applicants connected to it
app.delete(endPointRoot + "deleteonejob/", (req, res) => {
    let data = "";
    let deleteObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        console.log("BEGIN OF POST SERVER SIDE");
        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        deleteObj = req.jsonBody;
        queryIncrement('deleteonejob/', 'delete')
            .then((resolveMes) => {
                //deletes all applicants connected to job first
                let query = "" + 'delete from application where jobID = ' + deleteObj.jobID;
                connection.query(query,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });

                //once all the connections to the job is removed, we will now be able to delete the job itself from the database
                query = "" + 'delete from job where jobID = ' + deleteObj.jobID;
                connection.query(query,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });
            })
    })
});

//use DELETE to remove the applicant from the job
app.delete(endPointRoot + "deleteoneapplicant/", (req, res) => {
    let data = "";
    let applicationObj = "";
    req.on('data', function (otherData) {
        data += otherData
    })
    req.on('end', function () {
        console.log("BEGIN OF POST SERVER SIDE");
        //in string
        req.rawBody = data;
        //in JSON Object
        req.jsonBody = JSON.parse(data);
        applicationObj = req.jsonBody;
        queryIncrement('deleteoneapplicant/', 'delete')
            .then((resolveMes) => {
                //deletes all applicants connected to job first
                let query = "" + 'delete from application where applicationID = ' + applicationObj.applicationID;
                connection.query(query,
                    (err, result) => {
                        if (err) {
                            throw err;
                        };
                        console.log(result);
                    });
            })
    })
});


app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
});