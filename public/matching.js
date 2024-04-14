//const { getUserProfile } = require('./login');
//const userInfo = userLogin.data; // Call the function to populate data
//const userInput = userInfo?.userDetails?.email

/*getUserProfile().then(data => {
    // Use data here
    const userData = data.email;
    userInput =  userData;
    console.log("username in matching service:", userInput);
});
*/

/*import {getUserProfile} from './login.js'
userData = getUserProfile.data
const userInput = userData.email;*/

/*import userData from "./login";
const userInput = userData;
console.log("username in matching service:", userInput);*/

document.getElementById('responseContent').style.display = 'none'; 


document.addEventListener('DOMContentLoaded', function(event) {
    document.getElementById('start-Matching').addEventListener('click', startMatching);
});

document.getElementById('backButton').addEventListener('click', stopMatching);

function stopMatching(){
    if (countdownInterval) {
        clearInterval(countdownInterval); // Stop the countdown if it's running
    }
    document.getElementById("timer").style.display = "none"; // Hide the timer
    document.getElementById('feedback').style.display = 'none'; // Hide feedback
    //switchToMyProfile();

}

let countdownInterval; // Define countdownInterval globally to access it later

function startMatching() {
    console.log(document.getElementById('start-Matching')); 

    // Show feedback to the user
    document.getElementById('feedback').style.display = 'block';

        setTimeout(() => {
        // Show the timer
        document.getElementById("timer").style.display = "block";

        // Set initial time to 25 seconds
        let secondsLeft = 20;
        updateClock(secondsLeft);

        // Update the countdown every second
        countdownInterval = setInterval(function () {
            secondsLeft--;
            updateClock(secondsLeft);
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval); // Stop the countdown when time is up
                document.getElementById("timer").style.display = "none"; // Hide the timer
                document.getElementById('feedback').style.display = 'none'; // Hide feedback
                if (confirm("Time's up! Do you want to retry matching?")) {
                    startMatching(); // Reload the page to retry matching
                }
            }
        }, 1000);
    }, 100); // Wait 0.1 seconds before showing timer   

    //retrieve current user name
    const userInput = document.getElementById('username').value.trim();
    console.log("userinput is: " + userInput);
    
    const difficulty = document.getElementById('selectDifficulty').value;
    const topic = document.getElementById('selectTopic').value;

    // Send data to the server
    fetch(`http://localhost:3000/send/${encodeURIComponent(userInput)}/${encodeURIComponent(difficulty)}/${encodeURIComponent(topic)}`)
        .then(response => response.text())
        .then(data => {
            // Display data in modal body
            stopMatching();
            document.getElementById('responseContent').style.display = 'block';
            document.getElementById('responseContent').innerHTML = data;

})
    .catch(error => console.error('Error:', error));   
}

function updateClock(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.getElementById('clock').textContent = display;
}


