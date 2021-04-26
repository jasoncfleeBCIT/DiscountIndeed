const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:8888/API/v1/";

//local storage key for user account
const msg_key = "cst";
//local storage key for jobID selected
const click_key = "isa";

//holds data of the user accounts from the user table
let jsonUserArray = [];

/*
******************************
PAGE ONLOAD FUNCTION
******************************
*/
//When the site opens load this function
function loadpage(){

    //the moment you move to login page you lose all login data and require to login again
    //example if you click back into the login page you will need to login again
    localStorage.clear();

    //This loads the account database into the jsonUserArray once the page loads
    getalluserdata();

    //input data inside here if you need to access the user account information in the jsonUserArray
    setTimeout(function(){

    },1000);

}

/*
******************************
Client Side GET
******************************
*/

//This function gets all the account users in the "user" table in database and loads it into the global jsonUserArray
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
Other Functions 
******************************
*/

//This function checks if the username and password entered matche the database accounts
//if it does it will save the information into local storage and redirect you to the dashboard page
//if it does not match it will alert you to register
function logincheck(){

    //instantiate valid credential status to false
    let validaccountstatus = false;

    if(document.getElementById("loginuser").value.length > 0 && document.getElementById("loginpassword").value.length > 0){

        //there is user account data in the database
        if(jsonUserArray != null && jsonUserArray.length > 0){
            for(let position = 0; position < jsonUserArray.length; position++){
                let username = jsonUserArray[position].username;
                let password = jsonUserArray[position].password;

                //if the username and password matches one of the accounts on the database
                if(username === document.getElementById("loginuser").value.toUpperCase() && password === document.getElementById("loginpassword").value.toUpperCase()){

                    //the account credential matches change the validaccountstatus to true
                    validaccountstatus = true;

                    //create jason object of the username and password and save it in local storage
                    let userAccount = {
                        //could take username and password from the account array or from the input field value
                        //i chose to take it from the stored array
                        accountID: jsonUserArray[position].userID,
                        accountUsername: jsonUserArray[position].username,
                        accountPassword: jsonUserArray[position].password,
                        accountEmail: jsonUserArray[position].email,
                        accountFirstName: jsonUserArray[position].firstname,
                        accountLastName: jsonUserArray[position].lastname
                    };
                    //use .accountUsername to get the username
                    //use .accountPassword to get the password
                    //saved this in the localstorage
                    localStorage.setItem(msg_key, JSON.stringify(userAccount));

                    window.location.href="index.html";
                    break;
                }
            }

            //the credential is not valid therefore alert the user
            if(validaccountstatus === false){
                alert("Invalid Username or Password, if this is not your account kindly register an account!");
            }
            
        }else{
            alert("Invalid Username or Password, if this is not your account kindly register an account!");
        }

    }else{
        alert("Username And Password Cannot Be Empty!");
    }
}
