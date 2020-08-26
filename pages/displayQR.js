import React from "react";
import useRouter from 'next/router';

import Header from "../components/head";
import SecondaryNav from "../components/secondaryNav";
import { rate, priceUSD, priceETH, description, currency } from ".";
import { getWeb3 } from '../web3';
import { getContractInstance } from '../contract';
import Link from "next/link";
import PrintTestReceipt from "./printTestReceipt";

const FAU_CONTRACT_ABI = require('../FaucetToken.json');

class WaitingButton extends React.Component {
  constructor(props) {
    super(props);
  }

  returnHome() {
    useRouter.push('/');
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-success d-inline mr-2"
          disabled>
          <div className="spinner-border mr-2" style={{ width: "20px", height: "20px" }} role="status" aria-hidden="true"></div>
              Waiting for customer...
          </button>
        <button
          type="button"
          className="btn btn-danger d-inline"
          onClick={this.returnHome.bind(this)}>
          Cancel
            </button>
      </div>
    )
  }

}

class CompleteButton extends React.Component {
  constructor(props) {
    super(props);
  }

  returnHome() {
    useRouter.push('/');
  }

  render() {
    return (
      <button
        type="button"
        className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
        onClick={this.returnHome.bind(this)}
      >
        Success! Click to start new transaction.
      </button>
    )
  }

}

function ReceiptButton(props) {

  function printReceipt() {
    useRouter.push(`/printTestReceipt?description=${props.description}&value=${props.value}&transactionHash=${props.transactionHash}`);
  }
  return (
      <button className="btn btn-primary" onClick={printReceipt}>
        Print receipt
      </button>
  )
}

export default class DisplayQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComplete: false,
      isError: false,
      transactionHash: ''
    }
  }

  async componentDidMount() {
    let web3 = await (getWeb3().catch(e => { console.error(e) }));
    let interactInstance = getContractInstance(web3, "Interact");
    let faucetInstance = await new web3.eth.Contract(FAU_CONTRACT_ABI, "0xFab46E002BbF0b4509813474841E0716E6730136");
    let complete;
    if (currency == "ETHEREUM") {
      complete = interactInstance.events.txCompleted((err, res) => {
        if (!err) {
          console.log(res);
          this.setState({ isComplete: true, transactionHash: res.transactionHash });
        } else {
          console.error(err);
          this.setState({ isError: true });
        }
      });
    } else {
      complete = faucetInstance.events.Transfer((err, res) => {
        if (!err) {
          console.log(res);
          this.setState({ isComplete: true });
        } else {
          console.error(err);
          this.setState({ isError: true });
        }
      });
    }

  }

  render() {

    let data = {
      rate: rate,
      priceETH: priceETH,
      priceUSD: priceUSD,
      description: description,
      currency: currency
    };
    const qrAPI = "https://api.qrserver.com/v1/create-qr-code/?data=";	
    let userPage = `https://metamask.app.link/dapp/ethpos-frontend.herokuapp.com/userPage?data=${JSON.stringify(data)}`;

    let qrImageSrc = qrAPI.concat(userPage);

    const receiptButton = (this.state.isComplete)? <ReceiptButton description={data.description} value={data.priceETH} transactionHash={this.state.transactionHash}/>: null;
    return (
      <div>
        <Header />
        <main>
          <SecondaryNav />
          <div className="container justify-content-center">
            <div className="text-center font-weight-bold mt-1">
              Please scan this code in the Metamask Mobile App
            </div>
            <div
              className="container mt-2 d-flex justify-content-center"
              style={{ width: 190, height: "auto" }}>
             <img className="img-fluid" src={qrImageSrc} />
            </div>
            <div className="row mt-3 justify-content-center">
              {this.state.isComplete ? <CompleteButton /> : <WaitingButton />}
            </div>
            <div className="row mt-3 justify-content-center">
              {receiptButton}
            </div>
          </div>
        </main>
      </div>
    );
  }
}
