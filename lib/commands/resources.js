const assert = require("assert");


exports.getAppConfig = function(name, group){
  assert(name, "A name is required");
  assert(group, "A group is required");
  return `az webapp config show -n ${name} -g ${group}`;
}

exports.getAppSettings = function(name, group){
  assert(name, "A name is required");
  assert(group, "A group is required");
  return `az webapp config appSettings list -n ${name} -g ${group}`;
}

exports.getApps = function(){
  return `az webapp list --query '[].{name:name, group:resourceGroup}'`;

}

exports.createGroup = function({rg, region}){
  assert(rg, "A rg is required");
  assert(region, "A region is required");
  return `az group create -n ${rg} -l ${region}`
}

exports.deleteGroup = function(rg){
  assert(rg, "A rg is required");
  return `az group delete -y -n ${rg}`;
}
