const assert = require("assert");

exports.buildRemoteUrl = function({appService}, {user, password}){
  assert(appService && appService.name, "Need an appService with a name" )
  assert(user && password, "Need both a user and a password" )
  return `https://${user}:${password}@${appService.name}.scm.azurewebsites.net/${appService.name}.git`
}

exports.removeGitRemote = function(){
  return `git remote rm azure`;
}

exports.setRemoteGit = function(url){
  assert(url, "Need a remote URL")
  return `git remote add azure ${url}`;
}
