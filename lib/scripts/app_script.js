const consola = require("consola");
const {WebApps, Git, AppService, Resources} = require("../commands");
const Settings = require("../settings");
const inquirer = require("inquirer");
const Runner = require("../runner");

exports.updateAppSettings = async function(settings){
  //pull what's in .env
  const env = Settings.getENV();
  //this is an object and we need to turn it into an array
  const keys = Object.keys(env);
  const config = [];
  for(let key of keys){
    config.push(`${key}=${env[key]}`)
  }
  await Runner.run(WebApps.writeSettings(settings,config));
  await Runner.run(WebApps.restart(settings))
}

exports.getAppSettings = async function(settings){
  return Runner.runJSON(WebApps.getSettings(settings))
}

exports.scale = async function(settings, sku){
  consola.info("Scaling up to",sku)
  settings.appService.sku = sku;
  Settings.save(settings);
  await Runner.run(AppService.scale(settings));
  consola.success("Done!")
  
}

exports.destroy = async function(settings){
  const res = await inquirer.prompt({
    type: "input",
    name: "dropRemote",
    message: "Do you want to destroy your Azure resources too? (y | N)",
    default: "N",
  });

  if (res.dropRemote === "y") {
    consola.info("Deleting Azure resource group", settings.rg);
    await Runner.run(Resources.deleteGroup(settings.rg));
  }
  try{
    await Runner.run(Git.removeGitRemote());
  }catch(err){
    //swallow it if fail
  }
  
  Settings.delete();
  consola.success("Done!")
}

exports.init = async function({name, location}){
  consola.info(`Creating project ${name}`);
  const cmd = Resources.createGroup({
    rg: name,
    region: location,
  });
  try{
    await Runner.run(cmd);
  }catch(err){
    console.log(err);
  }
  
  Settings.save({
    rg: name,
    region: location,
    appService: false,
    database: false,
  });
  consola.success("Project created", name);
  consola.info("Your Azure settings have been written to .azure/settings.json");
  consola.info("Next step: create an application with 'azx app create' 🚀");
}

exports.getWebApp =async function(){
  consola.info("Talking to Azure, one second...");
  //get the settings
  let apps = await Runner.runJSON(Resources.getApps());
  apps = apps.map((app) => {
    return {
      name: `${app.name} (in ${app.group})`,
      value: { name: app.name, group: app.group },
    };
  });
  const {
    app: { name, group },
  } = await inquirer.prompt({
    type: "list",
    name: "app",
    message: "Which web app do you want to pull?",
    choices: apps,
  });

  consola.info("Pulling the app config");
  let res = await Runner.run(Resources.getAppConfig(name, group));
  
  let settings = {
    rg: group,
    region: res.location,
    appService: {
      runtime: res.linuxFxVersion,
      name: name,
    },
    database: null,
  };

  Settings.save(settings);

  consola.info("Pulling the app settings, if any");

  res = await Runner.runJSON(Resources.getAppSettings(name,group));
  if (res.length > 0) {
    const envVals = res.map((r) => `${r.name}="${r.value}"`).join("\n");
    //we have a database
    settings.database = {};
    const dbUrl = res.find((r) => r.name === "DATABASE_URL");
    if (dbUrl) {
      if(dbUrl.value.indexOf("postgres") > -1) settings.database.engine = "postgres"
      if(dbUrl.value.indexOf("mysql") > -1) settings.database.engine = "mysql"
      if(dbUrl.value.indexOf("mongo") > -1) settings.database.engine = "mongodb"
    }
    //we should also have a remote GIT in there
    let gitUrl = res.find((r) => r.name === "GIT_URL");
    if (gitUrl) {
      await Runner.run(Git.removeGitRemote())
      await Runner.run(Git.setRemoteGit(gitUrl.value));
    }
    Settings.save(settings);
    Settings.setENV(envVals);
  }
  consola.success("All set!")
}

exports.createWebApp = async function(settings, runtime){
  settings.appService = {
    sku: "F1",
    name: settings.rg + "-app",
    plan: settings.rg + "-plan",
    runtime: runtime
  };

  //make sure we have no Git remote
  try{
    await Runner.run(Git.removeGitRemote())
  }catch(err){
    //swallow it - it'll throw if there is no azure remote
  }



  //app service plan
  consola.info("Creating an App Service Plan (kind of like a VM) 🤖");
  try{
    await Runner.run(AppService.createPlan(settings));
  }catch(err){
    settings.appService.sku = "B1";
    consola.info("Can't do free tier, setting to B1");
    await Runner.run(AppService.createPlan(settings));
  }
  
  
  //create the app
  consola.info("Creating the Web App with local Git deployment 🌎");
  await Runner.run(WebApps.create(settings)); 

  //ensure logging is properly done
  consola.info("Activating logging 📡");
  await Runner.run(WebApps.setLogging(settings)); 

  //generate deployment credentials
  const {user, password} = Settings.generateCredentials("deployer")

  consola.info("Setting up your deployment credentials 🔐");
  await Runner.run(WebApps.createDeployUser(settings, {user: user, password: password}))

  consola.info("Setting up Git deployment 🪁");
  const remoteUrl = Git.buildRemoteUrl(settings, {user: user, password: password})

  await Runner.run(Git.setRemoteGit(remoteUrl))
  
  //save it up to our web app
  consola.info("Saving credentials on Azure (GIT_URL) 🚁");
  await Runner.run(WebApps.writeSettings(settings, [`GIT_URL=${remoteUrl}`]))

  consola.success("Your application was created! 🚀 ");
  consola.info("Set up your database next using azx db create [postgres | mysql | mongo] 🍔");

  Settings.save(settings);

}
