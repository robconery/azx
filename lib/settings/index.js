const path = require("path");
const fs = require("fs");
const envPath = path.resolve(process.cwd(), ".azure", ".env");
const settingsPath = path.resolve(process.cwd(), ".azure", "settings.json");
const axios = require("axios");
const NameGen = require("./name_gen");
const UUID = require("uuid");

require("dotenv").config({path: envPath});

exports.envPath = envPath;


exports.generateName = function(){
  return NameGen.generateAppName();
}

exports.generateCredentials = function(stub=""){
  const password = UUID.v4();
  const rando = NameGen.randomNumber(1000);
  return {user: `${stub}_${rando}`, password: password}
}

exports.getPublicIp = async function(){
  const url = "http://ipinfo.io/ip";
  const res = await axios.get(url);
  return res.data.trim();
}

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
  return this.setENV(out.join("\n"));

}

exports.setENV = function(envVals){
  fs.writeFileSync(envPath, envVals, "utf-8");
  return true;
}