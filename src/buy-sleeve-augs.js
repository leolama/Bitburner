/**
 * just a random script to buy certain augs for all sleeves
 * costs about $424.921b
 **/

import { getNsDataThroughFile } from "util.js";

/** @param {import('../.').NS} ns NetScript */
export async function main(ns) {
	ns.print("Script started");
	let sleeveNum = await getNsDataThroughFile(ns, `ns.sleeve.getNumSleeves()`, "/data/sleeve-num.txt");
	let augList = [
		"Neurotrainer I",
		"Neurotrainer II",
		"Neurotrainer III",
		"INFRARET Enhancement",
		"Bionic Arms",
		"BrachiBlades",
		"Graphene BrachiBlades Upgrade",
		"Xanipher",
		"CordiARC Fusion Reactor",
		"HemoRecirculator",
		"Unstable Circadian Modulator",
		"Graphene Bionic Spine Upgrade",
		"Power Recirculation Core",
		"SPTN-97 Gene Modification",
		"nextSENS Gene Modification",
		"NutriGen Implant",
	];

	for (let i = 0; i < sleeveNum; ++i) {
		for (let o = 0; o < augList.length; ++o) {
			ns.sleeve.purchaseSleeveAug(i, augList[o]);
		}
		await ns.sleep(100);
	}
}
