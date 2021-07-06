const assert = require("assert");
const {AppService} = require("../../lib/commands");

describe('App Service commands', () => {
  it("creates plans", () => {
    const cmd =  AppService.createPlan({rg: "TEST", appService: {name: "TESTAPP", sku: "F1"}})
    assert.strictEqual(cmd, `az appservice plan create -g TEST -n TEST-plan --sku F1 --is-linux  --output none`)
  });
  it("scales apps", () => {
    const cmd =  AppService.scale({rg: "TEST", appService: {name: "TESTAPP", sku: "B1"}})
    assert.strictEqual(cmd, `az appservice plan update -g TEST -n TEST-plan --sku B1`)
  });
});