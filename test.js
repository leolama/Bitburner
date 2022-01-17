/** @param {NS} ns **/
export async function main(ns) {
    let data = ns.read("/data/purchasedserver-data.txt");
	let dataSplit = data.split(',').map(Number);
	var serverRam = [];
    serverRam.push(dataSplit[0]);
    serverRam.push(dataSplit[1]);
    serverRam.push(dataSplit[2]);

    var serverCost = [];
    serverCost.push(dataSplit[3]);
    serverCost.push(dataSplit[4]);
    serverCost.push(dataSplit[5]);

    ns.tprint(data);
    ns.tprint(dataSplit);
    ns.tprint(serverRam);
    ns.tprint(serverCost);
}