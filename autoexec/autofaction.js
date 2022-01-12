/** @param {NS} ns **/
function countTools(numTools) {

	return numTools;
}

export async function main(ns) {
	var numTools = countTools();

	ns.tprint(numTools);
}
