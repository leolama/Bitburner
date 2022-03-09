import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var server = ns.args[0];

	//kill any running scripts on the server
	ns.killall(server);

	//try to delete the server
	if (ns.deleteServer(server)) {
		log(ns, "SUCCESS: Deleted " + server);
	} else {
		log(ns, "ERROR: Failed to delete " + server + ". The server might not exist");
	}
}