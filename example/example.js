const path = require('path');
const flatc = require('..');

flatc(path.join(__dirname, "monster.fbs"), {
    language: ["js", "ts"],
    outputDir: "output",
}).then(() => {
    console.log("Done!");
}).catch(console.error);

