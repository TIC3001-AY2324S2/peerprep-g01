// Import the amqplib package to interact with RabbitMQ
const amqp = require("amqplib");

function startCheck(userData2) {
    (async () => {
      // Create a connection to the local RabbitMQ server
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
    
      
    
      // Assert a queue exists (or create it if it doesn't) named "message_queue"
      await channel.assertQueue("message_queue2", { autoDelete: true });
    
      //let consumerTag;
    
      // Start consuming messages from the queue "message_queue"
      const consumer = await channel.consume("message_queue2", (message) => {
       
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


    module.exports = {startCheck};