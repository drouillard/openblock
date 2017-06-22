# Architect

Command line program to deploy and manage a private network of Ethereum nodes running on Intel Edisons. Inspired by Puppeth.

## Pre-reqs

### This machine (Master Node)

Must have the following installed

* Node.js v6+
* git

### The Edisons

Must be configured

* Have latest firmware installed (at least 201606061707)
* Be accessible to the Master Node via ssh
* Have password set to '12345678'

## The schema

The current machine should be running OSX or Linux. It will act as a bootnode and as the server for the
Eth Stats dashboard.

The Intel Edisons will be configured to run `geth` in mining mode and to run a dashboard

## Set up and run

In the `architect` directory run

Install dependencies (one time)

```
npm install
```

Run Architect

```
sudo node index.js
```

# Set up pm2

Install pm2 globally. It is recommended to run pm2 in a separate terminal

````
npm i -g pm2
````

List process

````
pm2 list
````


# Set up Eth Stats Dashboard

Run the architect and then select the option to start the Eth Stats dashboard. You should be able to then see the dashboard at
http://localhost:3000

# Set up the bootnode

Run the architect and then select the option to start the Eth Stats bootnode.

Then install pm2 globally on your machine and use it examine log

# Deploy the contract

Install truffle

````
cd dashboard/solarunit
npm install -g truffle
````

Inside the solarunit folder you need to deploy contract to network.

````
truffle deploy
````

# FAQs

- Why not puppeth?

Puppeth uses docker and does not reliably run on Intel Edisons or Rapsberry Pis.


## Developing

When testing on local hardware the easiest way is to copy over your files directly using SSH.

scp or rsync can be used to accomplish this.

In project root run the following command. You will be prompted to enter the password of the user you are logging into the remote machine as in order to copy the files over.

```
scp -r ./ <username>@<ip>:<destination>

```
