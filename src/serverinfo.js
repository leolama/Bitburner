/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var hostserver = ns.scan(ns.getHostname());
	var targetServer = ns.args[0];
	ns.tprint("--" + targetServer + " stats--");
	ns.tprint("Money available: " + ns.nFormat(ns.getServerMoneyAvailable(targetServer), "$0.000a"));
	ns.tprint("Maximum money: " + ns.nFormat(ns.getServerMaxMoney(targetServer), "$0.000a"));
	ns.tprint("Hacking level required: " + ns.getServerRequiredHackingLevel(targetServer));
	ns.tprint("Current security level: " + ns.getServerSecurityLevel(targetServer));
	ns.tprint("Minimum security level: " + ns.getServerMinSecurityLevel(targetServer));

	await scan(hostserver, ns.getHostname());

	async function scan(servers, host) {
		for (const server of servers) {
			if (server === targetServer) {
				ns.tprint("Previous server: " + host);
			}
			var moreservs = ns.scan(server);
			moreservs.splice(moreservs.indexOf(host), 1);
			await scanl(moreservs, server);
		}
	}
}