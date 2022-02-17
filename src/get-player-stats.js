/** @param {import('../.').NS} ns */

import { formatMoney, formatDuration } from "util.js"

export async function main(ns) {
    var playerFac = ns.getPlayer().factions

    ns.tprintf("\n");
    ns.tprintf("---------\n");
    ns.tprintf("PLAYER STATS\n");
    ns.tprintf("---------\n");
    ns.tprintf("\n");
    ns.tprintf("City: " + ns.getPlayer().city);
    ns.tprintf("\n");
    ns.tprintf("Money: " + formatMoney(ns.getPlayer().money, 4, 3));
    ns.tprintf("Hacking: " + ns.getPlayer().hacking);
    ns.tprintf("Strength: " + ns.getPlayer().strength);
    ns.tprintf("Defense: " + ns.getPlayer().defense);
    ns.tprintf("Dexterity: " + ns.getPlayer().dexterity);
    ns.tprintf("Agility: " + ns.getPlayer().agility);
    ns.tprintf("Charisma: " + ns.getPlayer().charisma);
    ns.tprintf("Intelligence: " + ns.getPlayer().intelligence);
    ns.tprintf("\n");
    ns.tprintf("Current factions: " + playerFac.join(", "));
    ns.tprintf("\n");
    ns.tprintf("WSE Account?: " + ns.getPlayer().hasWseAccount);
    ns.tprintf("TIX API?: " + ns.getPlayer().hasTixApiAccess);
    ns.tprintf("4S Market Data?: " + ns.getPlayer().has4SData);
    ns.tprintf("4S Market Data API?: " + ns.getPlayer().has4SDataTixApi);
    ns.tprintf("\n");
    ns.tprintf("Karma: " + ns.heart.break());
    ns.tprintf("Kills (this aug reset): " + ns.getPlayer().numPeopleKilled);
    ns.tprintf("\n");
    ns.tprintf("Time played since augmentation reset: " + formatDuration(ns.getPlayer().playtimeSinceLastAug));
    ns.tprintf("Time played since BitNode reset: " + formatDuration(ns.getPlayer().playtimeSinceLastBitnode));
    ns.tprintf("Current BitNode: " + ns.getPlayer().bitNodeN);
    ns.tprintf("Total play time: " + formatDuration(ns.getPlayer().totalPlaytime));
    ns.tprintf("\n");
    ns.tprintf("---------\n");
    ns.tprintf("NODE STATS\n");
    ns.tprintf("---------\n");
    ns.tprintf("\n");
    ns.tprintf("Servers required hacking level:");
    ns.tprintf("CSEC: " + ns.getServerRequiredHackingLevel("CSEC"));
    ns.tprintf("avmnite-02h: " + ns.getServerRequiredHackingLevel("avmnite-02h"));
    ns.tprintf("I.I.I.I: " + ns.getServerRequiredHackingLevel("I.I.I.I"));
    ns.tprintf("run4theh111z: " + ns.getServerRequiredHackingLevel("run4theh111z"));
    ns.tprintf("w0r1d_d43m0n: " + ns.getServerRequiredHackingLevel("w0r1d_d43m0n"));
}