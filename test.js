/** @param {NS} ns **/
export async function main(ns) {
    var threads;
    threads = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home"))
    threads /= ns.getScriptRam("/scripts/share.js", "home");
    threads = Math.floor(threads);

    ns.run("/scripts/share.js",threads);
}