import { NETWORK } from './networks'

var Web3 = require('web3'); // required to have the web3 version in package.json

/**
 * Retrieves a Web3 instance by setting the appropriate provider.
 */
async function getWeb3Provider() {
  let web3Provider=null;
  // Modern dapp browsers...
  if (window.ethereum) {
    console.log("Modern dapp browser");
    web3Provider = window.ethereum;
    // Request account access
    await window.ethereum.enable();
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    console.log("Legacy dapp browser");
    web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache or Rinkeby
  else {
    console.log("Fallback configuration");
    if(NETWORK == "ganache"){
      web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    } else { // Rinkeby
      // TODO for some reason I had an issue with adding HDWalletProvider (a warning)
      // TODO this is not working fix later
      web3Provider =  new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/82b3a2900ace4ebd9ccd8bde8099845a`);
    }
  }
  return web3Provider;
}

async function getWeb3() {
  let web3Provider = await getWeb3Provider(NETWORK).catch(e => {console.error(e)});
  if(web3Provider == null) {
    throw 'Web 3 provider is empty';
  }
  web3 = new Web3(web3Provider);
  return web3;
}

function web3Test() {
  getWeb3Provider(NETWORK)
  .then((web3Provider) => {
    if(web3Provider == null) {
      throw 'Web 3 provider is empty';
    }
    web3 = new Web3(web3Provider);
    return web3;
  })
  .catch(e => {
    throw 'Web3 is undefined';
  });

}

module.exports = {
  getWeb3, web3Test
}