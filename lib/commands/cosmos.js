const assert = require("assert");


exports.getKeysList = function({rg, database}){
  assert(rg, "Need an rg");
  assert(database && database.name, "Need a database with a name")
  return `az cosmosdb keys list -n ${database.name} -g ${rg} --output json`
}

exports.buildConnectionString = function({database}, key){
  assert(database && database.name, "Need a database with a name")
  return `mongodb://${database.name}:${key}@${database.name}.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=${database.name}@`;
}

exports.createFreeTierService = function({rg, database}, ip=null){
  assert(rg, "Need an rg");
  assert(ip, "Need an IP");
  assert(database && database.name, "Need a database with a name")
  return `az cosmosdb create -n ${database.name} --enable-free-tier true --ip-range-filter 0.0.0.0,${ip} -g ${rg} --kind MongoDB`;
}

exports.createService = function({rg, database}, ip=null){
  assert(rg, "Need an rg");
  assert(ip, "Need an IP");
  assert(database && database.name, "Need a database with a name");
  return `az cosmosdb create -n ${database.name} --ip-range-filter 0.0.0.0,${ip} -g ${rg} --kind MongoDB`;
}
