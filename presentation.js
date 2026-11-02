// After 3 seconds, the page starts to fade out
setTimeout(function(){
    document.body.classList.add("fade-out");
}, 3000);

// After 3.5 seconds, go to the accueil page
setTimeout(function(){
    window.location.href = "accueil.html";
}, 3500);
