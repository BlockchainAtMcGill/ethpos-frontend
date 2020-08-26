import React from "react";
import * as Icon from "react-feather";
import useRouter from "next/router";


import axios from 'axios';

import { getWeb3 } from '../web3';
import { getContractInstance } from '../contract';
import Header from "../components/head";
import UserNav from "../components/userNav";


const FAU_CONTRACT_ABI = require('../FaucetToken.json');

const HOST = process.env.NEXT_PUBLIC_HOST;
const VENDOR_ADDRESS = process.env.NEXT_PUBLIC_VENDOR_ADDRESS;
var accountAddress;

function ErrorAlert(props) {
  return (
    <div
      className="alert alert-danger d-flex justify-content-center align-items-center"
      style={{ height: "30px" }}>
      Transaction Failed! Please Try Again.
    </div>
  )
}

function ConfirmButton(props) {
  return (
    <button
      type="button"
      className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
      onClick={props.func}>
      Checkout <Icon.ShoppingCart className="ml-2" />
    </button>
  )
}

function LoadingButton(props) {
  return (
    <button
      type="button"
      className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
      disabled>
      <div className="spinner-border mr-2" style={{ width: "20px", height: "20px" }} role="status" aria-hidden="true"></div>
        Pending...
    </button>
  )
}

function SuccessButton(props) {
  return (
    <button
      type="button"
      className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
      disabled>
      Success <Icon.CheckCircle className="ml-2" />
    </button>
  )
}

// Bug throw error to stop flow or nest .then()
// TO DO show address, change default setting metamask on network change
export default class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      transactionHash: "",
      isProcessing: false,
      isSuccessful: false,
      isError: false
    }
    this.paySmartContract = this.paySmartContract.bind(this);
    this.storeTransaction = this.storeTransaction.bind(this);
  }


  completeTransaction() {
    // Call smart contract
    getWeb3()
    .then((web3) => {
      this.paySmartContract(web3);
    })
    .catch(e => { console.error(e) });

  }

  storeTransaction() {
    axios.post(`${HOST}/api/new/`,
      {
        price: this.props.priceETH,
        description: this.props.description,
      }, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log("ERROR HERE: " + error);
      });
  }

  paySmartContract(web3) {

    this.setState({ isProcessing: true });
    let sender = web3.currentProvider.selectedAddress;
    if (this.props.currency == "ETHEREUM") {
      let interactContract = getContractInstance(web3, "Interact");
      interactContract.methods.pay(VENDOR_ADDRESS).send({ from: sender, value: web3.utils.toWei(this.props.priceETH, 'ether') })
      .then((res) => {
        console.log("Payed contract");
        this.setState({
            isError: false,
            isProcessing: false,
            isSuccessful: true,
            transactionHash: res.transactionHash
          });
        this.storeTransaction();
      })
      .catch((err) => {
        this.setState({
            isError: true,
            isProcessing: false,
            isSuccessful: false
          });
      });
      
    } else {
      new web3.eth.Contract(FAU_CONTRACT_ABI, "0xFab46E002BbF0b4509813474841E0716E6730136")
      .then((erc20Contract) => {
        erc20Contract.methods.transfer(VENDOR_ADDRESS, web3.utils.toWei(this.props.priceETH, 'ether'))
        .send({
          from: sender
        })
        .then((res) => {
          this.setState({
              isError: false,
              isProcessing: false,
              isSuccessful: true,
              transactionHash: res.transactionHash
            });
          this.storeTransaction();
        })
        .catch((err) => {
          this.setState({
              isError: true,
              isProcessing: false,
              isSuccessful: false
            });
        });
      })
      .catch((e) => console.log(e)); 
    }
  }

  // use props over state since these variables should not be stateful in this page
  static getInitialProps(props) {
    var details = JSON.parse(props.query.data);
    return {
      rate: details["rate"],
      priceUSD: details["priceUSD"],
      priceETH: details["priceETH"],
      description: details["description"],
      currency: details["currency"]
    };
  }

  async componentDidMount() {
    let web3 = await (getWeb3().catch(e => { console.error(e) }));
    let interactInstance = getContractInstance(web3, "Interact");
    this.setState({
      accountAddress: web3.currentProvider.selectedAddress,
    });
    if (this.props.priceUSD == null || this.props.priceUSD == undefined) {
      useRouter.push('/');
    }
    ethereum.on('accountsChanged', async (accounts) => {
      let amount = await interactInstance.methods.pendingWithdrawals(accounts[0]).call();
      this.setState({
        accountAddress: accounts[0]
      });
    });
  }

  componentWillUnmount() {
    ethereum.removeAllListeners();
  }

  render() {
    // show first 4 and last 4 digits of account address
    accountAddress = this.state.accountAddress;
    accountAddress = accountAddress.substring(0, 6) + "****" +
      accountAddress.substring(accountAddress.length - 4);

    const { isProcessing, isSuccessful, isError } = this.state;

    let button;
    if(isProcessing) button = <LoadingButton />;
    else if(isSuccessful) button = <SuccessButton />;
    else button = <ConfirmButton func={this.completeTransaction.bind(this)} />;

    return (
      <div>
        <Header />
        <main>
          <UserNav />
          <div className="container justify-content-center">
            <div className="text-center font-weight-bold mt-4">
              Transaction Summary
            </div>
            <div className="row justify-content-left ml-1 pl-5 mt-4">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.Key size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-4">Account:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light ml-4">{accountAddress}</div>
              </div>
            </div>
            <div className="row justify-content-left ml-1 pl-5 mt-2">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.Repeat size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-5">Rate:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light ml-4">1 ${this.props.currency} = ${this.props.rate} USD</div>
              </div>
            </div>
            <div className="row justify-content-left ml-1 pl-5 mt-2">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.DollarSign size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-5">Amount:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light">${this.props.priceUSD} USD</div>
              </div>
            </div>
            <div className="row justify-content-left ml-1 pl-5 mt-2">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.DollarSign size="12" strokeWidth="3" color="white" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text-white mr-5">Amount:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light">Ξ {this.props.priceETH} {this.props.currency}</div>
              </div>
            </div>
            <div className="row justify-content-left ml-1 pl-5 mt-2">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.BookOpen size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-3 pr-1">Description:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light">{this.props.description}</div>
              </div>
            </div>
            <hr className="my-4"></hr>
            <form>
              {isError ? <ErrorAlert /> : ""}
              <div className="row mt-4 justify-content-center">
                {button}
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }
}
