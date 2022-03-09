import { findFile, log } from 'util.js';

/** @param {import('../.').NS} ns */
export async function main(ns) {
    const fileLocation = findFile(ns, ns.args[0]);
    if (ns.args[1] == undefined) {
        var threads = 1;
    } else {
        var threads = ns.args[1];
    }

    log(ns, "INFO: Restarting " + fileLocation);
    ns.scriptKill(fileLocation, "home");
    await ns.sleep(500);
    if (fileLocation != false) {
        let pid = ns.run(fileLocation, threads);
        if (pid != 0) {
            ns.tail(pid)
            log(ns, "SUCCESS: Restarted " + fileLocation + " with " + threads + " thread(s), PID " + pid)
        } else {
            log(ns, "Failed to restart " + fileLocation);
        }
    }
}