/** @param {NS} ns **/
export async function main(ns) {
    const files = ns.ls('home', ns.args[0]);
    for (const file of files)
        ns.rm(file);
}
