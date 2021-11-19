const assert = require("assert");
const {Cosmos} = require("../lib/commands/");

describe('Cosmos DB commands', () => {
  const settings = {
    rg: "TEST",
    database: {
      name: "TESTDB"
    }
  }
  it("pulls the keys", () => {
    const cmd =  Cosmos.getKeysList(settings)
    assert.strictEqual(cmd, `az cosmosdb keys list -n TESTDB -g TEST --output json`)
  });
  it("creates free tier using Mongo", async () => {
    const cmd =  Cosmos.createFreeTierService(settings, "127.0.0.1")
    assert.strictEqual(cmd, `az cosmosdb create -n TESTDB --enable-free-tier true --ip-range-filter 0.0.0.0,127.0.0.1 -g TEST --kind MongoDB`)
  });
  it("creates regular tier using Mongo", async () => {
    const cmd =  Cosmos.createService(settings, "127.0.0.1") 
    assert.strictEqual(cmd, `az cosmosdb create -n TESTDB --ip-range-filter 0.0.0.0,127.0.0.1 -g TEST --kind MongoDB`)
  });
  it("builds a proper connection string", async () => {
    const cmd =  Cosmos.buildConnectionString(settings, "KEY") 
    assert.strictEqual(cmd, `mongodb://TESTDB:KEY@TESTDB.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=TESTDB@`)
  });
})