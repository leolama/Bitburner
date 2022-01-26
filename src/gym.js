/** @param {import('../.').NS} ns */

export async function main(ns) {
    ns.disableLog("ALL");
    //get player stats
	var statNames = ["strength", "defense", "agility", "dexterity"];
	var statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().agility, ns.getPlayer().dexterity];
    var cityNames = ["Sector-12","Aevum","Volhaven"];
	var gymNames = ["powerhouse gym","snap fitness gym","millenium fitness gym"];
    var noGymCities = ["chongqing","new tokyo","ishima"]
    var gym;
    var travelPrompt = false;
    var noGymPrompt = false;
    var scriptArg = ns.args[0];

    if (ns.getPlayer().city != "Sector-12") {
        travelPrompt = await ns.prompt("Travel to Sector-12 for best gym?");
    } else if (noGymCities.includes(ns.getPlayer().city)) {
        noGymPrompt = await ns.prompt("Your current city hasn't got a gym, travel to Sector-12?")
        if (noGymPrompt == false) {
            ns.print("No gym available");
            return;
        }
    }
    
    if (travelPrompt == true) {
        ns.travelToCity("Sector-12")
    } else {
        let index = cityNames.indexOf(ns.getPlayer().city);
        gym = gymNames[index];
    }

    for (let i = 0; i < statNames.length; ++i) {
        ns.print("Training " + statNames[i] + " to level " + scriptArg);
        while (statLevels[i] < scriptArg) {
            ns.gymWorkout(gym, statNames[i]);
            await ns.sleep(5000)
            statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().agility, ns.getPlayer().dexterity];
            if (!ns.isBusy()) {
                ns.print("Cancelled by player");
                return;
            }
        }
    }
    ns.stopAction();	
}