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

    // Initialize the timer
    initializeTimer();
    sendMessage();
}

function initializeTimer() {
    setTimeout(() => {
        // Show the timer
        document.getElementById("timer").style.display = "block";

        // Set initial time to 25 seconds
        let secondsLeft = 25;
        updateClock(secondsLeft);

        // Update the countdown every second
        countdownInterval = setInterval(function () {
            secondsLeft--;
            updateClock(secondsLeft);
        }, 1000);
    }, 100); // Wait 0.1 seconds before showing timer
}

function sendMessage(){
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
            alert(data);
            stopMatching();
        })
        .catch(error => console.error('Error:', error));   
}

function updateClock(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.getElementById('clock').textContent = display;
}
