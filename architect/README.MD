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

In this directory run

Install dependencies (one time)

```
npm install
```

Run Architect

```
npm start
```




# FAQs

- Where can I find instructions on how to run Architect?

While insider Architect enter '99' for instructions

- Why not puppeth?

Puppeth uses docker and does not reliably run on Intel Edisons or Rapsberry Pis.
