const { program } = require('commander')
const Settings = require("../lib/settings");
const Runner = require("../lib/runner");
const {AppScript} = require("../lib/scripts");

let settings = Settings.get();

if (!settings.appService) {
  program
    .command("create <runtime>")
    .description(
      "Sets up for a web application with the option of a database. Runtime choices are node, python, ruby or dotnet. You can also enter a selection from azx lookup runtimes."
    )
    .action(async function (runtime) {

      if (runtime === "python") runtime = "PYTHON|3.8";
      if (runtime === "ruby") runtime = "PYTHON|3.8";
      if (runtime === "dotnet") runtime = "DOTNETCORE|3.1";
      if (runtime === "node") runtime = "NODE|14-lts";
  
      try {
        AppScript.createWebApp(settings, runtime);

      } catch (err) {
        consola.error(err.message);
        //how can rollback?
      }
    });
} else {
  program
    .command("write_settings")
    .description("Update your web app's config settings from your local .env (in the .azure directory)")
    .action(async function () {
      consola.info("Sending your .azure/.env settings to Azure...");
      const res = await AppScript.updateAppSettings(settings);
      consola.success("Done!")
    });
  program
    .command("get_settings")
    .description("View your application's settings on Azure")
    .action(async function () {
      consola.info("Pulling settings from Azure...");
      const res = await AppScript.getAppSettings(settings);
      console.log(res);
    });

  program
    .command("scale <sku>")
    .description("Scale your app service")
    .action(async function (sku) {
      try {
        await AppScript.scale(settings, sku);
      } catch (err) {
        consola.error(err.message);
      }
    });
  program
    .command("logs")
    .description("View the logs of your application")
    .action(async function (c) {
      const { spawn } = require("child_process");
      const shell = spawn(
        "az", ["webapp","log","tail","-n",settings.appService.name,"-g",settings.rg],
        { stdio: "inherit" }
      );
      shell.on("close", () => {
        console.log("Disconnected");
      });
    });

  program
    .command("open")
    .description("Browse your site")
    .action(async function (c) {
      if (settings.appService.domain) {
        await Runner.run(`open https://${settings.appService.domain}`);
      } else {
        await Runner.run(
          `open https://${settings.appService.name}.azurewebsites.net`
        );
      }
    });
  program
    .command("oryx")
    .description("Browse your site's build service")
    .action(async function (c) {
      await Runner.run(
        `open https://${settings.appService.name}.scm.azurewebsites.net`
      );
    });
}

program.action(() => {
  program.help();
});

program.parse(process.argv);
