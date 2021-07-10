# Location Service
This service will be in charge of managing the location share for the 4l1 project.
The broadcasting of those locations will be implemented with WebSocker using Socket.io.

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

## Dependencies
* [**Express**](https://www.npmjs.com/package/express)
* [**Socket.io**](https://www.npmjs.com/package/socket.io)
* [**Typescript**](https://www.npmjs.com/package/typescript)