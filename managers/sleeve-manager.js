import { log } from 'util.js'

/** @param {import('../.').NS} ns */
export async function main(ns) {
    ns.print('Script started');
    ns.disableLog('ALL');
    //rough crime chance algorithm
    function sleeveCrimeChance(i, crimeName) {
        let sleeveStats = ns.sleeve.getSleeveStats(i);
        let crime = ns.getCrimeStats(crimeName);
        let chance =
            crime.hacking_success_weight * sleeveStats.hacking +
            crime.strength_success_weight * sleeveStats.strength +
            crime.defense_success_weight * sleeveStats.defense +
            crime.dexterity_success_weight * sleeveStats.dexterity +
            crime.agility_success_weight * sleeveStats.agility +
            crime.charisma_success_weight * sleeveStats.charisma;
        chance /= 975;
        chance /= crime.difficulty;
        return Math.min(chance, 1);
    }

    var sleeveNum = ns.sleeve.getNumSleeves();

    while (true) {
        for (let i = 0; i < sleeveNum; ++i) {

            //getting sleeve stats
            let sleeveStats = ns.sleeve.getSleeveStats(i);
            let shock = sleeveStats.shock;
            let sync = sleeveStats.sync;

            if (shock > 0) {
                ns.sleeve.setToShockRecovery;
                ns.print('Set task to shock recovery');
            } else if (sync < 100) {
                ns.sleeve.setToSynchronize;
                ns.print('Set task to synchronize');
            } else if (ns.getPlayer().isWorking && ns.getPlayer().workType == "Working for Faction") {
                //try different working types for factions, if the previous isn't available
                ns.print('Set task to faction work: ' + ns.getPlayer().currentWorkFactionName + ', Security Work');
                if (!ns.sleeve.setToFactionWork(i, ns.getPlayer().currentWorkFactionName, "Security Work")) {
                    ns.print('Set task to faction work: ' + ns.getPlayer().currentWorkFactionName + ', Field Work');
                    if (!ns.sleeve.setToFactionWork(i, ns.getPlayer().currentWorkFactionName, "Field Work")) {
                        ns.sleeve.setToFactionWork(i, ns.getPlayer().currentWorkFactionName, "Hacking Contracts")
                        ns.print('Set task to faction work: ' + ns.getPlayer().currentWorkFactionName + ', Hacking Contracts');
                    }
                }
            } else if (ns.getPlayer().isWorking && ns.getPlayer().workType == "Working for Company") {
                ns.sleeve.setToCompanyWork(i, ns.getPlayer().companyName);
                ns.print('Set task to company work: ' + ns.getPlayer().companyName);
            } else if (sleeveCrimeChance(i, 'Homicide') > 60) {
                ns.sleeve.setToCommitCrime(i, "Homicide")
                ns.print('Set task to commit crime: Homicide');
            } else {
                ns.sleeve.setToCommitCrime(i, "Mug")
                ns.print('Set task to commit crime: Mug');
            }
        }
        await ns.sleep(5000); //prevent constant task changes
    }
}