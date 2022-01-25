/** @param {NS} ns **/
export async function main(ns) {
	ns.print("Script started");
	const files = ns.ls("home", ns.args[0]);
	for (const file of files) {
		ns.rm(file);
	}
}