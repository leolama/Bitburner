export async function main(ns) {
    let i = 0

    while (i <= 1000) {
        ns.run("test.js",1,i);
        ++i;
    }
}