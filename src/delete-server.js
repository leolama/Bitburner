/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var server = ns.args[0];

	//kill any running scripts on the server
	ns.killall(server);

	//try to delete the server
	if (ns.deleteServer(server)) {
		ns.tprint("Deleted " + server);
	} else {
		ns.tprint("Failed to delete " + server + ". The server might not exist");
	}
}