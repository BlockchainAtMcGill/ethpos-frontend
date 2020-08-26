const InteractContract = artifacts.require("Interact");
const BN = require("bn.js");
contract("Interact", () => {
  let interactContract, accounts, vendorAccount, tokenSymbolUSDT, tokenAddressUSDT, tokenSymbolWrong, erc20Contract;
  before(async () => {
    interactContract = await InteractContract.deployed();
    accounts = await web3.eth.getAccounts();
    vendorAccount = accounts[0];
    tokenSymbol = web3.utils.hexToBytes(web3.utils.toHex("FAU"));
    tokenAddress = "0xfab46e002bbf0b4509813474841e0716e6730136";
    tokenSymbolWrong = web3.utils.hexToBytes(web3.utils.toHex("NOPE"));
    const abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "DECIMALS", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "burnFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMinter", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": false, "stateMutability": "nonpayable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
    erc20Contract = new web3.eth.Contract(abi,
      "0xFab46E002BbF0b4509813474841E0716E6730136");

  });
  it("Should deploy smart contract properly", async () => {
    console.log(interactContract.address);
    assert(interactContract.address != "");
  });

  it("Should execute a single transaction to vendor in mapping", async () => {
    const customerAccount = accounts[1];
    await interactContract.pay(vendorAccount, {
      from: customerAccount,
      value: web3.utils.toWei("1", "ether"),
      gas: 2500000
    });
    const vendorBalance = new BN(
      await interactContract.pendingWithdrawals(vendorAccount)
    );
    const correctBalance = new BN(web3.utils.toWei("1", "ether"));
    assert(vendorBalance.eq(correctBalance));
  });

  it("Should not allow vendor to pay their own address", async () => {
    try {
      await interactContract.pay(vendorAccount, {
        from: vendorAccount,
        value: web3.utils.toWei("1", "ether")
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Should withdraw accumulated amount to vendor properly", async () => {
    const balanceInAccountBefore = await web3.eth.getBalance(vendorAccount);
    await interactContract.withdraw({
      from: vendorAccount,
      gas: 2100000
    });
    const balanceInAccountAfter = await web3.eth.getBalance(vendorAccount);
    assert(Number(balanceInAccountAfter) > Number(balanceInAccountBefore));
    assert(!(await Number(interactContract.pendingWithdrawals(vendorAccount))));
  });

  it("Should execute multiple transactions", async () => {
    const customerAcc1 = accounts[1];
    const customerAcc2 = accounts[2];
    const customerAcc3 = accounts[3];
    await interactContract.pay(vendorAccount, {
      from: customerAcc1,
      value: web3.utils.toWei("1", "ether"),
      gas: 2500000
    });
    await interactContract.pay(vendorAccount, {
      from: customerAcc2,
      value: web3.utils.toWei("1", "ether"),
      gas: 2500000
    });
    await interactContract.pay(vendorAccount, {
      from: customerAcc3,
      value: web3.utils.toWei("1", "ether"),
      gas: 2500000
    });
    const vendorBalance = new BN(
      await interactContract.pendingWithdrawals(vendorAccount)
    );
    const correctBalance = new BN(web3.utils.toWei("3", "ether"));
    assert(vendorBalance.eq(correctBalance));
  });

  it("Should only allow vendors to withdraw", async () => {
    try {
      await interactContract.withdraw({
        from: accounts[1],
        gas: 2100000
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
