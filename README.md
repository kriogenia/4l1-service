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

## Endpoints

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

| Update user	| PUT         			|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/update			|											|
| Body	    	| user: object			| New data of the user to update			|
| Response		| message: string		| Success confirmation message				|

| Cared			| GET           		|											|
|:-:			| :-:					|:-:										|
| URL     		| /user/cared			|											|
| Response		| cared: object			| User data of the cared user				|

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



## Dependencies
* [**Command Line Args**](https://www.npmjs.com/package/command-line-args)
* [**dotenv**](https://www.npmjs.com/package/dotenv)
* [**Express**](https://www.npmjs.com/package/express)
* [**Google Auth Library**](https://www.npmjs.com/package/google-auth-library)
* [**Helmet**](https://www.npmjs.com/package/helmet)
* [**Http Status Codes**](https://www.npmjs.com/package/http-status-codes)
* [**Jet-Logger**](https://www.npmjs.com/package/jet-logger)
* [**jsonwebtoken**](https://www.npmjs.com/package/jsonwebtoken)
* [**Morgan**](https://www.npmjs.com/package/morgan)
* [**Socket.io**](https://www.npmjs.com/package/socket.io)
* [**Typegoose**](https://www.npmjs.com/package/@typegoose/typegoose)
* [**Typescript**](https://www.npmjs.com/package/typescript)

## Testing
The testing have been done with [**Jest**](https://www.npmjs.com/package/jest) and [**TS-Jest**](https://www.npmjs.com/package/ts-jest).