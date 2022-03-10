import { log } from 'util.js'

/** @param {import('../.').NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");

    //get player and city stats
	var statNames = ["strength", "defense", "dexterity", "agility"];
	var statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().dexterity,ns.getPlayer().agility];
    var cityNames = ["Sector-12","Aevum","Volhaven"];
	var gymNames = ["powerhouse gym","snap fitness gym","millenium fitness gym"];
    var noGymCities = ["chongqing","new tokyo","ishima"]
    var gym;
    var travelPrompt = false;
    var noGymPrompt = false;
    var scriptArg = ns.args[0];

    //check if we want to be in Sector-12
    if (ns.getPlayer().city != "Sector-12") {
        travelPrompt = await ns.prompt("Travel to Sector-12 for best gym?");
    } else if (noGymCities.includes(ns.getPlayer().city)) {
        noGymPrompt = await ns.prompt("Your current city hasn't got a gym, travel to Sector-12?")
        if (noGymPrompt == false) {
            log(ns, "ERROR: No gym available", true);
            return;
        }
    }
    
    //travel to Sector-12
    if (travelPrompt == true) {
        ns.travelToCity("Sector-12")
        gym = gymNames[0];
    } else {
        gym = gymNames[cityNames.indexOf(ns.getPlayer().city)];
    }

    //start to train stats
    for (let i = 0; i < statLevels.length;++i) {
        while (statLevels[i] < scriptArg) {
            if (ns.getPlayer().className != 'training your ' + statNames[i] + ' at a gym') {
                log(ns, "INFO: Training " + statNames[i]);
                ns.gymWorkout(gym, statNames[i]);
            }
            await ns.sleep(1000);
            statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().dexterity, ns.getPlayer().agility];
            if (!ns.isBusy()) {
                //if player has cancelled training then stop the script
                ns.print("Cancelled by player");
                return;
            }
        }
    }
    log(ns, 'SUCCESS: Finished stat training');
    ns.stopAction();
}