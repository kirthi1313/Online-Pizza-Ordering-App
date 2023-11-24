#############################################################################################################################
This document explains all the steps to be followed in sequence to run the application - PizzaLand
#############################################################################################################################
Prerequisites- install npm globally using "npm install npm@latest -g" command and Angular CLI using "npm install -g @angular/cli",
PHPPgAdmin Database

1.Application has been developed with the following technologies: 
Angular 11,HTML5,CSS,Typescript - Client side 
NodeJS - Server side
PHPPgAdmin Interface used to create Database. 

2.Within the pizzaLand folder,two folders named "client" and "server" are present. 

3.Inside the server folder, the server side code is present.To run the server, open the server folder 
in Visual Studio Code and run the following commands in the terminal:
	npm i express pg
	node index.js
Now, the server is running in localhost:3000 in your machine

4.Inside the client folder,client code is present.To run the client, open the client folder
 in Visual Studio Code and run the following commands in the terminal:
	npm i
	npm start
Now, the client is up in localhost:4200 by default

5.Run the scripts in script file to create all the tables and functions required by the application to be available in the Database.

6.The client now fetches the data from the PostgreSQL Database by connecting to the server running in the localhost:3000 port.

7.The PizzaLand application is now up and running in your machine!

###############################################################################################################################
