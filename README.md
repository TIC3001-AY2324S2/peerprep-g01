[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/jhSo0Xzm)
# CS3219-AY22-23-Project-Skeleton

## Matching service


Run on terminal:
1. 'docker pull rabbitmq:3-management'
2. 'docker run -d --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management'

You can now access the RabbitMQ management dashboard in your web browser at http://localhost:15672. 
Use the default credentials: username "guest" and password "guest".

Bring the terminal to matching-service folder.
Install the required dependencies:
3. `npm install`.

Run the apps:
4. `npm user1.js`
5. `npm user2.js`

Open the index1.html and index2.html file in a web browser and click the "Send Message" button. 
Observe the output in the consumer terminal, which should display the received message.

