const { execSync } = require("child_process");

setInterval(() => {
  console.log("building");
  execSync("node build");
}, 1000);