const Settings = require("../index");
const _ = require("lodash");
const assert = require("assert");

describe('Settings', () => {
  it("will create the settings directory, .env and .gitignore", () => {
    const created = Settings.ensureSettings();
    assert(created)
  });
  it("has the local path as the ENV path", () => {
    assert(Settings.envPath.includes(".azure/.env"))
  });
  it("will save settings to the local project", () => {
    const settings = {rg: "TEST"}
    const saved = Settings.save(settings)
    assert(saved.success)
  });
  it("loads up the saved bits", () => {
    const settings = Settings.get();
    assert.strictEqual(settings.rg, "TEST")
  });
  it("saves an ENV file with secrets", () => {
    const res = Settings.setENV("TEST=TEST")
    assert(res)
  });
  it("pulls the ENV file out as an object", () => {
    const env = Settings.getENV();
    assert.strictEqual(env.TEST, "TEST")
  });
  it("will save an object to .env too", () => {
    const env = {TEST: "TEST AGAIN"}
    assert(Settings.objectToEnv(env))
  });
  it("will delete the .azure directory", () => {
    const deleted = Settings.delete();
    assert(deleted)
  });
})
