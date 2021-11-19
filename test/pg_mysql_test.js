const assert = require("assert");
const {PgMySQL} = require("../lib/commands/");

describe('PG/MySQL commands', () => {
  const settings = {
    rg: "TEST",
    region: "westus",
    database: {
      engine: "postgres",
      sku: "SKU",
      name: "TESTDB"
    }
  }
  it("creates a service for postgres or mysql", () => {
    const cmd = PgMySQL.createService(settings,"user","password");
    assert.strictEqual(cmd, "az postgres server create -g TEST --name TESTDB --admin-user user --admin-password password --sku-name SKU --ssl-enforcement Disabled --location westus --output none")
  });
  it("creates a services firewall rule", () => {
    const cmd = PgMySQL.addFirewallRule(settings,"0.0.0.0");
    assert.strictEqual(cmd, "az postgres server firewall-rule create -g TEST --server TESTDB --name AzureService --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 --output none")
  });

  it("creates a user firewall rule",  () => {
    const cmd = PgMySQL.addFirewallRule(settings,"1.1.1.1");
    assert.strictEqual(cmd, "az postgres server firewall-rule create -g TEST --server TESTDB --name AllowLocalIP --start-ip-address 1.1.1.1 --end-ip-address 1.1.1.1 --output none")
  });
  it("rotates the password",  () => {
    const cmd = PgMySQL.rotate(settings,"newpassword");
    assert.strictEqual(cmd, "az postgres server update -g TEST -n TESTDB --admin-password newpassword")
  });

  it("creates config settings", () => {
    const res = PgMySQL.createConfigSettings(settings,"user","password");
    const expected =[
      `DATABASE_URL=postgres://user%40TESTDB.postgres.database.azure.com:password@TESTDB.postgres.database.azure.com/postgres`,
      `DATABASE_HOST=TESTDB.postgres.database.azure.com`,
      `DATABASE_USER=user@TESTDB.postgres.database.azure.com`,
      `DATABASE_PASSWORD=password`,
      `DATABASE_NAME=postgres`
    ]
    for(let i=0; i < expected.length; i++){
      assert.strictEqual(res[i], expected[i], res[i]);
    }
  });
});