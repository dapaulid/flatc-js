const flatc = require('..');

flatc("monster.fbs", {
    language: ["js", "ts"],
    outputDir: "output",
}).then(() => {
    console.log("Done!");
}).catch(console.error);

