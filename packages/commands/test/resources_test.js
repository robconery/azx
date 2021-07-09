const assert = require("assert");
const {Resources} = require("../index");

describe('Resource commands', () => {
  it("includes app config", () => {
    const cmd =  Resources.getAppConfig("TESTAPP","TEST")
    assert.strictEqual(cmd, `az webapp config show -n TESTAPP -g TEST`)
  });

  it("and app settings", () => {
    const cmd =  Resources.getAppSettings("TESTAPP","TEST")
    assert.strictEqual(cmd, `az webapp config appSettings list -n TESTAPP -g TEST`)
  });

  it("and a query to pull apps", () => {
    const cmd =  Resources.getApps("TESTAPP","TEST")
    assert.strictEqual(cmd, "az webapp list --query '[].{name:name, group:resourceGroup}'")
  });

  it("creates a group", () => {
    const cmd =  Resources.createGroup({rg: "TEST", region: "westus"})
    assert.strictEqual(cmd, `az group create -n TEST -l westus`)
  });

  it("deletes a group", () => {
    const cmd =  Resources.deleteGroup("TEST")
    assert.strictEqual(cmd, `az group delete -y -n TEST`)
  });
})
