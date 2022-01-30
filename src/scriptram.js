/** @param {import('../.').NS} ns */

export async function main(ns) {
	var file = ns.args[0];
	var folders = ["","/bin/","/managers/","/src/","/src/achievements/"]

	for (let folder of folders) {
		ns.print(folder + file);
		if (ns.fileExists(folder + file)) {
			ns.tprint(folder + file + " needs " + ns.getScriptRam(folder + file) + "GB of RAM");
			return;
		}
	}
	ns.tprint("Cannot find " + file + " on this system");
}