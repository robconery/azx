const consola = require("consola");
const {PgMySQL, WebApps} = require("../commands");
const Settings = require("../settings");
const Runner = require("../runner");


exports.rotate = async function(settings){
  const {password} = Settings.generateCredentials("admin");
  consola.info("Updating your server settings...")
  await Runner.run(PgMySQL.rotate(settings, password));
  //update the config
  consola.info("Saving to .env locally...")
  const env = Settings.getENV(); //this will be an object
  env.DATABASE_URL = PgMySQL.buildConnectionString(settings,env.DATABASE_USER, password);
  env.DATABASE_PASSWORD = password;
  Settings.objectToEnv(env);
  
  const appSettings = [
    `DATABASE_URL=${env.DATABASE_URL}`,
    `DATABASE_PASSWORD=${env.DATABASE_PASSWORD}`,
  ]
  consola.info("Resetting the password for your app")
  await Runner.run(WebApps.writeSettings(settings, appSettings));

  consola.success("Finished.")
}

exports.scale = async function(settings, sku){
  settings.sku = sku;
  consola.info("Scaling to",sku)
  await Runner.run(PgMySQL.scale(settings));
  Settings.save(settings);
  consola.success("Done")
}

exports.createService = async function(settings, engine){
  settings.database = {
    engine: engine,
    name: `${settings.rg}-db`,
    sku: "B_Gen5_1"
  };

  //create the service
  consola.info(`Creating a ${settings.database.engine} Server ${settings.database.name} in ${settings.rg}`);
  consola.info("This is going to take 5 minutes or so. Go get some coffee... ☕️")

  const {user, password} = Settings.generateCredentials("admin");

  await Runner.run(PgMySQL.createService(settings, user, password));

  //add firewall for azure services
  consola.info("Adding firewall rule for app services (0.0.0.0)")
  await Runner.run(PgMySQL.addFirewallRule(settings,"0.0.0.0"));

  //add firewall for local user
  const localIp = await Settings.getPublicIp();
  
  consola.info("Adding firewall rule for local access")
  await Runner.run(PgMySQL.addFirewallRule(settings,localIp));
  
  //get the config
  const config = PgMySQL.createConfigSettings(settings, user, password);
  
  //save that up to Azure
  consola.info("Sending your database credentials to your Azure WebApp")
  await Runner.run(WebApps.writeSettings(settings,config));

  //save this to .env too
  consola.info("Saving credentials to your .env file inside the .azure directory");
  Settings.setENV(config.join("\n"));

  consola.success(`Your database was created. You can access it using 'db connect'`);
  consola.info(`You can load your database using "db connect < [SQL file]" 🚀 `);

  Settings.save(settings);

}