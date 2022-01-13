/** @param {NS} ns **/
//alias removefolder="run scripts/removefolder.js"
//removefolder [folder]
export async function main(ns) {
    const files = ns.ls('home', ns.args[0]);
    for (const file of files)
        ns.rm(file);
}
