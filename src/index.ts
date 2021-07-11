import './pre-start';
import { server } from "@server";

const port = Number(process.env.PORT || 3000);
const host = process.env.host || "localhost";

server.listen(port, host, () => {
	console.log('Running server on port');
});