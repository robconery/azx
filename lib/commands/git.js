const assert = require("assert");

exports.buildRemoteUrl = function({appService}, {user, password}){
  return `https://${user}:${password}@${appService.name}.scm.azurewebsites.net/${appService.name}.git`
}

exports.removeGitRemote = function(){
  return `git remote rm azure`;
}

exports.setRemoteGit = function(url){
  return `git remote add azure ${url}`;
}
