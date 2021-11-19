
const assert = require("assert");

exports.scale = function({rg, database}){
  return `az ${ database.engine} server update -g ${rg} -n ${database.name} --sku ${database.sku}`;
}

exports.addFirewallRule = function({rg, database}, ip){
  assert(rg, "Need and RG");
  assert(ip, "Need and IP");
  assert(database && database.name && database.engine, "Need a database with engine, name and SKU")

  const ruleName = ip === "0.0.0.0" ? "AzureService" : "AllowLocalIP";
  return `az ${database.engine} server firewall-rule create -g ${rg} --server ${database.name} --name ${ruleName} --start-ip-address ${ip} --end-ip-address ${ip} --output none`;
}

exports.buildConnectionString = function({database}, user, password) {
  return `${database.engine}://${user}%40${database.name}.${database.engine}.database.azure.com:${password}@${database.name}.${database.engine}.database.azure.com/${database.engine}`
}

exports.createConfigSettings = function({database}, user, password){
  const connString = this.buildConnectionString({database: database},user, password);
  return  [
    `DATABASE_URL=${connString}`,
    `DATABASE_HOST=${database.name}.${database.engine}.database.azure.com`,
    `DATABASE_USER=${user}@${database.name}.${database.engine}.database.azure.com`,
    `DATABASE_PASSWORD=${password}`,
    `DATABASE_NAME=${database.engine}`
  ]
}

exports.createService = function({rg, region, database}, user, password){
  assert(rg, "Need an RG");
  assert(user, "Need a user");
  assert(password, "Need a password");
  assert(region, "No region")
  assert(database && database.engine && database.name && database.sku, "Need a database with engine, name and SKU")

  return `az ${database.engine} server create -g ${rg} --name ${database.name} --admin-user ${user} --admin-password ${password} --sku-name ${database.sku} --ssl-enforcement Disabled --location ${region} --output none`;
}

exports.rotate = function({rg, database, region}, newPassword){
  assert(rg, "Need an RG");
  assert(newPassword, "Need a new password");
  assert(region, "No region")
  assert(database && database.name, "Need a database with engine, name and SKU")
  
  //update Azure
  return `az postgres server update -g ${rg} -n ${database.name} --admin-password ${newPassword}`

}