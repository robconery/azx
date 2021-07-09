#!/usr/bin/env node

const program = require("commander");
const Settings = require("@robconery/azx-settings");
const { AppScript } = require("@robconery/azx-scripts");

let settings = Settings.get();

let description = `
🤙🏽 Welcome to AZX, a helpful wrapper for the Azure CLI.

💡 TIP: Get started by using 'azx init' to set things up in this directory.
or 'azx get' to pull settings from Azure
`
if(settings) {
  description = `
  ${settings.rg}
  
  💡 TIP: Run 'azx app create' to create a web application on Azure.
  `
}

if(settings && settings.appService) {
  description = `
  ${settings.rg} - web application.
  
  💡 TIP: Run 'azx db create' to create a database.
  `
}

if(settings && settings.appService && settings.database) {
  description = `${settings.rg} - web application with ${settings.database.engine} db.
  
  💡 TIP: Run 'git push azure master' to deploy your app.
  💡 TIP: Run 'azx scale B1' to scale off the free tier.
  💡 TIP: Run 'azx db connect' to connect to your database.
  💡 TIP: Run 'azx db connect < file.sql' to load your database.
  `
}


program.version("0.0.1").description(description);

if (!settings) {

  program
    .command("init")
    .option("-l, --location [location]", "The Azure region.", "westus")
    .option("-n, --project [project]", "Your project name.", Settings.generateName())
    .description(
      "Creates an Azure Project in this directory"
    )
    .action(async function (command) {
      const options = command.opts();
      //Commander has a weird bug where an option named "name" needs to be called as a function
      await AppScript.init({location: options.location, name: options.project});

    });

  program
    .command("get")
    .description("Pull settings from Azure")
    .action(async function (c) {
      await AppScript.getWebApp();
    });

} else {
  program
  .command("destroy")
  .description("Delete this project from your hard drive and, optionally, Azure 👀.")
  .action(async function (c) {
    await AppScript.destroy(settings);
  });
}

program.command("lookup", "Look up Azure information. Choices are: regions, runtimes, skus or dbskus." );
if(settings) program.command("app", "Work with your application" );
if(settings && settings.appService) program.command("db", "Create and manage your app's database" );

program.parse(process.argv);
