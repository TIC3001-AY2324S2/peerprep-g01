// Import the express package to create and configure the server
const express = require("express");

// Import the amqplib package to interact with RabbitMQ
const amqp = require("amqplib");
//const uuid = require("uuid"); // Import UUID library

// Initialize the express application
const app = express();

const compare = require("./Utils/compare.js")
const consume1 = require("./Consumers/preconsume.js")
const consume2 = require("./Consumers/consume.js")
const sendMsg = require("./Sender/sendmsg.js")

// Import the cors middleware to enable CORS on the server
const cors = require("cors");

// Configure CORS to allow requests from a specific origin (http://localhost:3000) and to handle preflight requests

app.use(cors());

const userData1 = {
  user: '',
  difficulty: '',
  topic: ''
};

const userData2 ={
  user: '',
  difficulty: '',
  topic: ''
};




// to check if user has found match
let userMatch = false;

let extChk = false;

consume1.startCheck(userData2);

// Define a GET route "/send" that will be used to send messages to RabbitMQ
app.get("/send/:userId/:difficulty/:topic", async (req, res) => {
  
  const userId = req.params.userId; // Get UserID from query parameter
  const difficulty = req.params.difficulty; // Get Difficulty from query parameter
  const topic = req.params.topic; // Get Topic from query parameter

  userData1.user = userId;
  userData1.difficulty = difficulty;
  userData1.topic = topic;

  if (userData1.user != userData2.user) {
    console.log("Comparison result:", compare.compareUserData(userData1, userData2));
    extChk=compare.compareUserData(userData1,userData2);
  }

  
  if(extChk== true){

    console.log("Match result: User1: ", userData1.user, " User2: ",userData2.user);
    userMatch = true;
    console.log("Match found!")

  }

  

  // Construct the message using UserID, Difficulty, and Topic
  const message = JSON.stringify({ userId, difficulty, topic });
  sendMsg.sendMessageToQueue(message);

  

  if(userMatch){

    
    res.send("Match Found with user: "+ userData2.user+ "!!" );
  }

  else{
  consume2.startConsumer(userData1, userData2, userMatch, res);
  }
  
  }

);

// Start the server on port 3001
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Producer running on port", PORT);
});

