# Readers Workshop Server
Thanks for checking out my repo. Live app view is no longer supported...I built this in 2018 and I stopped paying to keep it up.

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
