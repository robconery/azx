# What This Is

Dotaz is a little wrapper for the Azure CLI that allows you to work with Azure in a "local project" sense. You generate some settings in a dot file and scripts are built on top of it.
 
## Setting up

This can work globally or locally. For development, the easiest thing to do is drop this code somewhere easy to get to on your drive, maybe your home directory.

Then, in your project, add this to your .env:

`alias dotaz="node ./bin/dotaz.js"`

You can, of course, alias the command as you need. The project is setup to run as a global binary.

## What's Going On Here?

This is a code-generation library, at its heart. There's a templates directory that uses a simple front-matter approach to build the commands that the node Commander project needs. If you scroll through, you can see how things (hopefully) go together.

Every command corresponds to a file name. So `app_create.sh` translates to `app:create`. You can alse specify that a command only shows when the settings contain a specific setting.

For instance, the database "stuff" requires the presence of a database setting.

There are also ways to specify options using `options` or `required`. I realize, by the way, that term "required option" is an oxymoron.
