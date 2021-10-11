import './pre-start';
import { server } from "@server";
import { LOG } from '@/shared/Logger';
import { AddressInfo } from 'net'

/* STARTS THE SERVER */
server.listen(process.env.PORT || 3000, () => {
	const address = server.address() as AddressInfo;
	LOG.imp(`Server listening at http://${address.address}:${address.port}`);
});