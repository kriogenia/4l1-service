# AllForOne Service
This service is in charge of managing all the back-end operations of the 4l1 project.
The service provides a RESTful API to handle the user logic and a WebSocket server
for the location and feed features using Socket.io. 

## Deployment
This service has only been deployed on local on a WSL2 of a Windows machine.
It should work on different environments, specially Linux-based, but it has not been tested.
To deploy this service do the following:

* Clone the repository on your directory of choice
* Run the following commands:
```sh
cd 4l1-service
yarn run dev
```

This will deploy the server on the 3000 port, you can check it browsing to http://127.0.0.1:3000 (*yarn must be installed in the environment of choice to work*)

## REST Endpoints

### Authentication

| Sign In	| GET        			|											|
|:-:		| :-:					|:-:										|
| URL     	| /auth/signin/:token	|											|
| Params    | token: string			| Google Id Token of the user 				|
| Response	| session: object		| Tokens and expiration time				|
|			| user: object			| Logged in user details					|

| Refresh	| POST					|											|
|:-:		| :-:					|:-:										|
| URL     	| /auth/refresh			|											|
| Body	    | auth: string			| Authentication token of the user			|
| 	    	| refresh: string		| Refresh token of the user 				|
| Response	| session: object		| New tokens and expiration time			|

### User

| Update user	| PUT         			|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/update			|											|
| Body	    	| user: object			| New data of the user to update			|
| Response		| message: string		| Success confirmation message				|

| Cared			| GET           		|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/cared			|											|
| Response		| cared: object			| User data of the cared user				|

#### Bonding

| Bonds list	| GET           		|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/bond/list		|											|
| Response		| bonds: object[]		| List of user data of bonds				|

| Establish bond| POST           		|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/bond/establish	|											|
| Body	    	| code: string			| Read bonding code							|
| Response		| message: string		| Success confirmation message				|

| Generate bond	| GET           		|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/bond/generate	|											|
| Response		| code: string			| New bonding code							|

### Feed

| Message batch	| GET           		|											|
|:-:			| :-:					|:-:										|
| URL     		| /feed/messages/:page	|											|
| Params    	| page: int				| \<Optional\> Page to retrieve  			|
| Response		| messages: object[]	| Batch of messages retrieved				|

## Socket Events

### Global Room

* SUBSCRIBE, global:subscribe
	* Server event
	* Subscribes the user to the specified Global Room if they can
	* Message
		* id: string. ID of the user joining the room.
		* owner: string. ID of the user owner of the room.
	* Emmits
		* SUBSCRIPTION to all the users in the room	

* SUBSCRIPTION, global:subscription
	* Client event
	* Notifies to users in a Global Room about the new subscriber
	* Message
		* id: string. ID of the user joining the room.
		* room: string. ID of the room.	

* SHARE LOCATION, global:share_location
	* Client event
	* Notifies to users in the same Global Room that the requester is sharing their location
	* Message
		* id: string. ID of the user sharing the location.
		* displayName: string. Display name of the user sharing the location.	

* JOINING FEED, global:joining_feed
	* Client event
	* Notifies to users in the same Global Room that the requester joined the Feed Room
	* Message
		* id: string. ID of the user sharing the location.
		* displayName: string. Display name of the user sharing the location.	


### Location

* SHARE, location:share
	* Server event
	* Subscribes the user to a Location room and notifies their peers
	* Message
		* id: string. ID of the user sharing the location.
		* displayName: string. Display name of the user sharing the location.
	* Emmits
		* SHARE LOCATION to the rest of users in the same Global Room	

* UPDATE, location:update
	* Broadcast event
	* Shares the location of the user with all their peers
	* Message
		* id: string. ID of the user sharing the location.
		* displayName: string. Display name of the user sharing the location.
		* position: coordinates. Geoposition of the user sharing the location.	
	* Emmits
		* UPDATE to the rest of users in the same Location Room	

* STOP, location:stop
	* Broadcast event
	* Leaves the Location Room and notifies the rest of users on it
	* Message
		* id: string. ID of the user leaving the room.
		* displayName: string. Display name of the user leaving the room.
	* Emmits
		* STOP to the rest of users in the Location Room	


| Sign In	|              			|											|
|:-:		| :-:					|:-:										|
| URL     	| /auth/signin/:token	|											|
| Params    | token: string			| Google Id Token of the user 				|
| Response	| auth: string			| Auth token								|
|			| refresh: string		| Refresh token								|
|			| expiration: number	| Expiration timestamp of the auth token	|
|			| user: object			| Logged in user details					|


## Dependencies
* [**Command Line Args**](https://www.npmjs.com/package/command-line-args)
* [**dotenv**](https://www.npmjs.com/package/dotenv)
* [**Express**](https://www.npmjs.com/package/express)
* [**Google Auth Library**](https://www.npmjs.com/package/google-auth-library)
* [**Helmet**](https://www.npmjs.com/package/helmet)
* [**Http Status Codes**](https://www.npmjs.com/package/http-status-codes)
* [**Jet-Logger**](https://www.npmjs.com/package/jet-logger)
* [**jsonwebtoken**](https://www.npmjs.com/package/jsonwebtoken)
* [**mongoose**](https://www.npmjs.com/package/mongoose)
* [**Morgan**](https://www.npmjs.com/package/morgan)
* [**Socket.io**](https://www.npmjs.com/package/socket.io)
* [**Typegoose**](https://www.npmjs.com/package/@typegoose/typegoose)
* [**Typescript**](https://www.npmjs.com/package/typescript)

### Testing
* [**Jest**](https://www.npmjs.com/package/jest) 
* [**mongodb-memory-server**](https://www.npmjs.com/package/mongodb-memory-server)
* [**SuperTest**](https://www.npmjs.com/package/supertest)
* [**TS-Jest**](https://www.npmjs.com/package/ts-jest)

### Linting
* [**eslint**](https://www.npmjs.com/package/eslint)
