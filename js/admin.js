const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";
const rootUri = "/API/v1/";

//local storage key for user account
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";

//holds the user table data from database
let jsonUserListArray = [];

//holds all user psoted jobs available
let jsonJobListArray = [];

//holds the dynamic job list that will change depending if admin or normal user
let jsonUserDynamicJobListArray = [];

//holds the application table data from database
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

    //loads all the jobs from the job table into the jsonJobListArray
    getAllJobs();

    //loads all the user from the user table into the jsonUserListArray
    getallusers();

    //holds the current user data which include the userID, username, password, email, firstname, and lastname
    let currentUser = JSON.parse(localStorage.getItem(msg_key));

    //if the user is not logged in redirect to login page
    if(localStorage.length > 0){
        let createTextNode = document.createTextNode("HELLO, " + currentUser.accountUsername);
        document.getElementById("useraccount").appendChild(createTextNode);
    }else{
        window.location.href="login.html";
    }

    //we use set timeout to let the above code to load first
    setTimeout(function(){
        //builds the jobs dynamically on the left side
        buildjobside(currentUser); 
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

//This function goes through the user table and loads all data into jsonUserListArray
function getallusers(){
    let xhttp2 = new XMLHttpRequest();
    xhttp2.open("GET", endPointRoot + "getuserhistory/", true);
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
                    jsonUserListArray.push(dbDataQuestion[position]);
                }
            }).catch((dbDataQuestion) => {
                console.log('Promise Failed');
            })
        }
    };
}

/*
******************************
Client Side PUT
******************************
*/
//This function will update one job posting in the job table
function updatejob(jobObj){
    xhttp.open("PUT", endPointRoot + "updateonejob/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(jobObj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Put on the client side is working");
        }
    };
}

/*
******************************
Client Side Delete
******************************
*/
//This function will delete one job from the job table and its applicants from the applicant table
function deletejob(jobObj){
    xhttp.open("DELETE", endPointRoot + "deleteonejob/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(jobObj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Delete on the client side is working");
        }
    };
}

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

//This function dynamically builds the job posting side
function buildjobside(currentUser){

    //if you arent super admin then load filtered jobs data
    if(currentUser.accountUsername != "ADMIN" && currentUser.accountEmail != "ADMIN@GMAIL.COM"){
        //this goes through our entire job database array and filters out our own job posting and places it into an array for us to use
        if(jsonJobListArray != null && jsonJobListArray.length > 0){

            for(let position = 0; position < jsonJobListArray.length; position++){

                if(jsonJobListArray[position].employerID == currentUser.accountID){
                    jsonUserDynamicJobListArray.push(jsonJobListArray[position]);
                }
            }
        }
    //else you are super admin load all job data
    }else{
        //this goes through our entire job database array and filters out our own job posting and places it into an array for us to use
        if(jsonJobListArray != null && jsonJobListArray.length > 0){

            for(let position = 0; position < jsonJobListArray.length; position++){

                jsonUserDynamicJobListArray.push(jsonJobListArray[position]);
            }
        }
    }

    //Create the title of the job posting side (left side)
    //name change between admin mode or user mode
    let createP = document.createElement("p");
    createP.setAttribute('id', "dynamiconeTitle");
    if(currentUser.accountUsername != "ADMIN" && currentUser.accountEmail != "ADMIN@GMAIL.COM"){
        createP.appendChild(document.createTextNode("[User Mode] - My Job Posting"));
        
    }else{
        createP.appendChild(document.createTextNode("[Admin Mode] - All Job Posting"));
        document.getElementById('zero').innerHTML = 
        `<table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Method</th>
                    <th scope="col">Endpoint</th>
                    <th scope="col">Requests</th>
                </tr>
            </thead>
            <tbody id="table-data">
                <!-- DYNAMIC CONTENT WILL BE GENERATED HERE -->
            </tbody>
        </table>`;
        requestCounts();
    }
    document.getElementById("dynamiconecontainer").appendChild(createP);

    //dynamically load all job posting for admin
    //or
    //dynamically load only user made job posting for non admin
    if(jsonUserDynamicJobListArray != null && jsonUserDynamicJobListArray.length > 0) {

        for(let position = 0; position < jsonUserDynamicJobListArray.length; position++){

            let createDiv = document.createElement("div");
            createDiv.setAttribute('id', "job" + position);
            createDiv.setAttribute('class', 'd-flex justify-content-between eachjob');
            document.getElementById("joblist").appendChild(createDiv);

            let createP = document.createElement("p");
            createP.setAttribute('id', "titlejob" + jsonUserDynamicJobListArray[position].jobID);
            createP.setAttribute('class', 'titlejob');
            createP.appendChild(document.createTextNode(jsonUserDynamicJobListArray[position].jobTITLE + " - " + jsonUserDynamicJobListArray[position].jobCOMPANY));
            document.getElementById("job" + position).appendChild(createP);

            createDiv = document.createElement("div");
            createDiv.setAttribute('id', "titlejobbuttoncontainer" + position);
            document.getElementById("job" + position).appendChild(createDiv);

            let createButton = document.createElement("button");
            createButton.setAttribute('id', "titlejobedit" + jsonUserDynamicJobListArray[position].jobID);
            createButton.setAttribute('class', 'btn btn-primary adminbutton');
            createButton.setAttribute('onclick', 'editonclick(this.id)');
            createButton.appendChild(document.createTextNode("Edit"));
            createDiv.appendChild(createButton);

            createButton = document.createElement("button");
            createButton.setAttribute('id', "titlejobapplicant" + jsonUserDynamicJobListArray[position].jobID);
            createButton.setAttribute('class', 'btn btn-primary adminbutton');
            createButton.setAttribute('onclick', 'applicantonclick(this.id)');
            createButton.appendChild(document.createTextNode("Applicant"));
            createDiv.appendChild(createButton);
        }
    }else{
        console.log("there is nothing");
        let createP = document.createElement("p");
        createP.setAttribute('id', "emptydb");
        document.getElementById("joblist").appendChild(createP);
        createP.appendChild(document.createTextNode("You have not posted any jobs yet!"));
    }
}

// This function gets the request counts of all types
function requestCounts() {
    (async() => {
        let result = await fetch(endPointRoot + "queries/")
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((res) => {
            res.forEach(element => console.log(element.uri));

            res.forEach(element => createTableObject(element.type, rootUri + element.uri, element.stat));
        })
    })();
}

function createTableObject(type, uri, stat) {
    let table = document.getElementById("table-data");

    // create query row
    let tr = document.createElement("tr");
    table.appendChild(tr);

    // create data type
    let tdType = document.createElement("td");
    tdType.innerText = type.toUpperCase();

    // create data uri
    let tdUri = document.createElement("td");
    tdUri.innerText = uri;
    
    // create data stat
    let tdStat = document.createElement("td");
    tdStat.innerText = stat;

    tr.append(tdType);
    tr.append(tdUri);
    tr.append(tdStat);
}

//This function uses localstorage to save the id of the selected job post
function editonclick(clicked_id){
    
    let code = "" + clicked_id;
    let placeholder = "";
    for(let position = 12; position < code.length; position++){
        placeholder = placeholder + code[position];
    }

    // ignore above for now
    document.getElementById("dynamicitemlist").innerHTML = "";
    buildjobedit(placeholder);
}

//This function dynamically builds the respective job form and loads the data inside
function buildjobedit(thejobid){

    document.getElementById("dynamictwoTitle").innerHTML = "[Edit Mode] - Job Form";

    for(let position = 0; position < jsonUserDynamicJobListArray.length; position++){

        if(jsonUserDynamicJobListArray[position].jobID == thejobid){
            
            let createDiv = document.createElement("div");
            createDiv.setAttribute('id', "admineditjob");
            createDiv.setAttribute('class', "d-flex flex-column eachjob");
            document.getElementById("dynamicitemlist").appendChild(createDiv);

            // create job label and input with value inside
            let createLabel = document.createElement("LABEL");
            createLabel.setAttribute('id', "labeleditjobtitle");
            createDiv.appendChild(createLabel);
            createLabel.appendChild(document.createTextNode("Job"));

            let createInput = document.createElement("INPUT");
            createInput.setAttribute('id', "editjobtitle");
            createInput.setAttribute('class', "editinput");
            createInput.setAttribute('value', jsonUserDynamicJobListArray[position].jobTITLE);
            createDiv.appendChild(createInput);

            createDiv.appendChild(document.createElement("BR"));

            // create company label and input with the value inside
            createLabel = document.createElement("LABEL");
            createLabel.setAttribute('id', "labeleditjobcompany");
            createDiv.appendChild(createLabel);
            createLabel.appendChild(document.createTextNode("Company"));

            createInput = document.createElement("INPUT");
            createInput.setAttribute('id', "editjobcompany");
            createInput.setAttribute('class', "editinput");
            createInput.setAttribute('value', jsonUserDynamicJobListArray[position].jobCOMPANY);
            createDiv.appendChild(createInput);

            createDiv.appendChild(document.createElement("BR"));

            // create salary label and input with the value inside
            createLabel = document.createElement("LABEL");
            createLabel.setAttribute('id', "labeleditjobsalary");
            createDiv.appendChild(createLabel);
            createLabel.appendChild(document.createTextNode("Salary"));

            createInput = document.createElement("INPUT");
            createInput.setAttribute('id', "editjobsalary");
            createInput.setAttribute('class', "editinput");
            createInput.setAttribute('value', jsonUserDynamicJobListArray[position].jobSALARY);
            createDiv.appendChild(createInput);

            createDiv.appendChild(document.createElement("BR"));

            // create job description title label and input with the value inside
            createLabel = document.createElement("LABEL");
            createLabel.setAttribute('id', "labeleditjobdescriptiontitle");
            createDiv.appendChild(createLabel);
            createLabel.appendChild(document.createTextNode("Job Description Title"));

            createInput = document.createElement("INPUT");
            createInput.setAttribute('id', "editjobdescriptiontitle");
            createInput.setAttribute('class', "editinput");
            createInput.setAttribute('value', jsonUserDynamicJobListArray[position].jobDESCRIPTIONTITLE);
            createDiv.appendChild(createInput);

            createDiv.appendChild(document.createElement("BR"));

            // create job description  label and input with the value inside
            createLabel = document.createElement("LABEL");
            createLabel.setAttribute('id', "labeleditjobdescription");
            createDiv.appendChild(createLabel);
            createLabel.appendChild(document.createTextNode("Job Description"));

            let createTextArea = document.createElement("TEXTAREA");
            createTextArea.setAttribute('id', "editjobdescription");
            createTextArea.appendChild(document.createTextNode(jsonUserDynamicJobListArray[position].jobDESCRIPTION));
            createDiv.appendChild(createTextArea);

            createDiv.appendChild(document.createElement("BR"));

            // create div to hold the buttons
            let createDiv2 = document.createElement("div");
            createDiv2.setAttribute('id', "editbuttoncontainer");
            createDiv2.setAttribute('class', "d-flex justify-content-between");
            createDiv.appendChild(createDiv2);

            // create delete button
            let createButton = document.createElement("button");
            createButton.setAttribute('id', "editdeletebutton" + thejobid);
            createButton.setAttribute('class', "btn btn-danger adminbutton");
            createButton.setAttribute('onclick', 'deleteonclick(this.id)');
            createButton.appendChild(document.createTextNode("Delete"));
            createDiv2.appendChild(createButton);

            // create update button
            createButton = document.createElement("button");
            createButton.setAttribute('id', "editupdatebutton" + thejobid);
            createButton.setAttribute('class', "btn btn-warning adminbutton");
            createButton.setAttribute('onclick', 'updateonclick(this.id)');
            createButton.appendChild(document.createTextNode("Update"));
            createDiv2.appendChild(createButton);
        }
    }
}

//this function updates all the data for the respective job posting
function updateonclick(clicked_id){
    let code = "" + clicked_id;
    let placeholder = "";
    //parse through string to get job id
    for(let position = 16; position < code.length; position++){
        placeholder = placeholder + code[position];
    }

    let jobObj = "";

    //goes through the job array to find the job that matches our job id
    for(let position = 0; position < jsonUserDynamicJobListArray.length; position++){

        if(jsonUserDynamicJobListArray[position].jobID == placeholder){

            //builds the revised job object
            jobObj = {
                jobID: jsonUserDynamicJobListArray[position].jobID,
                employerID: jsonUserDynamicJobListArray[position].employerID,
                jobTITLE: document.getElementById("editjobtitle").value,
                jobCOMPANY: document.getElementById("editjobcompany").value,
                jobSALARY: document.getElementById("editjobsalary").value,
                jobDESCRIPTIONTITLE: document.getElementById("editjobdescriptiontitle").value,
                jobDESCRIPTION: document.getElementById("editjobdescription").value,
            };

            //send revised job object to the put request
            updatejob(jobObj);
        }
    }
    alert("Update Success!");
    //onload back to this admin page to update the job list
    window.location.href="admin.html";
}


//this function deletes the respective job posting from the database
function deleteonclick(clicked_id){
    let code = "" + clicked_id;
    let placeholder = "";
    for(let position = 16; position < code.length; position++){
        placeholder = placeholder + code[position];
    }
    console.log("JOB ID: " + placeholder);

    let jobidObj = {
        jobID: placeholder
    };

    deletejob(jobidObj);
    alert("Delete Success!");
    //onload back to this admin page to update the job list
    window.location.href="admin.html";
}

//this function displays all the applied applicants
function applicantonclick(clicked_id){

    let code = "" + clicked_id;
    let placeholder = "";
    for(let position = 17; position < code.length; position++){
        placeholder = placeholder + code[position];
    }

    //clears template for applicant list
    document.getElementById("dynamicitemlist").innerHTML = "";

    //builds the applicant list
    buildapplicantlist(placeholder);
}

//This function builds the applicant list
function buildapplicantlist(jobID){

    document.getElementById("dynamictwoTitle").innerHTML = "[Applicant Mode] - List of Applicants";
    document.getElementById("dynamicitemlist").setAttribute('class', "overflow-auto");

    //wipe the array clean again or else it will keep pushing another copy of the application table when u call getallapplicants() function
    jsonApplicationListArray = [];
    getallapplicants();

    setTimeout(function(){

        for(let position = 0; position < jsonApplicationListArray.length; position++){
        
            //if you go through the application table and find one that matches the job id of the job
            if(jsonApplicationListArray[position].jobID == jobID){

    
                let createDiv = document.createElement("div");
                createDiv.setAttribute('id', "applicant" + jsonApplicationListArray[position].applicationID);
                createDiv.setAttribute('class', "d-flex justify-content-between eachjob");
                document.getElementById("dynamicitemlist").appendChild(createDiv);
    
                let createP = document.createElement("p");
                createP.setAttribute('id', "applicantname" + jsonApplicationListArray[position].applicationID);
                createP.setAttribute('class', "titlejob");

                for(let position2 = 0; position2 < jsonUserListArray.length; position2++){
                    if(jsonUserListArray[position2].userID == jsonApplicationListArray[position].applicantID){
                        createP.appendChild(document.createTextNode(jsonUserListArray[position2].firstname + " " + jsonUserListArray[position2].lastname));
                        createDiv.appendChild(createP);
                    }
                }

                let createDiv2 = document.createElement("div");
                createDiv2.setAttribute('id', "applicantbuttoncontainer" + jsonApplicationListArray[position].applicationID);
                createDiv.appendChild(createDiv2);

                let createButton = document.createElement("button");
                createButton.setAttribute('id', "applicantcontact" + jsonApplicationListArray[position].applicantID);
                createButton.setAttribute('class', "btn btn-success adminbutton");
                createButton.setAttribute('onclick', "applicantcontactonclick(this.id)");

                //modal attribute
                createButton.setAttribute('data-toggle', "modal");
                createButton.setAttribute('data-target', "#exampleModalCenter");

                createButton.appendChild(document.createTextNode("Contact"));
                createDiv2.appendChild(createButton);

                createButton = document.createElement("button");
                createButton.setAttribute('id', "applicantdelete" + jsonApplicationListArray[position].applicationID);
                createButton.setAttribute('class', "btn btn-danger adminbutton");
                createButton.setAttribute('onclick', "applicantremoveonclick(this.id)");
                createButton.appendChild(document.createTextNode("Delete"));
                createDiv2.appendChild(createButton);
            }  
        }
    },1000);
}

//This function will pop up a modal to show the contact information of the applicant
function applicantcontactonclick(clicked_id){
    let code = "" + clicked_id;
    let placeholder = "";
    for(let position = 16; position < code.length; position++){
        placeholder = placeholder + code[position];
    }
    for(let position2 = 0; position2 < jsonUserListArray.length; position2++){
        if(jsonUserListArray[position2].userID == placeholder){
            document.getElementById("themodalbody").innerHTML = "";
            document.getElementById("themodalbody").appendChild(document.createTextNode("[Applicant Name] - " + jsonUserListArray[position2].firstname + " " + jsonUserListArray[position2].lastname));
            document.getElementById("themodalbody").appendChild(document.createElement("br"));
            document.getElementById("themodalbody").appendChild(document.createTextNode("[Applicant E-mail] - " +jsonUserListArray[position2].email)); 
        }
    }
}

//This function will remove the applicant from the job posting
function applicantremoveonclick(clicked_id){
    let code = "" + clicked_id;
    let placeholder = "";
    for(let position = 15; position < code.length; position++){
        placeholder = placeholder + code[position];
    }
    let applicantionidObj = {
        applicationID: placeholder
    };
    deleteapplicant(applicantionidObj);
    alert("Delete Success!");
    //onload back to this admin page to update the job list
    window.location.href="admin.html";
}