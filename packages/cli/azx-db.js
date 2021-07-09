const { program } = require('commander')
const Settings = require("@robconery/azx-settings");
const {PgMySQLScript, CosmosScript} = require("@robconery/azx-scripts");

let settings = Settings.get();

if (settings.appService && !settings.database) {
  program
    .command("create <engine>")
    .description(
      "Add a database (postgres, mysql, or mongo) to your Azure deployment"
    )
    .action(async function (engine) {

      try{
        if(engine === "mongo") await CosmosScript.createService(settings)
        else await PgMySQLScript.createService(settings, engine);
      }catch(err){
        consola.error(err);
      }
      
    });
}



if (settings.database) {
    
  program.command("connect")
    .description("Connect to your database instance using local binary tools. This command requires mysql-client or psql to be installed.")
    .action(async function(){

      const env = Settings.getENV();
      const { spawn } = require('child_process')

      if(settings.database.engine == "mongo"){
        console.log(`Connecting to Cosmos DB on Azure`);
        const shell = spawn("mongo",[env.DATABASE_URL], { stdio: 'inherit' })
        shell.on('close',() =>{ console.log("Disconnected")})
      }else{
        const binary = settings.database.engine === "postgres" ? "psql" : "mysql"
        console.log(`Connecting to ${env.DATABASE_URL}`);
        const shell = spawn(binary,[env.DATABASE_URL], { stdio: 'inherit' })
        shell.on('close',() =>{ console.log("Disconnected")})
      }

    })
  program
    .command("scale <sku>")
    .description("Scale your database service")
    .action(async function (sku) {
      
      try {
        await PgMySQLScript.scale(settings, sku);
      } catch (err) {
        consola.error(err.message);
      }
    });
  program
    .command("rotatepw")
    .description("Rotate your database password, resetting locally and with your webapp")
    .action(async function () {
      try {
        await PgMySQLScript.rotate(settings);
      } catch (err) {
        consola.error(err.message);
      }
    });
}

program.action(() => {
  program.help();
});
program.parse(process.argv);