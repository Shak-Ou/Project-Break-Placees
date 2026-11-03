const sensorPlace = document.getElementById("sensorplace");

// Get the elements of the map
const map = document.getElementById("library-map");
const freePlaces = document.querySelectorAll(".place.free");
const directionLine = document.getElementById("direction-line");
const directionButtons = document.getElementById("direction-buttons");

const username = "XXX";
const activeKey = "XXX";

// Timer used to show the buttons after the animation of the map

let timer;

function updateSensorPlace() {
//Connexionn to Adafruit IO, to get the data from the sensors, to know if the places are free or not
fetch("https://io.adafruit.com/api/v2/XXX/feeds/break/data/last", {

    headers: {"X-AIO-Key": activeKey}

})
        .then(function(response) { return response.json(); })
        .then(function(data) {
            const isFree = data.value === "1";

            // Green triangle if free, red triangle if taken
            sensorPlace.classList.toggle("free", isFree);
            sensorPlace.classList.toggle("busy", !isFree);
            sensorPlace.setAttribute("aria-label", isFree ? "Place libre" : "Place occupée");
        
        });

}

// Check once when the page opens, then every 5 seconds
updateSensorPlace();
setInterval(updateSensorPlace, 5000);

// For each green triangle, listen to the click
freePlaces.forEach(function(place){
    place.addEventListener("click", function(){
        if (place.classList.contains("busy")) return;

        // Stop the previous timer if the user clicks again quickly
        clearTimeout(timer);

        // Hide the line and the buttons while the map moves
        directionLine.classList.remove("show");
        directionButtons.classList.remove("show");

        // Second click on the same triangle: go back to the Part-Dieu state
        if (place.classList.contains("selected")) {
            place.classList.remove("selected");
            document.body.classList.remove("direction");
            return;
        }

        // Only the clicked triangle becomes dark green
        freePlaces.forEach(function(other){
            other.classList.remove("selected");
        });
        place.classList.add("selected");

        // Start the animation to the state Direction (CSS)
        document.body.classList.add("direction");

        // Wait for the end of the map animation (0.6s), then show the buttons
        timer = setTimeout(function(){
            placeButtons(place);
            directionLine.classList.add("show");
            directionButtons.classList.add("show");
        }, 650);
    });
});

// Put the line and the buttons next to the clicked triangle
function placeButtons(place){

    // Middle of the triangle, in pixels inside the map
    const middle = place.offsetTop + place.offsetHeight / 2;

    // Figma: 24px between triangle and line, line of 114px, 41px between line and buttons
    let lineLeft = place.offsetLeft + place.offsetWidth + 24;
    let buttonsLeft = lineLeft + 114 + 41;

    // If there is not enough space on the right, put the buttons on the left
    if (buttonsLeft + 380 > map.clientWidth) {
        lineLeft = place.offsetLeft - 24 - 114;
        buttonsLeft = lineLeft - 41 - 380;
        directionButtons.style.alignItems = "flex-end";
    } else {
        directionButtons.style.alignItems = "flex-start";
    }

    // Apply the positions (Figma: the first button is 27px above the triangle)
    directionLine.style.left = lineLeft + "px";
    directionLine.style.top = middle + "px";
    directionButtons.style.left = buttonsLeft + "px";
    directionButtons.style.top = (place.offsetTop - 27) + "px";

};
