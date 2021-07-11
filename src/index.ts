import { server } from "./Server";

server.listen(3000, "127.0.0.1", () => {
	console.log('Running server on port');
});