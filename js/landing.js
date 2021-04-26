//loading text 
//Credit : Simple Landing Page Animation, John Oksasoglu
//Link : https://codepen.io/oksas/pen/GoGowK
//Detail: All code is for the loading screen and is from the website above

$(document).ready(function() {
	setTimeout(function() {
		$("#main").removeClass("is-loading");
    }, 200)
    
    setTimeout(function() {
		$("#main2").removeClass("is-loading");
	}, 800)
});

//redirects user to the login page
function getstarted(){
    window.location.href="login.html";
}