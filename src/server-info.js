/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var targetServer = ns.args[0];

	ns.tprintf("--" + targetServer + " stats--");
	ns.tprintf("Money available: " + ns.nFormat(ns.getServerMoneyAvailable(targetServer), "$0.000a"));
	ns.tprintf("Maximum money: " + ns.nFormat(ns.getServerMaxMoney(targetServer), "$0.000a"));
	ns.tprintf("Hacking level required: " + ns.getServerRequiredHackingLevel(targetServer));
	ns.tprintf("Current security level: " + ns.getServerSecurityLevel(targetServer));
	ns.tprintf("Minimum security level: " + ns.getServerMinSecurityLevel(targetServer));
}