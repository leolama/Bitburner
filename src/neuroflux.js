/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var faction = ns.args[0];
	var availMoney = ns.getPlayer().money;
	var augPrice = ns.getAugmentationPrice("NeuroFlux Governor");
	var augRep = ns.getAugmentationRepReq("NeuroFlux Governor");
    var playerFactionRep = ns.getFactionRep(faction);
    var count = 0;

	if (availMoney >= augPrice && playerFactionRep >= augRep) {
        while (availMoney >= augPrice && playerFactionRep >= augRep) {
            ns.print(faction);
            if (ns.purchaseAugmentation(faction, "NeuroFlux Governor")) {
                ++count;
                ns.print("Bought " + count + " level of NeuroFlux");
            } else {
                ns.print("Failed to buy NeuroFlux");
            }
            availMoney = ns.getPlayer().money;
            augPrice = ns.getAugmentationPrice("NeuroFlux Governor");
            augRep = ns.getAugmentationRepReq("NeuroFlux Governor");
            playerFactionRep = ns.getFactionRep(faction);
            await ns.sleep(100);
        }
	} else {
        ns.print("Not enough money and/or reputation");
    }
}