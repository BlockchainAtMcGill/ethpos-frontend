> Blockchain at McGill
> Hardware Design Team 2019-2020

## Ethereum and ERC20 Point of Sale Terminal  :iphone:

#### Introduction
The hardware design team initiated by Blockchain at McGill is a multidisciplinary design team consisting of 4 McGill students. The purpose of the team is to create a working prototype of a physical point of sale terminal that will allow vendors to accept Ethereum or ERC-Token quasi-instantaneously.

#### Objectives
As a point of sale terminal, the prototype will be self-contained and powered, allowing it to work in any setting equipped with wireless internet connectivity while incurring neutral operational costs after implementation by dynamically levying fees from transactions to pay for any decentralized computation or smart contract fees. The point of sale terminal will also feature all audit capabilities expected of point of sale terminals and have the capacity to electronically submit receipts of purchase or transaction metrics to client or vendor. Further given the risk-averse nature of the setting, the PoS terminal will enact measures to instantly switch all holdings into low risk assets that can be liquidated at vendor’s will (or automatically at specified trigger). The main design objective is to create a physical device that is easiest and cheapest to manufacture with existing hardware.

#### Team
The team consists of 3 engineers and a project lead, while falling directly under the supervision
of the executive team. More specifically, the team is constituted of the following students:

* Riad el Muriby, B. Eng. Mechanical (Lead)
* Michel Majdalani, B. Eng. Software
* Colton Campbell, B. Arts Computer Science
* Sean Tan, B. Eng. Software

#### Demo
MP4 videos of our prototype can be found in the `demo` folder.

#### Documentation
All project documentation reports can be found in the *Documentation* directory. This includes:

1. Technical Requirement Assessment
2. Conceptual Design Report
3. System Design Report
4. Embodiment Design Report
5. Final Report

## How to use app
1. visit our [production website](https://ethpos-frontend.herokuapp.com/) 
2. login using vendor address: 0x24Ed9F7B74711F8E987E12821cb9FE2b82447B3C and password: testtest123
3. **important** switch network to Rinkeby on MetaMask Chrome Extension
4. allow our website to access Metamask

## Setup to fork
1. Fork this repo
2. in `/client` create file `.env.local` with the following code: 
```
NEXT_PUBLIC_VENDOR_ADDRESS=<your_vendor_public_address>
NEXT_PUBLIC_HOST=https://ethpos-backend.herokuapp.com
NEXT_PUBLIC_RASPBERRY_PI_IP=<raspberry_pi_ip_address>
NEXT_PUBLIC_NETWORK=rinkeby
```
3. run `npm install` in `/client` directory
4. in `/backend` create file `.env` with the following code:
```
SECRET_KEY=(contact us)
POSTGRES_PASSWORD=(contact us) 
```
