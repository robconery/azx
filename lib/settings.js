const path = require("path");
const fs = require("fs");
const envPath = path.resolve(process.cwd(), ".azure", ".env");
const settingsPath = path.resolve(process.cwd(), ".azure", "settings.json");


require("dotenv").config({path: envPath});

exports.envPath = envPath;

exports.ensureSettings = function(){
  //create the .azure directory
  if (!fs.existsSync("./.azure")) {
    fs.mkdirSync("./.azure");
    //create the .gitignore and .env
    fs.writeFileSync("./.azure/.gitignore", ".env", "utf-8");
  }
  return true;
}
exports.get = function () {
  let out = null;
  if (fs.existsSync(settingsPath)) {
    out = require(settingsPath);
  }
  return out;
};

exports.save = function (settings) {
  this.ensureSettings();
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  return {success: true, path: settingsPath}
};

exports.delete = function(){
  const settingsDir = path.resolve(process.cwd(), ".azure");
  fs.rmdirSync(settingsDir, { recursive: true });
  return true;
}

exports.getENV = function(){
  const env = fs.readFileSync(envPath, "utf-8");
  const dotenv = require('dotenv');
  const buf = Buffer.from(env)
  return dotenv.parse(buf)
}

exports.objectToEnv = function(thing){
  const keys = Object.keys(thing);
  let out = [];
  for(let key of keys){
    if(key) out.push(`${key}=${thing[key]}`)
  }
  return this.setENV(out);

}

exports.setENV = function(envVals){
  fs.writeFileSync(envPath, envVals, "utf-8");
  return true;
}