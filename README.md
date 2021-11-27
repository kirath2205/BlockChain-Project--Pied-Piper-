# Pied Piper (Blockchain Technology project)
This is a decentralized application to launch Governance Tokens for Acentrik (by Daimler) to grant voting rights to Investors in the ICO.

This project was developed with [React js](https://github.com/facebook/create-react-app) and [truffle](https://trufflesuite.com/). It is assumed that the unix/macOS machine this project runs on already has node installed.

## Installation and setup
#### Truffle

To install and run the truffle ethereum blockchain, run the following command -

Install truffle dependencies globally
```sh
npm install -g truffle
```

To deploy the contracts to the blockchain, run the following commands in main project directory
```sh
truffle develop
compile
migrate --reset
deploy
```

This starts the blockchain locally and deploys all the contracts using the first account listed in the terminal.

Take the private keys provided by truffle (in the terminal after "truffle develop") and import all accounts in the metamask wallet. The keys we used are as follows -

Private Keys:
- (0) Driver - 89f673791a8999eb15806d865f37438b702858f40c622df947acac80e5f040df
- (1) Company B - 94255eef3ccdb21e867557dfa3be97aa8b0b9c3824cec3a8e8b80cc66dc862ca
- (2) Company C - ec04efabd95afe4c4fff13aa110a54509b45b609bb43fb13d95be7c118df67fd
- (3) User 1 - ec5ce02a48cfc102ba3c5a14c9e6f52f6623fcc7674bafcc939e0e5b49799a79
- (4) User 2 - 2bd510b95581bc1f06d776403db4f53b304d64dfe006b2c4980dc45e3fe72909
- (5) Partner - 59c6ec0d4ab52923acdd4d11a9f6910bb53349e608d52c089a9da8494cf820c2

These keys might be different when you deploy on your local machine, so check the private keys under the truffle console before further testing.
Additionally, the council member addresses (Driver and all companies) have been decided apriori, as a result had to be hardcoded in the application. In case your addresses are different, go to file `client/src/components/screens/SetCouncilMembers.js` line 185, 201 to set your own addresses for comanies B, C and partner respectively.

#### React

To run the frontend React server you need to complete the following steps -

Install node dependencies (navigate to the frontend directory and install all node dependencies)
```sh
cd 'client'
npm install
```

Then to start the frontend server at [http://localhost:3000/](http://localhost:3000/) run the following command at the same 'client' directory (the port may differ if you have another application already open at port 3000).
```sh
npm start
```
After starting the react app, open the website and navigate to the page [http://localhost:3000/set-council-members](http://localhost:3000/set-council-members) to initialize contract addresses and set the council members. Click on the `Initialize contracts` button (have to pay gas fee 5 times, as we are sending the request for 5 different contracts). After this, click on the `Set members` button (pay gas 3 times, as 3 different companies) to initialize the council member accounts.

Now you are good to go. Change your metamask account as per requirement, register the account, login and test all the features as presented in the video demonstration.

## About the project

This project has been developed for the CZ4153 (Blockchain Technology) course 2021. It was designed in association with Daimler (Acentrik).

Features :

- Anyone in the community can propose an idea by submitting a form with some metadata fields (Title, Description).
- Display board which lists all the ideas from the community.
- Governance token holders have ability to vote for the ideas. They can vote any number of time from 1 -> total number of tokens they hold (e.g., Company X with 10 Governance tokens can vote either 1,2, …, 10)
- Council members review the ideas and can approve or reject the ideas. Council members are Company A, B and C – the Driver and the main Investors, but may not be the Partners. 
- Owner(s) of approved ideas will be incentivized with 100 Governance tokens as a reward.
- Minting of new governance tokens requires approval from all council members `(multi-sig mechanism)`.
- [Gnosis-safe] like multi-signature approach to transfer tokens to partner companies.
- All transactions related to voting and approval of ideas are stored on-chain.
- Separate login dashboard for platform users and council members.

## Tech

Pied Piper uses a number of open source projects to work properly:

- [ReactJS] - javaScript framework for front-end design
- [Truffle-unbox] - python based back-end framework

[//]: # 

   [ReactJS]: <https://github.com/facebook/create-react-app>
   [Truffle-unbox]: <https://www.trufflesuite.com/boxes/react>
   [Gnosis-safe]: <https://gnosis-safe.io/>
