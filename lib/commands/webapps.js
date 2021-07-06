const assert = require("assert");

exports.getSettings = function({rg, appService}){
  return `az webapp config appsettings list -n ${appService.name} -g ${rg}`;
}

exports.create = function({rg, appService}){
  assert(rg, "Need an RG");
  assert(appService && appService.name && appService.runtime, "Need an appService with a name and runtime");
  return `az webapp create -n ${appService.name} -g ${rg} -p ${rg}-plan --runtime '${appService.runtime}' --deployment-local-git --output none`
}

exports.restart = function({rg, appService}){
  assert(rg, "Need an RG");
  assert(appService && appService.name, "Need an appService with a name");
 
  return `az webapp restart -g ${rg} -n ${appService.name}`
}


exports.createDeployUser = function({rg, appService}, {user, password}){
  assert(rg, "Need an RG");
  assert(user, "Need a user");
  assert(password, "Need a password");
  assert(appService && appService.name, "Need an appService with a name");
  return `az webapp deployment user set --user-name '${user}' --password '${password}'`;
}

exports.writeSettings = function({rg, appService}, commands){
  assert(rg, "Need an RG");
  assert(commands, "Need commands");
  assert(appService && appService.name, "Need an appService with a name");
  
  const commandString=commands.join(" ");
  return `az webapp config appsettings set -n ${appService.name} -g ${rg} --output none --settings ${commandString}`;

}

exports.setLogging = function({rg, appService}){
  assert(rg, "Need an RG");
  assert(appService && appService.name, "Need an appService with a name");
  return `az webapp log config -n ${appService.name} -g ${rg} --application-logging filesystem --web-server-logging filesystem --docker-container-logging filesystem --level information --detailed-error-messages true --output none`;
}
