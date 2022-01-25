//exploit
/** @param {import("../../.").NS} ns */
export async function main(ns) {
	let div = eval("document.getElementById('unclickable')");

	div.style.display = "block";
	div.style.visibility = "visible";
	div.style.backgroundColor = "red";
	div.addEventListener("mouseup", function (e) {
		hideElem(div);
	});
}

function hideElem(elem) {
	elem.style.display = "none";
	elem.style.visibility = "hidden";
	elem.style.backgroundColor = "";
}