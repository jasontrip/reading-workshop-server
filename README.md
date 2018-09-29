# Readers Workshop Server
[link to live client app](https://reading-workshop-client.netlify.com/)
[link to client repo](https://github.com/jasontrip/reading-workshop-client)

## Summary
This is the server side app that hosts a RESTful API so that a user can keep track of readers
workshop sessions.

## Technology
Javascript, Node, Mongoose, Mongo, JWT, JSON

## API
/users
	- POST - add a new user (checks to see if already exists)
	- GET - get user object including list of workshops and complete roster

/auth/login - send username/password to authenticate and receive JWT token
/auth/refresh - exchange active token for a new token with later expiration

/students
	- PUT - update a student on a roster
	- POST - add a student to a roster
	- DELETE - remove a student from a roster

/workshops
	- PUT - update a workshop
	- POST - add a workshop
	- DELETE - delete a workshop

## Screenshots (of client side app)
<img src="./src/images/workshops.png" width="300px" />
<p>View a historical list of workshops.</p>

<img src="./src/images/workshop.png" width="300px" height="275px" />
<p>Edit the date, book, pages covered, a note, and add or remove students that attended.</p>


<img src="./src/images/roster.png" width="300px" height="275px" />
<p>Edit the roster of available students for the workshops.</p>