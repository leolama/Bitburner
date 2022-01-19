/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("commitCrime");
	var karma = ns.heart.break();

	while (karma >= -90) {
		if (!ns.isBusy()) {
			await ns.sleep(ns.commitCrime(ns.args[0]) + 2000); //some sort of a buffer to adjust for browser inaccuracy
			ns.print("Karma: " + karma);
		}
		await ns.sleep(2000);
	}
}