const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

//local storage key for user account
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";


//holds the job data from database
let jsonJobListArray = [];

//holds the user data from database
let jsonUserListArray = [];

//hold the applications data from database
let jsonApplicationListArray = [];

/*
******************************
PAGE ONLOAD FUNCTION
******************************
*/

//When the page loads it checks if there is any data inside the jobpost database
//if there are jobs posted it will display it
//if there aren't any jobs it will display no job have posted yet
function loadpage(){

    //load all application table data into jsonApplicationListArray
    getallapplicants();

    //load all job table data into jsonJobListArray
    getAllJobs();

    //holds the current user data which would include the userID, username, password, email, firstname, lastname
    let currentUser = JSON.parse(localStorage.getItem(msg_key));

    //if there is no user logged in redirect to login page
    if(localStorage.length > 0){
        let createTextNode = document.createTextNode("HELLO, " + currentUser.accountUsername);
        document.getElementById("useraccount").appendChild(createTextNode);
    }else{
        window.location.href="login.html";
    }
    setTimeout(function(){

        //if there is job applications in the database
        if(jsonApplicationListArray != null && jsonApplicationListArray.length > 0) {

            //look through all the job applications
            for(let position = 0; position < jsonApplicationListArray.length; position++){

                //if there is a job application that from the current user
                if(jsonApplicationListArray[position].applicantID == currentUser.accountID){
    
                    let searchjobID = jsonApplicationListArray[position].jobID;
                    
                    //display each of the application from the current user
                    for(let position2 = 0; position2 < jsonJobListArray.length; position2++){
    
                        if(jsonJobListArray[position2].jobID == searchjobID){
    
                            let createDiv = document.createElement("div");
                            createDiv.setAttribute('id', "job" + position2);
                            createDiv.setAttribute('class', 'd-flex justify-content-between eachjob');
                            document.getElementById("joblist").appendChild(createDiv);
    
    
                            //create the row with the job name and company and append to the div created above of the respective job container
                            let createP = document.createElement("p");
                            createP.setAttribute('id', "titlejob" + jsonJobListArray[position2].jobID);
                            createP.setAttribute('class', 'titlejob');
                            createP.appendChild(document.createTextNode(jsonJobListArray[position2].jobTITLE + " - " + jsonJobListArray[position2].jobCOMPANY));
                            document.getElementById("job" + position2).appendChild(createP);
    
    
                            //create the apply button for the job name and company and append into the div created above of the respective job container
                            let createButton = document.createElement("button");
                            createButton.setAttribute('id', "titlejobbutton" +jsonApplicationListArray[position].applicationID);
                            createButton.setAttribute('class', 'btn btn-danger cancelapplicationbutton');
                            createButton.setAttribute('onclick', 'cancelapplication(this.id)');
                            createButton.appendChild(document.createTextNode("Cancel Application"));
                            document.getElementById("job" + position2).appendChild(createButton);
                        }
                    }
                }
            }
        //if there is no application from the current user then display that there is nothing
        }else{
            console.log("there is nothing");
            let createP = document.createElement("p");
            createP.setAttribute('id', "emptydb");
            document.getElementById("joblist").appendChild(createP);
            createP.appendChild(document.createTextNode("There are currently no available jobs, try again later!"));
        }
    },1000);
    
}

/*
******************************
Client Side GET
******************************
*/

// This function goes through the job post table and puts it into the jsonJobListArray
function getAllJobs(){
    //created a new xmlhttprequest to load another request
    let xhttp2 = new XMLHttpRequest();

    //get all the jobs in the "jobpost" table in database
    xhttp2.open("GET", endPointRoot + "getjobhistory/", true);
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
                    jsonJobListArray.push(dbDataQuestion[position]);
                }
            }).catch((dbDataQuestion) => {
                console.log('Promise Failed');
            })
        }
    };
}

//This function goes through the applicantion table and puts it into the jsonApplicationListArray
function getallapplicants(){
    //get all the jobs in the "jobpost" table in database
    xhttp.open("GET", endPointRoot + "getapplicationhistory/", true);
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
Client Side DELETE
******************************
*/

//This function will delete one job from the job table and its applicants from the applicant table
function deleteapplicant(applicantObj){
    xhttp.open("DELETE", endPointRoot + "deleteoneapplicant/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(applicantObj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Delete on the client side is working");
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

//This function deletes the respective application user selects from the appliation table
function cancelapplication(clicked_id){
    let code = "" + clicked_id;
    let placeholder = "";

    //the position starts at xx as the ID is set after the length of xx
    for(let position = 14; position < code.length; position++){
        placeholder = placeholder + code[position];
    }

    //create object to send ID to the server side
    let applicationObj = {
        applicationID: placeholder
    }

    //deletes the application with the id inside the obj
    deleteapplicant(applicationObj)
    alert("Succesfully Canceled Application!")
    window.location.href="applicationhistory.html";
}
