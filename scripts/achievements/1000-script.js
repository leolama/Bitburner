/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        ns.print(ns.args[0]);
        await ns.sleep(5000);
    }
}