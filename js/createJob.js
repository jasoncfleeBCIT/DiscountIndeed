const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

//local storage key for user account
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";

let jsonJobListArray = [];

/*
******************************
PAGE ONLOAD FUNCTION
******************************
*/
//When the site opens load this function
function loadpage() {

    //load all jobs from jobs table into the jsonJobListArray
    getAllJobs();

    //holds the current user data which would include the userID, username, password, email, firstname, lastname
    let currentUser = JSON.parse(localStorage.getItem(msg_key));

    //if there is no user logged in redirect to login page
    if (localStorage.length > 0) {
        let createTextNode = document.createTextNode("HELLO, " + currentUser.accountUsername);
        document.getElementById("useraccount").appendChild(createTextNode);
    } else {
        window.location.href = "login.html";
    }

    //input data inside here if you need to access the user account information in the jsonUserArray
    setTimeout(function () {

        console.log("length of array " + jsonJobListArray.length);

    }, 1000);
}

/*
******************************
Client Side GET
******************************
*/

//get all the data from the database jobpost table and send to the jsonJobListArray to hold
function getAllJobs() {
    xhttp.open("GET", endPointRoot + "getjobhistory/", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let q = new Promise((resolve, reject) => {
                if (JSON.parse(this.responseText).length > 0) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject('Fail');
                }
            })
            q.then((dbDataQuestion) => {
                console.log('Promise Success');
                for (let position = 0; position < dbDataQuestion.length; position++) {
                    jsonJobListArray.push(dbDataQuestion[position]);
                }
            }).catch((dbDataQuestion) => {
                console.log('Promise Failed');
            })
        }
    };
}

/*
******************************
Client Side POST
******************************
*/

//POST the json object of the job data into the job table
function postjob(jsonjobobj) {
    xhttp.open("POST", endPointRoot + "companyjob/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //xhttp.send(JSON.stringify(questionsArray[position]));
    xhttp.send(JSON.stringify(jsonjobobj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("post job to job table success");
        }
    };
}

/*
******************************
Other Functions 
******************************
*/

//This function will post a job into the job table
function createJob() {
    if (document.getElementById("jobtitle").value.length > 0 &&
        document.getElementById("jobcompany").value.length > 0 &&
        document.getElementById("jobsalary").value.length > 0 &&
        document.getElementById("sectiontitle").value.length > 0 &&
        document.getElementById("form_message").value.length > 0) {

        let jobId = "";
        let employerId = "";
        let jobTitle = "";
        let jobCompany = "";
        let jobSalary = "";
        let jobDescriptionTitle = "";
        let jobDescription = "";
        let jobpostObj = "";

        let currentUser = JSON.parse(localStorage.getItem(msg_key));

        if (jsonJobListArray != null && jsonJobListArray.length > 0) {
            jobId = returnNextAvailableJobID();
        } else {
            jobId = "0";
        }

        employerId = currentUser.accountID;
        jobTitle = document.getElementById("jobtitle").value;
        jobCompany = document.getElementById("jobcompany").value;
        jobSalary = document.getElementById("jobsalary").value;
        jobDescriptionTitle = document.getElementById("sectiontitle").value;
        jobDescription = document.getElementById("form_message").value;

        jobpostObj = {
            jobID: jobId,
            employerID: employerId,
            title: jobTitle,
            company: jobCompany,
            salary: jobSalary,
            descriptiontitle: jobDescriptionTitle,
            description: jobDescription
        };

        postjob(jobpostObj);

        window.location.assign("index.html");
    } else {
        alert("All Fields Must Be Completed, Try Again!");
    }

    return false;
}

//This function will go through the jobID and return any gap ID from deletion
function returnNextAvailableJobID() {
    let idNormalStatus = true;
    let index = 0;
    do {
        idNormalStatus = true;
        for (let position = 0; position < jsonJobListArray.length; position++) {
            if (jsonJobListArray[position].jobID === index) {
                index++;
                idNormalStatus = false;
            }
        }
    } while (idNormalStatus === false);
    return index;
}

//This function will clear the local storage, and redirect you back to the login page
function logoutchecker() {

    //clear the local storage
    localStorage.clear();
    window.location.href = "login.html";
}

//This function will redirect the user back to the dashboard page
function cancelchecker() {

    window.location.href = "index.html";
    return false;
}