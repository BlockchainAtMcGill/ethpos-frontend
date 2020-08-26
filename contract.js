import {NETWORK, NETWORK_IDS} from './networks'

// Get JSON file in the build folder created at compilation time by truffle.
function getContractFile(contractName) {
    var contractJSON = require(`./${contractName}.json`);
    return contractJSON;
}

// Retrieve ABI from contract's JSON
function getContractABI(contractJSON) {
    return contractJSON["abi"];
}

// Retrieve the address of the deployed contract
function getDeployedAddress(contractJSON) { 
    return contractJSON["networks"][`${NETWORK_IDS[NETWORK]}`]["address"];
}

var contractInstance = {};
function getContractInstance(web3, contractName) {
    let contractJSON = getContractFile(contractName);
    if(contractInstance[contractName] === undefined) {
        contractInstance[contractName] = new web3.eth.Contract(getContractABI(contractJSON), getDeployedAddress(contractJSON));
    } 
    return contractInstance[contractName];
}

module.exports= {
    getContractABI, getDeployedAddress, getContractInstance, getContractFile
}