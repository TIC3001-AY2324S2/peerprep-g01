


/*
This .js file is for testing purpose. Running on the same logic and functions used by match.js
*/





// Import the express package to create and configure the server
const express = require("express");

// Import the amqplib package to interact with RabbitMQ
const amqp = require("amqplib");
//const uuid = require("uuid"); // Import UUID library

// Initialize the express application
const app = express();

const compare = require("./Utils/compare.js")

// Import the cors middleware to enable CORS on the server
const cors = require("cors");

// Configure CORS to allow requests from a specific origin (http://localhost:3001) and to handle preflight requests
app.options(
  "*",
  cors({
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200,
  })
);
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

/*function compareUserData(userData1, userData2) {
  // Compare each property value
  if (userData1.difficulty !== userData2.difficulty) return false;
  if (userData1.topic !== userData2.topic) return false;

  // If all values are equal, return true
  return true;
}*/

let extChk = false;

//extChk = startCheck();
startCheck();

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

    userMatch = true;
    console.log("Match found!")

  }

  

  // Construct the message using UserID, Difficulty, and Topic
  const message = JSON.stringify({ userId, difficulty, topic });
  

  const connection = await amqp.connect("amqp://localhost"); // Create a connection to the local RabbitMQ server
  const channel = await connection.createChannel();

  // Assert a queue exists (or create it if it doesn't) named "message_queue"
  await channel.assertQueue("message_queue");

  //const correlationId = uuid.v4();

  // Send the message to the queue named "message_queue". Messages are sent as a buffer
  channel.sendToQueue("message_queue", Buffer.from(message));

  // Close the channel and the connection to clean up resources
  await channel.close();
  await connection.close();

  // Send a response back to the client to indicate the message was sent
  if(userMatch){
    res.json({ message: "Match Found!!", userData2 });
  } 
  else{

  startConsumer(res);
  }
  
  }

);

// Start the server on port 3001
app.listen(3001, () => {
  console.log("Producer running on port 3001");
});


// to check if existing ***************************************
function startCheck() {
  (async () => {
    // Create a connection to the local RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
  
    
  
    // Assert a queue exists (or create it if it doesn't) named "message_queue"
    await channel.assertQueue("message_queue");
  
    //let consumerTag;
  
    // Start consuming messages from the queue "message_queue"
    const consumer = await channel.consume("message_queue", (message) => {
     
      try {
        // Extract the message content as a string
        const { userId, difficulty, topic } = JSON.parse(message.content.toString());
        console.log("Received messagein pre check - UserID:", userId, "Difficulty:", difficulty, "Topic:", topic);

        userData2.user = userId;
        userData2.difficulty = difficulty;
        userData2.topic = topic;
  
        channel.ack(message);
  
        
  
  
      } catch (error) {
        console.error("Error processing message:", error.message);
        // If an error occurs while processing the message, reject it
        channel.reject(message, false);
      } 
      
    });
  
    console.log("Consumer waiting for messages...");
  
    // Stop consuming messages after 20 seconds
    setTimeout(() => {
      if (consumer) {
        channel.cancel(consumer.consumerTag);
        console.log("Consumer stopped after 1 seconds.");
      }
    }, 1000);
  
  })();
  }

// to recieve ************************************
function startConsumer(res) {
(async () => {
  // Create a connection to the local RabbitMQ server
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  

  // Assert a queue exists (or create it if it doesn't) named "message_queue"
  await channel.assertQueue("message_queue");

  //let consumerTag;

  // Start consuming messages from the queue "message_queue"
  const consumer = await channel.consume("message_queue", (message) => {
   
    try {
      // Extract the message content as a string
      const { userId, difficulty, topic } = JSON.parse(message.content.toString());
      //console.log("Received message - UserID:", userId, "Difficulty:", difficulty, "Topic:", topic);

      userData2.user = userId;
      userData2.difficulty = difficulty;
      userData2.topic = topic;

      

      if(userData1.user!=userData2.user){
        console.log("user ids are", userData1.user, userData2.user);
        console.log("Received message - UserID:", userId, "Difficulty:", difficulty, "Topic:", topic);
        console.log("Comparison result:", compare.compareUserData(userData1, userData2));

        if(compare.compareUserData(userData1,userData2)){
          userMatch= true;
          console.log("Match found!");
        }

        // Acknowledge the message so RabbitMQ knows it has been processed
        channel.ack(message);

        if(userMatch){
          res.json({ message: "Match Found-2!!", userData2 });
        }

      } else {
        //console.log("no ack given");
        channel.reject(message, true);
      }


    } catch (error) {
      console.error("Error processing message:", error.message);
      // If an error occurs while processing the message, reject it
      channel.reject(message, false);
    } 
    
  });

  console.log("Consumer waiting for messages...");

  // Stop consuming messages after 20 seconds
  setTimeout(() => {
    if (consumer) {
      channel.cancel(consumer.consumerTag);
      console.log("Consumer stopped after 20 seconds.");
    }
  }, 25000);

})();
}