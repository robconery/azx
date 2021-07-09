const assert = require("assert");
const {WebApps} = require("../index");

describe('WebApp Commands', () => {
  const settings = {
    rg: "TEST",
    appService: {
      name: "TESTAPP",
      runtime: "ruby"
    }
  }
  it("will create the service", () => {
    const cmd = WebApps.create(settings);
    assert.strictEqual(cmd, "az webapp create -n TESTAPP -g TEST -p TEST-plan --runtime 'ruby' --deployment-local-git --output none")
  });
  it("restart the service", () => {
    const cmd = WebApps.restart(settings);
    assert.strictEqual(cmd, "az webapp restart -g TEST -n TESTAPP")
  });

  it("create a deployment user", () => {
    const cmd = WebApps.createDeployUser(settings, {user: "user", password: "password"});
    assert.strictEqual(cmd, "az webapp deployment user set --user-name 'user' --password 'password'")
  });
  
  it("writes settings", () => {
    const cmd = WebApps.writeSettings(settings, ["SETTING=TEST"]);
    assert.strictEqual(cmd, "az webapp config appsettings set -n TESTAPP -g TEST --output none --settings SETTING=TEST")
  });
  it("sets up logging", () => {
    const cmd = WebApps.setLogging(settings);
    assert.strictEqual(cmd, "az webapp log config -n TESTAPP -g TEST --application-logging filesystem --web-server-logging filesystem --docker-container-logging filesystem --level information --detailed-error-messages true --output none")
  });
})