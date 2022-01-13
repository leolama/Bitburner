/** @param {NS} ns **/
//alias deleteserver="run scripts/deleteserver.js"
//deleteserver [host]
export async function main(ns) {
	var server = ns.args[0]

	ns.killall(server);
	ns.deleteServer(server);
}
