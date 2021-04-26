const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

//local storage key for user account which will include userID, username, password, email, firstname and lastname
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";

//holds all user account data from database
let jsonUserArray = [];

/*
******************************
PAGE ONLOAD FUNCTION
******************************
*/
//When the site opens load this function
function loadpage(){

    //This loads the account database into the jsonUserArray once the page loads
    getalluserdata();
    
    //time out gives time for the getalluserdata to load data into the jsonUserArray[]
    setTimeout(function(){
        // anything inside here will have access to the user table information that is loaded into jsonUserArray[]
    },1000);
}

/*
******************************
Client Side GET
******************************
*/

//This function gets all the jobs in the "jobpost" table in database and loads it into the global jsonUserArray
function getalluserdata(){
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
                    jsonUserArray.push(dbDataQuestion[position]);
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

//This function will post the user data into the user table
function postoneuserdata(userdataObj){
    xhttp.open("POST", endPointRoot + "newuser/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(userdataObj));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("looks like client side is working");
        }
    };
}

/*
******************************
Other functions
******************************
*/

//This function checks if the username and password entered matches the user table database accounts
//also checks if email has @ and .
//if it does it will save the information into local storage and redirect you to the dashboard page
//if it does not match it will alert you to register
function registercheck(){

    //This status is true if account is available to be register
    let newaccountstatus =  true;

    //if the input field is not empty
    if(document.getElementById("accountusername").value.length > 0 &&
    document.getElementById("accountpassword").value.length > 0 &&
    document.getElementById("accountemail").value.length > 0 &&
    document.getElementById("accountfirstname").value.length > 0 &&
    document.getElementById("accountlastname").value.length > 0){

        //if user exists in the user database
        if(jsonUserArray != null && jsonUserArray.length > 0){

            //go through all the user accounts in the databse
            for(let position = 0; position < jsonUserArray.length; position++){
                let username = jsonUserArray[position].username;
                let email = jsonUserArray[position].email;

                //if username taken accounts is not available to be registered set status to false
                if(username == document.getElementById("accountusername").value.toUpperCase()){               
                    newaccountstatus = false;                   
                //else if email is taken accounts is not available to be registered set status to false
                }else if(email == document.getElementById("accountemail").value.toUpperCase()){                  
                    newaccountstatus = false;
                }
            }

            //holds the input email
            let testemail = document.getElementById("accountemail").value.toUpperCase();
            //status if there is @ in email
            let emailatstatus = false;
            //status if there is . in email
            let emaildotstatus = false;

            //if all inputs are valid so far check the email
            if(newaccountstatus == true){
                //go through the email if there is both @ and . set status to true
                for(let position = 0; position < testemail.length; position++){
                    if(testemail.charAt(position) == '@'){
                        emailatstatus = true;
                    }
                    if(testemail.charAt(position) == '.'){
                        emaildotstatus = true;
                    }
                }
            }
            
            //both email status of @ and . must be true to allow the account to be registered
            if(emailatstatus == true && emaildotstatus == true){
                newaccountstatus = true;
            }else {
                newaccountstatus = false;
            }

            //if the account is valid then create it then redirect to dashboard page
            if(newaccountstatus === true ){
                //the length of the ID will be the length 
                userAccountObj = {
                    accountID: returnNextAvailableJobID(),
                    accountUsername: document.getElementById("accountusername").value.toUpperCase(),
                    accountPassword: document.getElementById("accountpassword").value.toUpperCase(),
                    accountEmail: document.getElementById("accountemail").value.toUpperCase(),
                    accountFirstName: document.getElementById("accountfirstname").value.toUpperCase(),
                    accountLastName: document.getElementById("accountlastname").value.toUpperCase()
                };
                localStorage.setItem(msg_key, JSON.stringify(userAccountObj));
                postoneuserdata(userAccountObj);
                window.location.href="index.html";
            //if account is not valid display the message below
            }else{
                alert("Either Username or Email is Incorrect, Kindly Choose Another One!");
            }
        //when no users exist in the user database crea
        }else{
            
             //holds the input email
             let testemail = document.getElementById("accountemail").value.toUpperCase();
             //status if there is @ in email
             let emailatstatus = false;
             //status if there is . in email
             let emaildotstatus = false;
 
             //if all inputs are valid so far check the email
             if(newaccountstatus == true){
                 //go through the email if there is both @ and . set status to true
                 for(let position = 0; position < testemail.length; position++){
                     if(testemail.charAt(position) == '@'){
                         emailatstatus = true;
                     }
                     if(testemail.charAt(position) == '.'){
                         emaildotstatus = true;
                     }
                 }
             }
             
             //both email status of @ and . must be true to allow the account to be registered
             if(emailatstatus == true && emaildotstatus == true){
                 newaccountstatus = true;
             }else {
                 newaccountstatus = false;
             }
 
             //if the account is valid then create it then redirect to dashboard page
             if(newaccountstatus === true ){
                 //the length of the ID will be the length 
                 userAccountObj = {
                    accountID: "0",
                     accountUsername: document.getElementById("accountusername").value.toUpperCase(),
                     accountPassword: document.getElementById("accountpassword").value.toUpperCase(),
                     accountEmail: document.getElementById("accountemail").value.toUpperCase(),
                     accountFirstName: document.getElementById("accountfirstname").value.toUpperCase(),
                     accountLastName: document.getElementById("accountlastname").value.toUpperCase()
                 };
                 localStorage.setItem(msg_key, JSON.stringify(userAccountObj));
                 postoneuserdata(userAccountObj);
                 window.location.href="index.html";
             //if account is not valid display the message below
             }else{
                 alert("Either Username or Email is Incorrect, Kindly Choose Another One!");
             }
        }
    }else{
        alert("All Fields Must Be Filled, Try Again!");
    }
    
}

//This function redirects the user back to the login page
function cancelcheck(){
    window.location.href="login.html";
}

//This function will go through the userID and return any gap ID from deletion
function returnNextAvailableJobID(){
    let idNormalStatus = true;
    let index = 0;
    do{
        idNormalStatus = true;
        for(let position = 0; position < jsonUserArray.length; position++){
            if(jsonUserArray[position].userID === index){
                index++;
                idNormalStatus = false;
            }
        }
    }while(idNormalStatus===false);
    return index; 
}
