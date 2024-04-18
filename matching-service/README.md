[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/jhSo0Xzm)
# CS3219-AY22-23-Project-Skeleton

## Matching service


Run on terminal:
1. 'docker network create peerprep_network'
2. 'docker pull rabbitmq:3-management'
3. 'docker run -d --name some-rabbit -p 5672:5672 -p 15672:15672 --network peerprep_network rabbitmq:3-management'

You can now access the RabbitMQ management dashboard in your web browser at http://localhost:15672. 
Use the default credentials: username "guest" and password "guest".

Bring the terminal to matching-service folder.
Install the required dependencies:
3. `npm install`.

Run the app:
4. `npm match.js`

Observe the output in the consumer terminal, which should display the received message.

