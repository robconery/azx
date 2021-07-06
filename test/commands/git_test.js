const assert = require("assert");
const {Git} = require("../../lib/commands");

describe('Git commands', () => {
  const settings = {
    rg: "TEST",
    appService: {
      name: "TESTAPP"
    }
  }
  it("sets a remote azure url", () => {
    const remoteUrl = Git.buildRemoteUrl(settings, {user: "USER",password: "password"})
    const cmd = Git.setRemoteGit(remoteUrl);
    assert.strictEqual(cmd, "git remote add azure https://USER:password@TESTAPP.scm.azurewebsites.net/TESTAPP.git");
  });
  
  it("removes a remote azure url", () => {
    const cmd = Git.removeGitRemote();
    assert.strictEqual(cmd, "git remote rm azure");
  });
})