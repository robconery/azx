const Runner = require("../runner");
const assert = require("assert");

exports.createPlan = function({rg, appService}){
  assert(rg, "Need an RG");
  assert(appService && appService.sku, "Need an app service with a name and SKU");

  return `az appservice plan create -g ${rg} -n ${rg}-plan --sku ${appService.sku} --is-linux  --output none`;

}

exports.scale = function({rg, appService}){
  assert(rg, "Need an RG");
  assert(appService && appService.name && appService.sku, "Need an app service with a name and sku");

  return `az appservice plan update -g ${rg} -n ${rg}-plan --sku ${appService.sku}`
}

