const { program } = require('commander')
const Runner = require("../lib/runner");
const skus = require("../lib/skus");
const consola = require("consola");

program
  .command("regions")
  .description(
    "Get a list of regions for Azure. Default for this app is westus."
  )
  .action(async function () {
    const res = await Runner.runJSON("az account list-locations");
    consola.success("All Azure Regions...");
    const formatted = res.map((r) => r.name);
    console.log(formatted);
  });

program
  .command("runtimes")
  .description(
    "Azure runtime list. You can use these directly or by shorthand (node, python, ruby or dotnet)"
  )
  .action(async function () {
    const res = await Runner.runJSON("az webapp list-runtimes --linux");
    consola.success("All Azure Runtimes...");
    console.log(res);
  });
program
  .command("skus")
  .description(
    "AppService SKUs with approximate pricing per month. This will vary by region and capacity."
  )
  .action(async function () {
    for (let sku of skus.plans) {
      console.log(sku.sku + ` ($${sku.price}/m)`);
      console.log(sku.description);
      console.log("");
    }
  });
program
  .command("dbskus")
  .description(
    "Database Service SKUs with suggested pricing per month. This will vary by region and capacity."
  )
  .action(async function () {
    for (let sku of skus.dbs) {
      console.log(sku.sku + ` ($${sku.price}/m)`);
      console.log(sku.description);
      console.log("");
    }
  });
program.action(() => {
  program.help()
})
program.parse(process.argv)