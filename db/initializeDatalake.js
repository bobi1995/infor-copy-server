const java = require("java");
const path = require("path");

async function initializeDataLake() {
  console.log("Starting asynchronous Java initialization...");

  java.options.push("-Xrs");
  const driverPath = path.join(
    __dirname,
    "../lib/infor-compass-jdbc-ipl-fix-2020-09.jar"
  );
  java.classpath.push(driverPath);

  // Configure java to be asynchronous and use Promises for all methods except ensureJvm
  java.asyncOptions = {
    asyncSuffix: undefined,
    syncSuffix: "",
    promiseSuffix: "Promise",
    promisify: require("util").promisify,
  };

  // This is the compatible, manual Promise wrapper for ensureJvm
  await new Promise((resolve, reject) => {
    java.ensureJvm((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  console.log("Java VM has started successfully.");
  console.log("SUCCESS: Java environment is ready.");
}

module.exports = { initializeDataLake };
