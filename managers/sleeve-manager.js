import { getNsDataThroughFile, log } from 'util.js'

const scriptArgs = [
    ['task', ''],
];

export function autocomplete(data, args) {
    data.flags(scriptArgs);
    return [];
}

/** @param {import('../.').NS} ns */
export async function main(ns) {
    ns.print('Script started');
    ns.disableLog('disableLog');
    ns.disableLog('sleep');
    ns.disableLog('run');
    const flags = ns.flags(scriptArgs);
    const tempFile = '/data/sleeve-task.txt';
    var sleeveNum = await getNsDataThroughFile(ns, `ns.sleeve.getNumSleeves()`, '/data/sleeve-num.txt');
    var currentTasks = [];
    while (true) {
        for (let i = 0; i < sleeveNum; ++i) {
            //getting sleeve stats
            let sleeveStats = await getNsDataThroughFile(ns, `ns.sleeve.getSleeveStats(${i})`, '/data/sleeve-stats.txt');
            let command, task;

            if (flags.task != '') {
                //we don't want two sleeve managers running at the same time
                //ns.scriptKill('/managers/sleeve-manager.js', 'home');

                command = `ns.sleeve.setToCommitCrime(${i}, "${flags.task}")`;
                task = 'custom task';
            } else if (sleeveStats.shock > 0) {
                command = `ns.sleeve.setToShockRecovery(${i})`;
                task = 'shock recovery';
            } else if (sleeveStats.sync < 100) {
                command = `ns.sleeve.setToSynchronize(${i})`;
                task = 'syncronizing';
            } else if (sleeveStats.strength < 75) {
                command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","strength")`;
                task = 'self strength training';
            } else if (sleeveStats.defense < 75) {
                command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","defense")`;
                task = 'self defense training';
            } else if (sleeveStats.dexterity < 75) {
                command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","dexterity")`;
                task = 'self dexterity training';
            } else if (sleeveStats.agility < 75) {
                command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","agility")`;
                task = 'self agility training';
            } else if (i == 0 && ns.getPlayer().isWorking && ns.getPlayer().workType == "Working for Faction") {
                //prioritise security work since sleeves are typically combat stat heavy
                command = `ns.sleeve.setToFactionWork(0, ns.getPlayer().currentWorkFactionName, "Security Work")`;
                task = 'security work for faction';
            } else if (i == 0 && ns.getPlayer().isWorking && ns.getPlayer().workType == "Working for Company") {
                command = `ns.sleeve.setToCompanyWork(0, ns.getPlayer().companyName)`;
                task = 'company work';
            } else if (ns.getPlayer().isWorking && ns.getPlayer().workType.startsWith("Studying")) {
                if (ns.getPlayer().className.startsWith("Algorithms",10)) {
                    command = `ns.sleeve.setToUniversityCourse(${i}, "rothman university", "Algorithms")`;
                    task = 'algorithm course';
                } else if (ns.getPlayer().className.startsWith("Leadership",9)) {
                    command = `ns.sleeve.setToUniversityCourse(${i}, "rothman university", "Leadership")`;
                    task = 'leadership course';
                } else if (ns.getPlayer().className.startsWith("training")) {
                    if (ns.getPlayer().className.startsWith("strength",14)) {
                        command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","strength")`;
                        task = 'strength training';
                    } else if (ns.getPlayer().className.startsWith("defense",14)) {
                        command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","defense")`;
                        task = 'defense training';
                    } else if (ns.getPlayer().className.startsWith("dexterity",14)) {
                        command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","dexterity")`;
                        task = 'dexterity training';
                    } else if (ns.getPlayer().className.startsWith("agility",14)) {
                        command = `ns.sleeve.setToGymWorkout(${i}, "powerhouse gym","agility")`;
                        task = 'agility training';
                    }
                }
            } else if (sleeveStats.hacking > 200 && sleeveStats.strength > 200 && sleeveStats.defense > 200 && sleeveStats.dexterity > 200 && sleeveStats.agility > 200 && sleeveStats.charisma > 200) {
                command = `ns.sleeve.setToCommitCrime(${i}, "Heist")`;
                task = 'heisting';
            } else {
                //if nothing else is happening, just murder
                command = `ns.sleeve.setToCommitCrime(${i}, "Homicide")`;
                task = 'homiciding';
            }

            //starting tasks
            if (currentTasks[i] == task) continue;
            if (await getNsDataThroughFile(ns, command, tempFile)) {
                log(ns, 'SUCCESS: Sleeve ' + i + ': ' + task);
                currentTasks[i] = task;
            } else {
                //workaround for faction work types
                command = `ns.sleeve.setToFactionWork(${i}, ns.getPlayer().currentWorkFactionName, "Field Work")`;
                task = 'field work for faction';
                if (await getNsDataThroughFile(ns, command, tempFile)) {
                    log(ns, 'SUCCESS: Sleeve ' + i + ': ' + task);
                    currentTasks[i] = task;
                } else {
                    command = `ns.sleeve.setToFactionWork(${i}, ns.getPlayer().currentWorkFactionName, "Hacking Contracts")`;
                    task = 'hacking contracts for faction';
                    if (await getNsDataThroughFile(ns, command, tempFile)) {
                        log(ns, 'SUCCESS: Sleeve ' + i + ': ' + task);
                        currentTasks[i] = task;
                    } else {
                        log(ns, 'ERROR: Failed to set task for sleeve ' + i);
                    }
                }
            }
        }
        await ns.sleep(5000);
    }
}