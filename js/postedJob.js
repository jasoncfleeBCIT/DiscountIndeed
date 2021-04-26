const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

//local storage key for user account
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";

//holds the job table data
let jsonJobListArray = [];

//holds the applications table data
let jsonApplicationListArray = [];

/*
******************************
PAGE ONLOAD FUNCTION
******************************
*/
//When the site opens load this function
function loadpage(){
    
    //load all database jobs into the jsonJobListArray
    getAllJobs();

    //load all the applicants into the jsonApplicationListArray
    getAllApplication();

    //holds the current user data which would include the userID, username, password, email, firstname, lastname
    let currentUser = JSON.parse(localStorage.getItem(msg_key));

    //if there is no user logged in redirect to login page
    if(localStorage.length > 0){
        let createTextNode = document.createTextNode("HELLO, " + currentUser.accountUsername);
        document.getElementById("useraccount").appendChild(createTextNode);
    }else{
        window.location.href="login.html";
    }

    //input data inside here if you need to access the user account information in the jsonUserArray
    setTimeout(function(){

        //Get the selected Job Posting's jobID from localstorage
        let jobID = localStorage.getItem(click_key);

        //instantiate selectedJob as 0 which will be used to locate the selected job in the jsonJobListArray
        let selectedJob = 0;

        //go through the jsonJobListArray to find the selected job
        for(let position = 0; position < jsonJobListArray.length; position++){
            //if the selected job is found save the index number into the variable selectedJob
            if(jsonJobListArray[position].jobID == jobID){
                selectedJob = position;
            }
        }

        //Dynamically Create the job posting for the selected job
        let createDiv = document.createElement("div");
        createDiv.setAttribute('id', "jobintroduction");
        document.getElementById("dynamicContainer").appendChild(createDiv);

        let createP = document.createElement("P");
        createP.setAttribute('id', "jobtitle");
        let createTextNode = document.createTextNode(jsonJobListArray[selectedJob].jobTITLE);
        createP.appendChild(createTextNode);
        document.getElementById("jobintroduction").appendChild(createP);

        createP = document.createElement("P");
        createP.setAttribute('id', "companytitle");
        createTextNode = document.createTextNode(jsonJobListArray[selectedJob].jobCOMPANY);
        createP.appendChild(createTextNode);
        document.getElementById("jobintroduction").appendChild(createP);

        createP = document.createElement("P");
        createP.setAttribute('id', "jobpay");
        createTextNode = document.createTextNode(jsonJobListArray[selectedJob].jobSALARY);
        createP.appendChild(createTextNode);
        document.getElementById("jobintroduction").appendChild(createP);

        if(applycheck()){

            let createButton = document.createElement("BUTTON");
            createButton.setAttribute('id', "applybutton");
            createButton.setAttribute('class', "btn btn-primary");
            createButton.setAttribute('onclick', "applytojob()");
            createTextNode = document.createTextNode("Already Applied");
            createButton.appendChild(createTextNode);
            document.getElementById("jobintroduction").appendChild(createButton);
            document.getElementById("applybutton").disabled = true;
            let createImage = document.createElement("img");
            createImage.setAttribute('id', "verifyimg");
            createImage.setAttribute('src', "images/verified.png");
            document.getElementById("jobintroduction").appendChild(createImage);

        }else{

            let createButton = document.createElement("BUTTON");
            createButton.setAttribute('id', "applybutton");
            createButton.setAttribute('class', "btn btn-primary");
            createButton.setAttribute('onclick', "applytojob()");
            createTextNode = document.createTextNode("Apply Job");
            createButton.appendChild(createTextNode);
            document.getElementById("jobintroduction").appendChild(createButton);

        }

        let createHr = document.createElement("HR");
        createHr.setAttribute('class', "splitline");
        document.getElementById("jobintroduction").appendChild(createHr);

        createDiv = document.createElement("div");
        createDiv.setAttribute('id', "jobcontent");
        document.getElementById("dynamicContainer").appendChild(createDiv);

        createP = document.createElement("P");
        createP.setAttribute('id', "jobsummary");
        createTextNode = document.createTextNode(jsonJobListArray[selectedJob].jobDESCRIPTIONTITLE);
        createP.appendChild(createTextNode);
        document.getElementById("jobcontent").appendChild(createP);

        createP = document.createElement("P");
        createP.setAttribute('id', "jobdescription");
        createTextNode = document.createTextNode(jsonJobListArray[selectedJob].jobDESCRIPTION);
        createP.appendChild(createTextNode);
        document.getElementById("jobcontent").appendChild(createP);

    },1000);
}

/*
******************************
Client Side GET
******************************
*/

//This function goes through the job post table and puts it into the jsonJobListArray
function getAllJobs(){
    //get all the jobs in the "jobpost" table in database
    xhttp.open("GET", endPointRoot + "getjobhistory/", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let q = new Promise((resolve, reject) => {
                if(JSON.parse(this.responseText).length > 0){
                    resolve(JSON.parse(this.responseText));
                }else{
                    reject('Fail');
                }   
            })
            q.then((dbDataQuestion) =>{                   
                console.log('Promise Success');
                for(let position = 0; position < dbDataQuestion.length; position++){   
                    jsonJobListArray.push(dbDataQuestion[position]);
                }
            }).catch((dbDataQuestion) => {
                console.log('Promise Failed');
            })
        }
    };
}

//This function goes through the application table and puts it into the jsonApplicationListArray
function getAllApplication(){

    let xhttp2 = new XMLHttpRequest();

    xhttp2.open("GET", endPointRoot + "getapplicationhistory/", true);
    xhttp2.send();
    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let q = new Promise((resolve, reject) => {
                if(JSON.parse(this.responseText).length > 0){
                    resolve(JSON.parse(this.responseText));
                }else{
                    reject('Fail');
                }
            })
            q.then((dbDataQuestion) =>{                   
                console.log('Promise Success');
                for(let position = 0; position < dbDataQuestion.length; position++){   
                    jsonApplicationListArray.push(dbDataQuestion[position]);
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

//POST the json object of the application object into the application table
function postApplication(jsonapplicantobj){
    xhttp.open("POST", endPointRoot + "applytojob/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(jsonapplicantobj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("post application to application table success");
        }
    };
}

/*
******************************
Other Functions 
******************************
*/

//This function will clear the local storage, and redirect you back to the login page
function logoutchecker(){

    //clear the local storage
    localStorage.clear();
    window.location.href="login.html";
}

//This function will go through the jobID and return any gap ID from deletion
function returnNextAvailableJobID(){
    let idNormalStatus = true;
    let index = 0;
    do{
        idNormalStatus = true;
        for(let position = 0; position < jsonApplicationListArray.length; position++){
            if(jsonApplicationListArray[position].applicationID === index){
                index++;
                idNormalStatus = false;
            }
        }
    }while(idNormalStatus===false);
    return index; 
}

//This function loads the Application table to the jsonApplicationListArray
//Creates the application object then post to the application table
function applytojob(){

    //load all database applications into the jsonApplicationListArray
    let applicationid = "";
    let jobid = "";
    let applicantid = "";
    let applicationObj = "";
    let applicantAppliedStatus = false;
    let myapplication = false;

    //this determines the unique applicationID primary key 
    if(jsonApplicationListArray != null && jsonApplicationListArray.length > 0){
        applicationid = returnNextAvailableJobID();
    }else {
        applicationid = 0;
    }

    //selected job posting's jobID
    jobid = localStorage.getItem(click_key);
    //current users userID
    applicantid = JSON.parse(localStorage.getItem(msg_key)).accountID;
        
    applicationObj = {
        applicationID: applicationid, 
        jobID: jobid,
        applicantID: applicantid
    };

    //Check to see if the user created the job posting
    //if user posted the job application is true
    //if user did not post the job application will remain false
    if(jsonJobListArray != null && jsonJobListArray.length > 0){
        for(let position = 0; position < jsonJobListArray.length; position++){
            if(jsonJobListArray[position].jobID == jobid && jsonJobListArray[position].employerID == applicantid){
                myapplication = true;
            }
        }
    }


    //Check to see if the user has already applied to this job
    //if applied already applicantAppliedStatus is true
    //if have not applied applicantAppliedStatus is false
    if(jsonApplicationListArray != null && jsonApplicationListArray.length > 0){
        for(let position = 0; position < jsonApplicationListArray.length; position++){
            if(jsonApplicationListArray[position].applicantID == applicantid && jsonApplicationListArray[position].jobID == jobid){
                applicantAppliedStatus = true;
                break;
            }
        }
    }

    //if the user posted this job they will not be able to apply for it
    if(myapplication === true){
        alert("You can't apply to your own job posting!");
        window.location.href="index.html";
    //else it is not their job posting they can apply for the job
    }else{
        //if user already applied for the job they will not be able to apply again
        if(applicantAppliedStatus === true){
            alert("You have already applied to this job!");
            window.location.href="index.html";
        //else the user has not applied to this job yet they will be able to apply for it
        }else{
            postApplication(applicationObj);
            alert("Successfully Applied!");
            window.location.href="index.html";
        }
    }
}

//This function checks if the user has already applied to the job
function applycheck(){

    let appliedstatus = false;
    let currentjobID = localStorage.getItem(click_key);
    let currentuserID = JSON.parse(localStorage.getItem(msg_key));

    if(jsonApplicationListArray != null && jsonApplicationListArray.length > 0){

        for(let position = 0; position < jsonApplicationListArray.length; position++){

            if(jsonApplicationListArray[position].jobID == currentjobID && jsonApplicationListArray[position].applicantID == currentuserID.accountID){

                appliedstatus = true;  
            }
        }
    }
    return appliedstatus;
}