# Azure Project: Making WebApps on Azure a Little Easier
AZX is a little wrapper for the Azure CLI that allows you to work with Azure in a "local project" sense. You generate some settings and secrets in a local directory and scripts are built on top of it. 
The goal is to bring Azure into your project, offering storage of simple settings and secrets locally. In the past, there were upwards of 20 separate commands that you needed to use with the Azure CLI just to get a web app up and running (or 30-ish clicks in the portal). Yes, there’s `az webapp up` but that simply zips up your local project. 
AZX can do a whole lot more. Let’s see.

## Setting up

This is a CLI project and is designed to be installed globally:

    npm install -g azure-project

This will add `azx` to your PATH. If you want, you can install wherever you like (even inside your project) and work with the CLI by using an alias:

    alias azx="node .node_modules/azure-project/bin/azx.js"

Both ways will operate the same.

## Getting Started

Once installed, AZX will try to be helpful at every step. Just use `azx` on the command line and you’ll see the commands available to you and a tip on how to get started:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625778811311_shot_1101.png)


The first step is to create a “project”, which is also known as a *Resource Group* within Azure. This is a place where all your Azure stuff lives:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625778950458_shot_1103.jpg)


A few things to note:

- The project name was created for you using a “Heroku-y” naming convention. You can override this if you like
- A resource group was created using the **Azure CLI, which must be installed** on your local machine with you authenticated
- A `.azure` directory was created locally, with a `settings.json` file and a `.gitignore`
- A location was set by default. Currently that’s `westus` but you can override this if you want. I’m hoping to be able to use the subscription default, but that’ll be in the future.

The `.azure` directory is your door into Azure. Stepping in there will allow you to do all kinds of things, which we’ll see in a second.

## A Note on Naming Things

A major goal of mine with this project is to reduce the cognitive load required to get up and running on Azure. To that end, I wanted to reduce the need to name things. For instance, you can go "full Heroku" style with AZX and let it name your project for you (`quiet-dust-16` is the project name below). Everything you create, from that point on, will use this as the basis of naming things.

For instance:

 - Your App Service plan will be called `quiet-dust-16-plan`
 - Your Web App will be called `quiet-dust-16-app`
 - You DB will be called `quiet-dust-16-db`

You might have other naming needs, and if so, let me know. For now, enjoy the ride...

## Creating a Web App

Now that we’ve initialized the project, we can do some new things. What things? You can ask AZX:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625779241803_shot_1104.jpg)


We have a new set of commands now, including `destroy` and `app`. We’ll cover `destroy` later on. Notice that we also have a tip for what to do next. Let’s ask for help with `app`, just so we know what’s going on:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625779367469_shot_1106.jpg)


There’s only one option here, which is to create our application. As of now, the only runtime choices available are node, python, ruby or dotnet. I’ll add more later on.
Let’s use `azx app create python`, since the project I’m working with here is a Django app:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625779438569_shot_1105.jpg)


Using the settings in the `.azure` folder (which has a default location and resource group name), AZX is able to create all of the resources your app will need, including:

- The App Service Plan, which is basically a VM. The default is a Linux F1 (free tier) and, if that’s not possible, AZX will fall back to B1
- Your web application, using the runtime you specified
- Local Git deployment is set by default. This can easily be changed later on to use GitHub or whatever
- Logging is enabled and setup by default, which it currently isn’t for new web applications
- Deployment credentials are created for you using conventional naming and a GUID for a password. These credentials are stored in your local Git repo as an `azure` remote.
- The deployment credentials are also saved in your web application configuration so you can retrieve them later on (We’ll see this later on)

As you can see, the final bit of output there is a tip on what to do next.

## Creating a Database

Creating a database in Azure currently takes 5 different CLI commands, with AZX that’s down to only 1 *and* a few niceties are done for you along the way.
Let’s take a look at the `azx` command now:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625779962951_shot_1107.jpg)


Now that we have a web application, we can create a database. This only shows up (currently) if there’s a web application already created.
Let’s take a look at the `db` command:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625780061043_shot_1108.jpg)


Pretty sparse, and this is by design. It’s easy to get overwhelmed with CLI commands and one of my goals with this project is to keep you from getting overwhelmed! 
Let’s create a PostgreSQL database using `azx db create postgres`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625780147819_shot_1109.jpg)


Once again, quite a few things going on here, namely:

- The PostgreSQL server is created for you with a conventional name (more on that in a minute). It takes about 5 minutes for this to work, so you’re told that
- Firewall rules were created for you, making sure your app can see the database (the 0.0.0.0 rule) as well as your local machine via remote IP lookup
- **Credentials were created for you** and stored in `.azure/.env`. In addition, these credentials were saved to your web application’s configuration using conventional naming (`DATABASE_URL`, for example)
- The SKU used to create the database is the cheapest one (B_Gen5_1) and you can change it at any time

The best part? In only 5 minutes time I can immediately login using `psql`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625780442066_shot_1111.jpg)


You will, of course, need your database client to connect which is either `psql`, `mysql` or `mongo`.

## Cosmos DB

A quick aside: if you chose `mongo` as your database, a free-tier Cosmos DB will be created for you using the MongoDB client. In the limited testing I’ve done, the Mongo client for Cosmos is the most capable I’ve seen. You can connect to Cosmos from the command line in the exact same way, using `azx db connect`, which will pipe out to the MongoDB client using the Cosmos DB connection string stored in `.azure/.env`.

## Storing Secrets

At this point you might be wondering about storing secrets. AZX stores them in two places: `.azure/.env` and in your web application configuration. To be extra safe, a .gitignore file is created for you inside of `.azure` to ensure the `.env` file isn’t committed to source. It’s perfectly safe to commit the `settings.json` file (and you should!).

## Adding Our App Data

Now that we have a database we need to be sure our initial schema and seed data is added. You can do this in a number of ways with Django (or Rails or whatever), but the simplest is usually just pushing a SQL file to your database client. AZX makes this a little easier with `azx db connect` - just redirect a SQL file to it and off you go.
My project’s data is stored in `tailwind.sql`, so I can use `azx db connect < tailwind.sql`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625780899686_shot_1113.jpg)


This takes a minute or so, but once it’s done we’re ready to deploy.

## Deployment

When we set up the web application, we also setup deployment credentials and stored them in the local Git repository using the `azure` remote. You can see this if you `git remote -v`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625781018321_shot_1114.jpg)


That means that all we need to do now is `git push azure master` (or main):

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625781057488_shot_1115.jpg)


This pushes our web application up to Azure, where it’s built using Oryx. This takes a few minutes to happen but when it’s done we can use `azx app open` to see it:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625782433583_shot_1116.jpg)


Boom! We’re up! Sort of… looks like we have an issue here. I’ll address that in just a second.
End to end this process takes around 10 minutes, which is comparable to other services like Heroku. We have an app that we can easily scale when we need to and tweak as time goes on, using the regular Azure CLI.

## Debugging Things

It’s no fun when things work locally but not in the cloud. To that end, AZX tries to help as much as possible. The first being **logging,** all of it is happily turned on so we should be able to trouble shoot by using `azx app logs`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625782563572_shot_1117.jpg)


Just that quickly I’m connected to the log stream of my live, running application. I can scroll down here and see the deployment logs *as well as* the runtime logs of my app. Looking over these logs I can see that my STATIC_ROOT isn’t setup right. 
To fix this, I’ll need to update my application settings. First, let’s see what they are using `azx app get_settings`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625782738974_shot_1118.jpg)


Looking through here I can see that there is no setting for my static assets. Let’s change that! For this, all I need to do is edit my local `.azure/.env` file:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625782865518_shot_1119.jpg)


*Note: I don’t know if this is how you fix the Django static thing, I’m not a Django person…*
Now that I’ve updated this file, I can send it up to Azure using `azx app write_settings`:

![](https://paper-attachments.dropbox.com/s_2E074877230B11468CA25CAFCD3D04D412B587AE318C658F4F1F4BD7E66F6EC2_1625782928957_shot_1120.jpg)


We’ll pretend that fixed the problem…

## Extra Goodies

There are a few extra commands in AZX to help you out as you get up and running on Azure:

- `azx db rotatepw` will, as the name suggests, rotate your database password to a new GUID and then also update your local `.env` as well as your web application
- `azx lookup skus | dbskus` when you need to scale your app (or db) you’ll want to know which skus to use. These lists are helpful, but you should be sure to check pricing on the portal
- `azx app | db scale`. When you start working with Azure, it makes sense to start with the cheapest SKU possible which is often just free. When you need to go live you’ll want to scale your App Service and this command makes it easy.

There’s more on the way, but I wanted to stop here and see if this project was interesting to people.

## Wanna Help?

I always like help and hopefully if you fork this project you’ll see how the commands, tests and scripts are put together. What’s most important is an *integration* test, to ensure that things actually work on Azure. Those are kept in `test/integrations/`

