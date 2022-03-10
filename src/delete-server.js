import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");

	//kill any running scripts on the server(s)
	for (let server of ns.args) {
		try {
			ns.killall(server);

		} catch {
			log(ns, 'ERROR: Failed to find a server called ' + server, true);
			return;
		}

		//try to delete the server(s)
		if (ns.deleteServer(server)) {
			log(ns, "SUCCESS: Deleted " + server, true);
		}
	}
}