/** @param {NS} ns **/
export async function main(ns) {
	ns.print("Script started");
	var server = ns.args[0];

	ns.killall(server);
	if (ns.deleteServer(server)) {
		ns.tprint("Deleted " + server);
	} else {
		ns.tprint("Failed to delete " + server);
	}
}