document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-Matching').addEventListener('click', startMatching);
});


function startMatching() {


    console.log(document.getElementById('start-Matching'));


    const difficulty = document.getElementById('selectDifficulty').value;
    const topic = document.getElementById('selectTopic').value;

    fetch(`http://localhost:3001/publish/${encodeURIComponent(difficulty)}/${encodeURIComponent(topic)}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to send data to the backend');
            }
        })
        .then(data => alert(data))
        .catch(error => {
            console.error('Error:', error);
            // Handle error appropriately
        });


    // Show feedback to the user
    document.getElementById('feedback').style.display = 'block';

    setTimeout(() => {

        // Show the timer
        document.getElementById("timer").style.display = "block";

        // Set initial time to 30 seconds
        let secondsLeft = 30;
        updateClock(secondsLeft);

        // Update the countdown every second
        let countdownInterval = setInterval(function () {
            secondsLeft--;
            updateClock(secondsLeft);
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval); // Stop the countdown when time is up
                document.getElementById("timer").style.display = "none"; // Hide the timer

                document.getElementById('feedback').style.display = 'none'; // Hide feedback
                if (confirm("Time's up! Do you want to retry matching?")) {
                    resetModal(); // Reload the page to retry matching
                }
            }
        }, 1000);
    }, 500); // Wait 0.5 seconds before showing timer
}

function updateClock(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.getElementById('clock').textContent = display;
}





