//this runs live against Azure, so use with caution... 
//run this from the test directory as that's where the .azure folder will be created
const { AppScript, PgMySQLScript, CosmosScript } = require("../lib/scripts");
const Settings = require(".../lib/settings");
const Runner = require("../lib/runner");

const go = async function(){
  let settings = {}
  try{
    //this will setup RG and create a project name
    await AppScript.init({location: "westus", name: "azxtest"});

    //reload settings
    settings = Settings.get();
    await AppScript.createWebApp(settings, "NODE|10.14");
    
    //reload and create db
    settings = Settings.get();
    await PgMySQLScript.createService(settings, "postgres")

    //scale the app service
    settings = Settings.get();
    await AppScript.scale(settings, "S1");

    settings = Settings.get();
    await PgMySQLScript.scale(settings, "B_Gen5_2");

    settings = Settings.get();
    await PgMySQLScript.rotate(settings);

    //we should have an updated .env file
    console.log(Settings.getENV());
    
    //and an updated appSettings
    const appSettings = await AppScript.getAppSettings(settings);
    console.log(appSettings);

    //create a Cosmos thingy
    settings.database.engine = "mongo"
    await CosmosScript.createService(settings);
  }catch(err){
    console.log(err)
  }finally{
    //blow it up
    console.log("Deleting everything...");
    await Runner.run("az group delete -y -n azxtest")
  }





}();

