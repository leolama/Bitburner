/** @param {import('..').NS} ns */

import { formatMoney, formatDuration } from "util.js"

export async function main(ns) {

    ns.tprint("--\n" +
    "--\n" + 
    "PLAYER STATS\n" + 
    "--\n\n" +
    "City: " + ns.getPlayer().city + "\n" +
    "\n" +
    "Money: " + formatMoney(ns.getPlayer().money, 4, 3) + "\n" +
    "Hacking: " + ns.getPlayer().hacking + "\n" +
    "Strength: " + ns.getPlayer().strength + "\n" + 
    "Defense: " + ns.getPlayer().defense + "\n" + 
    "Dexterity: " + ns.getPlayer().dexterity + "\n" + 
    "Agility: " + ns.getPlayer().agility + "\n" +
    "Charisma: " + ns.getPlayer().charisma + "\n" +
    "Intelligence: " + ns.getPlayer().intelligence + "\n" +
    "\n" +
    "Current factions: " + ns.getPlayer().factions + "\n" +
    "\n" +
    "WSE Account?: " + ns.getPlayer().hasWseAccount + "\n" +
    "TIX API?: " + ns.getPlayer().hasTixApiAccess + "\n" +
    "4S Market Data?: " + ns.getPlayer().has4SData + "\n" +
    "4S Market Data API?: " + ns.getPlayer().has4SDataTixApi + "\n" +
    "\n" +
    "Karma: " + ns.heart.break() + "\n" +
    "Kills (this reset): " + ns.getPlayer().numPeopleKilled + "\n" +
    "\n" +
    "Time played since augmentation reset: " + formatDuration(ns.getPlayer().playtimeSinceLastAug) + "\n" +
    "Time played since BitNode reset: " + formatDuration(ns.getPlayer().playtimeSinceLastBitnode) + "\n" +
    "Current BitNode: " + ns.getPlayer().bitNodeN + "\n" +
    "Total play time: " + formatDuration(ns.getPlayer().totalPlaytime) + "\n")

}