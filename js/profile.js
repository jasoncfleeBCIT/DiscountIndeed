const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

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

    //load all job table data into jsonJobListArray
    getallusers();

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

            for(let position = 0; position < jsonUserListArray.length; position++){

                if(jsonUserListArray[position].userID == currentUser.accountID){

                    let createLabel = document.createElement("LABEL");
                    createLabel.setAttribute('id', "accountusernamelabel");
                    createLabel.appendChild(document.createTextNode("Username"));
                    document.getElementById("inputcontainer").appendChild(createLabel);

                    let createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    let createInput = document.createElement("input");
                    createInput.setAttribute('id', "accountusername");
                    createInput.setAttribute('class', "profileinput");
                    createInput.setAttribute('type', "text");
                    createInput.setAttribute('value', jsonUserListArray[position].username);
                    createInput.disabled = true;
                    document.getElementById("inputcontainer").appendChild(createInput);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createLabel = document.createElement("LABEL");
                    createLabel.setAttribute('id', "accountpasswordlabel");
                    createLabel.appendChild(document.createTextNode("Password"));
                    document.getElementById("inputcontainer").appendChild(createLabel);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createInput = document.createElement("input");
                    createInput.setAttribute('id', "accountpassword");
                    createInput.setAttribute('class', "profileinput");
                    createInput.setAttribute('type', "text");
                    createInput.setAttribute('value', jsonUserListArray[position].password);
                    document.getElementById("inputcontainer").appendChild(createInput);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createLabel = document.createElement("LABEL");
                    createLabel.setAttribute('id', "accountemaillabel");
                    createLabel.appendChild(document.createTextNode("Email"));
                    document.getElementById("inputcontainer").appendChild(createLabel);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createInput = document.createElement("input");
                    createInput.setAttribute('id', "accountemail");
                    createInput.setAttribute('class', "profileinput");
                    createInput.setAttribute('type', "text");
                    createInput.setAttribute('value', jsonUserListArray[position].email);
                    createInput.disabled = true;
                    document.getElementById("inputcontainer").appendChild(createInput);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createLabel = document.createElement("LABEL");
                    createLabel.setAttribute('id', "accountfirstnamelabel");
                    createLabel.appendChild(document.createTextNode("First Name"));
                    document.getElementById("inputcontainer").appendChild(createLabel);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createInput = document.createElement("input");
                    createInput.setAttribute('id', "accountfirstname");
                    createInput.setAttribute('class', "profileinput");
                    createInput.setAttribute('type', "text");
                    createInput.setAttribute('value', jsonUserListArray[position].firstname);
                    document.getElementById("inputcontainer").appendChild(createInput);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createLabel = document.createElement("LABEL");
                    createLabel.setAttribute('id', "accountlastnamelabel");
                    createLabel.appendChild(document.createTextNode("Last Name"));
                    document.getElementById("inputcontainer").appendChild(createLabel);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    createInput = document.createElement("input");
                    createInput.setAttribute('id', "accountlastname");
                    createInput.setAttribute('class', "profileinput");
                    createInput.setAttribute('type', "text");
                    createInput.setAttribute('value', jsonUserListArray[position].lastname);
                    document.getElementById("inputcontainer").appendChild(createInput);

                    createBr = document.createElement("br");
                    document.getElementById("inputcontainer").appendChild(createBr);

                    let createButton = document.createElement("button");
                    createButton.setAttribute('id', "profileupdatebutton");
                    createButton.setAttribute('class', "btn btn-success btn-block");
                    createButton.setAttribute('onclick', "return profileupdatecheck()");
                    createButton.appendChild(document.createTextNode("Update"));
                    document.getElementById("updateContainer").appendChild(createButton);

                    createButton = document.createElement("button");
                    createButton.setAttribute('id', "profilecancelbutton");
                    createButton.setAttribute('class', "btn btn-danger btn-block");
                    createButton.setAttribute('onclick', "return profilecancel()");
                    createButton.appendChild(document.createTextNode("Cancel"));
                    document.getElementById("cancelContainer").appendChild(createButton);
                }
            }
    },1000);
}


/*
******************************
Client Side GET
******************************
*/

//This function goes through the user table and loads all data into jsonUserListArray
function getallusers(){
    xhttp.open("GET", endPointRoot + "getuserhistory/", true);
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
function updateprofile(profileObj){
    xhttp.open("PUT", endPointRoot + "updateuserprofile/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(profileObj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Put on the client side is working");
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

//This function will update the user profile onto the user table on database
function profileupdatecheck(){

    let currentUser = JSON.parse(localStorage.getItem(msg_key));

    let profileObj = {
        userID: currentUser.accountID,
        username: document.getElementById("accountusername").value.toUpperCase(),
        password: document.getElementById("accountpassword").value.toUpperCase(),
        email: document.getElementById("accountemail").value.toUpperCase(),
        firstname: document.getElementById("accountfirstname").value.toUpperCase(),
        lastname: document.getElementById("accountlastname").value.toUpperCase()
    }

    //update the profile of the user with profileObj
    updateprofile(profileObj);
    alert("Update Successful!");

    return false;
}

//This function redirects the user back to the dashboard page
function profilecancel(){
    window.location.href="index.html";

    return false;
}