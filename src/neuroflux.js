import { log } from 'util.js'

const scriptArgs = [
    ['faction', 'CyberSec']
];

export function autocomplete(data, args) {
    data.flags(scriptArgs);
    return [];
}

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.print("Script started");
	const flags = ns.flags(scriptArgs);
	var availMoney = ns.getPlayer().money;
	var augPrice = ns.singularity.getAugmentationPrice("NeuroFlux Governor");
	var augRep = ns.singularity.getAugmentationRepReq("NeuroFlux Governor");
	var count = 0;

	try {
		var playerFactionRep = ns.singularity.getFactionRep(flags.faction);
	} catch {
		log(ns, 'ERROR: A faction called "' + flags.faction + '" does not exist', true);
		return;
	}

	//if player has enough money and reputation
	if (availMoney >= augPrice && playerFactionRep >= augRep) {
		while (availMoney >= augPrice && playerFactionRep >= augRep) {
			await ns.sleep(50);
			if (ns.singularity.purchaseAugmentation(flags.faction, "NeuroFlux Governor")) {
				++count;
			} else {
				log(ns, "ERROR: Failed to buy NeuroFlux", true);
				return;
			}
			//refresh money and rep
			availMoney = ns.getPlayer().money;
			augPrice = ns.singularity.getAugmentationPrice("NeuroFlux Governor");
			augRep = ns.singularity.getAugmentationRepReq("NeuroFlux Governor");
			playerFactionRep = ns.singularity.getFactionRep(flags.faction);
		}
	} else {
		log(ns, "WARN: Not enough money and/or reputation", true);
		return;
	}
	log(ns, "SUCCESS: Bought " + count + " level(s) of NeuroFlux", true);
}