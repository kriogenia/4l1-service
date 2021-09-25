import './pre-start';
import { server } from "@server";
import { LOG } from './shared/Logger';

const port = Number(process.env.PORT || 3000);
const host = process.env.host || "localhost";

/* STARTS THE SERVER */
server.listen(port, host, () => {
	LOG.imp(`Server deployed at ${host}:${port}`);
});