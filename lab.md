# Lab

One of the goals of this project is to allow for it to be run in a lab setting. This can be challenging to accomplish if a reliable network set up is not available. This project seeks to be self contained, meaning that local bootnodes are used in a manner similar to DNS. However, in order to locate those bootnodes the IP of the machine running the bootnode software needs to be known. As a result the creators of this project have decided to purchase a router and then set it up ahead of time to ensure that the network setup is consistent throughout the labs.

## Ethereum nodes

This project was developed using Intel Edisons. The Edisons were selected because they are easy to setup, with a known latest firmware package provided. They also have the ability to be battery driven which provides interesting proof-of-concept for IOT scenarios and also could allow the project to be better administered in labs with a limited number of electrical outlets.

## Adding new machines

An Internet connection is required to setup a new hardware machine/node. The term machine is used here to avoid calling them 'nodes' as the project is written in Node.js, and also the Ethereum community uses the term 'Etherum node' for any running set up of an Ethereum client or wallet. There could be confusion on what 'Setting up Node' meant.

## Router specs
This project is being developed and tested using a Linksys AC 1200. However, the only requirements for a router are that it has wireless capabilities, and that it allows for the ability for static / reserved IPs to be set.

### Intel Edisons

This project uses Intel Edison's with Arduino boards.

1. Build the Edison by attaching the chip, and plastic legs. If you would like to use an external indicator to indicate when an Intel has mined/sealed a block then please attach an external LED to PWM (digital) pin 13.

2. Use the provided Intel software to flash the Edison to the latest firmware. Version 201606061707 or newer is required. The creators of this lab encountered a bug where you may need to flash the firmware multiple times to get the firmware to actually install. Try running installer a couple times if it is not working. If you are still having issues please let us know or try the Intel Edison Community forums.

3. Set the name of the Edison. Any name is fine. We would recommend avoid whitespace or special characters.

4. Set password. The password should be '12345678'. This is set as a project-level global config to ensure ease of administration. You can adapt this as needed, but all machines must be set up the same or the projet neeeds to be modified to handle different passwords for different machines.

5. Connect to the router. All machines must connect to the same router. The way to test this is to ensure you can ssh from one machine to another. If you have ssh access you should be set.

6. Set static IPs for your machines. *note: AC 1200 specific* Login to the router administration dashboard board at 192.168.1.1. Go to Connectivity > Local Network > DHCP Reservations. You see all your local machines. Select the machines you want to include as part of the lab and hit the 'Reserve DHCP' button and then 'OK' button. You should now observe that whenever you connect to the network that you receive the same IP address.

7. Use Architect to setup SSH and deploy the Dashboard project. Verify you can ssh into your machine without a password and that you see contents under ~/workspace/dashboard

8. Run startup Geth script. Check the logs of the bootnode server and the eth stats dashboard to ensure your new machine is fully connected to your network.

## Set up

The project is designed to be administered from a laptop running Windows, OS X or linux. The laptop runs the Architect program which deploys the nodes/machines. It also recommended that it runs the bootnode server and the eth stats dashboard. The reason being that if that are issues with the network you can quickly trouble shoot with local access to the logs of these services.

Order of deployment

1. Bootnode
2. Eth stats
3. Grid (or other pre-allocated account)
4. Sealer-1 (or other sealer account)
5. Verify block count is incrementing. Once it reaches 5 or so then you can be confident it is working.
6. Deploy Solar unit contract (or other supported contracts)
7. Deploy remaining machines
 

## Routing alternatives

If you are unable to set up a fixed hardware router you could consider the alternative options for configuring your networking

* Modify project to use Internet-based bootnode(s). The existing Ethereum bootnodes could work in theory, although in practice it was not observed to work within a reliable 60-second window.
* Modify the DNS settings on the Ethereum nodes to allow for fixed IPs
* Setup a zero DNS config system
