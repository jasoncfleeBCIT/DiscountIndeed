const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

//local storage key for user account
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";


//holds the job table data from database
let jsonJobListArray = [];

//holds the user table data from database
let jsonUserListArray = [];

/*
******************************
PAGE ONLOAD FUNCTION
******************************
*/

//When the page loads it checks if there is any data inside the jobpost database
//if there are jobs posted it will display it
//if there aren't any jobs it will display no job have posted yet
function loadpage(){

    //checks the postjob table to see if any jobs have been posted
    //then loads it into the jsonJobListArray
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

        if(jsonJobListArray != null && jsonJobListArray.length > 0) {
            console.log("something is in the database");
            for(let position = 0; position < jsonJobListArray.length; position++){
                
                //create div to append to the div with id joblist
                //this will hold each job name and apply button
                let createDiv = document.createElement("div");
                createDiv.setAttribute('id', "job" + position);
                createDiv.setAttribute('class', 'd-flex justify-content-between eachjob');
                document.getElementById("joblist").appendChild(createDiv);


                //create the row with the job name and company and append to the div created above of the respective job container
                let createP = document.createElement("p");
                createP.setAttribute('id', "titlejob" + jsonJobListArray[position].jobID);
                createP.setAttribute('class', 'titlejob');
                createP.appendChild(document.createTextNode(jsonJobListArray[position].jobTITLE + " - " + jsonJobListArray[position].jobCOMPANY));
                document.getElementById("job" + position).appendChild(createP);


                //create the apply button for the job name and company and append into the div created above of the respective job container
                let createButton = document.createElement("button");
                createButton.setAttribute('id', "titlejobbutton" +jsonJobListArray[position].jobID);
                createButton.setAttribute('class', 'btn btn-primary applybutton');
                createButton.setAttribute('onclick', 'apply(this.id)');
                createButton.appendChild(document.createTextNode("Apply"));
                document.getElementById("job" + position).appendChild(createButton);
            }
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

/*
******************************
Other Functions 
******************************
*/

//This function will redirect the user to the createJob page if he is logged in
function postJob(){

    let userAccount = localStorage.getItem(msg_key);
    
    if(userAccount != null){
        window.location.href="createJob.html";
    }
}

//This function will clear the local storage, and redirect you back to the login page
function logoutchecker(){

    //clear the local storage
    localStorage.clear();
    window.location.href="login.html";
}

//This function uses localstorage to save the id of the selected job post, then redirects to the job description page
function apply(clicked_id){
    let code = "" + clicked_id;
    let placeholder = "";
    for(let position = 14; position < code.length; position++){
        placeholder = placeholder + code[position];
    }

    localStorage.setItem(click_key, placeholder);
    window.location.href="postedJob.html";
}

