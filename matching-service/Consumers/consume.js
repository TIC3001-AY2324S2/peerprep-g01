const amqp = require("amqplib");
const compare = require("../Utils/compare.js")


function startConsumer(userData1, userData2, userMatch, res) {
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
    
      // Stop consuming messages after 25 seconds
      setTimeout(() => {
        if (consumer) {
          channel.cancel(consumer.consumerTag);
          console.log("Consumer stopped after 25 seconds.");
        }
      }, 25000);
    
    })();
    }

    module.exports = {startConsumer};