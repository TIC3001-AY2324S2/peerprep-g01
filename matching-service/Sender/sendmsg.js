const amqp = require("amqplib");

async function sendMessageToQueue(message) {

  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue("message_queue2", { autoDelete: true });
  channel.sendToQueue("message_queue2", Buffer.from(message));
  
  setTimeout(async () => {
    await channel.close();
    await connection.close();
    console.log("Connection closed after 25 sec.");
  }, 25000);
}

module.exports = { sendMessageToQueue };