/** @param {import("..").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog('ALL');
	var multipleOf = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576];
	var serverNum = ns.getPurchasedServers();
	var maxServers = ns.getPurchasedServerLimit()
	var serverCosts = [];


	for (let i in multipleOf) {
		//checking that the ram is buyable in this bitnode
		let ram = ns.getPurchasedServerCost(multipleOf[i])
		if (ram != 'Infinity' && ram != null) {
			serverCosts.push(ns.getPurchasedServerCost(multipleOf[i]))
		} else {
			multipleOf.splice(i, 1)
		}
	}

	ns.tprintf("Bought | Limit");
	ns.tprintf(serverNum.length + "      | " + maxServers);
	
	for (let i = 0; i < multipleOf.length; ++i) {
		ns.tprintf(ns.nFormat(multipleOf[i], "0,0") + "GB -- " + ns.nFormat(serverCosts[i], "($0.000a)"));
	}
}