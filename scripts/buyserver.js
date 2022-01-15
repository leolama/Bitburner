//1
/** @param {NS} ns **/
export async function main(ns) {
    var multipleOf = [2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576];
    var hName = "custom-server";
    var ram = ns.args[0];

    for (let i = 0; i < multipleOf.length; ++i) {
        if (ram === multipleOf[i]) { //if ram equals a multiple of 2
            ns.tprint("Buying " + ram + "GB server...");
            ns.purchaseServer(hName, ram);
            ns.tprint("Bought " + ram + "GB server");
            ns.scriptKill("buyserver.js", "home");
        }
    }
}
