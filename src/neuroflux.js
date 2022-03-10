import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.print("Script started");
	var faction = ns.args[0];
	var availMoney = ns.getPlayer().money;
	var augPrice = ns.getAugmentationPrice("NeuroFlux Governor");
	var augRep = ns.getAugmentationRepReq("NeuroFlux Governor");
	var playerFactionRep = ns.getFactionRep(faction);
	var count = 0;

	//if player has enough money and reputation
	if (availMoney >= augPrice && playerFactionRep >= augRep) {
		while (availMoney >= augPrice && playerFactionRep >= augRep) {
			if (ns.purchaseAugmentation(faction, "NeuroFlux Governor")) {
				++count;
			} else {
				log(ns, "ERROR: Failed to buy NeuroFlux", true);
			}
			//refresh money and rep
			availMoney = ns.getPlayer().money;
			augPrice = ns.getAugmentationPrice("NeuroFlux Governor");
			augRep = ns.getAugmentationRepReq("NeuroFlux Governor");
			playerFactionRep = ns.getFactionRep(faction);
		}
	} else {
		log(ns, "WARN: Not enough money and/or reputation", true);
		return;
	}
	log(ns, "SUCCESS: Bought " + count + " level(s) of NeuroFlux", true);
}

export function autocomplete(data, args) {
    return ["CyberSec", "NiteSec", "The Black Hand", "BitRunners", "Daedalus"];
}