const consola = require("consola");
const {Cosmos, WebApps} = require("../commands");
const Settings = require("../settings");
const Runner = require("../runner");

exports.createService = async function(settings){
  settings.database = {
    engine: "mongo",
    name: `${settings.rg}-db`,
  };

  //create the service
  consola.info(`Creating a Cosmos Server using MongoDB driver: ${settings.database.name} in ${settings.rg}`);
  consola.info("This is going to take 3 minutes or so. Go get some coffee... ☕️");

  const ip = await Settings.getPublicIp();
  
  try{
    await Runner.run(Cosmos.createFreeTierService(settings,ip));
  }catch(err){
    consola.info("Looks like you're not eligible for free tier. Setting up regular service.");
    await Runner.run(Cosmos.createService(settings, ip));
  }
  
  //pull the key so we can build connection
  const keys = await Runner.runJSON(Cosmos.getKeysList(settings));
  const primaryMasterKey = keys.primaryMasterKey;

  const connectionString = Cosmos.buildConnectionString(settings,primaryMasterKey);

  //save this up
  const dbSetting = `DATABASE_URL=${connectionString}`;
  
  consola.info("Service created. Saving connection to your WebApp...");
  await Runner.run(WebApps.writeSettings(settings,[dbSetting]));

  consola.info("Settings saved. Adding to your local .env");
  Settings.setENV(dbSetting);
  Settings.save(settings)
  consola.success(`Your database was created. You can access it using 'db connect', which requires the MongoDB client to be installed.`)
}
