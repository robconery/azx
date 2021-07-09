## The AZX Scripts

Scripts are bundled executions of commands from the `commands` package. The idea here is that most things get executed from in here (with a few exceptions).

If you want to see some tests for these scripts, see the `../integrations` folder for integration tests. It's difficult to test these things without hitting Azure, which is exactly what the integration tests do. Right now there's only one, but I'll be adding more.